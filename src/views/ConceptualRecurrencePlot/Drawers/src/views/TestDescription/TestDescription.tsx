/* eslint-disable no-unused-vars */
import { Button, Input, Image, Select } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import BasicModal, {
  BasicModalRef,
} from "../../components/BasicModal/BasicModal";
import TestDescriptionContent from "../../components/TestDescriptionContent/TestDescriptionContent";
import { DebateName } from "../ConceptualRecurrencePlot/DataImporter";
import styles from "./TestDescription.module.scss";
const { Option } = Select;

interface ComponentProps {}

function DescriptionForManualTopicSegmentation(props: ComponentProps) {
  const participationCodeSet: { [code: string]: true } = {
    "6521c43e-2ccd-4051-a2a6-31abec353205": true, // 기본소득clipped, 재종
    "ab522bc9-6633-4d16-8658-de887467e243": true, // 기본소득clipped, 효지형
    "6b43e2dc-f31d-417f-bf6b-c2a08fbbe3b3": true, // 기본소득clipped, 가현
    "3ba1db51-d13b-411a-b99b-0d66a0d33cc4": true, // 기본소득clipped, 계량
    "f5afc24f-63b3-4e6a-9fc7-bf8218b8477b": true, // 기본소득clipped, 현
    "6722b3ab-9fa4-4a6f-ab35-f5c6d7501684": true, // 기본소득clipped, 준우
    "bc16d03d-b48d-4e73-9fb5-55dee51a7e6f": true, // 기본소득clipped, 제준, 동관
    "c3276230-7e18-46cf-ac4c-8dda66f7b77e": true, // 모병제clipped, 재종
    "592e3a09-7004-4186-8089-87e3418f9fb9": true, // 모병제clipped,
    "3106eccb-36a0-4547-8a6f-1cdcb866fb3c": true, // 모병제clipped,
    "df721c05-752d-4178-9165-a2e1ed0185ee": true, // 모병제clipped,
    "a851f427-0b35-4fba-aa69-dd117bceb2e7": true, // 모병제clipped,
    "10845c4f-a22d-44fd-b1d8-5e28bc6b94ee": true, // 모병제clipped,
    "baaae95e-5297-4d2e-a645-78c188f039e2": true, // 모병제clipped,
    "d60c72e1-a33f-4da8-a20c-93f2dff2df19": true, // 정시확대clipped, 재종
    "aaa5bbb1-dd24-46db-b3af-90d427fd7901": true, // 정시확대clipped, 진철
    "7095745a-b33a-455d-85d3-b26b3e6655d3": true, // 정시확대clipped, 현식
    "2914926c-c221-4894-add1-cb62d6bab5e7": true, // 정시확대clipped,
    "76042868-d27b-4eb3-8bad-a221bd2ba901": true, // 정시확대clipped,
    "71039590-a875-4aeb-af82-51dcb73f4b65": true, // 효지형 지인 코드
    "880adc77-aae2-4db8-8dc8-8af3ab3b33fb": true, // 정시확대clipped,
    // *현식, *제준, *준우, 아버지, *광혁, *찬희, 수현, 혜림, 준우 친구들(10명..), 가현 친구들 (2명..)
    // *동관, 정화, 한열
    // 홍걸, 진철, 민석, 두희, 동주, 진수, *봉진
    // 석균, 성배, 재성, 승현
    // 지효, 윤혁, 병욱, 무석, 재성
    // 준엽, 수정, 주원, 윤정
    // 현우조교님, 수현, 태린
    // 정인, 선주, 혜리, 형준, 양지, 혜정
    // 동엽, 양섭
  };

  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const debateNameOfQuery = query.get("debate_name") as DebateName;
  const participationCodeOfQuery = query.get("code") as string;
  const basicModalRef = useRef<BasicModalRef>(null);

  const [ageGroup, setAgeGroup] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [participationCode, setParticipationCode] = useState<string>(
    participationCodeOfQuery
  );

  useEffect(() => {}, []);

  return (
    <div className={styles.component}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>실험 설명문</div>
      </div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <TestDescriptionContent></TestDescriptionContent>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div className={styles.previousStartStage}>
        <div className={styles.subjectInfoInputContainer}>
          <div
            style={{
              width: 70,
              marginRight: 4,
              lineHeight: "200%",
              textAlign: "right",
            }}
          >
            연령대 :
          </div>
          <Select
            className={styles.select}
            // defaultValue="none"
            // size="small"
            value={ageGroup}
            onChange={(value: string) => {
              setAgeGroup(value);
            }}
          >
            <Option value="underTeen">0 ~ 9세</Option>
            <Option value="teen">10 ~ 19세</Option>
            <Option value="twenty">20 ~ 29세</Option>
            <Option value="thirty">30 ~ 39세</Option>
            <Option value="fourty">40 ~ 49세</Option>
            <Option value="fifthy">50 ~ 59세</Option>
            <Option value="sixty">60 ~ 69세</Option>
            <Option value="overSeventy">70세 이상</Option>
          </Select>
        </div>

        <div className={styles.subjectInfoInputContainer}>
          <div
            style={{
              width: 70,
              marginRight: 4,
              lineHeight: "200%",
              textAlign: "right",
            }}
          >
            성별 :
          </div>
          <Select
            className={styles.select}
            // defaultValue="none"
            // size="small"
            value={gender}
            onChange={(value: string) => {
              setGender(value);
            }}
          >
            <Option value="man">남성</Option>
            <Option value="woman">여성</Option>
          </Select>
        </div>

        <div className={styles.subjectInfoInputContainer}>
          <div
            style={{
              width: 70,
              marginRight: 4,
              lineHeight: "200%",
              textAlign: "right",
            }}
          >
            직업/전공 :
          </div>
          <Input
            style={{ width: 170, marginRight: 8 }}
            value={major}
            onChange={(event) => {
              setMajor(event.target.value);
            }}
          ></Input>
        </div>

        <div className={styles.subjectInfoInputContainer}>
          <div
            style={{
              width: 70,
              marginRight: 4,
              lineHeight: "200%",
              textAlign: "right",
            }}
          >
            참가 코드 :
          </div>
          <Input
            style={{ width: 170, marginRight: 8 }}
            value={participationCode}
            onChange={(event) => {
              setParticipationCode(event.target.value);
            }}
            disabled
          ></Input>
        </div>
        <div className={styles.startContainer}>
          {/* <Button style={{ marginRight: 12 }}>
            <Link
              to={{
                pathname: "/test-for-manual-topic-segmentation",
                state: {
                  ageGroup,
                  gender,
                  major,
                  participationCode,
                },
                search: "?debate_name=기본소득clipped",
              }}
            >
              시작 (Only Transcript)
            </Link>
          </Button> */}

          <Button
            type="primary"
            onClick={() => {
              if (
                ageGroup === "" ||
                gender === "" ||
                major === "" ||
                participationCode === ""
              ) {
                basicModalRef.current!.openModal({
                  title: "실험 기본 정보 부족",
                  text:
                    "연령대, 성별, 직업/전공, 참가코드를 모두 입력해 주세요",
                  okListener: () => {},
                });
              } else if (!(participationCode in participationCodeSet)) {
                //
                basicModalRef.current!.openModal({
                  title: "참가 코드 오류",
                  text: "참가 코드가 일치하지 않습니다. 다시 확인해 주세요.",
                  okListener: () => {},
                });
              } else {
                history.push({
                  pathname: "/video-subject-test",
                  state: {
                    ageGroup,
                    gender,
                    major,
                    participationCode,
                  },
                  search: `?debate_name=${debateNameOfQuery}`,
                });
              }
            }}
          >
            실험 시작
          </Button>
        </div>
      </div>

      <BasicModal ref={basicModalRef}></BasicModal>
    </div>
  );
}

export default DescriptionForManualTopicSegmentation;
