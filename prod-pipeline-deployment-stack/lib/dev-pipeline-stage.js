const {CfnOutput, Construct, Stage, StageProps } = require("aws-cdk-lib"),
        AmplifyViaCdkApp = require('./gen-amplify-app');
module.exports = class AmplifyCdkStackStage extends Stage {
    constructor(scope, id, props) {
        super(scope, id, props);

        AmplifyViaCdkApp(this, props.amplifyAppProps);
    }
}