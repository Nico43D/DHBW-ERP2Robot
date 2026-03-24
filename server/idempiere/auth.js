import { AUTH_CONFIG, IDEMPIERE_BASE_URL, TOKEN_TTL_MS } from '../config.js';

// Token-Cache mit Ablaufzeit
let authToken = null;
let authTokenTime = 0;

/**
 * iDempiere zwei-stufiger Login:
 * 1. POST /auth/tokens mit User/Passwort → erhalten Temp-Token
 * 2. PUT /auth/tokens mit Temp-Token + Kontext (Client, Rolle, Org) → erhalten Final-Token
 * Token wird bis zu TOKEN_TTL_MS gecacht, danach wird Reauth ausgelöst
 */
export async function authenticate() {
  // Prüfen ob Token noch gültig ist
  if (authToken && Date.now() - authTokenTime < TOKEN_TTL_MS) {
    return authToken;
  }

  // Fehler wenn Credentials fehlen
  if (!AUTH_CONFIG.userName || !AUTH_CONFIG.password) {
    throw new Error('Missing iDempiere credentials. Set IDEMPIERE_USER and IDEMPIERE_PASSWORD in .env');
  }

  // Schritt 1: Temp-Token über User/Passwort holen
  const loginRes = await fetch(`${IDEMPIERE_BASE_URL}/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: AUTH_CONFIG.userName,
      password: AUTH_CONFIG.password,
    }),
  });

  if (!loginRes.ok) {
    const errorText = await loginRes.text().catch(() => '');
    throw new Error(`Login failed (${loginRes.status}): ${errorText}`);
  }

  const loginData = await loginRes.json();
  const tempToken = loginData.token;

  // Schritt 2: Final-Token über Kontextparameter holen
  const selectRes = await fetch(`${IDEMPIERE_BASE_URL}/auth/tokens`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tempToken}`,
    },
    body: JSON.stringify(AUTH_CONFIG.parameters),
  });

  if (!selectRes.ok) {
    const errorText = await selectRes.text().catch(() => '');
    throw new Error(`Role selection failed (${selectRes.status}): ${errorText}`);
  }

  // Token speichern und Zeitstempel setzen
  const selectData = await selectRes.json();
  authToken = selectData.token;
  authTokenTime = Date.now();

  return authToken;
}

// Token invalidieren (z.B. nach 401 Fehler)
export function invalidateAuthToken() {
  authToken = null;
}
