import axios from "axios";

const HOST = "https://api.hyunwoo.io";

export type MorphEngine =
  | "KMR"
  | "KKMA"
  | "EUNJEON"
  | "ARIRANG"
  | "RHINO"
  | "DAON"
  | "OKT"
  | "HNN"
  | "ETRI";

export interface NlpToken {
  tag: string;
  text: string;
  dependency: {
    index: number;
    label: string;
  };
}
export interface NlpSyntax {
  sentences: string;
  tokens: [];
}

export interface NlpEntity {
  text: string;
  type: string;
  salience: number;
}

export interface MorphWord {
  morph: string;
  tag: string;
}

export interface MorphSentence {
  sentenceText: string;
  morphs: MorphWord;
  engine: MorphEngine;
}

export interface NlpTaggerInput {
  [key: string]: any;
  text: string;
}

export interface NlpTaggerResult {
  [key: string]: any;
  tags: MorphSentence;
}

export class Nlp {
  //@ts-ignore
  public async nlpEntities(text): Promise<NlpEntity[]> {
    const r = await axios.post(`${HOST}/nlp/entities`, {
      text,
    });
    const result: NlpEntity[] = r.data;
    return result;
  }
  //@ts-ignore
  public async nlpParse(text): Promise<NlpSyntax[]> {
    const r = await axios.post(`${HOST}/nlp/parse`, {
      text,
    });
    const result: NlpSyntax[] = r.data;
    return result;
  }
  public async nlpTagger(
    items: NlpTaggerInput[],
    engine?: MorphEngine
  ): Promise<NlpTaggerResult[]> {
    const r = (
      await axios.post(`${HOST}/morph/tagger`, {
        items,
        engine: engine ? engine : "KMR",
      })
    ).data;
    return r;
  }
}

const nlp = new Nlp();

export default nlp;
