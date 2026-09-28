/**
 * Adapter for @supabase/supabase-js v2.
 * Construct the official client with the project URL and PUBLISHABLE key only.
 * No service_role key in a browser. An authenticated user must also have an
 * active hht_members record. The database, not this adapter, authorizes actions.
 */
export function createHhtBackend(supabase) {
  if (!supabase?.auth || !supabase?.rpc) throw new Error('Client Supabase manquant.');
  const call = async (name, args) => {
    const {data, error} = await supabase.rpc(name, args);
    if (error) throw error;
    return data;
  };
  return {
    async signIn(email, password) {
      const {error} = await supabase.auth.signInWithPassword({email:email.trim(), password});
      if (error) throw error;
      // Authentication alone does not grant HHT membership.
      return call('hht_snapshot');
    },
    async signOut() {
      const {error} = await supabase.auth.signOut({scope:'local'});
      if (error) throw error;
    },
    async restoreSession() {
      const {data, error} = await supabase.auth.getSession();
      if (error) throw error;
      return data.session ? call('hht_snapshot') : null;
    },
    snapshot() { return call('hht_snapshot'); },
    history(before = null, limit = 100) {
      return call('hht_history', {p_before:before, p_limit:limit});
    },
    /**
     * Keep requestId and the exact action across retries, especially when the
     * connection fails after the server may have committed the operation.
     * The UI must not silently fall back to local demonstration storage.
     */
    move(requestId, action) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId))
        throw new Error('Référence de mouvement invalide.');
      return call('hht_move', {p_request_id:requestId, p_action:action});
    },
    /** Refresh the displayed snapshot; write-time stock checks remain atomic. */
    watch(onSnapshot, onError, intervalMs = 5000) {
      let active = true;
      let timer;
      const refresh = async () => {
        try { const data=await call('hht_snapshot'); if(active)onSnapshot(data); }
        catch(error) { if(active)onError(error); }
        finally { if(active)timer=setTimeout(refresh, Math.max(1000, intervalMs)); }
      };
      void refresh();
      return () => {active=false;clearTimeout(timer);};
    }
  };
}
