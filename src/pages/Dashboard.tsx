import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Dashboard.css';
import SupabaseDataService from '../services/supabase.data.service'
import { User, SupabaseAuthService} from 'ionic-react-supabase-login';
import { useEffect, useState } from 'react';

const supabaseDataService = SupabaseDataService.getInstance()

const Dashboard: React.FC = () => {
  const [ user, setUser ] = useState<User | null>(null);
  const [ profile, setProfile ] = useState<any>(null);
	const [ invites, setInvites ] = useState<any[]>([]);
  useEffect(() => {
		const userSubscription = SupabaseAuthService.user.subscribe(setUser);
		const profileSubscription = SupabaseAuthService.profile.subscribe(setProfile);
  
		return () => {
			userSubscription.unsubscribe();
			profileSubscription.unsubscribe();
		}
	  },[])
	useEffect(() => {
		  console.log('useEffect', user);
		  if (user?.email) {
  			getMyInvitations(user?.email);
		  } else {
			  setInvites([]);
		  }
      console.log('useEffect user, profile, invites', user, profile, invites);
	}, [user])

	const getMyInvitations = async (user_id: string) => {
		if (!supabaseDataService.isConnected()) {
		  await supabaseDataService.connect() // wait for db connection
		}
		const { data, error } = await supabaseDataService.getMyInvitations(user_id);
		if (error) {
			console.error('error getting my invitations', error)
		} else {
			//console.log('getMyInvitations', data)
			setInvites(data);
		}
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <pre>
            { JSON.stringify(invites, null, 2) }
          </pre>
        </div>


      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
