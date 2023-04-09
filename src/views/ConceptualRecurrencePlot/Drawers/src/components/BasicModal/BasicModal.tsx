/* eslint-disable no-unused-vars */
import { Modal } from "antd";
import React, { forwardRef, Ref, useEffect, useImperativeHandle } from "react";
import styles from "./BasicModal.module.scss";

interface ComponentProps {}

export interface BasicModalRef {
  openModal: (p: {
    title: string;
    text: string;
    okListener: (() => void) | (() => Promise<any>) | null;
    loadingOn?: boolean;
  }) => void;
}

let okListener: (() => void) | (() => Promise<any>) | null = null;
let loadingOn: boolean = false;

function BasicModal(props: ComponentProps, ref: Ref<BasicModalRef>) {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false);
  const [modalTitle, setModalTitle] = React.useState<string>("title");
  const [modalText, setModalText] = React.useState<string>(
    "Content of the modal"
  );

  const openModal = (p: {
    title: string;
    text: string;
    okListener: (() => void) | (() => Promise<any>) | null;
    loadingOn?: boolean;
  }) => {
    setModalTitle(p.title);
    setModalText(p.text);
    setConfirmLoading(false);

    okListener = p.okListener;

    if (p.loadingOn) {
      loadingOn = p.loadingOn;
    }

    setVisible(true);
  };

  const handleOk = () => {
    // setModalText("The modal will be closed after two seconds");
    // setConfirmLoading(true);
    // setTimeout(() => {
    //   setVisible(false);
    //   setConfirmLoading(false);
    // }, 2000);

    // setConfirmLoading(true);

    if (okListener) {
      const promise = okListener();

      if (promise) {
        setConfirmLoading(true);
        promise.then(() => {
          setVisible(false);
        });
      } else {
        setVisible(false);
      }
    } else {
      setVisible(false);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  useEffect(() => {}, []);

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
      width={undefined} // number | undefined
    >
      <p>{modalText}</p>
    </Modal>
  );
}

export default forwardRef(BasicModal);
