const ALCHEMY_API_KEY = Deno.env.get('ALCHEMY_API_KEY');
export const MATIC_RPC_URL = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
export const MUMBAI_RPC_URL = `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
