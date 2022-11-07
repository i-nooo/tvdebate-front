/* eslint-disable no-unused-vars */
import { Button, Checkbox, Tooltip } from "antd";
import _ from "lodash";
import React, {
  useEffect,
  useRef,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Participant,
  makeParticipants,
  ParticipantDict,
} from "../../../common_functions/makeParticipants";
import BasicModal, {
  BasicModalRef,
} from "../../../components/BasicModal/BasicModal";
import {
  SentenceObject,
  UtteranceObject,
} from "../../../interfaces/DebateDataInterface";
import { DebateName } from "../../ConceptualRecurrencePlot/DataImporter";
import {
  SubjectRecordInTesting,
  UtteranceIndexSentenceIndexTotalSentenceIndexDict,
} from "../../ConceptualRecurrencePlot/interfaces";
import {
  findSameSentenceAndApplyScrollTopAtMinimap,
  getSentenceDataSetAtViewport,
  makeBodyTextBackgroundColor,
  makeBodyTextBackgroundColorInMinimap,
  submitTestResult,
} from "../../TranscriptSubjectTest/TestSubjectsFunctions";
import styles from "./TestTranscriptComponent.module.scss";

interface ComponentProps {
  debateName: DebateName;
}

export interface TestTranscriptComponentRef {
  totalSentenceObjects: SentenceObject[];
  bodyTextContainerRef: React.RefObject<HTMLDivElement>;
  sentenceIndexesOfSegments: number[];
}

