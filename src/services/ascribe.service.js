import "dotenv/config";

const ASCRIBE_URL = process.env.ASCRIBE_BASE_URL;

export const registerResident = async ({
  resident_name,
  resident_phone,
  resident_password,
}) => {
  const res = await fetch(`${ASCRIBE_URL}/resident/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      resident_name,
      resident_phone,
      resident_password,
    }),
  });

  const data = await res.json();
  return {
    status: res.status,
    ok: res.ok,
    data,
  };
};

export const loginResident = async ({ resident_phone, resident_password }) => {
  const res = await fetch(`${ASCRIBE_URL}/resident/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      resident_phone,
      resident_password,
    }),
  });

  const data = await res.json();

  return {
    status: res.status,
    ok: res.ok,
    data,
  };
};

export const getAscribeProperties = async (token) => {
  const res = await fetch(`${ASCRIBE_URL}/properties`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(
      data.message || "Failed to fetch properties from Ascribe",
    );

    error.status = res.status;
    throw error;
  }

  return data;
};

export const requestPropertyAccess = async ({
  property_id,
  resident_id,
  token,
}) => {
  const res = await fetch(`${ASCRIBE_URL}/properties/assign-resident`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      property_id,
      resident_id,
    }),
  });

  const data = await res.json();

  return {
    status: res.status,
    ok: res.ok,
    data,
  };
};

export const getResidentHouses = async ({ residentId, token }) => {
  const res = await fetch(`${ASCRIBE_URL}/resident/${residentId}/houses`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  return {
    status: res.status,
    ok: res.ok,
    data,
  };
};
