# benefits-buddy

An application to help people see what benefits they can look into

# Benefits Buddy - Testing Report

## Overview

Testing strategy uses two tools to cover different layers of the application:

- **Vitest** — Backend unit and integration tests
- **Playwright** — Frontend end-to-end tests

---

## Backend (Vitest)

### Coverage: 86.5%

The uncovered 5.6% consists of error handling code that is unreachable in normal
operation due to Zod schema enforcement at all data boundaries. These branches
are intentionally untested as mocking the conditions to trigger them would
require simulating scenarios that cannot occur in the real application.

### Test Suites

| File                           | Tests      | Status        |
| ------------------------------ | ---------- | ------------- |
| models/benefitsModel           | 7 + 1 todo | ✅ Pass       |
| models/faqModel                | 5 + 1 todo | ✅ Pass       |
| models/glossaryModel           | 5 + 1 todo | ✅ Pass       |
| controllers/benefitsController | 5 + 1 todo | ✅ Pass       |
| controllers/faqsController     | 3 + 1 todo | ✅ Pass       |
| controllers/glossaryController | 3 + 1 todo | ✅ Pass       |
| controllers/aiController       | 3 + 3 todo | ✅ Pass       |
| services/aiServices            | 5 + 2 todo | ✅ Pass       |
| routes/benefitsRoutes          | 10         | ✅ Pass       |
| routes/faqsRoutes              | 3          | ✅ Pass       |
| routes/glossaryRoutes          | 3          | ✅ Pass       |
| routes/aiRoutes                | 5 + 1 todo | ✅ Pass       |
| middleware/validate            | 1 + 1 todo | ✅ Pass       |
| middleware/errorHandler        | 1 + 1 todo | 📝 Documented |
| scehmas/index                  | todo       | 📝 Documented |

### Testing Approach

- **Models** — Zod schema validation and YAML data loading
- **Controllers** — Error handling and response shaping (happy paths covered by routes)
- **Routes** — Integration tests covering full request/response cycle
- **Services** — AI service mocked, developer_meta logging verified
- **Middleware** — Zod error handling covered implicitly by route tests

---

## Frontend (Playwright)

### Test Suites

| File                | Tests | Status      |
| ------------------- | ----- | ----------- |
| benefits.spec.js    | x     | ✅ Pass     |
| glossary.spec.js    | x     | ✅ Pass     |
| info.spec.js (FAQs) | x     | ✅ Pass     |
| buddy.spec.js       | —     | 📝 See note |

### Testing Approach

End-to-end tests using a real Chromium browser instance. API calls intercepted
via `page.route()` to isolate frontend behaviour from backend. Tests cover:

- Data fetching and rendering
- Search and filter functionality
- DOM interactions (modals, accordions, forms)
- Error states and empty states

### Note on buddy.js

`buddy.js` was not feasible to test at unit level due to tight coupling between
DOM state, session storage, async operations and browser globals. Core chat
functionality is covered by manual testing and the broader E2E test suite.
Recommended refactor before production deployment:

- Wrap init code in `DOMContentLoaded` or explicit `init()` function
- Export pure functions separately
- Separate data logic from DOM manipulation

---

## Technical Debt

- Frontend JS files need a some refactoring for unit testing, so we can get more specific points of failure
- Playwright coverage tooling not configured — E2E pass/fail is the metric
- AI service 500 error path is theoretically unreachable due to Zod enforcement

---

## Summary

| Layer    | Tool       | Status                         |
| -------- | ---------- | ------------------------------ |
| Backend  | Vitest     | 86.5% coverage, all tests pass |
| Frontend | Playwright | All E2E tests pass             |
