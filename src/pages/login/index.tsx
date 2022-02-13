import { Button, Modal, notification } from 'antd';
import { useState, useEffect } from 'react';
import logo from '../../assets/logo/favicon-196x196.png';
import MetaMaskOnboarding from '@metamask/onboarding';
import { history } from 'umi';
import styles from './index.less';
import ShowBlock from '@/components/ShowBlock';
import { getJwtToken, getRandomStrToSign } from '@/services';
import LinkElement from '@/components/LinkElement';
import { getCookieByName, TokenCookieName } from '@/utils/cookie';
import detectEthereumProvider from '@metamask/detect-provider';

const { isMetaMaskInstalled } = MetaMaskOnboarding;

export default function Login() {
  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);
  const [userAddress, setUserAddress] = useState<string>();
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
    if (hasMetaMask) {
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
    const { data } = (await getRandomStrToSign(userAddress!)) ?? {};

    if (data) {
      const { randomStr, signMethod, tokenForRandom } = data;

      // TODO: signMethod 最好以1/2/3的形式进行枚举，而非string
      const signedMessage = await handleSign(randomStr, userAddress!);

      getJwtToken({
        tokenForRandom,
        signedMessage,
      }).then((res) => {
        const {
          data: { user },
        } = res ?? {};

        console.log('TODO: save user info to store', user);

        history.push('/home');
      });
    }
  };

  useEffect(() => {
    if (userAddress && userAddress.length > 0) {
      getRandomAuth();
    }
  }, [userAddress]);

  const handleOpenConnectModal = () => {
    if (!getCookieByName(TokenCookieName)) {
      setIsConnectModalVisible(true);
    } else {
      history.push('/home');
    }
  };

  const handleCloseModal = () => {
    setIsConnectModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button
          type="primary"
          ghost
          onClick={handleOpenConnectModal}
          className={styles.connectBtn}
        >
          {userAddress ?? 'Connect Wallet'}
        </Button>
      </header>
      <div className={styles.detailBox}>
        <img src={logo} className={styles.logo}></img>

        <h2 className={styles.title}>Your Web3.0 Email </h2>
        <p className={styles.desc}>
          Create and use your web3 email. <br /> Your address, your mail; your
          ens, your mail.
        </p>
        {userAddress ?? (
          <Button
            type="primary"
            className={styles.tryBtn}
            onClick={handleOpenConnectModal}
          >
            Try It Now!
          </Button>
        )}

        <div className={styles.showSection}>
          <ShowBlock
            imgSrc=""
            title="Easy-use"
            desc="Use your address and ens as email address"
          />
          <ShowBlock
            imgSrc=""
            title="Encrypt"
            desc="Protect your mail with p2p encrypt"
          />
          <ShowBlock imgSrc="" title="Sign" desc="Sign every mail you send." />
        </div>
      </div>

      <footer className={styles.footer}>
        <LinkElement name="Twitter" link="https://twitter.com/MetaMailInk" />
        <LinkElement name="Discord" link="https://discord.gg/URYGebMHye" />
        <LinkElement name="Blog" link="" />
        <LinkElement name=" About Us" link="https://metamail.ink" />
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
