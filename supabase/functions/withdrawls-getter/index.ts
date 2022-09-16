import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import axiod from 'https://deno.land/x/axiod/mod.ts';

console.log('hi');

serve(async () => {
  const apiKey = Deno.env.get('ALCHEMY_API_KEY');
  const baseURL = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`;
  // Replace with the wallet address you want to query:
  const ownerAddr = '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be';
  // Replace with the token contract address you want to query:
  const tokenAddr = [
    '0x607f4c5bb672230e8672085532f7e901544a7375',
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  ];

  const queryData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    params: [`${ownerAddr}`, tokenAddr],
    id: 42,
  });
  console.log(apiKey, '<====== api key');

  const config = {
    method: 'post',
    url: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: queryData,
  };
  const res = await axiod(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  const returnedData = res.result;
  // shape of the data
  const result = {
    address: '0x...',
    tokenBalances: [
      {
        contractAddress: '0x...',
        tokenBalance: '0x....',
      },
    ],
  };
  // this code is actually a balances getter but let's get working on this tmw

  return new Response(JSON.stringify(res), {
    headers: { 'Content-Type': 'application/json' },
  });
});
