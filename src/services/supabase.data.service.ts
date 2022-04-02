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
      supabase = await createClient(
        process.env.REACT_APP_SUPABASE_URL || '', 
        process.env.REACT_APP_SUPABASE_KEY || '');
  }


}
