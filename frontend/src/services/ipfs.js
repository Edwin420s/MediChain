import { Web3Storage } from 'web3.storage';

class IPFSService {
  constructor() {
    this.client = new Web3Storage({ 
      token: import.meta.env.VITE_WEB3_STORAGE_TOKEN 
    });
    this.gateways = [
      'https://ipfs.io/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/',
      'https://dweb.link/ipfs/',
      'https://gateway.pinata.cloud/ipfs/'
    ];
  }

  async uploadFile(file, options = {}) {
    try {
      // Encrypt file before upload (in a real implementation)
      const encryptedFile = await this.encryptFile(file);
      
      const cid = await this.client.put([encryptedFile], {
        name: file.name,
        maxRetries: 3,
        wrapWithDirectory: false,
        ...options
      });

      return {
        success: true,
        cid: cid,
        url: this.getGatewayUrl(cid),
        filename: file.name,
        size: file.size,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      return this.fallbackUpload(file, options);
    }
  }

  async uploadEncryptedFile(encryptedBuffer, filename) {
    try {
      const file = new File([encryptedBuffer], filename, {
        type: 'application/octet-stream'
      });

      return await this.uploadFile(file);
    } catch (error) {
      console.error('Error uploading encrypted file:', error);
      return { success: false, error: error.message };
    }
  }

  async retrieveFile(cid, options = {}) {
    try {
      const res = await this.client.get(cid);
      
      if (!res.ok) {
        throw new Error(`Failed to get ${cid} - ${res.status}`);
      }

      const files = await res.files();
      
      if (files.length === 0) {
        throw new Error(`No files found for CID: ${cid}`);
      }

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      return {
        success: true,
        data: buffer,
        filename: file.name,
        contentType: file.type,
        size: file.size
      };
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      return this.fallbackRetrieve(cid, options);
    }
  }

  async fallbackUpload(file, options) {
    // Fallback to Pinata if Web3.Storage fails
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
          'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_KEY,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        cid: data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
        filename: file.name,
        size: file.size,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Fallback upload also failed:', error);
      return { success: false, error: error.message };
    }
  }

  async fallbackRetrieve(cid, options) {
    // Try different gateways
    for (const gateway of this.gateways) {
      try {
        const response = await fetch(gateway + cid, {
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          return {
            success: true,
            data: new Uint8Array(arrayBuffer),
            filename: cid,
            contentType: response.headers.get('content-type'),
            size: arrayBuffer.byteLength
          };
        }
      } catch (error) {
        console.warn(`Gateway ${gateway} failed:`, error.message);
        continue;
      }
    }

    return {
      success: false,
      error: `Failed to retrieve file from all gateways: ${cid}`
    };
  }

  getGatewayUrl(cid) {
    return `https://${cid}.ipfs.dweb.link`;
  }

  async encryptFile(file) {
    // In a real implementation, this would encrypt the file
    // For now, we'll return the original file
    return file;
  }

  async decryptFile(encryptedBuffer) {
    // In a real implementation, this would decrypt the file
    // For now, we'll return the original buffer
    return encryptedBuffer;
  }

  async pinJSON(data) {
    try {
      const blob = new Blob([JSON.stringify(data)], { 
        type: 'application/json' 
      });
      const file = new File([blob], 'metadata.json');
      
      return await this.uploadFile(file);
    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error);
      return { success: false, error: error.message };
    }
  }

  async retrieveJSON(cid) {
    try {
      const result = await this.retrieveFile(cid);
      
      if (!result.success) {
        return result;
      }

      const text = new TextDecoder().decode(result.data);
      const data = JSON.parse(text);
      
      return {
        success: true,
        data: data,
        cid: cid
      };
    } catch (error) {
      console.error('Error retrieving JSON from IPFS:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create a singleton instance
const ipfsService = new IPFSService();
export default ipfsService;