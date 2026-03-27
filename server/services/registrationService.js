import { idempiereFetch } from '../idempiere/client.js';
import { AUTH_CONFIG } from '../config.js';

// Web Shop Customer Role ID
const WEB_SHOP_CUSTOMER_ROLE_ID = 1000000;

/**
 * Registriert einen neuen User in iDempiere
 * Erstellt: C_BPartner, C_Location, C_BPartner_Location, AD_User, AD_User_Roles
 *
 * @param {Object} registerData - Registrierungsdaten aus dem Frontend
 * @returns {Object|null} - User-Daten bei Erfolg, null bei Fehler
 */
export async function registerUser(registerData) {
  const {
    email,
    password,
    firstName,
    lastName,
    customerType,
    company,
    billingAddress,
  } = registerData;

  try {
    console.log('[REGISTER] Starting registration for:', email);

    // Schritt 1: Prüfe ob Email bereits existiert (AD_User ODER BPartner)
    const existingUserRes = await idempiereFetch(
      `/models/ad_user?$filter=EMail eq '${email}'`
    );

    if (existingUserRes.ok) {
      const existingData = await existingUserRes.json();
      if (existingData.records && existingData.records.length > 0) {
        console.error('[REGISTER] Email already exists in AD_User:', email);
        return { error: 'EMAIL_EXISTS', message: 'Diese E-Mail-Adresse ist bereits registriert' };
      }
    }

    // Prüfe auch ob BPartner mit dieser Email als Value existiert
    const existingBPRes = await idempiereFetch(
      `/models/c_bpartner?$filter=Value eq '${email}'`
    );

    if (existingBPRes.ok) {
      const existingBPData = await existingBPRes.json();
      if (existingBPData.records && existingBPData.records.length > 0) {
        console.error('[REGISTER] Email already exists as BPartner Value:', email);
        return { error: 'EMAIL_EXISTS', message: 'Diese E-Mail-Adresse ist bereits registriert' };
      }
    }

    console.log('[REGISTER] Email is available');

    // Schritt 2: Location erstellen oder finden
    const locationId = await findOrCreateLocation(billingAddress);
    if (!locationId) {
      console.error('[REGISTER] Failed to create/find location');
      return { error: 'LOCATION_FAILED', message: 'Fehler beim Erstellen der Adresse' };
    }
    console.log('[REGISTER] Location ID:', locationId);

    // Schritt 3: BusinessPartner erstellen
    const bPartnerId = await createBusinessPartner({
      firstName,
      lastName,
      customerType,
      company,
      email,
    });
    if (!bPartnerId) {
      console.error('[REGISTER] Failed to create BusinessPartner');
      return { error: 'BPARTNER_FAILED', message: 'Fehler beim Erstellen des Kundenkontos' };
    }
    console.log('[REGISTER] BusinessPartner ID:', bPartnerId);

    // Schritt 4: BusinessPartner Location erstellen (Verknüpfung)
    const bpLocationId = await createBusinessPartnerLocation(bPartnerId, locationId, billingAddress.city);
    if (!bpLocationId) {
      console.error('[REGISTER] Failed to create BPartner Location');
      return { error: 'BP_LOCATION_FAILED', message: 'Fehler beim Verknüpfen der Adresse' };
    }
    console.log('[REGISTER] BPartner Location ID:', bpLocationId);

    // Schritt 5: AD_User (Contact) erstellen - Name = Email für Login
    const adUserId = await createAdUser({
      email,
      password,
      firstName,
      lastName,
      bPartnerId,
      bpLocationId,
    });
    if (!adUserId) {
      console.error('[REGISTER] Failed to create AD_User');
      return { error: 'USER_FAILED', message: 'Fehler beim Erstellen des Benutzerkontos' };
    }
    console.log('[REGISTER] AD_User ID:', adUserId);

    // Schritt 6: Rolle "Web Shop Customer" zuweisen
    const roleAssigned = await assignUserRole(adUserId, WEB_SHOP_CUSTOMER_ROLE_ID);
    if (!roleAssigned) {
      console.error('[REGISTER] Failed to assign role');
      // Nicht fatal - User wurde erstellt, nur Rolle fehlt
      console.warn('[REGISTER] Continuing without role assignment');
    } else {
      console.log('[REGISTER] Role assigned successfully');
    }

    console.log('[REGISTER] Registration completed successfully!');

    // Lade vollständige User-Daten für Response
    const userData = await loadUserData(bPartnerId, adUserId, locationId, bpLocationId);

    return {
      success: true,
      user: userData,
    };

  } catch (error) {
    console.error('[REGISTER] Registration error:', error);
    return { error: 'SERVER_ERROR', message: 'Serverfehler bei der Registrierung' };
  }
}

/**
 * Findet eine existierende Location oder erstellt eine neue
 */
