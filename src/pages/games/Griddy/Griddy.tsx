import { IonButtons, IonContent, IonHeader, 
    IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonMenuButton, IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react'
import GriddyService from './griddy.service';

//import { useParams } from 'react-router';
//import ExploreContainer from '../components/ExploreContainer';
import './Griddy.css';
import { refreshCircleOutline } from 'ionicons/icons';
const griddyService = GriddyService.getInstance();
let resetting = false;
let activeChoice = -1;

const Griddy: React.FC = () => {
  //const GRID_SIZE = 4;
  const [initialized, setInitialized] = useState(false);
  const [GRID_SIZE, setGRID_SIZE] = useState(4);
  const [choices,setChoices] = useState<string[]>([])
  const [board,setBoard] = useState<string[][]>([])
  const [score,setScore] = useState<number>(0)
  const [scoreboxes,setScoreboxes] = useState<number[]>([])
  const [rating,setRating] = useState<any>({rating:0,low:0,high:0,avg:0})
  const [successfulWords,setSuccessfulWords] = useState<string>('')
  const [gameNumber, setGameNumber] = useState<number>(0)
  // const { name } = useParams<{ name: string; }>();
  const clearChoiceBox = (i: number) => {
    const item = document.getElementById(`choice${i}`);
    item?.classList.remove('selected');
  }
  const toggleChoiceBox = (i:number) => {
    console.log('toggleChoiceBox',i);
    const item = document.getElementById(`choice${i}`);
    console.log('item.innerText',item?.innerText);
    console.log('activeChoice', activeChoice);
    if (item?.innerText === '') { // (choices[i] === '') {
      return;
    }
    if (activeChoice === i) {
      item?.classList.toggle('selected');
      activeChoice = -1;
    } else if (activeChoice > -1) {
      const oldItem = document.getElementById(`choice${activeChoice}`);
      oldItem?.classList.toggle('selected');
      item?.classList.toggle('selected');
      activeChoice = i;  
    } else {
      item?.classList.toggle('selected');
      activeChoice = i;  
    }
    console.log('activeChoice is now', activeChoice);
  };

  const init = useCallback(async () => {
    if (initialized) {
      return;
    }
    console.log('INIT');
    setInitialized(true);
    const randomSeed = Math.floor(Math.random() * 9999999) + 1;
    setGameNumber(randomSeed);
    const q = griddyService.getRandomQueue(GRID_SIZE, randomSeed);
    setChoices(q);
    setBoard([...Array(GRID_SIZE)].map(x=>Array(GRID_SIZE).fill('')))
    setScoreboxes([...Array((GRID_SIZE * GRID_SIZE) + 4)].map(x=>1))
    activeChoice = -1;
    setTimeout(()=> {
      resetting = false;
    }, 250);
    setRating(griddyService.rateQueue(q,GRID_SIZE));
  },[GRID_SIZE, initialized]);

  const calculateScore = useCallback(async () => {
    const {data, indexes, error} = await griddyService.calculateScore(board);
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
	}, [init]);

  useEffect(() => {
    if (board.length === 0) {
      return;
    }
    if (choices.join('').length === 0 && board[GRID_SIZE-1][GRID_SIZE-1] !== '') {
      calculateScore();
    }
  },[choices, calculateScore, board, GRID_SIZE])

  const unplaceChoice = (row: number, col: number) => {
    console.log('unplaceChoice', row, col);
    const letter = board[row][col];
    const newBoard = [...board];
    newBoard[row][col] = '';
    setBoard(newBoard);
    const newChoices = [...choices];
    for (let i=0; i<newChoices.length; i++) {
      if (newChoices[i] === '') {
        newChoices[i] = letter;
        setChoices(newChoices);
        return;
      }
    }
  }

  const placeChoice = (row: number, col: number) => {
    console.log('placeChoice', row, col);
    console.log('activeChoice', activeChoice);
    if (board[row][col] !== '') {
      console.log('placeChoice: already filled, calling unplaceChoice');
      unplaceChoice(row, col);
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
    clearChoiceBox(activeChoice);
    choices[activeChoice] = '';
    for (let i=activeChoice; i<choices.length; i++) {
      if (choices[i] !== '') {
        activeChoice = -1;
        toggleChoiceBox(i);
        return;
      }
    }
    for (let i=0; i<choices.length; i++) {
      if (choices[i] !== '') {
        activeChoice = -1;
        toggleChoiceBox(i);
        return;
      }
    }
    activeChoice = -1;
  }
  const reset = async (newSize: number = GRID_SIZE) => {
    if (resetting) {
      console.log('skip additional resets');
      return;
    }
    if (activeChoice > -1) {
      clearChoiceBox(activeChoice);
      activeChoice = -1;
    }
    resetting = true;
    setInitialized(false);
    console.log('reset');
    // setBoard([...Array(newSize)].map(x=>Array(newSize).fill('')));
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
              <IonSelectOption value={3}>3 x 3</IonSelectOption>
              <IonSelectOption value={4}>4 x 4</IonSelectOption>
              <IonSelectOption value={5}>5 x 5</IonSelectOption>
              <IonSelectOption value={6}>6 x 6</IonSelectOption>
            </IonSelect>
            <IonButton color='primary' onClick={() => {reset();}}>
							<IonIcon size='large' icon={refreshCircleOutline}></IonIcon>
						</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
      <div className="flexcontainer wrap">
        <IonGrid style={{width: '100%'}}>
            <IonRow key='choices'>
              {choices.map((choice,choiceIndex) => (
                  <IonCol 
                      style={{backgroundColor: 'var(--ion-color-light)',border:'1px solid var(--ion-color-medium)'}}
                      key={`choice${choiceIndex}`} 
                      id={`choice${choiceIndex}`}
                      onClick={() => toggleChoiceBox(choiceIndex)}
                      className="flex-item">
                        {choice}
                      </IonCol>
              ))}
            </IonRow>
        </IonGrid>
        </div>
        <div className="centeredDiv">
        <IonGrid style={{width: '100%'}}>
            <IonRow key={`scoringrow-top`}>
            {Array(GRID_SIZE+2).fill('').map((el, i) =>
            (
              <IonCol key={`scoreboxes-${i}${el}`} 
                  id={`scoreboxes-${i}${el}`} className="scoringbox">
                    {scoreboxes[i]}
              </IonCol>
            ))}
            </IonRow>
            {board.map((row, rowIndex) => (
              <IonRow key={`row-${rowIndex}`}>

                <IonCol key={`scoreboxes-${GRID_SIZE + 2 + rowIndex + rowIndex}`} 
                    id={`scoreboxes-${GRID_SIZE + 2 + rowIndex + rowIndex}`} className="scoringbox">
                      {scoreboxes[GRID_SIZE + 2 + rowIndex + rowIndex]}
                </IonCol>

                {row.map((col, colIndex) => (
                  <IonCol className="boxed" id={`cell-${rowIndex}-${colIndex}`} 
                    key={`cell-${rowIndex}-${colIndex}`}
                    onClick={() => placeChoice(rowIndex, colIndex)}
                  >{col}</IonCol>
                ))}

                <IonCol key={`scoreboxes-${GRID_SIZE + 2 + rowIndex + rowIndex + 1}`} 
                    id={`scoreboxes-${GRID_SIZE + 2 + rowIndex + rowIndex + 1}`} className="scoringbox">
                      {scoreboxes[GRID_SIZE + 2 + rowIndex + rowIndex + 1]}
                </IonCol>

              </IonRow>
            ))}
            <IonRow key={`scoringrow-bottom`}>
            {Array(GRID_SIZE+2).fill('').map((el, i) =>
            (
              <IonCol key={`scoreboxes-${(GRID_SIZE * 3) + 2 + i}${el}`} 
                  id={`scoreboxes-${(GRID_SIZE * 3) + 2 + i}${el}`} className="scoringbox">
                    {scoreboxes[(GRID_SIZE * 3) + 2 + i]}
              </IonCol>
            ))}
            </IonRow>
        </IonGrid>
        </div>
        <div>
          SCORE: {score}<br/>
          WORDS: {successfulWords}<br/>
        </div>
        <div>
          <br/>
          GAME NUMBER: {gameNumber}<br/>
          LOW: {rating.low}<br/>
          AVG: {rating.avg}<br/>
          RATING: <b>{rating?.rating}</b><br/>
          HIGH: {rating.high}
        </div>
        {/* <pre>activeChoice: {activeChoice}</pre>
        <pre>board: {JSON.stringify(board)}</pre>
        <pre>choices: {JSON.stringify(choices)}</pre> */}
      </IonContent>
    </IonPage>
  );
};

export default Griddy;
