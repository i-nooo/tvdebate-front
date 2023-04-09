/* eslint-disable no-unused-vars */
/* 오른쪽 기준(rowUtteracne)을 그려주는 구간 */
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
export class RefutationIconDrawerTwo {
  private _visible: boolean = false;
  private _similarityBlock: SimilarityBlock | null = null;

  private readonly insistenceIconGSlection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  private readonly insistenceIconGSlectionTwo!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  private readonly refutationIconGSlection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  private readonly refutationIconGSlectionTwo!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
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

    this.insistenceIconGSlectionTwo = svgSelection
      .append("g")
      .style("visibility", "hidden");
    this.insistenceIconGSlectionTwo
      .append("circle")
      .attr("cx", 309.8)
      .attr("cy", 309.8)
      .attr("r", 309.8)
      .attr("fill", "#339900");
    this.insistenceIconGSlectionTwo
      .append("path")
      .attr(
        "d",
        "M 239.8 183 c -10.6 -10.6 -10.6 -27.9 0 -38.5 s 27.9 -10.6 38.5 0 l 0.8 0.8 l 5.4 5.4 c -7.4 -7.5 -7.4 -19.6 0 -27.1 c 7.5 -7.5 19.6 -7.6 27.2 -0.1 l 11 11 c 31.4 31.5 62.8 62.8 94.3 94.2 c 7.7 7.7 22.7 17.9 24.6 29.4 c 0.6 3.6 -0.2 7.3 -0.4 11 c -0.7 16.1 16.8 27.4 27.2 37.8 l 25.7 25.6 L 374.7 451.8 l -53.6 -53.6 c -1.5 -1.5 -7.5 2.2 -8.9 2.8 c -4.4 2 -7 2.9 -11.7 2.7 c -11.6 -0.5 -23.1 -1.9 -34.6 -3.9 c -20.3 -3.7 -42 -8 -59.9 -0.4 c -9.2 3.9 -16.8 10.9 -22.4 19 c -4 5.7 -7.1 12.1 -12.1 16.9 c -5 4.8 -12.6 7.7 -19.7 4.9 c -4.4 -1.7 -7.9 -5.4 -10.5 -9.4 c -8.3 -12.8 -7.6 -29.1 -1.3 -41.5 c 6.2 -12.3 17.2 -21.2 28.7 -28.8 c 8.8 -5.8 18.5 -12.4 25.8 -20.4 c 9.5 -10.4 14.9 -23.2 8.7 -39.7 L 180 277.3 L 165.7 263 c -10.5 -10.6 -11.2 -28.4 -0.5 -39.1 c 10.5 -10.6 27.7 -10.7 38.4 -0.2 l -4.7 -4.6 c -10.1 -10.5 -10.1 -27.2 0 -37.8 c 10.4 -10.8 27.7 -11.2 38.5 -0.8 L 239.8 183 L 239.8 183 Z"
      )
      .attr("fill", "white");

    this.refutationIconGSlection = svgSelection
      .append("g")
      .style("visibility", "hidden");
    this.refutationIconGSlection
      .append("circle")
      .attr("cx", 309.8)
      .attr("cy", 309.8)
      .attr("r", 309.8)
      .attr("fill", "#ED2933");
    this.refutationIconGSlection
      .append("path")
      .attr(
        "d",
        "M183,239.67l-2.47-2.47a27.25,27.25,0,0,1,38.53-38.53l4.65,4.65A27.13,27.13,0,0,1,223.9,165c10.64-10.64,28.53-10,39.08.54l14.28,14.28L300.5,203c16.55,6.21,29.32.81,39.71-8.72,8-7.31,14.54-17,20.35-25.82,7.57-11.46,16.51-22.41,28.82-28.66s28.66-7,41.46,1.32c4,2.6,7.67,6.16,9.39,10.54,2.77,7.08-.15,14.67-4.91,19.68s-11.15,8.17-16.85,12.12c-8.16,5.66-15.07,13.18-19,22.41-7.62,17.91-3.35,39.57.36,59.91a260.81,260.81,0,0,1,3.95,34.56c.23,4.69-.74,7.25-2.71,11.69-.61,1.39-4.27,7.44-2.79,8.93l53.56,53.56L332.48,493.93l-25.62-25.62c-10.4-10.39-21.69-27.88-37.84-27.17-3.66.16-7.34,1-10.95.37-11.49-1.91-21.77-16.94-29.42-24.62q-47-47.22-94.18-94.32l-11-11.05a19.23,19.23,0,0,1,27.2-27.2L145.25,279l-.76-.75A27.25,27.25,0,0,1,183,239.67Z"
      )
      .attr("fill", "white");

