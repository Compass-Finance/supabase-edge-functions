// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { tokenAddysToQuery } from '../constants/index.ts';
import { MATIC_RPC_URL } from '../shared/alchemy.ts';

serve(async (req) => {
  const { addressToQuery, withdrawlsOrDeposits } = await req.json();

  const alchemyQueryOptions = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [
        {
          fromBlock: '0x0',
          toBlock: 'latest',
          contractAddresses: tokenAddysToQuery,
          category: ['erc20'],
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: '0x3e8',
          fromAddress:
            withdrawlsOrDeposits === 'withdrawls' ? addressToQuery : undefined,
          toAddress:
            withdrawlsOrDeposits === 'withdrawls' ? undefined : addressToQuery,
        },
      ],
    }),
  };

  const alchemyRes = await (
    await fetch(MATIC_RPC_URL, alchemyQueryOptions)
  ).json();
  const alchemyData = alchemyRes.result.transfers;
  console.log(alchemyData, '<===== Alchemy Data');

  return new Response(JSON.stringify(alchemyData), {
    headers: { 'Content-Type': 'application/json' },
  });
});

/* 
## WITHDRAWLS || DEPOSITS

========|===========================|==========|
address | withdrawl_id / deposit_id | txn_info |
========|===========================|==========|
to start you have the address which in this case will the the address that things are WITHDRAWN from, and then you'd want to have an indexer of some sort,
and that will be the withdrawl_id which will essentially be a mirror of the transaction indices, so then when you want to check between the alchemy API array,
and the highest returned withdrawl_id for that address 

TXN_INFO example:  ```
    {
      from: '0xc19b2c8f77948104798ac71fc3f85117d94d2bd6',
      to: '0x777adf356eebc4a607a1867ce4fccfc23fb69413',
      value: 0.01,
      asset: 'DAI',
      metadata: { blockTimestamp: '2022-09-07T23:12:37.000Z' },
    },
```
The code would look something like this:

if (alchemyResponse.length -1 === highestReturnedWithdrawlId) {
    return early
} else {
    do expensive computations
}

I think this is enough knowledge to implement it,
*/
