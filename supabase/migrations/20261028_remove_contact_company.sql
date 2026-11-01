-- ==============================================================================
-- Migration: Remove company column from contact_submissions
-- Date: 2026-10-28
-- Description: Safely drops the unused 'company' column from public.contact_submissions.
-- Preserves all other columns (id, full_name, email, phone, address, message, status, created_at)
-- and all existing submission records.
-- ==============================================================================

ALTER TABLE IF EXISTS public.contact_submissions
  DROP COLUMN IF EXISTS company;
