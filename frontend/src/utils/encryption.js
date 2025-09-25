import { AES, enc, mode, pad } from 'crypto-js';

class EncryptionService {
  constructor() {
    this.keySize = 256;
    this.ivSize = 128;
    this.iterations = 1000;
  }

  generateKey() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: this.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: this.keySize },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(data, password) {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const key = await this.deriveKey(password, salt);
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);

      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encodedData
      );

      // Combine salt + iv + encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      combined.set(salt);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encrypted), salt.length + iv.length);

      return {
        success: true,
        data: combined.buffer,
        salt: Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(''),
        iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      return { success: false, error: error.message };
    }
  }

  async decryptData(encryptedData, password, saltHex, ivHex) {
    try {
      const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

      const key = await this.deriveKey(password, salt);
      
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encryptedData
      );

      const decoder = new TextDecoder();
      return {
        success: true,
        data: decoder.decode(decrypted)
      };
    } catch (error) {
      console.error('Decryption error:', error);
      return { success: false, error: error.message };
    }
  }

  // Simple AES encryption for non-sensitive data
  encryptSimple(text, key) {
    try {
      const encrypted = AES.encrypt(text, key).toString();
      return { success: true, data: encrypted };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  decryptSimple(encryptedText, key) {
    try {
      const decrypted = AES.decrypt(encryptedText, key).toString(enc.Utf8);
      return { success: true, data: decrypted };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // File encryption
  async encryptFile(file, password) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const result = await this.encryptData(
          new Uint8Array(arrayBuffer),
          password
        );
        resolve(result);
      };
      
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' });
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  async decryptFile(encryptedBuffer, password, salt, iv) {
    return this.decryptData(encryptedBuffer, password, salt, iv);
  }

  // Key management utilities
  generateKeyPair() {
    return window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async exportKey(key, type = 'jwk') {
    return window.crypto.subtle.exportKey(type, key);
  }

  async importKey(jwk, type = 'jwk', keyUsages) {
    return window.crypto.subtle.importKey(type, jwk, {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    }, true, keyUsages);
  }
}

// Create a singleton instance
const encryptionService = new EncryptionService();
export default encryptionService;