import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateUser, getBusinessPartnerById } from '../services/authService.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';
import { loginRateLimiter } from '../middleware/security.js';
import {
  logLoginSuccess,
  logLoginFailure,
  logLogout,
} from '../services/auditService.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login mit Email und Passwort über iDempiere
 * Setzt httpOnly Cookie mit JWT bei Erfolg
 * Inkl. Rate Limiting (max 5 Versuche pro 15 Min)
 */
router.post('/auth/login', loginRateLimiter, async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent') || 'unknown';

  try {
    const { email, password } = req.body;

    // Validierung
    if (!email || !password) {
      logLoginFailure(email, ip, userAgent, 'missing_credentials');
      return res.status(400).json({
        message: 'Email und Passwort sind erforderlich'
      });
    }

    // Authentifizierung über iDempiere
    const user = await authenticateUser(email, password);

    if (!user) {
      logLoginFailure(email, ip, userAgent, 'invalid_credentials');
      return res.status(401).json({
        message: 'Ungültige Email oder Passwort'
      });
    }

    // JWT erstellen mit BusinessPartner-ID
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        businessPartnerId: user.businessPartnerId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Cookie setzen (httpOnly, secure: false da noch kein HTTPS)
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false, // TODO: auf true setzen wenn HTTPS aktiv
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage in Millisekunden
    });

    // Audit Log
    logLoginSuccess(user.id, user.email, ip, userAgent);

    // User-Daten zurückgeben (ohne sensitive Daten)
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        customerType: user.customerType,
        company: user.company,
        billingAddress: user.billingAddress,
        deliveryAddress: user.deliveryAddress,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    logLoginFailure(req.body.email, ip, userAgent, 'server_error');
    res.status(500).json({
      message: 'Serverfehler bei der Anmeldung'
    });
  }
});

/**
 * POST /api/auth/logout
 * Löscht das auth Cookie
 */
router.post('/auth/logout', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent') || 'unknown';

  // Versuche User aus JWT zu extrahieren (wenn vorhanden)
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      logLogout(decoded.userId, decoded.email, ip, userAgent);
    }
  } catch (error) {
    // Token ungültig/abgelaufen - ignorieren
  }

  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Erfolgreich abgemeldet' });
});

/**
 * GET /api/auth/me
 * Gibt aktuelle User-Daten zurück basierend auf JWT Cookie
 * Wird verwendet um Session zu validieren nach Seitenneuladung
 */
router.get('/auth/me', async (req, res) => {
  try {
    // JWT aus Cookie extrahieren
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: 'Nicht authentifiziert' });
    }

    // Token verifizieren
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // Token ungültig oder abgelaufen
      res.clearCookie('auth_token');
      return res.status(401).json({ message: 'Session abgelaufen' });
    }

    // BusinessPartner-Daten laden
    const user = await getBusinessPartnerById(decoded.businessPartnerId);

    if (!user) {
      res.clearCookie('auth_token');
      return res.status(401).json({ message: 'User nicht gefunden' });
    }

    // User-Daten zurückgeben
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        customerType: user.customerType,
        company: user.company,
        billingAddress: user.billingAddress,
        deliveryAddress: user.deliveryAddress,
      },
    });

  } catch (error) {
    console.error('Auth/me error:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

/**
 * Middleware: Authentifizierung prüfen für geschützte Routen
 * Fügt req.user hinzu wenn authentifiziert
 */
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: 'Authentifizierung erforderlich' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    res.clearCookie('auth_token');
    return res.status(401).json({ message: 'Ungültige oder abgelaufene Session' });
  }
}

export default router;
