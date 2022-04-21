//import * as moment from 'moment';
//import SupabaseDataService from "../../../services/supabase.data.service";
import W3 from '../../../data/3.json';
import W4 from '../../../data/4.json';
import W5 from '../../../data/5.json';
import W6 from '../../../data/6.json';
import LETTERS from '../../../data/letters.json';
//const supabaseDataService = SupabaseDataService.getInstance();
import seedrandom from 'seedrandom';

const wordlists = [[], [], [], W3, W4, W5, W6];

export default class GriddyService {
    static myInstance: any = null;

    static getInstance() {
        if (this.myInstance === null) {
            this.myInstance = new this();
        }
        return this.myInstance;
    }
    
    static ratingScale = [
        {},{},{},
        {low: 0, avg: 36.9761, high: 117},
        {low: 0, avg: 302.0534, high: 1048},
        {low: 43, avg: 1328.8195, high: 4390},
        {low: 357, avg: 4001.7364, high: 11488}
    ];
    
    static supabase: any;
    // constructor() {}
    public getRandomLetter = (GRID_SIZE: number, rng: any) => {
        const r = rng(); // Math.random();
        for (let i=0; i<LETTERS.length; i++) {
            if (r < LETTERS[i].cutoff && LETTERS[i].wordlength === GRID_SIZE) {
                return LETTERS[i].letter;
            }
        }
        return '?';
    }
    public rateQueue = (q: string[], GRID_SIZE: number) => {
        const words = wordlists[GRID_SIZE];
        let rating = 0;
        words.map((word: string) => {
            const qq = [...q];
            let found = true;
            for (let i=0; i<word.length && found; i++) {
                const index = qq.indexOf(word[i]);
                if (index > -1) {
                    qq.splice(index, 1);
                } else {
                    found = false;
                }
            }
            if (found) {
                rating += 1;
            }
            return null
        });
        const scale = GriddyService.ratingScale[GRID_SIZE];        
        return {rating, low: scale.low, avg: scale.avg, high: scale.high};
    }
    public getRandomQueue = (GRID_SIZE: number, seed: number) => {
        const rng = seedrandom((seed).toString());
        const q = [];
        for (let i=0; i < (GRID_SIZE * GRID_SIZE); i++) {
          q.push(this.getRandomLetter(GRID_SIZE, rng))
        }
        //console.log('rating', this.rateQueue(q, GRID_SIZE));
        return q;
    }

    public calculateScore = async (board: any) => {
        console.log('calculateScore: board', board);
        // let score = 0;
        // let successfulWords = [];
        const GRID_SIZE = board[0].length;
        const trials: string[] = [];
        // create words horizontally
        for (let i=0; i<GRID_SIZE; i++) {
            // left to right
            let trial = '';
            for (let j=0; j<GRID_SIZE; j++) {
                trial += board[i][j];
            }
            trials.push(trial);
            // right to left
            trial = '';
            for (let j=GRID_SIZE-1; j>=0; j--) {
                trial += board[i][j];
            }
            trials.push(trial);
        }
        // create words vertically
        for (let i=0; i<GRID_SIZE; i++) {
            // down
            let trial = '';
            for (let j=0; j<GRID_SIZE; j++) {
                trial += board[j][i];
            }
            trials.push(trial);
            // up
            trial = '';
            for (let j=GRID_SIZE-1; j>=0; j--) {
                trial += board[j][i];
            }
            trials.push(trial);
        }
        // diagonal top left to bottom right
        let trial = '';
        for (let i=0; i<GRID_SIZE; i++) {
            trial += board[i][i];
        }
        trials.push(trial);
        // diagonal bottom left to top right
        trial = '';
        for (let i=GRID_SIZE-1,j=0; i>=0; i--,j++) {
            trial += board[i][j];
        }
        trials.push(trial);

        // diagonal top right to bottom left
        trial = '';
        for (let i=0,j=GRID_SIZE-1; i<GRID_SIZE; i++,j--) {
            trial += board[i][j];
        }
        trials.push(trial);

        // diagonal bottom right to top left
        trial = '';
        for (let i=GRID_SIZE-1,j=GRID_SIZE-1; i>=0; i--,j--) {
            trial += board[i][j];
        }
        trials.push(trial);
        

        console.log('trials', trials);
        
        const foundWords: string[] = [];
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

    // public testHands = async () => {
    //     const ITERATIONS = 1000;
    //     const GRID_SIZES = [3, 4, 5, 6];
    //     const ratings = [0, 0, 0, 0];
    //     const highestRating = [0, 0, 0, 0];
    //     const lowestRating = [99999, 99999, 99999, 99999];
    //     const highestQueue: any[] = [[], [], [], []];
    //     const lowestQueue: any[] = [[], [], [], []];
    //     GRID_SIZES.map((GRID_SIZE: number) => {
    //         console.log('testing GRID_SIZE', GRID_SIZE);
    //         for (let i = 0; i < ITERATIONS; i++) {
    //             const q = this.getRandomQueue(GRID_SIZE);
    //             const rating = this.rateQueue(q, GRID_SIZE);
    //             ratings[GRID_SIZE-3] += rating;
    //             if (rating > highestRating[GRID_SIZE-3]) {
    //                 highestRating[GRID_SIZE-3] = rating;
    //                 highestQueue[GRID_SIZE-3] = q;
    //             }
    //             if (rating < lowestRating[GRID_SIZE-3]) {
    //                 lowestRating[GRID_SIZE-3] = rating;
    //                 lowestQueue[GRID_SIZE-3] = q;
    //             }
    //         }
    //         ratings[GRID_SIZE-3] /= ITERATIONS;
    //         console.log(GRID_SIZE+ ' ratings:', ratings[GRID_SIZE-3]);
    //         console.log(GRID_SIZE+ ' highestRating:', highestRating[GRID_SIZE-3]);
    //         console.log(GRID_SIZE+ ' highestQueue:', highestQueue[GRID_SIZE-3]);
    //         console.log(GRID_SIZE+ ' lowestRating:', lowestRating[GRID_SIZE-3]);
    //         console.log(GRID_SIZE+ ' lowestQueue:', lowestQueue[GRID_SIZE-3]);
    //     });
    // }

}