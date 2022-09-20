export const tokenBalFormatter = (balance: string, decimal: number) => {
  console.log(balance.length, decimal);
  let formattedValue;
  if (balance.length < decimal) {
    const difference = decimal - balance.length;
    const leadingZeros = '0'.repeat(difference);
    console.log(leadingZeros);
    formattedValue = '.' + balance;
    formattedValue = Number(formattedValue) / (10 ** difference + 1);
  } else {
    const balanceArr = balance.split('');
    balanceArr.splice(balanceArr.length - decimal, 0, '.');
    formattedValue = balanceArr.join('');
    Number(formattedValue);
  }
  return formattedValue;
};
