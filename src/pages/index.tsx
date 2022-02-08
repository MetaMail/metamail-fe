import detectEthereumProvider from '@metamask/detect-provider';
import styles from './index.less';
import { useState, useEffect } from 'react';
import Login from './login';

export default function IndexPage() {
  const [element, setElement] = useState(<div>null</div>);

  const getRenderElement = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      setElement(<Login />);
    } else {
      setElement(
        <div>
          您的客户端不支持MetaMask登陆，请
          <a href="https://metamask.io/download/">安装</a>
        </div>,
      );
    }
  };

  useEffect(() => {
    getRenderElement();
  }, []);

  return element;
}
