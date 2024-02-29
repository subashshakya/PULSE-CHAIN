import { express } from 'express';
import { readFile, readFileSync } from 'fs';
import { resolve } from 'path';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import { createPrivateKey } from 'crypto';
import { TextDecoder } from 'util';
import { bodyParser } from 'body-parser';

const app = express();
const port = 3000;
const channelName = 'report-hub-channel';
const chaincodename = 'REPORT-HUB';
const mspId = 'Org1MSP';
const utf8Decoder = new TextDecoder();
const peerEndpoint = 'localhost:7051';
const peerHostAlias = 'peer0.org1.example.com';

app.get('/', async (req, res) => {
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

  let result;
  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodename);
    const resultBytes = await contract.evaluateTransaction('');
    const resultJson = utf8Decoder.decode(resultBytes);
    result = JSON.parse(resultJson);
  } finally {
    gateway.close();
    client.close();
  }
  res.send(result);
});

const newGrpcConnection = async () => {
  const tlsRootCert = readFileSync('cacert.pem', () => { });
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new ClientRequest(
    peerEndpoint,
    tlsCredentials,
    {
      'grpc.ssl_target_name_override': peerHostAlias,
    }
  );
}

const newIdentity = async () => {
  const creds = readFileSync('signcert.pem', () => { });
  return { mspId, creds };
}

const newSigner = async () => {
  const keyPath = resolve('privatekey.pem');
  const privatekeyPem = readFileSync(keyPath, () => { });
  const privateKey = createPrivateKey(privatekeyPem);
  return signers.newPrivateKeySigner(privateKey);
}
