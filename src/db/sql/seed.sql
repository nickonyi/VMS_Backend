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
'guard@demo.com',
'0711000002',
'$2b$10$wVxHiljlexNiSn7jbHPhU.9N0F9QUYV5Wv6cCB783CetZdioQqCgC',
'guard'
),
(
'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
'Sarah Guard',
'guard2@demo.com',
'0711000003',
'$2b$10$lvrKzZPRTTeMpE1GfGZaGe1hfb/XQ/5neQXitarzFoR7fYsg0aABa',
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
'$2b$10$9KcOfHAGqc5WZcEqep0rYOisHCguMwblbFzSc9jMeGWR7yiEBqEzO',
'resident'
),
(
'52ed3f4f-75a9-4231-9d8d-18befad87535',
'Peter Otieno',
'peter@demo.com',
'0711000006',
'$2b$10$HV2Lb7LPyjl8ErSknZLCZOZiinoDPj7q0F9nXwlzUqp7crf04l9MW',
'resident'
);



-- =====================================================
-- APARTMENTS
-- =====================================================

INSERT INTO apartments (
    id,
    unit_number,
    block,
    floor,
    resident_id
)
VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'A101',
    'A',
    1,
    '0714a395-3abf-4f81-9d85-a16963140c4e'
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'A102',
    'A',
    1,
    '6715b2c3-4d5e-6f78-90ab-cdef12345678'
);


-- =====================================================
-- VISITORS
-- =====================================================

INSERT INTO visitors (
    id,
    full_name,
    phone,
    vehicle_reg,
    email,
    id_number
)
VALUES
(
    'aaaaaaaa-1111-1111-1111-111111111111',
    'David Mwangi',
    '+254711111111',
    'KDA123A',
    'davido@demo.com',
    'ID123456'
),
(
    'bbbbbbbb-2222-2222-2222-222222222222',
    'Sarah Achieng',
    '+254722222222',
    NULL,
    'sarah@demo.com',
    'ID789012'
),
(
    'cccccccc-3333-3333-3333-333333333333',
    'Kevin Otieno',
    '+254733333333',
    'KCB456B',
    'voke@demo.com',
    'ID345678'
);


-- =====================================================
-- VISITOR PASSES
-- =====================================================

INSERT INTO visitor_passes (
    id,
    visitor_id,
    resident_id,
    apartment_id,
    purpose,
    manual_code,
    num_of_guests,
    expected_arrival_at,
    expires_at,
    qr_token,
    status
)
VALUES
(
    'aaaa1111-1111-1111-1111-111111111111',
    'aaaaaaaa-1111-1111-1111-111111111111',
    '0714a395-3abf-4f81-9d85-a16963140c4e',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'family',
    '123456',
    2,
    NOW() + INTERVAL '1 hour',
    NOW() + INTERVAL '5 hours',
    '10000000-0000-0000-0000-000000000001',
    'pending'
),
(
    'bbbb2222-2222-2222-2222-222222222222',
    'bbbbbbbb-2222-2222-2222-222222222222',
    '0714a395-3abf-4f81-9d85-a16963140c4e',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'friend',
    '345678',
    1,
    NOW() - INTERVAL '2 hours',
    NOW() + INTERVAL '2 hours',
    '20000000-0000-0000-0000-000000000002',
    'checked_in'
),
(
    'cccc3333-3333-3333-3333-333333333333',
    'cccccccc-3333-3333-3333-333333333333',
    '0714a395-3abf-4f81-9d85-a16963140c4e',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'delivery',
    '525638',
    1,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '20 hours',
    '30000000-0000-0000-0000-000000000003',
    'checked_out'
);


-- =====================================================
-- VISIT LOGS
-- =====================================================

-- Check-in for the second pass
INSERT INTO visit_logs (
    id,
    visitor_pass_id,
    guard_id,
    action,
    timestamp
)
VALUES
(
    'aaaa4444-4444-4444-4444-444444444444',
    'bbbb2222-2222-2222-2222-222222222222',
    '92cd3f4f-75a9-4291-9f8d-18bffdd87597',
    'check_in',
    NOW() - INTERVAL '1 hour'
);


-- Check-in and check-out for the third pass
INSERT INTO visit_logs (
    id,
    visitor_pass_id,
    guard_id,
    action,
    timestamp
)
VALUES
(
    'bbbb5555-5555-5555-5555-555555555555',
    'cccc3333-3333-3333-3333-333333333333',
    '92cd3f4f-75a9-4291-9f8d-18bffdd87597',
    'check_in',
    NOW() - INTERVAL '23 hours'
),
(
    'cccc6666-6666-6666-6666-666666666666',
    'cccc3333-3333-3333-3333-333333333333',
    '92cd3f4f-75a9-4291-9f8d-18bffdd87597',
    'check_out',
    NOW() - INTERVAL '21 hours'
);


COMMIT;