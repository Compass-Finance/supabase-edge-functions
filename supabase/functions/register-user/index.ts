import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseClient } from '../shared/supabaseClient.ts';
import {
  registerUserDBEntry,
  tokenNames,
  registerUserTables,
} from '../constants/index.ts';

type finalDSType = {
  [key in registerUserDBEntry]: string;
};

type tokenNamesResponse = {
  name: tokenNames;
};

console.log('Hello from Functions!');

serve(async (req) => {
  const { address } = await req.json();
  try {
    await supabaseClient
      .from('address => balance_id')
      .upsert({ address: address });
    const balanceIdRes = await supabaseClient
      .from('address => balance_id')
      .select()
      .eq('address', address)
      .select('balance_id');
    if (balanceIdRes.data) {
      const balanceId = balanceIdRes.data[0].balance_id;
      await supabaseClient.from('Hex Native Balances').insert({
        balanceId: balanceId,
      });
      const tokenNamesRes = await supabaseClient
        .from('Token Prices')
        .select('name');
      const finalDS: finalDSType = {} as finalDSType;
      finalDS.balance_id = balanceId;

      tokenNamesRes.body?.map((data: tokenNamesResponse) => {
        finalDS[data.name] = '0';
      });
      registerUserTables.map(async (value) => {
        await supabaseClient.from(value).upsert(finalDS);
      });
      return new Response(JSON.stringify({ data: 'Success!' }));
    } else {
      return new Response('No ID Found');
    }
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify(e));
  }
});
// ✅ Ready for Production
