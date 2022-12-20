// export default class Narrative {}

import React from "react";
// import { Component } from 'vue-property-decorator';
// import contents from '@/data/contents/contents.json';
// import defaultData from '@/data/contents/defaultData.json';
import { useLayoutEffect, useEffect } from "react";
import contents from "../../data/contents/defaultMorphData.json";
import testNetworkData from "../../data/contents/defaultNetworkData.json";

// import contents from '@/views/infovis/studentMorph.json';
// import testNetworkData from '@/views/infovis/studentNetworkData.json';
// import fullscript from '@/views/infovis/studentFullScript.json';

import _ from "lodash";
// import axios from 'axios';
import * as d3 from "d3";
import api from "../../lib";
import { MorphWord } from "../nlp/nlp";

const colors = [
  "#53A4E3",
  "#9B9B9B",
  "#F8BE14",
  "#FF7575",
  "#677686",
  "#FFa834",
  "#677686",
  "#90DAE4",
  "#FF6363",
  "#57915E",
];
function getColor(i: number): string {
  return colors[i % colors.length];
}
const color1 = d3
  .scaleLinear()
  .domain([1, 3])
  //@ts-ignore
  .range(["#d73027", "#1a9850"])
  //@ts-ignore
  .interpolate(d3.interpolateHcl);

export interface Speech {
  text: string;
  index: number;
  name: string;
  morphs: MorphWord[];
}

export interface Point {
  x: number;
  y: number;
  diff: number;
  std: number;
}
export interface SpeechPoint {
  startPoint: Point;
  endPoint: Point;
  point: Point;
  speechs: Speech[];
  size: number;
}
export interface User {
  name: string;
  speechPoints: SpeechPoint[];
  speechs: Speech[];
  path: any;
  validSpeechRanking: number;
  numOfValidSpeech: number;
  validSpeechTime: number;
  tooltipValidSpeechTime: boolean;
  speechTime: number;
  [key: string]: any;
}

interface Topic {
  label: string;
  count: number;
  keywords: Keyword[];
  // selected?: boolean;
}
interface Keyword {
  label: string;
  count: number;
}
interface Script {
  talkerName: string;
  talkerId: string;
  text: string;
  startTime: number;
  endTime: number;
  agenda: number;
}
// Summarnote_API_1.0.pdf 참조 + time 속성 추가
interface ActionItem {
  actionItemId: string; // '1234'
  text: string; // "API스펙 문서 수정",
  who: string; // "이호진",
  when: string; // "2019-03-08"
  time: number; // 시간
  tooltipShown: boolean;
}
interface DisplayKeywordItem {
  label: string;
  barRatio: number;
  count: number;
}
interface DisplayScriptItem {
  profileImage: string;
  talker: string;
  time: string;
  text: string;
}

interface Node {
  id: string;
  label: string;
  size: any; // degree
  count: number;
  color?: any;
  agenda?: number;
  x?: number;
  fixed?: {
    x?: boolean;
    y?: boolean;
  };
}
interface Edge {
  from: string;
  to: string;
  width: number; // 구문분석 weight
  count: number;
  color?: any;
}

interface Image {
  imageId: string;
  url: string;
}

const line = d3
  .line()
  // @ts-ignore
  .x((d) => d.x)
  // @ts-ignore
  .y((d) => d.y)
  .curve(d3.curveBasis);

interface PartialSpeech {
  speechs: number[];
  containUsers: number[];
  topicKeywords: Topic[];
  color: string;
}

// @Component
export default class Narrative {
  public $refs!: { narrativeSvg: HTMLElement };

  public users: User[] = [];
  public testConfGroup: any[] = [];
  public topicGroup: PartialSpeech[] = [];
  public clientWidth: number = 0;
  public seperateCount: number = 50;
  public test: boolean = false;
  public contents: Speech[] = [];
  public meetingId: string = "";
  public uid: string = "";
  public config: any = {};
  // private morphedData: MorphSentence[] = morphedData;
  public totalString: string = "";
  // nodes를 hash 자료구조로 만든 것
  private nodeHash: {
    [id: string]: Node;
  } = {};
  private edgeHash: {
    [index: string]: Edge;
  } = {};

  private ui = {
    imageDialog: false,
    selectedImageUrl: "",
  };

