import { IonBackButton, IonButtons, IonContent, IonHeader, 
    IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useEffect, useState } from 'react'

//import { useParams } from 'react-router';
//import ExploreContainer from '../components/ExploreContainer';
import './Griddy.css';

const Griddy: React.FC = () => {
  const GRID_SIZE = 3;
  const [queue,setQueue] = useState<string[]>([])
  const [choices,setChoices] = useState<string[]>([])
  const [activeChoice,setActiveChoice] = useState<number>(-1)
  const [board,setBoard] = useState<string[][]>([...Array(GRID_SIZE)].map(x=>Array(GRID_SIZE).fill('')) )
  // const { name } = useParams<{ name: string; }>();
  const getRandomLetter = () => {
    const r = Math.floor(Math.random() * 26);
    console.log('r', r)
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(r,r+1);
  }
  useEffect(() => {
    const getLetterQueue = async () => {
      const q = [];
      for (let i=0; i < 9; i++) {
        q.push(getRandomLetter())
      }
      setQueue(q);
    }
      console.log('*** Griddy: useEffect [] ***')
    getLetterQueue();
    return () => {
		}
	}, [])
  useEffect(() => {
    setChoices(queue.slice(0,3));
  },[queue])

  const toggleChoiceBox = (i:number) => {
    console.log('toggleChoiceBox', i)
    console.log('activeChoice', activeChoice)
    const item = document.getElementById(`choice${i}`);
    if (activeChoice === i) {
      item?.classList.toggle('selected');
      setActiveChoice(-1);
    } else if (activeChoice > -1) {
      const oldItem = document.getElementById(`choice${activeChoice}`);
      oldItem?.classList.toggle('selected');
      item?.classList.toggle('selected');
      setActiveChoice(i);  
    } else {
      item?.classList.toggle('selected');
      setActiveChoice(i);  
    }
  }
  const placeChoice = (row: number, col: number) => {
    console.log('placeChoice', row, col)
    const choice = choices[activeChoice];
    const newBoard = [...board];
    newBoard[row][col] = choice;
    setBoard(newBoard);
    toggleChoiceBox(activeChoice);
    // remove the active choice from the queue
    const newQueue = [...queue];
    newQueue.splice(activeChoice,1);
    setQueue(newQueue);
    setActiveChoice(-1);
  }
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
            <IonRow key='choices'>
              {choices.map((choice,choiceIndex) => (
                  <IonCol 
                      key={`choice${choiceIndex}`} 
                      id={`choice${choiceIndex}`}
                      onClick={() => toggleChoiceBox(choiceIndex)}
                      className="boxed">
                        {choice}
                      </IonCol>
              ))}
            </IonRow>
        </IonGrid>
        </div>
        <div className="centeredDiv">
        <IonGrid style={{width: '300px', maxWidth: '300px'}}>
            {board.map((row, rowIndex) => (
              <IonRow>
                {row.map((col, colIndex) => (
                  <IonCol className="boxed"
                    onClick={() => placeChoice(rowIndex, colIndex)}
                  >{col}</IonCol>
                ))}
              </IonRow>
            ))}
        </IonGrid>
        </div>
        <pre>{JSON.stringify(board,null,2)}</pre>
        <pre>{JSON.stringify(queue,null,2)}</pre>
      </IonContent>
    </IonPage>
  );
};

export default Griddy;