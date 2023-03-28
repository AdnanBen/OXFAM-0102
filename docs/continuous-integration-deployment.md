## Continuous Integration

We run all tests (as described in each individual microservice page on the left) in GitHub Actions as a Continuous Integration pipeline consisting of:

1. Building Docker images for all microservices
2. Running microservice API unit tests for all microservices
3. Running the full end-to-end testing suite
4. Pushing the Docker images to the GitHub Container Registry.

If anything fails in a step, the following steps are immediately failed also.

?> Only microservices that have changed in a given commit are tested/pushed. This speeds up the pipeline, and prevents the same code but slightly different Docker images from being uploaded, speeding up deployment when it comes to it.

<img src="https://github.com/adnanben/oxfam-0102/blob/main/.github/images/ci.png?raw=true" width="80%"></img>

## Continuous Deployment

After all steps in the Continuous Integration pipeline complete successfully, our Continuous Deployment workflow runs which:

1. Connects to the VM via SSH using the private key and other secrets defined in the `production` GitHub Actions Environment secrets
2. Pulls the latest repository changes
3. Runs the `run-prod.sh` script to pull the latest Docker images and update any containers
