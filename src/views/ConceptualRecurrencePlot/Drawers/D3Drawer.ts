import { UncertainIconDrawer } from "./UncertainIconDrawer";
import { TermType } from "./../DataImporter";
import { DataStructureSet } from "../DataStructureMaker/DataStructureManager";
import { DebateDataSet } from "./../../../interfaces/DebateDataInterface";
/* eslint-disable no-unused-vars */
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
  // 접근 제한자 public, private, protected
  // public: 어디에서나 접근할 수 있으며 생략 가능한 default 값
  // private: 해당 클래스의 인스턴스에서만 접근 가능
  // protected: 해당 클래스 혹은 서브클래스의 인스턴스에서만 접근이 가능
  // this는 자신이 속한 객체 또는 자신이 생성할 인스턴스를 가리키는 자기 참조 변수(self-reference variable)
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
    // private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    // conceptSimilarityBlocks: SimilarityBlock[],
    // conceptSimilarityGroup: SimilarityBlock[][],
    // participantDict: ParticipantDict,
    // conceptMatrixTransposed: number[][],
    // keytermObjects: KeytermObject[],
    // termList: string[],
    // termUtteranceBooleanMatrixTransposed: number[][]
    private readonly debateDataSet: DebateDataSet,
    private readonly dataStructureSet: DataStructureSet,
    private readonly termType: TermType
  ) {
    // declare variables
    this.conceptRecurrencePlotDiv = d3.select(".concept-recurrence-plot");
    this.svgWidth = this.conceptRecurrencePlotDiv.node()!.clientWidth;
    this.svgHeight = this.conceptRecurrencePlotDiv.node()!.clientHeight;
    // this.svgRotate = this.conceptRecurrencePlotDiv.node()!;
    // const rotate = d3.svg.transform().rotate(-45);
    this.svgSelection = this.conceptRecurrencePlotDiv
      .select<SVGSVGElement>("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      // 전체 svg 영역
      .attr("transform", "scale(1, -1) rotate(-45)")
      // .attr("transform", "rotate(45)")
      // 임시로 45도 돌려놓음 현재
      // zoom event 일어나는 곳
      .call(
        d3
          .zoom<SVGSVGElement, D3ZoomEvent<SVGSVGElement, any>>()
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
      debateDataSet.keytermObjects,
      this.svgGSelection
    ); // 불확실 아이콘 drawer
    this.insistenceIconDrawerTwo = new InsistenceIconDrawerTwo(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      this.svgGSelection
    );
    this.uncertainIconDrawer = new InsistenceIconDrawer(
      dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
      debateDataSet.keytermObjects,
      this.svgGSelection
    );
    // this.uncertainIconDrawer = new UncertainIconDrawer(
    //   dataStructureSet.utteranceObjectsForDrawingManager.utteranceObjectsForDrawing,
    //   this.svgGSelection
    // );
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
      // 논쟁 판단하는 조건문
      // col: left, row: right
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
        d.colUtteranceName === "김종대" ||
        d.colUtteranceName === "장경태"
      ) {
        this.refutationIconDrawer.similarityBlock = d;
        this.insistenceIconDrawerTwo.similarityBlock = d;
      } else null;
      //this.uncertainIconDrawer.similarityBlock = d;
      // if (d.refutation) {
      //   if (d.refutation) {
      //     this.refutationIconDrawer.similarityBlock = d;
      //   } else {
      //     this.refutationIconDrawerTwo.similarityBlock = d;
      //   }
      //   const colUtteranceObject = this.dataStructureSet
      //     .utteranceObjectsForDrawingManager.utteranceObjectsForDrawing[
      //     d.columnUtteranceIndex
      //   ];
      //   if (
      //     colUtteranceObject.insistence &&
      //     (colUtteranceObject.name === "장경태" ||
      //       colUtteranceObject.name === "김종대")
      //   ) {
      //     this.insistenceIconDrawer.similarityBlock = d; // 장경태, 김종대
      //   } else if (colUtteranceObject.insistence) {
      //     // unknown insistence
      //     this.uncertainIconDrawer.similarityBlock = d;
      //   } else {
      //     this.insistenceIconDrawerTwo.similarityBlock = d; // 8
      //   }
      // }
      this.refutationIconDrawer.update();
      this.refutationIconDrawerTwo.update();
      this.insistenceIconDrawer.update();
      this.insistenceIconDrawerTwo.update();
      this.uncertainIconDrawer.update();
    };

    this.participantBlocksDrawer.clickListener = () => {
      this.similarityBlocksDrawer.update();
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
    this.manualSmallTGsDrawer.color = "#424242";
    this.manualMiddleTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.manualMiddleTGsDrawer.color = "#1d1d1d";
    this.manualBigTGsDrawer = new TopicGroupsDrawer(
      this.svgGSelection,
      debateDataSet,
      dataStructureSet,
      termType
    );
    this.manualBigTGsDrawer.color = "#ff0000";
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
    // 논쟁 구간 클릭 시 발생하는 이벤트
    this.svgSelection.on("click", (event) => {
      // console.log("svg clicked", event);
      // show all similarityBlocks
      _.forEach(
        dataStructureSet.similarityBlockManager.similarityBlocks,
        (similarityBlock) => {
          similarityBlock.visible = true;
        }
      );
      this.similarityBlocksDrawer.update();
      this.participantBlocksDrawer.emptySelectedParticipants();
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
