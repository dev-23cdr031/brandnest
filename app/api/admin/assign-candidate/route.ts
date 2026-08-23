import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/roles'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const body = await request.json()
    const { candidate_name, candidate_email, assigned_role, assigned_to, assigned_to_email, project, status, notes } = body
    if (!candidate_name || !assigned_to || !assigned_to_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const targetEmail = String(assigned_to_email).toLowerCase().trim()
    console.log('ADMIN ASSIGNING CANDIDATE - target HR email:', targetEmail)

    // Determine which client to use
    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
    let client = supabaseAdmin

    if (!client) {
      // Fallback: use the user's JWT token with the standard client
      // This respects RLS but still works if the service role key is not set
      console.warn(
        'SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to user-token client. ' +
        'For full admin access, add SUPABASE_SERVICE_ROLE_KEY to your Vercel environment variables.'
      )
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      client = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      })
    }

    // Verify the caller is an admin
    const { data: { user }, error: authError } = await client.auth.getUser(token)
    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { data, error } = await client
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
      // If RLS blocks the insert (permission denied), give clear instructions
      if (error.message?.includes('permission denied') || error.code === '42501') {
        return NextResponse.json(
          {
            error:
              'Permission denied. Set SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables, or run the SQL migration 014_FIX_PERMISSION_DENIED_USERS.sql in Supabase.',
          },
          { status: 500 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.log('ADMIN ASSIGN CANDIDATE SUCCESS:', data)
    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('ADMIN ASSIGN CANDIDATE EXCEPTION:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}