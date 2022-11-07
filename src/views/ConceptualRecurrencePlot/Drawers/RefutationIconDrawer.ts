/* eslint-disable no-unused-vars */
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
export class RefutationIconDrawer {
  private _visible: boolean = false;
  private _similarityBlock: SimilarityBlock | null = null;

  private readonly refutationIconGSlection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    this.refutationIconGSlection = svgSelection
      .append("g")
      .style("visibility", "hidden");

    this.refutationIconGSlection
      .append("path")
      .attr(
        "d",
        "M362.1,912.5c-14.3,14.3-31.1,18-49.5,17.9c-55.4-0.3-110.8-0.1-166.2-0.1c-41.1,0-62.2-36.4-42-72.3\
	c0.5-0.9,0.8-1.9,1.2-2.8c-26.2-24.8-29.3-40.3-15.6-66.9c-7.9-12.2-16.5-22.4-21.6-34.1C62.5,741,68,728,75.6,715.7\
	c-1.9-1.4-3.6-2.7-5.3-3.9c-18-12.7-25.1-32.1-19-52.2c5.8-19,22.9-32,44.1-32.4c25.3-0.5,50.7-0.1,76-0.2c2.1,0,4.3-0.3,7.9-0.5\
	c0-4,0-7.8,0-11.7c0-48.5-0.2-97.1,0.2-145.6c0.1-7.9-2.3-10.9-10-13.1C67.5,426.9-2.2,333.6,0.1,230.1\
	C2.5,121.3,74.3,31.8,179.7,6.3C311.2-25.4,444,65.6,462.3,199.9c15.9,116.5-54.1,223.9-167.1,256.5c-5.4,1.6-9.9,2.2-9.8,10\
	c0.4,51.8,0.2,103.6,0.2,155.3c0,1.4,0.4,2.8,0.9,6.5c28.7-7.5,51.1,4.5,68,22.7c10.9-8.6,19.3-18.3,29.9-22.7\
	c26.4-10.9,55.9,8.9,56.1,37.6c0.6,74.6,0.3,149.2,0.1,223.8c-0.1,18.5-9.4,32-26.5,38.7c-17.4,6.8-33.4,3.1-46.8-10.3\
	C365.8,916.4,364.3,914.9,362.1,912.5z M232.9,443.4c118-1.1,211-95.6,209.9-213.4c-1-115.7-96.3-209.1-212-207.8\
	C114,23.5,20.7,118.1,21.7,234.2C22.7,350.1,118,444.5,232.9,443.4z M204.4,648.8c-35.1,0-70.2-0.1-105.3,0\
	c-17.1,0.1-28.4,10.3-28.2,24.9c0.2,14.1,11.4,23.8,28,23.9c13.8,0.1,27.5,0.1,41.3,0.1c7.3,0,13.3,2.1,13.3,10.6\
	c0,8.4-5.9,10.9-13.2,11.1c-8.7,0.2-17.4-0.1-26.1,0.2c-15.7,0.7-26.5,11-26.1,24.6c0.4,13.4,11.8,23.4,27.4,23.6\
	c11.6,0.2,23.2,0.2,34.7,0c7.5-0.1,13.4,2.3,13.6,10.4c0.2,8.8-6.1,11.4-13.9,11.3c-6.9-0.1-13.8-0.1-20.6,0.1\
	c-14.6,0.4-25.4,10.8-25.2,24.2c0.2,13.8,10.5,23.6,25.5,23.9c11.9,0.2,23.9,0.1,35.8,0.1c7.4,0,13.3,2.9,13.4,10.9\
	c0.1,8.1-5.6,10.9-13.2,10.8c-8.7-0.1-17.4-0.3-26,0.6c-13.2,1.3-21.6,11.4-21.5,24.3c0.2,12.4,8.5,21.8,21.2,23.4\
	c4.3,0.6,8.7,0.6,13,0.6c52.9,0,105.7-0.6,158.6,0.3c26.1,0.5,46-10.4,45-45.5c-1.3-49.6-2.1-99.3,0.4-148.7\
	c1.3-26.9-5.5-45.2-29.2-58.3c-7.9-4.3-14.7-7.7-23.9-7.6C270.3,649.1,237.3,648.8,204.4,648.8z M419,779L419,779\
	c0-36.2,0-72.3-0.1-108.5c0-13.1-5.9-20.9-16.8-23.1c-13.9-2.8-24.7,7.5-24.8,24c-0.1,70.9-0.1,141.8-0.1,212.6\
	c0,16,7.4,25.2,20.3,25.5c13.5,0.3,21.3-8.8,21.4-25.3C419.1,849.1,419,814.1,419,779z M201.8,464.4c0,54.3,0,108.1,0,162.1\
	c20.8,0,40.8,0,61.5,0c0-54.4,0-108.1,0-162.1C242.6,464.4,222.5,464.4,201.8,464.4z"
      );

    this.refutationIconGSlection
      .append("line")
      .attr("x1", 143.6)
      .attr("y1", 145.7)
      .attr("x2", 320.9)
      .attr("y2", 323)
      .style("fill", "none")
      .style("stroke", "#0a0404")
      .style("stroke-width", 16)
      .style("stroke-miterlimit", 10);

    this.refutationIconGSlection
      .append("line")
      .attr("x1", 321.4)
      .attr("y1", 145.7)
      .attr("x2", 144.1)
      .attr("y2", 323)
      .style("fill", "none")
      .style("stroke", "#0a0404")
      .style("stroke-width", 16)
      .style("stroke-miterlimit", 10);
  }

  public update() {
    if (this._similarityBlock !== null) {
      const rowUtteranceObject = this.utteranceObjectsForDrawing[
        this._similarityBlock.rowUtteranceIndex
      ];
      const translateProperty = `translate(${
        rowUtteranceObject.beginningPointOfXY +
        rowUtteranceObject.width / 2 -
        2.5
      }, ${rowUtteranceObject.beginningPointOfXY - 10} ) scale(0.01, 0.01)`;

      this.refutationIconGSlection
        .attr("transform", translateProperty)
        .style("visibility", "visible");
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
