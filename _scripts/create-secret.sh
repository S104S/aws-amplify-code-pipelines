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
elif [ "$PARAM_LOCAL" = "n" ]
then
     aws secretsmanager create-secret --name gh-token --region us-west-2 --description "Access token to GH" \
     --secret-string "{\"key\":\"\"}"

     aws secretsmanager create-secret --name aws-amplify-pipelines-password --region us-west-2 \
      --description "Credential password for amplify app" --secret-string "zoipdrat"
fi

