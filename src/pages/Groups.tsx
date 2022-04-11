import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { SupabaseAuthService } from 'ionic-react-supabase-login'
import { addCircleOutline, addOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

import SupabaseDataService from '../services/supabase.data.service'

import './Groups.css'

const supabaseDataService = SupabaseDataService.getInstance()

const Groups: React.FC = () => {
	const history = useHistory()
	const [user, setUser] = useState<any>(null)
	const [groups, setGroups] = useState<any[]>([])
	useEffect(() => {
		console.log('*** Groups: useEffect [] ***')
		const subscription = SupabaseAuthService.user.subscribe(setUser)
		return () => {
			subscription.unsubscribe()
		}
	}, [])

	useEffect(() => {
		const loadGroups = async (user_id: string) => {
			if (!supabaseDataService.isConnected()) {
				await supabaseDataService.connect() // wait for db connection
			}
			// supabaseDataService
			// 	.getGroups(user.id)
			// 	.then((groups_data: any) => {
			// 		console.log('got data', groups_data.data)
			// 		const data = groups_data?.data || [];
			// 		const newData = data.sort((a: any, b: any) => 
			// 			(a.parent_id > b.parent_id) ? 1 : (a.parent_id === b.parent_id) ? ((a.name > b.name) ? 1 : -1) : -1 );
			// 		console.log('newData', newData)
			// 		setGroups(data)
			// 	})
			// 	.catch((err: any) => {
			// 		console.log('error getting groups', err)
			// 	});
			const { data, error } = await supabaseDataService.groups_get_tree_for_user(user_id);
			console.log('groups_get_tree_for_user: data, error', data, error);
			if (error) {
				console.error('error getting groups', error);
			} else {
				setGroups(data);
			}
		}
		if (user) {
			loadGroups(user.id)
		} else {
			setGroups([])
		}
	}, [user])

	const gotoGroup = (id: string) => {
		history.push(`/group/${id}`)
	}
	const addNew = async (parentid?: string) => {
		if (parentid) {
			history.push('/group/' + parentid)
		} else {
			history.push('/group')
		}
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Groups</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={() => addNew()}>
							<IonIcon size='large' icon={addCircleOutline}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse='condense'>
					<IonToolbar>
						<IonTitle size='large'>Groups</IonTitle>
					</IonToolbar>
				</IonHeader>
				<div className='ion-padding'>
					<IonList>
					{groups.map((group: any, idx: number) => {
						return (
							<IonItem key={group?.id} onClick={() => gotoGroup(group?.id)} lines="full">
								<IonLabel class="ion-text-wrap">
									{ // repeat indent based on group.level
										Array(group?.level).fill(0).map((_, index) => <IonIcon key={Math.random()} />)
									}									
									{group?.name}<br/>
									<IonNote>{group?.description}</IonNote>
								</IonLabel>
								<IonButton fill='clear' slot='end' color='primary' onClick={(e) => {addNew('new-' + group?.id);e.stopPropagation()}}>
									<IonIcon size='large' icon={addOutline}></IonIcon>
								</IonButton>
							</IonItem>
						)
					})}
					</IonList>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default Groups
