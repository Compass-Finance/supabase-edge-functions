import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseClient } from '../shared/supabaseClient.ts';

serve(async (req) => {
  const { addressToQuery, withdrawlsOrDeposits } = await req.json();

  const pastTxnsGetterRes = await supabaseClient.functions.invoke(
    'past-txns-getter',
    {
      body: JSON.stringify({
        addressToQuery: addressToQuery,
        withdrawlsOrDeposits: withdrawlsOrDeposits,
      }),
    }
  );
  // ^^ PROD CODE

  try {
    if (pastTxnsGetterRes.data.length === 0) {
      return new Response("Couldn't Find Any Withdrawls");
    } else if (pastTxnsGetterRes.data.length > 0) {
      const addressWithdrawlsInfo = await supabaseClient
        .from(withdrawlsOrDeposits)
        .select()
        .eq('address', addressToQuery);

      if (JSON.stringify(addressWithdrawlsInfo.data) === '[]') {
        await supabaseClient.from(withdrawlsOrDeposits).insert({
          address: addressToQuery,
          txns_info: pastTxnsGetterRes.data,
        });
        return new Response('There were things that were pushed');
      } else {
        const highestWithdrawlOrDepositObj = await supabaseClient
          .from(withdrawlsOrDeposits)
          .select()
          .eq('address', addressToQuery)
          .select(
            `
        txns_info  -> ${-1}
        `
          );
        if (highestWithdrawlOrDepositObj.data) {
          const highestTxnObjArr =
            highestWithdrawlOrDepositObj.data[0].txns_info;

          if (
            highestTxnObjArr.id <
            pastTxnsGetterRes.data[pastTxnsGetterRes.data.length - 1].id
          ) {
            await supabaseClient
              .from(withdrawlsOrDeposits)
              .update({
                address: addressToQuery,
                txns_info: pastTxnsGetterRes.data,
              })
              .match({ address: addressToQuery });
            return new Response(
              "There was an incongruence, you're transactions were updated"
            );
          } else {
            return new Response("You're transactions are up to date!");
          }
        }
      }
    }
    return new Response('Something Went wrong...');
  } catch (e) {
    return new Response(e);
  }
});
