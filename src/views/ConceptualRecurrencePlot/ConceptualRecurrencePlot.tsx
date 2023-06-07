/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./ConceptualRecurrencePlot.scss";
import _ from "lodash";
import { SimilarityBlock, UtteranceObjectForDrawing } from "./interfaces";
import { makeEngagementGroups } from "./DataStructureMaker/makeEngagementGroups";
import { D3Drawer } from "./Drawers/D3Drawer";
import ConceptualMapModal, {
  ConceptualMapModalRef,
} from "./ConceptualMapModal/ConceptualMapModal";
import Controllers from "./Controllers/Controllers";
import store from "../../redux/store";
import { groupEGsMaker } from "./DataStructureMaker/GroupEGsMaker";
import { useLocation } from "react-router-dom";
import TranscriptViewer from "./TranscriptViewer/TranscriptViewer";
import { CombinedState } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { StandardSimilarityScoreState } from "../../redux/reducers/standardSimilarityScoreReducer";
import {
  DebateDataSet,
  EvaluationDataSet,
} from "../../interfaces/DebateDataInterface";
import { DataStructureManager } from "./DataStructureMaker/DataStructureManager";
import DataImporter, { DebateName, TermType } from "./DataImporter";
import { CHANGE_STANDARD_SIMILARITY_SCORE } from "../../redux/actionTypes";
import CombinedEGsMaker from "./DataStructureMaker/CombinedEGsMaker";
import { extractKeytermsFromEngagementGroup } from "./DataStructureMaker/extractTermsFromEngagementGroup";
import ParticipantTooltip from "../../components/ParticipantTooltip/ParticipantTooltip";
import SimilarityTooltip from "../../components/SimilarityTooltip/SimilarityTooltip";
import Header from "./../Header/Header";
import HeaderTwo from "./../Header/HeaderTwo";
import style from "./rootStyle.module.scss";
import { Bubble } from "./Bubble";

