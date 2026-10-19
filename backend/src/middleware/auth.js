import { getSession } from '../config/sessionStore.js';

export async function requireAdminAuth(req, res, next) {
  try {
    const sessionId = req.cookies?.theunoia_admin_session;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const session = await getSession(sessionId);
    if (!session) {
      res.clearCookie('theunoia_admin_session', { path: '/' });
      return res.status(401).json({
        success: false,
        error: 'Session invalid or expired'
      });
    }

    req.adminSession = session;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failed'
    });
  }
}
