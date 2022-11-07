import { SentenceIndexLexicalChainsDict } from "../classes/LCseg/LCseg";

export interface UtteranceObject {
  name: string;
  utterance: string;
  sentenceObjects: SentenceObject[];
}

export interface SentenceObject {
  sentence: string;
  sentiment: number;
  singleTermCountDict: TermCountDict;
  compoundTermCountDict: TermCountDict;
  time?: string;
}

export interface TermCountDict {
  [term: string]: number;
}

export interface KeytermObject {
  name: string;
  frequency: number;
  index: number; // index of term_list
}

export interface StopwordDict {
  [stopword: string]: boolean;
}

// API interfaces
export interface DebateDataSet {
  utteranceObjects: UtteranceObject[];
  conceptMatrixTransposed: number[][];
  similarityMatrix: number[][];
  termUtteranceBooleanMatrixTransposed: number[][];
  termList: string[];
  keytermObjects: KeytermObject[];
  stopwordDict: StopwordDict;
  frequencyVector: number[];
}

export interface EvaluationDataSet {
  sentenceIndexLexicalChainsDict: SentenceIndexLexicalChainsDict;
  sentenceIndexesForSegmentsOfPeople: number[];
}

export interface DataReqBody {
  debateName: string;
}
