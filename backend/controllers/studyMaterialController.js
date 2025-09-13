const StudyMaterial = require('../models/StudyMaterial');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Gemini AI Integration for Summarization
const generateSummary = async (text) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Please provide a comprehensive but concise summary of the following study material. Focus on key concepts, important points, and learning objectives. Make it structured with bullet points and highlight the most important topics:\n\n${text.substring(0, 30000)}`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
      return response.data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
};

// Extract text from PDF file
const extractTextFromPDF = async (filePath) => {
  try {
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error('File not found');
    }

    const dataBuffer = fs.readFileSync(absolutePath);
    const data = await pdfParse(dataBuffer);
    
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file');
  }
};

// Get all study materials (for students)
const getStudyMaterials = async (req, res) => {
  try {
    const { department, subject, search } = req.query;
    let query = {};

    // Filter by department if user is a student
    if (req.user.role === 'student') {
      query.department = req.user.department;
    } else if (department) {
      query.department = department;
    }

    // Filter by subject
    if (subject) {
      query.subject = subject;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const materials = await StudyMaterial.find(query)
      .populate('uploadedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Get study materials error:', error);
    res.status(500).json({ message: 'Server error while fetching study materials' });
  }
};

// Get single study material
const getStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id)
      .populate('uploadedBy', 'fullName email');

    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    // Check if student can access this material (same department)
    if (req.user.role === 'student' && material.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied to this material' });
    }

    // Increment download count
    material.downloadCount += 1;
    await material.save();

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Get study material error:', error);
    res.status(500).json({ message: 'Server error while fetching study material' });
  }
};

// Upload study material (admin only)
const uploadStudyMaterial = async (req, res) => {
  try {
    const { title, subject, description, department, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const material = new StudyMaterial({
      title,
      subject,
      description,
      department,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await material.save();

    const populatedMaterial = await StudyMaterial.findById(material._id)
      .populate('uploadedBy', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
      data: populatedMaterial
    });
  } catch (error) {
    console.error('Upload study material error:', error);
    res.status(500).json({ message: 'Server error while uploading study material' });
  }
};

// Generate AI summary for study material
const generateMaterialSummary = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    // Check if student can access this material
    if (req.user.role === 'student' && material.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied to this material' });
    }

    // Check if summary already exists
    if (material.aiSummary) {
      return res.json({
        success: true,
        message: 'Summary already exists',
        data: {
          ...material.toObject(),
          aiSummary: material.aiSummary
        }
      });
    }

    let textToSummarize = '';

    // Extract text from PDF file
    if (material.fileType === 'application/pdf') {
      try {
        const filePath = path.join(__dirname, '..', material.fileUrl);
        textToSummarize = await extractTextFromPDF(filePath);
        
        if (!textToSummarize || textToSummarize.trim().length < 100) {
          throw new Error('Insufficient text content in PDF');
        }
      } catch (error) {
        console.error('PDF extraction error:', error);
        // Fallback to title and description
        textToSummarize = `${material.title}\n\n${material.description || 'Study material for ' + material.subject}`;
      }
    } else {
      // For non-PDF files, use title and description
      textToSummarize = `${material.title}\n\n${material.description || 'Study material for ' + material.subject}`;
    }
    
    const summary = await generateSummary(textToSummarize);

    // Update material with generated summary
    material.aiSummary = summary;
    await material.save();

    const updatedMaterial = await StudyMaterial.findById(material._id)
      .populate('uploadedBy', 'fullName email');
    res.json({
      success: true,
      message: 'Summary generated successfully',
      data: updatedMaterial
    });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({ 
      message: 'Failed to generate summary',
      error: error.message 
    });
  }
};

// Update study material (admin only)
const updateStudyMaterial = async (req, res) => {
  try {
    const { title, subject, description, department, tags } = req.body;

    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    // Update fields
    material.title = title || material.title;
    material.subject = subject || material.subject;
    material.description = description || material.description;
    material.department = department || material.department;
    material.tags = tags ? tags.split(',').map(tag => tag.trim()) : material.tags;

    await material.save();

    const updatedMaterial = await StudyMaterial.findById(material._id)
      .populate('uploadedBy', 'fullName email');

    res.json({
      success: true,
      message: 'Study material updated successfully',
      data: updatedMaterial
    });
  } catch (error) {
    console.error('Update study material error:', error);
    res.status(500).json({ message: 'Server error while updating study material' });
  }
};

// Delete study material (admin only)
const deleteStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Study material deleted successfully'
    });
  } catch (error) {
    console.error('Delete study material error:', error);
    res.status(500).json({ message: 'Server error while deleting study material' });
  }
};

// Get subjects by department
const getSubjectsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const subjects = await StudyMaterial.distinct('subject', { department });
    
    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error while fetching subjects' });
  }
};

module.exports = {
  getStudyMaterials,
  getStudyMaterial,
  uploadStudyMaterial,
  generateMaterialSummary,
  updateStudyMaterial,
  deleteStudyMaterial,
  getSubjectsByDepartment
};