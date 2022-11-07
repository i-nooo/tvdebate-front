/* eslint-disable no-unused-vars */
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
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
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    this.insistenceIconGSlection = svgSelection
      .append("g")
      .style("visibility", "hidden");

    this.insistenceIconGSlection
      .append("path")
      .attr(
        "d",
        "M285.6,627.1c28.7,0,56.2-0.4,83.7,0.1c19.8,0.4,34.8,9.5,42.8,28.1c7.6,17.7,4.5,34.1-8,48.5c-3.9,4.5-9.2,8-13.8,11.9\
	c14.5,32.4,11.1,46.8-16.5,69.5c15,31.2,11.8,47.4-13.7,69.4c2.7,7.5,6.7,14.6,8,22.3c4.7,28.9-15.8,53.4-45.7,53.6\
	c-59.1,0.5-118.2,0.1-177.3,0c-16.3,0-30.3-6.1-42.5-17.5C93,924.2,81.9,931.6,67,931.6c-23.7,0-42.3-17.1-42.7-41.4\
	c-0.6-43.5-0.3-87-0.3-130.5c0-29,0-58,0.1-87c0.1-23.9,11.2-40.5,30.6-45.8c20.6-5.6,37.9,2.4,50.7,23.5c0.3,0.6,1,0.9,2.8,2.5\
	c19-19.2,40.9-32.7,70.4-24.4c0.4-5,0.8-7.8,0.8-10.6c0-49.7-0.1-99.3,0.2-149c0-7.3-1.8-10.4-9.3-12.6\
	C60.2,424.3-7.9,325.2,0.7,210.6C8.6,106.1,95.4,15,199.6,2c130.2-16.3,242.3,67.5,263.2,196.8c18.1,111.6-53.8,224.4-163.8,256\
	c-10.6,3-13.8,7.1-13.6,18.3C286,523.8,285.6,574.5,285.6,627.1z M233.3,443.1c115.8-0.3,210.2-94.9,210.2-210.6\
	c0-117.2-94.4-211.2-211.6-211.1C115.9,21.6,21.6,116.1,22,231.8C22.3,349.5,116.3,443.5,233.3,443.1z M262,648.8\
	c-34.8,0-69.6-0.1-104.4,0.2c-4.7,0-10.2,1.2-14.1,3.8c-9.9,6.6-19.5,13.9-28.5,21.7c-3,2.6-5.6,7.6-5.6,11.6\
	c-0.4,60.9-0.4,121.8-0.2,182.6c0.1,27.2,13,39.9,40,40.1c30.4,0.2,60.9,0.1,91.3,0c27.5,0,55.1,0.3,82.6-0.4\
	c14.8-0.4,23.9-10.6,23.7-24.3c-0.2-13.2-9.1-22.6-23.3-23.7c-7.2-0.6-14.5-0.5-21.7-0.4c-7.9,0.2-15.7-0.9-15.7-10.5\
	c0-10.2,8-11.4,16.3-11.3c12,0.1,23.9,0.4,35.9-0.2c13.2-0.6,22.9-11.5,22.6-24.5c-0.3-12.4-10.1-22.7-22.7-23.4\
	c-7.9-0.5-15.9-0.2-23.9-0.2c-7.5,0-13.2-2.9-13.2-11c0.1-8.1,5.7-10.9,13.3-10.8c12.3,0.1,24.6,0.3,37-0.1\
	c14.5-0.5,25.6-11.3,25.6-24.4c0-12.8-10.4-23-24.7-23.8c-8.7-0.5-17.4-0.2-26.1-0.3c-7.4-0.1-14.3-1.6-14.5-10.8\
	c-0.2-9.3,6.4-11,14.1-11c14.5,0,29,0.4,43.5-0.2c16.5-0.6,27.8-14.3,24.6-28.9c-2.7-12.4-12.6-19.8-27.4-19.8\
	C331.5,648.7,296.8,648.8,262,648.8z M45.7,779c0,35.5-0.1,71,0,106.4c0,15.7,8,24.6,21.3,24.4c12.6-0.2,20.4-9.3,20.4-24.3\
	c0.1-71,0-141.9,0-212.9c0-16.1-8.4-26-21.5-25.7c-12.7,0.3-20.1,9.7-20.2,25.6C45.7,708.1,45.7,743.5,45.7,779z M201.7,626.4\
	c21.1,0,41.2,0,61.6,0c0-54.5,0-108.3,0-162.2c-20.7,0-40.8,0-61.6,0C201.7,517.9,201.7,571.7,201.7,626.4z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M232.9,335.2c-8.3,0-16.7,0.1-25,0c-8.7-0.1-12.3-3.3-12.4-11.8c-0.4-18.7-7.8-34.2-21-47.3\
	c-45.5-45.3-29.3-118.7,31-140.7c54-19.7,112.4,22.5,111.7,80.6c-0.3,23.6-8.9,43.7-25.8,60.1c-13.1,12.7-20,27.9-21.1,45.9\
	c-0.7,11.1-3,13.1-14.3,13.1C248.2,335.2,240.6,335.2,232.9,335.2L232.9,335.2z M232.5,324.4c7.3,0,14.5-0.1,21.8,0\
	c3.3,0,5-0.9,5.3-4.6c1.5-21.2,11-38.3,26-53.3c20-20.2,25.6-45,17.9-72.1c-8.6-30.1-35.3-50.6-66.4-52.5\
	c-30.4-1.8-59.1,15.6-71.5,43.4c-12.6,28.2-6.5,60.7,15.9,82.6c14.5,14.2,23.3,30.9,24.4,51.3c0.2,3.7,1.6,5.4,5.5,5.3\
	C218.4,324.3,225.4,324.4,232.5,324.4z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st1")
      .style("stroke", "#000000")
      .style("stroke-width", 1)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M233.2,341.8c8.9,0,17.9,0,26.8,0c3.7,0,7.1,0.6,7.4,5.1c0.3,5-3.5,5.9-7.3,5.9c-18.5,0.1-37,0.3-55.5-0.2\
	c-2.3-0.1-6-3.2-6.3-5.3c-0.7-4.2,3.1-5.5,6.8-5.5C214.5,341.8,223.8,341.8,233.2,341.8z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st1")
      .style("stroke", "#000000")
      .style("stroke-width", 1)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M233.1,368.6c-7.9,0-15.7,0-23.6,0c-3.9,0-7.7-0.8-7.8-5.5c-0.1-4.9,3.9-5.6,7.6-5.6\
	c15.7-0.1,31.5,0.1,47.2,0.1c4.1,0,7.6,1,7.4,5.8c-0.1,4.3-3.5,5.4-7.3,5.4C248.8,368.6,241,368.6,233.1,368.6z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M238.4,102.5c0,5.1,0.6,10.3-0.2,15.3c-0.4,2.4-3,5.9-5.2,6.4c-3.9,0.9-5.3-2.6-5.4-6.1\
	c-0.1-10.8-0.3-21.7,0.2-32.5c0.1-2.1,3.2-4.1,5-6.1c1.9,2.2,5,4.2,5.3,6.6C238.9,91.4,238.3,97,238.4,102.5\
	C238.3,102.5,238.3,102.5,238.4,102.5z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M129.5,314.2c-4.6-0.1-7.4-5.1-4.4-8.3c8.2-8.9,16.9-17.3,25.8-25.6c1.1-1,4.9-0.7,6.2,0.5\
	c1.2,1.1,1.8,5.1,0.9,6.1c-8.6,9.1-17.6,17.8-26.5,26.6C131,314,130,314.1,129.5,314.2z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M339.8,308.8c-0.3,4.9-5,7.2-8.4,4c-8.7-8.1-17-16.6-25.2-25.3c-1.1-1.2-1.1-5.1,0-6c1.5-1.3,5.5-2.2,6.5-1.2\
	c9,8.4,17.6,17.2,26.2,26C339.6,306.9,339.6,308.2,339.8,308.8z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M320,111.2c-1.3,2.2-2.1,4.2-3.5,5.7c-7.1,7.3-14.4,14.4-21.6,21.6c-2.6,2.6-5.5,4.4-8.8,1.3\
	c-3.4-3.3-1.3-6.2,1.2-8.8c7.3-7.4,14.6-14.9,22.2-21.9c1.6-1.5,4.5-2,6.7-1.9C317.5,107.2,318.6,109.6,320,111.2z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M177,136.5c-1.1,1.4-2,3.5-3.4,4c-1.7,0.6-4.6,0.6-5.7-0.5c-8.5-8-16.8-16.2-24.7-24.8\
	c-1.2-1.3-0.7-5.4,0.5-7.2c0.7-1.1,5.3-1.2,6.5-0.1c8.5,8,16.7,16.3,24.9,24.7C175.8,133.4,176.1,134.8,177,136.5z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M351.1,203.7c5.1,0,10.3-0.5,15.3,0.2c2.3,0.3,5.5,2.8,6,4.8c0.9,3.9-2.3,5.5-6,5.5c-10.7,0-21.4,0.3-32-0.2\
	c-2.3-0.1-4.5-3.4-6.7-5.2c2.3-1.7,4.4-4.6,6.8-4.9C339.9,203.2,345.6,203.7,351.1,203.7z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M114.8,202.1c5.1,0,10.3,0.1,15.4,0c3.9-0.1,7.4,1.4,6.9,5.4c-0.3,2-4.2,4.8-6.6,4.9\
	c-10.4,0.5-20.9,0.2-31.4,0.3c-3.6,0-6.7-1.1-6.7-5.1c-0.1-4.4,3.2-5.5,7-5.5C104.6,202.1,109.7,202,114.8,202.1\
	C114.8,202,114.8,202,114.8,202.1z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M209.3,374.9c16.3,0,31,0,46.3,0c-2.9,7.2-8.1,9.6-14,9C230.9,382.9,218.3,388.6,209.3,374.9z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st2")
      .style("fill", "#FFFFFF")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M232.5,324.4c-7,0-14.1-0.1-21.1,0.1c-3.8,0.1-5.2-1.5-5.5-5.3c-1.2-20.4-10-37.1-24.4-51.3\
	c-22.4-21.9-28.5-54.4-15.9-82.6c12.4-27.8,41.1-45.3,71.5-43.4c31.1,1.9,57.8,22.4,66.4,52.5c7.7,27.1,2.1,51.9-17.9,72.1\
	c-14.9,15.1-24.4,32.1-26,53.3c-0.3,3.7-2,4.7-5.3,4.6C247,324.4,239.7,324.4,232.5,324.4z M176.8,207.7c1.3,1.3,3,4.3,4.8,4.4\
	c1.9,0.1,4.1-2.4,5.9-4.1c0.7-0.6,0.6-2,0.8-3c5.6-22.4,19.6-35.2,42.8-37.8c2.3-0.3,5.8-3.4,6.1-5.5c0.5-4.3-3.4-5.7-7.1-4.8\
	c-8,1.9-16.5,3.2-23.7,6.9C189.1,172.3,180.7,187.8,176.8,207.7z"
      );

    this.insistenceIconGSlection
      .append("path")
      .attr("class", "st0")
      .style("stroke", "#000000")
      .style("stroke-width", 2)
      .style("stroke-miterlimit", 10)
      .attr(
        "d",
        "M176.8,207.7c3.9-19.9,12.3-35.4,29.6-44c7.3-3.6,15.7-4.9,23.7-6.9c3.7-0.9,7.6,0.5,7.1,4.8\
	c-0.2,2.1-3.8,5.3-6.1,5.5c-23.2,2.6-37.2,15.4-42.8,37.8c-0.3,1-0.2,2.4-0.8,3c-1.8,1.7-4,4.2-5.9,4.1\
	C179.8,211.9,178.1,209,176.8,207.7z"
      );
  }

  public update() {
    if (this._similarityBlock) {
      const colUtteranceObject = this.utteranceObjectsForDrawing[
        this._similarityBlock.columnUtteranceIndex
      ];
      const transformProperty = `translate(${
        colUtteranceObject.beginningPointOfXY +
        colUtteranceObject.width / 2 -
        2.5
      }, ${colUtteranceObject.beginningPointOfXY - 10} ) scale(0.01, 0.01)`;

      this.insistenceIconGSlection
        .attr("transform", transformProperty)
        .style("visibility", "visible");
    } else {
      this.insistenceIconGSlection.style("visibility", "hidden");
    }
  }

  public set similarityBlock(similarityBlock: SimilarityBlock | null) {
    this._similarityBlock = similarityBlock;
  }

  // public set visible(visible: boolean) {
  //   this._visible = visible;
  // }
}
