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
    const excludedIndex = [1, 3, 5];
    const excludedIndexTwo = [1, 3, 5];
    // 주제별로 보고 싶다면 this._guideColor로 필터링 적용해도 될듯함.
    // filter 후 데이터 제공.
    const filteredData = this._topicGroups.filter(
      (group, index) => !excludedIndex.includes(index)
    );
    const secFilteredData = this._topicGroups.filter(
      (group, index) => !excludedIndexTwo.includes(index)
    );
    //console.log(filteredData);
    //console.log(this._guideColor);
    const topicGuideRectGSelection = this.topicGuideRectGSelection
      .selectAll<SVGRectElement, unknown>("rect")
      //.data(this._topicGroups)
      // 색상 조금만 변경해서 이런식으로 조건주면 될듯함.
      .data(this._guideColor === "#ff0000" ? filteredData : secFilteredData)
      .join("rect")
      //.style("visibility", (eg) => ( ? "visible" : "none"))
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
        .style("visibility", (eg) => (showEngagementGroup ? "visible" : "none"))
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
        .style("fill", this._guideColor === "#ff0000" ? "none" : "none")
        // .style("opacity", 0.05)
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
          // 지금 나머지 xPoint들은 적용이 안되고 있는 상태.(수정완료)
          if (this._topicGroupTitles) {
            let xPoint = 0;
            const xPoints = [];
            for (let i = 0; i < this._topicGroupTitles.length; i++) {
              if (this._topicGroupTitles[i]) {
                if (this._guideColor === "#ff0000") {
                  switch (i) {
                    case 0:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        25;
                      break;
                    case 1:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        20000;
                      break;
                    case 2:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        15; // 그냥 멀리 버려버리기.
                      break;
                    case 3:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        20000;
                      break;
                    case 4:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        3;
                      break;
                    case 5:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        20000;
                      break;
                    case 6:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        25;
                      break;
                    case 7:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        0;
                      break;
                    case 8:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        55;
                      break;
                    default:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        0;
                    // break;
                  }
                  xPoints[i] = xPoint;
                } else {
                  // #ff0001 pos
                  switch (i) {
                    // middleTopicGroup
                    case 0:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        15;
                      break;
                    case 1:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 +
                        20000;
                      break;
                    case 2:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        3;
                      break;
                    case 3:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        20000;
                      break;
                    case 4:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        15;
                      break;
                    case 5:
                      xPoint =
                        mostLeftTopBlock.beginningPointOfY +
                        mostRightBottomBlock.beginningPointOfY / 2 -
                        20000;
                      break;
                  }
                  xPoints[i] = xPoint;
                }
              }
            }
            //console.log(xPoints[i]);
            return xPoints[i];
          } else return null;
        })
        .attr("y", (eg, i) => {
          const mostLeftTopBlock = eg[0][0];
          //TODO 객체의 topicGroup별로 yPoint 다르게 설정해야함.
          // console.log(arg.topicGroupTitles ? arg.topicGroupTitles : null);
          // const yPoint = mostLeftTopBlock.beginningPointOfY - 5;
          // const yPoint = 30;
          if (this._guideColor !== "#ff0000") {
            const yPoint = -150; // Middle Engagement Group
            return yPoint;
          } else {
            const yPoint = -130; // Small Engagement Group
            return yPoint;
          }
          // return yPoint;
        }) // draw topic text
        .text((eg, i) => {
          if (arg.showTopicGroupTitle) {
            if (arg.topicGroupTitles) {
              // console.log(arg.topicGroupTitles[0][0]);
              //console.log(arg.topicGroupTitles);
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
