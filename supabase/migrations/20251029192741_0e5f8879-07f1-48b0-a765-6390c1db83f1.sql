-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own activity log" ON crm_activity_log;

-- Create a new policy that allows authenticated users to view all activity logs
-- This makes sense for a CRM where team members should see all activity
CREATE POLICY "Authenticated users can view all activity logs"
ON crm_activity_log
FOR SELECT
TO authenticated
USING (true);

-- Keep the insert policy as-is so users can only insert their own logs
-- The existing policy "Users can insert their own activity log" remains unchanged