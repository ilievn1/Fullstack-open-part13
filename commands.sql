CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
)

INSERT INTO blogs (author, url, title, likes)
VALUES
  ('Dan Abramov', 'http://sheesh.com/blog1', 'On let vs. const', 0),
  ('Laurenz Albe', 'http://sheesh.com/blog2', 'Gaps in sequences in PostgreSQL', 0);