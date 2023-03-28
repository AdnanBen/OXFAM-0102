We use Azure's Application Insights service for logging. This service has library support for most major languages, so in our case the implementation of logging was plug and play.

## Website logging

For website logging, the "@microsoft/applicationinsights-web" npm package was used which is provided as an official library for Azure Application Insights. It is configured using a connection key. Once active, it automatically sends information to Azure for processing, such as exceptions and data about user page statistics such as load times.
To see the exact configuration, see survivor-frontend/src/logging/AzureAppInsights.ts
To find out more about how to configure the various options, see https://github.com/microsoft/ApplicationInsights-JS

## Backend microservices logging

For the logging in the backend i.e. across the various microservices, the official nodeJS Applications Insights library is used. This automatically sends data to Azure such as request and performance data. Any error will also be reported. To see the exact configurations for each microservice, see the following files:

- Chat: chat/index.ts
- Forum: forum/index.ts
- Reports: reports/src/app.ts
- Resources: resources/src/app.ts
- Trends: trends/src/app.ts

For more information about the library and configuration options, see https://github.com/microsoft/ApplicationInsights-node.js
