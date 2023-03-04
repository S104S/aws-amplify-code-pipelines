#!/bin/bash

REGION=$1
PROFILE=$2
SECRETID=$3

aws secretsmanager update-secret \
        --secret-id $SECRETID \
        --region $REGION \
        --profile $PROFILE \
        --description "token to access github repo" \
        --secret-string "{\"key\":\"\"}"