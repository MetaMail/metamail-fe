import { Button, Input, message, notification, Upload } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { changeMailStatus, IMailChangeParams } from '@/services';
import ReactQuill from 'react-quill';
import styles from './index.less';
import 'react-quill/dist/quill.snow.css';
import {
  deleteAttachment,
  getMailDetailByID,
  sendMail,
  updateMail,
  uploadAttachment,
} from '@/services';
import {
  IPersonItem,
  MetaMailTypeEn,
  MarkTypeEn,
  IMailContentItem,
  MailBoxTypeEn,
} from '../home/interfaces';
import CryptoJS from 'crypto-js';
import Icon from '@/components/Icon';
import { attachment, trash } from '@/assets/icons';
import { connect, history } from 'umi';
import {
  AttachmentRelatedTypeEn,
  metaPack,
  handleGetReceiversInfos,
} from './utils';
import { getPersonalSign } from '@/utils/sign';
import useInterval from '@/utils/hooks';
import { PostfixOfAddress } from '@/utils/constants';
import { EditorFormats, EditorModules } from './constants';
import { pkEncrypt } from '@/layouts/SideMenu/utils';
import locked from '@/assets/images/locked.svg';
import ReceiverGroup from './ReceiverGroup';
import { getUserInfo, getWalletAddress } from '@/store/user';
import { clearMailContent, getMailContent } from '@/store/mail';

export interface INewModalHandles {
  open: (draftID?: string) => void;
  hasDraft: () => boolean;
}

