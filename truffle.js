const connectionConfig = require('frg-ethereum-runners/config/network_config.json');
const HDWalletProvider = require('truffle-hdwallet-provider');

require('dotenv').config();

const mainnetUrl = 'https://mainnet.infura.io/v3/2521699167dc43c8b4c15f07860c208a';

function keystoreProvider (providerURL) {
  const fs = require('fs');
  const EthereumjsWallet = require('ethereumjs-wallet');

  const KEYFILE = process.env.KEYFILE;
  const PASSPHRASE = (process.env.PASSPHRASE || '');
  if (!KEYFILE) {
    throw new Error('Expected environment variable KEYFILE with path to ethereum wallet keyfile');
  }

  const KEYSTORE = JSON.parse(fs.readFileSync(KEYFILE));
  const wallet = EthereumjsWallet.fromV3(KEYSTORE, PASSPHRASE);
  return new HDWalletProvider(wallet._privKey.toString('hex'), providerURL);
}

module.exports = {
  networks: {
    ganacheUnitTest: connectionConfig.ganacheUnitTest,
    gethUnitTest: connectionConfig.gethUnitTest,
    testrpcCoverage: connectionConfig.testrpcCoverage,
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.ROPSTEN_PROVIDER),
      network_id: 3,
      gas: 3000000,
      gasPrice: 10000000000
    },
    mainnet: {
      ref: 'mainnet-prod',
      network_id: 1,
      provider: () => keystoreProvider(mainnetUrl),
      gasPrice: 30000000000
    }
  },
  mocha: {
    enableTimeouts: false,
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD'
    }
  },
  compilers: {
    solc: {
      version: '0.5.16'
    }
  }
};