  private images = [
    {
      imageId: "787654321012345",
      url: "http://kofreetv.com/wp-content/uploads/2019/03/100-190312.jpg",
    },
    {
      imageId: "787654321012344",
      url: "https://i.ytimg.com/vi/1bnygyB7N3Y/maxresdefault.jpg",
    },
    {
      imageId: "787654321012346",
      url:
        "https://jmagazine.joins.com/_data/photo/2018/01/thumb_3731660748_JZMzQ1Hl_3.jpg",
    },
    {
      imageId: "787654321012347",
      url:
        "    http://www.topstarnews.net/news/photo/201903/599938_283178_5751.jpg",
    },
  ];

  private sideviewMode: string = "script";
  private selectedKeyword: string = "";
  private displayKeywordItems: DisplayKeywordItem[] = [];
  private displayScriptItems: DisplayScriptItem[] = [];
  //   private selectedNodeIds: vis.IdType[] = [];
  //   private semiSelectedNodeIds: vis.IdType[] = [];
  // contents를 오른쪽 아래 사이드뷰의 선택된 곳의 스크립트를 보여주기 위해 mapping한 변수
  private fullScript!: Script[];
  // topicGroup의 topic마다.
  private scriptsByTopic: Script[][] = [];
  private totalTime: number = 0;

  private show1: boolean = false;
  private show2: boolean = false;
  private show3: boolean = false;

  private speakingBias: number = 5;

  private actionItems: ActionItem[] = [];
  private isMounted: boolean = false;

  private async initializeContents() {
    this.meetingId = this.meetingId as string;
    this.uid = this.uid as string;

    if (
      this.meetingId === "" ||
      this.uid === "" ||
      this.meetingId === undefined ||
      this.uid === undefined
    ) {
      this.test = true;
    }
    if (this.test) {
      this.contents = contents;
    } else {
      const t = await api.samsung.getMeetingText(
        api.samsung.syskey,
        this.meetingId
      );

      const filtered: Speech[] = _.chain(t.texts)
        .filter((d) => {
          return (
            d.talkerId.indexOf("?") === -1 &&
            d.talkerId.indexOf("all") === -1 &&
            d.talkerId.indexOf("others") === -1 &&
            d.talkerId.indexOf(",") === -1 &&
            d.talkerId !== ""
          );
        })
        .map((d) => {
          return {
            name: d.talkerName,
            text: d.text,
          };
        })
        .filter((d) => !_.isNil(d.text) && !_.isEmpty(d.text))
        .map((d, i) => {
          return {
            name: d.name,
            text: d.text,
            index: i,
            morphs: [],
          };
        })
        .value();

      const tagged = await api.nlp.nlpTagger(filtered, "KMR");
      this.contents = _.map(tagged, (item) => {
        return {
          //@ts-ignore
          text: item.tags[0].sentenceText,
          //@ts-ignore
          morphs: item.tags[0].morphs,
          name: item.name,
          index: item.index,
        };
      });
    }

    // fullScript 형식(Script[])대로 만든다.
    this.fullScript = _.map(this.contents, (content, index) => {
      return {
        talkerName: content.name,
        talkerId: content.name,
        text: content.text,
        startTime: index * 3000,
        endTime: (index + 1) * 3000,
        agenda: 1,
      };
    });

    this.totalTime =
      this.fullScript[this.fullScript.length - 1].endTime -
      this.fullScript[0].startTime;

    // this.contents로 rawString을 가지고 온다.
    this.totalString = _.chain(this.contents)
      .map((content) => {
        return content.text;
      })
      .join(" ")
      .value();

    this.totalString = this.refineString(this.totalString);
    this.nodeHash = _.keyBy(testNetworkData.nodes, "id");
  }
  //@ts-ignore
  private refineString(str) {
    str.split(/[.:\n]}/).join();
    const regExp = /[\{\}\[\]\/?,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    return str.replace(regExp, "");
  }

  private clickTopicKeyword(topic: Topic, topicIndex: number) {
    let findingNode!: Node;
    _.forEach(testNetworkData.nodes, (node) => {
      if (node.label === topic.label) {
        findingNode = node;
        return false;
      }
    });
    this.selectedKeyword = findingNode.label;

    this.displayKeywordItems = this.findKeywordItems([findingNode]);
    this.displayScriptItems = this.findScriptItems(
      [findingNode],
      this.scriptsByTopic[topicIndex]
    );
  }
  //@ts-ignore
  private clickImage(url) {
    this.ui.selectedImageUrl = url;
    this.ui.imageDialog = true;
  }

