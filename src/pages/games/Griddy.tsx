import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, 
    IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useEffect, useState } from 'react'

//import { useParams } from 'react-router';
//import ExploreContainer from '../components/ExploreContainer';
import './Griddy.css';

const Griddy: React.FC = () => {
  const [queue,setQueue] = useState<string[]>([])
  // const { name } = useParams<{ name: string; }>();
  const getRandomLetter = () => {
    const r = Math.floor(Math.random() * 26);
    console.log('r', r)
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(r,r+1);
  }
  const getLetterQueue = async () => {
    const q = [];
    for (let i=0; i < 9; i++) {
      q.push(getRandomLetter())
    }
    setQueue(q);
  }
  useEffect(() => {
		console.log('*** Griddy: useEffect [] ***')
    getLetterQueue();
    return () => {
		}
	}, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref='/login' />
          </IonButtons>
          <IonTitle>Griddy</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
      <div className="centeredDiv">
        <IonGrid style={{width: '300px', maxWidth: '300px', backgroundColor: 'lightgray'}}>
            <IonRow>
                <IonCol className="boxed"></IonCol>
                <IonCol className="boxed"></IonCol>
                <IonCol className="boxed"></IonCol>
            </IonRow>
        </IonGrid>
        </div>
        <div className="centeredDiv">
        <IonGrid style={{width: '300px', maxWidth: '300px'}}>
            <IonRow>
                <IonCol className="boxed"></IonCol>
                <IonCol className="boxed"></IonCol>
                <IonCol className="boxed"></IonCol>
            </IonRow>
            <IonRow>
                <IonCol className="boxed"></IonCol>
                <IonCol className="boxed"></IonCol>
                <IonCol className="boxed"></IonCol>
            </IonRow>
            <IonRow>
                <IonCol className="boxed"></IonCol>
                <IonCol className="boxed"></IonCol>
                <IonCol className="boxed"></IonCol>
            </IonRow>
        </IonGrid>
        </div>
        <pre>{JSON.stringify(queue,null,2)}</pre>
      </IonContent>
    </IonPage>
  );
};

export default Griddy;
