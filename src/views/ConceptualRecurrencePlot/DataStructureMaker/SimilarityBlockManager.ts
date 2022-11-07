/* eslint-disable no-unused-vars */
import _ from "lodash";
import * as math from "mathjs";
import { findTopValueIndexes } from "../../../common_functions/findTopValueIndexes";
import { ParticipantDict } from "../../../common_functions/makeParticipants";
const makeCosineSimilarity = require("compute-cosine-similarity");
import {
  KeytermObject,
  SentenceObject,
  UtteranceObject,
} from "../../../interfaces/DebateDataInterface";
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";

export class SimilarityBlockManager {
  private _similarityBlocks: SimilarityBlock[] = [];
  private _similarityBlockGroup: SimilarityBlock[][] = [];
  private _selfConsistencyWeight: number = 1;
  private _otherConsistencyWeight: number = 1;
  private _refutationWeight: number = 1;
  private _insistenceWeight: number = 1;
  private _sentenceSentimentStandard: number = 0.25;
  private _negativeSumStandard: number = 0.5;
  private _positiveSumStandard: number = 0.5;
  private _colUtteranceLongStandard: number = 200;
  private _hostWeight: number = 1;
  private _hostLongStandard: number = 100;

  public constructor(
    conceptMatrixTransposed: number[][],
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    keytermObjects: KeytermObject[],
    private readonly participantDict: ParticipantDict
  ) {
    // Make similarity_block
    for (
      let utteranceRowIndex = 1;
      utteranceRowIndex < conceptMatrixTransposed.length;
      utteranceRowIndex++
    ) {
      this._similarityBlockGroup.push([]);
      for (
        let utteranceColIndex = 0;
        utteranceColIndex < utteranceRowIndex;
        utteranceColIndex++
      ) {
        const rowUtteranceConcept = conceptMatrixTransposed[utteranceRowIndex];
        const colUtteranceConcept = conceptMatrixTransposed[utteranceColIndex];
        const rowUtteranceObject =
          utteranceObjectsForDrawing[utteranceRowIndex];
        const colUtteranceObject =
          utteranceObjectsForDrawing[utteranceColIndex];

        const partsOfSimilarity = _.map(
          rowUtteranceConcept,
          (keytermScore1, i) => {
            const keytermScore2 = colUtteranceConcept[i];
            // We can check main keyterms to contribute similarityScore here
            return keytermScore1 * keytermScore2;
          }
        );
        const similarityScore = _.sum(partsOfSimilarity);

        const topValueIndexes = findTopValueIndexes(partsOfSimilarity, 10);
        const mainKeytermObjects = _.map(
          topValueIndexes,
          (topValueIndex) => keytermObjects[topValueIndex]
        );

        // Make simialrityBlock
        const conceptSimilarityBlock: SimilarityBlock = {
          beginningPointOfX: colUtteranceObject.beginningPointOfXY,
          beginningPointOfY: rowUtteranceObject.beginningPointOfXY,
          width: colUtteranceObject.width,
          height: rowUtteranceObject.width,
          similarity: similarityScore,
          // similarityScore: math.dot(utterance1Concept, utterance2Concept),
          // similarityScore: makeCosineSimilarity(
          //   utterance1Concept,
          //   utterance2Concept
          // ),
          weight: 1,
          mainKeytermObjects,
          rowUtteranceIndex: utteranceRowIndex,
          columnUtteranceIndex: utteranceColIndex,
          other: rowUtteranceObject.name !== colUtteranceObject.name,
          refutation: false,
          engagementPoint: false,
          visible: true,
        };

        // Because cosine similairity between [0, 0, ...] and [0, 0, ...]
        // if (isNaN(conceptSimilarityBlock.similarity)) {
        //   conceptSimilarityBlock.similarity = 0;
        // }

        // Push the similarityBlock
        this._similarityBlocks.push(conceptSimilarityBlock);
        this._similarityBlockGroup[utteranceRowIndex - 1].push(
          conceptSimilarityBlock
        );
      }
    }

    // Apply refutation
    this.applyRefutation({
      utteranceObjectsForDrawing,
      participantDict,
      similarityBlocks: this._similarityBlocks,
      similarityBlockGroup: this._similarityBlockGroup,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
      negativeSumStandard: this._negativeSumStandard,
      colUtteranceLongStandard: this._colUtteranceLongStandard,
    });
  }

