import { Web3Storage } from 'web3.storage';

class IPFSService {
  constructor() {
    this.client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });
  }

  async uploadFile(file) {
    try {
      const cid = await this.client.put([file], {
        name: file.name,
        maxRetries: 3,
      });

      return {
        success: true,
        cid: cid,
        url: `https://${cid}.ipfs.dweb.link/${file.name}`
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      return { success: false, error: error.message };
    }
  }

  async retrieveFile(cid) {
    try {
      const res = await this.client.get(cid);
      if (!res.ok) {
        throw new Error(`Failed to get ${cid}`);
      }

      const files = await res.files();
      return {
        success: true,
        files: files
      };
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new IPFSService();