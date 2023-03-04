ENV=$1
CLIENT=$2
LOCAL=$3

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

BASEDIR="$( cd $DIR/.. && pwd)"

echo $BASEDIR
### Adding DB URL
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/db/url" 'wphprod.cp4ahpddesxd.us-east-1.rds.amazonaws.com' String $LOCAL
### Adding DB POrt
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/db/port" '5432' String $LOCAL
### Adding DB Name
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/db/name" 'production' String $LOCAL
### Adding name of DynomoDB Table Name
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/dynamo/tableName" 'FindingReviewStatus-2aqk7gwnb5dvzm4b4uuh35jynm-wphdev' String $LOCAL
### Adding Secret including the DB Information secret name
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/dbinfo-secret-name" "WphDbInfo" String $LOCAL
### Adding Clients to process
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/clients" "wphdev,mcldev" StringList $LOCAL
### Adding Secret including the DB Information secret name
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/lambda-subnets" "subnet-ae150ca1,subnet-e9a3c8d7" StringList $LOCAL

sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/pandas-numpy-layer-arn" "arn:aws:lambda:us-east-1:166979434163:layer:pandasPlusNumpy:1" String $LOCAL