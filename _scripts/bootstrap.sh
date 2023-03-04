  env_file=$1
  source ${env_file}

  parentDir="$(dirname "$PWD")"
  baseDir="${PWD}/${PROJECT}"

  echo ${PROJECT}

  export CDKACCOUNTID=${AWS_ACCOUNT_ID}
  export CDKREGION=${REGION}
  export CDK_NEW_BOOTSTRAP=1

  cdklocal bootstrap aws://$CDKACCOUNTID/$CDKREGION -c config=$BASH_CDK_ENV
#  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
