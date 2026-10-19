import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../config/db.js';
import { validateEmail, validatePhone, sanitizeString } from '../config/constants.js';

const router = Router();

// POST /api/contact
router.post('/contact', (req, res) => {
  try {
    const { fullname, full_name, company, email, country, phone, address, message } = req.body || {};

    const resolvedName = sanitizeString(full_name || fullname, 150);
    const resolvedCompany = sanitizeString(company, 150);
    const resolvedEmail = sanitizeString(email, 255);
    const rawPhone = sanitizeString(phone, 30);
    const resolvedCountry = sanitizeString(country, 10);
    const resolvedAddress = sanitizeString(address, 500);
    const resolvedMessage = sanitizeString(message, 5000);

    // Validation
    const errors = {};
    if (!resolvedName) {
      errors.fullname = 'Full name is required';
    }

    if (!resolvedEmail) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(resolvedEmail)) {
      errors.email = 'Please provide a valid email address';
    }

    // Compose formatted phone
    let combinedPhone = rawPhone;
    if (rawPhone && resolvedCountry && !rawPhone.startsWith('+')) {
      combinedPhone = `${resolvedCountry} ${rawPhone}`;
    }

    if (!combinedPhone) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(combinedPhone)) {
      errors.phone = 'Please provide a valid phone number';
    }

    if (!resolvedMessage) {
      errors.message = 'Message is required';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const status = 'new';

    const stmt = db.prepare(`
      INSERT INTO contact_submissions (
        id, full_name, company, email, phone, address, message, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      resolvedName,
      resolvedCompany,
      resolvedEmail,
      combinedPhone,
      resolvedAddress,
      resolvedMessage,
      status,
      createdAt
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      submissionId: id
    });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your request. Please try again later.'
    });
  }
});

export default router;
