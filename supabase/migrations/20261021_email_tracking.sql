-- ==============================================================================
-- Migration: Add Confirmation Email Tracking Columns
-- Date: 2026-10-21
-- Purpose: Track timestamp of automated transactional confirmation emails
--          dispatched via Resend for Contact Us and Maker applications.
-- Safety: 100% Non-destructive (ADD COLUMN IF NOT EXISTS).
-- ==============================================================================

-- 1. Contact Submissions Table
ALTER TABLE IF EXISTS public.contact_submissions 
  ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ;

-- Index for querying unconfirmed or recently confirmed contact enquiries
CREATE INDEX IF NOT EXISTS idx_contact_email_sent 
  ON public.contact_submissions(confirmation_email_sent_at) 
  WHERE confirmation_email_sent_at IS NOT NULL;

-- 2. Team Member / Become a Maker Applications Table
ALTER TABLE IF EXISTS public.team_member_applications 
  ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ;

-- Index for querying unconfirmed or recently confirmed maker applications
CREATE INDEX IF NOT EXISTS idx_team_email_sent 
  ON public.team_member_applications(confirmation_email_sent_at) 
  WHERE confirmation_email_sent_at IS NOT NULL;
