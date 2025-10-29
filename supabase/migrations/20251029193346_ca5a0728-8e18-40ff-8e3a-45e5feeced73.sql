-- Add public read access to activity logs for demo mode
CREATE POLICY "Public can view activity logs (demo)"
ON crm_activity_log
FOR SELECT
TO anon
USING (true);