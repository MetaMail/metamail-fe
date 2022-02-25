import { Button, Input, notification, Upload } from 'antd';
import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import styles from './index.less';
import 'react-quill/dist/quill.snow.css';
import { sendMail, updateMail, uploadAttachment } from '@/services';
import { IPersonItem, MetaMailTypeEn } from '../home/interfaces';
import CryptoJS from 'crypto-js';
import Icon from '@/components/Icon';
import { attachment, trash } from '@/assets/icons';
import { connect, history } from 'umi';
import { AttachmentRelatedTypeEn, metaPack } from './utils';
import { getPersonalSign } from '@/utils/sign';
import useInterval from '@/utils/hooks';

export interface INewModalHandles {
  open: (draftID?: string) => void;
  hasDraft: () => boolean;
}

const NewMail = (props: any) => {
  const {
    location: { query },
    randomBits,
  } = props;

  const [subject, setSubject] = useState<string>();
  const [receiver, setReceiver] = useState<IPersonItem[]>([]);
  const [toStr, setToStr] = useState<string>('');

  const draftID = query?.id;
  const type: MetaMailTypeEn = Number(query?.type);

  const reactQuillRef = useRef<ReactQuill>();
  const quillRef = useRef<any>();
  const dateRef = useRef<string>();

  useEffect(() => {
    if (typeof reactQuillRef?.current?.getEditor !== 'function') return;

    quillRef.current = reactQuillRef.current.makeUnprivilegedEditor(
      reactQuillRef.current.getEditor(),
    );
  }, [reactQuillRef]);

  const handleSend = async () => {
    if (!draftID) return;

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
      handleSave();

      const html = quillRef.current.getHTML(),
        text = quillRef.current.getText();

      metaPack({
        from: props.address,
        to: receiver,
        date: new Date(),
        subject,
        text_hash: CryptoJS.SHA256(text).toString(),
        html_hash: CryptoJS.SHA256(html).toString(),
      }).then(async (res) => {
        const { packedResult, keys } = res ?? {};

        console.log('res', res);
        getPersonalSign(props.address, packedResult).then(async (signature) => {
          const { data } =
            (await sendMail(draftID, {
              date: dateRef.current,
              signature: signature,
              keys,
              data: packedResult,
            })) ?? {};

          if (data) {
            notification.success({
              message: 'Sent',
              description: 'Your message has been sent successfully.',
            });

            history.push({
              pathname: '/home/list',
            });
          }
        });
      });
    } catch (error) {
      notification.error({
        message: 'Failed Send',
        description: '' + error,
      });
    }
  };

  const handleSave = async () => {
    if (!draftID) return;

    try {
      const { data } =
        (await updateMail(draftID, {
          subject: subject ?? '(No Subject)',
          mail_to: receiver,
          part_html: CryptoJS.AES.encrypt(
            quillRef.current.getHTML(),
            props.publicKey,
          ).toString(),
          part_text: CryptoJS.AES.encrypt(
            quillRef.current.getText(),
            props.publicKey,
          ).toString(),
        })) ?? {};

      if (data?.message_id !== draftID) {
        console.warn('DANGER: wrong updating source');
      }

      dateRef.current = data?.mail_date;
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

  const handleUploadAttachment = async (
    attachment: Blob,
    sha256: string,
    related: AttachmentRelatedTypeEn,
    cid?: string,
  ) => {
    try {
      const form = new FormData();

      form.append('attachment', attachment);
      form.append('sha256', sha256);
      form.append('related', related);
      cid && form.append('cid', cid);

      const { data } = await uploadAttachment(draftID, form);
    } catch {
      notification.error({
        message: 'Failed Upload',
        description: 'Sorry, attachment can not upload to the server.',
      });
    }
  };

  const handleFinalFileUpload = (file: File) => {
    const reader = new FileReader();

    let res;
    reader.onload = () => {
      if (reader?.result) {
        const input = reader.result;

        const wordArray = CryptoJS.lib.WordArray.create(input as any);

        const sha256 = CryptoJS.SHA256(wordArray).toString();

        handleUploadAttachment(file, sha256, AttachmentRelatedTypeEn.Outside);
      }
    };

    reader.readAsArrayBuffer(file);
    return res;
  };

  // useInterval(() => {
  //   handleSave();
  // }, 5000);

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
        maxCount={5}
        beforeUpload={(file) => {
          const reader = new FileReader();

          reader.readAsArrayBuffer(file);

          reader.onload = () => {
            if (reader?.result) {
              const input = reader.result;
              const fileProps = {
                type: file.type,
                lastModified: file.lastModified,
              };

              let finalFile = new File([new Blob([input])], file.name, {
                ...fileProps,
              });

              if (type === MetaMailTypeEn.Encrypted) {
                const encrypted = CryptoJS.AES.encrypt(
                  CryptoJS.lib.WordArray.create(input as any),
                  randomBits,
                ).toString();

                const fileEncBlob = new Blob([encrypted]);

                finalFile = new File([fileEncBlob], file.name, {
                  ...fileProps,
                });
              }

              handleFinalFileUpload(finalFile);
            }
          };
        }}
      >
        <div className={styles.uploadBar}>
          <div className={styles.btn}>
            <Icon url={attachment} />
            <span>Upload</span>
          </div>
          <span className={styles.tip}>（Single file up to 1GB）</span>
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

const mapStateToProps = (state: any) => {
  return state.user ?? {};
};

export default connect(mapStateToProps)(NewMail);
