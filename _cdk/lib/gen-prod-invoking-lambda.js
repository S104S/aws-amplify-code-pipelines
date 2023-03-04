const cdk = require('aws-cdk-lib'),
    iam = require('aws-cdk-lib/aws-iam'),
    lambda = require('aws-cdk-lib/aws-lambda');

const CreateProdInvokingLambda = (mainStack, props) => {
    let {ghBranch, defaultRegion, defaultAccount, invokingBucket} = props;

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
        actions: [
            "s3:*"
        ],
        resources: [
            'arn:aws:s3:::hello-prod-trigger',
            'arn:aws:s3:::hello-prod-trigger/*'
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
        ],
        resources: ["*"]
    }))

    const invokerLambda = new lambda.Function(mainStack, 'InvokerLambda', {
        handler: 'invoker.handler',
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset('lambda/invoker'),
        environment: {
            "GH_BRANCH": ghBranch,
            "INVOKING_BUCKET": invokingBucket
        },
        role: lambdaRole
    })


    return invokerLambda;

}

module.exports = CreateProdInvokingLambda;
