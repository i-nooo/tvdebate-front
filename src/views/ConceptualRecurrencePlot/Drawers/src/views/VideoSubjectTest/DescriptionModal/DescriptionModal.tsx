/* eslint-disable no-unused-vars */
import { Modal, Image } from "antd";
import Title from "antd/lib/typography/Title";
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import TestDescriptionContent, {
  TestDescriptionContentRef,
} from "../../../components/TestDescriptionContent/TestDescriptionContent";
import styles from "./DescriptionModal.module.scss";

interface ComponentProps {
  height: number;
}

export interface DescriptionModalRef {
  openModal: (p: {
    title: string;
    text: string;
    okListener: () => void;
  }) => void;
}

let okListener: (() => void) | null = null;

function DescriptionModal(
  props: ComponentProps,
  ref: Ref<DescriptionModalRef>
) {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);
  const [modalTitle, setModalTitle] = React.useState<string>("title");
  const [modalText, setModalText] = React.useState<string>(
    "Content of the modal"
  );
  const [modalHeight, setModalHeight] = React.useState<number>(500);

  const testDescriptionContentRef = useRef<TestDescriptionContentRef>(null);

  const openModal = (p: {
    title: string;
    text: string;
    okListener: () => void;
  }) => {
    setModalTitle(p.title);
    setModalText(p.text);

    okListener = p.okListener;

    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
    if (okListener) {
      okListener();
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    const resizeListener = (event: UIEvent) => {
      // videoJsPlayer.width(componentRef.current!.clientWidth - 32);

      //
      setModalHeight(window.innerHeight - 300);
    };

    window.addEventListener("resize", resizeListener);

    window.dispatchEvent(new Event("resize"));

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  return (
    <Modal
      title={modalTitle}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      className={styles.component}
      maskClosable={false}
      width={700} // number | undefined
      bodyStyle={{ height: modalHeight, overflow: "auto" }}
    >
      <TestDescriptionContent
      // ref={testDescriptionContentRef}
      ></TestDescriptionContent>
    </Modal>
  );
}

export default forwardRef(DescriptionModal);
