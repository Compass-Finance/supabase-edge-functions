import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseClient } from '../shared/supabaseClient.ts';
import {
  coinGeckoTokenIdsType,
  coinGeckoToMyMapping,
  coinGeckoResponse,
  COIN_GECKO_API_QUERY_STRING,
  tokenNames,
} from '../constants/index.ts';

console.log('hi');

const getPriceAndUpdateDB = async () => {
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
        price: `${cleanedPricesArr[i]}`,
      });
    }
    console.log(finalDataStruc);
    await supabaseClient.from('Token Prices').update(finalDataStruc);

    const updatedData = supabaseClient.from('Token Prices').select('price');

    // what are some work arounds for this?
    return new Response(JSON.stringify(updatedData.select('price')), {
      headers: { 'Content-type': "I don't fucking know plz work" },
    });
  } catch (err) {
    console.log(`This is the error ======> ${err}`);
    return err;
  }
};

serve(getPriceAndUpdateDB);

// ✅ Ready for Production
