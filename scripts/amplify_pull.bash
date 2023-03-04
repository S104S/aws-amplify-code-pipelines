#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"npm run-script build\",\
\"StartCommand\":\"npm run-script start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"AKIASNYF762Z7NXJG7JR\",\
\"secretAccessKey\":\"$npm_config_secret_access_key\",\
\"region\":\"us-east-1\"\
}"
AUTHCONFIG="{\
\"userPoolId\":\"${AMPLIFY_USERPOOL_ID}\",\
\"webClientId\":\"${AMPLIFY_WEBCLIENT_ID}\",\
\"nativeClientId\":\"${AMPLIFY_NATIVECLIENT_ID}\"\
}"

CATEGORIES="{\
\"auth\":$AUTHCONFIG\
}"

AMPLIFY="{\
\"projectName\":\"rule_analytics\",\
\"appId\":\"d3ve102b4vjh1q\",\
\"envName\":\"${USER_BRANCH}\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify pull \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--categories $CATEGORIES \
--yes