  private findKeywordItems(clickedNodes: Node[]): DisplayKeywordItem[] {
    // hash로 한번 처리한다.
    const keywordHash: { [index: string]: DisplayKeywordItem } = {};
    // 클릭된 node들을 hash에 넣는다.
    _.forEach(clickedNodes, (node) => {
      keywordHash[node.id] = {
        label: node.label,
        barRatio: 0,
        count: 0,
      };
    });

    // 각 node마다 keyword를 찾는다.
    _.forEach(clickedNodes, (clickedNode) => {
      const filteredEdges: Edge[] = _.filter(
        testNetworkData.edges,
        (e) => e.from === clickedNode.id || e.to === clickedNode.id
      );
      keywordHash[clickedNode.id].count = filteredEdges.length;

      _.forEach(filteredEdges, (e) => {
        // keyword
        let keyword: Node;
        if (e.from === clickedNode.id) {
          // keyword = this.visNetworkData.nodes.get(e.to) as Node;
          keyword = this.nodeHash[e.to];
        } else {
          // keyword = this.visNetworkData.nodes.get(e.from) as Node;
          keyword = this.nodeHash[e.from];
        }

        if (!_.isNil(keywordHash[keyword.id])) {
          keywordHash[keyword.id].count += keyword.count;
        } else {
          keywordHash[keyword.id] = {
            count: e.count,
            label: keyword.label,
            barRatio: 0,
          };
        }
      });
    });

    let displayKeywordItems: DisplayKeywordItem[] = _.values(keywordHash);
    displayKeywordItems = _.sortBy(displayKeywordItems, (item) => -item.count);
    let totalCount: number = 0;
    _.forEach(displayKeywordItems, (item, i) => {
      if (i === 0) {
        totalCount = item.count;
      }
      item.barRatio = (item.count / totalCount) * 100;
    });
    return displayKeywordItems;
  }

  private findScriptItems(clickedNodes: Node[], scripts: Script[]) {
    const mergedTextLen = 5;
    const highlightScriptIndexs: number[] = this.getHighlightScriptIndex(
      scripts,
      clickedNodes,
      mergedTextLen
    );
    return this.getScriptItem(
      scripts,
      highlightScriptIndexs,
      clickedNodes,
      mergedTextLen
    );
  }
  private getHighlightScriptIndex(
    scripts: Script[],
    selectedNodes: Node[],
    mergedTextLen: number
  ) {
    const ret: number[] = [];
    for (let i = 0; i < scripts.length - mergedTextLen; i++) {
      let mergedText: string = "";
      for (let j = 0; j < mergedTextLen; j++) {
        let min = 0;
        let orFlag: boolean = false;
        let andFlag: boolean = true;
        mergedText += " / " + scripts[i + j].text;
        for (const node of selectedNodes) {
          if (mergedText.indexOf(node.label) !== -1 && !orFlag) {
            orFlag = true;
            min = i + j;
          }
          if (mergedText.indexOf(node.label) === -1) {
            andFlag = false;
            break;
          }
        }
        if (andFlag) {
          ret.push(i);
          i = min + 1;
          break;
        }
      }
    }
    return ret;
  }

