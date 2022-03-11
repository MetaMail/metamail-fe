import detectEthereumProvider from '@metamask/detect-provider';
import styles from './index.less';
import { useState, useEffect } from 'react';
import Login from './login';
import { getMyProfile } from '@/services/user';
import Home from './home';
import { connect } from 'umi';

function IndexPage(props: any) {
  const { setPublicKey, setUserAddress } = props;
  const [isLogin, setIsLogin] = useState(false);
  /**
 *{
    addr:
    public_key:
    ens: (optional) 如果有ens，就返回。
    name: (optional) 用户设置的name，后续可能会加上
    avatar: (optional) 头像URL，后续可能会给上
}
 *
 */
  const handleCheckLogin = async () => {
    const { data } = (await getMyProfile()) ?? {};

    if (data) {
      setIsLogin(true);

      setPublicKey(data.public_key);
      setUserAddress(data.addr);
    }
  };

  useEffect(() => {
    handleCheckLogin();
  }, []);

  // @ts-ignore
  return !isLogin ? <Login /> : <Home />;
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
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
