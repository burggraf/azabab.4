import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react'
import { SupabaseAuthService } from 'ionic-react-supabase-login'
import { addOutline } from 'ionicons/icons'
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
		console.log('*** Groups: useEffect [user] ***', user)
		const loadGroups = async (user_id: string) => {
			console.log('***** LOADGROUPS *****')
			if (!supabaseDataService.isConnected()) {
				await supabaseDataService.connect() // wait for db connection
			}
			supabaseDataService
				.getGroups(user.id)
				.then((groups_data: any) => {
					console.log('got data', groups_data)
					setGroups(groups_data?.data! || [])
				})
				.catch((err: any) => {
					console.log('error getting groups', err)
				})
		}	
		if (user) {
			console.log('calling loadGroups, user is', user)
			loadGroups(user.id)
		} else {
			setGroups([])
		}
	}, [user])

	console.log('user', user)
	const gotoGroup = (id: string) => {
		history.push(`/group/${id}`)
	}
	useIonViewWillEnter(() => {
		console.log('** ionViewWillEnter event fired')
		console.log('** user', user)
	})
	useIonViewDidEnter(() => {
		console.log('** useIonViewDidEnter event fired')
	})
  const addNew = async () => {
    history.push('/group');
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
							<IonButton color='primary' onClick={addNew}>
								<IonIcon size='large' icon={addOutline}></IonIcon>
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
					{groups.map((group: any) => {
						return (
							<div key={group?.id} onClick={() => gotoGroup(group?.id)}>
								<h2>{group?.name}</h2>
								<p>{group?.description}</p>
								<p>{group?.id}</p>
							</div>
						)
					})}
				</div>
			</IonContent>
		</IonPage>
	)
}

export default Groups
