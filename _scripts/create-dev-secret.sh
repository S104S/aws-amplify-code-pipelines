#!/bin/bash

REGION=$1

aws secretsmanager create-secret \
        --name sdx-gh-classic-token \
        --region $REGION \
        --profile sdxdev \
        --description "classic gh token" \
        --secret-string "{\"key\":\"\"}"