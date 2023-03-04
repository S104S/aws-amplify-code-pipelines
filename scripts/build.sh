#project=$1
#env=$2
#profile=$3
#deploy=$4
#region=$5

env_file=$1
source ${env_file}

echo $PROJECT
echo $PWD

parentDir="$(dirname "$PWD")"
baseDir="${PWD}/${PROJECT}"
projectCdkDir="${baseDir}/_cdk"

echo "parent dir"
echo $parentDir
echo $baseDir
echo $projectCdkDir
echo $BASH_CDK_ENV
echo $DEPLOY

echo "local it is"
export CDKACCOUNTID=000000000000
export CDKREGION=us-west-2
export CDK_NEW_BOOTSTRAP=1

cd $projectCdkDir

if [[ "$DEPLOY" == "y" ]]; then
  cdklocal deploy -c config=$BASH_CDK_ENV
else
  cdklocal synth -c config=$BASH_CDK_ENV
fi

#else
#  export CDKACCOUNTID=473909917230
#  export CDKREGION=us-west-2
#
#  cdk bootstrap --force --profile $profile
#  cdk synth -c config="$env" --profile $profile
#fi