function ConceptualRecurrencePlot() {
  const query = new URLSearchParams(useLocation().search);
  const debateNameOfQuery = query.get("debate_name") as DebateName;
  const termTypeOfQuery = query.get("term_type") as TermType;

  const [debateDataset, setDebateDataset] = useState<DebateDataSet | null>(
    null
  );
  const [
    dataStructureManager,
    setDataStructureManager,
  ] = useState<DataStructureManager | null>(null);
  const [
    evaluationDataSet,
    setEvaluationDataSet,
  ] = useState<EvaluationDataSet | null>(null);

  const [
    combinedEGsMaker,
    setCombinedEGsMaker,
  ] = useState<CombinedEGsMaker | null>(null);
  const [d3Drawer, setD3Drawer] = useState<D3Drawer | null>(null);
  const conceptualMapModalRef = React.useRef<ConceptualMapModalRef>(null);

  const standardSimilarityScore = useSelector<
    CombinedState<{
      standardSimilarityScoreReducer: StandardSimilarityScoreState;
    }>,
    number
  >((state) => state.standardSimilarityScoreReducer.standardSimilarityScore);
  const dispatch = useDispatch();

  // variables for tooltip
  const [
    mouseoveredUtterance,
    setMouseoveredUtterance,
  ] = useState<UtteranceObjectForDrawing | null>(null);
  const [
    mouseoveredSimilarity,
    setMouseoveredSimilarity,
  ] = useState<SimilarityBlock | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  // Import Debate Data
  useEffect(() => {
    if (!dataStructureManager) {
      if (
        debateNameOfQuery === "sample" ||
        debateNameOfQuery === "기본소득" ||
        debateNameOfQuery === "정시확대" ||
        debateNameOfQuery === "모병제" ||
        debateNameOfQuery === "기본소득clipped" ||
        debateNameOfQuery === "정시확대clipped" ||
        debateNameOfQuery === "모병제clipped"
      ) {
        // const debateDataset = new DataImporter(
        //   debateNameOfQuery,
        //   termTypeOfQuery
        // ).debateDataSet as DebateDataSet;
        const dataImporter = new DataImporter(
          debateNameOfQuery,
          termTypeOfQuery
        );

        const dataStructureMaker = new DataStructureManager(
          debateNameOfQuery,
          dataImporter.debateDataSet!
        );

        console.log("dataImporter", dataImporter);
        console.log("dataStructureMaker", dataStructureMaker);

        const combinedEGsMaker = new CombinedEGsMaker(
          dataStructureMaker.dataStructureSet.similarityBlockManager.similarityBlockGroup,
          dataImporter.debateDataSet!.utteranceObjects
        );

        dispatch({
          type: CHANGE_STANDARD_SIMILARITY_SCORE,
          payload: {
            standardSimilarityScore:
              dataStructureMaker.dataStructureSet.maxSimilarityScore,
          },
        });

        setDebateDataset(dataImporter.debateDataSet);
        setDataStructureManager(dataStructureMaker);
        setCombinedEGsMaker(combinedEGsMaker);
        setEvaluationDataSet(dataImporter.evaluationDataSet);
      }
    }
  }, []);

  useEffect(() => {
    if (dataStructureManager && debateDataset) {
      const dataStructureSet = dataStructureManager.dataStructureSet;
      const datasetOfManualEGs = dataStructureManager.datasetOfManualEGs;
      const conceptSimilarityBlocks =
        dataStructureSet.similarityBlockManager.similarityBlocks;
      const conceptSimilarityMatrix =
        dataStructureSet.similarityBlockManager.similarityBlockGroup;
      const manualBigEGs = datasetOfManualEGs.manualBigEGs;
      const manualBigEGTitles = datasetOfManualEGs.manualBigEGTitles;
      const manualMiddleEGs = datasetOfManualEGs.manualMiddleEGs;
      const manualMiddleEGTitles = datasetOfManualEGs.manualMiddleEGTitles;
      const manualSmallEGs = datasetOfManualEGs.manualSmallEGs;
      const manualSmallEGTitles = datasetOfManualEGs.manualSmallEGTitles;
      const maxSimilarityScore = dataStructureSet.maxSimilarityScore;
      const topicGroups = combinedEGsMaker!.makeByNumOfSegments(4);

      // settings of d3Drawer
      const d3Drawer = new D3Drawer(
        debateDataset,
        dataStructureSet,
        termTypeOfQuery
      );

      d3Drawer.zoomListener = (transform) => {
        setTransform(transform);
      };
      d3Drawer.participantBlocksDrawer.mouseoverListener = (
        mouseEvent,
        utteranceObjectForDrawing
      ) => {
        setMouseoveredUtterance(utteranceObjectForDrawing);
        setTooltipVisible(true);
      };
      d3Drawer.participantBlocksDrawer.mouseoutLisener = () => {};
      d3Drawer.similarityBlocksDrawer.mouseoverListener = (
        mouseEvent,
        similarityBlock
      ) => {
        setMouseoveredSimilarity(similarityBlock);
        setTooltipVisible(true);
      };
      d3Drawer.similarityBlocksDrawer.mouseoutLisener = () => {};

      // Engagement Group Drawer's Settings
      d3Drawer.topicGroupsDrawer.topicGroups = topicGroups;
      d3Drawer.topicGroupsDrawer.onTitleClicked = (
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => {
        const extractedKeytermObjects = extractKeytermsFromEngagementGroup(
          engagementGroup,
          debateDataset.conceptMatrixTransposed,
          debateDataset.keytermObjects,
          10
        );
        // openModal에 의해 그려지는가??
        conceptualMapModalRef.current?.openModal(
          `${_.map(extractedKeytermObjects, (o) => o.name)}`,
          engagementGroup
        );
      };
      d3Drawer.topicGroupsDrawer.visible = false;

      // Manual Small Engagement Group Drawer's Settings
      d3Drawer.manualSmallTGsDrawer.topicGroups = manualSmallEGs;
      d3Drawer.manualSmallTGsDrawer.topicGroupTitles = manualSmallEGTitles;
      d3Drawer.manualSmallTGsDrawer.onTitleClicked = (
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => {
        conceptualMapModalRef.current?.openModal(
          `Manual Small Engagement Group ${engagementGroupIndex}`,
          engagementGroup
        );
      };
      d3Drawer.manualSmallTGsDrawer.visible = true;

      // Manual Middle Engagement Group Drawer's Settings
      d3Drawer.manualMiddleTGsDrawer.topicGroups = manualMiddleEGs;
      d3Drawer.manualMiddleTGsDrawer.topicGroupTitles = manualMiddleEGTitles;
      d3Drawer.manualMiddleTGsDrawer.onTitleClicked = (
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => {
        conceptualMapModalRef.current?.openModal(
          `Manual Middle Engagement Group ${engagementGroupIndex}`,
          engagementGroup
        );
      };
      d3Drawer.manualMiddleTGsDrawer.visible = true;

      // Manual Big Engagement Group Drawer's Settings
      d3Drawer.manualBigTGsDrawer.topicGroups = manualBigEGs;
      d3Drawer.manualBigTGsDrawer.topicGroupTitles = manualBigEGTitles;
      d3Drawer.manualBigTGsDrawer.onTitleClicked = (
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => {
        conceptualMapModalRef.current?.openModal(
          `Manual Big Engagement Group ${engagementGroupIndex}`,
          engagementGroup
        );
      };
      d3Drawer.manualBigTGsDrawer.visible = false;

      d3Drawer.manualPeopleTGsDrawer.onTitleClicked = (
        mouseEvent: MouseEvent,
        engagementGroup: SimilarityBlock[][],
        engagementGroupIndex: number
      ) => {
        conceptualMapModalRef.current?.openModal(
          `Manual People Engagement Group ${engagementGroupIndex}`,
          engagementGroup
        );
      };

      d3Drawer.centerConceptualRecurrentPlot();
      d3Drawer.participantBlocksDrawer.update();
      d3Drawer.insistenceMarkersDrawer.update();
      d3Drawer!.similarityBlocksDrawer.standardHighPointOfSimilarityScore = standardSimilarityScore;
      d3Drawer.similarityBlocksDrawer.update();
      d3Drawer.topicGroupsDrawer.update();
      d3Drawer.manualSmallTGsDrawer.update();
      d3Drawer.manualMiddleTGsDrawer.update();
      d3Drawer.manualBigTGsDrawer.update();
      // d3Drawer.manualPeopleTGsDrawer.update();
      console.log("d3Drawer", d3Drawer);

      setD3Drawer(d3Drawer);
    }
  }, [dataStructureManager, debateDataset]);

  return (
    <div className="root-div" style={{ overflow: "hidden" }}>
      <Header />
      <HeaderTwo />
      <div className="vis-area">
        <div className="bubble">
          <Bubble />
        </div>
        <div
          className="concept-recurrence-plot"
          style={{ marginTop: "15px", overflow: "hidden" }}
        >
          <div
            style={{
              position: "fixed",
              overflow: "hidden",
              //float: "left",
              //marginLeft: "-62vw",
              zIndex: "1000",
              fontWeight: "550",
              backgroundColor: "white",
              marginTop: "0px",
              fontSize: "14px",
              height: "25px",
              textAlign: "left",
              marginLeft: "15px",
            }}
          >
            Co-Occurrenece Matrix for Exploration Argumentation
          </div>

          <svg className="fullSvg" style={{ overflow: "visible" }}>
            <g className="test">
              <g className="svgG"></g>
            </g>
          </svg>
        </div>
=======
      {/* <Legend /> */}
      {/* <Controllers
        d3Drawer={d3Drawer}
        combinedEGsMaker={combinedEGsMaker}
        maxSimilarityScore={
          dataStructureManager
            ? dataStructureManager.dataStructureSet.maxSimilarityScore
            : 0
        }
        debateDataset={debateDataset}
        evaluationDataSet={evaluationDataSet}
        dataStructureSet={
          dataStructureManager ? dataStructureManager.dataStructureSet : null
        }
        dataStructureManager={
          dataStructureManager ? dataStructureManager : null
        }
      ></Controllers> */}
      <div
        className="concept-recurrence-plot"
        style={{ marginTop: "35px", overflow: "hidden" }}
      >
        {/* <img
          className="imgPos"
          // TODO 추후 marginLeft 고치기
          style={{ marginTop: "35px", position: "fixed", marginLeft: "-340px" }}
          width="200"
          height="67"
          src="https://i.imgur.com/2JQzpJF.jpg"
        ></img> */}
        <svg className="fullSvg" style={{ overflow: "visible" }}>
          <g className="test">
            <g className="svgG"></g>
          </g>
        </svg>

        {/* 참가자의 발화스크립트툴팁 */}
        {/* <ParticipantTooltip
          utteranceObjectForDrawing={mouseoveredUtterance}
          transform={transform}
          visible={tooltipVisible}
          d3Drawer={d3Drawer}
          debateDataset={debateDataset}
        /> */}
      </div>
      <TranscriptViewer
        dataStructureMaker={dataStructureManager}
      ></TranscriptViewer>
      <ConceptualMapModal
        ref={conceptualMapModalRef}
        participantDict={
          dataStructureManager
            ? dataStructureManager.dataStructureSet.participantDict
            : {}
        }
        utteranceObjects={debateDataset ? debateDataset.utteranceObjects : []}
        termList={debateDataset ? debateDataset.termList : []}
        termUtteranceBooleanMatrixTransposed={
          debateDataset
            ? debateDataset.termUtteranceBooleanMatrixTransposed
            : []
        }
        termType={termTypeOfQuery}
      ></ConceptualMapModal>
    </div>
  );
}

export default ConceptualRecurrencePlot;

{
  /* <ParticipantTooltip
          utteranceObjectForDrawing={mouseoveredUtterance}
          transform={transform}
          open={tooltipVisible}
          d3Drawer={d3Drawer}
          debateDataset={debateDataset}
        /> */
}
{
  /* <SimilarityTooltip
          utteranceObjectForDrawing={mouseoveredUtterance}
          similarityBlock={mouseoveredSimilarity}
          transform={transform}
          open={tooltipVisible}
          d3Drawer={d3Drawer}
          debateDataset={debateDataset}
        /> */
}
