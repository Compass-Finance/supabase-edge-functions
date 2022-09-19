import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import axoid from 'https://deno.land/x/axiod/mod.ts';

serve(async (req) => {
  const { addressToQuery } = await req.json();
  const apiKey = Deno.env.get('ALCHEMY_API_KEY');
  // console.log(`THE API KEY =====> ${apiKey}`);
  const maticAlchemyURL = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`;
  const tokenAddysToQuery = [
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

  const alchemyQueryData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    params: [`${addressToQuery}`, tokenAddysToQuery],
    id: 42,
  });

  const axoidConfig = {
    method: 'post',
    url: maticAlchemyURL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: alchemyQueryData,
  };

  const alchemyRes = await axoid(axoidConfig)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  const dataToWorkWith = alchemyRes.result;
  console.log(dataToWorkWith);

  return new Response(JSON.stringify(dataToWorkWith), {
    headers: { 'Content-type': 'application/json' },
  });
});
