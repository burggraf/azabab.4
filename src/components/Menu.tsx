import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote } from '@ionic/react'
import { Login, ResetPassword } from 'ionic-react-supabase-login';
import { mailOutline, mailSharp } from 'ionicons/icons'
import { useLocation } from 'react-router-dom'

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
		iosIcon: mailOutline,
		mdIcon: mailSharp,
	},
]

const Menu: React.FC = () => {
	const location = useLocation()

	return (
		<IonMenu contentId='main' type='overlay'>
			<IonContent>
				<IonList id='inbox-list'>
					<IonListHeader>Azabab</IonListHeader>
					<IonNote>tag line here</IonNote>
					<Login
						SUPABASE_URL={process.env.REACT_APP_SUPABASE_URL || ''}
						SUPABASE_KEY={process.env.REACT_APP_SUPABASE_KEY || ''}
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
