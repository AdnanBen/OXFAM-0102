## Overview

The frontend React component test suite tests the individual React pages and components.

These aim to test that the UI shows the correct information and can be interacted with appropriately.

We use the [React Testing Library](https://testing-library.com/docs/react-testing-library/) and [Jest](https://jestjs.io/) to run these tests, by mounting components under test and querying or interacting with certain, asserting that they show the correct data or perform the correct action.

## Running tests

1. Install dependencies

   ```bash
   cd survivor-frontend
   pnpm install
   ```

2. Run the tests

   ```bash
   cd survivor-frontend
   pnpm test
   ```
