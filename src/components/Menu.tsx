import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote } from '@ionic/react'
import { Login, ResetPassword, User } from 'ionic-react-supabase-login';
import { barChartOutline, barChartSharp, peopleOutline, peopleSharp } from 'ionicons/icons'
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { SupabaseAuthService } from 'ionic-react-supabase-login'

import './Menu.css'

interface AppPage {
	url: string
	iosIcon: string
	mdIcon: string
	title: string
}

const appPages: AppPage[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		iosIcon: barChartOutline,
		mdIcon: barChartSharp,
	},
	{
		title: 'Groups',
		url: '/groups',
		iosIcon: peopleOutline,
		mdIcon: peopleSharp,
	},
]

const Menu: React.FC = () => {
	const location = useLocation();
	const history = useHistory();
	const [ user, setUser ] = useState<User | null>(null);
	const [ profile, setProfile ] = useState<any>(null);
	const goToProfile = async () => {
		history.replace('/profile');
	}
	const onSignIn = (user: any, session: any) =>{
		window.location.reload();
	}
	const onSignOut = () =>{
		window.location.reload();
	}
    useEffect(() => {
		const userSubscription = SupabaseAuthService.user.subscribe(setUser);
		const profileSubscription = SupabaseAuthService.profile.subscribe(setProfile);
  
		return () => {
			userSubscription.unsubscribe();
			profileSubscription.unsubscribe();
		}
	  },[])
	  useEffect(() => {
		console.log('user', user);
		console.log('profile', profile);
	}, [user, profile])

	return (
		<IonMenu contentId='main' type='overlay'>
			<IonContent>
				<IonList id='inbox-list'>
					<IonListHeader>Azabab</IonListHeader>
					<IonNote>tag line here</IonNote>
					<Login
						SUPABASE_URL={process.env.REACT_APP_SUPABASE_URL || ''}
						SUPABASE_KEY={process.env.REACT_APP_SUPABASE_KEY || ''}
						// providers={['google', 'facebook', 'twitter', 'linkedin']}
						backdropDismiss={false}
						profileFunction={goToProfile}
						onSignIn={onSignIn}
						onSignOut={onSignOut}
						profileTable={'profile'}
						profileKey={'id'}
						setUser={setUser}
							/>
					<ResetPassword
						SUPABASE_URL={process.env.REACT_APP_SUPABASE_URL || ''}
						SUPABASE_KEY={process.env.REACT_APP_SUPABASE_KEY || ''}
					/>

					{appPages.map((appPage, index) => {
						return (
							<IonMenuToggle key={index} autoHide={false}>
								<IonItem
									className={location.pathname === appPage.url ? 'selected' : ''}
									routerLink={appPage.url}
									routerDirection='none'
									lines='none'
									detail={false}>
									<IonIcon slot='start' ios={appPage.iosIcon} md={appPage.mdIcon} />
									<IonLabel>{appPage.title}</IonLabel>
								</IonItem>
							</IonMenuToggle>
						)
					})}
				</IonList>

			</IonContent>
		</IonMenu>
	)
}

export default Menu
