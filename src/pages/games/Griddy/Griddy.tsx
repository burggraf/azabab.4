import { IonBackButton, IonButtons, IonContent, IonHeader, 
    IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonMenuButton, IonButton, IonIcon, IonSelect, IonSelectOption, IonItem } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react'
import GriddyService from './griddy.service';

//import { useParams } from 'react-router';
//import ExploreContainer from '../components/ExploreContainer';
import './Griddy.css';
import { refreshCircle, refreshCircleOutline } from 'ionicons/icons';
const griddyService = GriddyService.getInstance();

const Griddy: React.FC = () => {
  //const GRID_SIZE = 4;
  const [GRID_SIZE, setGRID_SIZE] = useState(4);
  const [queue,setQueue] = useState<string[]>([])
  const [choices,setChoices] = useState<string[]>([])
  const [activeChoice,setActiveChoice] = useState<number>(-1)
  const [board,setBoard] = useState<string[][]>([...Array(GRID_SIZE)].map(x=>Array(GRID_SIZE).fill('')))
  const [score,setScore] = useState<number>(0)
  const [successfulWords,setSuccessfulWords] = useState<string>('')
  // const { name } = useParams<{ name: string; }>();
  const init = async () => {
    const { error } = await griddyService.init();
    if (error) {
      console.log('griddyService.init error:', error);
    } else {
      const q = [];
      for (let i=0; i < (GRID_SIZE * GRID_SIZE); i++) {
        q.push(griddyService.getRandomLetter(GRID_SIZE))
      }
      setQueue(q);
      setTimeout(() => {
        toggleChoiceBox(0);
      },100);
    }
  }

  const calculateScore = useCallback(async () => {
    const {data, error} = await griddyService.calculateScore(board);
    console.log('griddyService.calculateScore', data, error);
    if (error) {
      console.error('calculateScore error:', error);
    } else {
      if (data) {
        setScore((data || '').split(', ').length);
        setSuccessfulWords(data || '');    
      } else {
        setScore(0);
        setSuccessfulWords('none found');    
      }
    }
  }, [board]);

  useEffect(() => {
    init();
    return () => {
		}
	}, [])
  useEffect(() => {
    setChoices(queue.slice(0,GRID_SIZE));
    if (queue.length === 0 && board[GRID_SIZE-1][GRID_SIZE-1] !== '') {
      calculateScore();
    }
  },[queue, calculateScore, board])

  const toggleChoiceBox = (i:number) => {
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
    if (board[row][col] !== '') {
      console.log('placeChoice: already filled');
      return;
    }
    if (activeChoice === -1) {
      console.log('placeChoice: no active choice');
      return;
    }
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
    setTimeout(() => {
      if (queue.length > activeChoice+1) {
        toggleChoiceBox(activeChoice);
        setActiveChoice(activeChoice);
      }
    },100);
  }
  const reset = async (newSize: number = GRID_SIZE) => {
    console.log('reset');
    setBoard([...Array(newSize)].map(x=>Array(newSize).fill('')));
    init();

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Griddy</IonTitle>
          <IonButtons slot="end">
            <IonSelect value={GRID_SIZE} 
                      className="grid_size_selector"
                      okText="OK" 
                      cancelText="Cancel" 
                      interface="popover"
                      interfaceOptions={ {header: 'Grid Size'} }
                      onIonChange={(e: any) => {setGRID_SIZE(parseInt(e.detail.value,10));reset(parseInt(e.detail.value,10));}}
                      placeholder={GRID_SIZE.toString()}>
              <IonSelectOption value="3">3 x 3</IonSelectOption>
              <IonSelectOption value="4">4 x 4</IonSelectOption>
              <IonSelectOption value="5">5 x 5</IonSelectOption>
              <IonSelectOption value="6">6 x 6</IonSelectOption>
            </IonSelect>
            <IonButton color='primary' onClick={() => {reset();}}>
							<IonIcon size='large' icon={refreshCircleOutline}></IonIcon>
						</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
      <div className="centeredDiv">
        <IonGrid style={{width: '600px', maxWidth: '600px', minHeight: '100px'}}>
            <IonRow key='choices'>
              {choices.map((choice,choiceIndex) => (
                  <IonCol 
                      style={{backgroundColor: 'lightgray'}}
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
        <IonGrid style={{width: '600px', maxWidth: '600px'}}>
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
        <div className="centeredDiv">
          SCORE: {score}<br/>
          WORDS: {successfulWords}<br/>
        </div>
        <pre>{JSON.stringify(board,null,2)}</pre>
        <pre>{JSON.stringify(queue,null,2)}</pre>
      </IonContent>
    </IonPage>
  );
};

export default Griddy;
