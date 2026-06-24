# reqres-api-tests

E2E API test suite for the [reqres.in](https://reqres.in) Users module, built with **Mocha + Chai + TypeScript**.

## Tech Stack

| Tool | Purpose |
|---|---|
| [Mocha](https://mochajs.org/) | Test runner |
| [Chai](https://www.chaijs.com/) | Assertion library |
| [Supertest](https://github.com/ladjs/supertest) | HTTP request builder |
| [TypeScript](https://www.typescriptlang.org/) | Language |
| [Faker.js](https://fakerjs.dev/) | Test data generation |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | HTML test reporter |

---

## Project Structure

```
api/
├── test/
│   ├── endpoint/
│   │   └── users.ts            # Supertest request builders per endpoint
│   ├── service/
│   │   └── users.ts            # Test suites (e2e flow + positive + negative cases)
│   └── support/
│       ├── data/
│       │   ├── payload/        # Request body factories
│       │   ├── scenario/       # Data-driven test case definitions
│       │   └── test/           # Fixed test constants (known IDs, user data)
│       └── schema-validator/   # JSON response shape definitions
├── test/utils/
│   ├── expected-response.ts    # Reusable Chai assertion helpers
│   └── setup.ts                # dotenv loader (runs before all tests)
├── .env.example                # Environment variable template
├── .mocharc.json               # Mocha configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v8 or later
- A **reqres.in API key** (free — see step 1 below)

---

## Setup

### 1. Get a reqres.in API Key

1. Go to [https://reqres.in](https://reqres.in) and sign up for a free account.
2. Copy your API key from the dashboard.

### 2. Clone the repository

```bash
git clone https://github.com/yhmahendra/edts-api.git
cd edts-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your API key:

```env
REQRES_API_KEY=your_api_key_here
```

---

## Running Tests

### Run all tests

```bash
npm test
```

### Run only the users module

```bash
npm run test:users
```

After each run, an HTML report is generated at:

```
reports/report.html
```

Open it in a browser:

```bash
open reports/report.html
```

For report captures, check the `~/assets/` directory.

---

## Test Coverage

The suite covers all 5 steps of the e2e flow, each with positive and negative scenarios:

| Step | Method | Endpoint | Cases |
|---|---|---|---|
| 1 | POST | `/api/users` | Create user — valid payload, empty fields, empty body |
| 2 | GET | `/api/users?page=2` | List users — page with data, page without data, field validation |
| 3 | PUT | `/api/users/2` | Update user — field reflection, timestamp, non-existent id |
| 4 | GET | `/api/users/2` | Single user — known data, 404 for missing user, empty body |
| 5 | DELETE | `/api/users/2` | Delete user — 204 response, no body, idempotent on non-existent |

---

## Adding New Tests

- **New endpoint** → add a function in `test/endpoint/users.ts`
- **New assertion** → add a helper in `test/utils/expected-response.ts`
- **New test data** → add constants in `test/support/data/test/users.ts`
- **New scenarios** → add an array entry in `test/support/data/scenario/users.ts`
- **New test case** → add an `it()` block in `test/service/users.ts`