  private getScriptItem(
    scripts: Script[],
    highlightScriptIndexs: number[],
    selectedNodes: Node[],
    mergedTextLen: number
  ) {
    const ret: DisplayScriptItem[] = [];
    _.forEach(highlightScriptIndexs, (idx) => {
      let mergedText: string = scripts[idx].text + ". ";
      let talker: string = scripts[idx].talkerName;
      let replaced = "";
      for (let j = 1; j < mergedTextLen; j++) {
        if (talker === scripts[idx + j].talkerName) {
          mergedText += scripts[idx + j].text + ". ";
          if (j === mergedTextLen - 1) {
            replaced = mergedText;
            for (const node of selectedNodes) {
              const reg = new RegExp(`${node.label}`, "gi");
              replaced = replaced.replace(reg, `<b>${node.label}</b>`);
            }
            ret.push({
              talker,
              text: replaced,
              time: this.makeTimeMinuteUnit(scripts[idx + j].startTime),
              profileImage: "",
            });
          }
        } else {
          replaced = mergedText;
          for (const node of selectedNodes) {
            const reg = new RegExp(`${node.label}`, "gi");
            replaced = replaced.replace(reg, `<b>${node.label}</b>`);
          }
          ret.push({
            talker,
            text: replaced,
            time:
              Math.floor(scripts[idx + j].startTime / 60000) +
              ":" +
              Math.floor((scripts[idx + j].startTime % 60000) / 1000),
            profileImage: "",
          });
          talker = scripts[idx + j].talkerName;
          mergedText = scripts[idx + j].text + ". ";
          if (j === mergedTextLen - 1) {
            replaced = mergedText;
            for (const node of selectedNodes) {
              const reg = new RegExp(`${node.label}`, "gi");
              replaced = replaced.replace(reg, `<b>${node.label}</b>`);
            }
            ret.push({
              talker,
              text: replaced,
              time:
                Math.floor(scripts[idx + j].startTime / 60000) +
                ":" +
                Math.floor((scripts[idx + j].startTime % 60000) / 1000),
              profileImage: "",
            });
          }
        }
      }
    });
    return ret;
  }
  //@ts-ignore
  private getCurrentTimeToString(val) {
    const t = ((val * this.clientWidth) / this.seperateCount / 1800) * 30;
    const m = Math.floor(t);
    let s = Math.floor((t % 1.0) * 60);
    if (s * 1 < 10) {
      // @ts-ignore
      s = "0" + s;
    }
    return `${m}:${s}`;
  }

