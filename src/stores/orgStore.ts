import { Organization, Member } from '@/types/types'
import supabase, { unwrap } from '@/lib/supabase'
import { create } from 'zustand'
import { useEffect } from 'react'

interface State {
  orgs: Organization[]
  currentOrg: Organization | null
  // fetch members for current org whenever currentOrg is set
  members: Member[] | null
  setCurrentOrg: (org: Organization | null) => Promise<void>
  loadOrgs: (userId: string) => Promise<void>
}

export const useOrgStore = create<State>((set) => ({
  orgs: [],
  currentOrg: null,
  members: null,
  setCurrentOrg: async (org) => {
    const members = org 
      ? await supabase.from('members')
        .select('*')
        .eq('org_id', org.id)
        .then(unwrap) 
      : null

    set({ currentOrg: org, members })
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
}))

export function useOrganizations(userId?: string) {
  const store = useOrgStore()
  const { orgs, currentOrg, setCurrentOrg, loadOrgs } = store

  useEffect(() => {
    if (userId && orgs.length === 0) loadOrgs(userId);
  }, [userId, orgs, loadOrgs]);

  useEffect(() => {
    if (!currentOrg && orgs.length > 0) setCurrentOrg(orgs[0]);
  }, [orgs, setCurrentOrg, currentOrg]);

    return store
} 