import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseClient } from '../shared/supabaseClient.ts';

serve(async (req) => {
  const { addressToQuery, withdrawlsOrDeposits } = await req.json();

  try {
    // const pastTxnsGetterRes = await supabaseClient.functions.invoke(
    //   'past-txns-getter',
    //   {
    //     body: JSON.stringify({
    //       addressToQuery: addressToQuery,
    //       withdrawlsOrDeposits: withdrawlsOrDeposits,
    //     }),
    //   }
    // );
    // ^^ PROD CODE
    const pastTxnsGetterRes = [
      {
        blockNum: '0x1f3e42f',
        uniqueId:
          '0xa4e3c3018118032ddaca6c98c1ad1874bf2590abbc930d85d195390cc2d9695d:log:67',
        hash: '0xa4e3c3018118032ddaca6c98c1ad1874bf2590abbc930d85d195390cc2d9695d',
        from: '0xc19b2c8f77948104798ac71fc3f85117d94d2bd6',
        to: '0x9f0f751c9af8835654d27ab45504feb77d03f0f2',
        value: 0.02,
        erc721TokenId: null,
        erc1155Metadata: null,
        tokenId: null,
        asset: 'DAI',
        category: 'erc20',
        rawContract: {
          value: '0x470de4df820000',
          address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
          decimal: '0x12',
        },
        metadata: { blockTimestamp: '2022-09-06T11:11:12.000Z' },
      },
      {
        blockNum: '0x1f3e87a',
        uniqueId:
          '0x3924f5dc7902d5d2b27c08fa51a9d904f921319ad4a5377bf5da369d6fb9f51f:log:170',
        hash: '0x3924f5dc7902d5d2b27c08fa51a9d904f921319ad4a5377bf5da369d6fb9f51f',
        from: '0xc19b2c8f77948104798ac71fc3f85117d94d2bd6',
        to: '0x9f0f751c9af8835654d27ab45504feb77d03f0f2',
        value: 0.01,
        erc721TokenId: null,
        erc1155Metadata: null,
        tokenId: null,
        asset: 'DAI',
        category: 'erc20',
        rawContract: {
          value: '0x2386f26fc10000',
          address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
          decimal: '0x12',
        },
        metadata: { blockTimestamp: '2022-09-06T11:48:59.000Z' },
      },
      {
        blockNum: '0x1f4b7d7',
        uniqueId:
          '0xcd71e4b0d5d7b3333dc854689612b5100007908539be58beadcf1c57ad25c9d7:log:126',
        hash: '0xcd71e4b0d5d7b3333dc854689612b5100007908539be58beadcf1c57ad25c9d7',
        from: '0xc19b2c8f77948104798ac71fc3f85117d94d2bd6',
        to: '0x9f0f751c9af8835654d27ab45504feb77d03f0f2',
        value: 0.01,
        erc721TokenId: null,
        erc1155Metadata: null,
        tokenId: null,
        asset: 'DAI',
        category: 'erc20',
        rawContract: {
          value: '0x2386f26fc10000',
          address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
          decimal: '0x12',
        },
        metadata: { blockTimestamp: '2022-09-07T18:40:49.000Z' },
      },
      {
        blockNum: '0x1f4d5d7',
        uniqueId:
          '0x6c951304e940963a971d02393ff89bc0e338b1b10a290ace0fac7c2b091f3087:log:57',
        hash: '0x6c951304e940963a971d02393ff89bc0e338b1b10a290ace0fac7c2b091f3087',
        from: '0xc19b2c8f77948104798ac71fc3f85117d94d2bd6',
        to: '0x777adf356eebc4a607a1867ce4fccfc23fb69413',
        value: 0.01,
        erc721TokenId: null,
        erc1155Metadata: null,
        tokenId: null,
        asset: 'DAI',
        category: 'erc20',
        rawContract: {
          value: '0x2386f26fc10000',
          address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
          decimal: '0x12',
        },
        metadata: { blockTimestamp: '2022-09-07T23:12:37.000Z' },
      },
    ];

    // alright so what's next? well now, we have the response of the transaction array now what?

    // * well the next order of business is to filter based on the length of the array

    if (pastTxnsGetterRes.length === 0) {
      // code to run if the array is zero, probably nothing

      return new Response("Couldn't Find Any Withdrawls");
    } else if (pastTxnsGetterRes.length > 0) {
      pastTxnsGetterRes.map(async (value, index) => {
        // await supabaseClient.from('withdrawls').insert({
        //   address: addressToQuery,
        //   withdrawl_id: index,
        //   txn_info: value,
        // });
        // console.log(index, '<====== index', value, '<======== value');
      });
      //
      const tester = await supabaseClient.from('withdrawls').select();

      return new Response(JSON.stringify(tester));
    }
  } catch (e) {
    new Response(e);
  }

  return new Response(JSON.stringify(''), {
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

// so why is this loop stopping at 1????
const something1 = {
  error: null,
  data: [
    {
      address: '0xc19B2C8f77948104798AC71FC3F85117d94d2Bd6',
      withdrawl_id: 0,
      txn_info: {
        blockNum: '0x1f3e42f',
        uniqueId:
          '0xa4e3c3018118032ddaca6c98c1ad1874bf2590abbc930d85d195390cc2d9695d:log:67',
        hash: '0xa4e3c3018118032ddaca6c98c1ad1874bf2590abbc930d85d195390cc2d9695d',
        from: '0xc19b2c8f77948104798ac71fc3f85117d94d2bd6',
        to: '0x9f0f751c9af8835654d27ab45504feb77d03f0f2',
        value: 0.02,
        erc721TokenId: null,
        erc1155Metadata: null,
        tokenId: null,
        asset: 'DAI',
        category: 'erc20',
        rawContract: {
          value: '0x470de4df820000',
          address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
          decimal: '0x12',
        },
        metadata: { blockTimestamp: '2022-09-06T11:11:12.000Z' },
      },
    },
  ],
  count: null,
  status: 200,
  statusText: 'OK',
  body: [
    {
      address: '0xc19B2C8f77948104798AC71FC3F85117d94d2Bd6',
      withdrawl_id: 0,
      txn_info: {
        blockNum: '0x1f3e42f',
        uniqueId:
          '0xa4e3c3018118032ddaca6c98c1ad1874bf2590abbc930d85d195390cc2d9695d:log:67',
        hash: '0xa4e3c3018118032ddaca6c98c1ad1874bf2590abbc930d85d195390cc2d9695d',
        from: '0xc19b2c8f77948104798ac71fc3f85117d94d2bd6',
        to: '0x9f0f751c9af8835654d27ab45504feb77d03f0f2',
        value: 0.02,
        erc721TokenId: null,
        erc1155Metadata: null,
        tokenId: null,
        asset: 'DAI',
        category: 'erc20',
        rawContract: {
          value: '0x470de4df820000',
          address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
          decimal: '0x12',
        },
        metadata: { blockTimestamp: '2022-09-06T11:11:12.000Z' },
      },
    },
  ],
};
