#!/bin/bash

export MSYS_NO_PATHCONV=1

USER_MSP_SOURCE_PATH="../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp"
USER_MSP_DESTINATION_PATH="../api/"

cp ${USER_MSP_SOURCE_PATH}/cacerts/* ${USER_MSP_DESTINATION_PATH}/cacert.pem
cp ${USER_MSP_SOURCE_PATH}/keystore/*  ${USER_MSP_DESTINATION_PATH}/privatekey.pem
cp ${USER_MSP_SOURCE_PATH}/signcerts/*  ${USER_MSP_DESTINATION_PATH}/signcert.pem

echo "Copied CA Certificate to cacert.pem"
echo "Copied Private Key to privatekey.pem"
echo "Copied Signed Certificate to signcert.pem"
