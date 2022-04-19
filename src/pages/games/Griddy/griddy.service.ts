//import * as moment from 'moment';
import SupabaseDataService from "../../../services/supabase.data.service";
import W3 from '../../../data/3.json';
import W4 from '../../../data/4.json';
import W5 from '../../../data/5.json';
import W6 from '../../../data/6.json';
const supabaseDataService = SupabaseDataService.getInstance();

export default class GriddyService {
    static myInstance: any = null;

    static getInstance() {
        if (this.myInstance === null) {
            this.myInstance = new this();
        }
        return this.myInstance;
    }
    
    static weightedLetters: any = {};
    static supabase: any;
    // constructor() {}
    static initialized = false;
    public init = async () => {
        console.log('GriddyService.init');
        if (GriddyService.initialized) { return {error:null}; }
        await supabaseDataService.connect();
        supabaseDataService.supabase = supabaseDataService.getSupabase();
        const { data, error } = await supabaseDataService.supabase
        .from('letters')
        .select('wordlength,letter,cutoff')
        .order('wordlength', 'asc')
        .order('letter', 'asc');
        if (error) {
            console.error('GriddyService.init error', error);
            return;
        }
        const L = GriddyService.weightedLetters;
        // {wordlength: 6, letter: 'B', total: 2276, pct: 0.0240266869352251}
        data.map((item: any) => {
            if (!L[item.wordlength]) L[item.wordlength] = [];
            const LL = L[item.wordlength];
            LL.push({letter: item.letter, cutoff: item.cutoff});
            return null;
        });
        if (!error) {
            GriddyService.initialized = true;
        }
        return { error };
    }
    public getRandomLetter = (GRID_SIZE: number) => {
        // const r = Math.floor(Math.random() * 26);
        // console.log('r', r)
        // return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(r, r + 1);
        const r = Math.random();
        const L = GriddyService.weightedLetters[GRID_SIZE];
        for (let i=0; i<L.length; i++) {
            if (r < L[i].cutoff) {
                return L[i].letter;
            }
        }
        return '?';
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