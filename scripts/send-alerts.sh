#!/bin/bash

echo [`date`]": Start sending"

curDate=$(date +"%m-%d-%Y")

send="curl http://95.111.192.198:3000/send-backup-verifier/${curDate}"

echo $send

RESPONSE=`$send`

echo [`date`]": End"
