export const pkPack = (data: any) => {
  const { addr, date, version, public_key } = data;
  let parts = [
    'Addr: ' + addr,
    'Date: ' + date,
    'Version: ' + version,
    'Public-Key: ' + public_key,
  ];
  return parts.join('\n');
};

export const getPublicKey = async (account: string) => {
  // @ts-ignore
  return ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account],
  });
};
