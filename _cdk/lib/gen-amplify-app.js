const
    path = require('path'),
    fs = require('fs'),
    {parse} = require('yaml'),
    cdk = require('aws-cdk-lib'),
    iam = require('aws-cdk-lib/aws-iam'),
    {App, GitHubSourceCodeProvider, BasicAuth} = require('@aws-cdk/aws-amplify-alpha'),
    lambda = require('aws-cdk-lib/aws-lambda'),
    gw = require('aws-cdk-lib/aws-apigateway'),
    {BuildSpec} = require("aws-cdk-lib/aws-codebuild");

const AmplifyViaCdkApp = (parentStage, props) => {

    let {ghTokenSecret, ghOwner, ghRepo,
        ghBranch, region, account,
        client, pipelineStage} = props;
    const clientPipelineStage = `${client}${pipelineStage}`;

    const appStack = new cdk.Stack(parentStage, `${clientPipelineStage}AmplifyMainStack`, {
        env: {account: account, region: region}
    })


    const amplifyApp = new App(appStack, `${clientPipelineStage}AmplifyApp`, {
        appName: `${clientPipelineStage}`,
        basicAuth: BasicAuth.fromCredentials('admin', cdk.SecretValue.secretsManager("aws-amplify-pipelines-password")),
        sourceCodeProvider: new GitHubSourceCodeProvider({
            owner: ghOwner,
            repository: ghRepo,
            oauthToken: cdk.SecretValue.secretsManager('gh-token', {
                jsonField: 'key'
            })
        })
    })

    amplifyApp.addBranch(ghBranch, {
        autoBuild: false,
        branchName: ghBranch
    });

    parentStage.amplifyAppId = new cdk.CfnOutput(appStack, 'AmplifyAppId', {
        exportName: 'AmplifyAppId',
        value: amplifyApp.appId
    })
}

module.exports = AmplifyViaCdkApp;