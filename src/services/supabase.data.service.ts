import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;

export default class SupabaseDataService {
	static myInstance:any = null;

	static getInstance() {
		if (this.myInstance === null) {
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
    .from('group')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single();
    return { data, error };
  }
  public saveGroup = async (group: any) => {
    const { data, error } = await supabase
    .from('group')
    .upsert(group);
    return { data, error };
  }

}
