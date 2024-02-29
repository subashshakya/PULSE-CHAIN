#!/bin/bash

set -e

export MSYS_NO_PATH=1

CC_SRC_LANGUAGE="javascript"

CC_SRC_PATH="../../chaincode/"

rm -rf javascript/wallet/*
rm -rf java/wallet/*
rm -rf typescript/wallet/*
rm -rf go/wallet/*

pushd ../fabric-samples/test-network
./network.sh down
./network.sh up createChannel -ca -c report-hub-channel -s couchdb
./network.sh deployCC -c report-hub-channel -ccn REPORT-HUB -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
popd

./get_user_MSP.sh