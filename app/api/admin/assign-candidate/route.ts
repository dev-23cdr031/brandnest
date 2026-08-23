import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/roles'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { candidate_name, candidate_email, assigned_role, assigned_to, assigned_to_email, project, status, notes } = body
    if (!candidate_name || !assigned_to || !assigned_to_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const targetEmail = String(assigned_to_email).toLowerCase().trim()
    console.log('ADMIN ASSIGNING CANDIDATE - target HR email:', targetEmail)

    const { data, error } = await supabaseAdmin
      .from('hr_candidates')
      .insert({
        candidate_name,
        candidate_email: candidate_email || '',
        assigned_role: assigned_role || '',
        assigned_to,
        assigned_to_email: targetEmail,
        project: project || '',
        status: status || 'Assigned',
        notes: notes || '',
      })
      .select()

    if (error) {
      console.error('ADMIN ASSIGN CANDIDATE ERROR:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.log('ADMIN ASSIGN CANDIDATE SUCCESS:', data)
    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('ADMIN ASSIGN CANDIDATE EXCEPTION:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}