function TestTranscriptComponent(
  props: ComponentProps,
  ref: Ref<TestTranscriptComponentRef>
) {
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const locationState = useLocation<{
    ageGroup: string;
    gender: string;
    major: string;
    participationCode: string;
  }>().state;
  const debateNameOfQuery = query.get("debate_name") as DebateName;

  const [utteranceObjects, setUtteranceObjects] = useState<UtteranceObject[]>(
    []
  );
  const [participantDict, setParticipantDict] = useState<ParticipantDict>({});
  const [totalSentenceObjects, setTotalSentenceObjects] = useState<
    SentenceObject[]
  >([]);
  // TODO We can insert test-result here
  const [sentenceIndexesOfSegments, setSentenceIndexesOfSegments] = useState<
    number[]
  >([]);
  const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
  const [
    utteranceIndexSentenceIndexTotalSentenceIndexDict,
    setUtteranceIndexSentenceIndexTotalSentenceIndexDict,
  ] = useState<UtteranceIndexSentenceIndexTotalSentenceIndexDict>({});

  const bodyTextContainerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);
  const [minimapViewportTop, setMinimapViewportTop] = useState<number>(0);
  const [minimapViewportHeight, setMinimapViewportHeight] = useState<number>(
    100
  );
  const basicModalRef = useRef<BasicModalRef>(null);

  useEffect(() => {
    if (
      props.debateName === "sample" ||
      props.debateName === "기본소득" ||
      props.debateName === "정시확대" ||
      props.debateName === "모병제" ||
      props.debateName === "기본소득clipped" ||
      props.debateName === "정시확대clipped" ||
      props.debateName === "모병제clipped" ||
      props.debateName === "집값" ||
      props.debateName === "정년연장"
    ) {
      const utteranceObjects: UtteranceObject[] = require(`../../../data/${props.debateName}/utterance_objects.json`);
      const totalSentenceObjects: SentenceObject[] = [];

      // make totalSentenceObjects
      _.forEach(utteranceObjects, (utteranceObject, utteranceIndex) => {
        _.forEach(
          utteranceObject.sentenceObjects,
          (sentenceObject, sentenceIndex) => {
            totalSentenceObjects.push(sentenceObject);
          }
        );
      });

      // make utterance_index => sentence_index => total_sentence_index
      const utteranceIndexSentenceIndexTotalSentenceIndexDict: UtteranceIndexSentenceIndexTotalSentenceIndexDict = {};
      let totalSentenceIndex: number = 0;
      _.forEach(utteranceObjects, (utteranceObject, utteranceIndex) => {
        utteranceIndexSentenceIndexTotalSentenceIndexDict[utteranceIndex] = {};
        _.forEach(
          utteranceObject.sentenceObjects,
          (sentenceObject, sentenceIndex) => {
            utteranceIndexSentenceIndexTotalSentenceIndexDict[utteranceIndex][
              sentenceIndex
            ] = totalSentenceIndex;
            totalSentenceIndex++;
          }
        );
      });

      const participants: Participant[] = makeParticipants(
        props.debateName,
        utteranceObjects
      );

      const participantDict: ParticipantDict = _.keyBy(
        participants,
        (participant) => participant.name
      );

      setUtteranceObjects(utteranceObjects);
      setTotalSentenceObjects(totalSentenceObjects);

      const checkboxes = new Array<boolean>(totalSentenceObjects.length).fill(
        false
      );
      _.forEach(sentenceIndexesOfSegments, (totalSentenceIndex) => {
        checkboxes[totalSentenceIndex] = true;
      });

      setCheckboxes(checkboxes);
      setUtteranceIndexSentenceIndexTotalSentenceIndexDict(
        utteranceIndexSentenceIndexTotalSentenceIndexDict
      );
      setParticipantDict(participantDict);

      console.log("totalSentenceObjects", totalSentenceObjects);
      console.log(
        "utteranceIndexSentenceIndexTotalSentenceIndexDict",
        utteranceIndexSentenceIndexTotalSentenceIndexDict
      );
    }
  }, []);

  useImperativeHandle(ref, () => ({
    totalSentenceObjects,
    bodyTextContainerRef,
    sentenceIndexesOfSegments,
  }));

  return (
    <div className={styles.component}>
      <div style={{ height: 50, display: "flex" }}>
        <div className={styles.guideContainer}>
          <div className={styles.guideText}>
            주제를 분리할 곳에 체크박스 표시해주세요.
          </div>
          <div className={styles.guideText}>
            {`분리된 주제의 수: ${sentenceIndexesOfSegments.length}개 `}
          </div>
        </div>
        <div
          style={{
            width: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip placement="left" title={"결과물 제출하기"}>
            <Button
              onClick={() => {
                if (
                  sentenceIndexesOfSegments[
                    sentenceIndexesOfSegments.length - 1
                  ] ===
                  totalSentenceObjects.length - 1
                ) {
                  basicModalRef.current!.openModal({
                    title: "제출",
                    text:
                      "현재 분리된 주제 결과들로 결과물을 제출하시겠습니까?",
                    okListener: () => {
                      return new Promise((resolve, reject) => {
                        const subjectRecordInTesting: SubjectRecordInTesting = {
                          ...locationState,
                          debateName: debateNameOfQuery,
                          sentenceIndexesOfSegments,
                        };

                        submitTestResult(subjectRecordInTesting)
                          .then(() => {
                            resolve("ok");
                            history.push("/subject-test-end");
                          })
                          .catch((error) => {
                            basicModalRef.current!.openModal({
                              title: "제출 실패",
                              text: `서버와 통신이 되지 않습니다. 이 오류를 복사해서 담당연구자에게 보내주시면 감사하겠습니다. 주제 분리 결과 : ${sentenceIndexesOfSegments.toString()}`,
                              okListener: null,
                            });
                            console.log("server error", error);
                          });
                      });
                    },
                  });
                } else {
                  basicModalRef.current!.openModal({
                    title: "경고",
                    text:
                      "대본 마지막까지 주제 분리해 주세요!\n (대본 마지막까지 색칠되어야 합니다)",
                    okListener: () => {},
                  });
                }
              }}
              type="primary"
            >
              제출하기
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className={styles.transcriptContainer}>
        <div
          ref={bodyTextContainerRef}
          className={styles.bodyTextContainer}
          onScroll={_.debounce(() => {
            const dataSetOfSentence = getSentenceDataSetAtViewport(
              bodyTextContainerRef
            );
            const dataSetOfSentenceInMinimap = findSameSentenceAndApplyScrollTopAtMinimap(
              minimapRef,
              dataSetOfSentence.firstSentenceInViewport,
              dataSetOfSentence.firstSentenceOverViewport
            );
            setMinimapViewportTop(dataSetOfSentenceInMinimap.firstSentenceTop);
            const minimapViewportHeight =
              dataSetOfSentenceInMinimap.lastSentenceTop -
              dataSetOfSentenceInMinimap.firstSentenceTop;
            setMinimapViewportHeight(minimapViewportHeight);
          }, 50)}
        >
          {_.map(utteranceObjects, (utteranceObject, utteranceIndex) => {
            const lastSentenceIndexInUtterance =
              utteranceIndexSentenceIndexTotalSentenceIndexDict[utteranceIndex][
                utteranceObject.sentenceObjects.length - 1
              ];

            return (
              <div key={`utterance-${utteranceIndex}`} style={{ width: 392 }}>
                <div>
                  <span
                    style={{
                      color: participantDict[utteranceObject.name].color,
                    }}
                  >
                    {utteranceObject.name}
                  </span>
                  <span>{` (${utteranceObject.sentenceObjects[0].time} ~ ${
                    utteranceObject.sentenceObjects[
                      utteranceObject.sentenceObjects.length - 1
                    ].time
                  })`}</span>
                  {/* {`${utteranceObject.name} (${utteranceObject.sentenceObjects[0].time})`} */}
                </div>
                {_.map(
                  utteranceObject.sentenceObjects,
                  (sentenceObject, sentenceIndex) => {
                    if (
                      sentenceIndex <
                      utteranceObject.sentenceObjects.length - 1
                    ) {
                      const totalSentenceIndex =
                        utteranceIndexSentenceIndexTotalSentenceIndexDict[
                          utteranceIndex
                        ][sentenceIndex];
                      return (
                        <span
                          key={`sentence-${utteranceIndex}-${sentenceIndex}`}
                        >
                          <span
                            style={{
                              backgroundColor: makeBodyTextBackgroundColor(
                                totalSentenceIndex,
                                sentenceIndexesOfSegments
                              ),
                            }}
                          >
                            {sentenceObject.sentence}
                            {/* {`${sentenceObject.sentence}(${sentenceObject.time})`} */}
                          </span>
                          <Checkbox
                            checked={checkboxes[totalSentenceIndex]}
                            onChange={(event) => {
                              checkboxes[totalSentenceIndex] =
                                event.target.checked;
                              setCheckboxes(checkboxes);

                              const sentenceIndexesOfSegments: number[] = [];
                              _.forEach(
                                checkboxes,
                                (checkbox, checkboxIndex) => {
                                  if (checkbox) {
                                    sentenceIndexesOfSegments.push(
                                      checkboxIndex
                                    );
                                  }
                                }
                              );
                              setSentenceIndexesOfSegments(
                                sentenceIndexesOfSegments
                              );
                            }}
                            style={{ marginRight: 8 }}
                          ></Checkbox>
                        </span>
                      );
                    } else {
                      const totalSentenceIndex =
                        utteranceIndexSentenceIndexTotalSentenceIndexDict[
                          utteranceIndex
                        ][utteranceObject.sentenceObjects.length - 1];
                      return (
                        <span
                          key={`sentence-${utteranceIndex}-${sentenceIndex}`}
                        >
                          <span
                            style={{
                              backgroundColor: makeBodyTextBackgroundColor(
                                totalSentenceIndex,
                                sentenceIndexesOfSegments
                              ),
                            }}
                          >
                            {sentenceObject.sentence}
                            {/* {`${sentenceObject.sentence}(${sentenceObject.time})`} */}
                          </span>
                        </span>
                      );
                    }
                  }
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Checkbox
                    checked={checkboxes[lastSentenceIndexInUtterance]}
                    onChange={(event) => {
                      checkboxes[lastSentenceIndexInUtterance] =
                        event.target.checked;
                      setCheckboxes(checkboxes);

                      const sentenceIndexesOfSegments: number[] = [];
                      _.forEach(checkboxes, (checkbox, checkboxIndex) => {
                        if (checkbox) {
                          sentenceIndexesOfSegments.push(checkboxIndex);
                        }
                      });
                      setSentenceIndexesOfSegments(sentenceIndexesOfSegments);
                    }}
                    style={{ marginTop: 8, marginBottom: 8 }}
                  ></Checkbox>
                </div>
              </div>
            );
          })}

          {/* <div style={{ display: "flex", justifyContent: "center" }}>
            <Button>
              제출하기
            </Button>
          </div> */}
        </div>

        <div className={styles.minimap} ref={minimapRef}>
          <div>
            {_.map(utteranceObjects, (utteranceObject, utteranceIndex) => {
              return (
                <div
                  key={`utterance-${utteranceIndex}`}
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      color: participantDict[utteranceObject.name].color,
                    }}
                  >
                    {utteranceObject.name}
                  </div>
                  {_.map(
                    utteranceObject.sentenceObjects,
                    (sentenceObject, sentenceIndex) => {
                      const totalSentenceIndex =
                        utteranceIndexSentenceIndexTotalSentenceIndexDict[
                          utteranceIndex
                        ][sentenceIndex];
                      return (
                        <span
                          key={`sentence-${utteranceIndex}-${sentenceIndex}`}
                        >
                          <span
                            style={{
                              backgroundColor: makeBodyTextBackgroundColorInMinimap(
                                totalSentenceIndex,
                                sentenceIndexesOfSegments
                              ),
                            }}
                          >
                            {sentenceObject.sentence}
                          </span>
                        </span>
                      );
                    }
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 2,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              top: minimapViewportTop,
              left: 0,
              width: "100%",
              // height: minimapViewportHeight,
              height: 300,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          ></div>
        </div>
      </div>

      <BasicModal ref={basicModalRef}></BasicModal>
    </div>
  );
}

export default forwardRef(TestTranscriptComponent);
