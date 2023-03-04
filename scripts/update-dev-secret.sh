#!/bin/bash

REGION=$1
PROFILE=$2
SECRETID=$3

aws secretsmanager update-secret \
        --secret-id $SECRETID \
        --region $REGION \
        --profile $PROFILE \
        --description "token to access github repo" \
        --secret-string "{\"key\":\"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\"}"