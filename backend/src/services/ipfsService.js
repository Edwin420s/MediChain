import axios from 'axios';
import FormData from 'form-data';

class IPFSService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecret = process.env.PINATA_SECRET_API_KEY;
    this.web3StorageToken = process.env.WEB3_STORAGE_TOKEN;
  }

  async uploadFile(file) {
    try {
      // Using Pinata for IPFS pinning
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });

      const metadata = JSON.stringify({
        name: file.originalname,
        keyvalues: {
          timestamp: Date.now().toString(),
          type: 'medical_record'
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: 'Infinity',
          headers: {
            ...formData.getHeaders(),
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecret,
          },
        }
      );

      return {
        success: true,
        cid: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      
      // Fallback to Web3.Storage
      return await this.uploadToWeb3Storage(file);
    }
  }

  async uploadToWeb3Storage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });

      const response = await axios.post(
        'https://api.web3.storage/upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.web3StorageToken}`,
            ...formData.getHeaders()
          },
          maxBodyLength: Infinity
        }
      );

      return {
        success: true,
        cid: response.data.cid,
        url: `https://${response.data.cid}.ipfs.dweb.link`
      };
    } catch (error) {
      console.error('Error uploading to Web3.Storage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async retrieveFile(cid) {
    try {
      // Try Pinata first
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${cid}`,
        { responseType: 'arraybuffer' }
      );

      return {
        success: true,
        data: response.data,
        contentType: response.headers['content-type']
      };
    } catch (error) {
      console.error('Error retrieving from Pinata:', error);
      
      // Fallback to public gateways
      const gateways = [
        `https://ipfs.io/ipfs/${cid}`,
        `https://cloudflare-ipfs.com/ipfs/${cid}`,
        `https://dweb.link/ipfs/${cid}`
      ];

      for (const gateway of gateways) {
        try {
          const response = await axios.get(gateway, { 
            responseType: 'arraybuffer',
            timeout: 5000 
          });
          return {
            success: true,
            data: response.data,
            contentType: response.headers['content-type']
          };
        } catch (err) {
          continue;
        }
      }

      return {
        success: false,
        error: 'Failed to retrieve file from all gateways'
      };
    }
  }

  async pinJSON(data) {
    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataContent: data,
          pinataMetadata: {
            name: 'medical-record-metadata',
            keyvalues: {
              timestamp: Date.now().toString(),
              type: 'metadata'
            }
          }
        },
        {
          headers: {
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecret,
          }
        }
      );

      return {
        success: true,
        cid: response.data.IpfsHash
      };
    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new IPFSService();