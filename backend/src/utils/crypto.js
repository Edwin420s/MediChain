import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export class CryptoUtils {
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static generateSecretKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  static generateIV() {
    return crypto.randomBytes(16);
  }

  static encryptText(text, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
      encryptedText: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  static decryptText(encryptedData, key) {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(key, 'hex'),
      Buffer.from(encryptedData.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    let decrypted = decipher.update(encryptedData.encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

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

  static hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  static validateHash(data, hash) {
    return this.hashData(data) === hash;
  }
}

export default CryptoUtils;