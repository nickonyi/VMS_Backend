-- =====================================================
-- Seed Users
-- =====================================================

INSERT INTO users (id, full_name, email, phone, password_hash, role)
VALUES
(
'8030c590-2d46-409e-a6ef-c864ba6e7a3e',
'System Admin',
'admin@demo.com',
'0711000001',
'$2b$10$AvMsHpxwm07mbBBwaqCIa.Cqf3m3AQK6STlX6L3pjmJyk/QIrPQ92',
'admin'
),
(
'92cd3f4f-75a9-4291-9f8d-18bffdd87597',
'John Guard',
'guard1@demo.com',
'0711000002',
'$2b$10$wVxHiljlexNiSn7jbHPhU.9N0F9QUYV5Wv6cCB783CetZdioQqCgC',
'guard'
),
(
'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
'Sarah Guard',
'guard2@demo.com',
'0711000003',
'$2b$10.REPLACE_WITH_BCRYPT_HASH',
'guard'
),
(
'0714a395-3abf-4f81-9d85-a16963140c4e',
'Amara Okafor',
'resident@demo.com',
'0711000004',
'$2b$10$TJ6Azjz47Xa6EV76pwe2DOcXKUgEHg1ZgrJU966vkKGyp8EFideEe',
'resident'
),
(
'6715b2c3-4d5e-6f78-90ab-cdef12345678',
'Jane Mwangi',
'jane@demo.com',
'0711000005',
'$2b$10.REPLACE_WITH_BRYPT_HASH',
'resident'
),
(
'52ed3f4f-75a9-4231-9d8d-18befad87535',
'Peter Otieno',
'peter@demo.com',
'0711000006',
'$2b$10.REPLACE_WITH_BCRYPT_HASH',
'resident'
);

