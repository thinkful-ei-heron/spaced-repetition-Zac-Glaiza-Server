BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Latin', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'agricola', 'farmer', 2),
  (2, 1, 'gladius', 'sword', 3),
  (3, 1, 'aurum', 'gold', 4),
  (4, 1, 'sapientia', 'wisdom', 5),
  (5, 1, 'amare', 'love', 6),
  (6, 1, 'videre', 'see', 7),
  (7, 1, 'amicus', 'friend', 8),
  (8, 1, 'pulcher', 'beautiful', 9),
  (9, 1, 'laetus', 'happy', 10),
  (10, 1, 'canere', 'sing', 11),
  (11, 1, 'scribere', 'write', 12),
  (12, 1, 'audire', 'hear', 13),
  (13, 1, 'caelum', 'sky', 14),
  (14, 1, 'liber', 'book', 15),
  (15, 1, 'oppidum', 'town', 16),
  (16, 1, 'regina', 'queen', 17),
  (17, 1, 'via', 'road', 18),
  (18, 1, 'domus', 'house', 19),
  (19, 1, 'felix', 'lucky', 20),
  (20, 1, 'cattus', 'cat', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
