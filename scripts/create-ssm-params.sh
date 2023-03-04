#!/bin/bash

PARAM_NAME=$1
PARAM_VALUE=$2
PARAM_TYPE=$3
PARAM_LOCAL=$4

if [ "$PARAM_LOCAL" = "y" ]
then
  awslocal ssm put-parameter --name $PARAM_NAME --value $PARAM_VALUE --type $PARAM_TYPE
elif [ "$PARAM_LOCAL" = "n" ]
then
  aws ssm put-parameter --name $PARAM_NAME --value $PARAM_VALUE --type $PARAM_TYPE --region us-east-1 --profile sdx
fi
