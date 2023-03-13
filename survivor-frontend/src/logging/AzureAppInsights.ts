import { ApplicationInsights, Snippet } from '@microsoft/applicationinsights-web'

var appInsights: ApplicationInsights;
const appInsightConfig: Snippet  = {
    config: {
        autoTrackPageVisitTime: true,
        enableAutoRouteTracking: true
        /* ...Other Configuration Options... */
    }
}

function getAppInsightsObject(connectionString: string) {
    if (appInsights == undefined) {
        console.log("inside module: ", connectionString)
        appInsightConfig.config.connectionString = connectionString
        appInsights = new ApplicationInsights(appInsightConfig);
        appInsights.loadAppInsights()
    }
    return appInsights
}

export {getAppInsightsObject}