import { Alert, Button, Input, Modal, notification, Upload } from 'antd';
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill, { Quill } from 'react-quill';
import styles from './index.less';
import 'react-quill/dist/quill.snow.css';
import { sendMail, updateMail } from '@/services';
import { IPersonItem } from '../home/interfaces';
import CryptoJS from 'crypto-js';

export interface INewModalHandles {
  open: (draftID?: string) => void;
  hasDraft: () => boolean;
}

export default () => {
  const [subject, setSubject] = useState<string>();
  const [receiver, setReceiver] = useState<IPersonItem>();

  const draftIdRef = useRef<string>();
  const reactQuillRef = useRef<ReactQuill>();
  const quillRef = useRef<any>();

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
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          onClick={() => {
            notification.warn({
              message: 'TODO: 删除草稿接口',
            });
          }}
          style={{ marginRight: '8px' }}
        >
          Delete
        </Button>
        <Upload
          beforeUpload={(file, list) => {
            const reader = new FileReader();
            reader.onload = () => {
              var key = '1234567887654321';
              if (reader?.result) {
                var wordArray = CryptoJS.lib.WordArray.create(
                  reader.result as any,
                );

                // Convert: ArrayBuffer -> WordArray
                var encrypted = CryptoJS.AES.encrypt(wordArray, key).toString(); // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

                var fileEnc = new Blob([encrypted]); // Create blob from string

                var a = document.createElement('a');
                var url = window.URL.createObjectURL(fileEnc);
                var filename = file.name;
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
              }
            };
            reader.readAsArrayBuffer(file);
          }}
        >
          <Button icon={<UploadOutlined />}>Attachments</Button>
        </Upload>
      </div>
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
  );
};

// ============  以弹窗形式透出新建邮箱页面 ============
// export default forwardRef(function NewModal(
//   {}: INewModal,
//   ref: React.Ref<INewModalHandles>,
// ) {
//   const [visible, setVisible] = useState(false);

//   const handleCloseModal = () => {
//     setVisible(false);
//   };

//   useImperativeHandle(ref, () => ({
//     open: (draftID?: string) => {
//       setVisible(true);
//       // if (draftID) {
//       //   draftIdRef.current = draftID;
//       // }
//     },
//     hasDraft: () => {
//       // if (draftIdRef.current && draftIdRef.current?.length > 0) {
//       //   return true;
//       // }
//       return false;
//     },
//   }));

//   return (
//     <Modal
//       title={'New Email'}
//       visible={visible}
//       footer={null}
//       closable
//       onCancel={handleCloseModal}
//       style={{ borderRadius: '4px' }}
//     >
//       <NewMail />
//     </Modal>
//   );
// });
