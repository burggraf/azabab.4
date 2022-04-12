import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonAlert,
	useIonToast,
} from '@ionic/react'
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
	const [presentAlert] = useIonAlert()
	const [user, setUser] = useState<any>(null)
	const [group, setGroup] = useState<any>(null)
	const [initialized, setInitialized] = useState<boolean>(false)

	let { id } = useParams<{ id: string }>()

	const [present, dismiss] = useIonToast()
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
			return
		}
		const loadGroup = async (id: string) => {
			if (!supabaseDataService.isConnected()) {
				await supabaseDataService.connect() // wait for db connection
			}
			supabaseDataService
				.getGroup(id)
				.then((group: any) => {
					setGroup(group.data)
				})
				.catch((err: any) => {
					console.error('error getting group', err)
				})
		}
		const userSubscription = SupabaseAuthService.user.subscribe(setUser)
		if (id && id.startsWith('new-')) {
			console.log('id is', id)
			console.log('parent_id will be', id.substring(4))
			setGroup({ ...group, id: utilityFunctionsService.uuidv4(), parent_id: id.substring(4) })
		} else if (id) {
			loadGroup(id)
		} else {
			setGroup({ ...group, id: utilityFunctionsService.uuidv4() })
		}
		setInitialized(true)
		return () => {
			userSubscription.unsubscribe()
		}
	}, [group, id, initialized])

	useEffect(() => {
		if (user) {
		}
	}, [user])

	const save = async () => {
		if (group.name.trim() === '') {
			toast('Group name is required')
			return
		}
		group.updated_at = 'NOW()'
		const { data, error } = await supabaseDataService.saveGroup(group)
		if (error) {
			console.error('error saving group', error)
		} else {
			if (data) {
				// do nothing here
			}
		}
	}

	const deleteGroup = async () => {
		if (group.id) {
			presentAlert({
				cssClass: 'my-css',
				header: 'Delete Group',
				message: 'Are you sure?',
				buttons: [
					'Cancel',
					{
						text: 'Delete',
						handler: async (d) => {
							const { data, error } = await supabaseDataService.deleteGroup(group.id);
              if (error) { console.error('error deleting group', error) }
              else {
                console.log('group deleted, returned', data);
              }
							if (error) {
								console.error('error deleting group', error)
							} else {
								if (data) {
									// do nothing here
								}
							}
						},
					},
				],
				onDidDismiss: (e) => console.log('dismissed'),
			})
		} else {
			console.error('missing group id')
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
						<IonItem lines='none'>
							<IonLabel slot='start' class='itemLabel'>
								Name
							</IonLabel>
							<IonInput
								type='text'
								placeholder={'Name'}
								onIonChange={(e: any) => setGroup({ ...group, name: e.detail.value! })}
								value={group?.name!}
								class='inputBox'></IonInput>
						</IonItem>
						<IonItem lines='none'>
							<IonLabel slot='start' class='itemLabel'>
								Description
							</IonLabel>
							<IonInput
								type='text'
								placeholder={'Description'}
								onIonChange={(e: any) => setGroup({ ...group, description: e.detail.value! })}
								value={group?.description!}
								class='inputBox'></IonInput>
						</IonItem>
					</IonList>
				</div>
				<pre>{JSON.stringify(group, null, 2)}</pre>
			</IonContent>
			<IonFooter>
				<div className='ion-padding'>
					<IonButton expand='block' color='danger' onClick={deleteGroup}>
						Delete Group
					</IonButton>
				</div>
			</IonFooter>
		</IonPage>
	)
}

export default Group
