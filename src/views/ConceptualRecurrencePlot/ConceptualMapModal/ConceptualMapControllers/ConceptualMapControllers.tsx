/* eslint-disable no-unused-vars */
import { Checkbox } from "antd";
import React from "react";
import SliderWithInput from "../../../../components/SliderWithInput/SliderWithInput";
import { ConceptualMapDrawer } from "../ConceptualMapDrawer";
import { GraphDataStructureMaker } from "../GraphDataStructureMaker";
import styles from "./ConceptualMapControllers.module.scss";

interface ComponentProps {
  conceptualMapDrawer?: ConceptualMapDrawer;
  graphDataStructureMaker?: GraphDataStructureMaker;
  maxCooccurrence: number;
  standardTermCount: number;
  maxOfLinksPerNode: number;
  showNodeNotHavingLinks: boolean;
  standardTermCountSliderListener: (changedValue: number) => void;
  maxOfLinksPerNodeSliderListener: (changedValue: number) => void;
  showNodeNotHavingLinksCheckboxListener: (checked: boolean) => void;
}
interface ComponentState {
  nodeSizeMultiplier: number;
}

class ConceptualMapControllers extends React.Component<
  ComponentProps,
  ComponentState
> {
  constructor(props: ComponentProps) {
    super(props);
    this.state = {
      nodeSizeMultiplier: 1,
    };
  }

  render() {
    return (
      <div className={styles.conceptualMapControllers}>
        <div>Node Size Multiplier</div>
        <SliderWithInput
          min={1}
          max={10}
          value={this.state.nodeSizeMultiplier}
          onChangeListener={(changedValue) => {
            this.props.conceptualMapDrawer!.setNodeSizeMultiplier(changedValue);
            this.props.conceptualMapDrawer!.updateGraph();

            this.setState({
              nodeSizeMultiplier: changedValue,
            });
          }}
        ></SliderWithInput>

        <div>Standard High Cooccurrence Count to Generate Links</div>
        <SliderWithInput
          min={0}
          max={this.props.maxCooccurrence}
          value={this.props.standardTermCount}
          onChangeListener={(changedValue) => {
            // Make new nodes, links
            const nodesAndLinks = this.props.graphDataStructureMaker!.generateNodesAndLinks(
              changedValue,
              this.props.maxOfLinksPerNode,
              this.props.showNodeNotHavingLinks
            );
            this.props.conceptualMapDrawer!.setGraphData(nodesAndLinks);
            this.props.conceptualMapDrawer!.updateGraph();

            this.props.standardTermCountSliderListener(changedValue);
          }}
        ></SliderWithInput>

        <div>Number of Links per a Node</div>
        <SliderWithInput
          min={0}
          max={10}
          value={this.props.maxOfLinksPerNode}
          onChangeListener={(changedValue) => {
            // make new nodes, links
            const nodesAndLinks = this.props.graphDataStructureMaker!.generateNodesAndLinks(
              this.props.standardTermCount,
              changedValue,
              this.props.showNodeNotHavingLinks
            );
            this.props.conceptualMapDrawer!.setGraphData(nodesAndLinks);
            this.props.conceptualMapDrawer!.updateGraph();

            this.props.maxOfLinksPerNodeSliderListener(changedValue);
          }}
        ></SliderWithInput>

        <Checkbox
          className={styles.checkbox}
          defaultChecked
          onChange={(event) => {
            const showNodeNotHavingLinks = event.target.checked;
            // make new nodes, links
            const nodesAndLinks = this.props.graphDataStructureMaker!.generateNodesAndLinks(
              this.props.standardTermCount,
              this.props.maxOfLinksPerNode,
              showNodeNotHavingLinks
            );
            this.props.conceptualMapDrawer!.setGraphData(nodesAndLinks);
            this.props.conceptualMapDrawer!.updateGraph();

            this.props.showNodeNotHavingLinksCheckboxListener(
              showNodeNotHavingLinks
            );
          }}
        >
          Nodes not having Link
        </Checkbox>

        <Checkbox
          className={styles.checkbox}
          onChange={(event) => {
            this.props.conceptualMapDrawer!.sentimentMarkerVisible =
              event.target.checked;
            this.props.conceptualMapDrawer!.updateGraph();
          }}
        >
          Sentiment Marker
        </Checkbox>

        <div style={{ marginBottom: 12 }}>
          checkbox for &apos;at least 1 link or not&apos;
        </div>
      </div>
    );
  }
}

export default ConceptualMapControllers;
