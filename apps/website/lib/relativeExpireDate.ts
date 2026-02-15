export const relativeExpireDate = (relativeExpire: string) => {
  const date = new Date();

  switch (relativeExpire) {
    case '1day':
      date.setDate(date.getDate() + 1)
      break
    case '3days':
      date.setDate(date.getDate() + 3)
      break
    case '1week':
      date.setDate(date.getDate() + 7)
      break
    case '2weeks':
      date.setDate(date.getDate() + 14)
      break
    case '1month':
      date.setMonth(date.getMonth() + 1)
      break
  }

  return date;
}
