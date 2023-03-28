# Oxfam Survivors Community

[![Build](https://github.com/AdnanBen/OXFAM-0102/actions/workflows/build-microservices.yml/badge.svg)](https://github.com/AdnanBen/OXFAM-0102/actions/workflows/build-microservices.yml)
[![Deployment](https://github.com/AdnanBen/OXFAM-0102/actions/workflows/deploy.yml/badge.svg)](https://github.com/AdnanBen/OXFAM-0102/actions/workflows/deploy.yml)

<img src="./.github/images/oxfam.png" align="right"
alt="Oxfam logo" width="20%" style="margin-left:10px">

Survivors of domestic abuse can often feel isolated and lonely. Oxfam Survivors Community is a privacy-oriented online platform for victims of domestic abuse in Malawi. We target Malawi specifically because it has one of the highest rates of domestic abuse in the world and education surrounding abuse is not prevalent in Malawi.

This project was designed in collaboration with [Oxfam](https://www.oxfam.org/en).

The platform uses a microservice architecture. **Full documentation (inc. testing and deployment) can be found at [the documentation site](https://adnanben.github.io/OXFAM-0102/), or within the [`./docs`](./docs) folder**.

Please see the [local development instructions](./docs/local-development.md) if you would like to contribute to this project.

## Features

- Secure moderator/administrator authentication using Azure AD B2C.
- Multilingual interface in Chichewa and English.
- Built with privacy, safety, and security in mind
  - Panic button to immediately leave the website in emergencies.
  - History reduction capability.
  - No direct access to URLs within the platform.
  - No personal data recorded
- Anonymous forum for survivors to voice concerns, engage in discussions, & receive feedback from the community without needing to register or leave a trace.
- Live one-to-one text/voice chatting with trained Oxfam-appointed moderators to receive advice.
- Self-reporting functionality to record details about issues along with personal details so action can be taken by moderators and administrators.
- Free self-help and educational resources to help survivors tackle and recover from abuse.
- Trend monitoring to collect anonymised location metadata & report statistics to detect temporal/geographic spikes in abuse to help Oxfam focus relief efforts.
