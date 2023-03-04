const assert = require('assert'),
    AWS = require('aws-sdk'),
    http = require('http');

exports.handler = async (event, context) => {
    const codepipeline = new AWS.CodePipeline();
    // const jobId = event["CodePipeline.job"].id;
    const dateTime = new Date().toDateString();
    const params = {
        name: 'POCCDKPipeline'
    }
    console.log('params');
    console.log(params);
    await codepipeline.startPipelineExecution(params, (err, data) => {
        console.log('error starting pipeline');
        console.log(err.message);
        console.log(data);
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

    // Notify CodePipeline of a failed job
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