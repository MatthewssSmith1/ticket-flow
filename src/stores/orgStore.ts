import { Organization, Member, Group } from '@/types/types'
import supabase, { unwrap } from '@/lib/supabase'
import { create } from 'zustand'
import { toast } from '@/hooks/use-toast'

type OrgState = Organization & {
  members: Member[]
  groups: Group[]
}

type State = {
  orgs: Organization[]
  openOrg: OrgState | null
  authMember: Member | null 
  loadOrgs: (userId: string) => Promise<void>
  setOpenOrg: (org: Organization, userId?: string) => Promise<void>
}

const _useOrgStore = create<State>((set, get) => ({
  orgs: [],
  openOrg: null,
  authMember: null,

  loadOrgs: async (userId: string) => {
    try {
      const orgs = await supabase
        .from('members')
        .select('organizations:organizations (*)')
        .eq('user_id', userId)
        .then(unwrap)
        .then(members => members.map(m => m.organizations))

      set({ orgs })

      if (orgs.length === 0) return

      const lastOrgId = localStorage.getItem('lastOrgId')
      const lastOrg = orgs.find(o => o.id === lastOrgId)
      await get().setOpenOrg(lastOrg || orgs[0], userId)
    } catch (e) {
      toast({
        title: 'Error fetching organizations',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
  },

  setOpenOrg: async (org: Organization, userId?: string) => {
    localStorage.setItem('lastOrgId', org.id)

    try {
      const openOrg = await supabase
        .from('organizations')
        .select(`*, members:members(*), groups:groups(*)`)
        .eq('id', org.id)
        .single()
        .then(unwrap)

      const authMember = openOrg.members.find(m => m.user_id === userId) ?? null
      set({ openOrg, authMember })
    } catch (e) {
      toast({
        title: 'Error fetching organization',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
  },
}))

export function useOrgStore() {
  const store = _useOrgStore()

  const authId = store.authMember?.id
  const getMemberName = (id: number | null) => id === authId ? 'You' 
    : store.openOrg?.members.find(m => m.id === id)?.name || null

  return { ...store, getMemberName }
}