const NewMail = (props: any) => {
  const {
    location: { query },
    randomBits,
  } = props;

  const { address, ensName, showName, publicKey } = getUserInfo();

  const [subject, setSubject] = useState<string>('');

  const [receivers, setReceivers] = useState<IPersonItem[]>([]);

  const [content, setContent] = useState<string>('');
  const [attList, setAttList] = useState<any[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>();

  const draftID = query?.id;
  const type: MetaMailTypeEn = Number(query?.type);

  const reactQuillRef = useRef<ReactQuill>();
  const myKeyRef = useRef<string>();
  const currRandomBitsRef = useRef<string>(randomBits);
  const dateRef = useRef<string>();
  const allowSaveRef = useRef(true);
  const getQuill = () => {
    if (typeof reactQuillRef?.current?.getEditor !== 'function') return;

    return reactQuillRef.current.makeUnprivilegedEditor(
      reactQuillRef.current.getEditor(),
    );
  };
  const handleDelete = async (
    inputMails: IMailChangeParams[],
    mark: MarkTypeEn,
  ) => {
    const mails = inputMails;
    try {
      await changeMailStatus(mails, mark, undefined);
    } catch {
      notification.error({
        message: 'Failed',
        description: 'Sorry, network problem.',
      });
    } finally {
      history.go(-1);
    }
  };
  useEffect(() => {
    handleLoad();

    return () => {
      clearMailContent();
    };
  }, [query]);

  const handleLoad = async () => {
    try {
      if (!query?.id && query.id.length === 0) {
        throw new Error();
      }
      const { data } = await getMailDetailByID(window.btoa(query.id));
      const mail = data as IMailContentItem;
      if (mail) {
        //const { subject, mail_to, part_html } = getMailContent();
        //console.log(subject);
        setSubject(mail?.subject);
        setReceivers(mail?.mail_to);
        setContent(mail?.part_html ?? mail?.part_text);
        setAttList(mail?.attachments);
        const { subject, mail_to, part_html } = getMailContent();
        subject && setSubject(subject);
        mail_to && setReceivers(mail_to);
        part_html && setContent(part_html);
        if (type === MetaMailTypeEn.Encrypted && !currRandomBitsRef.current) {
          setEditable(false);
        } else {
          setEditable(true);
        }
        setLoaded(true);
        if (mail?.meta_header?.keys)
          myKeyRef.current = mail?.meta_header?.keys?.[0];
      }
    } catch {
      //notification.error({
      //  message: 'Network Error',
      //  description: 'Can not fetch detail info of this email for now.',
      //});
    }
  };

  const handleDecrypted = async () => {
    if (!myKeyRef.current) return;

    // @ts-ignore
    let randomBits = await ethereum.request({
      method: 'eth_decrypt',
      params: [Buffer.from(myKeyRef.current, 'base64').toString(), address],
    });
    if (!randomBits) return;

    currRandomBitsRef.current = randomBits;
    const decryptedContent = CryptoJS.AES.decrypt(
      content,
      currRandomBitsRef.current,
    ).toString(CryptoJS.enc.Utf8);
    setContent(decryptedContent);
    setEditable(true);
  };

  const handleSend = async (
    keys: string[],
    packedResult: string,
    signature?: string,
  ) => {
    try {
      const { data } = await sendMail(draftID, {
        date: dateRef.current,
        signature: signature,
        keys,
        data: packedResult,
      });

      if (data) {
        notification.success({
          message: 'Sent',
          description: 'Your email has been sent successfully.',
        });

        history.push({
          pathname: '/home/list',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed Send',
        description: 'Looks like we have a network problem.',
      });
    }
  };

  const handleClickSend = async () => {
    if (!draftID) return;

    if (receivers?.length < 1) {
      notification.error({
        message: 'No Receipt',
        description: 'At lease 1 receipt',
      });

      return;
    }
    allowSaveRef.current = false;
    try {
      handleSave().then(async (obj) => {
        if (!obj) {
          return;
        }

        if (!address || !showName) {
          console.warn('No address or name of current user, please check.');
          return;
        }

        const { html, text } = obj;

        let keys: string[] = [];
        if (type === MetaMailTypeEn.Encrypted) {
          // TODO: 最好用户填一个收件人的时候，就获取这个收件人的public_key，如果没有pk，就标出来
          let pks: string[] = [publicKey!];
          const receiverInfos = await handleGetReceiversInfos(receivers);
          for (var i = 0; i < receivers.length; i++) {
            const receiverItem = receivers[i];
            const receiverPrefix = receiverItem.address.split('@')[0];
            let rpk = receiverInfos?.[receiverPrefix]?.public_key?.public_key;
            if (!rpk) {
              notification.error({
                message: 'Failed Send',
                description:
                  'Can not find public key of ' +
                  receiverItem.address +
                  '. Please consider sending plain mail.',
              });
              return;
            }
            pks.push(rpk);
          }
          console.log(pks, '--');
          keys = pks.map((pk) => pkEncrypt(pk, currRandomBitsRef.current));
        }

        const orderedAtt = attList;
        orderedAtt.sort((a, b) =>
          a.attachment_id.localeCompare(b.attachment_id),
        );

        let packData = {
          from: showName,
          to: receivers,
          date: dateRef.current,
          subject,
          text_hash: CryptoJS.SHA256(text).toString(),
          html_hash: CryptoJS.SHA256(html).toString(),
          attachments_hash: orderedAtt.map((att) => att.sha256),
          name: ensName,
          keys: keys,
        };

        metaPack(packData).then(async (res) => {
          const { packedResult } = res ?? {};
          getPersonalSign(getWalletAddress(), packedResult).then(
            async (signature) => {
              if (signature === false) {
                notification.error({
                  message: 'Not Your Sign, Not your Mail',
                  description:
                    "Please make sure that you have login MetaMask. It's totally free, no gas fee",
                });
                // Modal.confirm({
                //   title: 'Failed to sign this mail',
                //   content: 'Would you like to send without signature?',
                //   okText: 'Yes, Send it',
                //   onOk: () => {
                //     handleSend(keys, packedResult);
                //     // handleSend(packedResult, date);
                //   },
                //   cancelText: 'No, I will try send it later',
                // });
              } else {
                handleSend(keys, packedResult, signature);
                // handleSend(packedResult, date, signature);
              }
            },
          );
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
    if (!editable) return;

    const quill = getQuill();

    if (!quill || !quill?.getHTML || !quill?.getText) {
      notification.error({
        message: 'ERROR',
        description: 'Failed to get message content',
      });

      return;
    }

    let html = quill?.getHTML(),
      text = quill?.getText();

    // 加密邮件
    if (type === MetaMailTypeEn.Encrypted) {
      html = CryptoJS.AES.encrypt(html, currRandomBitsRef.current).toString();
      text = CryptoJS.AES.encrypt(text, currRandomBitsRef.current).toString();
    }

    const { data } =
      (await updateMail(draftID, {
        subject: subject,
        mail_to: receivers,
        part_html: html,
        part_text: text,
        mail_from: {
          address: showName + PostfixOfAddress,
          name: ensName ?? '',
        },
      })) ?? {};

    if (data?.message_id !== draftID) {
      console.warn('DANGER: wrong updating source');
    }

    dateRef.current = data?.mail_date;
    return { html, text };
  };

  const handleUploadAttachment = async (
    file: any,
    attachment: Blob,
    sha256: string,
    related: AttachmentRelatedTypeEn,
    cid?: string,
  ) => {
    try {
      message.loading({
        content: `uploading ${file.name}...`,
        key: sha256,
        duration: 0,
      });
      const form = new FormData();

      form.append('attachment', attachment);
      form.append('sha256', sha256);
      form.append('related', related);
      cid && form.append('cid', cid);

      const { data } = await uploadAttachment(draftID, form);

      if (data?.attachment) {
        setAttList([...attList, data.attachment]);
        message.success({ content: 'Uploaded', key: sha256 });
      }
    } catch {
      message.error({ content: 'Upload failed', key: sha256 });
      // notification.error({
      //   message: 'Upload Failed',
      //   description: 'Sorry, attachment can not upload to the server.',
      // });
    }
  };

  const handleFinalFileUpload = (file: File, originFile: any) => {
    const reader = new FileReader();

    let res;
    reader.onload = async () => {
      if (reader?.result) {
        const input = reader.result;
        const wordArray = CryptoJS.lib.WordArray.create(input as any);
        const sha256 = CryptoJS.SHA256(wordArray).toString();
        await handleUploadAttachment(
          originFile,
          file,
          sha256,
          AttachmentRelatedTypeEn.Outside,
        );
      }
    };

    reader.readAsArrayBuffer(file);
    return res;
  };

  useInterval(() => {
    if (!allowSaveRef.current) return;
    try {
      // handleSave();
    } catch (err) {
      // console.log('failed to auto save mail');
    }
  }, 30000);

  const onReceiversChange = (newReceivers: string[]) => {
    setReceivers(
      newReceivers.map((i) => {
        return {
          address: i,
          name: i.split('@')[0],
        };
      }),
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Icon
          url={trash}
          onClick={() => {
            handleDelete(
              [
                {
                  message_id: query.id,
                  mailbox: MailBoxTypeEn.Draft,
                },
              ],
              MarkTypeEn.Trash,
            );
            //history.go(-1);
          }}
          style={{ marginRight: '8px' }}
        />
      </div>
      <Input
        prefix={
          <div style={{ width: '56px', textAlign: 'right' }}>Subject:</div>
        }
        bordered
        disabled={!editable}
        style={{
          borderColor: '#ccc',
        }}
        value={subject}
        onChange={(e) => {
          e.preventDefault();
          setSubject(e.target.value);
        }}
      />

      <div className={styles.receiverBar}>
        <div className={styles.title}>To:</div>
        <div className={styles.content}>
          {
            <ReceiverGroup
              receivers={receivers}
              onReceiversChange={onReceiversChange}
            />
          }
        </div>
      </div>

      {type === MetaMailTypeEn.Encrypted && !editable ? (
        <div onClick={handleDecrypted} className={styles.locked}>
          <img src={locked} className={styles.icon} />
          <div>Click to decrypt this draft.</div>
        </div>
      ) : (
        <>
          <Upload
            maxCount={10}
            fileList={attList.map((att) => {
              return {
                name: att?.filename,
                uid: att?.attachment_id,
              };
            })}
            onRemove={async (file) => {
              if (!file.uid) return false;
              const data = await deleteAttachment(draftID, file.uid);
              if (!data) return false;

              const l = attList.filter((att) => att.attachment_id !== file.uid);
              setAttList(l);

              return true;
            }}
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

                  // 加密邮件才需要对附件进行加密
                  if (type === MetaMailTypeEn.Encrypted) {
                    const encrypted = CryptoJS.AES.encrypt(
                      CryptoJS.lib.WordArray.create(input as any),
                      currRandomBitsRef.current,
                    ).toString();

                    const fileEncBlob = new Blob([encrypted]);

                    finalFile = new File([fileEncBlob], file.name, {
                      ...fileProps,
                    });
                  }

                  handleFinalFileUpload(finalFile, file);
                }
              };
            }}
          >
            <div className={styles.uploadBar}>
              <div className={styles.btn}>
                <Icon url={attachment} />
                <span>Upload</span>
              </div>
              <span className={styles.tip}>(Max 15MB)</span>
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
              placeholder={''}
              modules={EditorModules}
              formats={EditorFormats}
              value={content}
              onChange={(value) => {
                setContent(value);
              }}
            />
          </div>
          <div className={styles.footer}>
            <Button
              type="primary"
              style={{ borderRadius: '6px' }}
              onClick={handleClickSend}
            >
              {type === Number(MetaMailTypeEn.Encrypted)
                ? 'Encrypt & Send'
                : 'Sign & Send'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return state.user ?? {};
};

export default connect(mapStateToProps)(NewMail);
