import path from 'node:path';
import multer from 'multer';

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// Set up multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {fileSize: 5 * 1024 * 1024} // 5MB max file size
});

export default upload;
