/* eslint-disable no-unused-vars */
import { Button, Checkbox } from "antd";
import { changeConfirmLocale } from "antd/lib/modal/locale";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  makeParticipants,
  Participant,
  ParticipantDict,
} from "../../common_functions/makeParticipants";
import {
  SentenceObject,
  UtteranceObject,
} from "../../interfaces/DebateDataInterface";
import { DebateName } from "../ConceptualRecurrencePlot/DataImporter";
import {
  findSameSentenceAndApplyScrollTopAtMinimap,
  getSentenceDataSetAtViewport,
  makeBodyTextBackgroundColor,
  makeBodyTextBackgroundColorInMinimap,
  submitTestResult,
} from "./TestSubjectsFunctions";
import styles from "./TranscriptSubjectTest.module.scss";
import {
  SubjectRecordInTesting,
  UtteranceIndexSentenceIndexTotalSentenceIndexDict,
} from "../ConceptualRecurrencePlot/interfaces";

interface ComponentProps {}

function TranscriptSubjectTest(props: ComponentProps) {
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

  useEffect(() => {
    if (
      debateNameOfQuery === "sample" ||
      debateNameOfQuery === "기본소득" ||
      debateNameOfQuery === "기본소득clipped" ||
      debateNameOfQuery === "정시확대" ||
      debateNameOfQuery === "모병제"
    ) {
      // const dataImporter = new DataImporter(debateNameOfQuery, "single_term");

      const utteranceObjects: UtteranceObject[] = require(`../../data/${debateNameOfQuery}/utterance_objects.json`);
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
        debateNameOfQuery,
        utteranceObjects
      );
      const participantDict: ParticipantDict = _.keyBy(
        participants,
        (participant) => participant.name
      );

      setUtteranceObjects(utteranceObjects);
      setTotalSentenceObjects(totalSentenceObjects);
      setCheckboxes(
        new Array<boolean>(totalSentenceObjects.length).fill(false)
      );
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

  return (
    <div
      className={styles.component}
      onScroll={() => {
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
      }}
    >
      <div className={styles.simpleGuideContainer}>
        <div className={styles.guideText}>
          주제를 분리할 곳에 체크박스 표시해주세요.
        </div>
        <div className={styles.guideText}>
          직접 토론을 시청하길 원하신다면 공개된{" "}
          <a
            href="https://www.youtube.com/watch?v=zBcLKV0nh6Y&t=1344s"
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
            rel="noopener noreferrer"
          >
            유튜브 채널
          </a>
          에서 시청하실 수 있습니다.
        </div>
      </div>

      <div className={styles.bodyContainer}>
        <div style={{ flex: 1 }}></div>
        <div className={styles.bodyTextContainer} ref={bodyTextContainerRef}>
          {_.map(utteranceObjects, (utteranceObject, utteranceIndex) => {
            return (
              <div key={`utterance-${utteranceIndex}`} style={{ width: 440 }}>
                <div
                  style={{ color: participantDict[utteranceObject.name].color }}
                >
                  {utteranceObject.name}
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
                          </span>
                          <Checkbox
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
                          </span>
                        </span>
                      );
                    }
                  }
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Checkbox
                    onChange={(event) => {
                      const totalSentenceIndex =
                        utteranceIndexSentenceIndexTotalSentenceIndexDict[
                          utteranceIndex
                        ][utteranceObject.sentenceObjects.length - 1];
                      checkboxes[totalSentenceIndex] = event.target.checked;
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
        </div>
        <div style={{ flex: 1 }}></div>
      </div>

      {/* <Button
        onClick={() => {
          console.log("checkboxes", checkboxes);
        }}
      >
        show checkboxes
      </Button>
      <Button
        onClick={() => {
          console.log("sentenceIndexesOfSegments", sentenceIndexesOfSegments);
        }}
      >
        show sentenceIndexesOfSegments
      </Button> */}

      <div className={styles.buttonsContainerToSubmit}>
        <Button
          onClick={() => {
            //
          }}
          style={{
            marginRight: 16,
          }}
        >
          취소
        </Button>
        <Button
          onClick={() => {
            //
          }}
          style={{
            marginRight: 16,
          }}
        >
          초기화
        </Button>
        <Button
          onClick={() => {
            const subjectRecordInTesting: SubjectRecordInTesting = {
              ...locationState,
              debateName: debateNameOfQuery,
              sentenceIndexesOfSegments,
            };

            submitTestResult(subjectRecordInTesting);
          }}
          style={{
            marginRight: 16,
          }}
        >
          제출하기
        </Button>
      </div>

      <div></div>

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
                      <span key={`sentence-${utteranceIndex}-${sentenceIndex}`}>
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

      <div className={styles.segmentCountStatus}>
        분리된 주제의 수 : {sentenceIndexesOfSegments.length}개
      </div>
    </div>
  );
}

export default TranscriptSubjectTest;
