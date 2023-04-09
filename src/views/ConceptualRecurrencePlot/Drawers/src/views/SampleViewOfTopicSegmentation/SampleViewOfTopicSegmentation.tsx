/* eslint-disable no-unused-vars */
import { Checkbox } from "antd";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ParticipantDict } from "../../common_functions/makeParticipants";
import {
  SentenceObject,
  UtteranceObject,
} from "../../interfaces/DebateDataInterface";
import { UtteranceIndexSentenceIndexTotalSentenceIndexDict } from "../ConceptualRecurrencePlot/interfaces";
import {
  getSentenceDataSetAtViewport,
  findSameSentenceAndApplyScrollTopAtMinimap,
  makeBodyTextBackgroundColor,
} from "../TranscriptSubjectTest/TestSubjectsFunctions";
import styles from "./SampleViewOfTopicSegmentation.module.scss";

interface ComponentProps {}

function SampleViewOfTopicSegmentation(props: ComponentProps) {
  const [utteranceObjects, setUtteranceObjects] = useState<UtteranceObject[]>(
    []
  );
  const [participantDict, setParticipantDict] = useState<ParticipantDict>({});
  // const [totalSentenceObjects, setTotalSentenceObjects] = useState<
  //   SentenceObject[]
  // >([]);
  const [sentenceIndexesOfSegments, setSentenceIndexesOfSegments] = useState<
    number[]
  >([]);
  const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
  const [
    utteranceIndexSentenceIndexTotalSentenceIndexDict,
    setUtteranceIndexSentenceIndexTotalSentenceIndexDict,
  ] = useState<UtteranceIndexSentenceIndexTotalSentenceIndexDict>({});
  const bodyTextContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sampleName: string = "sample_4";

    if (
      sampleName === "sample_1" ||
      sampleName === "sample_2" ||
      sampleName === "sample_3" ||
      sampleName === "sample_4"
    ) {
      const utteranceObjects: UtteranceObject[] = require(`../../data/test_description_samples/${sampleName}.json`);
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

      const colorDictionary: { [index: number]: string } = {
        0: "#C941AF",
        1: "#C98E41",
        2: "#4161C9",
        3: "#41C9C9",
        4: "#333333",
      };

      const participantDict: ParticipantDict = {
        정영진: {
          name: "정영진",
          color: "#C941AF",
          team: 1,
        },
        박연미: {
          name: "박연미",
          color: "#4161C9",
          team: 2,
        },
        사회자: {
          name: "사회자",
          color: "#333333",
          team: -1,
        },
        이지만: {
          name: "이지만",
          color: "#C98E41",
          team: 1,
        },
        김범중: {
          name: "김범중",
          color: "#41C9C9",
          team: 2,
        },
      };

      setUtteranceObjects(utteranceObjects);
      setCheckboxes(
        new Array<boolean>(totalSentenceObjects.length).fill(false)
      );
      setUtteranceIndexSentenceIndexTotalSentenceIndexDict(
        utteranceIndexSentenceIndexTotalSentenceIndexDict
      );
      setParticipantDict(participantDict);
    }
  }, []);

  return (
    <div className={styles.component}>
      <div ref={bodyTextContainerRef} className={styles.bodyTextContainer}>
        <div className={styles.omitting}>······</div>
        {_.map(utteranceObjects, (utteranceObject, utteranceIndex) => {
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
                {/* <span>{` (${utteranceObject.sentenceObjects[0].time} ~ ${
                  utteranceObject.sentenceObjects[
                    utteranceObject.sentenceObjects.length - 1
                  ].time
                })`}</span> */}
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
                      <span key={`sentence-${utteranceIndex}-${sentenceIndex}`}>
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
                          onChange={(event) => {
                            checkboxes[totalSentenceIndex] =
                              event.target.checked;
                            setCheckboxes(checkboxes);

                            const sentenceIndexesOfSegments: number[] = [];
                            _.forEach(checkboxes, (checkbox, checkboxIndex) => {
                              if (checkbox) {
                                sentenceIndexesOfSegments.push(checkboxIndex);
                              }
                            });
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
                      <span key={`sentence-${utteranceIndex}-${sentenceIndex}`}>
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

        <div className={styles.omitting}>······</div>
      </div>
    </div>
  );
}

export default SampleViewOfTopicSegmentation;
