profile=$1

export CDKACCOUNTID=099583572831
export CDKREGION=us-west-2

#cdk bootstrap --force --profile $profile
cdk deploy --profile $profile