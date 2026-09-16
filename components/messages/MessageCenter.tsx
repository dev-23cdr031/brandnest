'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import Image from 'next/image'
import {
  ArrowLeft,
  CheckCheck,
  Loader2,
  MessageCircle,
  Search,
  Send,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  getAllUsers,
  getDisplayName,
  getRoleLabel,
  MESSAGE_BLOCKED_EMAILS,
  type AppUser,
  type Message,
  type UserPhoto,
} from '@/lib/messages'

type CurrentUser = {
  email: string
  id: string
  name: string
}

type Conversation = {
  email: string
  name: string
  role: string
  photo: UserPhoto | null
  lastMessage: Message | null
  unread: number
  messages: Message[]
}

type MessageCenterProps = {
  /** Extra recipients who aren't part of the staff directory (e.g. customers). */
  extraRecipients?: AppUser[]
}

const AVATAR_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-orange-500',
]

function avatarColor(name: string) {
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

/**
 * Circular avatar. Uses the person's real photo from the Team page when
 * available (cropped with object-cover so the face stays in frame),
 * otherwise falls back to a colored initial circle.
 */
function MessageAvatar({
  name,
  photo,
  sizeClass,
  textClass = 'text-sm',
  className = '',
  children,
}: {
  name: string
  photo: UserPhoto | null | undefined
  sizeClass: string
  textClass?: string
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className} ${
        photo?.src ? sizeClass : `${sizeClass} ${avatarColor(name)} ${textClass} font-black text-white`
      }`}
    >
      {photo?.src ? (
        <Image
          src={photo.src}
          alt={`${name} profile photo`}
          width={128}
          height={128}
          className="h-full w-full object-cover"
          style={photo.position ? { objectPosition: photo.position } : { objectPosition: '50% 22%' }}
        />
      ) : (
        name.charAt(0).toUpperCase()
      )}
      {children}
    </div>
  )
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatRelative(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (diffDays === 0) return formatTime(iso)
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function MessageCenter({ extraRecipients = [] }: MessageCenterProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const threadRef = useRef<HTMLDivElement>(null)
  const selectedEmailRef = useRef<string | null>(null)

  // Directory of every person that can be messaged
  const { usersIndex } = useMemo(() => {
    const index = new Map<string, AppUser>()
    const add = (u: AppUser) => {
      const e = u.email.trim().toLowerCase()
      if (e && !index.has(e)) index.set(e, { ...u, email: e })
    }
    getAllUsers().forEach(add)
    extraRecipients.forEach(add)
    return { usersIndex: index }
  }, [extraRecipients])

  // Load the signed-in user and their message history (sent + received)
  useEffect(() => {
    let active = true
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) {
        if (active) setLoading(false)
        return
      }
      const email = user.email.trim().toLowerCase()
      setCurrentUser({
        email,
        id: user.id,
        name: (user.user_metadata?.full_name as string) || email.split('@')[0] || 'You',
      })

      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_email.eq.${email},recipient_email.eq.${email}`)
        .order('created_at', { ascending: true })

      if (active) {
        if (data) setMessages(data as Message[])
        setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  // Mark message ids as read (only affects messages addressed to me)
  const markRead = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return
    const now = new Date().toISOString()
    await supabase.from('messages').update({ read_at: now }).in('id', ids)
    setMessages((prev) => prev.map((m) => (ids.includes(m.id) ? { ...m, read_at: now } : m)))
  }, [])

  // Real-time delivery using Supabase Postgres changes
  useEffect(() => {
    if (!currentUser) return
    const channel = supabase
      .channel(`messages-${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_email=eq.${currentUser.email}`,
        },
        (payload) => {
          const incoming = payload.new as Message
          if (!incoming?.id) return
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
          )
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_email=eq.${currentUser.email}`,
        },
        (payload) => {
          const incoming = payload.new as Message
          if (!incoming?.id) return
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
          )
          // Auto-mark as read if this conversation is open right now
          if (
            selectedEmailRef.current &&
            incoming.sender_email.toLowerCase() === selectedEmailRef.current.toLowerCase()
          ) {
            markRead([incoming.id])
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `recipient_email=eq.${currentUser.email}`,
        },
        (payload) => {
          const updated = payload.new as Message
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, read_at: updated.read_at } : m)),
          )
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser, markRead])

  // Track the conversation that is currently open so real-time inserts
  // can be auto-marked as read inside the subscription callback.
  useEffect(() => {
    selectedEmailRef.current = selectedEmail
  }, [selectedEmail])

  // Open a conversation and immediately mark its unread messages as read
  const openConversation = useCallback(
    (email: string) => {
      setSelectedEmail(email)
      const unreadIds = messages
        .filter(
          (m) =>
            m.recipient_email.toLowerCase() === currentUser?.email &&
            m.sender_email.toLowerCase() === email.toLowerCase() &&
            !m.read_at,
        )
        .map((m) => m.id)
      if (unreadIds.length > 0) markRead(unreadIds)
    },
    [messages, currentUser, markRead],
  )

  // Build conversations grouped by the "other person"
  const conversations = useMemo<Conversation[]>(() => {
    if (!currentUser) return []

    // Also drop any past conversations with people removed from the directory
    const blocked = new Set(MESSAGE_BLOCKED_EMAILS.map((e) => e.toLowerCase()))
    const byPartner = new Map<string, Message[]>()
    for (const m of messages) {
      const mine = m.sender_email.toLowerCase() === currentUser.email
      const partner = (mine ? m.recipient_email : m.sender_email).toLowerCase()
      const list = byPartner.get(partner) || []
      list.push(m)
      byPartner.set(partner, list)
    }

    const convos = new Map<string, Conversation>()
    const ensure = (email: string) => {
      const key = email.trim().toLowerCase()
      if (!key || key === currentUser.email || blocked.has(key)) return
      if (!convos.has(key)) {
        const known = usersIndex.get(key)
        convos.set(key, {
          email: key,
          name: known?.name || getDisplayName(key),
          role: known?.role || getRoleLabel(key),
          photo: known?.photo || null,
          lastMessage: null,
          unread: 0,
          messages: [],
        })
      }
    }

    // Everyone in the directory is reachable, even before the first message
    for (const u of usersIndex.values()) ensure(u.email)

    for (const [partner, msgs] of byPartner) {
      ensure(partner)
      const c = convos.get(partner)
      if (!c) continue
      const sorted = [...msgs].sort((a, b) => a.created_at.localeCompare(b.created_at))
      c.messages = sorted
      c.lastMessage = sorted[sorted.length - 1] || null
      c.unread = sorted.filter(
        (m) => m.recipient_email.toLowerCase() === currentUser.email && !m.read_at,
      ).length
    }

    return [...convos.values()].sort((a, b) => {
      const ta = a.lastMessage?.created_at || ''
      const tb = b.lastMessage?.created_at || ''
      if (ta && tb) return tb.localeCompare(ta)
      if (ta) return -1
      if (tb) return 1
      return a.name.localeCompare(b.name)
    })
  }, [messages, currentUser, usersIndex])

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) => c.name.toLowerCase().includes(q) || c.email.includes(q))
  }, [conversations, search])

  const selected = useMemo(
    () => conversations.find((c) => c.email === selectedEmail) || null,
    [conversations, selectedEmail],
  )

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unread, 0),
    [conversations],
  )

  // Auto-scroll to the newest message
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [selectedEmail, messages.length])

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentUser || !selectedEmail || !draft.trim() || sending) return
    setSending(true)
    setSendError('')
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_email: currentUser.email,
        recipient_email: selectedEmail,
        body: draft.trim(),
      })
      .select()
      .single()
    if (error) {
      setSendError(error.message)
      setSending(false)
      return
    }
    if (data) {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]))
    }
    setDraft('')
    setSending(false)
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/25 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Messages</h3>
            <p className="text-xs text-white/75">Private chat with the BrandNest team</p>
          </div>
        </div>
        {totalUnread > 0 && (
          <span className="rounded-full border border-red-400/40 bg-red-500/25 px-3 py-1 text-xs font-bold text-red-200">
            {totalUnread} unread
          </span>
        )}
      </div>

      <div className="grid min-h-[560px] lg:grid-cols-[340px_1fr]">
        {/* ============ LEFT: CONVERSATION LIST ============ */}
        <aside className={`${selected ? 'hidden lg:block' : 'block'} border-white/10 lg:border-r`}>
          <div className="p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people..."
                className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/60 focus:border-red-400"
              />
            </div>
          </div>

          <div className="h-[440px] space-y-1 overflow-y-auto px-2 pb-2">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-white/75">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-400" />
                Loading messages...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="px-4 py-16 text-center text-sm text-white/70">
                No conversations found.
                <br />
                Pick someone from the team to get started.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const previewText = c.lastMessage
                  ? `${c.lastMessage.sender_email.toLowerCase() === currentUser?.email ? 'You: ' : ''}${c.lastMessage.body}`
                  : c.role
                return (
                  <button
                    key={c.email}
                    type="button"
                    onClick={() => openConversation(c.email)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                      selectedEmail === c.email
                        ? 'border border-red-500/30 bg-red-600/15'
                        : 'border border-transparent hover:bg-white/[0.06]'
                    }`}
                  >
                    <MessageAvatar name={c.name} photo={c.photo} sizeClass="h-11 w-11" textClass="text-sm">
                      {c.unread > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[0.65rem] font-bold shadow-lg">
                          {c.unread}
                        </span>
                      )}
                    </MessageAvatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-white">{c.name}</p>
                        {c.lastMessage && (
                          <span className="shrink-0 text-[0.65rem] font-medium text-white/65">
                            {formatRelative(c.lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      <p
                        className={`truncate text-xs ${
                          c.unread > 0 ? 'font-semibold text-white' : 'text-white/70'
                        }`}
                      >
                        {previewText}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* ============ RIGHT: CONVERSATION THREAD ============ */}
        <div className={`${selected ? 'flex' : 'hidden lg:flex'} flex-col`}>
          {selected && currentUser ? (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 border-b border-white/10 bg-black/25 px-5 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedEmail(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/10 lg:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <MessageAvatar
                  name={selected.name}
                  photo={selected.photo}
                  sizeClass="h-10 w-10"
                  textClass="text-sm"
                />
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{selected.name}</p>
                  <p className="truncate text-xs text-white/75">
                    {selected.role} · {selected.email}
                  </p>
                </div>
              </div>

              {/* Message bubbles */}
              <div
                ref={threadRef}
                className="h-[440px] flex-1 space-y-2 overflow-y-auto px-5 py-4"
              >
                {selected.messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-sm text-white/70">
                    <MessageCircle className="mb-3 h-10 w-10 text-white/40" />
                    <p className="font-bold text-white">Message {selected.name}</p>
                    <p className="mt-1 max-w-xs">
                      Messages are sent securely through Supabase and delivered instantly. Say
                      hello! 👋
                    </p>
                  </div>
                ) : (
                  selected.messages.map((m, i) => {
                    const mine = m.sender_email.toLowerCase() === currentUser.email
                    const prev = selected.messages[i - 1]
                    const showDayDivider =
                      !prev ||
                      new Date(m.created_at).toDateString() !==
                        new Date(prev.created_at).toDateString()
                    return (
                      <div key={m.id}>
                        {showDayDivider && (
                          <div className="my-3 flex justify-center">
                            <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[0.65rem] font-semibold text-white/80">
                              {new Date(m.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${mine ? 'justify-end' : 'justify-start'} gap-2`}>
                          {!mine && (
                            <MessageAvatar
                              name={selected.name}
                              photo={selected.photo}
                              className="mt-auto"
                              sizeClass="h-7 w-7"
                              textClass="text-[0.65rem]"
                            />
                          )}
                          <div
                            className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              mine
                                ? 'rounded-br-md bg-gradient-to-r from-red-600 to-red-500 text-white'
                                : 'rounded-bl-md border border-white/15 bg-white/[0.09] text-white'
                            }`}
                          >
                            <p className="break-words whitespace-pre-wrap">{m.body}</p>
                            <div
                              className={`mt-1 flex items-center justify-end gap-1 text-[0.6rem] ${
                                mine ? 'text-white/85' : 'text-white/75'
                              }`}
                            >
                              {formatTime(m.created_at)}
                              {mine &&
                                (m.read_at ? (
                                  <CheckCheck className="h-3 w-3 text-emerald-300" />
                                ) : (
                                  <CheckCheck className="h-3 w-3 opacity-80" />
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Composer */}
              <form onSubmit={handleSend} className="border-t border-white/10 bg-black/25 p-4">
                {sendError && (
                  <p className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-200">
                    {sendError}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Message ${selected.name}...`}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/60 focus:border-red-400"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)] transition hover:from-red-500 hover:to-red-400 disabled:opacity-50"
                    aria-label="Send message"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 py-24 text-center text-white/70">
              <MessageCircle className="mb-4 h-12 w-12 text-white/40" />
              <p className="font-bold text-white">Select a conversation</p>
              <p className="mt-1 text-sm">Message anyone on the team from this dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

