import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/lead';

export type ActivityAction = 'create' | 'update' | 'delete';

interface LogActivityParams {
  actionType: ActivityAction;
  entityType: string;
  entityId: string;
  entityData: any;
  previousData?: any;
  description: string;
}

/**
 * Log an activity to the CRM activity log
 */
export const logActivity = async ({
  actionType,
  entityType,
  entityId,
  entityData,
  previousData,
  description,
}: LogActivityParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user found, skipping activity log');
      return;
    }

    const { error } = await supabase.from('crm_activity_log').insert({
      user_id: user.id,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      entity_data: entityData,
      previous_data: previousData || null,
      description,
    });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

/**
 * Log customer creation
 */
export const logCustomerCreated = async (customer: Lead) => {
  await logActivity({
    actionType: 'create',
    entityType: 'lead',
    entityId: customer.leadId,
    entityData: customer,
    description: `Created new customer: ${customer.fullName}`,
  });
};

/**
 * Log customer update
 */
export const logCustomerUpdated = async (
  customerId: string,
  previousData: Lead,
  newData: Lead
) => {
  await logActivity({
    actionType: 'update',
    entityType: 'lead',
    entityId: customerId,
    entityData: newData,
    previousData: previousData,
    description: `Updated customer: ${newData.fullName}`,
  });
};

/**
 * Log customer deletion
 */
export const logCustomerDeleted = async (customer: Lead) => {
  await logActivity({
    actionType: 'delete',
    entityType: 'lead',
    entityId: customer.leadId,
    entityData: customer,
    description: `Deleted customer: ${customer.fullName}`,
  });
};

/**
 * Log bulk action
 */
export const logBulkAction = async (
  actionType: ActivityAction,
  count: number,
  entityType: string,
  description: string
) => {
  await logActivity({
    actionType,
    entityType,
    entityId: `bulk-${Date.now()}`,
    entityData: { count, timestamp: new Date().toISOString() },
    description: `${description} (${count} items)`,
  });
};
