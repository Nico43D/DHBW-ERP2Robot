import rateLimit from 'express-rate-limit';
import { logUnauthorizedAccess } from '../services/auditService.js';

/**
 * Rate Limiter für Login-Versuche
 * Max 5 Versuche pro 15 Minuten pro IP
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 5, // Max 5 Requests
  message: {
    message: 'Zu viele Login-Versuche, bitte versuchen Sie es später erneut.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests (only count failed logins)
  skipSuccessfulRequests: true,
});

/**
 * Rate Limiter für API-Anfragen (allgemein)
 * Max 100 Requests pro 15 Minuten pro IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Max 100 Requests
  message: {
    message: 'Zu viele Anfragen, bitte versuchen Sie es später erneut.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate Limiter für Order-Erstellung
 * Max 10 Bestellungen pro Stunde pro User
 * WICHTIG: Muss NACH requireAuth aufgerufen werden, damit req.user verfügbar ist
 */
export const orderRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  max: 10, // Max 10 Orders
  message: {
    message: 'Zu viele Bestellungen, bitte versuchen Sie es später erneut.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Key generator: use user ID (req.user wird von requireAuth gesetzt)
  keyGenerator: (req, res) => {
    // req.user sollte durch requireAuth immer gesetzt sein
    if (req.user && req.user.userId) {
      return `user:${req.user.userId}`;
    }
    // Fallback sollte nie erreicht werden da requireAuth vorher kommt
    // Aber für Sicherheit: verwende einen Default-Key
    return 'anonymous';
  },
});

/**
 * Authorization Middleware: Prüft ob User bestimmte Aktion ausführen darf
 */
export function authorize(requiredPermissions = {}) {
  return async (req, res, next) => {
    try {
      // User muss authentifiziert sein
      if (!req.user) {
        return res.status(401).json({ message: 'Authentifizierung erforderlich' });
      }

      const { userId, email } = req.user;
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'unknown';

      // Beispiel-Checks (können erweitert werden)

      // Check 1: Bestimmte Aktionen nur für bestimmte User-Typen
      if (requiredPermissions.customerType) {
        // Hier müssten wir User-Details aus DB laden
        // Für jetzt: Skip (kann bei Bedarf erweitert werden)
      }

      // Check 2: Resource-spezifische Checks
      if (requiredPermissions.checkResourceOwnership) {
        // Prüfe ob User auf eigene Ressourcen zugreift
        const resourceId = req.params.id || req.body.id;

        // TODO: Implementiere Resource-Ownership-Check
        // z.B. prüfen ob Order dem User gehört
      }

      // Alle Checks bestanden
      next();

    } catch (error) {
      console.error('Authorization error:', error);

      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'unknown';

      logUnauthorizedAccess(
        req.user?.userId || null,
        req.user?.email || null,
        req.method,
        req.path,
        ip,
        userAgent,
        error.message
      );

      res.status(500).json({ message: 'Authorization check failed' });
    }
  };
}

/**
 * Helper: Extract IP aus Request
 */
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection.remoteAddress ||
    req.ip
  );
}

/**
 * Helper: Extract User-Agent aus Request
 */
export function getClientUserAgent(req) {
  return req.get('user-agent') || 'unknown';
}
