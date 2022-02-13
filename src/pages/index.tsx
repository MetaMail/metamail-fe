import detectEthereumProvider from '@metamask/detect-provider';
import styles from './index.less';
import { useState, useEffect } from 'react';
import Login from './login';

export default function IndexPage() {
  return <Login />;
}
