"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const grpc = __importStar(require("@grpc/grpc-js"));
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const channelName = 'report-hub-channel';
const chaincodeName = 'REPORT-HUB';
const mspId = 'Org1MSP';
const peerEndpoint = 'localhost:7051';
const peerHostAlias = 'peer0.org1.example.com';
class Connection {
    init() {
        initFabric();
    }
}
exports.Connection = Connection;
const initFabric = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield newGrpcConnection();
    const gateway = (0, fabric_gateway_1.connect)({
        client,
        identity: yield newIdentity(),
        signer: yield newSigner(),
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
        console.log(network);
        const reportContract = network.getContract(chaincodeName);
        console.log(reportContract);
        Connection.reportContract = reportContract;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        console.log("Connected to report-hub");
    }
});
const newGrpcConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const tlsRootCert = (0, fs_1.readFileSync)('cacert.pem');
    const tlsCreds = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCreds, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
});
const newIdentity = () => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = (0, fs_1.readFileSync)('signcert.pem');
    return { mspId, credentials };
});
const newSigner = () => __awaiter(void 0, void 0, void 0, function* () {
    const keyPath = (0, path_1.resolve)('privatekey.pem');
    const privateKeyPem = (0, fs_1.readFileSync)(keyPath);
    const privateKey = (0, crypto_1.createPrivateKey)(privateKeyPem);
    return fabric_gateway_1.signers.newPrivateKeySigner(privateKey);
});
