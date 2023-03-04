const cdk = require('aws-cdk-lib'),
    iam = require('aws-cdk-lib/aws-iam'),
    AmplifyCdkStackStage = require('./lib/pipeline-stage'),
    CreateProdInvokingLambda = require('./lib/gen-prod-invoking-lambda'),
    CreateS3Bucket = require('./lib/gen-s3-bucket'),
    {BuildSpec} = require('aws-cdk-lib/aws-codebuild'),
    { CodePipeline, CodePipelineSource, CodeBuildStep, ManualApprovalStep} = require('aws-cdk-lib/pipelines'),
    { PolicyStatement } = require("aws-cdk-lib/aws-iam");

const prod = 'prod';
const uat = 'uat';
const staging = 'staging';
const dev = 'dev';
const MalarkeyCdkPipeline = app => {
    let ghToken = null;
    let ghOwner = null;
    let ghRepo = null;
    let ghBranch = null;
    let ghTokenSecret = null;

    let devEnv = app.node.tryGetContext('config');
    let parsedEnvConfig = app.node.tryGetContext(devEnv);
    let pipelinesToCreate = parsedEnvConfig !== undefined ? parsedEnvConfig.pipelines : app.node.tryGetContext('pipelines');
    let vpc = null;


    pipelinesToCreate.forEach(pipeline => {
        const defaultRegion = parsedEnvConfig !== undefined ? parsedEnvConfig.defaultRegion : app.node.tryGetContext('region');
        const defaultAccount = parsedEnvConfig !== undefined ? parsedEnvConfig.defaultAccount : app.node.tryGetContext('account');

        const mainStack = new cdk.Stack(app, `${pipeline.name}PipelineStack`, {
            env: {account: defaultAccount, region: defaultRegion}
        })

        const prodInvokingS3Bucket = CreateS3Bucket({
            stack: mainStack,
            bucketName: `${pipeline.name}-prod-trigger`,
            bucketStackId: `${pipeline.name}ProdTriggerS3Bucket`,
            functionArn: `arn:aws:lambda:${defaultRegion}:${pipeline.prodAccount}:function:${pipeline.name}ProdStarter`
        })

        const createProdInvokingLambda = CreateProdInvokingLambda(mainStack,
            {
                invokingBucket: prodInvokingS3Bucket.bucketName,
                ghBranch: pipeline.branch, defaultRegion, defaultAccount});

        createProdInvokingLambda.addPermission('CodePipelineInvokingLambdaPermissions', {
            action: "lambda:InvokeFunction",
            sourceAccount: defaultAccount,
            sourceArn: `arn:aws:codebuild:${defaultRegion}:${defaultAccount}:build/*`,
            principal: new iam.ServicePrincipal("codebuild.amazonaws.com")
        })

        if(parsedEnvConfig !== undefined) {
            ghToken = parsedEnvConfig.ghToken;
            ghOwner = parsedEnvConfig.ghOwner;
            ghRepo = parsedEnvConfig.ghRepo;
            ghBranch = parsedEnvConfig.ghBranch;
        } else {
            ghOwner = app.node.tryGetContext('ghOwner');
            ghRepo = app.node.tryGetContext('ghRepo');
        }

        const codePipelineRole = new iam.Role(mainStack, 'CodePipelineRole', {
            assumedBy: new iam.ServicePrincipal("codepipeline.amazonaws.com"),
            roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCodePipeline_FullAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess-Amplify')
            ]
        })

        const cdkPipeline = new CodePipeline(mainStack, `${pipeline.client}MalarkeyMainPipeline`, {
            pipelineName: pipeline.name,
            role: codePipelineRole,
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
                input: CodePipelineSource.gitHub(`${ghOwner}/${ghRepo}`, pipeline.branch, {
                    authentication: cdk.SecretValue.secretsManager('gh-token', {
                        jsonField: 'key'
                    }),
                }),
                installCommands: [
                    'ls',
                    'echo $PWD',
                    'cd webtool',
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'cd _cdk',
                    'npm ci --legacy-peer-deps',
                    'npm run build',
                    'cdk synth'],
                primaryOutputDirectory: 'webtool/_cdk/cdk.out'
            })
        })

        pipeline.stages.forEach(pipelineStage => {
            const amplifyAppStage = new AmplifyCdkStackStage(mainStack, `${pipeline.client}${pipelineStage}PipelineStage`, {
                env: {account: defaultAccount, region: defaultRegion},
                amplifyAppProps: {
                    ghToken,
                    ghOwner,
                    ghRepo,
                    ghBranch: pipeline.branch,
                    client: pipeline.client,
                    pipelineStage: pipelineStage
                },
                stageName: pipelineStage
            });

            const cdkPipelineStage = cdkPipeline.addStage(amplifyAppStage);

            console.log('amplify app stage');
            console.log(amplifyAppStage.amplifyAppId.value);

            const actionRole = new iam.Role(mainStack, 'CdkPipelineActionRole', {
                roleName: 'PipelineActionRole',
                assumedBy: new iam.AccountPrincipal(defaultAccount),
            });

            actionRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess-Amplify'))
            actionRole.addToPolicy(
                new PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    resources: ['*'],
                    actions: ['sts:AssumeRole'],
                })
            );

            const startAmplifyAppJobStep = new CodeBuildStep("START AMPLIFY APP", {
                rolePolicyStatements: [
                    new PolicyStatement({
                        actions: ["sts:AssumeRole"],
                        resources: [
                            `arn:aws:iam::${defaultAccount}:role/${actionRole.roleName}`,
                        ],
                        effect: iam.Effect.ALLOW,
                    }),
                    new PolicyStatement({
                        actions: [
                            "amplify:*",
                            "amplifybackend:*",
                            "amplifyuibuilder:*",
                            "cognito-idp:*",
                            "cognito-identity:*",
                            "sns:*",
                            "logs:*",
                            "codecommit:*",
                            "lex:*",
                            "ssm:*",
                            "route53:*",
                            "appsync:*",
                            "iam:*",
                            "cognito:*",
                            "lambda:*",
                            "cloudformation:*",
                            "dynamodb:*",
                            "s3:*",
                            "cloudfront:*",
                            "events:*",
                            "kinesis:*",
                            "es:*",
                            "apigateway:*"
                        ],
                        effect: iam.Effect.ALLOW,
                        resources: ["*"]
                    })
                ],
                actionRole,
                commands: [
                    'echo AmplifyAppID: $AMPLIFY_APP_ID',
                    `aws amplify start-job --app-id $AMPLIFY_APP_ID --branch-name ${pipeline.branch} --job-type RELEASE`
                ],
                envFromCfnOutputs: {
                    AMPLIFY_APP_ID: amplifyAppStage.amplifyAppId,
                },
            })
            cdkPipelineStage.addPost(startAmplifyAppJobStep)

            const deployToProdApprovalStep = new ManualApprovalStep("DEPLOY TO PROD", {
                comment: `Approving the deployment of ${pipeline.name} to production.`
            })
            cdkPipelineStage.addPost(deployToProdApprovalStep);

            const invokeProdTriggeringLambda = new CodeBuildStep("INVOKE PROD TRIGGERING LAMBDA", {
                rolePolicyStatements: [
                    new PolicyStatement({
                        actions: ["sts:AssumeRole"],
                        resources: [
                            `arn:aws:iam::${defaultAccount}:role/${actionRole.roleName}`,
                        ],
                        effect: iam.Effect.ALLOW,
                    }),
                    new PolicyStatement({
                        actions: [
                            "lambda:*"
                        ],
                        effect: iam.Effect.ALLOW,
                        resources: ["*"]
                    })
                ],
                actionRole,
                commands: [
                    `echo ${createProdInvokingLambda.functionName}`,
                    `aws lambda invoke --function-name ${createProdInvokingLambda.functionName} ./response.json`]
            })
            cdkPipelineStage.addPost(invokeProdTriggeringLambda)
        })
    })
}

const app = new cdk.App();
MalarkeyCdkPipeline(app);
