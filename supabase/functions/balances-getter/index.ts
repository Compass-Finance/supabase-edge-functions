import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import axoid from 'https://deno.land/x/axiod@0.26.2/mod.ts';
import { tokenAddysToQuery } from '../constants/index.ts';
import { MATIC_RPC_URL } from '../shared/alchemy.ts';

serve(async (req) => {
  const { addressToQuery } = await req.json();

  const alchemyQueryData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    params: [`${addressToQuery}`, tokenAddysToQuery],
    id: 42,
  });

  const axoidConfig = {
    method: 'post',
    url: MATIC_RPC_URL,
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
// ✅ Prod Ready
