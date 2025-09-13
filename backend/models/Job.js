import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['oncampus', 'offcampus'],
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applications: [{
    studentName: String,
    studentEmail: String,
    studentPhone: String,
    resume: String,
    coverLetter: String,
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Job', jobSchema);