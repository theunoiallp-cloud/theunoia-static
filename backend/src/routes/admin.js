import { Router } from 'express';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import { db } from '../config/db.js';
import { createSession, deleteSession } from '../config/sessionStore.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { sanitizeString } from '../config/constants.js';

const router = Router();

// Strict rate limit for admin login attempts: max 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many failed login attempts. Please try again after 15 minutes.'
  }
});

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { password } = req.body || {};

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }

    const rs = await db.execute('SELECT id, password_hash FROM admin_auth WHERE id = 1');
    const admin = rs.rows[0];

    if (!admin || !admin.password_hash) {
      return res.status(500).json({
        success: false,
        error: 'Admin authentication is not configured on this server.'
      });
    }

    const matches = await bcrypt.compare(password, String(admin.password_hash));
    if (!matches) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { sessionId, expiresAt } = await createSession(Number(admin.id), ip, userAgent);

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('theunoia_admin_session', sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      expires: new Date(expiresAt),
      path: '/'
    });

    return res.json({
      success: true,
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during authentication.'
    });
  }
});

// POST /api/admin/logout
router.post('/logout', async (req, res) => {
  try {
    const sessionId = req.cookies?.theunoia_admin_session;
    if (sessionId) {
      await deleteSession(sessionId);
    }

    res.clearCookie('theunoia_admin_session', { path: '/' });
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during admin logout:', error);
    res.clearCookie('theunoia_admin_session', { path: '/' });
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
});

// GET /api/admin/me
router.get('/me', requireAdminAuth, (req, res) => {
  return res.json({
    success: true,
    authenticated: true
  });
});

// GET /api/admin/overview
router.get('/overview', requireAdminAuth, async (req, res) => {
  try {
    const [totC, newC, totM, pendM, appM, rejM] = await Promise.all([
      db.execute('SELECT COUNT(*) AS count FROM contact_submissions'),
      db.execute("SELECT COUNT(*) AS count FROM contact_submissions WHERE status = 'new'"),
      db.execute('SELECT COUNT(*) AS count FROM maker_registrations'),
      db.execute("SELECT COUNT(*) AS count FROM maker_registrations WHERE status = 'pending_review'"),
      db.execute("SELECT COUNT(*) AS count FROM maker_registrations WHERE status = 'approved'"),
      db.execute("SELECT COUNT(*) AS count FROM maker_registrations WHERE status = 'rejected'")
    ]);

    return res.json({
      success: true,
      data: {
        totalContacts: Number(totC.rows[0].count),
        newContacts: Number(newC.rows[0].count),
        totalMakers: Number(totM.rows[0].count),
        pendingMakers: Number(pendM.rows[0].count),
        approvedMakers: Number(appM.rows[0].count),
        rejectedMakers: Number(rejM.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch overview metrics' });
  }
});

// Helper for CSV escaping
function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell).replace(/"/g, '""');
  return `"${str}"`;
}

// GET /api/admin/contacts
router.get('/contacts', requireAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, export: isExport } = req.query;

    let baseQuery = 'FROM contact_submissions WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      baseQuery += ' AND status = ?';
      params.push(status);
    }

    if (search && String(search).trim()) {
      baseQuery += ' AND (full_name LIKE ? OR company LIKE ? OR email LIKE ?)';
      const s = `%${String(search).trim()}%`;
      params.push(s, s, s);
    }

    if (isExport === 'true' || isExport === 'csv') {
      const recordsRs = await db.execute({
        sql: `SELECT * ${baseQuery} ORDER BY created_at DESC`,
        args: params
      });
      const records = recordsRs.rows;

      const headers = ['ID', 'Full Name', 'Company', 'Email', 'Phone', 'Address', 'Message', 'Status', 'Created At'];
      const rows = records.map(r => [
        escapeCsvCell(r.id),
        escapeCsvCell(r.full_name),
        escapeCsvCell(r.company),
        escapeCsvCell(r.email),
        escapeCsvCell(r.phone),
        escapeCsvCell(r.address),
        escapeCsvCell(r.message),
        escapeCsvCell(r.status),
        escapeCsvCell(r.created_at)
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\r\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="theunoia-contacts.csv"');
      return res.send(csvContent);
    }

    const countRs = await db.execute({
      sql: `SELECT COUNT(*) as count ${baseQuery}`,
      args: params
    });
    const total = Number(countRs.rows[0].count);

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const itemsRs = await db.execute({
      sql: `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [...params, limitNum, offset]
    });
    const items = itemsRs.rows;

    return res.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch contact submissions' });
  }
});

// PATCH /api/admin/contacts/:id
router.patch('/contacts/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const allowedStatuses = ['new', 'in_progress', 'resolved'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const result = await db.execute({
      sql: 'UPDATE contact_submissions SET status = ? WHERE id = ?',
      args: [status, id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, error: 'Contact submission not found' });
    }

    const updatedRs = await db.execute({
      sql: 'SELECT * FROM contact_submissions WHERE id = ?',
      args: [id]
    });
    return res.json({ success: true, data: updatedRs.rows[0] });
  } catch (error) {
    console.error('Error updating contact status:', error);
    return res.status(500).json({ success: false, error: 'Failed to update contact submission' });
  }
});

// DELETE /api/admin/contacts/:id
router.delete('/contacts/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: 'DELETE FROM contact_submissions WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, error: 'Contact submission not found' });
    }

    return res.json({ success: true, message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete contact submission' });
  }
});

// GET /api/admin/makers
router.get('/makers', requireAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, role, search, export: isExport } = req.query;

    let baseQuery = 'FROM maker_registrations WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      baseQuery += ' AND status = ?';
      params.push(status);
    }

    if (role && role !== 'all') {
      baseQuery += ' AND role = ?';
      params.push(role);
    }

    if (search && String(search).trim()) {
      baseQuery += ' AND (full_name LIKE ? OR email LIKE ?)';
      const s = `%${String(search).trim()}%`;
      params.push(s, s);
    }

    if (isExport === 'true' || isExport === 'csv') {
      const recordsRs = await db.execute({
        sql: `SELECT * ${baseQuery} ORDER BY created_at DESC`,
        args: params
      });
      const records = recordsRs.rows;

      const headers = ['ID', 'Full Name', 'Phone', 'Email', 'Role', 'Custom Role', 'Status', 'Admin Note', 'Created At'];
      const rows = records.map(r => [
        escapeCsvCell(r.id),
        escapeCsvCell(r.full_name),
        escapeCsvCell(r.phone),
        escapeCsvCell(r.email),
        escapeCsvCell(r.role),
        escapeCsvCell(r.custom_role),
        escapeCsvCell(r.status),
        escapeCsvCell(r.admin_note),
        escapeCsvCell(r.created_at)
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\r\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="theunoia-makers.csv"');
      return res.send(csvContent);
    }

    const countRs = await db.execute({
      sql: `SELECT COUNT(*) as count ${baseQuery}`,
      args: params
    });
    const total = Number(countRs.rows[0].count);

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const itemsRs = await db.execute({
      sql: `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [...params, limitNum, offset]
    });
    const items = itemsRs.rows;

    return res.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching makers:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch maker registrations' });
  }
});

// PATCH /api/admin/makers/:id
router.patch('/makers/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_note, adminNote } = req.body || {};

    const allowedStatuses = ['pending_review', 'approved', 'rejected'];
    const updates = [];
    const params = [];

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Status must be one of: ${allowedStatuses.join(', ')}`
        });
      }
      updates.push('status = ?');
      params.push(status);
    }

    const note = admin_note !== undefined ? admin_note : adminNote;
    if (note !== undefined) {
      const cleanNote = sanitizeString(note, 2000);
      updates.push('admin_note = ?');
      params.push(cleanNote);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    params.push(id);
    const result = await db.execute({
      sql: `UPDATE maker_registrations SET ${updates.join(', ')} WHERE id = ?`,
      args: params
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, error: 'Maker registration not found' });
    }

    const updatedRs = await db.execute({
      sql: 'SELECT * FROM maker_registrations WHERE id = ?',
      args: [id]
    });
    return res.json({ success: true, data: updatedRs.rows[0] });
  } catch (error) {
    console.error('Error updating maker registration:', error);
    return res.status(500).json({ success: false, error: 'Failed to update maker registration' });
  }
});

// DELETE /api/admin/makers/:id
router.delete('/makers/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: 'DELETE FROM maker_registrations WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, error: 'Maker registration not found' });
    }

    return res.json({ success: true, message: 'Maker registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting maker registration:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete maker registration' });
  }
});

export default router;
