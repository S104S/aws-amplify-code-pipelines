#!/bin/bash
LAMBDA_NAME=$1
OUT_FILE=$2

#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
#
#BASEDIR="$( cd $DIR/.. && pwd)"


#if [ -e ${BASEDIR}/_scripts/response.json ];
#then
#  rm ${BASEDIR}/_scripts/response.json
#fi
awslocal lambda invoke --function-name $LAMBDA_NAME $OUT_FILE