    this.refutationIconGSlectionTwo = svgSelection
      .append("g")
      .style("visibility", "hidden");
    this.refutationIconGSlectionTwo
      .append("circle")
      .attr("cx", 309.8)
      .attr("cy", 309.8)
      .attr("r", 309.8)
      .attr("fill", "#ED2933");
    this.refutationIconGSlectionTwo
      .append("path")
      .attr(
        "d",
        "M 379.6 474.8 c -10.7 10.6 -27.9 10.6 -38.5 0 l -0.8 -0.8 l -5.3 -5.4 l 0 0 c 7.5 7.5 7.5 19.7 0 27.2 s -19.7 7.5 -27.2 0 l -11 -11 c -31.4 -31.5 -62.8 -62.8 -94.3 -94.2 c -7.7 -7.6 -22.7 -17.9 -24.6 -29.4 c -0.6 -3.6 0.2 -7.3 0.4 -11 c 0.7 -16.1 -16.8 -27.4 -27.2 -37.8 l -25.6 -25.6 l 119.4 -119.4 l 53.6 53.6 c 1.5 1.5 7.5 -2.2 8.9 -2.8 c 4.4 -2 7 -2.9 11.7 -2.7 c 11.6 0.5 23.1 1.9 34.6 4 c 20.3 3.7 42 8 59.9 0.4 c 9.2 -3.9 16.8 -10.8 22.4 -19 c 4 -5.7 7.1 -12.1 12.1 -16.9 s 12.6 -7.7 19.7 -4.9 c 4.4 1.7 7.9 5.4 10.5 9.4 c 8.3 12.8 7.6 29.1 1.3 41.5 s -17.2 21.2 -28.7 28.8 c -8.8 5.8 -18.5 12.4 -25.8 20.4 c -9.5 10.4 -14.9 23.2 -8.7 39.7 l 23.2 23.2 l 14.3 14.3 c 10.5 10.5 11.2 28.4 0.5 39.1 c -10.5 10.6 -27.7 10.7 -38.3 0.2 l 4.6 4.6 c 10.1 10.5 10.1 27.2 0 37.8 c -10.4 10.8 -27.7 11.2 -38.5 0.8 l -2.5 -2.5 C 390.2 446.9 390.2 464.2 379.6 474.8 Z"
      )
      .attr("fill", "white");
  }

  public update() {
    if (this._similarityBlock !== null) {
      const rowUtteranceObject = this.utteranceObjectsForDrawing[
        this._similarityBlock.rowUtteranceIndex
      ];
      if (
        rowUtteranceObject.name === "장경태" ||
        rowUtteranceObject.name === "김종대"
      ) {
        this.refutationIconGSlection.style("visibility", "hidden");
      } else {
        const defaultXPos =
          rowUtteranceObject.beginningPointOfXY +
          rowUtteranceObject.width / 2 +
          7;
        const defaultYPos = rowUtteranceObject.beginningPointOfXY - 8;
        const transformProperty = `translate(${defaultXPos}, ${defaultYPos})scale(0.01, 0.01)`;
        this.refutationIconGSlection
          .attr("transform", transformProperty)
          .style("visibility", "visible");
      }
    } else {
      this.refutationIconGSlection.style("visibility", "hidden");
    }
  }

  public set similarityBlock(similarityBlock: SimilarityBlock | null) {
    this._similarityBlock = similarityBlock;
  }

  // public set visible(visible: boolean) {
  //   this._visible = visible;
  // }
}
