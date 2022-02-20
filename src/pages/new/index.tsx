import {
  Alert,
  Button,
  Divider,
  Input,
  Modal,
  notification,
  Upload,
} from 'antd';
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
import Icon from '@/components/Icon';
import { attachment, trash } from '@/assets';

export interface INewModalHandles {
  open: (draftID?: string) => void;
  hasDraft: () => boolean;
}

export default (props: any) => {
  const {
    location: { query },
  } = props;

  const [subject, setSubject] = useState<string>();
  const [receiver, setReceiver] = useState<IPersonItem[]>([]);
  const [toStr, setToStr] = useState<string>('');

  const draftIdRef = useRef<string>(query?.id);
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

    if (receiver?.length < 1) {
      notification.error({
        message: 'No Receipt',
        description: 'At lease 1 receipt',
      });

      return;
    }

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
      const { data } =
        (await updateMail(draftIdRef.current, {
          subject: subject ?? '(No Subject)',
          mail_to: receiver,
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

  const handleFormatReceivers = () => {
    const values = toStr?.split(';');
    const res: IPersonItem[] = [];

    values?.forEach((item) => {
      if (
        !new RegExp(
          /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/g,
        ).test(item)
      ) {
        notification.warn({
          message: 'Invalid address',
          description: `receipt\'s address ${item} is not a valid address, please check.`,
        });
      } else {
        res.push({
          address: item,
          name: '',
        });
      }
    });

    setReceiver(res);
    setToStr(res?.map((item) => item.address).join(';'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Icon
          url={trash}
          onClick={() => {
            notification.warn({
              message: 'TODO: 删除草稿接口',
            });
          }}
          style={{ marginRight: '8px' }}
        />
      </div>
      <Input
        prefix={
          <div style={{ width: '56px', textAlign: 'right' }}>Subject:</div>
        }
        bordered
        style={{
          borderColor: '#ccc',
        }}
        onChange={(e) => {
          e.preventDefault();
          setSubject(e.target.value);
        }}
      />
      <Input
        checked
        prefix={<div style={{ width: '56px', textAlign: 'right' }}>To:</div>}
        style={{
          borderColor: '#ccc',
          marginTop: '4px',
        }}
        onChange={(e) => {
          e.preventDefault();
          setToStr(e.target.value);
        }}
        onBlur={handleFormatReceivers}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleFormatReceivers();
          }
        }}
        value={toStr}
      />

      <Upload
        beforeUpload={(file) => {
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
        <div className={styles.uploadBar}>
          <div className={styles.btn}>
            <Icon url={attachment} />
            <span>Upload</span>
          </div>
          <span className={styles.tip}>（Single file up to 1g）</span>
        </div>
      </Upload>

      <div className={styles.content}>
        <ReactQuill
          ref={(el) => {
            el ? (reactQuillRef.current = el) : void 0;
          }}
          style={{
            height: '100%',
          }}
          theme="snow"
          placeholder={'Writing your message here...'}
        />
      </div>

      <div className={styles.footer}>
        <Button
          type="primary"
          style={{ borderRadius: '6px', width: '100px' }}
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
