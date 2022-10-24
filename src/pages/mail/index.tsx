import { notification, message, PageHeader, Button } from 'antd';
import Icon from '@/components/Icon';
import { createMail } from '@/layouts/SideMenu/utils';
import { sent } from '@/assets/icons';
import {
  IMailContentItem,
  MetaMailTypeEn,
  MailBoxTypeEn,
  FilterTypeEn,
} from '../home/interfaces';
import styles from './index.less';
import parse from 'html-react-parser';
import { useState, useEffect, useRef } from 'react';
import {
  changeMailStatus,
  getMailDetailByID,
  getMailList,
  IMailChangeParams,
} from '@/services';
import AttachmentItem from './AttachmentItem';
import CryptoJS from 'crypto-js';
import { connect, Prompt } from 'umi';
import locked from '@/assets/images/locked.svg';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { getUserInfo, getShowName } from '@/store/user';
import SenderCard from './SenderCard';
import { setMailContent } from '@/store/mail';
//import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
// allowed URI schemes
var allowlist = ['http', 'https', 'ftp'];

// build fitting regex
var regex = RegExp('^(' + allowlist.join('|') + '):', 'gim');

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank

  if (node.hasAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
    const originLink = (node as any).href;

    let realLink;
    if (originLink.includes('/home/')) {
      const realLink = (node as any).href.split('/home/')[1];
    } else {
      const protocolName = originLink?.match(
        /(http|https):\/\/([\w.]+\/?)\S*/,
      )?.[1];
      realLink = originLink.replace(protocolName + '://', '');
    }

    (node as any).href = `/notification/?link=${realLink}`;
  }
});

