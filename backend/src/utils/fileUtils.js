import crypto from 'crypto';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';

class FileUtils {
  // Allowed file types for medical records
  static ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Validate file type and size
  static async validateFile(file) {
    const errors = [];

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      errors.push(`File size exceeds limit of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Check MIME type
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`);
    }

    // Verify file type using magic numbers
    try {
      const fileType = await fileTypeFromBuffer(file.buffer);
      if (fileType && !this.ALLOWED_MIME_TYPES.includes(fileType.mime)) {
        errors.push(`File type verification failed. Detected: ${fileType.mime}`);
      }
    } catch (error) {
      errors.push('Unable to verify file type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate file hash for integrity checking
  static generateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Sanitize filename
  static sanitizeFilename(filename) {
    return filename
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-zA-Z0-9.\-_]/g, '_') // Replace special characters
      .replace(/_+/g, '_') // Replace multiple underscores
      .substring(0, 255); // Limit length
  }

  // Get file extension
  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  // Generate secure random filename
  static generateSecureFilename(originalName) {
    const extension = this.getFileExtension(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `file_${timestamp}_${random}${extension}`;
  }

  // Calculate file storage path
  static getStoragePath(userId, recordId, filename) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    return `users/${userId}/records/${year}/${month}/${recordId}/${filename}`;
  }

  // Check if file is an image
  static isImage(mimeType) {
    return mimeType.startsWith('image/');
  }

  // Check if file is a document
  static isDocument(mimeType) {
    return [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ].includes(mimeType);
  }

  // Get file category based on MIME type
  static getFileCategory(mimeType) {
    if (this.isImage(mimeType)) return 'image';
    if (this.isDocument(mimeType)) return 'document';
    if (mimeType.includes('sheet')) return 'spreadsheet';
    return 'other';
  }

  // Validate file for medical record specific requirements
  static async validateMedicalRecordFile(file) {
    const basicValidation = await this.validateFile(file);
    
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    const additionalErrors = [];

    // Additional medical record specific validations
    if (file.mimetype === 'application/pdf') {
      // Check if PDF is not encrypted or password protected
      // This would require PDF parsing library in real implementation
    }

    if (this.isImage(file.mimetype)) {
      // Validate image dimensions, etc.
      // This would require image processing in real implementation
    }

    return {
      isValid: additionalErrors.length === 0,
      errors: [...basicValidation.errors, ...additionalErrors]
    };
  }

  // Calculate storage cost (for billing purposes)
  static calculateStorageCost(fileSize, storageDuration) {
    // Basic calculation - would be more complex in real implementation
    const costPerMB = 0.01; // $0.01 per MB per month
    const sizeInMB = fileSize / 1024 / 1024;
    return (sizeInMB * costPerMB * storageDuration).toFixed(2);
  }

  // Generate file metadata
  static generateFileMetadata(file, userId, recordType) {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: userId,
      recordType: recordType,
      uploadedAt: new Date().toISOString(),
      category: this.getFileCategory(file.mimetype),
      hash: this.generateFileHash(file.buffer)
    };
  }

  // Compress file if needed (placeholder for implementation)
  static async compressFile(buffer, mimeType) {
    // This would implement file compression based on type
    // For now, return original buffer
    return buffer;
  }

  // Create thumbnail for images (placeholder for implementation)
  static async createThumbnail(buffer, mimeType) {
    if (!this.isImage(mimeType)) {
      return null;
    }
    
    // This would create a thumbnail using sharp or similar library
    // For now, return null
    return null;
  }
}

export default FileUtils;