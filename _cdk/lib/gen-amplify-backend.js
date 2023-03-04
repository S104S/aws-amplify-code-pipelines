const
    path = require('path'),
    fs = require('fs'),
    {parse} = require('yaml'),
    cdk = require('aws-cdk-lib'),
    {App, GitHubSourceCodeProvider, BasicAuth} = require('@aws-cdk/aws-amplify-alpha'),
    cognito = require('aws-cdk-lib/aws-cognito'),
    appsync = require('aws-cdk-lib/aws-appsync'),
    lambda = require('aws-cdk-lib/aws-lambda'),
    gw = require('aws-cdk-lib/aws-apigateway'),
    {BuildSpec} = require("aws-cdk-lib/aws-codebuild");


const AmplifyAppBackend = (mainStack, props) => {
    let {ghTokenSecret, ghOwner, ghRepo,
        ghBranch, region, account,
        client, pipelineStage} = props;
    const clientPipelineStage = `${client}${pipelineStage}`;

    const appStack = new cdk.Stack(mainStack, `${clientPipelineStage}AmplifyBackendMainStack`, {
        env: {account: account, region: region}
    })



    new cdk.CfnOutput(appStack, 'AmplifyAppId', {
        value: amplifyApp.appId
    })
}

module.exports = AmplifyAppBackend;