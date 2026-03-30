import { idempiereFetch, odataSafe } from '../idempiere/client.js';
import { IDEMPIERE_BASE_URL, AUTH_CONFIG } from '../config.js';

/**
 * Authentifiziert einen User über iDempiere
 * - Validiert Credentials über iDempiere Auth (User-Token nur zur Validierung)
 * - Lädt BusinessPartner-Daten mit GardenAdmin-Token
 * - Gibt UserData zurück wenn erfolgreich, sonst null
 */
export async function authenticateUser(email, password) {
  try {
    console.log('[AUTH] Starting authentication for email:', email);

    // Schritt 1: Validiere Credentials - Versuche iDempiere Login mit User-Credentials
    const loginRes = await fetch(`${IDEMPIERE_BASE_URL}/auth/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: email,
        password: password,
      }),
    });

    console.log('[AUTH] iDempiere login response status:', loginRes.status);

    if (!loginRes.ok) {
      // Login fehlgeschlagen - ungültige Credentials
      const errorText = await loginRes.text().catch(() => '');
      console.error('[AUTH] Login failed:', loginRes.status, errorText);
      return null;
    }

    // Login erfolgreich - Credentials sind gültig!
    console.log('[AUTH] Credentials validated successfully! Now loading user data with GardenAdmin...');

    // Ab jetzt verwenden wir GardenAdmin-Token für alle Zugriffe
    // (Context Selection ist nicht notwendig, da wir nur validieren wollten)

    // Schritt 2: Suche AD_User über Email mit GardenAdmin-Token
    const userRes = await idempiereFetch(
      `/models/ad_user?$filter=EMail eq '${odataSafe(email)}'`
    );

    if (!userRes.ok) {
      console.error('[AUTH] Failed to fetch AD_User');
      return null;
    }

    const userData = await userRes.json();
    console.log('[AUTH] AD_User search result:', userData.records?.length, 'users found');

    if (!userData.records || userData.records.length === 0) {
      console.error('[AUTH] No AD_User found with email:', email);
      return null;
    }

    const adUser = userData.records[0];
    const bpId = adUser.C_BPartner_ID?.id;
    console.log('[AUTH] Found AD_User, BusinessPartner ID:', bpId);

    if (!bpId) {
      console.error('[AUTH] AD_User has no BusinessPartner assigned');
      return null;
    }

    // Schritt 3: Lade BusinessPartner über GardenAdmin-Token
    const bpRes = await idempiereFetch(
      `/models/c_bpartner/${bpId}`
    );

    if (!bpRes.ok) {
      console.error('Failed to fetch BusinessPartner');
      return null;
    }

    const businessPartner = await bpRes.json();

    // Schritt 4: Lade Contact Details (wir haben bereits adUser)
    const contact = adUser;

    // Schritt 5: Lade BusinessPartner Locations mit GardenAdmin-Token
    const bpLocationRes = await idempiereFetch(
      `/models/c_bpartner_location?$filter=C_BPartner_ID eq ${bpId}`
    );

    let location = null;
    let bpLocationId = null; // C_BPartner_Location_ID für Orders
    if (bpLocationRes.ok) {
      const bpLocationData = await bpLocationRes.json();

      if (bpLocationData.records && bpLocationData.records.length > 0) {
        const bpLocation = bpLocationData.records[0];
        bpLocationId = bpLocation.id; // C_BPartner_Location_ID speichern

        // Hole C_Location Details mit GardenAdmin-Token
        if (bpLocation.C_Location_ID?.id) {
          const cLocationId = bpLocation.C_Location_ID.id;
          const cLocationRes = await idempiereFetch(`/models/c_location/${cLocationId}`);
          if (cLocationRes.ok) {
            location = await cLocationRes.json();
          }
        }
      }
    }

    // Strukturiere User-Daten für Frontend
    return {
      id: businessPartner.id,
      email: contact?.EMail || email,
      firstName: contact?.Name || businessPartner.Name || '',
      lastName: contact?.Name2 || '',
      customerType: businessPartner.IsCompany ? 'company' : 'private',
      company: businessPartner.IsCompany ? businessPartner.Name : undefined,
      businessPartnerId: businessPartner.id,
      contactId: contact?.id,
      bpLocationId: bpLocationId, // C_BPartner_Location_ID für Orders
      locationId: location?.id,   // C_Location_ID für Adress-Details
      billingAddress: location ? {
        street: location.Address1 || '',
        houseNumber: location.Address2 || '',
        zipCode: location.Postal || '',
        city: location.City || '',
        country: location.C_Country_ID?.identifier || 'Deutschland',
      } : null,
      deliveryAddress: location ? {
        street: location.Address1 || '',
        houseNumber: location.Address2 || '',
        zipCode: location.Postal || '',
        city: location.City || '',
        country: location.C_Country_ID?.identifier || 'Deutschland',
      } : null,
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Lädt BusinessPartner-Daten anhand der ID mit GardenAdmin-Token
 * Wird verwendet um User-Session zu validieren
 */
export async function getBusinessPartnerById(bpId) {
  try {
    // Lade BusinessPartner mit GardenAdmin-Token
    const bpRes = await idempiereFetch(`/models/c_bpartner/${bpId}`);

    if (!bpRes.ok) {
      return null;
    }

    const businessPartner = await bpRes.json();

    // Lade Contact (AD_User) mit GardenAdmin-Token
    let contact = null;
    const userRes = await idempiereFetch(
      `/models/ad_user?$filter=C_BPartner_ID eq ${bpId}`
    );

    if (userRes.ok) {
      const userData = await userRes.json();
      if (userData.records && userData.records.length > 0) {
        contact = userData.records[0];
      }
    }

    // Lade Location mit GardenAdmin-Token
    let location = null;
    let bpLocationId = null; // C_BPartner_Location_ID für Orders
    const bpLocationRes = await idempiereFetch(
      `/models/c_bpartner_location?$filter=C_BPartner_ID eq ${bpId}`
    );

    if (bpLocationRes.ok) {
      const bpLocationData = await bpLocationRes.json();

      if (bpLocationData.records && bpLocationData.records.length > 0) {
        const bpLocation = bpLocationData.records[0];
        bpLocationId = bpLocation.id; // C_BPartner_Location_ID speichern

        if (bpLocation.C_Location_ID?.id) {
          const cLocationId = bpLocation.C_Location_ID.id;
          const cLocationRes = await idempiereFetch(`/models/c_location/${cLocationId}`);
          if (cLocationRes.ok) {
            location = await cLocationRes.json();
          }
        }
      }
    }

    return {
      id: businessPartner.id,
      email: contact?.EMail || '',
      firstName: contact?.Name || businessPartner.Name || '',
      lastName: contact?.Name2 || '',
      customerType: businessPartner.IsCompany ? 'company' : 'private',
      company: businessPartner.IsCompany ? businessPartner.Name : undefined,
      businessPartnerId: businessPartner.id,
      contactId: contact?.id,
      bpLocationId: bpLocationId, // C_BPartner_Location_ID für Orders
      locationId: location?.id,   // C_Location_ID für Adress-Details
      billingAddress: location ? {
        street: location.Address1 || '',
        houseNumber: location.Address2 || '',
        zipCode: location.Postal || '',
        city: location.City || '',
        country: location.C_Country_ID?.identifier || 'Deutschland',
      } : null,
      deliveryAddress: location ? {
        street: location.Address1 || '',
        houseNumber: location.Address2 || '',
        zipCode: location.Postal || '',
        city: location.City || '',
        country: location.C_Country_ID?.identifier || 'Deutschland',
      } : null,
    };

  } catch (error) {
    console.error('Error loading BusinessPartner:', error);
    return null;
  }
}
