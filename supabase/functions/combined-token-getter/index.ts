import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseClient } from '../shared/supabaseClient.ts';

//❌ Deprecated, moved to DB Function
serve(async (req) => {
  const { addressToQuery } = await req.json();

  const tokenPricesRes = await supabaseClient.from('Token Prices').select();

  const tokenMetadataRes = await supabaseClient.from('Token Data');

  const addressIdRes = await supabaseClient
    .from('address => balance_id')
    .select()
    .eq('address', addressToQuery)
    .select('balance_id');

  const tokenPriceData = tokenPricesRes.data;
  const tokenMetadata = tokenMetadataRes.data;

  if (addressIdRes.data) {
    const balanceId = addressIdRes.data[0].balance_id;
    const hexBalanceRes = await supabaseClient
      .from('Hex Native Balances')
      .select()
      .eq('balance_id', balanceId)
      .select();
    const hexBalancesData = hexBalanceRes.data;
    const nativeBalanceRes = await supabaseClient
      .from('Human Readable Native Balances')
      .select()
      .eq('balance_id', balanceId);
    const nativeBalancesData = nativeBalanceRes.data;
    const USDBalanceRes = await supabaseClient
      .from('Human Readable USD Balances')
      .select()
      .eq('balance_id', balanceId);
    const USDBalancesData = USDBalanceRes.data;
    const tokenPriceAndMetaData: any[] = [];

    tokenPriceData?.map((priceVal) => {
      tokenMetadata?.map((metadataVal) => {
        if (priceVal.name === metadataVal.name) {
          tokenPriceAndMetaData.push({
            name: priceVal.name,
            price: priceVal.price,
            key: priceVal.name,
            decimals: metadataVal.decimals,
            contractAddress: metadataVal.polygon_contract_address,
          });
        }
      });
    });
    const combinedTokenBalanceData: any[] = [];
    if (hexBalancesData && nativeBalancesData && USDBalancesData) {
      const hexTokenNames = Object.keys(hexBalancesData[0]).slice(1);
      const nativeTokenNames = Object.keys(nativeBalancesData[0]).slice(1);
      const USDTokenNames = Object.keys(USDBalancesData[0]).slice(1);

      const hexTokenBalances = Object.values(hexBalancesData[0]).slice(1);
      const nativeTokenBalances = Object.values(nativeBalancesData[0]).slice(1);
      const USDTokenBalances = Object.values(USDBalancesData[0]).slice(1);

      hexTokenNames.map((hexTokenName, hexIndex) => {
        nativeTokenNames.map((nativeTokenName, nativeIndex) => {
          USDTokenNames.map((USDTokenName, USDIndex) => {
            if (
              hexTokenName === nativeTokenName &&
              hexTokenName === USDTokenName
            ) {
              combinedTokenBalanceData.push({
                name: hexTokenName,
                hexNativeBalance: hexTokenBalances[hexIndex],
                HRNativeBalance: nativeTokenBalances[nativeIndex],
                HRUSDBalance: USDTokenBalances[USDIndex],
              });
            }
          });
        });
      });
      const finalCombinedArr: any[] = [];
      tokenPriceAndMetaData.map((tokenInfoVal) => {
        combinedTokenBalanceData.map((balanceVal) => {
          if (tokenInfoVal.name === balanceVal.name) {
            finalCombinedArr.push({
              name: tokenInfoVal.name,
              price: tokenInfoVal.price,
              key: tokenInfoVal.key,
              decimals: tokenInfoVal.decimals,
              contractAddress: tokenInfoVal.contractAddress,
              hexNativeBalance: balanceVal.hexNativeBalance,
              HRNativeBalance: balanceVal.HRNativeBalance,
              HRUSDBalance: balanceVal.HRUSDBalance,
            });
          }
        });
      });
      return new Response(JSON.stringify(finalCombinedArr));
    }
  }

  return new Response(JSON.stringify("Something's wrong..."), {
    headers: { 'Content-Type': 'application/json' },
  });
});
//✅ Prod Ready
