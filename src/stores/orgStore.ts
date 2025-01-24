import { Organization, Member } from '@/types/types'
import supabase, { unwrap } from '@/lib/supabase'
import { useEffect } from 'react'
import { create } from 'zustand'

interface State {
  orgs: Organization[]
  currentOrg: Organization | null
  members: Member[] | null
  authMember: Member | null
  setCurrentOrg: (org: Organization | null, userId?: string) => Promise<void>
  loadOrgs: (userId: string) => Promise<void>
  getMemberName: (id: number | null) => string | null
}

export const useOrgStore = create<State>((set, get) => ({
  orgs: [],
  currentOrg: null,
  members: null,
  authMember: null,
  setCurrentOrg: async (org, userId) => {
    const members = org 
      ? await supabase.from('members')
        .select('*')
        .eq('org_id', org.id)
        .then(unwrap) 
      : null

    const authMember = members?.find(m => m.user_id === userId) ?? null

    set({ currentOrg: org, members, authMember })
  },
  loadOrgs: async (userId) => {
    try {
      const orgs = await supabase
        .from('members')
        .select('organizations:organizations (*)')
        .eq('user_id', userId)
        .then(unwrap)
        .then(members => members.map(m => m.organizations));

      // TODO: add state in db to track most recent org instead of just using the first one
      if (orgs.length > 0) set({ orgs })
    } catch (e) {
      console.error('Error fetching organizations:', e);
    }
  },
  getMemberName: (id: number | null) => {
    if (!id) return null
    const { members } = get()
    return members?.find(m => m.id === id)?.name || null
  }
}))

export function useOrganizations(userId?: string) {
  const store = useOrgStore()
  const { orgs, currentOrg, setCurrentOrg, loadOrgs } = store

  useEffect(() => {
    if (userId && orgs.length === 0) loadOrgs(userId);
  }, [userId, orgs, loadOrgs]);

  useEffect(() => {
    if (!currentOrg && orgs.length > 0) setCurrentOrg(orgs[0], userId);
  }, [orgs, setCurrentOrg, currentOrg, userId]);

    return store
} 