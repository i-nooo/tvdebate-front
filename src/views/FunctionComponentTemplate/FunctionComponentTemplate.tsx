/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import styles from "./FunctionComponentTemplate.module.scss";

interface ComponentProps {}

function FunctionComponentTemplate(props: ComponentProps) {
  useEffect(() => {}, []);

  return <div className={styles.component}>function-component-template</div>;
}

export default FunctionComponentTemplate;
