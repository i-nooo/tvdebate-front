/* eslint-disable no-unused-vars */
import { ParticipantDict } from "./../../../common_functions/makeParticipants";
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
import { Participant } from "../../../common_functions/makeParticipants";
import _ from "lodash";
import { KeytermObject } from "../../../interfaces/DebateDataInterface";
import { findTopValueIndexes } from "../../../common_functions/findTopValueIndexes";

export class ParticipantBlocksDrawer {
  private readonly participantRectGSlection!: d3.Selection<
    SVGGElement,
    MouseEvent,
    HTMLElement,
    any
  >;
  private selectedParticipants: Participant[] = [];
  private _clickListener:
    | null
    | ((
        mouseEvent: MouseEvent,
        utteranceObjectForDrawing: UtteranceObjectForDrawing
      ) => void) = null;

  private _selectedParticipantClickListener:
    | null
    | ((selectedParticipant: Participant) => void) = null;
  private _mouseoverListener:
    | null
    | ((
        mouseEvent: MouseEvent,
        utteranceObjectForDrawing: UtteranceObjectForDrawing
      ) => void) = null;
  private _mouseoutListener: null | (() => void) = null;

  public constructor(
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    private readonly participantDict: ParticipantDict,
    private readonly conceptSimilarityBlocks: SimilarityBlock[],
    private readonly conceptMatrixTransposed: number[][],
    private readonly keytermObjects: KeytermObject[],
    svgSelection: d3.Selection<SVGGElement, MouseEvent, HTMLElement, any>
  ) {
    this.participantRectGSlection = svgSelection.append("g");
  }

  public update() {
    const participantRectGSlectionDataBound = this.participantRectGSlection
      .selectAll<SVGRectElement, UtteranceObjectForDrawing>("rect")
      .data(this.utteranceObjectsForDrawing)
      .join("rect");

    participantRectGSlectionDataBound.call(
      setAttributes.bind(
        this,
        participantRectGSlectionDataBound,
        this.participantDict,
        this.conceptMatrixTransposed,
        this.keytermObjects
      )
    );

    // participantRectGSlectionDataBound.on("click", (e, d) => {
    //   const mouseEvent = (e as unknown) as MouseEvent;
    //   console.log("participant block clicked"); // 나옴
    //   mouseEvent.stopPropagation();
    //   const utteranceObjectForDrawing = (d as unknown) as UtteranceObjectForDrawing;

    //   if (this._clickListener) {
    //     this._clickListener(mouseEvent, utteranceObjectForDrawing);
    //   }
    // });

    function setAttributes(
      this: ParticipantBlocksDrawer,
      selection: d3.Selection<
        SVGRectElement,
        UtteranceObjectForDrawing,
        SVGGElement,
        unknown
      >,
      participantDict: { [participant: string]: Participant },
      conceptMatrixTransposed: number[][],
      keytermObjects: KeytermObject[]
    ) {
      selection // utterance_objects 데이터 적용
        .attr("x", (d) => d.beginningPointOfXY)
        .attr("y", (d) => d.beginningPointOfXY)
        .attr("width", (d) => d.width) // 노드 두께
        .attr("height", (d) => d.width) // 노드 높이
        .style("fill", (d) => participantDict[d.name].color)
        //.append("title")
        // .text((d, i) => {
        //   const conceptVectorOfUtterance = conceptMatrixTransposed[i];
        //   // console.log(conceptVectorOfUtterance);
        //   const topValueIndexes = findTopValueIndexes(
        //     conceptVectorOfUtterance,
        //     8 // 최대 보여줄 키워드 수.
        //   );
        //   const mainKeytermObjects = _.map(
        //     topValueIndexes,
        //     (topValueIndex) => keytermObjects[topValueIndex]
        //   );
        //   // console.log(topValueIndexes);
        //   const mainKeytermsString = _.reduce(
        //     mainKeytermObjects,
        //     (result, keytermObject) => {
        //       return `${result} ${keytermObject.name}`;
        //     },
        //     ""
        //   );
        //   return `keywords:${mainKeytermsString}\n ${d.name}: ${d.utterance}
        //   `;
        // })
        .on("mouseover", (e, u) => {
          const mouseEvent = (e as unknown) as MouseEvent;
          mouseEvent.stopPropagation();
          const utteranceObjectForDrawing = (u as unknown) as UtteranceObjectForDrawing;

          // TODO adjust transcript-view
          if (this._mouseoverListener) {
            this._mouseoverListener(mouseEvent, utteranceObjectForDrawing);
          }
        })
        .on("mouseout", (e, u) => {
          if (this._mouseoutListener) {
            this._mouseoutListener();
          }
        });
    }
  }

  public click(
    e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>,
    u: UtteranceObjectForDrawing
  ) {
    const mouseEvent = e;
    mouseEvent.stopPropagation();
    const selectedParticipant = u;

    this.selectedParticipants.push(
      this.participantDict[selectedParticipant.name]
    );

    //console.log("this.selectedParticipants", this.selectedParticipants);

    if (this.selectedParticipants.length === 1) {
      // remain same participant's similairity_block. remove other participant's similarity_block
      _.forEach(this.conceptSimilarityBlocks, (similarityBlock) => {
        const rowParticipantName = this.utteranceObjectsForDrawing[
          similarityBlock.rowUtteranceIndex
        ].name;
        const colParticipantName = this.utteranceObjectsForDrawing[
          similarityBlock.columnUtteranceIndex
        ].name;
        if (
          selectedParticipant.name === rowParticipantName ||
          selectedParticipant.name === colParticipantName
        ) {
          similarityBlock.visible = true;
        } else {
          similarityBlock.visible = false;
        }
      });
    } else if (this.selectedParticipants.length === 2) {
      //
      const participant1 = this.selectedParticipants[0];
      const participant2 = this.selectedParticipants[1];

      _.forEach(this.conceptSimilarityBlocks, (similarityBlock) => {
        const rowParticipantName = this.utteranceObjectsForDrawing[
          similarityBlock.rowUtteranceIndex
        ].name;
        const colParticipantName = this.utteranceObjectsForDrawing[
          similarityBlock.columnUtteranceIndex
        ].name;
        if (
          (rowParticipantName === participant1.name &&
            colParticipantName === participant2.name) ||
          (rowParticipantName === participant2.name &&
            colParticipantName === participant1.name) ||
          (rowParticipantName === participant1.name &&
            colParticipantName === participant1.name) ||
          (rowParticipantName === participant2.name &&
            colParticipantName === participant2.name)
        ) {
          similarityBlock.visible = true;
        } else {
          similarityBlock.visible = false;
        }
      });
    }
  }

  public emptySelectedParticipants() {
    this.selectedParticipants = [];
  }

  public set clickListener(
    clickListener: (e: MouseEvent, d: UtteranceObjectForDrawing) => void
  ) {
    this._clickListener = clickListener;
  }

  public set mouseoverListener(
    mouseoverListener: (
      mouseEvent: MouseEvent,
      utteranceObjectForDrawing: UtteranceObjectForDrawing
    ) => void
  ) {
    this._mouseoverListener = mouseoverListener;
  }

  public set mouseoutLisener(mouseoutListener: () => void) {
    this._mouseoutListener = mouseoutListener;
  }
}
