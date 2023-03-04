exports.handler = async (event) => {
    const response = {
        headers: {'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'},
        statusCode: 200,
        body: JSON.stringify('Hello from CDK!')
    };
    return response;
}