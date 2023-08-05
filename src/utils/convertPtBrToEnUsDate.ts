export function convertPtBrToEnUsDate(date: string) {
  const parts = date.split('/')

  const day = parts[0]
  const month = parts[1]
  const year = parts[2]

  const usDate = `${month}/${day}/${year}`

  return usDate
}
