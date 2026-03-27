import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Audit Log Verzeichnis
const AUDIT_LOG_DIR = path.join(__dirname, '..', 'logs');
const AUDIT_LOG_FILE = path.join(AUDIT_LOG_DIR, 'audit.log');

// Erstelle logs Verzeichnis wenn es nicht existiert
if (!fs.existsSync(AUDIT_LOG_DIR)) {
  fs.mkdirSync(AUDIT_LOG_DIR, { recursive: true });
}

/**
 * Audit Log Entry Format:
 * {
 *   timestamp: ISO String,
 *   userId: string | null,
 *   email: string | null,
 *   action: string,
 *   resource: string,
 *   details: object,
 *   ip: string,
 *   userAgent: string,
 *   success: boolean
 * }
 */

/**
 * Schreibt einen Audit-Log-Eintrag
 */
export function logAudit(entry) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...entry,
  };

  // Log in Konsole (für Development)
  console.log('[AUDIT]', JSON.stringify(logEntry));

  // Log in Datei (für Production)
  try {
    fs.appendFileSync(
      AUDIT_LOG_FILE,
      JSON.stringify(logEntry) + '\n',
      'utf8'
    );
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

/**
 * Helper: Erstellt Audit-Log für erfolgreichen Login
 */
export function logLoginSuccess(userId, email, ip, userAgent) {
  logAudit({
    userId,
    email,
    action: 'LOGIN',
    resource: 'auth',
    details: { method: 'email_password' },
    ip,
    userAgent,
    success: true,
  });
}

/**
 * Helper: Erstellt Audit-Log für fehlgeschlagenen Login
 */
export function logLoginFailure(email, ip, userAgent, reason) {
  logAudit({
    userId: null,
    email,
    action: 'LOGIN_FAILED',
    resource: 'auth',
    details: { reason },
    ip,
    userAgent,
    success: false,
  });
}

/**
 * Helper: Erstellt Audit-Log für Logout
 */
export function logLogout(userId, email, ip, userAgent) {
  logAudit({
    userId,
    email,
    action: 'LOGOUT',
    resource: 'auth',
    details: {},
    ip,
    userAgent,
    success: true,
  });
}

/**
 * Helper: Erstellt Audit-Log für Order-Erstellung
 */
export function logOrderCreation(userId, email, orderId, orderTotal, ip, userAgent) {
  logAudit({
    userId,
    email,
    action: 'CREATE_ORDER',
    resource: 'orders',
    details: {
      orderId,
      total: orderTotal,
    },
    ip,
    userAgent,
    success: true,
  });
}

/**
 * Helper: Erstellt Audit-Log für fehlgeschlagene Order-Erstellung
 */
export function logOrderCreationFailure(userId, email, reason, ip, userAgent) {
  logAudit({
    userId,
    email,
    action: 'CREATE_ORDER_FAILED',
    resource: 'orders',
    details: { reason },
    ip,
    userAgent,
    success: false,
  });
}

/**
 * Helper: Erstellt Audit-Log für Katalog-Zugriff
 */
export function logCatalogAccess(userId, email, ip, userAgent) {
  logAudit({
    userId,
    email,
    action: 'VIEW_CATALOG',
    resource: 'catalog',
    details: {},
    ip,
    userAgent,
    success: true,
  });
}

/**
 * Helper: Erstellt Audit-Log für unautorisierten Zugriff
 */
export function logUnauthorizedAccess(userId, email, action, resource, ip, userAgent, reason) {
  logAudit({
    userId,
    email,
    action: 'UNAUTHORIZED_ACCESS',
    resource,
    details: {
      attemptedAction: action,
      reason,
    },
    ip,
    userAgent,
    success: false,
  });
}
