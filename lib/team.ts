export type TeamMember = {
  name: string
  role: string
  bio: string
  email?: string
  linkedin?: string
}

export const team: TeamMember[] = [
  {
    name: 'Aisha Patel',
    role: 'Founder & CEO',
    bio: 'Visionary leader driving product strategy and client success across global accounts.',
    email: 'aisha@studio.example',
    linkedin: 'https://www.linkedin.com/in/aishapatel',
  },
  {
    name: 'Liam Chen',
    role: 'Head of Engineering',
    bio: 'Builds resilient, scalable systems and leads engineering excellence.',
    email: 'liam@studio.example',
    linkedin: 'https://www.linkedin.com/in/liamchen',
  },
  {
    name: 'Sofia González',
    role: 'Design Director',
    bio: 'Crafts human-centered designs and brand identities that connect.',
    email: 'sofia@studio.example',
  },
  {
    name: 'Marcus Brown',
    role: 'Product Manager',
    bio: 'Aligns business goals and user needs to ship valuable products.',
    email: 'marcus@studio.example',
    linkedin: 'https://www.linkedin.com/in/marcusbrown',
  },
  {
    name: 'Priya Nair',
    role: 'Senior Developer',
    bio: 'Full-stack engineer focusing on frontend performance and DX.',
    email: 'priya@studio.example',
  },
]

export function getAllTeamMembers() {
  return team
}
