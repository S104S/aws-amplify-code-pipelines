#!/bin/bash

REGION=$1

aws secretsmanager create-secret \
        --name sdx-gh-classic-token \
        --region $REGION \
        --profile sdxdev \
        --description "sdx classic gh token" \
        --secret-string "{\"key\":\"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\"}"