# Reproduce the Database Schema (work in progress)
## Organizations Table
```
CREATE TABLE IF NOT EXISTS organizations (
  id bigserial PRIMARY KEY,
  name VARCHAR ( 100 ) NOT NULL,
  link VARCHAR ( 100 ) NOT NULL
);
```
