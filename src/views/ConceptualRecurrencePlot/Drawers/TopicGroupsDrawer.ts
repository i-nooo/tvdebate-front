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
  private _topicGroupTitles: string[] | null = null;
  private _showTopicGroupTitle: boolean = true;
  private _showTopicGroup: boolean = true;
  private _guideColor: string = "#D63A3A";

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
      .join("rect");

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
        .attr("x", (eg) => {
          const mostLeftTopBlock = eg[0][0];
          const lastHorizontalLine = eg[eg.length - 1];
          const mostRightBottomBlock =
            lastHorizontalLine[lastHorizontalLine.length - 1];

          const xPoint =
            (mostRightBottomBlock.beginningPointOfX +
              mostRightBottomBlock.width +
              mostLeftTopBlock.beginningPointOfX) /
            2;
          return xPoint;
        })
        .attr("y", (eg) => {
          const mostLeftTopBlock = eg[0][0];
          const yPoint = mostLeftTopBlock.beginningPointOfY - 5;
          return yPoint;
        })
        .text((eg, i) => {
          if (arg.showTopicGroupTitle) {
            if (arg.topicGroupTitles) {
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
        .style("font-size", 8)
        .style("fill", () => (arg.showTopicGroup ? arg.guideColor : "none"))
        .style("cursor", "pointer")
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
          return `terms: ${extractedTerms}`;
        });
    }
  }
}
