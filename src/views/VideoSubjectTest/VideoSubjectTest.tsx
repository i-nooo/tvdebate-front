/* eslint-disable no-unused-vars */
import Title from "antd/lib/typography/Title";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { DebateName } from "../ConceptualRecurrencePlot/DataImporter";
import styles from "./VideoSubjectTest.module.scss";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import { Button, Tooltip } from "antd";
import VideoPlayer, { VideoPlayerRef } from "./VideoPlayer/VideoPlayer";
import TestTranscriptComponent, {
  TestTranscriptComponentRef,
} from "./TestTranscriptComponent/TestTranscriptComponent";
import { applyScrollTopAtTranscript } from "../TranscriptSubjectTest/TestSubjectsFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faQuestion,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import DescriptionModal, {
  DescriptionModalRef,
} from "./DescriptionModal/DescriptionModal";

interface ComponentProps {}

function VideoSubjectTest(props: ComponentProps) {
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const debateNameOfQuery = query.get("debate_name") as DebateName;
  const locationState = useLocation<{
    ageGroup: string;
    gender: string;
    major: string;
    participationCode: string;
  }>().state;

  const leftPartRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const transcriptWithCheckboxRef = useRef<TestTranscriptComponentRef>(null);
  const descriptionModalRef = useRef<DescriptionModalRef>(null);

  const [debateOriginalTitle, setDebateOriginalTitle] = useState<string>("");

  useEffect(() => {
    console.log("locationState", locationState);
    if (
      !locationState ||
      locationState.ageGroup === "" ||
      locationState.gender === "" ||
      locationState.major === "" ||
      locationState.participationCode === ""
    ) {
      history.push("/description-for-manual-topic-segmentation");
    }

    switch (debateNameOfQuery) {
      case "기본소득":
        setDebateOriginalTitle("'기본소득' 시대, 과연 올까?");
        break;
      case "기본소득clipped":
        setDebateOriginalTitle("'기본소득' 시대, 과연 올까?");
        break;
      case "정시확대":
        setDebateOriginalTitle("'정시 확대' 논란, 무엇이 공정한가");
        break;
      case "정시확대clipped":
        setDebateOriginalTitle("'정시 확대' 논란, 무엇이 공정한가");
        break;
      case "모병제":
        setDebateOriginalTitle("다시 불거진 '모병제' 논란");
        break;
      case "모병제clipped":
        setDebateOriginalTitle("다시 불거진 '모병제' 논란");
        break;
      case "집값":
        setDebateOriginalTitle("집 값, 과연 이번엔 잡힐까?");
        break;
      case "정년연장":
        setDebateOriginalTitle("'정년 연장' 고령화 해법인가, 세대 갈등인가");
        break;
    }
  }, []);

  return (
    <div className={styles.component}>
      <div className={styles.leftPart} ref={leftPartRef}>
        <div className={styles.headline}>
          {/* <Title level={2} className={styles.title}>
            주제 분리 실험
          </Title> */}
          {/* <div className={styles.title}>실험 중</div> */}
          <div className={styles.title}>{debateOriginalTitle}</div>

          <Tooltip placement="right" title={"실험 설명문 다시보기"}>
            <Button
              shape="circle"
              size="small"
              type="dashed"
              className={styles.questionButton}
              onClick={() => {
                descriptionModalRef.current!.openModal({
                  title: "실험 설명문",
                  text: "",
                  okListener: () => {},
                });
              }}
            >
              <FontAwesomeIcon
                icon={faQuestion}
                className={styles.questionIcon}
              />
            </Button>
          </Tooltip>
          <DescriptionModal
            ref={descriptionModalRef}
            height={
              leftPartRef.current
                ? leftPartRef.current!.clientHeight - 300
                : 600
            }
          ></DescriptionModal>
        </div>
        <div style={{ width: "100%" }}>
          <VideoPlayer
            ref={videoPlayerRef}
            name={debateNameOfQuery}
          ></VideoPlayer>
          {/* <video controls width="98%">
            <source src="http://localhost:3001/video" type="video/mp4"></source>
            Sorry, your browser does not support embedded videos.
          </video> */}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* Scroll Button */}
          <Button
            shape="circle"
            size="large"
            style={{
              marginTop: 16,
              marginRight: 16,
              padding: 0,
              color: "#ffffff",
              borderColor: "#aaaaaa",
              backgroundColor: "#aaaaaa",
            }}
            onClick={() => {
              applyScrollTopAtTranscript(
                videoPlayerRef.current!.getVideoCurrentSecondTime(),
                transcriptWithCheckboxRef.current!.totalSentenceObjects,
                transcriptWithCheckboxRef.current!.bodyTextContainerRef,
                transcriptWithCheckboxRef.current!.sentenceIndexesOfSegments
              );
            }}
          >
            <svg width={40} style={{ fill: "#ffffff" }}>
              <g
                style={{
                  transform: "scale(0.4) translate(0px, -2px)",
                  // transformOrigin: "0 0",
                }}
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M32,41v18c0,9.9,8.1,18,18,18c9.9,0,18-8.1,18-18V41c0-9.9-8.1-18-18-18C40.1,23,32,31.1,32,41z M50,27c7.7,0,14,6.3,14,14  v18c0,7.7-6.3,14-14,14s-14-6.3-14-14V41C36,33.3,42.3,27,50,27z"
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M50,44c1.1,0,2-0.9,2-2v-6c0-1.1-0.9-2-2-2s-2,0.9-2,2v6C48,43.1,48.9,44,50,44z"
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M48.6,92.4C49,92.8,49.5,93,50,93s1-0.2,1.4-0.6l5-5c0.8-0.8,0.8-2,0-2.8s-2-0.8-2.8,0L50,88.2l-3.6-3.6  c-0.8-0.8-2-0.8-2.8,0c-0.8,0.8-0.8,2,0,2.8L48.6,92.4z"
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M48.6,7.6l-5,5c-0.8,0.8-0.8,2,0,2.8C44,15.8,44.5,16,45,16s1-0.2,1.4-0.6l3.6-3.6l3.6,3.6C54,15.8,54.5,16,55,16  s1-0.2,1.4-0.6c0.8-0.8,0.8-2,0-2.8l-5-5C50.6,6.8,49.4,6.8,48.6,7.6z"
                />
              </g>
            </svg>
          </Button>
        </div>
      </div>
      <div className={styles.rightPart}>
        <TestTranscriptComponent
          ref={transcriptWithCheckboxRef}
          debateName={debateNameOfQuery}
        ></TestTranscriptComponent>
      </div>
    </div>
  );
}

export default VideoSubjectTest;
