import "dotenv/config";

const ASCRIBE_DEV_URL = process.env.ASCRIBE_DEV_URL;
console.log(ASCRIBE_DEV_URL);

export const registerResident = async ({
  resident_name,
  resident_phone,
  resident_password,
}) => {
  const res = await fetch(`${ASCRIBE_DEV_URL}/resident/register`, {
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
