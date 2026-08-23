export const DEVELOPER_EMAILS = [
  'devdharrshan421@gmail.com',
  'rhearajasekar@gmail.com',
  'roshinim.23csd@kongu.edu',
  'gokulavarshinik.23csd@kongu.edu',
  'prakalyasb.23csd@kongu.edu',
  'ridhesavijayakumar.25cse@kongu.edu',
] as const

export type DeveloperEmail = (typeof DEVELOPER_EMAILS)[number]

export function isDeveloperEmail(email: string | null | undefined): email is DeveloperEmail {
  if (!email) return false
  return (DEVELOPER_EMAILS as readonly string[]).includes(email.trim().toLowerCase())
}