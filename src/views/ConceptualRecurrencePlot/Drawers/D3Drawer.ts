/* eslint-disable no-unused-vars */
import { UncertainIconDrawer } from "./UncertainIconDrawer";
import { TermType } from "./../DataImporter";
import { DataStructureSet } from "../DataStructureMaker/DataStructureManager";
import { DebateDataSet } from "./../../../interfaces/DebateDataInterface";
import { SimilarityBlocksDrawer } from "./SimilarityBlocksDrawer"; // 유사도 노드
import { ParticipantBlocksDrawer } from "./ParticipantBlocksDrawer"; // 참가자 노드
import { UtteranceObjectForDrawing, SimilarityBlock } from "../interfaces";
import * as d3 from "d3";
import _ from "lodash";
import { TopicGroupsDrawer } from "./TopicGroupsDrawer";
import { D3ZoomEvent, zoomTransform } from "d3";
import { ParticipantDict } from "../../../common_functions/makeParticipants";
import { KeytermObject } from "../../../interfaces/DebateDataInterface";
import { InsistenceMarkersDrawer } from "./InsistenceMarkersDrawer";
import { RefutationIconDrawer } from "./RefutationIconDrawer";
import { InsistenceIconDrawer } from "./InsistenceIconDrawer";
import { InsistenceIconDrawerTwo } from "./InsistenceIconDrawerTwo";
import { RefutationIconDrawerTwo } from "./RefutationIconDrawerTwo";

export class D3Drawer {
  private readonly conceptRecurrencePlotDiv!: d3.Selection<
    HTMLDivElement,
    any,
    HTMLElement,
    any
  >;
  private readonly svgSelection!: d3.Selection<
    SVGSVGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private readonly svgGSelection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;

  public readonly participantBlocksDrawer: ParticipantBlocksDrawer;
  public readonly insistenceMarkersDrawer: InsistenceMarkersDrawer;
  public readonly refutationIconDrawer: RefutationIconDrawer;
  public readonly refutationIconDrawerTwo: RefutationIconDrawerTwo;
  public readonly insistenceIconDrawer: InsistenceIconDrawer;
  public readonly uncertainIconDrawer: InsistenceIconDrawer;
  public readonly insistenceIconDrawerTwo: InsistenceIconDrawerTwo;
  //public readonly uncertainIconDrawer: uncertainIconDrawer;
  public readonly similarityBlocksDrawer: SimilarityBlocksDrawer;
  public readonly topicGroupsDrawer: TopicGroupsDrawer;
  public readonly manualSmallTGsDrawer: TopicGroupsDrawer;
  public readonly manualMiddleTGsDrawer: TopicGroupsDrawer;
  public readonly manualBigTGsDrawer: TopicGroupsDrawer;
  public readonly manualPeopleTGsDrawer: TopicGroupsDrawer;
  public readonly lcsegEGsDrawer: TopicGroupsDrawer;
  private readonly svgWidth: number;
  private readonly svgHeight: number;
  // private readonly svgRotate: number;
  // private _svgBackgroundClickListener?: (event: MouseEvent) => void;
  private _zoomListener: ((transform: d3.ZoomTransform) => void) | null = null;

