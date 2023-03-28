Oxfam Survivors Community is a safe-space for survivors to discuss and share their experiences of abuse, and get support.

## Architecture

The platform uses a microservice architecture to enable appropriate scaling of features based on their popularity. Each microservice is described below, with a link to further documentation.

<img src="https://github.com/adnanben/oxfam-0102/blob/main/.github/images/architecture.png?raw=true" width="80%"></img>

## Documentation

Please see the below pages:

- [Microservices](./microservices.md)

  - [Auth](./microservice-auth.md)
    for handling moderator registrations and their approvals.
  - [Chat](./microservice-chat.md)
    for providing 1-1 voice/text chat between moderators and survivors.
  - [Forum](./microservice-forum.md)
    for providing the forum functionality and moderator actions.
  - [Gateway](./microservice-gateway.md)
    for load-balancing, reverse-proxying to each microservice, and ensuring authentication.
  - [Reports](./microservice-reports.md)
    for enabling survivors to complete self-reports of abuse to receive appropriate help.
  - [Resources](./microservice-resources.md)
    for providing the resources functionality and moderator actions.
  - [Frontend](./microservice-frontend.md)
    for providing the web-app frontend for both survivors and moderators.

- [Frontend tests](./frontend-testing.md)
- [End-to-end tests](./e2e-testing.md)
- [Continuous Integration and Deployment](./continuous-integration-deployment.md)
- [Logging](./logging.md)
- [Security & Privacy](./security-privacy.md)