  /**
   * applyWeightedSimilarity
   * @changed_variable : similarityBlock.weight of simialrityBlocks
   */
  private applyWeight() {
    _.forEach(this._similarityBlockGroup, (rowSimilarityBlocks) => {
      _.forEach(rowSimilarityBlocks, (similarityBlock) => {
        let weight: number = 1;

        const rowUtteranceObject: UtteranceObjectForDrawing = this
          .utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];
        const colUtteranceObject: UtteranceObjectForDrawing = this
          .utteranceObjectsForDrawing[similarityBlock.columnUtteranceIndex];

        // apply other_consistency_weight
        // apply self_consistency_weight
        if (similarityBlock.other) {
          weight *= this._otherConsistencyWeight;
        } else {
          weight *= this._selfConsistencyWeight;
        }

        // apply refutation_weight
        if (similarityBlock.refutation) {
          weight *= this._refutationWeight;

          // apply insistence_weight
          if (colUtteranceObject.insistence) {
            weight *= this._insistenceWeight;
          }
        }

        // apply host_weight
        if (
          (rowUtteranceObject.name === "진행자" &&
            rowUtteranceObject.utterance.length > this._hostLongStandard) ||
          (colUtteranceObject.name === "진행자" &&
            colUtteranceObject.utterance.length > this._hostLongStandard)
        ) {
          weight *= this._hostWeight;
        }

        similarityBlock.weight = weight;
      });
    });
  }

  /**
   * applyRefutation
   * @param p
   * @changed_variable similarityBlock in similarityBlocks & similarityBlockGroup
   */
  private applyRefutation(p: {
    utteranceObjectsForDrawing: UtteranceObjectForDrawing[];
    participantDict: ParticipantDict;
    similarityBlocks: SimilarityBlock[];
    similarityBlockGroup: SimilarityBlock[][];
    sentenceSentimentStandard: number;
    negativeSumStandard: number;
    colUtteranceLongStandard: number;
  }) {
    _.forEach(p.similarityBlocks, (similarityBlock) => {
      similarityBlock.refutation = false;

      const rowUtteranceObject =
        p.utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];
      const colUtteranceObject =
        p.utteranceObjectsForDrawing[similarityBlock.columnUtteranceIndex];

      const refutationScore = _.reduce<SentenceObject, number>(
        rowUtteranceObject.sentenceObjects,
        (reduced, sentenceObject) => {
          return sentenceObject.sentiment <= -p.sentenceSentimentStandard
            ? reduced + sentenceObject.sentiment
            : reduced;
        },
        0
      );

      if (refutationScore <= -p.negativeSumStandard) {
        // console.log("refutationScore", refutationScore);
        // console.log("-p.negativeSumStandard", -p.negativeSumStandard);

        const rowSimilarityBlocks =
          p.similarityBlockGroup[similarityBlock.rowUtteranceIndex - 1];
        const filtered = _.filter(
          rowSimilarityBlocks,
          (rowSimilarityBlock, utteranceIndexOfrowSimilarityBlock) => {
            let isFilter: boolean = false;
            if (
              utteranceIndexOfrowSimilarityBlock >=
              similarityBlock.columnUtteranceIndex
            ) {
              const utteranceOjbect1 =
                p.utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];
              const utteranceOjbect2 =
                p.utteranceObjectsForDrawing[
                  utteranceIndexOfrowSimilarityBlock
                ];
              const team1 = p.participantDict[utteranceOjbect1.name].team;
              const team2 = p.participantDict[utteranceOjbect2.name].team;
              if (team1 !== team2 && team1 > 0 && team2 > 0) {
                const utteranceObjectOfRebuttalTarget =
                  p.utteranceObjectsForDrawing[
                    rowSimilarityBlock.columnUtteranceIndex
                  ];
                // TODO
                // if (rowSimilarityBlock.similarityScore > 40000) {
                //   isFilter = true;
                // }
                if (
                  utteranceObjectOfRebuttalTarget.utterance.length >
                  p.colUtteranceLongStandard
                ) {
                  isFilter = true;
                }
              }
            }
            return isFilter;
          }
        );

        const team1 = p.participantDict[colUtteranceObject.name].team;
        const team2 = p.participantDict[rowUtteranceObject.name].team;
        if (
          // TODO
          // conceptSimilarityBlock.similarityScore > 40000 &&
          colUtteranceObject.utterance.length > p.colUtteranceLongStandard &&
          filtered.length === 1 &&
          similarityBlock.rowUtteranceIndex -
            similarityBlock.columnUtteranceIndex <
            20 &&
          team1 !== team2 &&
          team1 > 0 &&
          team2 > 0
        ) {
          similarityBlock.refutation = true;
        }
      }
    });
  }

  public get similarityBlocks(): SimilarityBlock[] {
    return this._similarityBlocks;
  }

  public get similarityBlockGroup(): SimilarityBlock[][] {
    return this._similarityBlockGroup;
  }

  public set selfConsistencyWeight(selfConsistencyWeight: number) {
    this._selfConsistencyWeight = selfConsistencyWeight;
    this.applyWeight();
  }
  public set otherConsistencyWeight(otherConsistencyWeight: number) {
    this._otherConsistencyWeight = otherConsistencyWeight;
    this.applyWeight();
  }
  public set refutationWeight(refutationWeight: number) {
    this._refutationWeight = refutationWeight;
    this.applyWeight();
  }
  public set insistenceWeight(insistenceWeight: number) {
    this._insistenceWeight = insistenceWeight;
    this.applyWeight();
  }
  public set sentenceSentimentStandard(sentenceSentimentStandard: number) {
    this._sentenceSentimentStandard = sentenceSentimentStandard;
    this.applyRefutation({
      utteranceObjectsForDrawing: this.utteranceObjectsForDrawing,
      participantDict: this.participantDict,
      similarityBlocks: this._similarityBlocks,
      similarityBlockGroup: this._similarityBlockGroup,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
      negativeSumStandard: this._negativeSumStandard,
      colUtteranceLongStandard: this._colUtteranceLongStandard,
    });
    this.applyWeight();
  }
  public set negativeSumStandard(negativeSumStandard: number) {
    this._negativeSumStandard = negativeSumStandard;
    this.applyRefutation({
      utteranceObjectsForDrawing: this.utteranceObjectsForDrawing,
      participantDict: this.participantDict,
      similarityBlocks: this._similarityBlocks,
      similarityBlockGroup: this._similarityBlockGroup,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
      negativeSumStandard: this._negativeSumStandard,
      colUtteranceLongStandard: this._colUtteranceLongStandard,
    });
    this.applyWeight();
  }
  public set colUtteranceLongStandard(colUtteranceLongStandard: number) {
    this._colUtteranceLongStandard = colUtteranceLongStandard;
    this.applyRefutation({
      utteranceObjectsForDrawing: this.utteranceObjectsForDrawing,
      participantDict: this.participantDict,
      similarityBlocks: this._similarityBlocks,
      similarityBlockGroup: this._similarityBlockGroup,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
      negativeSumStandard: this._negativeSumStandard,
      colUtteranceLongStandard: this._colUtteranceLongStandard,
    });
    this.applyWeight();
  }

  public set positiveSumStandard(positiveSumStandard: number) {
    // this._positiveSumStandard = positiveSumStandard;
    // this.applyRefutation({
    //   utteranceObjectsForDrawing: this.utteranceObjectsForDrawing,
    //   participantDict: this.participantDict,
    //   similarityBlocks: this._similarityBlocks,
    //   similarityBlockGroup: this._similarityBlockGroup,
    //   sentenceSentimentStandard: this._sentenceSentimentStandard,
    //   negativeSumStandard: this._negativeSumStandard,
    //   colUtteranceLongStandard: this._colUtteranceLongStandard,
    // });
    this.applyWeight();
  }

  public set hostWeight(hostWeight: number) {
    this._hostWeight = hostWeight;
    this.applyWeight();
  }

  public set hostLongStandard(hostLongStandard: number) {
    this._hostLongStandard = hostLongStandard;
    this.applyWeight();
  }
}
