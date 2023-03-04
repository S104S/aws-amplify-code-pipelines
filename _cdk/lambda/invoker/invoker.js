const assert = require('assert'),
    AWS = require('aws-sdk'),
    http = require('http');

exports.handler = async (event, context) => {
    const s3 = new AWS.S3();
    const triggerDate = new Date();
    const triggerDateTime = `${triggerDate.getDate()}${triggerDate.getMonth()}${triggerDate.getFullYear()}
    ${triggerDate.getHours()}${triggerDate.getMinutes()}${triggerDate.getSeconds()}`
    const clientName = process.env.CLIENT !== undefined ?
        process.env.CLIENT : false;
    const branchName = process.env.GH_BRANCH !== undefined ?
        process.env.GH_BRANCH : false;
    const s3BucketName = process.env.INVOKING_BUCKET !== undefined ?
        process.env.INVOKING_BUCKET : false;

    if(!branchName) {
        return false;
    }
    if(!s3BucketName) {
        return false;
    }
    const params = {
        Bucket: s3BucketName,
        Key: `${branchName}-${triggerDateTime}-trigger.json`,
        Body: JSON.stringify({success: true,
            startProd: true,
            branch: branchName
        })
    }

    await s3.putObject(params, (err, data) => {
        if(err) console.log(err, err.stack);
        else    console.log('File created');
    }).promise();


    // Notify CodePipeline of a successful job
    // const putJobSuccess = function(message) {
    //     const params = {
    //         jobId: jobId
    //     };
    //     codepipeline.putJobSuccessResult(params, function(err, data) {
    //         if(err) {
    //             context.fail(err);
    //         } else {
    //             context.succeed(message);
    //         }
    //     });
    // };
    //
    // // Notify CodePipeline of a failed job
    // const putJobFailure = function(message) {
    //     const params = {
    //         jobId: jobId,
    //         failureDetails: {
    //             message: JSON.stringify(message),
    //             type: 'JobFailed',
    //             externalExecutionId: context.awsRequestId
    //         }
    //     };
    //     codepipeline.putJobFailureResult(params, function(err, data) {
    //         context.fail(message);
    //     });
    // };
    //
    // putJobSuccess("Successfully reached the invoker lambda");
}
