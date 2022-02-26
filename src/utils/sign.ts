export enum SignTypeEn {
  Personal = 0,
  Eth = 1,
  TypedData = 2,
  TypedDataV3 = 3,
  TypedDataV4 = 4,
}

export const getPersonalSign = async (
  account: string,
  msg: string,
  password?: string,
) => {
  try {
    // @ts-ignore
    const sign = await ethereum.request({
      method: 'personal_sign',
      params: [
        `0x${Buffer.from(msg, 'utf8').toString('hex')}`,
        account,
        password ?? '',
      ],
    });

    return Promise.resolve(sign);
  } catch (err) {
    return Promise.resolve(false);
  }
};

export const getEthSign = async (account: string, msg: string) => {
  try {
    if (!msg.startsWith('0x')) {
      throw new Error('Invalid message, please hash it.');
    }

    // @ts-ignore
    const sign = await ethereum.request({
      method: 'eth_sign',
      params: [account, msg],
    });

    return sign;
  } catch (err) {
    console.error(err);
  }
};

type TypedMessage = {
  type: string; // string\uint32
  name: string;
  value: string | number;
};

const getTypedDataSign = async (account: string, msgParams: TypedMessage[]) => {
  try {
    // @ts-ignore
    const sign = await ethereum.request({
      method: 'eth_signTypedData',
      params: [msgParams, account],
    });

    return sign;
  } catch (err) {
    console.error(err);
  }
};

export const getSignResult = async (
  type: SignTypeEn,
  account: string,
  msg: any,
) => {
  let signResult;

  switch (type) {
    case SignTypeEn.Personal:
      signResult = await getPersonalSign(account, msg);
      break;
    case SignTypeEn.Eth:
      signResult = getEthSign(account, msg);
      break;
    case SignTypeEn.TypedData:
      signResult = getTypedDataSign(account, msg);
      break;
    case SignTypeEn.TypedDataV3:
    case SignTypeEn.TypedDataV4:
    default:
      break;
  }

  if (
    !signResult ||
    typeof signResult !== 'string' ||
    signResult.length === 0
  ) {
    throw new Error('Something went wrong when signing');
  }

  return signResult;
};
