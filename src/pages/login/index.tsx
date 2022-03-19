import { Button, Modal, notification } from 'antd';
import { useState, useEffect } from 'react';
import logo from '@/assets/logo/logo.svg';
import MetaMaskOnboarding from '@metamask/onboarding';
import { connect, history } from 'umi';
import styles from './index.less';
import ShowBlock from '@/components/ShowBlock';
import { getJwtToken, getRandomStrToSign } from '@/services';
import LinkElement from '@/components/LinkElement';
import { getCookieByName, TokenCookieName } from '@/utils/cookie';
import detectEthereumProvider from '@metamask/detect-provider';
import { FilterTypeEn } from '../home/interfaces';
import { address, encrypted, sign } from '@/assets';

const { isMetaMaskInstalled } = MetaMaskOnboarding;

const BlockInfos = [
  {
    imgSrc: address,
    title: 'Use wallet and ens as email address',
    desc: 'Use the wallet to log in our mailbox directly, send and receive mails with users of our mailbox and other common mainstream mailboxes. Totally free!',
  },
  {
    imgSrc: sign,
    title: 'Sign every mail you send',
    desc: 'Sign every mail digitally with your wallet. No forged mails anymore!',
  },
  {
    imgSrc: encrypted,
    title: 'Protect mail with p2p encryption*',
    desc: 'Mails sent and received by Metamail users could be optionally encrypted, and only the recipient has the private key to decrypt the mails, ensuring the ultimate security.',
    extra: (
      <div
        style={{
          marginTop: '15px',
          fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '24px',
          textAlign: 'center',
          color: '#575757',
        }}
      >
        <span>*Under developing. </span>
        <span
          style={{
            color: '#2E82E5',
            fontWeight: 700,
          }}
        >
          Coming Soon!
        </span>
      </div>
    ),
  },
];

function Login(props: any) {
  const { address, setUserAddress, setPublicKey, setUserEnsName } = props;
  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);
  // const [address, setUserAddress] = useState<string>();
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
      // @ts-ignore
      if (!ethereum) {
        throw new Error('Your client does not support Ethereum');
      }

      // @ts-ignore
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setUserAddress(Array.isArray(newAccounts) ? newAccounts[0] : newAccounts);
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

        const res = await getJwtToken({
          tokenForRandom,
          signedMessage,
        });

        const { data: user } = res ?? {};

        setPublicKey(user?.user?.public_key);
        setUserEnsName(user?.user?.ens);

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
    if (!address) {
      setIsConnectModalVisible(true);
    } else {
      history.push('/home/list');
    }
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
            {address ?? 'Connect Wallet'}
          </Button>
        </div>
      </header>
      <div className={styles.detailBox}>
        <img src={logo} className={styles.logo}></img>

        <div className={styles.title}>
          Your web3 email <br /> Create and use the encrypted email
        </div>
        {/* <div className={styles.divider}></div> */}
        <p className={styles.desc}>All features are free</p>

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
        <LinkElement
          name="Facebook"
          link="https://www.facebook.com/MetaMail-102795932381536"
        />
        <LinkElement
          name="Youtube"
          link="https://www.youtube.com/channel/UCKudcBh-mKkPeuyLREgoClA"
        />
        <LinkElement name="Github" link="https://github.com/MetaMail" />
        {/* <LinkElement name="Blog" link="" /> */}
        <LinkElement name="About Us" link="https://metamail.ink" />
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

const mapStateToProps = (state: any) => {
  return state.user ?? {};
};

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; payload: any }) => any,
) => ({
  setUserAddress: (data: any) =>
    dispatch({
      type: 'user/setUserAddress',
      payload: data,
    }),
  setPublicKey: (data: any) =>
    dispatch({
      type: 'user/setPublicKey',
      payload: data,
    }),
  setUserEnsName: (data: any) =>
    dispatch({
      type: 'user/setUserEnsName',
      payload: data,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
