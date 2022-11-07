/* eslint-disable no-unused-vars */
import React from "react";
import { UtteranceObject } from "../../interfaces/DebateDataInterface";
import styles from "./TranscriptViewerM.module.scss";

const utteranceOjbects: UtteranceObject[] = require("../../data/sample/utterance_objects.json");

interface ComponentProps {
  zxcvzxcv: string;
}
interface ComponentState {
  aaa: number;
  bbb: number;
  utteranceOjbects: UtteranceObject[];
}
class TranscriptViewerM extends React.Component<
  ComponentProps,
  ComponentState
> {
  // Start Part
  constructor(props: ComponentProps) {
    console.log("start");

    // External Import Data
    super(props);

    // Current Component Data
    this.state = {
      utteranceOjbects,
      aaa: 123,
      bbb: 234,
    };

    console.log("props", props);
    console.log("this.state", this.state);
  }

  // when the view is mounted, this method is called
  componentDidMount() {
    console.log("mount");

    // change state data
    this.setState({
      aaa: 23455655,
    });
  }

  // when the state data is changed, this method is called
  componentDidUpdate() {
    console.log("update");
  }

  render() {
    // HTML part
    return <div className={styles.component}>class-component-template</div>;
  }
}

export default TranscriptViewerM;
