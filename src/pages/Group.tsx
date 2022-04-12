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
	IonItemDivider,
	IonLabel,
	IonList,
	IonListHeader,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonTitle,
	IonToolbar,
	useIonAlert,
	useIonToast,
} from '@ionic/react'
import { SupabaseAuthService } from 'ionic-react-supabase-login'
import { checkmarkOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import SupabaseDataService from '../services/supabase.data.service'
import UtilityFunctionsService from '../services/utility.functions.service'

import './Group.css'

const supabaseDataService = SupabaseDataService.getInstance()
const utilityFunctionsService = UtilityFunctionsService.getInstance()

const Group: React.FC = () => {
	const history = useHistory();
	const [presentAlert] = useIonAlert()
	const [user, setUser] = useState<any>(null)
	const [group, setGroup] = useState<any>(null)
  const [inviteUsers, setInviteUsers] = useState<string>('')
  const [invites, setInvites] = useState<any[]>([])
  const [inviteAccess, setInviteAccess] = useState<string>('user')
  const [childGroupCount, setChildGroupCount] = useState<number>(-1)
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
				});

      const count = await supabaseDataService.hasChildGroups(id);
      if (typeof count === 'number') {
        setChildGroupCount(count);
      } else {
        setChildGroupCount(-1);
      }
      
    }
		const userSubscription = SupabaseAuthService.user.subscribe(setUser)
		if (id && id.startsWith('new-')) {
			console.log('id is', id)
			console.log('parent_id will be', id.substring(4))
			setGroup({ ...group, id: utilityFunctionsService.uuidv4(), parent_id: id.substring(4) })
		} else if (id) {
			loadGroup(id)
      getInvitations();
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
        history.goBack()
			}
		}
	}
  const getInvitations = async () => {
    if (!supabaseDataService.isConnected()) {
      await supabaseDataService.connect() // wait for db connection
    }
    if (id && !id.startsWith('new-')) {
      const { data, error } = await supabaseDataService.getInvitations(id);
      if (error) {
        console.error('error getting invitations', error)
      } else {
        console.log('getInvitations', data)
        setInvites(data);
      }
    }
  }
  const doInviteUsers = async () => {
    if (!user.id){
      toast('You must be logged in to invite users')
      return
    }
    if (inviteUsers.trim() === '') {
      toast('Please enter a user or users to invite')
      return
    }
    const users = inviteUsers.split(',')
    const userEmails = users.map((email: string) => {
      return email.trim()
    })
    if (userEmails.length > 10) {
      toast('Please enter no more than 10 users')
      return
    }
    const { data, error } = await supabaseDataService.inviteUsersToGroup(user.id, group.id, userEmails, inviteAccess)
    if (error) {
      console.error('error inviting users', error)
      toast('Error inviting users', error.message);
    } else {
      if (data) {
        setInviteUsers('');
        getInvitations();
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
                  history.goBack()
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
				{/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
        <div className='ion-padding'>
        
        <IonList>

          <IonItemDivider>Invite Users</IonItemDivider>
          <IonItem>
            <IonTextarea 
              placeholder="email1@host.com,email2@host.com" 
              value={inviteUsers} 
              onIonChange={e => setInviteUsers(e.detail.value!)}></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel>Access Level</IonLabel>
            <IonSelect 
              value={inviteAccess} 
              placeholder="Select One" 
              onIonChange={e => setInviteAccess(e.detail.value)}>
              <IonSelectOption value="admin">admin</IonSelectOption>
              <IonSelectOption value="user">user</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        </div>
        <div className='ion-padding'>
          <IonButton expand='block' color='medium' onClick={doInviteUsers}>
            Invite Users
          </IonButton>
        </div>
        <pre>
          {JSON.stringify(invites, null, 2)}
        </pre>
			</IonContent>
      { childGroupCount === 0 &&
        <IonFooter>
        <div className='ion-padding'>
          <IonButton expand='block' color='danger' onClick={deleteGroup}>
            Delete Group
          </IonButton>
        </div>
      </IonFooter>
    }
		</IonPage>
	)
}

export default Group
