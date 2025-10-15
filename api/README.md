# API Documentation
## Reproduction Steps
(work in progress)
### Database
- Add steps for locally recreating tables here
- Include examples on how to create entries for testing locally
- (Later) Add database seeding for local development

#### Organizations Table
(This may be inaccurate; I was basing this off of the API code interfacing with it.)
```
CREATE TABLE IF NOT EXISTS organizations (
  id bigserial PRIMARY KEY,
  name VARCHAR ( 100 ) NOT NULL,
  link VARCHAR ( 100 ) NOT NULL
);
```
#### Password Table
