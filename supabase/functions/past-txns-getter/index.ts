import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import {
  tokenAddysToQuery,
  alchemyTxnResponseEntry,
  cleanedAlchemyTxnEntry,
} from '../constants/index.ts';
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

  const uncleanedAlchemyData = alchemyRes.result.transfers;
  const cleanedAlchemyData: cleanedAlchemyTxnEntry[] = [];

  uncleanedAlchemyData.map(
    (txnEntry: alchemyTxnResponseEntry, index: number) => {
      cleanedAlchemyData.push({
        id: index,
        from: withdrawlsOrDeposits === 'deposits' ? txnEntry.from : undefined,
        to: withdrawlsOrDeposits === 'withdrawls' ? txnEntry.to : undefined,
        value: txnEntry.value,
        asset: txnEntry.asset,
        date: txnEntry.metadata.blockTimestamp,
      });
    }
  );

  return new Response(JSON.stringify(cleanedAlchemyData), {
    headers: { 'Content-Type': 'application/json' },
  });
});
// ✅ Prod Ready
