const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getStudyMaterials,
  getStudyMaterial,
  uploadStudyMaterial,
  generateMaterialSummary,
  updateStudyMaterial,
  deleteStudyMaterial,
  getSubjectsByDepartment
} = require('../controllers/studyMaterialController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = /pdf|doc|docx|ppt|pptx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/pdf' || 
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   file.mimetype === 'text/plain';

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, PPT, PPTX, and TXT files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Public routes (with auth)
router.get('/', auth, getStudyMaterials);
router.get('/subjects/:department', auth, getSubjectsByDepartment);
router.get('/:id', auth, getStudyMaterial);
router.post('/:id/summary', auth, generateMaterialSummary);

// Admin only routes
router.post('/', adminAuth, upload.single('file'), uploadStudyMaterial);
router.put('/:id', adminAuth, updateStudyMaterial);
router.delete('/:id', adminAuth, deleteStudyMaterial);

module.exports = router;