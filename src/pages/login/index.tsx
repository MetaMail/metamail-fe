import { Button, Modal, notification } from 'antd';
import { useState, useEffect } from 'react';
import logo from '@/assets/logo/logo.svg';
import MetaMaskOnboarding from '@metamask/onboarding';
import { connect, history } from 'umi';
import styles from './index.less';
import ShowBlock from '@/components/ShowBlock';
import { getJwtToken, getRandomStrToSign } from '@/services';
import LinkElement from '@/components/LinkElement';
import detectEthereumProvider from '@metamask/detect-provider';
import { FilterTypeEn } from '../home/interfaces';
import { address, encrypted, sign } from '@/assets';
import { getWalletAddress, saveUserInfo } from '@/store/user';

const { isMetaMaskInstalled } = MetaMaskOnboarding;

const BlockInfos = [
  {
    imgSrc: address,
    title: 'Use eth address/ens as email address',
    desc: 'Use wallet to log in your mailbox directly. Send and receive mails just like gmail or outlook. Totally free!',
  },
  {
    imgSrc: sign,
    title: 'Sign every mail you send',
    desc: 'Not your sign, not your mail. Sign every mail digitally with your wallet. No forged mails anymore!',
  },
  {
    imgSrc: encrypted,
    title: 'Protect mail with p2p encryption',
    desc: 'Mails sent and received by Metamail users could be optionally encrypted. Only the recipient has the private key to decrypt the mails, ensuring the ultimate security.',
    // extra: (
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
  },
];

function Login() {
  const address = getWalletAddress();

  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);
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
    getMetaMask();
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
    if (address && address.length > 0) {
      getRandomAuth();
    }
  }, [address]);

  const handleOpenConnectModal = () => {
    setIsConnectModalVisible(true);
    // if (!address) {
    //   setIsConnectModalVisible(true);
    // } else {
    //   history.push('/home/list');
    // }
  };

  const handleCloseModal = () => {
    setIsConnectModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
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
      </header>
      <div className={styles.detailBox}>
        <img src={logo} className={styles.logo}></img>

        <div className={styles.title}>Your web3 email</div>

        <div className={styles.subtitle}>
          Send, encrypt and receive email with wallet
        </div>

        {/* <div className={styles.divider}></div> */}
        <p className={styles.desc}>
          Sending and receiving mails are totally free, no gas fee.
        </p>

        <Button
          type="primary"
          className={styles.tryBtn}
          onClick={handleOpenConnectModal}
        >
          Try It Now!
        </Button>

        <div className={styles.showSection}>
          {BlockInfos?.map((block, idx) => (
            <ShowBlock {...block} key={idx} />
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <LinkElement name="Twitter" link="https://twitter.com/MetaMailInk" />
        <LinkElement name="Discord" link="https://discord.gg/URYGebMHye" />
        {/* <LinkElement
          name="Facebook"
          link="https://www.facebook.com/MetaMail-102795932381536"
        />
        <LinkElement
          name="Youtube"
          link="https://www.youtube.com/channel/UCKudcBh-mKkPeuyLREgoClA"
        /> */}
        <LinkElement name="Github" link="https://github.com/MetaMail" />
        {/* <LinkElement name="Blog" link="" /> */}
        <LinkElement
          name="About"
          link="https://mirror.xyz/suneal.eth/IWaw84vdezF_k7X1yweuVG7v-aH4TrlyvbBXisygNMw"
        />
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
