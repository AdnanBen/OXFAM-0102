The frontend is a [Next.JS](https://nextjs.org/) app which heavily uses Server Side Rendering (SSR) for survivor-facing pages. The frontend also includes moderator-only pages at paths prefixed by `/moderator` and administrator-only pages at paths prefixed by `/admin`.

All requests are sent to the [Gateway](./microservice-gateway.md) which acts as a reverse proxy and forwars requests to the appropriate microservices. Reuqests that require authentication are also checked there to ensure unauthorised users cannot access sensitive pages/endpoints.

## Testing

The frontend is unit-tested using the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and Jest. These help ensure the frontend components are rendering the correct information in the correct manner to help provide confidence survivors will be able to use the platform effectively.

To run the tests:

1. Install dependencies

   ```bash
   cd survivor-frontend
   pnpm install
   ```

2. Run the tests

   ```bash
   cd survivor-frontend
   pnpm test:frontend
   ```
