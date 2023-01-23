import { Button, Modal, notification } from 'antd';
import { useState, useEffect } from 'react';
import Review from '@/components/Review';
import logo from '@/assets/logo/logo.svg';
import computer from '@/assets/homeUI/Computer.svg';
import fiveStar from '@/assets/homeUI/5star.png';
import table from '@/assets/homeUI/Table.png';
import xuri from '@/assets/homeUI/ava 1.svg';
import gly from '@/assets/homeUI/ava 2.svg';
import purpleDot from '@/assets/homeUI/purpleDot.png';
import dsp1 from '@/assets/homeUI/p1.png';
import dsp2 from '@/assets/homeUI/p2.png';
import dsp3 from '@/assets/homeUI/p3.png';
import twitter from '@/assets/homeUI/twi.svg';
import facebook from '@/assets/homeUI/fac.svg';
import instra from '@/assets/homeUI/ins.svg';

//import renderLeft from '@/assets/homeUI/renderLeft.svg';
//import vecNE from '@/assets/homeUI/Vector 1.svg';
//import vecNW from '@/assets/homeUI/Vector 4.svg';
//import colorNE from '@/assets/homeUI/C1.png';
import MetaMaskOnboarding from '@metamask/onboarding';
import { connect, history } from 'umi';
import styles from './index.less';
//import ShowBlock from '@/components/ShowBlock';
import { getJwtToken, getRandomStrToSign } from '@/services';
//import LinkElement from '@/components/LinkElement';
import detectEthereumProvider from '@metamask/detect-provider';
import { FilterTypeEn } from '../home/interfaces';
import { address, encrypted, sign } from '@/assets';
import { getWalletAddress, saveUserInfo } from '@/store/user';

const { isMetaMaskInstalled } = MetaMaskOnboarding;

//const BlockInfos = [
//  {
//    imgSrc: address,
//    title: 'Use eth address/ens as email address',
//    desc: 'Use wallet to log in your mailbox directly. Send and receive mails just like gmail or outlook. Totally free!',
//  },
//  {
//    imgSrc: sign,
//    title: 'Sign every mail you send',
//    desc: 'Not your sign, not your mail. Sign every mail digitally with your wallet. No forged mails anymore!',
// },
//  {
//    imgSrc: encrypted,
//    title: 'Protect mail with p2p encryption',
//    desc: 'Mails sent and received by Metamail users could be optionally encrypted. Only the recipient has the private key to decrypt the mails, ensuring the ultimate security.',
//    // extra: (
//   <div
//     style={{
//       marginTop: '15px',
//       fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
//       fontWeight: 400,
//       fontSize: '14px',
//       lineHeight: '24px',
//       textAlign: 'center',
//       color: '#575757',
//     }}
//   >
//     <span>*Under developing. </span>
//     <span
//       style={{
//         color: '#2E82E5',
//         fontWeight: 700,
//       }}
//     >
//       Coming Soon!
//     </span>
//   </div>
// ),
//  },
//];

