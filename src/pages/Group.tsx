import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonToast } from '@ionic/react'
import { SupabaseAuthService } from 'ionic-react-supabase-login'
import { checkmarkOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import SupabaseDataService from '../services/supabase.data.service'
import UtilityFunctionsService from '../services/utility.functions.service'

import './Group.css'

const supabaseDataService = SupabaseDataService.getInstance()
const utilityFunctionsService = UtilityFunctionsService.getInstance()

const Group: React.FC = () => {
  //const history = useHistory();
  const [ user, setUser ] = useState<any>(null);
  const [ group, setGroup ] = useState<any>(null);
  const [ initialized, setInitialized ] = useState<boolean>(false);

  let { id } = useParams<{ id: string; }>();
  
  console.log('id', id);

  const [present, dismiss] = useIonToast();
  const toast = (message: string, color: string = 'danger') => {
      present({
          color: color,
          message: message,
          cssClass: 'toast',
          buttons: [{ icon: 'close', handler: () => dismiss() }],
          duration: 3000,
        })
  }

  useEffect(() => {
    if (initialized) {
      console.log('already initialized');
      return;
    }
    const loadGroup = async (id: string) => {
      if (!supabaseDataService.isConnected()) {
        await supabaseDataService.connect(); // wait for db connection
      }
      supabaseDataService.getGroup(id).then((group: any) => {
        console.log('got group', group.data)
        setGroup(group.data)
      }).catch((err: any) => {
        console.log('error getting group', err)
      })  
    }  
    console.log('*** Group: useEffect []')
    const subscription = SupabaseAuthService.user.subscribe(setUser);
    if (!id) {
      setGroup({ ...group, id: utilityFunctionsService.uuidv4() });
    } else {
      loadGroup(id);
    }   
    setInitialized(true);     
    return () => {
      subscription.unsubscribe();
    }    
  }, [group, id, initialized]); 




  useEffect(() => {
    console.log('*** Group: useEffect [user] ***', user);
	}, [user])


  console.log('user', user)

  const save = async () => {
    if (group.name.trim() === '') {
      toast('Group name is required');
      return;
    }
    group.updated_at = 'NOW()';
    const { data, error } = await supabaseDataService.saveGroup(group);
    if (error) {
      console.error('error saving group', error)
    } else {
      console.log('group saved', data);
    }
  }

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
            <IonBackButton defaultHref='/groups' />
					</IonButtons>
					<IonTitle>Group</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={save}>
							<IonIcon size='large' icon={checkmarkOutline}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse='condense'>
					<IonToolbar>
						<IonTitle size='large'>Group</IonTitle>
					</IonToolbar>
				</IonHeader>
				<div className='ion-padding'>
        <IonList>
					<IonItem lines="none">
						<IonLabel slot='start' class="itemLabel">Name</IonLabel>
						<IonInput
							type='text'
							placeholder={'Name'}
							onIonChange={(e: any) => setGroup({ ...group, name: e.detail.value! })}
							value={group?.name!}
							class='inputBox'></IonInput>
					</IonItem>
					<IonItem lines="none">
						<IonLabel slot='start' class="itemLabel">Description</IonLabel>
						<IonInput
							type='text'
							placeholder={'Description'}
							onIonChange={(e: any) => setGroup({ ...group, description: e.detail.value! })}
							value={group?.description!}
							class='inputBox'></IonInput>
					</IonItem>
        </IonList>
        </div>
			</IonContent>
		</IonPage>
	)
}

export default Group
