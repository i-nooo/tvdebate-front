/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import styles from "./SubjectTestEnd.module.scss";

interface ComponentProps {}

function SubjectTestEnd(props: ComponentProps) {
  useEffect(() => {}, []);

  return (
    <div className={styles.component}>
      <div className={styles.text} style={{ marginTop: "10%" }}>
        실험이 끝났습니다
      </div>
      <div className={styles.text}>감사합니다</div>
      <div style={{ width: 600, marginTop: 32 }}>
        실험이 마음에 드셨나요? 혹시 그렇다면 다른 토론으로 실험에 다시 참여하실
        수 있습니다. 실험에 참가한 수만큼 실험 참가 사례를 중복해 드립니다. 관심
        있으신 분은 연구담당자 허재종(010-8608-6708, hapsoa@ajou.ac.kr)에게
        연락주세요.
      </div>
      <div>&nbsp;</div>
      <div>실험에 참여해주신 모든 여러분께 감사드립니다. 좋은 하루 되세요!</div>
    </div>
  );
}

export default SubjectTestEnd;
