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

  return (
    <div className={styles.component}>
      <div className={styles.bodyContentZone}>
        <Image src="/evaluation/debaters.png" width={"100%"}></Image>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          연구 제목
        </Title>
        <div className={styles.lastContentText}>
          토론의 주제 분리 모델을 평가하기 위한 주제 분리 정보 수집
        </div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          연구 목적
        </Title>
        <div className={styles.lastContentText}>
          <a
            href="https://conceptual-map-of-debate.web.app/"
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
            rel="noopener noreferrer"
          >
            토론의 주제 분리 모델
          </a>
          과 인간이 직접 주제를 분리한 결과가 얼마나 일치하는지 평가하고자
          합니다. 이를 위해 피험자가 직접 주제 분리한 결과 정보를 수집하고자
          합니다.
        </div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          연구담당자 정보
        </Title>
        <div className={styles.lastContentText}>
          <div>- 성명: 허재종</div>
          <div>
            - 소속기관: 아주대학교 미디어학과 통합 디자인 연구실(Integrated
            Design Lab)
          </div>
          <div>- 연락처: 010-8608-6708 / hapsoa@ajou.ac.kr</div>
        </div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          연구참여 시간
        </Title>
        <div className={styles.lastContentText}>
          연구참여 제한 시간은 없으나, 예상 소요시간은 1시간 내외 정도입니다.
        </div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          연구참여 및 연구수행 방법
        </Title>
        <div>
          여러분은{" "}
          <b>
            MBC 100분토론 TV프로그램 1회분을 처음부터 제시된 지점까지 시청하면서
            주제를 분리
          </b>
          하시면 됩니다.
        </div>
        {/* <div>
            &nbsp;&nbsp;여기서 주제 분리란 대화를 주제를 기준으로 나누는 것을
            뜻합니다. 토론에서는 하나의 큰 주제를 놓고 여러 각도에서 쟁점
            사안들을 조명하거나 작은 주제들로 나누어 의견을 교환합니다. 이러한
            쟁점 사안들이나 작은 주제들로 대화를 나누는 것을 토론에서의 주제
            분리라고 할 수 있습니다. 정리하면 토론에서의 주제 분리는 토론자들 간
            대화의 흐름이 전환되는 지점에서 대화를 나누는 것입니다.
          </div> */}
        <div>
          &nbsp;&nbsp;토론에서는 하나의 큰 주제를 놓고 여러 각도에서 쟁점
          사안들을 조명하거나 작은 주제들로 나누어 의견을 교환합니다. 이러한{" "}
          <b>
            쟁점 사안들이나 작은 주제들로 대화의 흐름이 전환되는 지점을 나누는
            행위를 토론에서의 주제 분리
          </b>
          라고 할 수 있습니다.
        </div>
        {/* <div>
            &nbsp;&nbsp;주제 분리에 대한 예시를 100분토론 [&apos;정년연장,
            고령화 해법인가?&apos;]로 든다면 다음과 같을 수 있습니다. 같은
            색상이 칠해지는 발화 및 문장들은 하나의 주제로 분리됨을 나타냅니다.
          </div> */}
        <div>
          &nbsp;&nbsp;토론에서의 주제 분리 예시를 [100분토론 &apos;정년연장,
          고령화 해법인가?&apos;]의 대본으로 든다면 다음과 같을 수 있습니다.
          대본 내용에 칠해진 각 색상(빨간색, 노란색)의 하이라이트는 나뉘어진
          주제들을 나타냅니다.
        </div>
        <div>&nbsp;</div>
        <div>예시 1)</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/evaluation/example_1.png" width={"100%"}></Image>
        </div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>예시 2)</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/evaluation/example_2.png" width={"100%"}></Image>
        </div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>예시 3)</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/evaluation/example_3.png" width={"100%"}></Image>
        </div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>예시 4)</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/evaluation/example_4.png" width={"100%"}></Image>
        </div>
        {/* <div>
            제시된 MBC 100분토론 TV프로그램의 1회분의 토론 대본을 읽으면서
            주제가 분리된다고 판단하는 곳에 아래의 예시 그림 같이 체크박스
            표시하시면 됩니다.
          </div> */}
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        {/* <div>
            &nbsp;&nbsp;위의 예시는 저희 연구원 1명이 토론자들 간의 대화가
            전환되는 지점이라고 판단이 되는 곳에 표시한 것입니다. 여러분께서는
            본인이 스스로 토론자들 간의 대화가 전환되는 지점이라고 판단이 되는
            곳에 표시해주시면 되겠습니다. 이렇게 여러분께서 스스로 주제 분리
            지점을 표시하는 것이 이번 실험의 내용입니다.
          </div> */}
        <div>
          &nbsp;&nbsp;위의 예시는 저희 연구원 1명이 토론자들 간의 대화가
          전환되는 지점이라고 판단이 되는 곳에 표시한 것입니다. 여러분께서는
          토론의 주제를 분리하는 데 있어{" "}
          <b>본인이 생각하는 적절한 주제 분리 지점을 찾아 표시</b>해주시면
          됩니다.
        </div>
        <div>
          &nbsp;&nbsp;마지막으로 아래의 주제 분리 실험에 대한 사용자 인터페이스
          환경에 대한 안내 동영상을 시청하시고 실험을 시작하시면 되겠습니다.
        </div>
        <div>&nbsp;</div>
        {/* <div style={{ color: "#777777" }}>
          <div>( 동영상으로 교체 예정 )</div>
          <div>1. 실험 전 화면</div>
          <div>&nbsp;</div>
          <div>2. 실험 중 화면</div>
          <div>2.1. 동영상 단축키</div>
          <div>- space : 재생/일시정지</div>
          <div>- 왼쪽 오른쪽 화살표 : 5초 뒤로/앞으로</div>
          <div>- 위 아래 화살표 : 소리 증가/축소</div>
          <div>
            - &#60;(shift + ,)&nbsp;&nbsp;&#62;(shift + .) : 재생 속도
            느리게/빠르게
          </div>
          <div>&nbsp;</div>
          <div>2.2. 스크롤 버튼</div>
          <div>동영상 재생시간에 맞춰 대본 스크롤 기능</div>
          <div>&nbsp;</div>
          <div>2.3. 대본</div>
          <div>체크박스로 주제 분리</div>
          <div>&nbsp;</div>
          <div>2.4. 주제 분리(체크박스)시 함께 발생하는 반응들</div>
          <div>주제 분리 색상, 미니맵, 분리된 주제의 수</div>
          <div>&nbsp;</div>
          <div>3. 실험 후 화면</div>
        </div> */}
        <VideoPlayer
          name="test_ui_introduction"
          width={600}
          ref={videoPlayerRef}
        ></VideoPlayer>
        {/* <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src="/evaluation/example_of_test_subjects.jpg"
              width={300}
            ></Image>
          </div>
          <div className={styles.lastContentText}>
            &nbsp;&nbsp;체크박스는 발화 혹은 문장이 끝날 때마다 있습니다. 같은
            색상이 칠해지는 발화 및 문장들은 하나의 주제로 분리됨을 나타냅니다.
          </div> */}
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          연구대상자에게 예상되는 이익 및 해
        </Title>
        <div>
          여러분께 직접적인 이익이 되는 점은 없으나, 참여하여 주신 연구의 정보를
          바탕으로 더 나은 토론의 주제 분리 모델 개발에 기여하시게 됩니다.
          이를통해 여러분께서는 학문의 외연을 넓히는 데 공헌하시게 됩니다.
        </div>
        <div className={styles.lastContentText}>
          &nbsp;&nbsp;여러분께 예상되는 피해(모든 정신적, 사회적, 정치적,
          신체적, 심리적인 불편이나 위해 등)는 미미할 것으로 예상됩니다. 제시된
          대본을 읽고 글이 분리되는 곳을 표시만 하면 되는 실험이기 때문입니다.
        </div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          연구참여에 따른 혜택
        </Title>
        <div className={styles.lastContentText}>
          소정의 사례 1만원을 드립니다.
        </div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          자발적 참여, 자유로운 동의의 철회
        </Title>
        <div className={styles.lastContentText}>
          여러분은 언제라도 연구담당자에게 통보하여 동의를 취소할 수 있습니다.
          여러분이 동의하신 것을 철회하면 연구담당자는 여러분의 주제 분리 결과
          정보를 더 이상 사용할 수 없습니다.
        </div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          연구자료 및 개인정보 보호에 관한 사항
        </Title>
        {/* <div className={styles.lastContentText}>
            본 연구를 위하여 수집하는 여러분의 개인정보는 없습니다.
          </div> */}
        <div className={styles.lastContentText}>
          <b>본 연구를 위하여 수집하는 여러분의 개인정보</b>는{" "}
          <b>연령대, 성별, 직업/전공</b> 입니다. 여러분의{" "}
          <b>개인정보를 보유 및 이용하는 기간</b>은 정보수집·이용목적 달성 시
          까지입니다. 여러분은 위 정보수집 및 이용에 대한 수락 여부를 자유롭게
          결정하실 수 있으며, 언제라도 참여를 중단할 권리가 있음을 알려드립니다.
          여러분의 신원을 파악할 수 있는 기록은 비밀로 보장됩니다.
        </div>
        <div>&nbsp;</div>
        <Title className={styles.subtitle} level={5}>
          기타
        </Title>
        {/* <div className={styles.lastContentText}>
            연구내용 및 방법이 설명문/동의서와 다르거나, 보상이나 모집방법 등이
            부당하다고 생각되시거나, 연구참여 거부로 인해 불이익을 받으셨다고
            생각되시거나, 연구참여 후 다양한 문제가 발생하였을 때, 혹은
            연구대상자의 권리 등에 대한 문의가 있을 때에도 아주대학교
            기관생명윤리위원회(031-219-3743~4, ajouirb@ajou.ac.kr)에 연락하실 수
            있습니다.
          </div> */}
        <div>
          연구내용 및 방법이 설명문/동의서와 다르거나, 보상이나 모집방법 등이
          부당하다고 생각되시거나, 연구참여 거부로 인해 불이익을 받으셨다고
          생각되시거나, 연구참여 후 다양한 문제가 발생하였을 때, 혹은
          연구대상자의 권리 등에 대한 문의가 있을 때 연구담당자(010-8608-6708,
          hapsoa@ajou.ac.kr)에게 연락하실 수 있습니다. 연구담당자와 부득이하게
          소통이 안된다면 아주대학교 기관생명윤리위원회(031-219-3743~4,
          ajouirb@ajou.ac.kr)에 연락하실 수 있습니다.
        </div>
      </div>
    </div>
  );
}

export default TestDescription;