  private async mounted() {
    // 1. Meeting Text Load.
    // 2. Morph.
    // 3. create Waveform.
    // 4. craete Group
    // 5. modify Waveform Location;

    await this.initializeContents();

    this.seperateCount = Math.floor(Math.sqrt(this.contents.length)) * 2;
    const config = {
      speechCount: this.contents.length,
      speechGap: this.contents.length / this.seperateCount,
      clientWidth: this.$refs.narrativeSvg.clientWidth,
      screenPointGap: this.$refs.narrativeSvg.clientWidth / this.seperateCount,
      userGap: 80,
    };
    this.config = config;
    this.clientWidth = config.clientWidth;
    const speechGroup: { [key: string]: Speech[] } = _.chain(this.contents)
      .groupBy((d) => d.name)
      .value();

    this.users = _.map(Object.keys(speechGroup), (key, userIndex) => {
      const speechs: Speech[] = speechGroup[key];
      const u: User = {
        name: key,
        speechPoints: [],
        speechs,
        path: "",
        validSpeechRanking: 0,
        numOfValidSpeech: 0,
        validSpeechTime: 0,
        tooltipValidSpeechTime: false,
        speechTime: 0,
      };
      for (let i = 0; i < this.seperateCount; i++) {
        const containSpeechs: Speech[] = _.filter(speechs, (speech) => {
          return (
            config.speechGap * i < speech.index &&
            speech.index < config.speechGap * (i + 1)
          );
        });
        let diff = containSpeechs.length;
        if (diff < 0) {
          diff = 0;
        }
        const speechPoint: SpeechPoint = {
          point: {
            x: i * config.screenPointGap + config.screenPointGap / 2,
            y: userIndex * config.userGap + 50,
            diff,
            std: userIndex * config.userGap + 50,
          },
          startPoint: {
            x: i * config.screenPointGap + config.screenPointGap / 2,
            y: userIndex * config.userGap + 50 - diff + 1,
            diff,
            std: userIndex * config.userGap + 50,
          },
          endPoint: {
            x: i * config.screenPointGap + config.screenPointGap / 2,
            y: userIndex * config.userGap + 50 + diff + 1,
            diff,
            std: userIndex * config.userGap + 50,
          },
          size: diff, // TODO
          speechs: containSpeechs,
        };
        u.speechPoints.push(speechPoint);
      }

      // speakingBias 기준 이상의 point.diff를 구한다.

      return u;
    });

    this.users = this.makeUsersValidSpeechProperty(
      this.users,
      this.speakingBias
    );
    this.users = this.makeUsersSpeechTimeProperty(this.users, this.fullScript);

    this.actionItems = this.makeTestActionItems();

    const wordPoints: any[] = [];
    for (let i = 0; i < this.seperateCount; i++) {
      const pointWord = _.chain(this.users)
        .map((u) => u.speechPoints[i].speechs)
        .flatten()
        .map((s) => s.morphs)
        .flatten()
        .filter((tag) => tag.tag.startsWith("NNG") && tag.morph.length > 1)
        .map((tag) => tag.morph)
        .value();
      wordPoints.push(pointWord);
    }
    const connectionValue: any[] = [];
    const connection: any[] = [];
    // let connected: boolean = false;
    // let connectionGroup: any[] | undefined = undefined;
    for (let i = 0; i < this.seperateCount - 1; i++) {
      const src = wordPoints[i];
      const next = wordPoints[i + 1];
      const prev = i < 1 ? null : wordPoints[i - 1];
      connectionValue.push(this.getLinkWeight(src, next, prev));
    }
    for (let i = 0; i < this.seperateCount - 1; i++) {
      const connValue = connectionValue[i];
      const nextConnValue = connectionValue[i + 1]
        ? connectionValue[i + 1].prev
        : 0;
      connection.push(connValue.next + nextConnValue);
    }

    let linearConfGroup: any[] = [];
    let tempGroup: number[] = [];

    for (let i = 2; i < this.seperateCount - 1; i++) {
      const conn = connection[i];
      if (conn > 0.28) {
        tempGroup.push(i);
      } else {
        if (tempGroup.length > 1) {
          // 앞 뒤 좀더 추가
          // const min = _.minBy(tempGroup);
          // if (min > 0) {
          //   tempGroup.unshift(min - 1);
          // }
          // if (i !== this.seperateCount - 1) {
          //   tempGroup.push(i);
          // }

          linearConfGroup.push(tempGroup);
        }
        tempGroup = [];
      }
    }

    for (let i = 1; i < linearConfGroup.length; i++) {
      const dst = linearConfGroup[i - 1];
      const src = linearConfGroup[i];

      const diff = Math.abs(dst[dst.length - 1] - src[0]);
      if (diff <= 2) {
        _.forEach(src, (item) => dst.push(item));
        linearConfGroup[i] = [];
      } else {
        if (src.length < 3) {
          linearConfGroup[i] = [];
        }
      }
    }
    linearConfGroup = _.filter(linearConfGroup, (g) => g.length !== 0);
    this.testConfGroup = linearConfGroup;

    // 생성된 그룹에 따라 Waveform Position 다시 계산
    // @ts-ignore
    this.topicGroup = _.map(this.testConfGroup, (group: number[], i) => {
      const containUsers = _(this.users)
        .map((u, j) => {
          const isInside = this.isUserInsideTopic(group, u);
          // user + group
          if (!isInside) {
            return;
          }
          this.moveUserSpeechPoint(
            u,
            group[0],
            group[group.length - 1],
            i * (200 / this.testConfGroup.length + 1) + 110 + j * 15
          );
          return isInside ? i : -1;
        })
        .filter((v) => v !== -1)
        .value();

      return {
        speechs: group,
        containUsers: containUsers as number[],
        topicKeywords: [],
        color: getColor(i),
      };
    });

    this.topicGroup = this.makeTopicKeyword(this.topicGroup);

    this.scriptsByTopic = this.getScriptsByTopic(
      this.contents,
      this.topicGroup
    );

    // 최종 WaveForm 생성
    _.forEach(this.users, (u, i) => {
      const path = _.flatten([
        _.map(u.speechPoints, (point) => {
          return {
            x: point.startPoint.x,
            y: point.startPoint.std - point.startPoint.diff * 0.5 - 2,
          };
        }),
        _.chain(u.speechPoints)
          .map((point) => {
            return {
              x: point.endPoint.x,
              y: point.endPoint.std + point.endPoint.diff * 0.5 + 2,
            };
          })
          .reverse()
          .value(),
      ]);

      u.fill = getColor(i);

      // @ts-ignore
      u.path = line(path);
    });

    // this.$nextTick(() => {
    //   this.isMounted = true;
    // });
    //TODO useEffect or useLayoutEffect
    useLayoutEffect(() => {
      this.isMounted = true;
    });
  }

