## Authentication overview

The platform uses [Azure AD B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/overview) for authentication, enabling moderators/administrators to login through their existing social or enterprise accounts. This means they do not not need to create a new account to use the platform as a moderator/admin.

?> Survivors do **not** require authentication. This microservice is only used to facilitate **moderator registrations**.

## Registration

Administrator accounts must be configured manually within Azure AD B2C.

Moderators must have their accounts approved before they may use the platform -- this is what the `auth` microservice handles. This is done through a custom [Azure AD B2C user flow](https://learn.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview) ("Sign up and sign in") which uses an [Azure AD B2C API Connectors](https://learn.microsoft.com/en-us/azure/active-directory-b2c/api-connectors-overview?pivots=b2c-custom-policy) at the "before creating the user" stage to call this API.

The API connector uses HTTP Basic Authentication to authenticate with this microservice, with the username and password configured in Azure.

## Endpoints

This microservice exposes 2 endpoints:

- `POST /pendingRegistrations`

  This is the endpoint called via the Azure API Connector when a user registers (i.e., logs in for the first time). Azure provides the user's details which are stored locally in a Mongo database and a unique token is generated for this registration.

  An email is sent to the designated Oxfam contact containing a link with this unique token.

- `POST /pendingRegistrations/approve/:token`

  This is the endpoint that must be called when a pending account should be approved. This endpoint will create a User object in the Azure AD B2C tenant using the [Graph API](https://learn.microsoft.com/en-us/azure/active-directory-b2c/microsoft-graph-operations) and the user details stored previously. On success, an email is sent to the corresponding user's email address confirming their approval.

[NextAuth.js](https://next-auth.js.org/) is used to connect to the Azure AD B2C tenant using the

## Underlying authentication model: JWTs
We use JSON Web Tokens for authentication, which are a way of transmitting information that can later be verified with access to a shared secret key. The sender signs the JWT (which is structured as two sets of JSON objects, a header and a body). This signature is unique to the JWT and its contents. If anything in the JWT were to change, so would the signature. For someone to verify that the contents of the JWT are correct, they can use the secret key to compute the signature of the JWT and compare it to the signature included in the JWT. If they match, they can can trust the JWT's contents and that they have not been tampered with.
In our JWT, we include standard claims such as when the JWT was issued (iat), an expiration time (exp) and the ID of the user (sub). Most importantly, we include the role of the user (moderator or admin) so that the correct access to resources can be given.

For more about JWTs and claims, see the official JWT RFC: https://www.rfc-editor.org/rfc/rfc7519

## Tests

The API exposed by this microservice is unit-tested using [Jest](https://jestjs.io/).

To sufficiently test the functionality, the MongoDB database is mocked in-memory using [`mongodb-memory-server`](https://github.com/nodkz/mongodb-memory-server), which provides a unique URL for the in-memory database for every test suite. Thus, they can run in parallel, as the setup script connects to the unique database per test suite, and drops the database for every test to ensure independence of tests.

To run the tests:

1. Install dependencies

   ```bash
   cd auth
   pnpm install
   ```

2. Run the tests

   ```bash
   cd auth
   pnpm test
   ```
