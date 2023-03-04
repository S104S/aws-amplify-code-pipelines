const cdk = require('aws-cdk-lib'),
    iam = require('aws-cdk-lib/aws-iam'),
    lambda = require('aws-cdk-lib/aws-lambda'),
    lambdaEventSources =  require('aws-cdk-lib/aws-lambda-event-sources');

const CreateProdInvokingLambda = (mainStack, props) => {
    let {ghBranch, defaultRegion,
        defaultAccount, pipelineName,
        devAccount} = props;

    const lambdaRole = new iam.Role(mainStack, 'InvokingCrossAccountPipelineLambdaRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
        ]
    })

    lambdaRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
            "ssm:*",
            "ecr:BatchGetImage",
            "ecr:GetDownloadUrlForLayer",
            "ecr:SetRepositoryPolicy",
            "ecr:GetRepositoryPolicy"
        ],
        resources: [
            `arn:aws:ssm:${defaultRegion}:${defaultAccount}:parameter/sdx/*`,
            `arn:aws:ecr:${defaultRegion}:${defaultAccount}:repository/aws-cdk/assets/`
        ]
    }))

    lambdaRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ecr:GetAuthorizationToken"],
        resources: ["*"]
    }))

    lambdaRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
            "ec2:DescribeNetworkInterfaces",
            "ec2:CreateNetworkInterface",
            "ec2:DeleteNetworkInterface",
            "ec2:DescribeInstances",
            "ec2:AttachNetworkInterface"
        ],
        resources: ["*"]
    }))

    lambdaRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
            "kms:Decrypt",
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret",
            "secretsmanager:ListSecretVersionIds",
            "secretsmanager:ListSecrets"
        ],
        resources: ["*"]
    }))

    lambdaRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
            "dynamodb:Scan",
            "dynamodb:Query"
        ],
        resources: ["*"]
    }))

    //Allow lambda access to use logging
    lambdaRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
            "logs:*"
        ],
        resources: ["arn:aws:logs:*:*:*"]
    }))

    //Allow lambda to respond to the pipeline with success / failure response
    lambdaRole.addToPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
            "codepipeline:PutJobSuccessResult",
            "codepipeline:PutJobFailureResult",
            "codepipeline:StartPipelineExecution"
        ],
        resources: ["*"]
    }))

    const invokerLambda = new lambda.Function(mainStack, 'InvokerLambda', {
        functionName: `${pipelineName}ProdStarter`,
        handler: 'invoker.handler',
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset('lambda/invoker'),
        environment: {
            "GH_BRANCH": ghBranch
        },
        role: lambdaRole
    })

    invokerLambda.addPermission("S3InvokingPermissions", {
        action: "lambda:InvokeFunction",
        sourceArn: `arn:aws:s3:::${pipelineName}-prod-trigger`,
        sourceAccount: devAccount,
        principal: new iam.ServicePrincipal("s3.amazonaws.com")
    })

    return invokerLambda;

}

module.exports = CreateProdInvokingLambda;
