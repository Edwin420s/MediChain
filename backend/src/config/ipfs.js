import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

export default client;