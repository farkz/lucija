-- ============================================
-- Production Database Export for Lucija Ercegovac Portfolio
-- Generated: 2025-10-18
-- ============================================
-- 
-- Instructions:
-- 1. Go to your Replit project
-- 2. Open the "Database" tab (or "Tools" > "Database")
-- 3. Click on the production database
-- 4. Run these SQL statements in order
-- 
-- ============================================

-- Insert Reviews (3 reviews)
INSERT INTO reviews (id, quote, author, "order", created_at) VALUES
('b2b81ba9-7136-41e6-9fcd-25454b7d807f', 'An extraordinary talent with a voice that transcends time.', 'Opera Magazine', 1, '2025-10-18 11:54:08.249055'),
('2176dcf7-a82a-4633-91b8-a7e34b5f7735', 'Her performance was absolutely stunning - a voice of rare beauty and technical precision that captivated the entire audience.', 'Berner Zeitung', 2, '2025-10-18 12:48:21.928664'),
('6ec526a0-2c51-4a05-8bc0-e4147d6ba0b6', 'Lucija Ercegovac delivers a masterful interpretation with impeccable vocal control and genuine emotional depth.', 'Neue Zürcher Zeitung', 3, '2025-10-18 12:48:21.928664')
ON CONFLICT (id) DO NOTHING;

-- Insert Events (12 events total: 2 upcoming, 10 past)
INSERT INTO events (id, date, venue, orchestra, description, is_past, created_at) VALUES

-- Upcoming Events
('e6d5f645-0ed4-4d53-a9cd-6eabd684710e', '2025-01-15', 'Bühnen Bern', 'Jan Willem de Vriend mit Händels Messiah', 'Tonhalle Orchester Zürich performing Handel''s Messiah', false, '2025-10-18 12:35:01.62114'),
('604745f2-06ad-4092-bbd4-23600825f111', '2026-06-15', 'Royal Opera House', 'Royal Philharmonic', NULL, false, '2025-10-18 11:56:02.698924'),

-- Past Events
('482c62d6-5abe-4412-ae9e-1cce27dccd03', '2025-02-28', 'Tonhalle Orchester Zürich', 'Patrick Hahn und Dvořáks Stabat Mater', 'Tonhalle-Orchester Zürich
Conductor:
Patrick Hahn
ChoirLucija Ercegovac', true, '2025-10-18 12:35:01.62114'),
('da5b5d13-8737-47b2-b778-901a66d9a933', '2024-09-28', 'Bühnen Bern', 'La vie parisienne (Offenbach)', 'Duration: 3h 10mins|Language: German, French

Bühnen Bern
Conductor:
Hans Christoph Bünger
Director:
Amélie Niermeyer
PaulineLucija Ercegovac', true, '2025-10-18 12:35:01.62114'),
('3c10913d-0ffa-44ef-8a15-cc7d4f3a92f7', '2024-06-29', 'Bühnen Bern', 'L''Enfant et Les Sortilèges & Iolanta (Ravel/Tchaikovsky)', 'Duration: 2h 45mins|Language: French, Russian|Surtitle: German

Bühnen Bern
Conductor:
Nicholas Carter
,
Sebastian Schwab
Director:
David Bösch', true, '2025-10-18 12:32:50.938311'),
('b9a04e76-095d-4111-87aa-31f6768fe635', '2023-12-15', 'Bühnen Bern', 'Requiem in D minor, K. 626 (Mozart)', 'Kirchheimer Binder Klaus Arp conducting', true, '2025-10-18 12:35:01.62114'),
('7abc3da8-5363-459c-8c67-29e8e245d4ee', '2023-06-25', 'Bühnen Bern', 'Iphigénie en Tauride (Gluck) - Prêtresses', NULL, true, '2025-10-18 12:32:50.938311'),
('a99f9036-edb9-4a0c-a448-2275dfec8ac4', '2023-05-12', 'Bühnen Bern', 'Rossini Operngala', 'Concert featuring works by Rossini with La Banda Storica', true, '2025-10-18 12:35:01.62114'),
('b3b767f6-6bd2-4fe4-b1bc-5e3dd7bf4282', '2023-03-29', 'Bühnen Bern', 'Die Zauberflöte (Mozart)', NULL, true, '2025-10-18 12:32:50.938311'),
('01c4ec14-bd52-470a-a21c-7f49811a4327', '2023-03-25', 'Bühnen Bern', 'JS Bach: The Passion of Mark', 'Conducted by Hanspeter Aebersold', true, '2025-10-18 12:35:01.62114'),
('ec359137-4adc-486c-981f-bc6c94ff189b', '2023-03-19', 'Bühnen Bern', 'Die Walküre (Wagner)', 'Duration: 5h 0mins|Language: German|Surtitle: German

Bühnen Bern
Conductor:
Nicholas Carter
Director:
Ewelina Marciniak
Roßweiße Lucija Ercegovac', true, '2025-10-18 12:35:01.62114'),
('0dbb18ae-6526-4dd9-8fa4-c51f842582fd', '2023-03-15', 'Bühnen Bern', 'Cendrillon (Massenet) - Mezzo role', 'HNK Varaždin
Conductor:
Darijan Ivezić
Director:
Saša Anočić
Madame de la HaltièreLucija Ercegovac', true, '2025-10-18 12:32:50.938311')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- End of Export
-- Total: 3 reviews, 12 events
-- ============================================
