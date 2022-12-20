// import { Component, Watch } from 'vue-property-decorator';
// import data from '@/data/raw/out_회의_대학생광고_전략.json';
import morphedData from "../../data/morphed/morphed02.json";
import _ from "lodash";
import axios from "axios";
import util from "../../util";
import defaultInput from "./default.json";
import api from "../../lib";
import {
  NlpSyntax,
  NlpToken,
  NlpEntity,
  // MorphWord,
  // MorphSentence,
} from "../../lib/nlp";
import * as d3 from "d3";

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
export interface MorphWord {
  morph: string;
  tag: string;
}

export interface MorphSentence {
  sentenceText: string;
  morphs: MorphWord;
  engine: MorphEngine;
}

export default class Narrative {
  private syntaxGraphData: any[][] = [];
  // @ts-ignore

  private morphedData: MorphSentence[] = morphedData;
  private modelText: string = defaultInput.text;
  private uiInputModal: boolean = true;
  private uiLoading: boolean = false;
  private output: string = "";
  private entities: NlpEntity[] = [];
  private syntaxes: NlpSyntax[] = [];
  private createPath = d3
    .line()
    // @ts-ignore
    .x((d: { x: number; y: number }) => d.x)
    // @ts-ignore
    .y((d: { x: number; y: number }) => d.y)
    .curve(d3.curveBasis);
  private perHeightDiff = 10;
  //@ts-ignore
  private getArrowCoord(token: NlpToken, i, length) {
    if (token.dependency.label === "ROOT") {
      return `translate(${-1000},0)`;
    }
    const diff = Math.abs(i - token.dependency.index);
    const bottom = length * this.perHeightDiff;
    const ret = {
      transform: `translate(${token.dependency.index * 60 + 30},${
        bottom - 10
      })`,
    };

    return `translate(${token.dependency.index * 60 + 30},${bottom - 10})`;
  }
  // @ts-ignore
  private getLineStartCoord(token: NlpToken, i, length) {
    if (token.dependency.label === "ROOT") {
      return {};
    }
    const diff = i - token.dependency.index;
    const absDiff = Math.abs(i - token.dependency.index);
    const bottom = length * this.perHeightDiff;
    const radialRatio = 6;

    const xs = i * 60 + 30;
    const xe =
      token.dependency.index * 60 + (token.dependency.index > i ? +15 : +45);
    const coords = [
      { x: xs, y: bottom - 5 },
      {
        x: xs + ((xe - xs) / radialRatio) * 1,
        y: bottom - 20 - absDiff * this.perHeightDiff,
      },
      {
        x: xs + ((xe - xs) / radialRatio) * (radialRatio - 1),
        y: bottom - 20 - absDiff * this.perHeightDiff,
      },

      {
        x: xe,
        y: bottom - 10,
      },
    ];
    //@ts-ignore
    return this.createPath(coords);
  }

  private async startAnalysis() {
    this.uiLoading = true;

    await this.analysis();
    await this.parse();
    this.uiInputModal = false;
    this.uiLoading = false;
  }
  private async analysis() {
    this.entities = await api.nlp.nlpEntities(this.modelText);
    let output = this.modelText;

    _.forEach(this.entities, (entity, i) => {
      const regex = new RegExp(entity.text, "gi");
      output = output.replace(
        regex,
        `<b>${entity.text}</b><sup class="footnote">[${i}]</sup>`
      );
    });
    this.output = output;
  }

  private async parse() {
    console.log("call parse");
    this.syntaxes = await api.nlp.nlpParse(this.modelText);

    // this.syntaxGraphData = _.map(this.syntaxes, (syntax) => {
    //   return _.map(syntax.tokens, (token, i) => {
    //     return this.getLineStartCoord(token, i, syntax.tokens.length);
    //   });
    // });
    // console.warn(this.syntaxGraphData);
  }

  // @Watch('modelText')
  // private onModelTextChange() {
  //   this.syntaxes = [];
  //   this.entities = [];
  // }
  // private async mounted() {
  //   // TODO add mounted
  // }
}