  public constructor(
    private readonly debateDataSet: DebateDataSet,
    private readonly dataStructureSet: DataStructureSet,
    private readonly termType: TermType
  ) {
    // declare variables
    this.conceptRecurrencePlotDiv = d3.select(".concept-recurrence-plot");

    this.svgWidth = 1130;
    this.svgHeight = 800;
    this.svgSelection = this.conceptRecurrencePlotDiv
      .select<SVGSVGElement>("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      // 전체 svg 영역
      .attr("transform", "scale(1, -1) rotate(-45)")
      .call(
        d3
          .zoom<SVGSVGElement, D3ZoomEvent<SVGSVGElement, any>>()
          .scaleExtent([0.8, 2.5]) // 예를 들어 최소 0.5배 축소부터 최대 2배 확대까지만 허용하도록 설정
          .on("zoom", (event) => {
            //@ts-ignore
            this.svgGSelection.attr("transform", () => event.transform);
            if (this._zoomListener) {
              this._zoomListener(event.transform);
            }
          })
      );

    this.svgGSelection = this.svgSelection.select(".svgG");

    this.participantBlocksDrawer = new ParticipantBlocksDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      dataStructureSet.participantDict,
      dataStructureSet.similarityBlockManager.similarityBlocks,
      debateDataSet.conceptMatrixTransposed,
      debateDataSet.keytermObjects,
      this.svgGSelection
    ); // 주장 marker drawer
    this.insistenceMarkersDrawer = new InsistenceMarkersDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      dataStructureSet.similarityBlockManager.similarityBlockGroup,
      this.svgGSelection
    ); // 불확실 아이콘 drawer
    this.refutationIconDrawer = new RefutationIconDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    ); // 반박 아이콘 drawer
    this.refutationIconDrawerTwo = new RefutationIconDrawerTwo(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    );
    this.insistenceIconDrawer = new InsistenceIconDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    );
    this.insistenceIconDrawerTwo = new InsistenceIconDrawerTwo(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    ); // 불확실 아이콘 drawer
    this.uncertainIconDrawer = new InsistenceIconDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    );

    this.similarityBlocksDrawer = new SimilarityBlocksDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      dataStructureSet.similarityBlockManager.similarityBlocks,
      dataStructureSet.similarityBlockManager.similarityBlockGroup,
      dataStructureSet.participantDict,
      this.svgGSelection
    ); // 유사도 구간 색지정

    this.similarityBlocksDrawer.clickListener = (
      e: MouseEvent,
      d: SimilarityBlock
    ) => {
      this.insistenceMarkersDrawer.visible = false;
      this.refutationIconDrawer.similarityBlock = null;
      this.refutationIconDrawerTwo.similarityBlock = null;
      this.insistenceIconDrawer.similarityBlock = null;
      this.insistenceIconDrawerTwo.similarityBlock = null; // 7
      this.uncertainIconDrawer.similarityBlock = null;

      if (d.colUtteranceName === "이준석" || d.colUtteranceName === "박휘락") {
        this.insistenceIconDrawerTwo.similarityBlock = d;
        this.refutationIconDrawer.similarityBlock = d;
      } else if (
        d.colUtteranceName === "김종대" ||
        d.colUtteranceName === "장경태"
      ) {
        this.insistenceIconDrawer.similarityBlock = d;
        this.refutationIconDrawerTwo.similarityBlock = d;
      } else if (
        d.rowUtteranceName === "이준석" ||
        d.rowUtteranceName === "박휘락"
      ) {
        this.refutationIconDrawerTwo.similarityBlock = d;
        this.insistenceIconDrawer.similarityBlock = d;
      } else if (
        d.rowUtteranceName === "김종대" ||
        d.rowUtteranceName === "장경태"
      ) {
        this.refutationIconDrawer.similarityBlock = d;
        this.insistenceIconDrawerTwo.similarityBlock = d;
      } else null;
      this.refutationIconDrawer.update();
      this.refutationIconDrawerTwo.update();
      this.insistenceIconDrawer.update();
      this.insistenceIconDrawerTwo.update();
      this.uncertainIconDrawer.update();
    };

    this.similarityBlocksDrawer.mouseoverListener = (
      e: MouseEvent,
      d: SimilarityBlock
    ) => {
      if (d.colUtteranceName === "이준석" || d.colUtteranceName === "박휘락") {
        this.insistenceIconDrawerTwo.similarityBlock = d;
        this.refutationIconDrawer.similarityBlock = d;
      } else if (
        d.colUtteranceName === "김종대" ||
        d.colUtteranceName === "장경태"
      ) {
        this.insistenceIconDrawer.similarityBlock = d;
        this.refutationIconDrawerTwo.similarityBlock = d;
      } else if (
        d.rowUtteranceName === "이준석" ||
        d.rowUtteranceName === "박휘락"
      ) {
        this.refutationIconDrawerTwo.similarityBlock = d;
        this.insistenceIconDrawer.similarityBlock = d;
      } else if (
        d.rowUtteranceName === "김종대" ||
        d.rowUtteranceName === "장경태"
      ) {
        this.refutationIconDrawer.similarityBlock = d;
        this.insistenceIconDrawerTwo.similarityBlock = d;
      } else null;
      this.refutationIconDrawer.update();
      this.refutationIconDrawerTwo.update();
      this.insistenceIconDrawer.update();
      this.insistenceIconDrawerTwo.update();
      this.uncertainIconDrawer.update();
    };

    this.participantBlocksDrawer.clickListener = (
      e: MouseEvent,
      d: UtteranceObjectForDrawing
    ) => {
      // Log the selected participant block

      // d.name이 이준석이면 this.insistenceIconDrawerTwo,

      // Go through each icon drawer and set the participant block if the names match
      const iconDrawers = [
        this.insistenceIconDrawer, // 박휘락,
        this.insistenceIconDrawerTwo, // 이준석,
        this.refutationIconDrawer, // 박휘락,
        this.refutationIconDrawerTwo, // 이준석,
      ];
      for (const iconDrawer of iconDrawers) {
        if (iconDrawer.participantBlock?.name === d.name) {
          iconDrawer.participantBlock = d;
          iconDrawer.update();
        }
      }
    };

    this.topicGroupsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.manualSmallTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    // this.manualSmallTGsDrawer.color = "#0000ff";
    this.manualSmallTGsDrawer.color = "#ff0000"; // blue
    this.manualMiddleTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    //this.manualMiddleTGsDrawer.color = "#ff0001";
    this.manualMiddleTGsDrawer.color = "#ff0001";
    this.manualBigTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    // this.manualBigTGsDrawer.color = "#ff0000";
    this.manualBigTGsDrawer.color = "#026b02";
    this.manualPeopleTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.manualPeopleTGsDrawer.color = "#c";
    this.lcsegEGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.lcsegEGsDrawer.color = "#cc9900"; // yellow color
    this.svgSelection.on("click", (event) => {
      _.forEach(
        dataStructureSet.similarityBlockManager.similarityBlocks,
        (similarityBlock) => {
          similarityBlock.visible = true;
        }
      );
      this.similarityBlocksDrawer.update();
      this.participantBlocksDrawer.update();
      this.insistenceIconDrawer.similarityBlock = null;
      this.insistenceIconDrawer.update();
      this.refutationIconDrawer.similarityBlock = null;
      this.refutationIconDrawer.update();
      this.uncertainIconDrawer.similarityBlock = null;
      this.uncertainIconDrawer.update(); // 불확실성 icon
      this.insistenceIconDrawerTwo.similarityBlock = null;
      this.insistenceIconDrawerTwo.update();
      this.refutationIconDrawerTwo.similarityBlock = null;
      this.refutationIconDrawerTwo.update();
    });
  }

  public centerConceptualRecurrentPlot() {
    const utteranceObjectsForDrawing = this.dataStructureSet
      .utteranceObjectsForDrawingManager.utteranceObjectsForDrawing;
    if (utteranceObjectsForDrawing.length !== 0) {
      const lastUtteranceObjectForDrawing =
        utteranceObjectsForDrawing[utteranceObjectsForDrawing.length - 1];

      const minusWidth =
        lastUtteranceObjectForDrawing.beginningPointOfXY +
        lastUtteranceObjectForDrawing.width;
      const adjustedWidth = (this.svgWidth - minusWidth) / 2;

      const adjustedHeight = (this.svgHeight - minusWidth) / 2;
      console.log(adjustedWidth, adjustedHeight);
      this.svgGSelection.attr(
        "transform",
        `translate(${adjustedWidth}, ${adjustedHeight})`
      );
      if (this._zoomListener) {
        const element = document.createElement("div");
        const transform = zoomTransform(element);
        this._zoomListener(transform.translate(adjustedWidth, adjustedHeight));
      }
    } else {
      console.warn("no utteranceObjectsForDrawing");
    }
  }

  public set zoomListener(zoomListener: (transform: d3.ZoomTransform) => void) {
    this._zoomListener = zoomListener;
  }
}

export function wrapText(text: any, width: number) {
  text.each(function () {
    //@ts-ignore
    const text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      lineHeight = 1.1, // ems
      x = text.attr("x"), // get the x position
      y = text.attr("y"), // get the y position
      dyVal = text.attr("dy");

    let dy = parseFloat(dyVal); // Change const to let

    if (isNaN(dy)) dy = 0; // Add this line

    let line: string[] = [],
      lineNumber = 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x) // add the x position
        .attr("y", y) // add the y position
        .attr("dy", dy + "em"),
      word: string | null | undefined = undefined;

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      //@ts-ignore
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x) // add the x position
          .attr("y", y) // add the y position
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
