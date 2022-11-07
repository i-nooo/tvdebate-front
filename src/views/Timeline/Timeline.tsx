/* eslint-disable no-unused-vars */
import React from "react";
// import Button from "react-bootstrap/esm/Button";
import "./Timeline.scss";
import * as d3 from "d3";
import _ from "lodash";

import debateUtterances from "../../data/기본소득/utterance_objects.json";
import { UtteranceObject } from "../../interfaces/DebateDataInterface";
import {
  makeParticipants,
  Participant,
} from "../../common_functions/makeParticipants";
import { useLocation } from "react-router-dom";

interface Pattern {
  name: string;
  isMine: boolean;
  length: number;
  utterance: string;
}

function makeParticipantPatternDictionary(
  debateUtterances: UtteranceObject[],
  participants: Participant[]
) {
  const participantPatternDictionary: {
    [particiapnt: string]: Pattern[];
  } = {};

  _.forEach(participants, (participant) => {
    const patterns: Pattern[] = [];
    let pattern: Pattern = {
      name: participant.name,
      isMine: false,
      length: 0,
      utterance: "",
    };
    _.forEach(debateUtterances, (utterance, index) => {
      if (participant.name === utterance.name) {
        patterns.push(pattern);

        pattern = {
          name: participant.name,
          isMine: true,
          length: 0,
          utterance: "",
        };
        pattern.length += utterance.utterance.length;
        pattern.utterance = utterance.utterance;
        patterns.push(pattern);

        pattern = {
          name: participant.name,
          isMine: false,
          length: 0,
          utterance: "",
        };
      } else {
        pattern.length += utterance.utterance.length;
        if (index === debateUtterances.length - 1) {
          patterns.push(pattern);
        }
      }
    });

    participantPatternDictionary[participant.name] = patterns;
  });

  return participantPatternDictionary;
}

function findPastLength(patterns: Pattern[], index: number): number {
  let pastLength: number = 0;
  for (let i = 0; i < index; i++) {
    pastLength += patterns[i].length;
  }

  return pastLength;
}
//@ts-ignore
const participants = makeParticipants("기본소득", debateUtterances);
// console.log("participants", participants);

const participantPatternDictionary = makeParticipantPatternDictionary(
  //@ts-ignore
  debateUtterances,
  participants
);
// console.log("participantPatternDictionary", participantPatternDictionary);

const agendas: {
  startLength: number;
  topicInfo: string;
}[] = [
  {
    startLength: 500,
    topicInfo: "찬반 of '긴급재난지원금 경제적 효과'",
  },
  {
    startLength: 4120,
    topicInfo: "기본소득 정의 및 평가",
  },
  {
    startLength: 8340,
    topicInfo: "보수진영에서 기본소득이 이슈화된 이유는?",
  },
  {
    startLength: 8850,
    topicInfo: "안심소득 소개 및 이해과정",
  },
  {
    startLength: 10600,
    topicInfo: "찬반(증세 및 조세저항) of '안심소득 vs 기본소득'",
  },
  {
    startLength: 13280,
    topicInfo:
      "찬반(증세,경제 효과) of '안심소득 vs 기본소득' in '이재명 vs 오세훈'",
  },
  {
    startLength: 15670,
    topicInfo: "현실적 방안인지 찬반 of '안심소득 vs 기본소득'",
    // '근로유인, 소득격차줄임, 복지차원'에 대한 관점으로도 논의해야 함 => 증세없이 안심소득으로 위의 사안들을 해결 가능함 => 안심소득이 현실적이다.
  },
  {
    startLength: 19600,
    topicInfo:
      "기본소득, 안심소득의 '기존 복지 제도 통합'에 대해 서로들 오해하고 있음 => 서로 의견 주고 받음..",
  },
  {
    startLength: 22865,
    topicInfo: "시청자 의견 소개",
  },
  {
    startLength: 24020,
    topicInfo: "기본소득의 실현가능성 찬반",
  },
  {
    startLength: 29150,
    topicInfo: "'미래의 노동공급과 생존'에 대한 서로 다른 복지정책의 접근",
  },
  {
    startLength: 30600,
    topicInfo: "기본소득의 근로의욕 반대 의견 및 팩트체크",
  },
];

class Timeline extends React.Component {
  private timelineRef: React.RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);
    this.timelineRef = React.createRef();
  }

  render() {
    return (
      <div className="timeline" ref={this.timelineRef}>
        <div>Timeline</div>
      </div>
    );
  }

  componentDidMount() {
    const timelineDiv = d3.select(".timeline");

    // const clientWidth: number = this.timelineRef.current?.clientWidth as number;
    const clientWidth: number = 7000;

    const svgSelection = timelineDiv
      .append("svg")
      .attr("width", clientWidth)
      .attr("height", 600);

    // draw names of participants
    const nameTextGSelection = svgSelection
      .append("g")
      .attr("class", "name-text-g");
    nameTextGSelection
      .selectAll("text")
      .data(participants)
      .enter()
      .append("text")
      .attr("x", () => 30)
      .attr("y", (d, i) => 30 * i + 30)
      .text((d) => d.name);

    // draw rect of participant pattern
    const totalLength: number = _.sumBy(
      debateUtterances,
      (utteranceObject) => utteranceObject.utterance.length
    );
    const participantNames: string[] = _.map(
      participants,
      (participant) => participant.name
    ).sort();

    _.forEach(participantPatternDictionary, (patterns, participantName) => {
      const participantIndex: number = participantNames.indexOf(
        participantName
      );

      // console.log("participantIndex", participantIndex, patterns);
      const rectGSelection = svgSelection.append("g");
      rectGSelection
        .selectAll("rect")
        .data(patterns)
        .enter()
        .append("rect")
        .attr(
          "x",
          (d, i) => (findPastLength(patterns, i) / totalLength) * clientWidth
        )
        .attr("y", 30 + 30 * participantIndex)
        .attr("width", (d) => (d.length / totalLength) * clientWidth)
        .attr("height", 10)
        .style("fill", (d) =>
          d.isMine ? participants[participantIndex].color : "#cccccc"
        )
        .append("title")
        .text((d) => (d.isMine ? d.name + ": " + d.utterance : ""));
    });

    // draw line of manual topic
    const topiclineGSelection = svgSelection.append("g");
    topiclineGSelection
      .selectAll("line")
      .data(agendas) // length of characters
      .enter()
      .append("line")
      .attr("x1", (d) => (d.startLength / totalLength) * clientWidth)
      .attr("y1", 10)
      .attr("x2", (d) => (d.startLength / totalLength) * clientWidth)
      .attr("y2", 220)
      .style("stroke", "black")
      .style("stroke-width", 3)
      .append("title")
      .text((d) => d.topicInfo);

    // draw topic text
    const topicGSelection = svgSelection.append("g");
    topicGSelection
      .selectAll("text")
      .data(agendas)
      .enter()
      .append("text")
      .attr("x", (d, i) =>
        i + 1 < agendas.length
          ? ((d.startLength + agendas[i + 1].startLength) / 2 / totalLength) *
            clientWidth
          : ((d.startLength + totalLength) / 2 / totalLength) * clientWidth
      )
      .attr("y", 240)
      .text((d) => d.topicInfo)
      .attr("text-anchor", "middle")
      .style("font-size", 13);
  }
}

// export default Timeline;

// eslint-disable-next-line react/display-name
export default () => {
  // console.log(useLocation());
  // console.log(new URLSearchParams(useLocation().search).get("data"));
  return <Timeline></Timeline>;
};
