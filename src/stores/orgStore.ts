import supabase, { unwrap } from '@/lib/supabase'
import { Organization } from '@/types/types'
import { create } from 'zustand'

interface State {
  orgs: Organization[]
  currentOrg: Organization | null
  setCurrentOrg: (org: Organization | null) => void
  loadOrgs: (userId: string) => Promise<void>
}

export const useOrgStore = create<State>((set) => ({
  orgs: [],
  currentOrg: null,
  setCurrentOrg: (org) => set({ currentOrg: org }),
  loadOrgs: async (userId) => {
    try {
      const orgs = await supabase
        .from('members')
        .select('organizations:organizations (*)')
        .eq('user_id', userId)
        .then(unwrap)
        .then(members => members.map(m => m.organizations));

      // TODO: add state in db to track most recent org instead of just using the first one
      if (orgs.length > 0) set({ orgs, currentOrg: orgs[0] })
    } catch (e) {
      console.error('Error fetching organizations:', e);
    }
  }
})) 