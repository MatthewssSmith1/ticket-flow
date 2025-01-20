import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'

export default function Account({ session }: { session: Session }) {
  return (
    <div className="account-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}