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

}
