import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    
    if (type && (type === 'oncampus' || type === 'offcampus')) {
      filter.type = type;
    }
    
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new job (Admin only)
router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update job (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete job (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply for job
router.post('/:id/apply', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if student already applied
    const existingApplication = job.applications.find(
      app => app.studentEmail === req.body.studentEmail
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    job.applications.push(req.body);
    await job.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get job applications (Admin only)
router.get('/:id/applications', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job.applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;