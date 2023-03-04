ENV=$1
CLIENT=$2
LOCAL=$3

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

BASEDIR="$( cd $DIR/.. && pwd)"

echo $BASEDIR
### Adding DB URL
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/db/url" '' String $LOCAL
### Adding DB POrt
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/db/port" '5432' String $LOCAL
### Adding DB Name
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/db/name" 'production' String $LOCAL
### Adding name of DynomoDB Table Name
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/dynamo/tableName" '' String $LOCAL
### Adding Secret including the DB Information secret name
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/$CLIENT/dbinfo-secret-name" "" String $LOCAL
### Adding Clients to process
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/clients" "beachhouse" StringList $LOCAL
### Adding Secret including the DB Information secret name
sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/lambda-subnets" "" StringList $LOCAL

sh $BASEDIR/_scripts/create-ssm-params.sh "/sdx/$ENV/pandas-numpy-layer-arn" "" String $LOCAL