function Mail(props: any) {
  //const { state } = useLocation();
  //const pageIdxHistory = useHistory();
  const [mail, setMail] = useState<IMailContentItem>();
  const {
    location: { query },
    history = useHistory(),
  } = props;
  const { address, ensName } = getUserInfo();
  const [readable, setReadable] = useState(true);
  const randomBitsRef = useRef('');
  const queryRef = useRef(0);
  const [pageIdx, setPageIdx] = useState(1);
  const [inboxType, setinboxType] = useState(0);
  const [isReturnFromMail, setisReturnFromMail] = useState(true);
  useEffect(() => {
    if (history.location.state && history.location.state.pageIdx) {
      setPageIdx(history.location.state.pageIdx);
    }
    if (history.location.inboxType && history.location.state.inboxType) {
      setPageIdx(history.location.state.inboxType);
    }
  }, []);

  //useEffect(() => {
  //  async () => {
  //   await getMailList({
  //     filter: queryRef.current,
  //     page_index: pageIdx,
  ///   });
  // };
  //}, [queryRef, pageIdx]);

  const handleOpenReplyMail = async () => {
    createMail(MetaMailTypeEn.Signed).catch(() => {
      notification.error({
        message: 'Network Error',
        description: 'Can NOT create a new e-mail for now.',
      });
    });
  };

  const handleLoad = async () => {
    try {
      if (!query?.id && query.id.length === 0) {
        throw new Error();
      }
      const { data } = await getMailDetailByID(window.btoa(query.id));

      setMail(data);
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Network Error',
        description: 'Can not fetch detail info of this email for now.',
      });
      setMail(undefined);
    }
  };

  const handleDecrypted = async () => {
    let keys = mail?.meta_header?.keys;

    if (keys && keys?.length > 0 && address) {
      const addrList = [
        mail?.mail_from.address,
        ...(mail?.mail_to.map((item) => item.address) || []),
        ...(mail?.mail_cc.map((item) => item.address) || []),
        ...(mail?.mail_bcc.map((item) => item.address) || []),
      ];
      const idx = addrList.findIndex((addr) => {
        const prefix = addr?.split('@')[0].toLocaleLowerCase();
        return prefix === address || prefix === ensName;
      });
      if (idx < 0 || idx > keys.length - 1) return;
      let key = keys[idx];

      // @ts-ignore
      let randomBits = await ethereum.request({
        method: 'eth_decrypt',
        params: [Buffer.from(key, 'base64').toString(), address],
      });

      if (randomBits) {
        randomBitsRef.current = randomBits;
        const res = { ...mail };

        if (res?.part_html) {
          res.part_html = CryptoJS.AES.decrypt(
            res.part_html,
            randomBits,
          ).toString(CryptoJS.enc.Utf8);
        }

        if (res?.part_text) {
          res.part_text = CryptoJS.AES.decrypt(
            res.part_text,
            randomBits,
          ).toString(CryptoJS.enc.Utf8);
        }

        setReadable(true);
        setMail(res as IMailContentItem);
        message.success({ content: 'Mail decrypted', duration: 2 });
      }
    } else {
      console.warn(`please check your keys ${keys} and address ${address}`);
    }
  };

  useEffect(() => {
    if (query?.type === MetaMailTypeEn.Encrypted + '') {
      setReadable(false);
    }
    // handleMarkRead();
    handleLoad();
  }, [query]);

  const handleClickReply = () => {
    setMailContent({
      mail_from: {
        address: address!,
        name: ensName,
      },
      mail_to: [mail!.mail_from],
      subject: `Re: ${mail?.subject}`,
      part_html: `
      <br/>
      ----------------------------------------------------------------------\n
      <br/>
      <div><span>At ${moment(mail?.mail_date).format(
        'llll',
      )}, </span> <span style="font-weight:700">${
        ensName ?? '-'
      }</span> <${address}@mmail.ink> wrote:</div>
      <br/>
      <blockquote>
      ${mail?.part_html}
      </blockquote>
      `,
    });

    createMail(MetaMailTypeEn.Plain);
  };

  return (
    <div className={styles.container}>
      <PageHeader
        onBack={() => {
          //const { history } = props;
          //history.goBack();
          history.push({
            pathname: '/home/list',
            query: {
              filter: sessionStorage.getItem('inboxType')
                ? Number(sessionStorage.getItem('inboxType'))
                : 0,
            },
            //state: {
            //  pageIdx,
            //  isReturnFromMail,
            //  inboxType,
            //},
          });
        }}
        title="Back"
      >
        <div className={styles.btnBar} onClick={handleClickReply}>
          <Button>Reply</Button>
        </div>
      </PageHeader>

      <div className={styles.mail}>
        <div className={styles.subject}>
          <span className={styles.label}>Subject: </span>
          <span className={styles.info}>{mail?.subject ?? '-'}</span>
        </div>
        <div className={styles.from}>
          <span className={styles.label}> From: </span>
          <SenderCard {...mail?.mail_from} />
        </div>
        <div className={styles.to}>
          <span className={styles.label}> To: </span>
          <span className={styles.info}>
            {mail?.mail_to
              ? mail?.mail_to
                  .map((item) =>
                    item.name
                      ? item.name + ' <' + item.address + '>'
                      : item.address,
                  )
                  .join('; ')
              : ''}
          </span>
        </div>
        <div className={styles.date}>
          <span className={styles.label}>Date: </span>
          <span className={styles.info}>
            {mail?.mail_date ? moment(mail?.mail_date).format('llll') : ''}
          </span>
        </div>

        {readable === true ? (
          <>
            {mail?.attachments && mail.attachments.length > 0 && (
              <div className={styles.attachments}>
                <div className={styles.label}> Attachments: </div>
                <div className={styles.container}>
                  {mail?.attachments?.map((item, idx) => (
                    <AttachmentItem
                      idx={idx}
                      key={idx}
                      url={item?.download?.url}
                      name={item?.filename}
                      randomBits={randomBitsRef.current}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className={styles.content} id="content-sanitized">
              <Prompt
                when={true}
                message={(loc, act) => {
                  console.log('test');

                  return true;
                }}
              />
              {mail?.part_html
                ? parse(DOMPurify.sanitize(mail?.part_html))
                : mail?.part_text}
            </div>
          </>
        ) : (
          <div onClick={handleDecrypted} className={styles.locked}>
            <img src={locked} className={styles.icon} />
            <div>Click to decrypt this mail.</div>
          </div>
        )}
        <div className={styles.btnBar} onClick={handleClickReply}>
          <Button>Reply</Button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return state.user ?? {};
};

export default connect(mapStateToProps)(Mail);
