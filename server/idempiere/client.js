import { IDEMPIERE_BASE_URL } from '../config.js';
import { authenticate, invalidateAuthToken } from './auth.js';

/**
 * Escaped einen Wert für die Verwendung in OData $filter-Strings.
 * Verhindert OData-Injection durch Verdopplung von Einzelanführungszeichen.
 */
export function odataSafe(val) {
  return String(val).replace(/'/g, "''");
}

/**
 * Zentraler HTTP-Client für iDempiere API-Calls
 * - Authentifiziert automatisch
 * - Injiziert Bearer Token in header
 * - Invalidiert Token bei 401 Fehler
 */
export async function idempiereFetch(path, options = {}) {
  // Hole aktuellen Token (oder authentifiziere)
  const token = await authenticate();
  
  // Baue Header mit Authorization
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  // Request ausführen
  const res = await fetch(`${IDEMPIERE_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 401 = Token abgelaufen → invalidieren für Neuauth beim nächsten Mal
  if (res.status === 401) {
    invalidateAuthToken();
  }

  return res;
}
