import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import './Group.css';

const Group: React.FC = () => {
	const { id } = useParams<{ id: string }>()
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Group</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Group</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
        Group content here
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Group;
