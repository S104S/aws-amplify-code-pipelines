const {CfnOutput, Construct, Stage, StageProps } = require("aws-cdk-lib"),
    AmplifyAppBackend = require('./gen-amplify-backend');
module.exports = class AmplifyBackendStage extends Stage {
    constructor(scope, id, props) {
        super(scope, id, props);

        AmplifyAppBackend(this, props.amplifyAppProps);
    }
}