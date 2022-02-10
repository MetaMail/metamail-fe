import { Button, Input, Modal } from 'antd';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styles from './index.less';

interface INewModal {}

export interface INewModalHandles {
  open: () => void;
}

export default forwardRef(function NewModal(
  {}: INewModal,
  ref: React.Ref<INewModalHandles>,
) {
  const [visible, setVisible] = useState(false);

  const handleCloseModal = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
  }));

  return (
    <Modal
      title={'New Email'}
      visible={visible}
      destroyOnClose
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