  private makeUsersValidSpeechProperty(
    users: User[],
    speakingBias: number
  ): User[] {
    users = _.sortBy(users, (user) => -user.name);
    // numOfValidSpeech 계산
    _.forEach(users, (user) => {
      _.forEach(user.speechPoints, (point, i) => {
        if (point.point.diff > speakingBias) {
          user.numOfValidSpeech += 1;
          // 1)fullScript(contents)의 startIndex와 lastIndex를 구한다.

          // const startIndex: number = Math.floor(this.config.speechGap * i);
          const startIndex: number = this.getStartIndexBySpeechPoint(
            i,
            this.config.speechGap
          );
          // const lastIndex: number = Math.floor(
          //   this.config.speechGap * (i + 1) - 1
          // );
          const lastIndex: number = this.getLastIndexBySpeechPoint(
            i,
            this.config.speechGap
          );

          // 2)this.fullScript[lastIndex].endTime - this.fullScript[startIndex].startTime
          const time: number =
            this.fullScript[lastIndex].endTime -
            this.fullScript[startIndex].startTime;
          user.validSpeechTime += time;
        }
      });
    });

    // 각 user마다 숫자가 나오는데, 몇번째인지 알려면 sorting이 되어야 한다.
    const rankSortedUsers: User[] = _.sortBy(
      users,
      (user) => -user.numOfValidSpeech
    );
    // validSpeech 랭킹 설정
    _.forEach(rankSortedUsers, (sortedUser, i) => {
      _.forEach(users, (user) => {
        if (user.name === sortedUser.name) {
          user.validSpeechRanking = i + 1;
        }
      });
    });
    return users;
  }

  private getScriptsByTopic(
    speechContents: Speech[],
    topicGroup: any[]
  ): Script[][] {
    const scriptsByTopic: Script[][] = _.map(this.topicGroup, (topic, k) => {
      const startIndex: number = this.getStartIndexBySpeechPoint(
        topic.speechs[0],
        this.config.speechGap
      );
      const lastIndex: number = this.getLastIndexBySpeechPoint(
        topic.speechs[topic.speechs.length - 1],
        this.config.speechGap
      );

      const scriptArray: Script[] = [];
      for (let i = startIndex; i <= lastIndex; i++) {
        scriptArray.push({
          talkerName: speechContents[i].name,
          talkerId: speechContents[i].name,
          text: speechContents[i].text,
          startTime: i * 3000,
          endTime: (i + 1) * 3000,
          agenda: 1,
        });
      }
      return scriptArray;
    });

    return scriptsByTopic;
  }

