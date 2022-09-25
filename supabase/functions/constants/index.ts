// ~ ============= PRICE GETTER CONSTANTS ================= \\
export const COIN_GECKO_TOKEN_IDS = [
  'dai',
  'matic-network',
  'renbtc',
  'usd-coin',
  'weth',
];

export type tokenNames = 'dai' | 'matic' | 'renbtc' | 'usdc' | 'weth';

export type coinGeckoTokenIdsType =
  | 'dai'
  | 'matic-network'
  | 'renbtc'
  | 'usd-coin'
  | 'weth';
type coinGeckoMapping = {
  [key in coinGeckoTokenIdsType]: tokenNames;
};

export type coinGeckoResponse = {
  [key in coinGeckoTokenIdsType]: {
    usd: number;
  };
};

export const coinGeckoToMyMapping: coinGeckoMapping = {
  dai: 'dai',
  'matic-network': 'matic',
  renbtc: 'renbtc',
  'usd-coin': 'usdc',
  weth: 'weth',
};

export const COIN_GECKO_API_QUERY_STRING = COIN_GECKO_TOKEN_IDS.join('%2C');
// ~ ============= PRICE GETTER CONSTANTS ================= \\
// * ============= Register User Constants ============== \\
export type registerUserDBEntry = tokenNames | 'balance_id';

export const registerUserTables = [
  'Hex Native Balances',
  'Human Readable Native Balances',
  'Human Readable USD Balances',
];
// * ============= Register User Constants ============== \\
// ^ ============ Balances Getter Constants ============= \\
export const tokenAddysToQuery = [
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  // ^^ DAI
  '0x0000000000000000000000000000000000001010',
  // ^^ MATIC
  '0xDBf31dF14B66535aF65AaC99C32e9eA844e14501',
  // ^^ RENBTC
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  // ^^ USDC
  '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  // ^^ WETH
];
// ^ ============ Balances Getter Constants ============= \\
// & ============ Balances Updater Constants ============= & \\
export interface combinedTokenDataType {
  name: string;
  decimals: number;
  balance: string;
  price: number;
}

export type DbEntry = {
  [key in tokenNames]: string | number;
};

// & ============ Balances Updater Constants ============= & \\
// ~ ============ Past Txn Getter Constants ============== ~ \\
export type alchemyTxnResponseEntry = {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  asset: string;
  category: string;
  rawContract: {
    value: string;
    address: string;
    decimal: string;
  };
  metadata: { blockTimestamp: string };
};

export type cleanedAlchemyTxnEntry = {
  id: number;
  hash: string;
  from?: string;
  to?: string;
  value: number;
  asset: string;
  date: string;
};

// ~ ============ Past Txn Getter Constants ============== ~ \\
