import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateUser, getBusinessPartnerById } from '../services/authService.js';
import { registerUser } from '../services/registrationService.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';
import { loginRateLimiter } from '../middleware/security.js';
import {
  logLoginSuccess,
  logLoginFailure,
  logLogout,
  logRegistration,
  logRegistrationFailure,
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

    // JWT erstellen mit BusinessPartner-ID, Location-ID und Contact-ID
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        businessPartnerId: user.businessPartnerId,
        bpLocationId: user.bpLocationId,
        contactId: user.contactId
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
 * POST /api/auth/register
 * Registrierung eines neuen Users
 * Erstellt BusinessPartner, Location, Contact und weist Rolle zu
 */
router.post('/auth/register', loginRateLimiter, async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent') || 'unknown';

  try {
    const registerData = req.body;

    // Validierung
    if (!registerData.email || !registerData.password) {
      logRegistrationFailure(registerData.email, ip, userAgent, 'missing_credentials');
      return res.status(400).json({
        message: 'Email und Passwort sind erforderlich'
      });
    }

    if (!registerData.firstName || !registerData.lastName) {
      logRegistrationFailure(registerData.email, ip, userAgent, 'missing_name');
      return res.status(400).json({
        message: 'Vor- und Nachname sind erforderlich'
      });
    }

    if (!registerData.billingAddress) {
      logRegistrationFailure(registerData.email, ip, userAgent, 'missing_address');
      return res.status(400).json({
        message: 'Rechnungsadresse ist erforderlich'
      });
    }

    // Registrierung durchführen
    const result = await registerUser(registerData);

    if (result.error) {
      logRegistrationFailure(registerData.email, ip, userAgent, result.error);

      // Spezifische Fehlercodes
      if (result.error === 'EMAIL_EXISTS') {
        return res.status(409).json({ message: result.message });
      }
      return res.status(400).json({ message: result.message });
    }

    const user = result.user;

    // JWT erstellen (User ist nach Registrierung eingeloggt)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        businessPartnerId: user.businessPartnerId,
        bpLocationId: user.bpLocationId,
        contactId: user.contactId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Cookie setzen
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Audit Log
    logRegistration(user.id, user.email, ip, userAgent);

    // User-Daten zurückgeben
    res.status(201).json({
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
    console.error('Registration error:', error);
    logRegistrationFailure(req.body?.email, ip, userAgent, 'server_error');
    res.status(500).json({
      message: 'Serverfehler bei der Registrierung'
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
