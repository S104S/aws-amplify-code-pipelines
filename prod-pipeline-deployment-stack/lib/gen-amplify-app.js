const
    path = require('path'),
    fs = require('fs'),
    {parse} = require('yaml'),
    cdk = require('aws-cdk-lib'),
    lambda = require('aws-cdk-lib/aws-lambda'),
    gw = require('aws-cdk-lib/aws-apigateway'),
    {App, GitHubSourceCodeProvider, BasicAuth} = require('@aws-cdk/aws-amplify-alpha');


const AmplifyViaCdkApp = (mainStack, props) => {
    let {ghTokenSecret, ghOwner, ghRepo, ghBranch,
        region, account, amplifyEnv} = props;

    const appStack = new cdk.Stack(mainStack, 'AmplifyViaCdkMainStack', {
        env: {account: account, region: region}
    })

    // const helloCDK = new lambda.Function(appStack, "HelloCDKHandler", {
    //     runtime: lambda.Runtime.NODEJS_16_X,
    //     code: lambda.Code.fromAsset("lambda"),
    //     handler: "hellocdk.handler",
    // });
    //
    // const helloCdkApi = new gw.LambdaRestApi(appStack, "LambdaEndpoint", {
    //     handler: helloCDK,
    //     proxy: false
    // });
    //
    // const items = helloCdkApi.root.addResource('items');
    // items.addMethod('GET');

    const amplifyApp = new App(appStack, `POCProdAmplifyAppViaCDK`, {
        appName: `HelloAmplify${amplifyEnv}`,
        basicAuth: BasicAuth.fromCredentials('admin',
            cdk.SecretValue.secretsManager("hello-world-amplify-pwd")),
        sourceCodeProvider: new GitHubSourceCodeProvider({
            owner: ghOwner,
            repository: ghRepo,
            oauthToken: cdk.SecretValue.secretsManager(ghTokenSecret, {
                jsonField: 'key'
            })
        })
    })
    amplifyApp.addBranch(ghBranch, {
        autoBuild: false,
        branchName: ghBranch
    });

    new cdk.CfnOutput(appStack, 'POCProdAmplifyAppId', {
        value: amplifyApp.appId
    })
}

module.exports = AmplifyViaCdkApp;