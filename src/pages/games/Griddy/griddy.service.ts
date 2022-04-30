//const supabaseDataService = SupabaseDataService.getInstance();
import seedrandom from 'seedrandom';

//import * as moment from 'moment';
//import SupabaseDataService from "../../../services/supabase.data.service";
import W3 from '../../../data/3.json';
import W4 from '../../../data/4.json';
import W5 from '../../../data/5.json';
import W6 from '../../../data/6.json';
import LETTERS from '../../../data/letters.json';

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
        let palindromes = 0;
        const palindromeList: string[] = [];
        let q_vowels = 0;
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
                // reverse the word and check again
                const rev = word.split('').reverse().join('');
                if (words.indexOf(rev) > -1) {  
                    palindromes++;
                    palindromeList.push(word);
                }            
                rating++;
            }
            return null
        });
        const scale = GriddyService.ratingScale[GRID_SIZE];  

        const letterTally: any = {A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0,I:0,J:0,K:0,L:0,M:0,N:0,O:0,P:0,Q:0,R:0,S:0,T:0,U:0,V:0,W:0,X:0,Y:0,Z:0};
        q.map((letter: string) => {
            letterTally[letter] += 1;
            if ('AEIOU'.indexOf(letter) !== -1) { q_vowels++; }
            return null;
        })        
        let delta = 0.0;
        let q_delta = 0.0;
        let index = 0;
        for (let l in letterTally) {
            const actual = letterTally[l] / q.length;
            const target = LETTERS[index].pct;
            console.log(`${l}: ${actual} ${target}`);
            delta += Math.abs(actual - target);
            if (letterTally[l] > 0) {
                q_delta += Math.abs(actual - target);
            }
            index++;
        }
        console.log('delta', delta);
        // get vowel count
        let vowelAvg = 0.0
        LETTERS.map((item: any) => {
            if (item.wordlength === GRID_SIZE && 'AEIOU'.indexOf(item.letter) > -1) {
                vowelAvg += item.pct;
            }
            return null;
        })
        vowelAvg = vowelAvg * q.length;
        return {delta, q_delta, rating, 
            low: scale.low, avg: scale.avg, 
            high: scale.high, vowelAvg, q_vowels, palindromes, palindromeList};
    }
    public getRandomQueue = (GRID_SIZE: number, seed: number) => {
        const rng = seedrandom((seed).toString());
        const q = [];
        for (let i=0; i < (GRID_SIZE * GRID_SIZE); i++) {
          q.push(this.getRandomLetter(GRID_SIZE, rng))
        }
        const reserves = [];
        for (let i=0; i < (GRID_SIZE * GRID_SIZE); i++) {
            reserves.push(this.getRandomLetter(GRID_SIZE, rng))
        }
        //console.log('rating', this.rateQueue(q, GRID_SIZE));
        return {q, reserves};
    }

    public calculateScore = async (board: any) => {
        //console.log('calculateScore: board', board);
        // let score = 0;
        // let successfulWords = [];
        const GRID_SIZE = board[0].length;
        let trial = '';
        const trials: string[] = [];

        // diagonal top left to bottom right
        trial = '';
        for (let i=0; i<GRID_SIZE; i++) {
            trial += board[i][i];
        }
        if (trial.length !== GRID_SIZE) trial = '';
        trials.push(trial);

        for (let i=0; i<GRID_SIZE; i++) {
            // down
            trial = '';
            for (let j=0; j<GRID_SIZE; j++) {
                trial += board[j][i];
            }
            if (trial.length !== GRID_SIZE) trial = '';
            trials.push(trial);
        }

        // diagonal top right to bottom left
        trial = '';
        for (let i=0,j=GRID_SIZE-1; i<GRID_SIZE; i++,j--) {
            trial += board[i][j];
        }
        if (trial.length !== GRID_SIZE) trial = '';
        trials.push(trial);

        for (let i=0; i<GRID_SIZE; i++) {
            // left to right
            trial = '';
            for (let j=0; j<GRID_SIZE; j++) {
                trial += board[i][j];
            }
            trials.push(trial);
            // right to left
            trial = '';
            for (let j=GRID_SIZE-1; j>=0; j--) {
                trial += board[i][j];
            }
            if (trial.length !== GRID_SIZE) trial = '';
            trials.push(trial);
        }

        // diagonal bottom left to top right
        trial = '';
        for (let i=GRID_SIZE-1,j=0; i>=0; i--,j++) {
            trial += board[i][j];
        }
        if (trial.length !== GRID_SIZE) trial = '';
        trials.push(trial);

        for (let i=0; i<GRID_SIZE; i++) {
            // up
            trial = '';
            for (let j=GRID_SIZE-1; j>=0; j--) {
                trial += board[j][i];
            }
            if (trial.length !== GRID_SIZE) trial = '';
            trials.push(trial);
        }

        // diagonal bottom right to top left
        trial = '';
        for (let i=GRID_SIZE-1,j=GRID_SIZE-1; i>=0; i--,j--) {
            trial += board[i][j];
        }
        if (trial.length !== GRID_SIZE) trial = '';
        trials.push(trial);
        
        //console.log('trials', trials);
        
        const foundWords: string[] = [];
        const foundIndexes: number[] = [];
        trials.map((word: string, index: number) => {
            if (wordlists[GRID_SIZE].length && wordlists[GRID_SIZE]?.indexOf(word) > -1) {
                foundWords.push(word);
                foundIndexes.push(index);
            }
            return null;
        });
        // const { data, error } = await supabaseDataService.supabase
        // .rpc('calculate_score', {trials});
        // console.log('calculate_score data, error', data, error);

        return {data: foundWords.join(', '), indexes: foundIndexes, error: null};
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

    public getPermutations = (arr: string[]) => {
        // some global variable to store the results
        const result:string[] = []

        // currentSize should be invoked with the array size
        function permutation(arr: string[], currentSize: number) {
            if (currentSize === 1) { // recursion base-case (end)
                result.push(arr.join(""));
                return;
            }
            
            for (let i = 0; i < currentSize; i++){
                permutation(arr, currentSize - 1);
                if (currentSize % 2 === 1) {
                    let temp = arr[0];
                    arr[0] = arr[currentSize - 1];
                    arr[currentSize - 1] = temp;
                } else {
                    let temp = arr[i];
                    arr[i] = arr[currentSize - 1];
                    arr[currentSize - 1] = temp;
                }
            }
        }

        permutation(arr, arr.length);
        return result;

    }
    public solve = async (choices: string[]) => {
        // get all possble permutations of choices array
        const solutions = this.getPermutations(choices);
        let highScore = 0;
        let bestBoard = '';
        const GRID_SIZE = 3;   
        console.log('going through solutions', solutions.length);
        solutions.map(async (solutionx: string, index: number) => {
            const solution = solutionx.split('');   
            const board: string[][] = [...Array(GRID_SIZE)].map(x=>Array(GRID_SIZE).fill(''))
            board[0][0] = solution[0];
            board[0][1] = solution[1];
            board[0][2] = solution[2];
            board[1][0] = solution[3];
            board[1][1] = solution[4];
            board[1][2] = solution[5];
            board[2][0] = solution[6];
            board[2][1] = solution[7];
            board[2][2] = solution[8];
            const { data, indexes, error } = await this.calculateScore(board);
            if (error) {}
            if (indexes) {}
            const scr = data.split(', ').length;
            if (scr > highScore) {
                highScore = scr;
                bestBoard = solutionx;
            }
            if (index % 1000 === 0) {
                console.log('solution', index, 'of', solutions.length, 'highScore', highScore, 'bestBoard', bestBoard);
            }
        })
        console.log('highScore', highScore);
        console.log('bestBoard', bestBoard); 
    }
}