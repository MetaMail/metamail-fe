import { Button, Input, Modal, notification } from 'antd';
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import ReactQuill, { Quill } from 'react-quill';
import styles from './index.less';
import 'react-quill/dist/quill.snow.css';
import { sendMail, updateMail } from '@/services';
import { IPersonItem } from '../home/interfaces';

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
  const [subject, setSubject] = useState<string>();
  const [receiver, setReceiver] = useState<IPersonItem>();

  const draftIdRef = useRef<string>();
  const reactQuillRef = useRef<ReactQuill>();
  const quillRef = useRef<any>();
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

  useEffect(() => {
    if (typeof reactQuillRef?.current?.getEditor !== 'function') return;

    quillRef.current = reactQuillRef.current.makeUnprivilegedEditor(
      reactQuillRef.current.getEditor(),
    );
  }, [reactQuillRef]);

  const handleSend = async () => {
    if (!draftIdRef.current) return;

    try {
      handleSave();

      const { data } = (await sendMail(draftIdRef?.current)) ?? {};

      if (data) {
        setVisible(false);

        notification.success({
          message: 'Sent',
          description: 'Your message has been sent successfully.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed Send',
        description: '' + error,
      });
    }
  };

  const handleSave = async () => {
    if (!draftIdRef.current) return;

    if (
      !quillRef.current ||
      !quillRef.current?.getHTML ||
      !quillRef.current?.getText
    ) {
      notification.error({
        message: 'ERROR',
        description: 'Failed to get message content',
      });

      return;
    }

    try {
      if (!receiver || !receiver?.address || receiver?.address?.length === 0) {
        throw new Error('Receipt can NOT be empty');
      } else if (
        !new RegExp(
          /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/g,
        ).test(receiver?.address)
      ) {
        throw new Error("Wrong format of receipt's address");
      }

      const { data } =
        (await updateMail(draftIdRef.current, {
          subject: subject ?? '(No Subject)',
          mail_to: [receiver],
          part_html: quillRef.current.getHTML(),
          part_text: quillRef.current.getText(),
        })) ?? {};

      if (data?.message_id !== draftIdRef?.current) {
        console.warn('DANGER: wrong updating source');
      } else {
        notification.success({
          message: 'Saved',
          description: 'Your message has been saved successfully.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Invalid mail content',
        description: '' + error,
      });
    }
  };

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
        <Input
          placeholder="To"
          checked
          onChange={(e) => {
            e.preventDefault();
            setReceiver({
              name: 'test',
              address: e.target.value,
            });
          }}
        />
        <Input
          placeholder="Subject"
          onChange={(e) => {
            e.preventDefault();
            setSubject(e.target.value);
          }}
        />

        <div>
          <ReactQuill
            ref={(el) => {
              el ? (reactQuillRef.current = el) : void 0;
            }}
            theme="snow"
            className={styles.content}
            placeholder={'Writing your message here...'}
          />
        </div>

        <div className={styles.footer}>
          <Button onClick={handleSave}>Save</Button>
          <Button
            type="primary"
            style={{ marginLeft: '12px' }}
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
});
