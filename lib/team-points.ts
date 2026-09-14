export type TeamPointsMember = { id: string; name: string; points: number }
export type TeamPointsTeam<TMember extends TeamPointsMember = TeamPointsMember> = { id: string; name: string; members: TMember[] }

type Portrait = { src: string; position?: string }

const portraits: Record<string, Portrait> = {
  ranjith: { src: '/team/photos/ranjith-nb.jpg' }, 'ranjith nb': { src: '/team/photos/ranjith-nb.jpg' },
  'manju shri': { src: '/team/photos/manju-sri.png' }, 'manju sri': { src: '/team/photos/manju-sri.png' },
  'gokul shankar': { src: '/team/photos/gokul-shankar.jpg', position: '50% 32%' }, priyanka: { src: '/team/photos/priyanka.jpg' }, 'priyanka b': { src: '/team/photos/priyanka.jpg' },
  rhea: { src: '/team/photos/rhea.jpg' }, 'rhea r': { src: '/team/photos/rhea.jpg' }, ridhesha: { src: '/team/photos/ridhesha.jpg' },
  prakalya: { src: '/team/photos/prakalya-sb.jpg' }, 'prakalya sb': { src: '/team/photos/prakalya-sb.jpg' },
  roshini: { src: '/team/photos/roshini-m.jpg' }, 'roshini m': { src: '/team/photos/roshini-m.jpg' },
  gokulavarshini: { src: '/team/photos/gokula-varshini-k.jpg', position: '50% 28%' }, 'gokula varshini k': { src: '/team/photos/gokula-varshini-k.jpg', position: '50% 28%' },
  dhavanithi: { src: '/team/photos/dhavanithi-m.jpg', position: '50% 30%' }, 'dhavanithi m': { src: '/team/photos/dhavanithi-m.jpg', position: '50% 30%' },
  'devv sharann': { src: '/team/photos/devv-sharann.jpg' }, 'devv sharann s': { src: '/team/photos/devv-sharann.jpg' },
  keerthi: { src: '/team/photos/keerthi-ratna.jpg' }, 'keerthi ratna': { src: '/team/photos/keerthi-ratna.jpg' },
  ranjani: { src: '/team/photos/ranjani-p.jpg' }, 'ranjani p': { src: '/team/photos/ranjani-p.jpg' },
}

const normalizeName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ')
export const getTeamMemberPortrait = (name: string) => portraits[normalizeName(name)]
export const getTeamMemberInitial = (name: string) => name.trim().charAt(0).toUpperCase() || '?'

const teamOneMembers: TeamPointsMember[] = [{ id: 't1m5', name: 'Rhea', points: 0 }, { id: 't1m6', name: 'Ridhesha', points: 0 }]

/** Adds missing Team 1 defaults without modifying saved members or their points. */
export function mergeTeamOneDefaults<T extends TeamPointsTeam>(teams: T[]): T[] {
  return teams.map((team) => {
    if (team.id !== 'team1' && !normalizeName(team.name).includes('1')) return team
    const keys = new Set(team.members.flatMap((member) => [member.id, normalizeName(member.name)]))
    const missing = teamOneMembers.filter((member) => !keys.has(member.id) && !keys.has(normalizeName(member.name)))
    return missing.length ? { ...team, members: [...team.members, ...missing] as T['members'] } : team
  })
}
