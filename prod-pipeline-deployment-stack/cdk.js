const cdk = require('aws-cdk-lib'),
    {BuildSpec} = require('aws-cdk-lib/aws-codebuild'),
    { CodePipeline, CodePipelineSource, CodeBuildStep, Step } = require('aws-cdk-lib/pipelines'),
    AmplifyCdkStackStage = require('./lib/dev-pipeline-stage');
const {S3Trigger} = require("aws-cdk-lib/aws-codepipeline-actions");
const CreateProdInvokingLambda = require("./lib/gen-invoker-lambda");

const AmplifyCdkPipeline = app => {
    let ghToken = null;
    let ghOwner = null;
    let ghRepo = null;
    let ghBranch = null;
    let ghTokenSecret = null;

    let devEnv = app.node.tryGetContext('config');
    let parsedEnvConfig = app.node.tryGetContext(devEnv);
    let pipelinesToCreate = parsedEnvConfig !== undefined ? parsedEnvConfig.pipelines
        : app.node.tryGetContext('pipelines');
    const defaultRegion = parsedEnvConfig !== undefined ? parsedEnvConfig.defaultRegion
        : app.node.tryGetContext('region');
    const defaultAccount = parsedEnvConfig !== undefined ? parsedEnvConfig.defaultAccount
        : app.node.tryGetContext('account');

    pipelinesToCreate.forEach(pipeline => {
        const mainStack = new cdk.Stack(app, `${pipeline.name}PipelineStack`, {
            env: {account: defaultAccount, region: defaultRegion}
        })

        if(parsedEnvConfig !== undefined) {
            ghOwner = parsedEnvConfig.ghOwner;
            ghRepo = parsedEnvConfig.ghRepo;
            ghBranch = parsedEnvConfig.ghBranch;
        } else {
            ghOwner = app.node.tryGetContext('ghOwner');
            ghRepo = app.node.tryGetContext('ghRepo');
            ghBranch = app.node.tryGetContext('ghBranch');
            ghTokenSecret = app.node.tryGetContext('ghTokenSecret');
        }

        const createProdInvokerLambda = CreateProdInvokingLambda(mainStack,
            {ghBranch, defaultRegion, defaultAccount});

        const cdkPipeline = new CodePipeline(mainStack, `${pipeline.name}PipelineStack`, {
            crossAccountKeys: true,
            pipelineName: 'POCCDKPipeline',
            synthCodeBuildDefaults: {
                partialBuildSpec: BuildSpec.fromObject({
                    version: '0.2',
                    env: {
                        "exported-variables": ["IS_SYNTH_CODEBUILD"]
                    },
                    phases: {
                        install: {
                            'runtime-versions': {
                                nodejs: 14,
                            },
                            commands: ['export IS_SYNTH_CODEBUILD="true"', "n 16.17.0"]
                        },
                    },
                })
            },
            synth: new CodeBuildStep('Synth', {
                input: CodePipelineSource.gitHub(`${ghOwner}/${ghRepo}`, ghBranch, {
                    authentication: cdk.SecretValue.secretsManager('gh-token', {
                        jsonField: 'key'
                    }),
                }),
                installCommands: [
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'cd _cdk',
                    'npm ci --legacy-peer-deps',
                    'npm run build',
                    'cdk synth'],
                primaryOutputDirectory: '_cdk/cdk.out'
            })
        })

        const prod = new AmplifyCdkStackStage(mainStack, "ProdDeploymentPipelineStage", {
            env: {account: defaultAccount, region: defaultRegion},
            amplifyAppProps: {
                ghToken,
                ghOwner,
                ghRepo,
                ghBranch,
                ghTokenSecret
            },
            stageName: 'PROD'
        });

        cdkPipeline.addStage(prod);
    })
}

const app = new cdk.App();
AmplifyCdkPipeline(app);
