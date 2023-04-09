/* eslint-disable no-unused-vars */
import { TermType } from "../DataImporter";
import { DataStructureSet } from "../DataStructureMaker/DataStructureManager";
import { DebateDataSet } from "../../../interfaces/DebateDataInterface";
import { SimilarityBlock } from "../interfaces";
import * as d3 from "d3";
import _ from "lodash";
import {
  extractFrequencyTermsFromEG,
  extractKeytermsFromEngagementGroup,
  extractTermsFromEngagementGroup,
} from "../DataStructureMaker/extractTermsFromEngagementGroup";
import { KeytermObject } from "../../../interfaces/DebateDataInterface";

export class TopicGroupsDrawer {
  private readonly topicGuideRectGSelection: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private readonly topicGuideTextGSelection: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private _topicGroups: SimilarityBlock[][][] = [];
  private _topicGroupTitles: string[] = [];
  private _showTopicGroupTitle: boolean = true;
  private _showTopicGroup: boolean = true;
  private _guideColor: string = "green";

  public onTitleClicked:
    | null
    | ((
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => void) = null;

  public constructor(
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>,
    private readonly debateDataSet: DebateDataSet,
    private readonly dataStructureSet: DataStructureSet,
    private readonly termType: TermType
  ) {
    this.topicGuideRectGSelection = svgSelection.append("g");
    this.topicGuideTextGSelection = svgSelection.append("g");
  }

  public set topicGroups(topicGroups: SimilarityBlock[][][]) {
    this._topicGroups = topicGroups;
  }
  public get topicGroups() {
    return this._topicGroups;
  }
  public set topicGroupTitles(topicGroupTitles: string[]) {
    this._topicGroupTitles = topicGroupTitles;
  }
  public set visible(showTopicGroup: boolean) {
    this._showTopicGroup = showTopicGroup;
  }
  public set showTopicGroupTitle(showTopicGroupTitle: boolean) {
    this._showTopicGroupTitle = showTopicGroupTitle;
  }
  public set color(guideColor: string) {
    this._guideColor = guideColor;
  }

  public update() {
    const topicGuideRectGSelection = this.topicGuideRectGSelection
      .selectAll<SVGRectElement, unknown>("rect")
      .data(this._topicGroups)
      .join("rect")
      .style("opacity", 0.45);

    topicGuideRectGSelection.call(
      setAttributesOfTopicGuides.bind(
        this,
        topicGuideRectGSelection,
        this._showTopicGroup,
        this._guideColor
      )
    );

    const topicGuideTextGSelection = this.topicGuideTextGSelection
      .selectAll<SVGTextElement, unknown>("text")
      .data(this._topicGroups)
      .join("text");

    topicGuideTextGSelection.call(
      setAttributesOfTopicText.bind(this, topicGuideTextGSelection, {
        topicGroupTitles: this._topicGroupTitles,
        showTopicGroup: this._showTopicGroup,
        showTopicGroupTitle: this._showTopicGroupTitle,
        guideColor: this._guideColor,
        conceptMatrixTransposed: this.debateDataSet.conceptMatrixTransposed,
        keytermObjects: this.debateDataSet.keytermObjects,
        termList: this.debateDataSet.termList,
        termUtteranceBooleanMatrixTransposed: this.debateDataSet
          .termUtteranceBooleanMatrixTransposed,
      })
    );

    function setAttributesOfTopicGuides(
      this: TopicGroupsDrawer,
      selection: d3.Selection<
        SVGRectElement,
        SimilarityBlock[][],
        SVGGElement,
        unknown
      >,
      showEngagementGroup: boolean,
      guideColor: string
    ) {
      selection
        .attr("x", (eg) => eg[0][0].beginningPointOfX)
        .attr("y", (eg) => eg[0][0].beginningPointOfY)
        .style("visibility", "visible")
        .attr("width", (eg) => {
          const mostLeftTopBlock = eg[0][0];
          const lastHorizontalLine = eg[eg.length - 1];
          const mostRightBottomBlock =
            lastHorizontalLine[lastHorizontalLine.length - 1];
          const width =
            mostRightBottomBlock.beginningPointOfX +
            mostRightBottomBlock.width -
            mostLeftTopBlock.beginningPointOfX;
          return width;
        })
        .attr("height", (eg) => {
          const mostLeftTopBlock = eg[0][0];
          const lastHorizontalLine = eg[eg.length - 1];
          const mostRightBottomBlock =
            lastHorizontalLine[lastHorizontalLine.length - 1];
          const height =
            mostRightBottomBlock.beginningPointOfY +
            mostRightBottomBlock.height -
            mostLeftTopBlock.beginningPointOfY;
          return height;
        })
        .style("fill", "none")
        .style("stroke-width", 1)
        .style("stroke", () => (showEngagementGroup ? guideColor : "none"));
      // .style("stroke", () => (showEngagementGroup ? "none" : "none"));
    }

    function setAttributesOfTopicText(
      this: TopicGroupsDrawer,
      selection: d3.Selection<
        SVGTextElement,
        SimilarityBlock[][],
        SVGGElement,
        unknown
      >,
      arg: {
        topicGroupTitles: string[] | null;
        showTopicGroup: boolean;
        showTopicGroupTitle: boolean;
        guideColor: string;
        conceptMatrixTransposed: number[][];
        keytermObjects: KeytermObject[];
        termList: string[];
        termUtteranceBooleanMatrixTransposed: number[][];
      }
    ) {
      selection
        .attr("x", (eg, i) => {
          //@ts-ignore
          const mostLeftTopBlock = eg[0][0];
          const lastHorizontalLine = eg[eg.length - 1];
          //@ts-ignore
          const mostRightBottomBlock =
            lastHorizontalLine[lastHorizontalLine.length - 1];

          // 지금 나머지 xPoint들은 적용이 안되고 있는 상태.
          if (this._topicGroupTitles) {
            if (this._topicGroupTitles[0]) {
              //@ts-ignore
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                10;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[1]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 +
                35;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[2]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                0;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[3]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2 -
                10;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[4]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[5]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[6]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[7]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[8]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else if (this._topicGroupTitles[9]) {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            } else {
              const xPoint =
                mostLeftTopBlock.beginningPointOfY +
                mostRightBottomBlock.beginningPointOfY / 2;
              // mostRightBottomBlock.beginningPointOfY / 2;
              return xPoint;
            }
          } else return null;
        })
        .attr("y", (eg, i) => {
          const mostLeftTopBlock = eg[0][0];
          //TODO 객체의 topicGroup별로 yPoint 다르게 설정해야함.
          // console.log(arg.topicGroupTitles ? arg.topicGroupTitles : null);
          // const yPoint = mostLeftTopBlock.beginningPointOfY - 5;
          // const yPoint = 30;
          if (this._guideColor !== "#ff0000") {
            const yPoint = -160;
            return yPoint;
          } else {
            const yPoint = -100;
            return yPoint;
          }
          // return yPoint;
        }) // draw topic text
        .text((eg, i) => {
          if (arg.showTopicGroupTitle) {
            if (arg.topicGroupTitles) {
              // console.log(arg.topicGroupTitles[0][0]);
              // console.log(eg[0]);
              return arg.topicGroupTitles[i];
            } else {
              // const extractedKeytermObjects = extractKeytermsFromEngagementGroup(
              //   eg,
              //   arg.conceptMatrixTransposed,
              //   arg.keytermObjects,
              //   7
              // );
              // return `${_.map(extractedKeytermObjects, (o) => o.name)}`;

              const highFrequencyTerms = extractFrequencyTermsFromEG(
                eg,
                this.debateDataSet.utteranceObjects,
                this.dataStructureSet.participantDict,
                this.termType
              );
              return `${highFrequencyTerms}`;
            }
          } else {
            return "";
          }
        })
        .attr("text-anchor", "middle")
        .style("font-size", this._guideColor === "#ff0000" ? "6.8" : "7.5")
        .style("font-weight", "bold")
        // .style("fill", () => (arg.showTopicGroup ? "none" : "none"))
        .style("fill", () => (arg.showTopicGroup ? arg.guideColor : "none"))
        .style("cursor", "pointer")
        .attr("transform", "rotate(-135) scale(-1, 1)")
        .on("click", (e, d) => {
          const mouseEvent = (e as unknown) as MouseEvent;
          const engagementGroup = (d as unknown) as SimilarityBlock[][];
          mouseEvent.stopPropagation();
          const engagementGroupIndex = _.indexOf(
            this._topicGroups,
            engagementGroup
          );

          // Draw conceptual_map of the engagement_group
          if (this.onTitleClicked !== null) {
            this.onTitleClicked(
              mouseEvent,
              engagementGroup,
              engagementGroupIndex
            );
          }
        })
        .append("title")
        .text((eg) => {
          const extractedTerms = extractTermsFromEngagementGroup(
            eg,
            arg.termUtteranceBooleanMatrixTransposed,
            arg.termList
          );
          return `terms: ${extractedTerms}`; // terms: ~.
        });
    }
  }
}
