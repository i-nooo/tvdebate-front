import _ from "lodash";
import { UtteranceObject } from "../interfaces/DebateDataInterface";
import { DebateName } from "../views/ConceptualRecurrencePlot/DataImporter";

export interface Participant {
  name: string;
  color: string;
  team: number;
}

export interface ParticipantDict {
  [participant: string]: Participant;
}

/**
 * make participants information inclduing name, color
 * @param debateUtterances
 */
export function makeParticipants(
  debateName: DebateName,
  debateUtterances: UtteranceObject[]
): Participant[] {
  const nameDictionary: { [name: string]: string } = {};
  // arrange participants
  _.forEach(debateUtterances, (utteranceObject) => {
    nameDictionary[utteranceObject.name] = utteranceObject.name;
  });
  const names: string[] = _.values(nameDictionary).sort();
  console.log("names", names);

  let participants: Participant[] = [];
  if (debateName === "sample") {
    const colorDictionary: { [index: number]: string } = {
      0: "#C941AF",
      1: "#C98E41",
      2: "#4161C9",
      3: "#41C9C9",
      4: "#333333",
    };
    participants = _.map(names, (name, index) => {
      let team: number;
      switch (index) {
        case 0:
          team = 2;
          break;
        case 1:
          team = 1;
          break;
        case 2:
          team = 1;
          break;
        case 3:
          team = 2;
          break;
        case 4:
          team = -1;
          break;
        default:
          team = -3;
      }
      return {
        name,
        color: colorDictionary[index],
        team,
      };
    });
  } else if (debateName === "기본소득") {
    const colorDictionary: { [index: number]: string } = {
      0: "#000000",
      1: "#C941AF",
      2: "#C98E41",
      3: "#4161C9",
      4: "#41C9C9",
      5: "#333333",
    };
    participants = _.map(names, (name, index) => {
      let team: number;
      switch (index) {
        case 0:
          team = -1;
          break;
        case 1:
          team = 2;
          break;
        case 2:
          team = 2;
          break;
        case 3:
          team = 1;
          break;
        case 4:
          team = 1;
          break;
        case 5:
          team = -2;
          break;
        default:
          team = -3;
      }
      return {
        name,
        color: colorDictionary[index],
        team,
      };
    });
  } else if (debateName === "기본소득clipped") {
    const colorDictionary: { [index: number]: string } = {
      0: "#C941AF",
      1: "#C98E41",
      2: "#4161C9",
      3: "#41C9C9",
      4: "#333333",
    };
    participants = _.map(names, (name, index) => {
      let team: number;
      switch (index) {
        case 0:
          team = 2;
          break;
        case 1:
          team = 2;
          break;
        case 2:
          team = 1;
          break;
        case 3:
          team = 1;
          break;
        case 4:
          team = -2;
          break;
        default:
          team = -3;
      }
      return {
        name,
        color: colorDictionary[index],
        team,
      };
    });
  } else if (debateName === "정시확대" || debateName === "정시확대clipped") {
    const colorDictionary: { [index: number]: string } = {
      0: "#4161C9",
      1: "#C941AF",
      2: "#41C9C9",
      3: "#C98E41",
      4: "#333333",
    };
    participants = _.map(names, (name, index) => {
      let team: number;
      switch (index) {
        case 0:
          team = 1;
          break;
        case 1:
          team = 2;
          break;
        case 2:
          team = 1;
          break;
        case 3:
          team = 2;
          break;
        case 4:
          team = -2;
          break;
        default:
          team = -3;
      }
      return {
        name,
        color: colorDictionary[index],
        team,
      };
    });
  } else if (debateName === "모병제" || debateName === "모병제clipped") {
    const colorDictionary: { [index: number]: string } = {
      0: "#41C9C9",
      1: "#C98E41",
      2: "#C941AF",
      3: "#4161C9",
      4: "#333333",
    };
    participants = _.map(names, (name, index) => {
      let team: number;
      switch (index) {
        case 0:
          team = 1;
          break;
        case 1:
          team = 2;
          break;
        case 2:
          team = 2;
          break;
        case 3:
          team = 1;
          break;
        case 4:
          team = -2;
          break;
        default:
          team = -3;
      }
      return {
        name,
        color: colorDictionary[index],
        team,
      };
    });
  } else if (debateName === "집값") {
    const colorDictionary: { [index: number]: string } = {
      0: "#000000", // 김수지
      1: "#C941AF", // 김현아
      2: "#C98E41", // 송석준
      3: "#41C9C9", // 진성준
      4: "#333333", // 진행자
      5: "#4161C9", // 최배근
    };
    participants = _.map(names, (name, index) => {
      let team: number;
      switch (index) {
        case 0:
          team = -1;
          break;
        case 1:
          team = 2;
          break;
        case 2:
          team = 2;
          break;
        case 3:
          team = 1;
          break;
        case 4:
          team = -2;
          break;
        case 5:
          team = 1;
          break;
        default:
          team = -3;
      }
      return {
        name,
        color: colorDictionary[index],
        team,
      };
    });
  } else if (debateName === "정년연장") {
    const colorDictionary: { [index: number]: string } = {
      0: "#41C9C9", // 김범중
      1: "#4161C9", // 박연미
      2: "#C98E41", // 이지만
      3: "#C941AF", // 정영진
      4: "#333333", // 진행자
    };
    participants = _.map(names, (name, index) => {
      let team: number;
      switch (index) {
        case 0:
          team = 2;
          break;
        case 1:
          team = 2;
          break;
        case 2:
          team = 1;
          break;
        case 3:
          team = 1;
          break;
        case 4:
          team = -2;
          break;
        default:
          team = -3;
      }
      return {
        name,
        color: colorDictionary[index],
        team,
      };
    });
  }

  // console.log("participants", participants);

  return participants;
}
