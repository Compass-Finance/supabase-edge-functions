const returnedAlchemyDS = {
  address: '0x54a39ab7d48da59fc5e75be96d58f394e4bb9528',
  tokenBalances: [
    {
      contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      tokenBalance:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      contractAddress: '0x0000000000000000000000000000000000001010',
      tokenBalance:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      contractAddress: '0xDBf31dF14B66535aF65AaC99C32e9eA844e14501',
      tokenBalance:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      tokenBalance:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      tokenBalance:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
  ],
};

// How do we translate that response into we want to translate it into updated
// DB entries for the following tables

const finalHRNativeBalance = () => {
  // this looks like taking the hex input transforming and normalizing it
  // for human legibility and then sending it back it should return something like this:
  const returnDS = {
    dai: '', // basically you want to filter
    renbtc: '',
    matic: '',
    usdc: '',
    weth: '',
  };
  // you'll need some way of systemically updating these and leaving out
  // everything except the balance_id
  // so think about the logic of getting these things as something that goes like this:

  // you'll want to array.map over the following
};
