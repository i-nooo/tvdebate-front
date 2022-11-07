/* eslint-disable no-unused-vars */
/**
 * Utility Functions in TestSubjects
 */

import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import $ from "jquery";
require("jquery-ui-bundle");
import { SubjectRecordInTesting } from "../ConceptualRecurrencePlot/interfaces";
import { SentenceObject } from "../../interfaces/DebateDataInterface";

/**
 *
 * @param currentSentenceIndex : sentenceIndex in totalSentenceIndexes
 * @param sentenceIndexesOfSegments
 */
export function makeBodyTextBackgroundColor(
  currentSentenceIndex: number,
  sentenceIndexesOfSegments: number[]
): string {
  // TODO find the segmentIndex by sentenceIndex & sentenceIndexesOfSegments
  const segmentIndex = _.findIndex(
    sentenceIndexesOfSegments,
    (sentenceIndexOfSegment) => currentSentenceIndex <= sentenceIndexOfSegment
  );

  const refinedSegmentIndex: number = segmentIndex % 7;

  let backgroundColor: string = "white";

  switch (refinedSegmentIndex) {
    case 0:
      backgroundColor = "#f7d0d0";
      break;
    case 1:
      backgroundColor = "#f4f4d0";
      break;
    case 2:
      backgroundColor = "#d0f4f4";
      break;
    case 3:
      backgroundColor = "#f2d0f4";
      break;
    case 4:
      backgroundColor = "#f4e3d0";
      break;
    case 5:
      backgroundColor = "#d0f4d0";
      break;
    case 6:
      backgroundColor = "#d0d7f4";
      break;
  }

  return backgroundColor;
}

export function makeBodyTextBackgroundColorInMinimap(
  currentSentenceIndex: number,
  sentenceIndexesOfSegments: number[]
): string {
  // TODO find the segmentIndex by sentenceIndex & sentenceIndexesOfSegments
  const segmentIndex = _.findIndex(
    sentenceIndexesOfSegments,
    (sentenceIndexOfSegment) => currentSentenceIndex <= sentenceIndexOfSegment
  );

  const refinedSegmentIndex: number = segmentIndex % 7;

  let backgroundColor: string = "white";

  switch (refinedSegmentIndex) {
    case 0:
      backgroundColor = "#ef5656";
      break;
    case 1:
      backgroundColor = "#efe856";
      break;
    case 2:
      backgroundColor = "#56efd2";
      break;
    case 3:
      backgroundColor = "#ef56d9";
      break;
    case 4:
      backgroundColor = "#efb456";
      break;
    case 5:
      backgroundColor = "#6def56";
      break;
    case 6:
      backgroundColor = "#567fef";
      break;
  }

  return backgroundColor;
}

