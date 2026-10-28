# EMF Backend — Requirements

This file describes the software and configuration required to run the backend.

> This is a Node.js project, so `package.json` and `package-lock.json` are the dependency manifests. A Python-style `requirements.txt` is not used by npm.

## Software requirements

- Node.js: current LTS release recommended
- npm: installed with Node.js
- PostgreSQL: running database server
- Git: optional, for cloning the repository
- API client: optional (curl, Postman, or Bruno) for testing endpoints

## npm dependencies

The current `package.json` declares:

- `express` — HTTP server and routing
- `pg` — PostgreSQL client
- `bcryptjs` — password hashing and comparison
- `jsonwebtoken` — JWT creation and verification
- `dotenv` — loading environment variables from `.env`

Install dependencies from the project root:

```bash
npm install
```

For reproducible installs in CI or a clean checkout, use:

```bash
npm ci
```

## Environment configuration

Create a local `.env` file in the project root:

```env
JWT_SECRET=replace_with_a_long_random_secret
```

Do not commit `.env` or real credentials. The application currently reads database connection settings from `database.js`; ensure its host, port, database name, username, and password match your PostgreSQL setup.

## Database requirements

The application expects a PostgreSQL database and these tables/columns:

- `users`: `id`, `email`, `password`
- `employees`: `id`, `name`, `profession`, `email`, `phone_number`, `salary`

The exact SQL types and constraints should match your implementation. Example development schema is provided in `README.md`.

## Run

```bash
node server.js
```

The current server configuration uses port `3000`.

## API surface

- `POST /register`
- `POST /login`
- `GET /profile`
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

## Before production

- Use a strong secret and secure database credentials.
- Add authentication/authorization middleware to routes that require it.
- Use HTTPS and validate request bodies.
- Review `npm audit` output and update vulnerable dependencies carefully.
- Add automated tests and deployment configuration.
