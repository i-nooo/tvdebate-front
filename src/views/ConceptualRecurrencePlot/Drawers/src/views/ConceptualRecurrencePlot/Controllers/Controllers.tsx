/* eslint-disable no-unused-vars */
import React from "react";
import styles from "./Controllers.module.scss";
import { Button, Checkbox, Radio, Select, Tree } from "antd";
import { D3Drawer } from "../Drawers/D3Drawer";
import { SimilarityBlock } from "../interfaces";
import { changeStandardSimilarityScoreActionCreator } from "../../../redux/actions";
import { getStandardSimilarityScore } from "../../../redux/selectors";
import store from "../../../redux/store";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { CombinedState, ActionCreator } from "redux";
import { StandardSimilarityScoreState } from "../../../redux/reducers/standardSimilarityScoreReducer";
import { ChangeStandardSimilarityScoreAction } from "../../../redux/actions";
import SliderWithInput from "../../../components/SliderWithInput/SliderWithInput";
import { ColoringSelfSimilarities } from "../Drawers/SimilarityBlocksDrawer";
import { makeEngagementGroups } from "../DataStructureMaker/makeEngagementGroups";
import { groupEGsMaker } from "../DataStructureMaker/GroupEGsMaker";
import { lineEGsMaker } from "../DataStructureMaker/LineEGsMaker";
import { pointEGsMaker } from "../DataStructureMaker/PointEGsMaker";
import CombinedEGsMaker from "../DataStructureMaker/CombinedEGsMaker";
import { SimilarityBlockManager } from "../DataStructureMaker/SimilarityBlockManager";
import _ from "lodash";
import {
  DebateDataSet,
  EvaluationDataSet,
} from "../../../interfaces/DebateDataInterface";
import Evaluation from "../../../classes/Evaluation";
import {
  DataStructureManager,
  DataStructureSet,
} from "../DataStructureMaker/DataStructureManager";
import ControllersUtils from "./ControllersUtils";
const { Option } = Select;
interface ReduxProps {
  standardSimilarityScore: number;
  changeStandardSimilarityScore: ActionCreator<
    ChangeStandardSimilarityScoreAction
  >;
}
interface ComponentProps extends ReduxProps {
  maxSimilarityScore: number;
  d3Drawer: D3Drawer | null;
  combinedEGsMaker: CombinedEGsMaker | null;
  debateDataset: DebateDataSet | null;
  evaluationDataSet: EvaluationDataSet | null;
  dataStructureSet: DataStructureSet | null;
  dataStructureManager: DataStructureManager | null;
}
interface ComponentState {
  // Our Model's variables
  semanticConsistency: number;
  numberOfTopicGroups: number;
  groupSimilaritiesWeight: number;
  borderSimilaritiesWeight: number;
  pointSimilaritiesWeight: number;
  radioValueForMethods: string;
  otherConsistencyWeight: number;
  selfConsistencyWeight: number;
  refutationWeight: number;
  insistenceWeight: number;
  sentenceSentimentStandard: number;
  negativeSumStandard: number;
  positiveSumStandard: number;
  colUtteranceLongStandard: number;
  hostWeight: number;
  hostLongStandard: number;
  // evaluation's variables
  evaluation: Evaluation | null;
  numOfLCsegGroups: number;
  sentenceIndexesForSegmentsOfLCseg: number[];
  sentenceIndexesOfSegmentsOfCSseg: number[];
}

export class Controllers extends React.Component<
  ComponentProps,
  ComponentState
