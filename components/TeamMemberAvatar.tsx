'use client'

import { useState } from 'react'
import { getTeamMemberInitial, getTeamMemberPortrait } from '@/lib/team-points'

export function TeamMemberAvatar({ name, className = 'h-10 w-10' }: { name: string; className?: string }) {
  const portrait = getTeamMemberPortrait(name)
  const [failed, setFailed] = useState(false)
  if (!portrait || failed) return <span aria-label={`${name} avatar`} className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-xs font-bold text-white ${className}`}>{getTeamMemberInitial(name)}</span>
  return <img src={portrait.src} alt={`${name} portrait`} className={`shrink-0 rounded-full object-cover object-center ${className}`} style={portrait.position ? { objectPosition: portrait.position } : undefined} onError={() => setFailed(true)} />
}
