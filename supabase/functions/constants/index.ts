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
// * ============= Regerister User Constants ============== \\
export type registerUserDBEntry = tokenNames | 'balance_id';

export const registerUserTables = [
  'Hex Native Balances',
  'Human Readable Native Balances',
  'Human Readable USD Balances',
];
