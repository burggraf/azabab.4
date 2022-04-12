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

}
