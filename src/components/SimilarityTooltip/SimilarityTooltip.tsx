/**
 * Tooltip for Participant Rect
 */

/* eslint-disable no-unused-vars */
import { Popover } from "antd";
import { PopoverProps } from "antd/lib/popover";
import _ from "lodash";
import { transform } from "lodash";
import React, { useEffect, useState, Ref } from "react";
import { findTopValueIndexes } from "../../common_functions/findTopValueIndexes";
import { DebateDataSet } from "../../interfaces/DebateDataInterface";
import { D3Drawer } from "../../views/ConceptualRecurrencePlot/Drawers/D3Drawer";
import {
  UtteranceObjectForDrawing,
  SimilarityBlock,
} from "../../views/ConceptualRecurrencePlot/interfaces";
import styles from "./SimilarityTooltip.module.scss";

export interface SvgTooltipRef {}

interface ComponentProps {
  utteranceObjectForDrawing: UtteranceObjectForDrawing | null;
  //mouseoveredUtteranceIndex?: number;
  similarityBlock: SimilarityBlock | null;
  transform: d3.ZoomTransform | null;
  open: boolean;
  d3Drawer: D3Drawer | null;
  debateDataset: DebateDataSet | null;
}

function SimilarityTooltip(props: ComponentProps, ref: Ref<SvgTooltipRef>) {
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);
  const { beginningPointOfX, beginningPointOfY, width, height } =
    props.similarityBlock || {};

  const getIconForUtteranceName = (utteranceName: string) => {
    let iconDrawer;
    switch (utteranceName) {
      case "이준석":
      case "박휘락":
        iconDrawer =
          props.d3Drawer?.insistenceIconDrawerTwo.similarityBlock ===
          props.similarityBlock
            ? props.d3Drawer?.insistenceIconDrawerTwo
            : props.d3Drawer?.insistenceIconDrawer;
        break;
      case "김종대":
      case "장경태":
        iconDrawer =
          props.d3Drawer?.insistenceIconDrawer.similarityBlock ===
          props.similarityBlock
            ? props.d3Drawer?.insistenceIconDrawer
            : props.d3Drawer?.insistenceIconDrawerTwo;
        break;
      default:
        return null;
    }

    if (iconDrawer) {
      return (
        ///@ts-ignore
        <div dangerouslySetInnerHTML={{ __html: iconDrawer.update() }} />
      );
    }
    return null;
  };

  return (
    <div
      style={{
        position: "absolute",
        left: beginningPointOfX,
        top: beginningPointOfY,
        width,
        height,
        transform: props.transform
          ? `translate(${props.similarityBlock?.beginningPointOfX}px, ${props.similarityBlock?.beginningPointOfY}px) scale(${props.transform.k} rotate(-45))`
          : "",
      }}
    >
      <Popover
        placement="top"
        title={() => {
          return `${props.similarityBlock?.colUtteranceName} : ${props.similarityBlock?.rowUtteranceName}`;
        }}
        content={() => {
          return getIconForUtteranceName(
            //@ts-ignore
            props.similarityBlock?.colUtteranceName
          );
        }}
        //trigger="click"
        open={open}
        onOpenChange={handleVisibleChange}
        overlayClassName={styles.popover}
      ></Popover>
    </div>
  );

  function handleVisibleChange(open: boolean) {
    setOpen(open);
  }
}

export default SimilarityTooltip;
