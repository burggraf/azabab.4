import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenuButton,
	IonNote,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react'
import './Dashboard.css'
import SupabaseDataService from '../services/supabase.data.service'
import { User, SupabaseAuthService } from 'ionic-react-supabase-login'
import { useEffect, useState } from 'react'

const supabaseDataService = SupabaseDataService.getInstance()

const Dashboard: React.FC = () => {
	const [user, setUser] = useState<User | null>(null)
	const [profile, setProfile] = useState<any>(null)
	const [invites, setInvites] = useState<any[]>([])
	useEffect(() => {
		const userSubscription = SupabaseAuthService.user.subscribe(setUser)
		const profileSubscription = SupabaseAuthService.profile.subscribe(setProfile)

		return () => {
			userSubscription.unsubscribe()
			profileSubscription.unsubscribe()
		}
	}, [])
	useEffect(() => {
		console.log('useEffect', user)
		if (user?.email) {
			getMyInvitations(user?.email)
		} else {
			setInvites([])
		}
	}, [user])
  console.log('user, profile, invites', user, profile, invites)

	const getMyInvitations = async (user_id: string) => {
		if (!supabaseDataService.isConnected()) {
			await supabaseDataService.connect() // wait for db connection
		}
		const { data, error } = await supabaseDataService.getMyInvitations(user_id)
		if (error) {
			console.error('error getting my invitations', error)
		} else {
			//console.log('getMyInvitations', data)
			setInvites(data)
		}
	}
	const acceptInvite = async (invite_id: string) => { console.log('acceptInvite', invite_id) }
	const rejectInvite = async (invite_id: string) => { console.log('rejectInvite', invite_id) }
  const getGroupInfo = async (group_id: string) => { console.log('getGroupInfo', group_id) }
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Dashboard</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				{/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader> */}
				<div className='ion-padding'>
					{invites.length && (
						<IonList>
							<IonListHeader>You have been invited to join:</IonListHeader>
							{invites.map((invite, index) => {
								return (
									<IonItem key={invite?.id} onClick={(e) => getGroupInfo(invite?.id)}>
										<IonLabel class='ion-text-wrap'>
											{invite?.groups?.name}
											<br />
											<IonNote>{invite?.groups?.name}</IonNote>
										</IonLabel>
										<IonButton
											strong
											fill='outline'
											slot='end'
											color='medium'
											onClick={(e) => {
												rejectInvite(invite?.id)
												e.stopPropagation()
											}}>
											Cancel
										</IonButton>

										<IonButton
											strong
											fill='outline'
											slot='end'
											color='primary'
											onClick={(e) => {
												acceptInvite(invite?.id)
												e.stopPropagation()
											}}>
											Join
										</IonButton>
									</IonItem>
								)
							})}
						</IonList>
					)}
					{/* <pre>{JSON.stringify(invites, null, 2)}</pre> */}
				</div>
			</IonContent>
		</IonPage>
	)
}

export default Dashboard
