import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;

export default class SupabaseDataService {
	static myInstance:any = null;

	static getInstance() {
		if (this.myInstance === null) {
      console.log('********************************************');
      console.log('Creating new instance of SupabaseDataService');
      console.log('********************************************');
		  this.myInstance = new this();
      this.myInstance.connect();
		}
		return this.myInstance;
	}
  
  public isConnected = () => {
    return (typeof supabase !== 'undefined');
  }

  public connect = async () => {
      if (this.isConnected()) { return; }
      supabase = await createClient(
        process.env.REACT_APP_SUPABASE_URL || '', 
        process.env.REACT_APP_SUPABASE_KEY || '');
  }

  public getGroup = async (id: string) => {
    console.log('getGroup', id);
    console.log('supabase', supabase);
    const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single();
    return { data, error };
  }
  public saveGroup = async (group: any) => {
    const { data, error } = await supabase
    .from('groups')
    .upsert(group);
    return { data, error };
  }
  public deleteGroup = async (id: string) => {
    const { data, error } = await supabase
    .rpc('groups_delete', {"target": id});
    return { data, error };
  }
  public getGroups = async (user_id: string) => {
    const { data, error } = await supabase
    .from('groups_access')
    .select('groups(*)')
    .eq('user_id', user_id);
    let groups;     
    if (data && data.length > 0) {
      groups = [];
      for (let i=0; i<data.length; i++) {
        groups.push(data[i].groups);
      }
    }
    return { data: groups, error };
  }
  public hasChildGroups = async (id: string) => {
    console.log('hasChildGroups looing for parent_id', id);
    const { error, count } = await supabase
    .from('groups')
    .select('id', { count: 'exact', head: true })
    .eq('parent_id', id);
    console.log('hasChildGroups, data, error, count', error, count);
    if (error) {
      console.error('hasChildGroups error', error);
      return { error };
    } else {
      return count;
    }
  }

  public async getProfile(id: string) {
    if (id) {
      const { data, error } = 
      await supabase.from('profile')
      .select('*')
      .eq('id', id)
      .limit(1)
      .single(); // return a single object (not an array)
      return { data, error };  
    } else {
      console.error('#### getProfile: no id');
      return { data: {}, error: null };  
    }
  } 

  public async saveProfile(profile: any) {
    const { data, error } = 
    await supabase.from('profile')
    .upsert(profile);
    return { data, error };
  }

  public async groups_get_tree_for_user(user_id: string) {
    const { data, error } =
    await supabase.rpc('groups_get_tree_for_user', {target_user_id: user_id});
    return { data, error };
  }
  public async getInvitations(group_id: string) {
    console.log('data service getInvitations', group_id);
    const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('group_id', group_id)
    //.eq('result', null);
    return { data, error };
  }
  public async getMyInvitations(email: string) {
    const { data, error } = await supabase
    .from('invitations')
    .select('*, groups(*)')
    .eq('email', email);
    return { data, error };
  }
  public async inviteUsersToGroup(current_user_id: string, group_id: string, userEmails: string[], inviteAccess: string) {
    const data = [];
    for (let i=0; i<userEmails.length; i++) {
      const invite: any = {group_id, email: userEmails[i], access: inviteAccess, invited_by: current_user_id};
      const { data: lookupData, error: lookupError } = await supabase
      .from('invitations')
      .select('id')
      .eq('group_id', group_id)
      .eq('email', userEmails[i])
      .limit(1);
      console.log('lookupData, lookupError', lookupData, lookupError);
      if (lookupError) {
        console.error('inviteUsersToGroup lookup error', lookupError);
        return { error: lookupError };
      }
      if (lookupData && lookupData.length && lookupData[0].id) {
        invite.id = lookupData[0].id;
      }
      const { data: saveData, error: saveError } = await supabase
      .from('invitations')
      .upsert(invite);
      if (saveError) {
        console.error('inviteUsersToGroup save error', saveError);
        return { error: saveError };
      } else {
        data.push(saveData[0]);
      }
      console.log('inviteUsersToGroup saveData, saveError', saveData, saveError);


    }
    return { data, error: null };
  }

}
