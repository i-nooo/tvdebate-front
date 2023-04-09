/* eslint-disable no-unused-vars */
import { Image } from "antd";
import Title from "antd/lib/typography/Title";
import React, { Ref, useEffect, useImperativeHandle, useRef } from "react";
import VideoPlayer, {
  VideoPlayerRef,
} from "../../views/VideoSubjectTest/VideoPlayer/VideoPlayer";
import styles from "./TestDescriptionContent.module.scss";

interface ComponentProps {}

export interface TestDescriptionContentRef {
  pauseVideo: () => void;
}

function TestDescription(
  props: ComponentProps,
  ref: Ref<TestDescriptionContentRef>
) {
  useEffect(() => {}, []);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  // useImperativeHandle(ref, () => ({
  //   pauseVideo: () => {
  //     videoPlayerRef.current!.pause();
  //   },
  // }));

  return <div className={styles.component}></div>;
}

export default TestDescription;