  private makeTopicKeyword(
    topicGroup: Array<{
      speechs: number[];
      containUsers: number[];
      topicKeywords: Topic[];
      color: string;
    }>
  ) {
    const topicIndexChooser = {};
    //  {
    // 	  topicKeyword1: {
    // 	  	topic1: 2, // count
    // 	  	topic2: 3,
    // 	  	topic3: 1
    //  	},
    //  	...
    //  }

    _.forEach(testNetworkData.topics, (topicKeyword) => {
      //@ts-ignore
      topicIndexChooser[topicKeyword.label] = {};
      _.forEach(topicGroup, (topic, i) => {
        //@ts-ignore
        topicIndexChooser[topicKeyword.label][i] = 0;
      });
    });

    _.forEach(topicGroup, (topic, k) => {
      // const startIndex: number = Math.floor(this.config.speechGap * k);
      // const lastIndex: number = Math.floor(this.config.speechGap * (k + 1) - 1);
      const startIndex: number = this.getStartIndexBySpeechPoint(
        topic.speechs[0],
        this.config.speechGap
      );
      const lastIndex: number = this.getLastIndexBySpeechPoint(
        topic.speechs[topic.speechs.length - 1],
        this.config.speechGap
      );

      for (let i = startIndex; i <= lastIndex; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < testNetworkData.topics.length; j++) {
          const exist: number = this.contents[i].text.indexOf(
            testNetworkData.topics[j].label
          );
          if (exist !== -1) {
            //@ts-ignore
            topicIndexChooser[testNetworkData.topics[j].label][k] += 1;
          }
        }
      }
    });
    // 생성한다.
    _.forEach(topicGroup, (topic, i) => {
      _.forEach(testNetworkData.topics, (topicKeyword) => {
        // 꼴지만 아니면 넣는다.
        const min: number = _.min(
          //@ts-ignore
          _.values(topicIndexChooser[topicKeyword.label])
        );
        //@ts-ignore
        if (topicIndexChooser[topicKeyword.label][i] !== min) {
          topic.topicKeywords.push(topicKeyword);
        }
      });
    });
    return topicGroup;
  }

  private isUserInsideTopic(group: number[], user: User) {
    const speechs = _(group)
      .map((index) => {
        return user.speechPoints[index].size;
      })
      .sum();
    if (speechs > 3) {
      return true;
    } else {
      return false;
    }
  }

  private moveUserSpeechPoint(
    user: User,
    from: number,
    to: number,
    std: number
  ) {
    for (let i = from; i < to; i++) {
      if (i === from) {
        if (i - 1 >= 0) {
          user.speechPoints[i - 1].startPoint.diff = 1;
          user.speechPoints[i - 1].endPoint.diff = 1;
        }

        user.speechPoints[i].startPoint.diff = 1;
        user.speechPoints[i].endPoint.diff = 1;
      }
      if (i === to) {
        try {
          user.speechPoints[i].startPoint.diff = 1;
          user.speechPoints[i].endPoint.diff = 1;
        } catch (e) {
          //
        }
        user.speechPoints[i + 1].startPoint.diff = 1;
        user.speechPoints[i + 1].endPoint.diff = 1;
      }
      user.speechPoints[i].startPoint.std = std;
      user.speechPoints[i].endPoint.std = std;
      user.speechPoints[i].point.std = std;
    }
  }
  private isInsideTopic(index: number): number {
    for (let i = 0; i < this.testConfGroup.length; i++) {
      for (let j = 0; j < this.testConfGroup[i].length; j++) {
        if (j === index) {
          return i;
        }
      }
    }
    return 0;
  }
  //@ts-ignore
  private getLinkWeight(src, next, prev) {
    const n = _.chain(src)
      .map((word) => {
        return _.some(next, (w) => w === word);
      })
      .filter((t) => t)
      .value();

    const p =
      prev === null
        ? []
        : _.chain(src)
            .map((word) => {
              return _.some(prev, (w) => w === word);
            })
            .filter((t) => t)
            .value();
    return {
      prev: p.length / src.length,
      next: n.length / src.length,
    };
  }

  private onCLickSideviweButton(mode: string) {
    this.sideviewMode = mode;
  }

  private clickSpeakLineBlock(clickedUser: User, speechPointIndex: number) {
    // 진한 회색 블록이 선택되었을 때
    if (
      clickedUser.speechPoints[speechPointIndex].point.diff > this.speakingBias
    ) {
      // 주변 진한 회색 블록을 찾는다.
      const sameBlockIndexes: number[] = this.findSameBlockAround(
        clickedUser,
        speechPointIndex
      );

      // 해당 fullScript의 시작 index와 마지막 index를 찾는다.
      const scripts: Script[] = this.getScriptsBySpeechPoint(
        sameBlockIndexes[0],
        sameBlockIndexes[sameBlockIndexes.length - 1]
      );
      // 발화자 기준으로 스크립트를 묶을 수 있도록 한다.
      // this.displayScriptItems
      this.displayScriptItems = this.getDisplayScriptItemsByTalker(scripts);
    }
  }

  /**
   * 주변 진한 회색블록들의 모든 index들을 오름차순으로 반환한다.
   */
  private findSameBlockAround(
    clickedUser: User,
    speechPointIndex: number
  ): number[] {
    //
    const sameBlockIndexes: number[] = [speechPointIndex];
    let i = speechPointIndex - 1;
    while (
      i >= 0 &&
      clickedUser.speechPoints[i].point.diff > this.speakingBias
    ) {
      sameBlockIndexes.push(i);
      i--;
    }

    let j = speechPointIndex + 1;
    while (
      j < this.seperateCount &&
      clickedUser.speechPoints[j].point.diff > this.speakingBias
    ) {
      sameBlockIndexes.push(j);
      j++;
    }

    sameBlockIndexes.sort((a, b) => (a < b ? -1 : 1));
    return sameBlockIndexes;
  }

  /**
   * speechPoint에 따른 startIndex와 lastIndex를 가지고
   * fullScript 중 Script[]를 가져온다.
   */
  private getScriptsBySpeechPoint(
    spStartIndex: number,
    spLastIndex: number
  ): Script[] {
    const fsStartIndex: number = this.getStartIndexBySpeechPoint(
      spStartIndex,
      this.config.speechGap
    );
    const fsLastIndex: number = this.getLastIndexBySpeechPoint(
      spLastIndex,
      this.config.speechGap
    );

    const scripts: Script[] = [];

    for (let i = fsStartIndex; i <= fsLastIndex; i++) {
      scripts.push(this.fullScript[i]);
    }

    return scripts;
  }

  /**
   * 발화자 기준으로 DisplayScriptItem[]를 묶어 반환한다.
   * @param scripts: DisplayScriptItem[]를 만들기 위한 Script[]
   */
  private getDisplayScriptItemsByTalker(scripts: Script[]) {
    const displayScriptItems: DisplayScriptItem[] = [];
    let displayScriptItem: DisplayScriptItem = {
      profileImage: scripts[0].talkerId,
      talker: scripts[0].talkerName,
      time: this.makeTimeMinuteUnit(scripts[0].startTime),
      text: scripts[0].text,
    };

    for (let i = 1; i < scripts.length; i++) {
      if (scripts[i - 1].talkerId === scripts[i].talkerId) {
        displayScriptItem.text += ` ${scripts[i].text}`;
      } else {
        // talker가 다른 경우
        displayScriptItems.push(displayScriptItem);
        // displayScriptItem를 새로 만든다.
        displayScriptItem = {
          profileImage: scripts[i].talkerId,
          talker: scripts[i].talkerName,
          time: this.makeTimeMinuteUnit(scripts[i].startTime),
          text: scripts[i].text,
        };
      }
    }
    displayScriptItems.push(displayScriptItem);
    return displayScriptItems;
  }

  private getStartIndexBySpeechPoint(spStartIndex: number, speechGap: number) {
    return Math.floor(spStartIndex * speechGap);
  }
  private getLastIndexBySpeechPoint(spLastIndex: number, speechGap: number) {
    return Math.floor((spLastIndex + 1) * speechGap - 1);
  }

  private makeTimeMinuteUnit(time: number): string {
    return Math.floor(time / 60000) + ":" + Math.floor((time % 60000) / 1000);
  }

  private getActionItemLeftPosition(actionItem: ActionItem) {
    const timeRatio: number = actionItem.time / this.totalTime;

    const totalWidth: number =
      document.getElementsByClassName("user-speak-area")[0].clientWidth - 18;
    const speakerWidth: number = document.getElementsByClassName(
      "speaker-space"
    )[0].clientWidth;
    const left: number = speakerWidth + timeRatio * (totalWidth - speakerWidth);

    return left;
  }
  private getActionItemHeight(): number {
    const height: number = document.getElementsByClassName("user-speak-area")[0]
      .clientHeight;
    return document.getElementsByClassName("user-speak-area")[0].clientHeight;
  }
  private makeUsersSpeechTimeProperty(users: User[], fullScript: Script[]) {
    _.forEach(users, (user) => {
      _.forEach(fullScript, (script) => {
        if (script.talkerName === user.name) {
          user.speechTime += script.endTime - script.startTime;
        }
      });
    });
    // return _.reverse(users);
    return users;
  }

  private makeTestActionItems(): ActionItem[] {
    // time에 따라 text를 정해준다. 5문장 정도.
    return [
      {
        actionItemId: "actionItemId-1",
        text: "OOO설정 해주실 수 있을깨요?",
        who: "P1",
        when: "2019-06-09",
        time: 410000,
        tooltipShown: false,
      },
      {
        actionItemId: "actionItemId-1",
        text: "오늘 그래도 공통적이라는 거 하나 정도 발견하여 내자.",
        who: "P1",
        when: "2019-06-09",
        time: 700000,
        tooltipShown: false,
      },
      {
        actionItemId: "actionItemId-1",
        text: "OOO만들어 주세요.",
        who: "P1",
        when: "2019-06-09",
        time: 1120000,
        tooltipShown: false,
      },
      {
        actionItemId: "actionItemId-1",
        text: "OOO 해주세요.",
        who: "P1",
        when: "2019-06-09",
        time: 1590000,
        tooltipShown: false,
      },
    ];
  }
}
