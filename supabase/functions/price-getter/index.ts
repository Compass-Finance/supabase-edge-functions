import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://deno.land/x/supabase@1.3.1/mod.ts';
import { supabaseClient } from '../shared/supabaseClient.ts';
import {
  coinGeckoTokenIdsType,
  coinGeckoToMyMapping,
  coinGeckoResponse,
  COIN_GECKO_API_QUERY_STRING,
  tokenNames,
} from '../constants/priceGetter.constants.ts';

serve(async () => {
  try {
    const coingeckoResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_GECKO_API_QUERY_STRING}&vs_currencies=usd`
    );

    const coingeckoData = await coingeckoResponse.json();

    const uncleanedPricesArr = Object.values(
      coingeckoData as coinGeckoResponse
    );

    const cleanedPricesArr: number[] = [];

    const coinGeckoTokenIds = Object.keys(
      coingeckoData
    ) as coinGeckoTokenIdsType[];
    const actualTokenNames: tokenNames[] = [];
    for (let i = 0; i < uncleanedPricesArr.length; i++) {
      actualTokenNames.push(coinGeckoToMyMapping[coinGeckoTokenIds[i]]);
      cleanedPricesArr.push(uncleanedPricesArr[i].usd);
    }
    const finalDataStruc = [];
    for (let i = 0; i < uncleanedPricesArr.length; i++) {
      finalDataStruc.push({
        name: actualTokenNames[i],
        price: cleanedPricesArr[i],
      });
    }
    console.log(finalDataStruc);
    await supabaseClient.from('Token Prices').update(finalDataStruc);
    console.log(finalDataStruc);
    return new Response(JSON.stringify(finalDataStruc), {
      headers: { 'Content-type': "I don't fucking know plz work" },
    });
  } catch (err) {
    return err;
  }
});
