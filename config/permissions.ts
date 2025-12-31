// config/permissions.ts

export type Role = "ADMIN" | "PUBLIC";

export const ROLES: Record<Role, string[]> = {
  ADMIN: [
    "CREATE_PROPERTY",
    "UPDATE_PROPERTY",
    "DELETE_PROPERTY",
    "PUBLISH_PROPERTY",
    "UNPUBLISH_PROPERTY",
    "MANAGE_BLOG",
    "VIEW_LEADS",
    "MANAGE_SETTINGS",
    "ADMIN_ANALYTICS",
  ],
  PUBLIC: [
    "VIEW_PROPERTY",
    "SEARCH_PROPERTY",
    "COMPARE_PROPERTY",
    "SUBMIT_LEAD",
    "VIEW_BLOG",
    "CONTACT_FORM",
  ],
};

/**
 * Checks if a role can perform an action
 * @param role Role of the user
 * @param action Action string
 * @returns true if allowed
 */
export function canPerform(role: Role, action: string): boolean {
  const allowedActions = ROLES[role];
  return allowedActions.includes(action);
}
