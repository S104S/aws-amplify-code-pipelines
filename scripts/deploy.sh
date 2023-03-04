profile=$1

export CDKACCOUNTID=166979434163
export CDKREGION=us-east-1

#cdk bootstrap --force --profile $profile
cdk deploy --profile $profile