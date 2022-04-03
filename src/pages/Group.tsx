import {
  IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react'
import { useParams } from 'react-router'
import './Group.css'
import { SupabaseAuthService } from 'ionic-react-supabase-login'
import { useEffect, useState } from 'react'
import SupabaseDataService from '../services/supabase.data.service'
import { checkmarkOutline } from 'ionicons/icons'
import UtilityFunctionsService from '../services/utility.functions.service'

const supabaseDataService = SupabaseDataService.getInstance()
const utilityFunctionsService = UtilityFunctionsService.getInstance()

const Group: React.FC = () => {

  const [ user, setUser ] = useState<any>(null);
  const [ group, setGroup ] = useState<any>(null);
  let { id } = useParams<{ id: string }>()
  console.log('id', id)

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
  useEffect(() => {
		const userSubscription = SupabaseAuthService.subscribeUser(setUser)
    if (id) {
      loadGroup(id);
    } else {
      id = utilityFunctionsService.uuidv4();
    }
		return () => {
			SupabaseAuthService.unsubscribeUser(userSubscription)
		}
	}, [])

  console.log('user', user)

  const save = async () => {
    console.log('saveGroup', group)
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
						<IonMenuButton />
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
        </IonList>
        </div>
			</IonContent>
		</IonPage>
	)
}

export default Group
