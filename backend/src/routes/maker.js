import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../config/db.js';
import { VALID_ROLES, validateEmail, validatePhone, sanitizeString } from '../config/constants.js';

const router = Router();

// POST /api/maker
router.post('/maker', async (req, res) => {
  try {
    const { fullname, full_name, phone, country, email, role, custom_role, customRole } = req.body || {};

    const resolvedName = sanitizeString(full_name || fullname, 150);
    const rawPhone = sanitizeString(phone, 30);
    const resolvedCountry = sanitizeString(country, 10);
    const resolvedEmail = sanitizeString(email, 255);
    const resolvedRole = sanitizeString(role, 100);
    const resolvedCustomRole = sanitizeString(custom_role || customRole, 150);

    const errors = {};
    if (!resolvedName) {
      errors.fullname = 'Full name is required';
    }

    let combinedPhone = rawPhone;
    if (rawPhone && resolvedCountry && !rawPhone.startsWith('+')) {
      combinedPhone = `${resolvedCountry} ${rawPhone}`;
    }

    if (!combinedPhone) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(combinedPhone)) {
      errors.phone = 'Please provide a valid phone number';
    }

    if (!resolvedEmail) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(resolvedEmail)) {
      errors.email = 'Please provide a valid email address';
    }

    if (!resolvedRole) {
      errors.role = 'Role selection is required';
    } else if (!VALID_ROLES.includes(resolvedRole)) {
      errors.role = 'Please select a valid role from the list';
    }

    if (resolvedRole === 'Other' && !resolvedCustomRole) {
      errors.custom_role = 'Please specify your custom role';
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
    const status = 'pending_review';

    await db.execute({
      sql: `
        INSERT INTO maker_registrations (
          id, full_name, phone, email, role, custom_role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        resolvedName,
        combinedPhone,
        resolvedEmail,
        resolvedRole,
        resolvedRole === 'Other' ? resolvedCustomRole : null,
        status,
        createdAt
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Registration received! Our team will review your application.',
      registrationId: id
    });
  } catch (error) {
    console.error('Error saving maker registration:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your request. Please try again later.'
    });
  }
});

export default router;
