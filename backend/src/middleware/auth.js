import { getSession } from '../config/sessionStore.js';

export function requireAdminAuth(req, res, next) {
  const sessionId = req.cookies?.theunoia_admin_session;

  if (!sessionId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  const session = getSession(sessionId);
  if (!session) {
    res.clearCookie('theunoia_admin_session');
    return res.status(401).json({
      success: false,
      error: 'Session invalid or expired'
    });
  }

  req.adminSession = session;
  next();
}
