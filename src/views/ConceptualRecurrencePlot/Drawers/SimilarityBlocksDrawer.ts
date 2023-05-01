/* eslint-disable no-unused-vars */
import _ from "lodash";
import { hexToRgb } from "../../../common_functions/hexToRgb";
import { ParticipantDict } from "../../../common_functions/makeParticipants";
import { SentenceObject } from "../../../interfaces/DebateDataInterface";
import { UtteranceObjectForDrawing } from "../interfaces";
import { SimilarityBlock } from "../interfaces";
import { Tooltip } from "antd";
import * as fs from "fs";

export type ColoringSelfSimilarities =
  | "none"
  | "oneColor"
  | "participantColors";

export class SimilarityBlocksDrawer {
  private readonly conceptSimilarityRectGSelection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  private _coloringSelfSimilarities: ColoringSelfSimilarities = "none";
  private _showEngagementPoint: boolean = false;
  private _coloringRebuttal: boolean = true; // 토론의 주장과 반박 연쇄 일어나는 구간 색상 부여
  private _standardHighPointOfSimilarityScore!: number;
  private _findDisagreeScaleScore!: number;

  private _clickListener:
    | ((e: MouseEvent, d: SimilarityBlock) => void)
    | null = null;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    private readonly similarityBlocks: SimilarityBlock[],
    private readonly similarityBlockGroup: SimilarityBlock[][],
    private readonly participantDict: ParticipantDict,
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    //
    this.conceptSimilarityRectGSelection = svgSelection.append("g");
  }

  public set standardHighPointOfSimilarityScore(
    standardHighPointOfSimilarityScore: number
  ) {
    this._standardHighPointOfSimilarityScore = standardHighPointOfSimilarityScore;
  }

  public set findDisagreeScaleScore(findDisagreeScaleScore: number) {
    this._findDisagreeScaleScore = findDisagreeScaleScore;
  }

  public applyColorRatioSettingByTopSimilarityBlock() {
    const mostHighSimilarityBlock = _.maxBy(
      this.similarityBlocks,
      (similarityBlock) => similarityBlock.weight * similarityBlock.similarity
    )!;
    this._standardHighPointOfSimilarityScore =
      mostHighSimilarityBlock.weight * mostHighSimilarityBlock.similarity;
  }

  public update() {
    const similarityRectGSelectionDataBound = this.conceptSimilarityRectGSelection
      .selectAll<SVGRectElement, unknown>("rect")
      .data(this.similarityBlocks)
      .style("fill", (d) => {
        return d.visible
          ? fillColorOfSimilarityBlock(
              d,
              this.utteranceObjectsForDrawing,
              this.similarityBlockGroup,
              this.participantDict,
              this._standardHighPointOfSimilarityScore,
              this._coloringSelfSimilarities,
              this._coloringRebuttal
            )
          : "none";
      })
      .style("stroke-width", 3)
      .style("stroke", (d) =>
        this._showEngagementPoint && d.engagementPoint
          ? "rgb(97, 64, 65)"
          : null
      );

    similarityRectGSelectionDataBound
      .enter()
      .append("rect")
      .attr("x", (d) => d.beginningPointOfX)
      .attr("y", (d) => d.beginningPointOfY)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .style("fill", (d) => {
        return d.visible
          ? fillColorOfSimilarityBlock(
              // 유사도 블록 색칠해주는 구간.
              d,
              this.utteranceObjectsForDrawing,
              this.similarityBlockGroup,
              this.participantDict,
              this._standardHighPointOfSimilarityScore,
              this._coloringSelfSimilarities,
              this._coloringRebuttal
            )
          : "none";
      })
      .style("stroke-width", 3)
      .style("stroke", (d) =>
        this._showEngagementPoint && d.engagementPoint
          ? "rgb(97, 64, 65)"
          : null
      )
      .on("click", (e, d) => {
        const mouseEvent = (e as unknown) as MouseEvent;
        mouseEvent.stopPropagation();
        const similarityBlock = (d as unknown) as SimilarityBlock;

        if (this._clickListener) {
          this._clickListener(mouseEvent, similarityBlock);
        }
      })
      .append("title")
      .text(
        (d, i) =>
          `findArgument: ${
            d.refutation ? d.refutation : "none"
          },\n주장발화자Index: ${d.columnUtteranceIndex},\n반박발화자Index: ${
            d.rowUtteranceIndex
          },\nsimilarityScore: ${
            ((d.similarity * d.weight) /
              // Math.abs(d.columnUtteranceIndex - d.rowUtteranceIndex)) *
              Math.sqrt(
                Math.abs(d.columnUtteranceIndex - d.rowUtteranceIndex)
              )) *
            1
            // d.similarity * d.weight
          },\nkeywords: ${_.map(
            d.mainKeytermObjects,
            (mainKeytermObject) => `${mainKeytermObject.name}`
          )}`
      );

    similarityRectGSelectionDataBound.exit().remove();

    function fillColorOfSimilarityBlock(
      similarityBlock: SimilarityBlock,
      utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
      conceptSimilarityMatrix: SimilarityBlock[][],
      participantDict: ParticipantDict,
      limitConstant: number,
      coloringSelfSimilarities: ColoringSelfSimilarities,
      coloringRebuttal: boolean
    ): string {
      let opacity: number = 0;
      const indexDiff = Math.abs(
        similarityBlock.columnUtteranceIndex - similarityBlock.rowUtteranceIndex
      );
      const realWeightValue =
        similarityBlock.weight * similarityBlock.similarity;
      // const weightedSimilarity =
      //   ((similarityBlock.weight * similarityBlock.similarity) /
      //     (indexDiff * indexDiff)) *
      //   50;
      const weightedSimilaritySample =
        ((realWeightValue / indexDiff) * 10) / 16.3560974414804;
      // weightedSimilaritySample > 0.4: red, 0.04 : oragne, else: yellow

      if (realWeightValue > limitConstant) {
        opacity = 1;
      } else {
        //const opacityScore = similarityBlock.similarity * 10;
        //const normalizedOpacityScore = Math.min(opacityScore, 1);
        // delete limitConstant

        opacity = weightedSimilaritySample;
        // opacity = weightedSimilarity / limitConstant;
      }

      let color = `rgba(247, 191, 100, ${opacity * 0})`; // 피라미드 색상

      const rowUtteranceObject =
        utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];
      const colUtteranceObject =
        utteranceObjectsForDrawing[similarityBlock.columnUtteranceIndex];

      // Update Coloring Self Similarities
      if (!similarityBlock.other) {
        switch (coloringSelfSimilarities) {
          case "oneColor":
            color = `rgba(198, 66, 66, ${opacity})`;
            break;
          case "participantColors":
            // eslint-disable-next-line no-case-declarations
            const rgb = hexToRgb(
              participantDict[rowUtteranceObject.name].color
            );
            color = `rgba(${rgb!.r}, ${rgb!.g}, ${rgb!.b}, ${opacity})`;
            // color = `rgba(198, 66, 66, ${opacity})`;
            break;
        }
      }
      const allOpacityValues: number[] = [];

      function hexToRGBA(hex: string, alpha: number) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      if (coloringRebuttal && similarityBlock.refutation) {
        const finalColorss = [
          "#400000",
          "#755005",
          "#7e5605",
          "#885c07",
          "#916209",
          "#9b680d",
          "#a46f12",
          "#ad7517",
          "#b67c1d",
          "#c08324",
          "#c88a2c",
          "#d19134",
          "#d9993e",
          "#e1a048",
          "#e9a854",
          "#efb060",
          "#f5b86f",
          "#fac17f",
          "#fffbf8", // 18
          "#fed4a9",
          "#fcdec3",
        ];

        const finalColors = [
          "#200611",
          "#280909",
          "#400000",
          "#4a0101",
          "#540402",
          "#5d0904",
          "#661005",
          "#6e1807",
          "#762008",
          "#7d2809",
          "#84300a",
          "#8b380a",
          "#91410b",
          "#974a0d",
          "#9c520e",
          "#a15b10",
          "#a66412",
          "#aa6d15",
          "#ae7619",
          "#b77d22",
          "#bf842c", // 18
          "#c68c37",
          "#cd9343",
          "#d49b4f",
          "#dba35b",
          "#e1ab68",
          "#e7b376",
          "#ecbb84",
          "#f1c493",
          "#f5cca3",
          "#f9d5b3",
          "#fcdec3",
        ];

        // const finalColorss = [
        //   "#400000",
        //   "#430402",
        //   "#470804",
        //   "#4a0d06",
        //   "#4e1208",
        //   "#52160a",
        //   "#551a0c",
        //   "#591e0d",
        //   "#5d220e",
        //   "#60260f",
        //   "#642a10",
        //   "#682d11",
        //   "#6c3112",
        //   "#703513",
        //   "#733914",
        //   "#773d15",
        //   "#7b4117",
        //   "#7f4518",
        //   "#834819",
        //   "#874c1b",
        //   "#8b501c",
        //   "#8f541e",
        //   "#935820",
        //   "#975c22",
        //   "#9b6024",
        //   "#9f6426",
        //   "#a36829",
        //   "#a76c2b",
        //   "#ab702e",
        //   "#af7431",
        //   "#b37834",
        //   "#b77c38",
        //   "#ba803b",
        //   "#be843f",
        //   "#c28943",
        //   "#c68d47",
        //   "#ca914c",
        //   "#ce9550",
        //   "#d29a56",
        //   "#d59e5b",
        //   "#d9a261",
        //   "#dca767",
        //   "#e0ab6d",
        //   "#e3af73",
        //   "#e6b47a",
        //   "#e9b881",
        //   "#ecbd88",
        //   "#efc290",
        //   "#f2c698",
        //   "#f4cba0",
        //   "#f6d0a9",
        //   "#f8d4b1",
        //   "#fad9ba",
        //   "#fcdec3",
        // ];

        let selectedColor;

        // 수정된 코드
        const adjustedOpacity =
          (opacity /
            Math.sqrt(
              Math.abs(
                similarityBlock.columnUtteranceIndex -
                  similarityBlock.rowUtteranceIndex
              )
            )) *
          50;

        let finalOpacity: number = 1;

        // console.log(adjustedOpacity);
        const adjustedOpacityValues = [
          18.82751331,
          6.981868806,
          3.869509114,
          2.468925094,
          1.903323926,
          1.542776171,
          1.213284972,
          1.088114596,
          0.942875687,
          0.828912509,
          0.706295081,
          0.63287685,
          0.591230262,
          0.538005371,
          0.463493915,
          0.427013104,
          0.384948635,
          0.34470879,
          0.319079873,
          0.292835439,
          0.270182682,
          0.258855898,
          0.250068499,
          0.232544626,
          0.219586255,
          0.202812561,
          0.190284102,
          0.174569335,
          0.16811274,
          0.15309027,
          0.145516623,
          0.136490058,
          0.129594874,
          0.123529022,
          0.111817947,
          0.107986048,
          0.101794567,
          0.093841692,
          0.089619484,
          0.087219676,
          0.085178754,
          0.078508682,
          0.071999629,
          0.070674205,
          0.066783795,
          0.058822291,
          0.042814651,
          0.038027543,
          0.035979082,
          0.025598677,
          0.021260026,
          0.016818621,
          0.01293302,
          0.005213995,
        ]; // 전체 refutation 54개 단위로 끊은 값.

        if (opacity >= 1) {
          selectedColor = finalColors[0];
        } else if (opacity > 0.57) {
          selectedColor = finalColors[1];
        } else if (opacity > 0.5) {
          selectedColor = finalColors[2];
        } else if (opacity > 0.4) {
          selectedColor = finalColors[3];
        } else if (opacity > 0.3) {
          selectedColor = finalColors[4];
        } else if (opacity > 0.2) {
          selectedColor = finalColors[5];
        } else if (opacity > 0.15) {
          selectedColor = finalColors[6];
        } else if (opacity >= 0.083147) {
          selectedColor = finalColors[7];
        } else if (opacity >= 0.059303) {
          selectedColor = finalColors[8];
        } else if (opacity >= 0.044627) {
          selectedColor = finalColors[9];
        } else if (opacity >= 0.036694) {
          selectedColor = finalColors[10];
        } else if (opacity >= 0.031783) {
          selectedColor = finalColors[11];
        } else if (opacity >= 0.028122) {
          selectedColor = finalColors[12];
        } else if (opacity >= 0.023232) {
          selectedColor = finalColors[13];
        } else if (opacity >= 0.020771) {
          selectedColor = finalColors[14];
        } else if (opacity >= 0.018342) {
          selectedColor = finalColors[15];
        } else if (opacity >= 0.014674) {
          selectedColor = finalColors[16];
        } else if (opacity >= 0.012841) {
          selectedColor = finalColors[17];
        } else if (opacity >= 0.011471) {
          selectedColor = finalColors[18];
        } else if (opacity >= 0.010447) {
          selectedColor = finalColors[19];
        } else if (opacity >= 0.008954) {
          selectedColor = finalColors[20];
        } else if (opacity >= 0.005116) {
          selectedColor = finalColors[21];
        } else if (opacity >= 0.003529) {
          selectedColor = finalColors[22];
        } else if (opacity >= 0.002281) {
          selectedColor = finalColors[23];
        } else selectedColor = finalColors[24];

        // if (opacity > adjustedOpacityValues[0]) {
        //   selectedColor = finalColors[0];
        // } else if (opacity >= adjustedOpacityValues[1]) {
        //   selectedColor = finalColors[1];
        // } else if (opacity >= adjustedOpacityValues[2]) {
        //   selectedColor = finalColors[2];
        // } else if (opacity >= adjustedOpacityValues[3]) {
        //   selectedColor = finalColors[3];
        // } else if (opacity >= adjustedOpacityValues[4]) {
        //   selectedColor = finalColors[4];
        // } else if (opacity >= adjustedOpacityValues[5]) {
        //   selectedColor = finalColors[5];
        // } else if (opacity >= adjustedOpacityValues[6]) {
        //   selectedColor = finalColors[6];
        // } else if (opacity >= adjustedOpacityValues[7]) {
        //   selectedColor = finalColors[7];
        // } else if (opacity >= adjustedOpacityValues[8]) {
        //   selectedColor = finalColors[8];
        // } else if (opacity >= adjustedOpacityValues[9]) {
        //   selectedColor = finalColors[9];
        // } else if (opacity >= adjustedOpacityValues[10]) {
        //   selectedColor = finalColors[10];
        // } else if (opacity >= adjustedOpacityValues[11]) {
        //   selectedColor = finalColors[11];
        // } else if (opacity >= adjustedOpacityValues[12]) {
        //   selectedColor = finalColors[12];
        // } else if (opacity >= adjustedOpacityValues[13]) {
        //   selectedColor = finalColors[13];
        // } else if (opacity >= adjustedOpacityValues[14]) {
        //   selectedColor = finalColors[14];
        // } else if (opacity >= adjustedOpacityValues[15]) {
        //   selectedColor = finalColors[15];
        // } else if (opacity >= adjustedOpacityValues[16]) {
        //   selectedColor = finalColors[16];
        // } else if (opacity >= adjustedOpacityValues[17]) {
        //   selectedColor = finalColors[17];
        // } else if (opacity >= adjustedOpacityValues[18]) {
        //   selectedColor = finalColors[18];
        // } else if (opacity >= adjustedOpacityValues[19]) {
        //   selectedColor = finalColors[19];
        // } else if (opacity >= adjustedOpacityValues[20]) {
        //   selectedColor = finalColors[20];
        // } else if (opacity >= adjustedOpacityValues[21]) {
        //   selectedColor = finalColors[21];
        // } else if (opacity >= adjustedOpacityValues[22]) {
        //   selectedColor = finalColors[22];
        // } else if (opacity >= adjustedOpacityValues[23]) {
        //   selectedColor = finalColors[23];
        // } else if (opacity >= adjustedOpacityValues[24]) {
        //   selectedColor = finalColors[24];
        // } else if (opacity >= adjustedOpacityValues[25]) {
        //   selectedColor = finalColors[25];
        // } else if (opacity >= adjustedOpacityValues[26]) {
        //   selectedColor = finalColors[26];
        // } else if (opacity >= adjustedOpacityValues[27]) {
        //   selectedColor = finalColors[27];
        // } else if (opacity >= adjustedOpacityValues[28]) {
        //   selectedColor = finalColors[28];
        // } else if (opacity >= adjustedOpacityValues[29]) {
        //   selectedColor = finalColors[29];
        // } else if (opacity >= adjustedOpacityValues[30]) {
        //   selectedColor = finalColors[30];
        // } else if (opacity >= adjustedOpacityValues[31]) {
        //   selectedColor = finalColors[31];
        // } else if (opacity >= adjustedOpacityValues[32]) {
        //   selectedColor = finalColors[32];
        // } else if (opacity >= adjustedOpacityValues[33]) {
        //   selectedColor = finalColors[33];
        // } else if (opacity >= adjustedOpacityValues[34]) {
        //   selectedColor = finalColors[34];
        // } else if (opacity >= adjustedOpacityValues[35]) {
        //   selectedColor = finalColors[35];
        // } else if (opacity >= adjustedOpacityValues[36]) {
        //   selectedColor = finalColors[36];
        // } else if (opacity >= adjustedOpacityValues[37]) {
        //   selectedColor = finalColors[37];
        // } else if (opacity >= adjustedOpacityValues[38]) {
        //   selectedColor = finalColors[38];
        // } else if (opacity >= adjustedOpacityValues[39]) {
        //   selectedColor = finalColors[39];
        // } else if (opacity >= adjustedOpacityValues[40]) {
        //   selectedColor = finalColors[40];
        // } else if (opacity >= adjustedOpacityValues[41]) {
        //   selectedColor = finalColors[41];
        // } else if (opacity >= adjustedOpacityValues[42]) {
        //   selectedColor = finalColors[42];
        // } else if (opacity >= adjustedOpacityValues[43]) {
        //   selectedColor = finalColors[43];
        // } else if (opacity >= adjustedOpacityValues[44]) {
        //   selectedColor = finalColors[44];
        // } else if (opacity >= adjustedOpacityValues[45]) {
        //   selectedColor = finalColors[45];
        // } else if (opacity >= adjustedOpacityValues[46]) {
        //   selectedColor = finalColors[46];
        // } else if (opacity >= adjustedOpacityValues[47]) {
        //   selectedColor = finalColors[47];
        // } else if (opacity >= adjustedOpacityValues[48]) {
        //   selectedColor = finalColors[48];
        // } else if (opacity >= adjustedOpacityValues[49]) {
        //   selectedColor = finalColors[49];
        // } else if (opacity >= adjustedOpacityValues[50]) {
        //   selectedColor = finalColors[50];
        // } else if (opacity >= adjustedOpacityValues[51]) {
        //   selectedColor = finalColors[51];
        // } else if (opacity >= adjustedOpacityValues[52]) {
        //   selectedColor = finalColors[52];
        // } else if (opacity >= adjustedOpacityValues[53]) {
        //   selectedColor = finalColors[53];
        // } else {
        //   selectedColor = finalColors[54];
        // }

        // for (let index = 0; index < adjustedOpacityValues.length; index++) {
        //   if (opacity >= adjustedOpacityValues[index]) {
        //     selectedColor = finalColors[index];
        //     break;
        //   }
        // }

        // if (!selectedColor) {
        //   selectedColor = finalColors[adjustedOpacityValues.length];
        // }

        // const opacityStep = 0.018;

        // for (let i = 0; i <= 54; i++) {
        //   if (adjustedOpacity >= adjustedOpacityValues[i]) {
        //     if (
        //       similarityBlock.rowUtteranceIndex -
        //         similarityBlock.columnUtteranceIndex <
        //       10
        //     ) {
        //       finalOpacity = 1 - i * opacityStep;
        //     } else {
        //       finalOpacity = 0.75 - i * opacityStep;
        //     }
        //     break;
        //   }
        // }

        if (adjustedOpacity >= adjustedOpacityValues[0]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 1;
          } else {
            finalOpacity = 0.74;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[1]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.96;
          } else {
            finalOpacity = 0.7;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[2]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.92;
          } else {
            finalOpacity = 0.68;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[3]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.88;
          } else {
            finalOpacity = 0.64;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[4]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.84;
          } else {
            finalOpacity = 0.6;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[5]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.8;
          } else {
            finalOpacity = 0.56;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[6]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.76;
          } else {
            finalOpacity = 0.52;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[7]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.72;
          } else {
            finalOpacity = 0.48;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[8]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.68;
          } else {
            finalOpacity = 0.44;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[9]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.64;
          } else {
            finalOpacity = 0.4;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[10]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.6;
          } else {
            finalOpacity = 0.36;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[11]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.55;
          } else {
            finalOpacity = 0.31;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[12]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.5;
          } else {
            finalOpacity = 0.26;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[13]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.45;
          } else {
            finalOpacity = 0.21;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[14]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.43;
          } else {
            finalOpacity = 0.19;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[15]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.4;
          } else {
            finalOpacity = 0.16;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[16]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.36;
          } else {
            finalOpacity = 0.12;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[17]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.32;
          } else {
            finalOpacity = 0.08;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[18]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.25;
          } else {
            finalOpacity = 0.05;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[19]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.2;
          } else {
            finalOpacity = 0.04;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[20]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.16;
          } else {
            finalOpacity = 0.035;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[21]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.14;
          } else {
            finalOpacity = 0.033;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[22]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.11;
          } else {
            finalOpacity = 0.03;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[23]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.08;
          } else {
            finalOpacity = 0.025;
          }
        } else if (adjustedOpacity >= adjustedOpacityValues[24]) {
          if (
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
            33
          ) {
            finalOpacity = 0.06;
          } else {
            finalOpacity = 0.02;
          }
        } else {
          finalOpacity = 0.05;
        }

        const rgbaColor = hexToRGBA(selectedColor, finalOpacity * 0.9);

        color = rgbaColor;
      }
      return color;
    }
  }
  public get allOpacityValues(): number[] {
    return this.allOpacityValues;
  }

  public set coloringSelfSimilarities(
    coloringSelfSimilarities: ColoringSelfSimilarities
  ) {
    this._coloringSelfSimilarities = coloringSelfSimilarities;
  }

  public set showEngagementPoint(showEngagementPoint: boolean) {
    this._showEngagementPoint = showEngagementPoint;
    console.log("setter inner", this._showEngagementPoint);
  }

  public set coloringRebuttal(coloringRebuttal: boolean) {
    this._coloringRebuttal = coloringRebuttal;
  }

  public set clickListener(
    mouseoverListener: (e: MouseEvent, d: SimilarityBlock) => void
  ) {
    this._clickListener = mouseoverListener;
  }
}
