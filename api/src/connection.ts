import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { createPrivateKey } from 'crypto';

const channelName = 'report-hub-channel';
const chaincodeName = 'REPORT-HUB';
const mspId = 'Org1MSP';
const peerEndpoint = 'localhost:7051';
const peerHostAlias = 'peer0.org1.example.com';

export class Connection {
  public static reportContract: Contract;
  public init() {
    initFabric()
  }
}

const initFabric = async () => {
  const client = await newGrpcConnection();

  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
    evaluateOptions: () => {
      return { deadline: Date.now() + 5000 };
    },
    endorseOptions: () => {
      return { deadline: Date.now() + 15000 };
    },
    submitOptions: () => {
      return { deadline: Date.now() + 5000 };
    },
    commitStatusOptions: () => {
      return { deadline: Date.now() + 6000 };
    }
  });

  try {
    const network = gateway.getNetwork(channelName);
    console.log(network)
    const reportContract = network.getContract(chaincodeName);
    console.log(reportContract)
    Connection.reportContract = reportContract;
  } catch (err) {
    console.log(err);
  } finally {
    console.log("Connected to report-hub")
  }
}

const newGrpcConnection = async () => {
  const tlsRootCert = readFileSync('cacert.pem');
  const tlsCreds = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(
    peerEndpoint,
    tlsCreds,
    {
      'grpc.ssl_target_name_override': peerHostAlias,
    }
  );
}

const newIdentity = async () => {
  const credentials = readFileSync('signcert.pem');
  return { mspId, credentials };
}

const newSigner = async () => {
  const keyPath = resolve('privatekey.pem');
  const privateKeyPem = readFileSync(keyPath);
  const privateKey = createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}