# Installation Guide — EMF-Backend

This guide explains how to install and run the EMF-Backend Node.js/Express API locally.

## 1. Prerequisites

Install the following software:

- **Node.js LTS** — https://nodejs.org/
- **npm** — included with Node.js
- **PostgreSQL** — https://www.postgresql.org/download/
- **Git** — https://git-scm.com/downloads (optional, if cloning the repository)

Check that Node.js and npm are installed:

```bash
node --version
npm --version
```

## 2. Clone the repository

```bash
git clone https://github.com/Krypto-Tech/EMF-Backend.git
cd EMF-Backend
```

If you already have the repository on your computer, open a terminal in the backend project folder instead.

## 3. Install dependencies

Run:

```bash
npm install
```

This installs the packages listed in `package.json` and uses `package-lock.json` to keep dependency versions consistent.

## 4. Configure PostgreSQL

1. Start your PostgreSQL server.
2. Create the database your backend will use (the current configuration refers to `flutter_auth`).
3. Check `database.js` and ensure the host, port, database name, username, and password match your local PostgreSQL setup.

**Security recommendation:** avoid committing database passwords or other secrets to GitHub. For a shared or deployed project, move database connection settings into environment variables.

The application also expects a `JWT_SECRET` environment variable for signing authentication tokens.

## 5. Configure environment variables

Create a `.env` file in the project root (the same folder as `server.js`) and add a strong secret:

```env
JWT_SECRET=replace_this_with_a_long_random_secret
```

Replace the example value with a securely generated secret. Do not commit `.env` to Git.

If the application is configured to read additional environment variables in your version of the code, add those values here as well.

## 6. Start the backend

Run:

```bash
node server.js
```

Keep the terminal open while the server is running. Check the startup message in the terminal to confirm which port it uses (the project has previously used port `3000`).

## 7. Test the API

If the server is running on port `3000`, you can test the employee endpoint with:

```bash
curl http://localhost:3000/api/employees
```

You can also use Postman or another API client to test the endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a user |
| POST | `/login` | Log in and receive a JWT |
| GET | `/profile` | Access the profile endpoint using a valid bearer token |
| GET | `/api/employees` | List employees |
| POST | `/api/employees` | Create an employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |

Use the request fields and validation rules implemented in the current source code. Employee endpoints should only be treated as protected if authentication middleware is explicitly applied to them.

## 8. Common problems

### `JWT_SECRET` is missing

Confirm that `.env` exists in the project root and contains a `JWT_SECRET` value. Restart the server after changing environment variables.

### PostgreSQL connection refused

Confirm PostgreSQL is running and that the host and port in `database.js` match the active PostgreSQL instance.

### Database does not exist

Create the database configured in `database.js`, or update the configuration to use the correct existing database.

### Port already in use

Stop the other process using the port, or configure the server to use another available port if the application supports it.

### Dependencies are missing

Run:

```bash
npm install
```

## 9. Important notes

- Keep `.env` and all credentials out of version control.
- Use a strong, unique JWT secret.
- Configure database credentials securely before deploying.
- This guide documents local setup; production deployment may require additional environment variables, HTTPS, logging, and security configuration.
