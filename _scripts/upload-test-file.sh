privateKeyPath=$1

#sftp -i $privateKeyPath bryan.client.dev@vpce-0bc667fa7e7a03122-04dqug2i.vpce-svc-0f925367b780bc1d4.us-west-2.vpce.amazonaws.com

sftp -i ~/.ssh/id_aws_transfer_rsa replay.tool.dev.request@vpce-0bc667fa7e7a03122-04dqug2i.vpce-svc-0f925367b780bc1d4.us-west-2.vpce.amazonaws.com
