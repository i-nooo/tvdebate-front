/* eslint-disable no-unused-vars */
import React from "react";
import styles from "./ClassComponentTemplate.module.scss";

interface ComponentProps {}
interface ComponentState {}
class ClassComponentTemplate extends React.Component<
  ComponentProps,
  ComponentState
> {
  constructor(props: ComponentProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <div className={styles.component}>class-component-template</div>;
  }
}

export default ClassComponentTemplate;
