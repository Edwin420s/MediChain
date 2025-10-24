import multer from 'multer';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

/**
 * Enhanced file validation middleware with security checks
 * Validates file types, sizes, and content to prevent malicious uploads
 */

// Allowed MIME types for medical records
const ALLOWED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff',
  
  // Medical imaging
  'application/dicom',
  'application/x-dicom',
  
  // Text
  'text/plain',
  'text/csv',
  
  // Spreadsheets
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// File extensions mapping
const EXTENSION_TO_MIME = {
  'pdf': 'application/pdf',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'tiff': 'image/tiff',
  'txt': 'text/plain',
  'csv': 'text/csv',
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'dcm': 'application/dicom'
};

// Maximum file size (default 10MB, can be configured via env)
const MAX_FILE_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024;

/**
 * Validate file type by checking both extension and MIME type
 */
function validateFileType(file) {
  const extension = file.originalname.split('.').pop().toLowerCase();
  const expectedMimeType = EXTENSION_TO_MIME[extension];

  // Check if extension is allowed
  if (!expectedMimeType) {
    return {
      valid: false,
      error: `File extension .${extension} is not allowed. Allowed types: ${Object.keys(EXTENSION_TO_MIME).join(', ')}`
    };
  }

  // Check if MIME type matches extension (prevent MIME type spoofing)
  if (file.mimetype !== expectedMimeType && !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `MIME type mismatch: expected ${expectedMimeType} for .${extension} file, got ${file.mimetype}`
    };
  }

  return { valid: true };
}

/**
 * Validate file content (check for malicious patterns)
 */
async function validateFileContent(buffer) {
  // Check for null bytes (often used in exploits)
  if (buffer.includes(0x00)) {
    logger.warn('File contains null bytes, potential security risk');
  }

  // Check for executable signatures
  const executableSignatures = [
    Buffer.from([0x4D, 0x5A]), // MZ (DOS/Windows executable)
    Buffer.from([0x7F, 0x45, 0x4C, 0x46]), // ELF (Linux executable)
    Buffer.from([0xCF, 0xFA, 0xED, 0xFE]), // Mach-O (macOS executable)
  ];

  for (const signature of executableSignatures) {
    if (buffer.slice(0, signature.length).equals(signature)) {
      return {
        valid: false,
        error: 'Executable files are not allowed'
      };
    }
  }

  // Check for script tags in files (XSS prevention)
  const fileContent = buffer.toString('utf8', 0, Math.min(buffer.length, 10000));
  const scriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  if (scriptRegex.test(fileContent)) {
    logger.warn('File contains script tags, potential XSS risk');
  }

  return { valid: true };
}

/**
 * Generate file hash for integrity verification
 */
function generateFileHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Sanitize filename to prevent directory traversal and injection attacks
 */
function sanitizeFilename(filename) {
  // Remove directory traversal patterns
  let sanitized = filename.replace(/\.\./g, '');
  
  // Remove special characters except dots, hyphens, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit filename length
  if (sanitized.length > 255) {
    const extension = sanitized.split('.').pop();
    sanitized = sanitized.substring(0, 255 - extension.length - 1) + '.' + extension;
  }

  return sanitized;
}

/**
 * Multer configuration with enhanced security
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Validate file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) {
    logger.warn(`File upload rejected: ${typeValidation.error}`, {
      userId: req.user?.id,
      filename: file.originalname,
      mimetype: file.mimetype
    });
    return cb(new Error(typeValidation.error), false);
  }

  // Sanitize filename
  file.originalname = sanitizeFilename(file.originalname);

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Allow only one file per request
  }
});

/**
 * Enhanced file validation middleware
 */
export const validateFile = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  try {
    // Validate file content
    const contentValidation = await validateFileContent(req.file.buffer);
    if (!contentValidation.valid) {
      logger.warn(`File content validation failed: ${contentValidation.error}`, {
        userId: req.user?.id,
        filename: req.file.originalname
      });
      return res.status(400).json({
        success: false,
        error: contentValidation.error
      });
    }

    // Generate file hash for integrity
    req.file.hash = generateFileHash(req.file.buffer);

    // Log successful upload
    logger.info('File validated successfully', {
      userId: req.user?.id,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      hash: req.file.hash
    });

    next();
  } catch (error) {
    logger.error('File validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'File validation failed'
    });
  }
};

/**
 * Middleware to check file size before processing
 */
export const checkFileSize = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
    return res.status(413).json({
      success: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    });
  }
  next();
};

export { upload, ALLOWED_MIME_TYPES, MAX_FILE_SIZE };
export default upload;
