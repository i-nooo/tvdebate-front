/* eslint-disable no-unused-vars */
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./VideoPlayer.module.scss";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import { useLocation } from "react-router-dom";
import { DebateName } from "../../ConceptualRecurrencePlot/DataImporter";

interface ComponentProps {
  name: DebateName | "test_ui_introduction";
  width?: number;
}

export interface VideoPlayerRef {
  getVideoCurrentSecondTime: () => number;
  pause: () => void;
}

function VideoPlayer(props: ComponentProps, ref: Ref<VideoPlayerRef>) {
  const [videoJsPlayer, setVideoJsPlayer] = useState<VideoJsPlayer>();
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout>();
  const [videoSecondTime, setVideoSecondTime] = useState<number>(0);

  const componentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoJsOptions: VideoJsPlayerOptions = {
      autoplay: false,
      controls: true,
      sources: [
        {
          src: `http://hapsoa.iptime.org:3001/video?name=${props.name}`,
          type: "video/mp4",
        },
      ],
      width: props.width ? props.width : componentRef.current!.clientWidth - 32,
      // width: 600,
      playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
    };

    const resizeListener = (event: UIEvent) => {
      videoJsPlayer.width(
        props.width ? props.width : componentRef.current!.clientWidth - 32
      );
    };

    const videoJsPlayer = videojs(
      //@ts-ignore
      videoRef.current,
      videoJsOptions,
      function onPlayerReady() {
        console.log("onPlayerReady");
        let isPlaying = false;
        let shiftOn = false;

        // off basic double click listener
        videoJsPlayer.tech().off("dblclick");

        videoJsPlayer.on("keyup", (event: KeyboardEvent) => {
          console.log("keyup", event.code);
          switch (event.code) {
            case "ShiftRight":
              shiftOn = false;
              break;
            case "ShiftLeft":
              shiftOn = false;
              break;
          }
        });

        videoJsPlayer.on("keydown", (event: KeyboardEvent) => {
          // console.log("keydown", event.code);
          const currentPlaybackRate = videoJsPlayer.playbackRate();

          switch (event.code) {
            case "Space":
              if (isPlaying) {
                videoJsPlayer.pause();
              } else {
                videoJsPlayer.play();
              }
              break;
            case "ArrowLeft":
              videoJsPlayer.currentTime(videoJsPlayer.currentTime() - 5);
              break;
            case "ArrowRight":
              videoJsPlayer.currentTime(videoJsPlayer.currentTime() + 5);
              break;
            case "ArrowUp":
              videoJsPlayer.volume(videoJsPlayer.volume() + 0.1);
              break;
            case "ArrowDown":
              videoJsPlayer.volume(videoJsPlayer.volume() - 0.1);
              break;
            case "ShiftRight":
              shiftOn = true;
              break;
            case "ShiftLeft":
              shiftOn = true;
              break;
            case "Period":
              if (shiftOn && currentPlaybackRate < 2) {
                videoJsPlayer.playbackRate(currentPlaybackRate + 0.25);
              }
              break;
            case "Comma":
              if (shiftOn && currentPlaybackRate > 0.75) {
                videoJsPlayer.playbackRate(videoJsPlayer.playbackRate() - 0.25);
              }
              break;
          }
        });

        videoJsPlayer.on("play", () => {
          isPlaying = true;
        });
        videoJsPlayer.on("pause", () => {
          isPlaying = false;
          console.log("puase", videoJsPlayer.currentTime());
        });

        window.addEventListener("resize", resizeListener);
      }
    );

    setVideoJsPlayer(videoJsPlayer);

    // const timeInterval = setInterval(() => {
    //   console.log(
    //     "video current time",
    //     Math.floor(videoJsPlayer.currentTime())
    //   );
    // }, 2000);
    // setTimeInterval(timeInterval);

    return () => {
      console.log("unmount");
      videoJsPlayer.dispose();
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getVideoCurrentSecondTime: () => {
      return videoJsPlayer!.currentTime();
    },
    pause: () => {
      if (videoJsPlayer) {
        videoJsPlayer.currentTime(0);
        videoJsPlayer.pause();
      }
    },
  }));

  return (
    <div className={styles.component} ref={componentRef} data-vjs-palyer>
      <video ref={videoRef} className="video-js" controls></video>
    </div>
  );
}

export default forwardRef(VideoPlayer);
