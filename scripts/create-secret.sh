#!/bin/bash

PARAM_LOCAL=$1
REGION=$2

if [ "$PARAM_LOCAL" = "y" ]
then
    awslocal secretsmanager create-secret \
        --name hello-amplify-creds \
        --region $REGION \
        --description "Credential password for amplify app" \
        --secret-string "{\"username\":\"admin\",\"password\":\"zoipdrat\"}"

      awslocal secretsmanager create-secret \
              --name hello-amplify-password \
              --region $REGION \
              --description "Credential password for amplify app" \
              --secret-string "zoipdrat"
fi
#elif [ "$PARAM_LOCAL" = "n" ]
#then
  # aws secretsmanager create-secret \
  #  --name WphDbInfo \
  #  --region $REGION \
  #  --profile sdx \
  #  --description "Connection information for WPH Postgres." \
  #  --secret-string "{\"user\":\"postgresuser\",\"password\":\"phYyvh#RG1UiJ!t736QbdRQ0vcaP\"}"
#  aws secretsmanager put-secret-value \
#  	--secret-id WphDbInfo \
#  	--region $REGION \
#  	--profile sdx \
#	--secret-string "{\"user\":\"postgrestuser\",\"password\":\"phYyvh#RG1UiJ!t736QbdRQ0vcaP\"}"
#fi

 aws secretsmanager create-secret --name gh-token --region us-east-2 --description "Access token to GH" \
 --profile sdx \
 --secret-string "{\"key\":\"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\"}"

 aws secretsmanager create-secret --name hello-amplify-password --region us-east-1 --description "Credential password for amplify app" --secret-string "zoipdrat"