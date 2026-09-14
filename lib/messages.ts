// =============================================
// BrandNest: In-App Messaging helpers
// A shared directory of every user so anyone can
// message anyone else from any dashboard.
// =============================================

import { ADMIN_EMAILS, HR_EMAILS, CRM_EMAILS, TESTER_EMAILS, getRole } from './roles'
import { DEVELOPER_EMAILS } from './developers'

export type AppUser = {
  email: string
  name: string
  role: string
}

export type Message = {
  id: string
  sender_email: string
  recipient_email: string
  body: string
  created_at: string
  read_at: string | null
}

/**
 * People who should NOT appear in the messaging directory.
 * (They are still part of the team/roles elsewhere — just hidden from chat.)
 */
export const MESSAGE_BLOCKED_EMAILS = ['pushparajnm.25cse@kongu.edu', 'nadhin.offx@gmail.com'] as const

const DISPLAY_NAMES: Record<string, string> = {
  // ---------- Admins ----------
  'devdharrshans.23csd@kongu.edu': 'Dev Dharrshan',
  'divyadharshinis.23csd@kongu.edu': 'Divya Dharshini',
  'anusreed.23csd@kongu.edu': 'Anusree D',
  'arvind.23cse@kongu.edu': 'Arvind',
  'avaneeshr.23csd@kongu.edu': 'Avaneesh R',
  'ishhhu.10@gmail.com': 'Ishhu',
  // ---------- HR ----------
  'rhear.25cse@kongu.edu': 'Rhea R',
  'brandnestcompany@gmail.com': 'BrandNest HR',
  'dhavanithim.23csd@kongu.edu': 'Dhavanithi M',
  'ranjanip.25cse@kongu.edu': 'Ranjani P',
  // ---------- CRM ----------
  'gokulshankarm.23csd@kongu.edu': 'Gokul Shankar M',
  'pushparajnm.25cse@kongu.edu': 'Pushparaj NM',
  'devdharrshan40@gmail.com': 'Dev Dharrshan',
  // ---------- Testers ----------
  'manjusrir.24chem@kongu.edu': 'Manjusri R',
  'dharrshandev666@gmail.com': 'Dharrshan Dev',
  // ---------- Developers ----------
  'devdharrshan421@gmail.com': 'Dev Dharrshan',
  'rhearajasekar@gmail.com': 'Rhea Rajasekar',
  'roshinim.23csd@kongu.edu': 'Roshini M',
  'gokulavarshinik.23csd@kongu.edu': 'Gokulavarshini K',
  'prakalyasb.23csd@kongu.edu': 'Prakalya SB',
  'ridhesavijayakumar.25cse@kongu.edu': 'Ridhesa Vijayakumar',
  'priyankab.25cse@kongu.edu': 'Priyanka B',
  'devvsharanns.24aid@kongu.edu': 'Devvsharann S',
  'nadhin.offx@gmail.com': 'Nadhin',
  'ranjaniperiyasamy7@gmail.com': 'Ranjani Periyasamy',
  'ranjaniperiasamy7@gmail.com': 'Ranjani Periasamy',
}

/** Friendly display name for any email. */
export function getDisplayName(email: string | null | undefined): string {
  const e = (email || '').trim().toLowerCase()
  if (!e) return 'User'
  if (DISPLAY_NAMES[e]) return DISPLAY_NAMES[e]
  const local = e.split('@')[0] || ''
  const name = local
    .split(/[._+\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
  return name || 'User'
}

/** Human-readable role label for an email. */
export function getRoleLabel(email: string | null | undefined): string {
  switch (getRole(email)) {
    case 'admin':
      return 'Admin'
    case 'hr':
      return 'HR Manager'
    case 'crm':
      return 'CRM Manager'
    case 'tester':
      return 'Project Tester'
    case 'developer':
      return 'Developer'
    default:
      return 'Customer'
  }
}

/** Every registered BrandNest user (admins + all staff), minus blocked emails. */
export function getAllUsers(): AppUser[] {
  const map = new Map<string, AppUser>()
  const blocked = new Set(MESSAGE_BLOCKED_EMAILS.map((e) => e.toLowerCase()))
  const add = (emails: readonly string[]) => {
    for (const email of emails) {
      const e = email.trim().toLowerCase()
      if (!e || blocked.has(e) || map.has(e)) continue
      map.set(e, { email: e, name: getDisplayName(e), role: getRoleLabel(e) })
    }
  }
  add(ADMIN_EMAILS)
  add(HR_EMAILS)
  add(CRM_EMAILS)
  add(TESTER_EMAILS)
  add(DEVELOPER_EMAILS)
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}