async function findOrCreateLocation(address) {
  const { street, houseNumber, zipCode, city, country } = address;

  // Kombiniere Straße und Hausnummer
  const address1 = street;
  const address2 = houseNumber;

  // Suche nach existierender Location (gleiche Adresse)
  const searchRes = await idempiereFetch(
    `/models/c_location?$filter=Address1 eq '${street}' and Postal eq '${zipCode}' and City eq '${city}'`
  );

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.records && searchData.records.length > 0) {
      console.log('[REGISTER] Found existing location');
      return searchData.records[0].id;
    }
  }

  // Keine existierende Location gefunden - erstelle neue
  // Finde Country ID (Deutschland = 101 in GardenWorld)
  let countryId = 101; // Default: Deutschland
  if (country && country !== 'Deutschland') {
    const countryRes = await idempiereFetch(
      `/models/c_country?$filter=Name eq '${country}'`
    );
    if (countryRes.ok) {
      const countryData = await countryRes.json();
      if (countryData.records && countryData.records.length > 0) {
        countryId = countryData.records[0].id;
      }
    }
  }

  // Erstelle neue Location
  const locationPayload = {
    Address1: address1,
    Address2: address2,
    Postal: zipCode,
    City: city,
    C_Country_ID: { id: countryId },
  };

  const createRes = await idempiereFetch('/models/c_location', {
    method: 'POST',
    body: JSON.stringify(locationPayload),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text().catch(() => '');
    console.error('[REGISTER] Location create failed:', errorText);
    return null;
  }

  const created = await createRes.json();
  return created.id;
}

/**
 * Erstellt einen neuen BusinessPartner
 */
async function createBusinessPartner({ firstName, lastName, customerType, company, email }) {
  const isCompany = customerType === 'company';
  const name = isCompany ? company : `${firstName} ${lastName}`;

  const bpPayload = {
    AD_Org_ID: { id: AUTH_CONFIG.parameters.organizationId },
    Value: email, // Eindeutiger Suchschlüssel = Email
    Name: name,
    IsCustomer: true,
    IsVendor: false,
    IsEmployee: false,
    IsSalesRep: false,
  };

  // Name2 nur setzen wenn Firma (Ansprechpartner)
  if (isCompany) {
    bpPayload.Name2 = `${firstName} ${lastName}`;
  }

  console.log('[REGISTER] Creating BPartner with payload:', JSON.stringify(bpPayload, null, 2));

  const createRes = await idempiereFetch('/models/c_bpartner', {
    method: 'POST',
    body: JSON.stringify(bpPayload),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text().catch(() => '');
    console.error('[REGISTER] BPartner create failed:', errorText);
    return null;
  }

  const created = await createRes.json();
  console.log('[REGISTER] BPartner created:', created.id);
  return created.id;
}

/**
 * Erstellt die Verknüpfung zwischen BusinessPartner und Location
 */
async function createBusinessPartnerLocation(bPartnerId, locationId, cityName) {
  const payload = {
    C_BPartner_ID: { id: bPartnerId },
    C_Location_ID: { id: locationId },
    Name: cityName || 'Standard',
    IsBillTo: true,
    IsShipTo: true,
    IsPayFrom: true,
    IsRemitTo: true,
  };

  const createRes = await idempiereFetch('/models/c_bpartner_location', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text().catch(() => '');
    console.error('[REGISTER] BPartner Location create failed:', errorText);
    return null;
  }

  const created = await createRes.json();
  return created.id;
}

/**
 * Erstellt einen AD_User (Contact) mit Login-Berechtigung
 * WICHTIG: Name = Email (für iDempiere Login)
 */
async function createAdUser({ email, password, firstName, lastName, bPartnerId, bpLocationId }) {
  const payload = {
    AD_Org_ID: { id: AUTH_CONFIG.parameters.organizationId },
    Name: email, // WICHTIG: Name = Email für Login!
    EMail: email,
    Password: password,
    C_BPartner_ID: { id: bPartnerId },
    C_BPartner_Location_ID: { id: bpLocationId },
    IsActive: true,
    Description: `${firstName} ${lastName}`,
  };

  console.log('[REGISTER] Creating AD_User with payload:', JSON.stringify(payload, null, 2));

  const createRes = await idempiereFetch('/models/ad_user', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text().catch(() => '');
    console.error('[REGISTER] AD_User create failed:', errorText);
    return null;
  }

  const created = await createRes.json();
  console.log('[REGISTER] AD_User created:', created.id);
  return created.id;
}

/**
 * Weist dem User die Web Shop Customer Rolle zu
 */
async function assignUserRole(adUserId, roleId) {
  const payload = {
    AD_User_ID: { id: adUserId },
    AD_Role_ID: { id: roleId },
    AD_Org_ID: { id: AUTH_CONFIG.parameters.organizationId },
  };

  const createRes = await idempiereFetch('/models/ad_user_roles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text().catch(() => '');
    console.error('[REGISTER] User Role assign failed:', errorText);
    return false;
  }

  return true;
}

/**
 * Lädt vollständige User-Daten für die Response
 */
async function loadUserData(bPartnerId, adUserId, locationId, bpLocationId) {
  // Lade BusinessPartner
  const bpRes = await idempiereFetch(`/models/c_bpartner/${bPartnerId}`);
  const businessPartner = bpRes.ok ? await bpRes.json() : {};

  // Lade AD_User
  const userRes = await idempiereFetch(`/models/ad_user/${adUserId}`);
  const adUser = userRes.ok ? await userRes.json() : {};

  // Lade Location
  const locRes = await idempiereFetch(`/models/c_location/${locationId}`);
  const location = locRes.ok ? await locRes.json() : null;

  return {
    id: bPartnerId,
    email: adUser.EMail || '',
    firstName: adUser.Description?.split(' ')[0] || businessPartner.Name || '',
    lastName: adUser.Description?.split(' ').slice(1).join(' ') || '',
    customerType: businessPartner.IsCompany ? 'company' : 'private',
    company: businessPartner.IsCompany ? businessPartner.Name : undefined,
    businessPartnerId: bPartnerId,
    contactId: adUserId,
    bpLocationId: bpLocationId,
    locationId: locationId,
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
}
