# EMF Backend

REST API backend for the Employee Management Flutter application. It uses Node.js, Express, PostgreSQL, and JWT-based authentication.

Repository: https://github.com/Krypto-Tech/EMF-Backend

## Features

- User registration with password hashing using `bcryptjs`
- User login with JWT token generation
- Token-protected-by-client profile endpoint (`GET /profile` verifies the supplied token)
- Employee CRUD endpoints:
  - List employees
  - Create an employee
  - Update an employee
  - Delete an employee
- PostgreSQL database access through `pg`
- Environment-variable support through `dotenv`

## Tech stack

- Node.js
- Express
- PostgreSQL
- `pg`
- `bcryptjs`
- `jsonwebtoken`
- `dotenv`

## Prerequisites

Install the following before running the backend:

- Node.js (a current LTS release is recommended)
- npm (included with Node.js)
- PostgreSQL
- Git (optional, for cloning the repository)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/Krypto-Tech/EMF-Backend.git
cd EMF-Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database

Create a PostgreSQL database and ensure the required tables exist. The current database connection settings are in `database.js`; update them to match your local PostgreSQL username, password, host, port, and database name.

The application code expects these tables:

- `users` with at least `id`, `email`, and `password` columns
- `employees` with at least `id`, `name`, `profession`, `email`, `phone_number`, and `salary` columns

Example SQL for a fresh development database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  profession VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone_number VARCHAR(50),
  salary NUMERIC(12, 2)
);
```

If these tables already exist, do not run the creation statements again. Adapt the SQL to match your existing schema.

### 4. Configure environment variables

Create a `.env` file in the repository root. At minimum, set a strong secret for JWT signing:

```env
JWT_SECRET=replace_with_a_long_random_secret
```

`server.js` loads `.env` with `dotenv`. Do not commit `.env` or real credentials. If you want database settings to come from `.env`, update `database.js` to read those variables as well; the current connection settings are configured in that file.

### 5. Start the server

```bash
node server.js
```

The server listens on port `3000` with the current configuration. Keep this terminal running while using the API.

## API endpoints

All requests and responses use JSON unless otherwise noted.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/register` | Register a user |
| `POST` | `/login` | Authenticate and receive a JWT |
| `GET` | `/profile` | Verify a JWT sent in the `Authorization` header and return its decoded claims |

Example registration request:

```json
{
  "email": "user@example.com",
  "password": "choose-a-strong-password"
}
```

Example login request:

```json
{
  "email": "user@example.com",
  "password": "choose-a-strong-password"
}
```

For `/profile`, send the token in this header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Employees

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/employees` | Retrieve employees |
| `POST` | `/api/employees` | Create an employee |
| `PUT` | `/api/employees/:id` | Update an employee |
| `DELETE` | `/api/employees/:id` | Delete an employee |

Example employee request body:

```json
{
  "name": "Alice Smith",
  "profession": "Designer",
  "email": "alice@example.com",
  "phone_number": "07123456789",
  "salary": 35000
}
```

For updates, send the fields required by the current route implementation. Employee IDs are supplied in the URL for `PUT` and `DELETE`.

## Test the API

With PostgreSQL running and the backend started, try:

```bash
curl -i http://localhost:3000/api/employees
```

Register or log in with a JSON client such as curl, Postman, or Bruno to test the authentication endpoints.

## Project structure

```text
EMF-Backend/
├── src/
│   └── routes/
│       └── EmployeeRoutes.js
├── .gitignore
├── database.js
├── package.json
├── package-lock.json
├── server.js
├── testdb.js
├── .env                 # local only; do not commit
└── README.md
```

## Security notes

- Use a long, random `JWT_SECRET`; never use a sample value in production.
- Never commit `.env`, database passwords, tokens, or other credentials.
- Use a dedicated PostgreSQL user with only the permissions the application needs.
- Validate input and use HTTPS when deploying.
- The `/profile` endpoint verifies a token, but employee endpoints currently should not be considered protected unless authentication middleware is explicitly applied to them.
- Before production use, add automated tests, centralized error handling, request validation, and appropriate CORS/rate-limiting configuration.

## Troubleshooting

### `ECONNREFUSED`

PostgreSQL may not be running, or the host/port in `database.js` may be incorrect. Check the PostgreSQL service and connection settings.

### `database does not exist`

Create the database named in `database.js`, or change the configured database name to an existing database.

### `JWT_SECRET is missing`

Ensure `.env` exists in the backend root and contains `JWT_SECRET=...`. Restart the Node.js server after changing environment variables.

### Port 3000 is already in use

Stop the other process using port 3000 or change the port in `server.js`.

## License

See the repository's license file, if one is added.
