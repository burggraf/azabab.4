//import * as moment from 'moment';
//import SupabaseDataService from "../../../services/supabase.data.service";
import W3 from '../../../data/3.json';
import W4 from '../../../data/4.json';
import W5 from '../../../data/5.json';
import W6 from '../../../data/6.json';
import LETTERS from '../../../data/letters.json';
//const supabaseDataService = SupabaseDataService.getInstance();

export default class GriddyService {
    static myInstance: any = null;

    static getInstance() {
        if (this.myInstance === null) {
            this.myInstance = new this();
        }
        return this.myInstance;
    }
    
    static supabase: any;
    // constructor() {}
    public getRandomLetter = (GRID_SIZE: number) => {
        const r = Math.random();
        for (let i=0; i<LETTERS.length; i++) {
            if (r < LETTERS[i].cutoff && LETTERS[i].wordlength === GRID_SIZE) {
                return LETTERS[i].letter;
            }
        }
        return '?';
    }
    public getRandomQueue = (GRID_SIZE: number) => {
        const q = [];
        for (let i=0; i < (GRID_SIZE * GRID_SIZE); i++) {
          q.push(this.getRandomLetter(GRID_SIZE))
        }
        return q;
    }

    public calculateScore = async (board: any) => {
        console.log('calculateScore: board', board);
        // let score = 0;
        // let successfulWords = [];
        const GRID_SIZE = board[0].length;
        const trials: string[] = [];
        // create words across
        for (let i=0; i<GRID_SIZE; i++) {
            let trial = '';
            for (let j=0; j<GRID_SIZE; j++) {
                trial += board[i][j];
            }
            trials.push(trial);
        }
        // create words down
        for (let i=0; i<GRID_SIZE; i++) {
            let trial = '';
            for (let j=0; j<GRID_SIZE; j++) {
                trial += board[j][i];
            }
            trials.push(trial);
        }
        // diagonal down
        let trial = '';
        for (let i=0; i<GRID_SIZE; i++) {
            trial += board[i][i];
        }
        trials.push(trial);
        trial = '';
        // diagonal up
        for (let i=GRID_SIZE-1,j=0; i>=0; i--,j++) {
            trial += board[i][j];
        }
        trials.push(trial);
        console.log('trials', trials);
        
        const foundWords: string[] = [];
        const wordlists = [[], [], [], W3, W4, W5, W6];
        trials.map((word: string) => {
            if (wordlists[GRID_SIZE]?.indexOf(word) > -1) {
                foundWords.push(word);
            }
            return null;
        });
        // const { data, error } = await supabaseDataService.supabase
        // .rpc('calculate_score', {trials});
        // console.log('calculate_score data, error', data, error);

        return {data: foundWords.join(', '), error: null};
    }


}