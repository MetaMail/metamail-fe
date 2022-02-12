import { Button, Input, Modal } from 'antd';
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import styles from './index.less';

interface INewModal {}

export interface INewModalHandles {
  open: (draftID?: string) => void;
  hasDraft: () => boolean;
}

export default forwardRef(function NewModal(
  {}: INewModal,
  ref: React.Ref<INewModalHandles>,
) {
  const [visible, setVisible] = useState(false);
  const draftIdRef = useRef<string>();

  const handleCloseModal = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open: (draftID?: string) => {
      setVisible(true);
      if (draftID) {
        draftIdRef.current = draftID;
      }
    },
    hasDraft: () => {
      if (draftIdRef.current && draftIdRef.current?.length > 0) {
        return true;
      }
      return false;
    },
  }));

  return (
    <Modal
      title={'New Email'}
      visible={visible}
      footer={null}
      closable
      onCancel={handleCloseModal}
      style={{ borderRadius: '4px' }}
    >
      <div className={styles.container}>
        <Input placeholder="To" />
        <Input placeholder="Subject" />
        <Input.TextArea rows={3} />

        <div className={styles.footer}>
          <Button>Save</Button>
          <Button type="primary" style={{ marginLeft: '12px' }}>
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
});
