import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { SupabaseAuthService } from 'ionic-react-supabase-login'
import { addCircleOutline, addOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import SupabaseDataService from '../services/supabase.data.service'

import './GroupTree.css'

const supabaseDataService = SupabaseDataService.getInstance()

const GroupTree: React.FC = () => {
    let { id } = useParams<{ id: string }>()

	const history = useHistory()
	const [user, setUser] = useState<any>(null)
	const [groups, setGroups] = useState<any[]>([])
	useEffect(() => {
		const loadGroups = async (id: string) => {
			if (!supabaseDataService.isConnected()) {
				await supabaseDataService.connect() // wait for db connection
			}
			const { data, error } = await supabaseDataService.groups_get_tree_for_group(id);
			console.log('groups_get_groups_for_user: data, error', data, error);
			if (error) {
				console.error('error getting groups', error);
                setGroups([]);
			} else {
				setGroups(data);
			}
		}
        console.log('*** Groups: useEffect [] ***')
		const subscription = SupabaseAuthService.user.subscribe(setUser)
        loadGroups(id);
		return () => {
			subscription.unsubscribe()
		}
	}, [])


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
						<IonBackButton defaultHref='/groups' />
					</IonButtons>
					<IonTitle>Group Organization</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={() => addNew()}>
							<IonIcon size='large' icon={addCircleOutline}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				{/* <IonHeader collapse='condense'>
					<IonToolbar>
						<IonTitle size='large'>Groups</IonTitle>
					</IonToolbar>
				</IonHeader> */}
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
									<IonNote>
										{ // repeat indent based on group.level
											Array(group?.level).fill(0).map((_, index) => <IonIcon key={Math.random()} />)
										}									
										{group?.description}
									</IonNote>
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

export default GroupTree