export function submitTestResult(
  subjectRecordInTesting: SubjectRecordInTesting
): Promise<AxiosResponse<any>> {
  return new Promise((resolve, reject) => {
    // request 'create record' in database
    axios
      .post(
        "http://hapsoa.iptime.org:3001/subject-data",
        subjectRecordInTesting
      )
      .then((response) => {
        console.log("resposne", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("error", error);
        reject(error);
      });
  });

  // axios
  //   .get("http://hapsoa.iptime.org:3001")
  //   .then((result) => {
  //     console.log("result", result);
  //   })
  //   .catch((error) => {
  //     console.error("error", error);
  //   });
}

export function getSentenceDataSetAtViewport(
  bodyTextContainerRef: React.RefObject<HTMLDivElement>
) {
  const scrollTop = $(window).scrollTop() as number;
  const windowHeight = $(window).height() as number;

  const $spans = $<HTMLSpanElement>(
    `.${bodyTextContainerRef.current!.className} > div > span`
  );

  let firstSentenceInViewport: string = "";
  let firstSentenceOverViewport: string = "";
  _.forEach($spans, (span, spanIndex) => {
    const $span = $(span);
    if (
      $span.offset()!.top >= scrollTop &&
      $span.is(":visible") &&
      firstSentenceInViewport === ""
    ) {
      firstSentenceInViewport = $span.text();
    }

    if (
      $span.offset()!.top >= scrollTop + windowHeight &&
      $span.is(":visible")
    ) {
      firstSentenceOverViewport = $span.text();

      return false;
    }

    if (spanIndex === $spans.length - 1 && firstSentenceOverViewport === "") {
      firstSentenceOverViewport = $span.text();
    }
  });

  return { firstSentenceInViewport, firstSentenceOverViewport };
}

export function findSameSentenceAndApplyScrollTopAtMinimap(
  minimapRef: React.RefObject<HTMLDivElement>,
  firstSentence: string,
  lastSentence: string
) {
  const $minimapSpans = $<HTMLSpanElement>(
    `.${minimapRef.current!.className} > div > div> span`
  );

  let firstSentenceTop: number = 0;
  let firstSentenceIndex: number = Number.MAX_VALUE;
  let lastSentenceTop: number = 0;
  let movingTopInMinimap: number = 0;

  // for bug fix
  $(minimapRef.current!).scrollTop(0);
  //
  _.forEach($minimapSpans, (minimapSpan, minimapSpanIndex) => {
    const $minimapSpan = $(minimapSpan);
    const scale = 10;

    if ($minimapSpan.text() === firstSentence) {
      firstSentenceTop = $minimapSpan.position()!.top * scale;
      firstSentenceIndex = minimapSpanIndex;
    }

    if (
      $minimapSpan.text() === lastSentence &&
      minimapSpanIndex > firstSentenceIndex
    ) {
      lastSentenceTop = $minimapSpan.position()!.top * scale;

      movingTopInMinimap =
        firstSentenceTop -
        minimapRef.current!.clientHeight / 2 +
        (lastSentenceTop - firstSentenceTop) / 2;

      // TODO why this code is in this function?
      $(minimapRef.current!).scrollTop(movingTopInMinimap);
      return false;
    }
  });

  return { firstSentenceTop, lastSentenceTop };
}

export function applyScrollTopAtTranscript(
  videoCurrentSecondTime: number,
  totalSentenceObjects: SentenceObject[],
  bodyTextContainerRef: React.RefObject<HTMLDivElement>,
  sentenceIndexesOfSegments: number[]
) {
  // find most transcript of nearest time
  //
  // times = []
  // for each sentenceObject in totalSentenceObjects
  //   times.push(sentenceObject.time)
  //
  // for time in times
  //   diffs.push(Math.abs(time - currentSecondTime))
  //
  // min = _.min(diffs)
  // minIndex = _.findIndex(diffs, diff => diff === min)
  //
  // theSentenceObject = totalSentenceObjects[minIndex]
  //
  // for each $span in $spans
  //   if theSentenceObject.sentence === $span.text()
  //      (transcriptRef).animate.scrollTop = $span.scrollTop
  //      break
  //

  const secondTimes: number[] = _.map(
    totalSentenceObjects,
    (sentenceObject) => {
      return vrewTimeToSeconds(sentenceObject.time!);
    }
  );

  const diffs = _.map(secondTimes, (secondTime) => {
    // return Math.abs(videoCurrentSecondTime - secondTime);

    if (videoCurrentSecondTime - secondTime >= 0) {
      return videoCurrentSecondTime - secondTime;
    } else {
      return Number.POSITIVE_INFINITY;
    }
  });

  const min = _.min(diffs);
  const minIndex = _.findIndex(diffs, (diff) => diff === min);

  const theSentenceObject = totalSentenceObjects[minIndex];

  const $spans = $<HTMLSpanElement>(
    `.${bodyTextContainerRef.current!.className} > div > span`
  );

  const $bodyTextContainer = $(bodyTextContainerRef.current!);
  $bodyTextContainer.scrollTop(0);

  // console.log("totalSentenceObjects", totalSentenceObjects.length);
  // console.log("$spans", $spans);

  const $theSpan = $($spans[minIndex]);
  $bodyTextContainer.scrollTop(
    $theSpan.position().top - bodyTextContainerRef.current!.clientHeight / 2
  );

  const children = $theSpan.children("span");
  const pastBackgroundColor = makeBodyTextBackgroundColor(
    minIndex,
    sentenceIndexesOfSegments
  );

  children.css("background-color", "#aaaaaa");
  children
    .stop(true, false)
    .animate({ "background-color": pastBackgroundColor }, 1000);

  // _.forEach($spans, (span, spanIndex) => {
  //   const $span = $(span);
  //   if (theSentenceObject.sentence === $span.text()) {
  //     $bodyTextContainer.scrollTop(
  //       $span.position().top - bodyTextContainerRef.current!.clientHeight / 2
  //     );

  //     // const parent = $span.parent();
  //     // parent.css("background-color", "#aaaaaa");
  //     // parent.animate({ "background-color": "none" }, 1000);

  //     const children = $span.children("span");
  //     children.css("background-color", "#aaaaaa");
  //     children.stop(true, false).animate({ "background-color": "none" }, 1000);

  //     // $(bodyTextContainerRef.current!).animate(
  //     //   {
  //     //     scrollTop: $span.position().top,
  //     //   },
  //     //   500
  //     // );

  //     return false;
  //   }
  // });
}

function vrewTimeToSeconds(vrewTime: string): number {
  const splittedTime = vrewTime.split(":");

  const hour = Number(splittedTime[0]);
  const minute = Number(splittedTime[1]);
  const second = Number(splittedTime[2]);

  let seconds = 0;

  seconds += second;
  seconds += minute * 60;
  seconds += hour * 60 * 60;

  return seconds;
}
