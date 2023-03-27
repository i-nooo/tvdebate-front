/* eslint-disable no-unused-vars */
/* 왼쪽 기준(columnUtteracne)을 그려주는 구간 */
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
import {
  KeytermObject,
  DebateDataSet,
} from "../../../interfaces/DebateDataInterface";
import { findTopValueIndexes } from "../../../common_functions/findTopValueIndexes";
export class InsistenceIconDrawer {
  private _visible: boolean = false;
  private _similarityBlock: SimilarityBlock | null = null;

  private readonly insistenceIconGSlection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    private readonly keywordDrawer: KeytermObject[],
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    // green 따봉
    this.insistenceIconGSlection = svgSelection
      .append("g")
      .style("visibility", "hidden");
    this.insistenceIconGSlection
      .append("circle")
      .attr("cx", 309.8)
      .attr("cy", 309.8)
      .attr("r", 309.8)
      .attr("fill", "#339900");
    this.insistenceIconGSlection
      .append("path")
      .attr(
        "d",
        "M436.41,379.59l2.47,2.48a27.25,27.25,0,0,1-38.53,38.53l-4.65-4.66a27.13,27.13,0,0,1-.18,38.36c-10.63,10.64-28.52,10-39.07-.54l-14.28-14.28-23.24-23.25c-16.55-6.21-29.32-.81-39.71,8.71-8,7.31-14.54,17.05-20.35,25.83-7.57,11.45-16.51,22.41-28.82,28.66s-28.66,7-41.46-1.32c-4-2.6-7.67-6.16-9.39-10.55-2.77-7.07.14-14.66,4.91-19.67s11.15-8.17,16.85-12.13c8.15-5.65,15.07-13.17,19-22.41,7.62-17.9,3.35-39.57-.36-59.9a260.81,260.81,0,0,1-3.95-34.56c-.23-4.69.74-7.26,2.71-11.69.61-1.39,4.27-7.45,2.79-8.93L167.59,244.7,287,125.33,312.57,151c10.4,10.4,21.69,27.89,37.84,27.17,3.66-.16,7.34-1,10.95-.36,11.49,1.91,21.77,16.94,29.42,24.62q47,47.2,94.18,94.31L496,307.75a19.23,19.23,0,0,1-27.2,27.19l5.37,5.37.76.76a27.24,27.24,0,0,1-38.53,38.52Z"
      )
      .attr("fill", "white");
    const colUtteranceObject = this.utteranceObjectsForDrawing[
      //@ts-ignore
      this._similarityBlock?.columnUtteranceIndex
    ];
    //console.log(colUtteranceObject);
    this.insistenceIconGSlection
      .append("text")
      .text(`${this._similarityBlock?.mainKeytermObjects}`);
    //.text(`${this._similarityBlock?.columnUtteranceIndex}`);
  }

  public update() {
    // 어떤 곳에 넣어야 제대로 나올까?
    // const participantKeywordDataBound = this.insistenceIconGSlection
    //   .selectAll<SVGRectElement, UtteranceObjectForDrawing>("rect")
    //   .data(this.utteranceObjectsForDrawing)
    //   .join("rect");
    //console.log(participantKeywordDataBound);
    if (this._similarityBlock) {
      const colUtteranceObject = this.utteranceObjectsForDrawing[
        this._similarityBlock.columnUtteranceIndex
      ];
      //const mainKeywordObjects = findTopValueIndexes();
      // console.log(colUtteranceObject.utterance);
      if (
        colUtteranceObject.name === "장경태" ||
        colUtteranceObject.name === "김종대"
      ) {
        // Draw Agree Icon
        const defaultXPos =
          colUtteranceObject.beginningPointOfXY +
          colUtteranceObject.width / 2 +
          7;
        const defaultYPos = colUtteranceObject.beginningPointOfXY - 8;
        const transformProperty = `translate(${defaultXPos}, ${defaultYPos}) scale(0.01, 0.01)`;
        this.insistenceIconGSlection
          .attr("transform", transformProperty)
          .style("visibility", "visible");
      } else {
        this.insistenceIconGSlection.style("visibility", "hidden");
      }
    } else {
      this.insistenceIconGSlection.style("visibility", "hidden");
    }
  }

  public set similarityBlock(similarityBlock: SimilarityBlock | null) {
    this._similarityBlock = similarityBlock;
  }
  // stopPropagation 적용 필요해보임.
  // public set visible(visible: boolean) {
  //   this._visible = visible;
  // }
}