function Login() {
  const address = getWalletAddress();

  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);
  const [isOnLoginProcess, setisOnLoginProcess] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  const getMetaMask = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      setHasMetaMask(true);
    } else {
      setHasMetaMask(false);
    }
  };

  useEffect(() => {
    if (!address) getMetaMask();
  }, []);

  const handleConnectMetaMask = async () => {
    if (!hasMetaMask) {
      notification.warn({
        message: 'No MetaMask detected',
        description: (
          <div>
            It seems like you hasn't install MetaMask, please{' '}
            <a href="https://metamask.io/download/">install it</a> first.
          </div>
        ),
      });

      return;
    }

    try {
      saveUserInfo({
        address: undefined,
      });
      // @ts-ignore
      if (!ethereum) {
        throw new Error('Your client does not support Ethereum');
      }

      // @ts-ignore
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const newAddr = Array.isArray(newAccounts) ? newAccounts[0] : newAccounts;
      if (!newAddr) return;

      saveUserInfo({
        address: newAddr,
      });
    } catch (error: any) {
      notification.error({
        message: 'Failed connect to MetaMask',
        description: '' + error?.message,
      });
    } finally {
      setIsConnectModalVisible(false);
      setisOnLoginProcess(false);
    }
  };

  const handleSign = async (msg: string, account: string) => {
    try {
      // @ts-ignore
      const signed = await ethereum.request({
        method: 'personal_sign',
        params: [
          `0x${Buffer.from(msg, 'utf8').toString('hex')}`,
          account,
          'password',
        ],
      });

      return signed;
    } catch (e) {
      console.error('Something went wrong when signing, ', e);
    }
  };

  const getRandomAuth = async () => {
    try {
      const { data } = await getRandomStrToSign(address!);

      if (data) {
        const { randomStr, signMethod, tokenForRandom } = data;

        // TODO: signMethod 最好以1/2/3的形式进行枚举，而非string
        const signedMessage = await handleSign(randomStr, address!);
        if (!signedMessage) {
          notification.error({
            message: 'Failed to sign',
            description: 'Please try agin.',
          });
          return;
        }

        const res = await getJwtToken({
          tokenForRandom,
          signedMessage,
        });
        // console.log(res);
        const { data: user } = res ?? {};

        if (!user?.user) {
          notification.error({
            message: 'Login Failed',
            description: 'Please make sure you have a balance in your wallet.',
          });
          return;
        }

        saveUserInfo({
          address,
          ensName: user?.user?.ens,
          publicKey: user?.user?.public_key?.public_key,
        });

        history.push({
          pathname: '/home/list',
          query: {
            filter: FilterTypeEn.Inbox + '',
          },
        });
      }
    } catch (err) {
      notification.error({
        message: 'Failed',
        description: 'Looks like we have a network problem.',
      });
    }
  };

  useEffect(() => {
    if (address && isOnLoginProcess) {
      getRandomAuth();
    }
  }, [address]);

  const handleOpenConnectModal = () => {
    //setIsConnectModalVisible(true);
    if (address) {
      history.push('/home/list');
    } else {
      setIsConnectModalVisible(true);
      setisOnLoginProcess(true);
    }
  };

  const handleCloseModal = () => {
    setIsConnectModalVisible(false);
    setisOnLoginProcess(false);
  };
  //let scaleRatio = 'scale('+String(window.innerWidth / 1440)+')';
  //window.resizeTo(window.innerWidth, window.innerHeight);
  //console.log(scaleRatio);
  return (
    <div
      className={styles.container} //style={{
      //  transform: scaleRatio,
      //}}
    >
      <div className={styles.header}>
        <div className={styles.render1} />
        <div className={styles.render2} />
        <div className={styles.render3} />
        <div className={styles.render4} />
        <a href="/">
          <div className={styles.left}>
            <img src={logo} className={styles.logo} />
            <div className={styles.brandBar}>
              <div className={styles.brand}>MetaMail</div>
              <div className={styles.version}>Beta</div>
            </div>
          </div>
        </a>
        <div className={styles.right}>
          <Button
            type="primary"
            // ghost
            onClick={handleOpenConnectModal}
            className={styles.connectBtn}
          >
            Connect Wallet
            {/* {address ?? 'Connect Wallet'} */}
          </Button>
        </div>
        <div className={styles.detailBox}>
          <p className={styles.title}>
            Your <br />
            web3 email
          </p>
          <div className={styles.subtitle}>
            Create and Use your crypto email
          </div>
          <div className={styles.tryItNow}>
            <Button
              type="primary"
              // ghost
              onClick={handleOpenConnectModal}
              className={styles.titContent}
            >
              Try It Now
              {/* {address ?? 'Connect Wallet'} */}
            </Button>
          </div>
          <img className={styles.purpleDot1W} src={purpleDot} />
          <img className={styles.purpleDot1E} src={purpleDot} />
          <div className={styles.imgs}>
            <img className={styles.imgComputer} src={computer}></img>
            <img className={styles.vecNW} src={table}></img>
          </div>
        </div>
        <div className={styles.page1}>
          <div className={styles.threeMessage}>
            <Review
              imgSrc={xuri}
              desc={'xuri'}
              content={
                'MetaMail is the most secure mail application with digitalsignature and end-to-end encryption.'
              }
              desc2={'developer @ WeChat'}
            />
            <Review
              imgSrc={gly}
              desc={'colin'}
              content={
                'MetaMail is an amazing product, web3 style, and it evolves cauti- ously'
              }
              desc2={'dev @ scroll.io'}
            />
            <Review
              imgSrc={xuri}
              desc={'xuri'}
              content={
                'MetaMail is the most secure mail application with digitalsignature and end-to-end encryption.'
              }
              desc2={'developer @ WeChat'}
            />
            {/*<div className={styles.messageMid}>
              <img className={styles.starMid} src={fiveStar}></img>
              <div className={styles.contentMid}>
                MetaMail is the most secure mail application with digital
                signature and end-to-end encryption.
              </div>
              <img className={styles.iconMid} src={xuri}></img>
              <p className={styles.noteMid}>
                suneal
                <br />
                developer @ WeChat
              </p>
            </div>
            <div className={styles.messageLeft}>
              <img className={styles.starSmallLeft} src={fiveStar}></img>
              <div className={styles.contentLeft}>
                MetaMail is the most secure mail application with digital
                signature and end-to-end encryption.
              </div>
              <img className={styles.iconLeft} src={xuri}></img>
              <p className={styles.noteLeft}>
                suneal
                <br />
                developer @ WeChat
              </p>
            </div>
            <div className={styles.messageRig}>
              <img className={styles.starSmallRig} src={fiveStar}></img>
              <div className={styles.contentRig}>
                MetaMail is an amazing product, web3 style, and it evolves
                cauti- ously
              </div>
              <img className={styles.iconRig} src={gly}></img>
              <p className={styles.noteRight}>
                colin
                <br />
                dev @ scroll.io
              </p>
  </div>*/}
          </div>
          <img className={styles.dsp1} src={dsp1}></img>
          <img className={styles.bigDot} src={purpleDot} />
          <img className={styles.smallDot} src={purpleDot} />

          <div className={styles.headDes1}>
            Use your wallet or ens as email address{' '}
          </div>
          <div className={styles.contentDes1}>
            Use the wallet to log in our mailbox directly, send and receive
            mails with users of our mailbox and other common mainstream
            mailboxes. Totally free!
          </div>
          <div className={styles.btnFrame}>
            <Button
              type="primary"
              // ghost
              onClick={handleOpenConnectModal}
              className={styles.btnContent}
            >
              Connect Wallet
              {/* {address ?? 'Connect Wallet'} */}
            </Button>
          </div>
        </div>
        <div className={styles.page2}>
          <img className={styles.dsp2} src={dsp2}></img>
          <img className={styles.bigDot} src={purpleDot} />
          <img className={styles.smallDot} src={purpleDot} />

          <div className={styles.headDes2}>Sign every mail you send</div>
          <div className={styles.contentDes2}>
            Sign evey mail digitally with your wallet. No forged mails anymore!
          </div>
          <div className={styles.btnFrame}>
            <Button
              type="primary"
              // ghost
              onClick={handleOpenConnectModal}
              className={styles.btnContent}
            >
              Start Now
              {/* {address ?? 'Connect Wallet'} */}
            </Button>
          </div>
        </div>
        <div className={styles.page3}>
          <img className={styles.dsp3} src={dsp3}></img>
          <img className={styles.bigDot} src={purpleDot} />
          {/*<img className={styles.smallDot} src={purpleDot} />*/}

          <div className={styles.headDes3}>
            Protect mail with p2p encryption
          </div>
          <div className={styles.contentDes3}>
            Mails sent and received by Metamail users could be optionally
            encrypted, and only the recipient has the private key to decrypt the
            mails, ensuring the ultimate security.
          </div>
          <div className={styles.btnFrame}>
            <Button
              type="primary"
              // ghost
              onClick={handleOpenConnectModal}
              className={styles.btnContent}
            >
              Encrypt Now
              {/* {address ?? 'Connect Wallet'} */}
            </Button>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.logoBottom}>MetaMail</div>
        <div className={styles.contentBottom}>
          Create and Use your Cryto Email
        </div>
        {/*<div className={styles.threeLinkItem}>
        <img className={styles.twitter} src={twitter}></img>
      </div>*/}
        {/*
        <LinkElement name="Twitter" link="https://twitter.com/MetaMailInk"className={styles.linkTwitter}/>        
        <LinkElement name="Discord" link="https://discord.gg/URYGebMHye" />
        <LinkElement name="Telegram" link="https://t.me/metamailink" />
        <LinkElement
          name="Facebook"
          link="https://www.facebook.com/MetaMail-102795932381536"
        />
        <LinkElement
          name="Youtube"
          link="https://www.youtube.com/channel/UCKudcBh-mKkPeuyLREgoClA"
        /> 
        <LinkElement name="Github" link="https://github.com/MetaMail" />
        <LinkElement name="Blog" link="" /> 
        <LinkElement
          name="About"
          link="https://mirror.xyz/suneal.eth/WbTmDLjY-Q9q1KMf15_nzse7M2Q84jCVq0vWNFefBtc"
        />
        <LinkElement
          name="FAQs"
          link="https://docs.google.com/document/d/1K9H3oqeot-SJ1tzCjLxUe9Iu0RySxmMdomsvjZU51iI/edit?usp=sharing"
      />*/}
      </footer>

      <Modal
        title="Connect Wallet"
        visible={isConnectModalVisible}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={false}
        width={300}
      >
        {isMetaMaskInstalled() ? (
          <Button type="dashed" block onClick={handleConnectMetaMask}>
            MetaMask
          </Button>
        ) : (
          <div>Please install MetaMask first.</div>
        )}
      </Modal>
    </div>
  );
}

export default Login;