> {
  constructor(props: ComponentProps) {
    // default controller state
    super(props);
    this.state = {
      semanticConsistency: 1000,
      numberOfTopicGroups: 7,
      groupSimilaritiesWeight: 1,
      borderSimilaritiesWeight: 0,
      pointSimilaritiesWeight: 0,
      radioValueForMethods: "group",
      otherConsistencyWeight: 1,
      selfConsistencyWeight: 1,
      refutationWeight: 2,
      insistenceWeight: 2,
      sentenceSentimentStandard: 0.25,
      negativeSumStandard: 0.5,
      positiveSumStandard: 0.5,
      colUtteranceLongStandard: 100,
      hostWeight: 1,
      hostLongStandard: 100,
      evaluation: null,
      numOfLCsegGroups: 5,
      sentenceIndexesForSegmentsOfLCseg: [],
      sentenceIndexesOfSegmentsOfCSseg: [],
    };
  }

  render() {
    return (
      <div
        // style={{ backgroundColor: "gray" }}
        className={styles.controllersZone}
      >
        <div
          className={styles.verticalSpace}
          // style={{ marginTop: "100px" }}
        ></div>
        <Checkbox
          className={styles.checkbox}
          defaultChecked
          onChange={(event) => {
            this.props.d3Drawer!.similarityBlocksDrawer.coloringRebuttal =
              event.target.checked;
            this.props.d3Drawer!.insistenceMarkersDrawer.visible =
              event.target.checked;

            this.props.d3Drawer!.similarityBlocksDrawer.update();
            this.props.d3Drawer!.insistenceMarkersDrawer.update();
          }}
          style={{ fontWeight: "bold" }}
        >
          Coloring Refutation/Insistence
        </Checkbox>
        <div
          style={{
            fontSize: 11,
            fontWeight: "bold",
            marginTop: "10px",
            marginBottom: "5px",
          }}
        >
          Conditions of insistence & refutation Weight
        </div>
        <div className={styles.verticalSpace}></div>
        <div>Insistence (주장)</div>
        <SliderWithInput
          min={0}
          max={5}
          value={this.state.insistenceWeight}
          step={0.1}
          onChangeListener={(changedValue) => {
            this.props.dataStructureSet!.similarityBlockManager.insistenceWeight = changedValue;

            // const engagementGroups = this.props.combinedEGsMaker!.make();
            const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
              this.state.numberOfTopicGroups
            );
            this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
            this.props.d3Drawer!.topicGroupsDrawer.update();

            // find most similarity in similarityBlocks
            this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
            this.props.d3Drawer!.similarityBlocksDrawer.update();

            this.setState({
              insistenceWeight: changedValue,
            });
          }}
        ></SliderWithInput>
        <div>Refutation (반박)</div>
        <SliderWithInput
          min={0}
          max={5}
          value={this.state.refutationWeight}
          step={0.1}
          onChangeListener={(changedValue) => {
            this.props.dataStructureSet!.similarityBlockManager.refutationWeight = changedValue;

            // const engagementGroups = this.props.combinedEGsMaker!.make();
            const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
              this.state.numberOfTopicGroups
            );
            this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
            this.props.d3Drawer!.topicGroupsDrawer.update();

            // find most similarity in similarityBlocks
            this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
            this.props.d3Drawer!.similarityBlocksDrawer.update();

            this.setState({
              refutationWeight: changedValue,
            });
          }}
        ></SliderWithInput>

        <div
          style={{
            fontSize: 11,
            fontWeight: "bold",
            marginTop: "10px",
            marginBottom: "5px",
          }}
        >
          Conditions of Sentiment & Length of Text Weight
        </div>
        <div className={styles.smallControllerTitle}>Positive</div>
        <SliderWithInput
          min={0}
          max={5}
          value={this.state.positiveSumStandard}
          step={0.1}
          sliderWidth={104}
          onChangeListener={(changedValue) => {
            // this.props.dataStructureSet?.utteranceObjectsForDrawing[0].
            this.props.dataStructureSet!.utteranceObjectsForDrawingManager.positiveSumStandard = changedValue;
            this.props.dataStructureSet!.similarityBlockManager.positiveSumStandard = changedValue;

            // make topic_segments
            const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
              this.state.numberOfTopicGroups
            );

            // draw topic_segments
            this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
            this.props.d3Drawer!.topicGroupsDrawer.update();

            // draw similarity_blocks
            this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
            this.props.d3Drawer!.similarityBlocksDrawer.update();

            this.props.d3Drawer!.insistenceMarkersDrawer.update();

            this.setState({
              positiveSumStandard: changedValue,
            });
          }}
        ></SliderWithInput>
        <div className={styles.smallControllerTitle}>Negative</div>
        <SliderWithInput
          min={0}
          max={5}
          value={this.state.negativeSumStandard}
          step={0.1}
          sliderWidth={104}
          onChangeListener={(changedValue) => {
            // adjust weight of similarity_blocks
            this.props.dataStructureSet!.similarityBlockManager.negativeSumStandard = changedValue;

            // make topic_segments
            // const engagementGroups = this.props.combinedEGsMaker!.make();
            const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
              this.state.numberOfTopicGroups
            );

            // draw topic_segments
            this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
            this.props.d3Drawer!.topicGroupsDrawer.update();

            // draw similarity_blocks
            this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
            this.props.d3Drawer!.similarityBlocksDrawer.update();

            this.setState({ negativeSumStandard: changedValue });
          }}
        ></SliderWithInput>
        <div className={styles.smallControllerTitle}>Text Length</div>
        <SliderWithInput
          min={0}
          max={300}
          value={this.state.colUtteranceLongStandard}
          sliderWidth={104}
          onChangeListener={(changedValue) => {
            // adjust weight of similarity_blocks
            this.props.dataStructureSet!.similarityBlockManager.colUtteranceLongStandard = changedValue;
            this.props.dataStructureSet!.utteranceObjectsForDrawingManager.colUtteranceLongStandard = changedValue;

            // make topic_segments
            // const engagementGroups = this.props.combinedEGsMaker!.make();
            const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
              this.state.numberOfTopicGroups
            );

            // draw topic_segments
            this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
            this.props.d3Drawer!.topicGroupsDrawer.update();

            // draw similarity_blocks
            this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
            this.props.d3Drawer!.similarityBlocksDrawer.update();

            this.setState({
              colUtteranceLongStandard: changedValue,
            });
          }}
        ></SliderWithInput>

        {/* <Tree
          selectable={false}
          // defaultExpandedKeys={["0-0-0", "0-0-1"]}
          treeData={[
            {
              title: (
                <div style={{ fontSize: 11 }}>
                  conditions of insistence & refutation
                </div>
              ),
              key: "0-0",
              children: [
                {
                  key: "0-0-1",
                  title: (
                    <div>
                      <div className={styles.smallControllerTitle}>
                        negative(j)
                      </div>
                      <SliderWithInput
                        min={0}
                        max={5}
                        value={this.state.negativeSumStandard}
                        step={0.1}
                        sliderWidth={104}
                        onChangeListener={(changedValue) => {
                          // adjust weight of similarity_blocks
                          this.props.dataStructureSet!.similarityBlockManager.negativeSumStandard = changedValue;

                          // make topic_segments
                          // const engagementGroups = this.props.combinedEGsMaker!.make();
                          const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
                            this.state.numberOfTopicGroups
                          );

                          // draw topic_segments
                          this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
                          this.props.d3Drawer!.topicGroupsDrawer.update();

                          // draw similarity_blocks
                          this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
                          this.props.d3Drawer!.similarityBlocksDrawer.update();

                          this.setState({ negativeSumStandard: changedValue });
                        }}
                      ></SliderWithInput>
                    </div>
                  ),
                },
                {
                  key: "0-0-2",
                  title: (
                    <div>
                      <div className={styles.smallControllerTitle}>long(i)</div>
                      <SliderWithInput
                        min={0}
                        max={300}
                        value={this.state.colUtteranceLongStandard}
                        sliderWidth={104}
                        onChangeListener={(changedValue) => {
                          // adjust weight of similarity_blocks
                          this.props.dataStructureSet!.similarityBlockManager.colUtteranceLongStandard = changedValue;
                          this.props.dataStructureSet!.utteranceObjectsForDrawingManager.colUtteranceLongStandard = changedValue;

                          // make topic_segments
                          // const engagementGroups = this.props.combinedEGsMaker!.make();
                          const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
                            this.state.numberOfTopicGroups
                          );

                          // draw topic_segments
                          this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
                          this.props.d3Drawer!.topicGroupsDrawer.update();

                          // draw similarity_blocks
                          this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
                          this.props.d3Drawer!.similarityBlocksDrawer.update();

                          this.setState({
                            colUtteranceLongStandard: changedValue,
                          });
                        }}
                      ></SliderWithInput>
                    </div>
                  ),
                },
                {
                  key: "0-0-3",
                  title: (
                    <div>
                      <div className={styles.smallControllerTitle}>
                        positive(i)
                      </div>
                      <SliderWithInput
                        min={0}
                        max={5}
                        value={this.state.positiveSumStandard}
                        step={0.1}
                        sliderWidth={104}
                        onChangeListener={(changedValue) => {
                          // this.props.dataStructureSet?.utteranceObjectsForDrawing[0].
                          this.props.dataStructureSet!.utteranceObjectsForDrawingManager.positiveSumStandard = changedValue;
                          this.props.dataStructureSet!.similarityBlockManager.positiveSumStandard = changedValue;

                          // make topic_segments
                          const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
                            this.state.numberOfTopicGroups
                          );

                          // draw topic_segments
                          this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
                          this.props.d3Drawer!.topicGroupsDrawer.update();

                          // draw similarity_blocks
                          this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
                          this.props.d3Drawer!.similarityBlocksDrawer.update();

                          this.props.d3Drawer!.insistenceMarkersDrawer.update();

                          this.setState({
                            positiveSumStandard: changedValue,
                          });
                        }}
                      ></SliderWithInput>
                    </div>
                  ),
                },
                {
                  key: "0-0-4",
                  title: (
                    <div>
                      <div className={styles.smallControllerTitle}>
                        sentence sentiment standard
                      </div>
                      <SliderWithInput
                        min={0}
                        max={1}
                        value={this.state.sentenceSentimentStandard}
                        step={0.1}
                        sliderWidth={104}
                        onChangeListener={(changedValue) => {
                          console.log("sentence sentiment standard changed");
                          // adjust weight of similarity_blocks
                          this.props.dataStructureSet!.similarityBlockManager.sentenceSentimentStandard = changedValue;
                          this.props.dataStructureSet!.utteranceObjectsForDrawingManager.sentenceSentimentStandard = changedValue;

                          // make topic_segments
                          // const engagementGroups = this.props.combinedEGsMaker!.make();
                          const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
                            this.state.numberOfTopicGroups
                          );

                          // draw topic_segments
                          this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
                          this.props.d3Drawer!.topicGroupsDrawer.update();

                          // draw similarity_blocks
                          this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
                          this.props.d3Drawer!.similarityBlocksDrawer.update();

                          this.props.d3Drawer!.insistenceMarkersDrawer.update();

                          this.setState({
                            sentenceSentimentStandard: changedValue,
                          });
                        }}
                      ></SliderWithInput>
                    </div>
                  ),
                },
              ],
            },
          ]}
        ></Tree> */}
        <div className={styles.verticalSpace}></div>
        {/* <img
          width="200"
          height="66"
          src="https://i.imgur.com/2JQzpJF.jpg"
        ></img> */}
        {/* <div>Host (사회자)</div>
        <SliderWithInput
          min={0}
          max={5}
          value={this.state.hostWeight}
          step={0.1}
          onChangeListener={(changedValue) => {
            this.props.dataStructureSet!.similarityBlockManager.hostWeight = changedValue;
            // const engagementGroups = this.props.combinedEGsMaker!.make();
            const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
              this.state.numberOfTopicGroups
            );
            this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
            this.props.d3Drawer!.topicGroupsDrawer.update();

            this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
            this.props.d3Drawer!.similarityBlocksDrawer.update();

            this.setState({
              hostWeight: changedValue,
            });
          }}
        ></SliderWithInput> */}
        {/* <Tree
          selectable={false}
          // defaultExpandedKeys={["0-0-0", "0-0-1"]}
          treeData={[
            {
              title: <div style={{ fontSize: 11 }}>condition of host</div>,
              key: "0-0",
              children: [
                {
                  key: "0-0-0",
                  title: (
                    <div>
                      <div className={styles.smallControllerTitle}>long</div>
                      <SliderWithInput
                        min={0}
                        max={200}
                        value={this.state.hostLongStandard}
                        sliderWidth={104}
                        onChangeListener={(changedValue) => {
                          this.props.dataStructureSet!.similarityBlockManager.hostLongStandard = changedValue;

                          const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
                            this.state.numberOfTopicGroups
                          );
                          this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
                          this.props.d3Drawer!.topicGroupsDrawer.update();

                          this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
                          this.props.d3Drawer!.similarityBlocksDrawer.update();

                          this.setState({
                            hostLongStandard: changedValue,
                          });
                        }}
                      ></SliderWithInput>
                    </div>
                  ),
                },
              ],
            },
          ]}
        ></Tree>
        <Checkbox
          className={styles.checkbox}
          onChange={(event) => {
            // TODO
            let otherConsistencyWeight: number = 5;
            let selfConsistencyWeight: number = 1;
            let refutationWeight: number = 2;
            let insistenceWeight: number = 2;
            let hostWeight: number = 1;

            if (event.target.checked) {
              otherConsistencyWeight = 5;
              selfConsistencyWeight = 0.5;
              refutationWeight = 2;
              insistenceWeight = 2;
              hostWeight = 2;
            }

            this.props.dataStructureSet!.similarityBlockManager.otherConsistencyWeight = otherConsistencyWeight;
            this.props.dataStructureSet!.similarityBlockManager.selfConsistencyWeight = selfConsistencyWeight;
            this.props.dataStructureSet!.similarityBlockManager.refutationWeight = refutationWeight;
            this.props.dataStructureSet!.similarityBlockManager.insistenceWeight = insistenceWeight;
            this.props.dataStructureSet!.similarityBlockManager.hostWeight = hostWeight;

            // const engagementGroups = this.props.combinedEGsMaker!.make();
            const topicGroups = this.props.combinedEGsMaker!.makeByNumOfSegments(
              this.state.numberOfTopicGroups
            );
            this.props.d3Drawer!.topicGroupsDrawer.topicGroups = topicGroups;
            this.props.d3Drawer!.topicGroupsDrawer.update();

            // find most similarity in similarityBlocks
            this.props.d3Drawer!.similarityBlocksDrawer.applyColorRatioSettingByTopSimilarityBlock();
            this.props.d3Drawer!.similarityBlocksDrawer.update();

            this.setState({
              otherConsistencyWeight,
              selfConsistencyWeight,
              refutationWeight,
              insistenceWeight,
              hostWeight,
            });
          }}
        >
          apply 2 multiplied metrics
        </Checkbox> */}
        {/* <div className={styles.marginBottom}></div>
        <div className={styles.classificationTitle}>[ Colorings ]</div>
        <div>Coloring of Similarity Score</div>
        <SliderWithInput
          min={1}
          max={this.props.maxSimilarityScore}
          step={0.01}
          value={this.props.standardSimilarityScore}
          onChangeListener={(changedValue) => {
            this.props.changeStandardSimilarityScore(changedValue);

            // const engagementGroups = makeEngagementGroups(
            //   this.props.conceptSimilarityMatrix,
            //   changedValue
            // );
            // this.props.d3Drawer!.engagementGroupsDrawer.engagementGroups = engagementGroups;
            // this.props.d3Drawer!.engagementGroupsDrawer.update();

            this.props.d3Drawer!.similarityBlocksDrawer.standardHighPointOfSimilarityScore = changedValue;
            this.props.d3Drawer!.similarityBlocksDrawer.update();
          }}
        ></SliderWithInput> */}
        {/* <div>Coloring Self Similarities</div>
        <Select
          className={styles.select}
          defaultValue="none"
          size="small"
          onChange={(value: ColoringSelfSimilarities) => {
            console.log("Select value", value);
            this.props.d3Drawer!.similarityBlocksDrawer.coloringSelfSimilarities = value;
            this.props.d3Drawer!.similarityBlocksDrawer.update();
          }}
        >
          <Option value="none">None</Option>
          <Option value="oneColor">1 Color</Option>
          <Option value="participantColors">Participant Colors</Option>
        </Select>
        <Checkbox
          className={styles.checkbox}
          onChange={(event) => {
            this.props.d3Drawer!.similarityBlocksDrawer.showEngagementPoint =
              event.target.checked;
            this.props.d3Drawer!.similarityBlocksDrawer.update();
          }}
        >
          Show Engagement Point
        </Checkbox>
        <div className={styles.classificationTitle} style={{ marginBottom: 2 }}>
          [ Evaluation ]
        </div>
        <div>LCseg&#39;s Number of Segments</div>
        <SliderWithInput
          min={1}
          max={20}
          value={this.state.numOfLCsegGroups}
          onChangeListener={(changedValue) => {
            if (this.state.evaluation !== null) {
              const segmentSentenceIndexes = this.state.evaluation.lcseg.makeSegmentSentenceIndexes(
                changedValue
              );
              // console.log("segmentSentenceIndexes", segmentSentenceIndexes);

              const segmentGroups = this.state.evaluation.makeGroupsInCRP(
                this.props.dataStructureSet!.similarityBlockManager
                  .similarityBlockGroup,
                segmentSentenceIndexes
              );
              // console.log("segmentGroups", segmentGroups);

              this.props.d3Drawer!.lcsegEGsDrawer.topicGroups = segmentGroups;
              this.props.d3Drawer!.lcsegEGsDrawer.update();

              this.setState({
                numOfLCsegGroups: changedValue,
                sentenceIndexesForSegmentsOfLCseg: segmentSentenceIndexes,
              });
            }
          }}
        ></SliderWithInput> */}
        <div className={styles.verticalSpace}></div>
        <div className={styles.pkwd}>
          {/* <Button
            className={styles.button}
            size={"small"}
            onClick={() => {
              if (this.state.evaluation) {
                let sentenceIndexesOfSegmentsOfCSseg = this.state
                  .sentenceIndexesOfSegmentsOfCSseg;

                // if (this.state.sentenceIndexesOfSegmentsOfCSseg.length === 0) {
                const topicGroups = this.props.d3Drawer!.topicGroupsDrawer
                  .topicGroups;

                sentenceIndexesOfSegmentsOfCSseg = this.state.evaluation.makeGroupsToSentenceIndexesInFirst(
                  topicGroups,
                  this.props.dataStructureSet!
                    .utteranceIndexSentenceIndexTotalSentenceIndexDict
                );
                // sentenceIndexesOfSegmentsOfCSseg = this.state.evaluation.makeGroupsToSentenceIndexesInMiddle(
                //   topicGroups,
                //   this.props.debateDataset!.utteranceObjects,
                //   this.props.dataStructureSet!
                //     .utteranceIndexSentenceIndexTotalSentenceIndexDict
                // );

                this.setState({
                  sentenceIndexesOfSegmentsOfCSseg,
                });
                // }

                const pkOfCSseg = this.state.evaluation.pk.makePkBasedOnSentence(
                  sentenceIndexesOfSegmentsOfCSseg
                );
                console.log("CSseg's Pk : ", pkOfCSseg);
              }
            }}
          >
            CSseg&#39; Pk
          </Button> */}
          {/* <Button
            className={styles.button}
            size={"small"}
            onClick={() => {
              if (this.state.evaluation) {
                let sentenceIndexesOfSegmentsOfCSseg = this.state
                  .sentenceIndexesOfSegmentsOfCSseg;

                // if (this.state.sentenceIndexesOfSegmentsOfCSseg.length === 0) {
                const topicGroups = this.props.d3Drawer!.topicGroupsDrawer
                  .topicGroups;

                sentenceIndexesOfSegmentsOfCSseg = this.state.evaluation.makeGroupsToSentenceIndexesInFirst(
                  topicGroups,
                  this.props.dataStructureSet!
                    .utteranceIndexSentenceIndexTotalSentenceIndexDict
                );
                // sentenceIndexesOfSegmentsOfCSseg = this.state.evaluation.makeGroupsToSentenceIndexesInMiddle(
                //   topicGroups,
                //   this.props.debateDataset!.utteranceObjects,
                //   this.props.dataStructureSet!
                //     .utteranceIndexSentenceIndexTotalSentenceIndexDict
                // );

                this.setState({
                  sentenceIndexesOfSegmentsOfCSseg,
                });
                // }

                const windowDiffOfCSseg = this.state.evaluation.windowDiff.makeWindowDiffBasedOnSentence(
                  sentenceIndexesOfSegmentsOfCSseg
                );
                console.log("CSseg's Wd : ", windowDiffOfCSseg);
              }
            }}
          >
            CSseg&#39; Wd
          </Button>
          <Button
            className={styles.button}
            size={"small"}
            onClick={() => {
              if (this.state.evaluation) {
                const pkOfLCseg = this.state.evaluation.pk.makePkBasedOnSentence(
                  this.state.sentenceIndexesForSegmentsOfLCseg
                );
                console.log("LCseg's Pk : ", pkOfLCseg);
              }
            }}
          >
            LCseg&#39; Pk
          </Button>
          <Button
            className={styles.button}
            size={"small"}
            onClick={() => {
              if (this.state.evaluation) {
                const windowDiffOfLCseg = this.state.evaluation.windowDiff.makeWindowDiffBasedOnSentence(
                  this.state.sentenceIndexesForSegmentsOfLCseg
                );
                console.log("LCseg's Wd : ", windowDiffOfLCseg);
              }
            }}
          >
            LCseg&#39; Wd
          </Button> */}
        </div>
        <div className={styles.verticalSpace}></div>
        <div className={styles.verticalSpace}></div>
        {/* <Button
          className={styles.button}
          size={"small"}
          onClick={() => {
            if (this.state.evaluation) {
              const topicGroups = this.props.dataStructureManager!
                .datasetOfManualEGs.manualSmallEGs;

              const sentenceIndexesOfSegments = this.state.evaluation.makeGroupsToSentenceIndexesInFirst(
                topicGroups,
                this.props.dataStructureSet!
                  .utteranceIndexSentenceIndexTotalSentenceIndexDict
              );
              // const sentenceIndexesOfSegments = this.state.evaluation.makeGroupsToSentenceIndexesInMiddle(
              //   topicGroups,
              //   this.props.debateDataset!.utteranceObjects,
              //   this.props.dataStructureSet!
              //     .utteranceIndexSentenceIndexTotalSentenceIndexDict
              // );

              console.log(
                "sentenceIndexesOfSegments",
                sentenceIndexesOfSegments
              );
            }
          }}
        >
          Get small manual sentence_indexes_of_segments
        </Button>
        <Button
          className={styles.button}
          size={"small"}
          onClick={() => {
            if (this.state.evaluation) {
              const topicGroups = this.props.dataStructureManager!
                .datasetOfManualEGs.manualBigEGs;

              const sentenceIndexesOfSegments = this.state.evaluation.makeGroupsToSentenceIndexesInFirst(
                topicGroups,
                this.props.dataStructureSet!
                  .utteranceIndexSentenceIndexTotalSentenceIndexDict
              );

              console.log(
                "sentenceIndexesOfSegments",
                sentenceIndexesOfSegments
              );
            }
          }}
        >
          Get big manual sentence_indexes_of_segments
        </Button> */}
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<
  any,
  any,
  CombinedState<{
    standardSimilarityScoreReducer: StandardSimilarityScoreState;
  }>
> = (state) => {
  const standardSimilarityScore = getStandardSimilarityScore(store);
  return {
    standardSimilarityScore,
  };
};
const mapDispatchToProps: MapDispatchToProps<any, any> = {
  changeStandardSimilarityScore: changeStandardSimilarityScoreActionCreator,
};

export default connect(mapStateToProps, mapDispatchToProps)(Controllers);
