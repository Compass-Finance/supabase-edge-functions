// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import BigNumber from 'https://raw.githubusercontent.com/mikemcl/bignumber.js/v9.1.0/bignumber.mjs';
import { supabaseClient } from '../shared/supabaseClient.ts';
import { tokenBalFormatter } from '../utils/TokenBalanceFormatter.ts';
import {
  combinedTokenDataType,
  prodRegisterUserTables,
  devRegisterUserTables,
} from '../constants/index.ts';

serve(async (req) => {
  // TODO: build short circuiting into this, so cross reference between the hex values returned from alchemy and the values present in the db
  try {
    const { addressToQuery, network } = await req.json();
    const balancesGetterRes = await supabaseClient.functions.invoke(
      'balances-getter',
      {
        body: JSON.stringify({
          addressToQuery: addressToQuery,
          network: network,
        }),
      }
    );
    const registerUserTables =
      network === 'mumbai' ? devRegisterUserTables : prodRegisterUserTables;

    const balanceIdReq = await supabaseClient
      .from('address => balance_id')
      .select()
      .eq('address', addressToQuery)
      .select('balance_id');
    // @ts-ignore
    const balanceId = balanceIdReq.body[0].balance_id;

    const tokenInformation = await supabaseClient
      .from(`${network === 'mumbai' ? 'Mumbai Token Data' : 'Token Data'}`)
      .select(); // <== has to be parameterized
    const tokenPrices = await supabaseClient.from('Token Prices').select(); // DNC

    const balancesData = balancesGetterRes.data.tokenBalances;
    const tokenInfoData = tokenInformation.body;
    const tokenPricesData = tokenPrices.body;

    const combinedTokenArr: combinedTokenDataType[] = [];

    balancesData?.map((balanceVal: any) => {
      tokenInfoData?.map((tokenInfoVal) => {
        tokenPricesData?.map((tokenPriceVal) => {
          if (
            tokenInfoVal.polygon_contract_address ===
              balanceVal.contractAddress &&
            tokenInfoVal.name === tokenPriceVal.name
          ) {
            combinedTokenArr.push({
              name: tokenInfoVal.name,
              decimals: tokenInfoVal.decimals,
              balance: balanceVal.tokenBalance,
              price: tokenPriceVal.price,
            });
          }
        });
      });
    });
    const HexNativeBalanceObj: any = {};
    const HrNativeBalanceObj: any = {};
    const HrUSDBalanceObj: any = {};

    for (let i = 0; i < combinedTokenArr.length; i++) {
      const tokensArr = combinedTokenArr[i];
      HexNativeBalanceObj.balance_id = balanceId;
      HrNativeBalanceObj.balance_id = balanceId;
      HrUSDBalanceObj.balance_id = balanceId;
      HexNativeBalanceObj[tokensArr.name] = tokensArr.balance;
      HrNativeBalanceObj[tokensArr.name] = tokenBalFormatter(
        // @ts-ignore
        new BigNumber(tokensArr.balance).toString(),
        tokensArr.decimals
      );
      HrUSDBalanceObj[tokensArr.name] =
        Number(
          tokenBalFormatter(
            // @ts-ignore
            new BigNumber(tokensArr.balance).toString(),
            tokensArr.decimals
          )
        ) * combinedTokenArr[i].price;
    }
    // hex, hr native, hr usd
    const finalDS = [HexNativeBalanceObj, HrNativeBalanceObj, HrUSDBalanceObj];

    for (let i = 0; i < registerUserTables.length; i++) {
      await supabaseClient
        .from(registerUserTables[i])
        .upsert(finalDS[i])
        .match({ balance_id: Number(balanceId) });
      // && we'll have to add our
    }

    return new Response(
      JSON.stringify(`This should work ====> ${JSON.stringify(finalDS)}`),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify(e));
  }
});
// ✅ Prod Ready
