const s3 = require('aws-cdk-lib/aws-s3'),
        iam = require('aws-cdk-lib/aws-iam'),
    lambda = require('aws-cdk-lib/aws-lambda'),
    s3Notifications = require('aws-cdk-lib/aws-s3-notifications');

const CreateS3Bucket = props => {
    const {stack, bucketName,
        bucketStackId, functionArn} = props;
    const newBucket = new s3.Bucket(stack, bucketStackId, {
        bucketName: bucketName.toLowerCase()
    })

    if(functionArn !== null && functionArn !== undefined) {
        newBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notifications.LambdaDestination(
            lambda.Function.fromFunctionArn(stack, `${bucketStackId}EventNotification`,
                functionArn)
        ))
    }

    return newBucket;
}

module.exports = CreateS3Bucket;