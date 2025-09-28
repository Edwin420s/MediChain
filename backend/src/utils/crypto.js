import crypto from 'crypto';
import bcrypt from 'bcryptjs';

class CryptoUtils {
  // Generate random encryption key
  static generateKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate IV for encryption
  static generateIV() {
    return crypto.randomBytes(16); // 128 bits for AES
  }

  // Encrypt data using AES-256-GCM
  static encryptData(data, key) {
    try {
      const iv = this.generateIV();
      const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        success: true,
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Decrypt data using AES-256-GCM
  static decryptData(encryptedData, key, iv, authTag) {
    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm', 
        Buffer.from(key, 'hex'), 
        Buffer.from(iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return {
        success: true,
        decryptedData: decrypted
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Hash data (for record hashing)
  static hashData(data, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  // Generate HMAC signature
  static generateHMAC(data, secret) {
    return crypto.createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  // Verify HMAC signature
  static verifyHMAC(data, signature, secret) {
    const expectedSignature = this.generateHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Password hashing
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Password verification
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Generate secure random token
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate key pair for asymmetric encryption
  static generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
  }

  // RSA encryption
  static encryptWithPublicKey(data, publicKey) {
    try {
      const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data));
      return {
        success: true,
        encryptedData: encrypted.toString('base64')
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // RSA decryption
  static decryptWithPrivateKey(encryptedData, privateKey) {
    try {
      const decrypted = crypto.privateDecrypt(
        privateKey, 
        Buffer.from(encryptedData, 'base64')
      );
      return {
        success: true,
        decryptedData: decrypted.toString('utf8')
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate cryptographic nonce
  static generateNonce(length = 16) {
    return crypto.randomBytes(length).toString('hex');
  }

  // PBKDF2 key derivation
  static deriveKey(password, salt, iterations = 100000, keyLength = 32) {
    return crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');
  }
}

export default CryptoUtils;