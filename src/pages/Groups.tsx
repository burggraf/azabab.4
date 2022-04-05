import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import './Groups.css';
import { SupabaseAuthService } from 'ionic-react-supabase-login'
import SupabaseDataService from '../services/supabase.data.service'
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
const supabaseDataService = SupabaseDataService.getInstance()

const Groups: React.FC = () => {
  const history = useHistory();
  const [ user, setUser ] = useState<any>(null);
  const [ groups, setGroups ] = useState<any[]>([]);
  const loadGroups = async (user_id: string) => {
    console.log('***** LOADGROUPS *****')
    if (!supabaseDataService.isConnected()) {
      await supabaseDataService.connect(); // wait for db connection
    }
    supabaseDataService.getGroups(user.id).then((groups_data: any) => {
      console.log('got data', groups_data)
      setGroups(groups_data?.data! || [])
    }).catch((err: any) => {
      console.log('error getting groups', err)
    })

  }
  useEffect(() => {
    console.log('*** Groups: useEffect [] ***')
    const subscription = SupabaseAuthService.user.subscribe(setUser);  
		return () => {
      subscription.unsubscribe();
		}
	}, [])

  
  useEffect(() => {
    console.log('*** Groups: useEffect [user] ***', user)
    if (user) {
      loadGroups(user.id)
    } else {
      setGroups([]);
    }  
	}, [user])

  console.log('user', user)
  const gotoGroup = (id: string) => {
    history.push(`/group/${id}`)
  }
  useIonViewWillEnter(() => {
    console.log('** ionViewWillEnter event fired');
    console.log('** user', user);
  });
  useIonViewDidEnter(() => {
    console.log('** useIonViewDidEnter event fired');
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Groups</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Groups</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
        {groups.map((group: any) => {
          return (
            <div key={group.id} onClick={() => gotoGroup(group.id)}>
              <h2>{group.name}</h2>
              <p>{group.description}</p>
              <p>{group.id}</p>
            </div>
          )
        })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Groups;
