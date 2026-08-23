// =============================================
// BrandNest Role Definitions
// =============================================

// Admin emails (multiple admins)
export const ADMIN_EMAILS = [
  'devdharrshans.23csd@kongu.edu',
  'divyadharshinis.23csd@kongu.edu',
  'anusreed.23csd@kongu.edu',
  'arvind.23cse@kongu.edu',
  'avaneeshr.23csd@kongu.edu',
  'ishhhu.10@gmail.com',
] as const

// Primary admin email (kept for backward compatibility)
export const ADMIN_EMAIL = ADMIN_EMAILS[0]

// HR Manager emails
export const HR_EMAILS = [
  'rhear.25cse@kongu.edu',
  'brandnestcompany@gmail.com',
  'dhavanithim.23csd@kongu.edu',
] as const

// Client Relationship Manager (CRM) emails
export const CRM_EMAILS = [
  'gokulshankarm.23csd@kongu.edu',
  'pushparajnm.25cse@kongu.edu',
  'devdharrshan40@gmail.com',
] as const

// Project Tester emails
export const TESTER_EMAILS = [
  'manjusrir.24chem@kongu.edu',
  'dharrshandev666@gmail.com',
] as const

// Developer emails (re-exported from developers.ts to avoid circular deps)
import { DEVELOPER_EMAILS } from './developers'

export type Role = 'admin' | 'hr' | 'crm' | 'tester' | 'developer' | 'customer'

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return (ADMIN_EMAILS as readonly string[]).includes(email.trim().toLowerCase())
}

export function isHREmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return (HR_EMAILS as readonly string[]).includes(normalized) || isAdminEmail(normalized)
}

export function isCRMEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return (CRM_EMAILS as readonly string[]).includes(normalized) || isAdminEmail(normalized)
}

export function isTesterEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return (TESTER_EMAILS as readonly string[]).includes(normalized) || isAdminEmail(normalized)
}

export function isDeveloperEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return (DEVELOPER_EMAILS as readonly string[]).includes(normalized) || isAdminEmail(normalized)
}

/**
 * Determine the role of a user based on their email.
 * Priority: admin > hr > crm > tester > developer > customer
 */
export function getRole(email: string | null | undefined): Role {
  if (isAdminEmail(email)) return 'admin'
  if (isHREmail(email)) return 'hr'
  if (isCRMEmail(email)) return 'crm'
  if (isTesterEmail(email)) return 'tester'
  if (isDeveloperEmail(email)) return 'developer'
  return 'customer'
}

/**
 * Get the dashboard path for a given role.
 * Used for dynamic redirection after login.
 */
export function getDashboardPath(email: string | null | undefined): string {
  const role = getRole(email)
  switch (role) {
    case 'admin':
      return '/admin'
    case 'hr':
      return '/hr'
    case 'crm':
      return '/crm'
    case 'tester':
      return '/tester'
    case 'developer':
      return '/developer'
    default:
      return '/my-orders'
  }
}