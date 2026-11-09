export const money = (n) => '$' + Number(n).toFixed(2)

export const price = (n) => Number(n).toFixed(2)

/** "Chipotle Sauce" -> "Chipotle" (board shows full name, UI shows short). */
export const shortSauce = (name) => name.replace(/ Sauce$/, '')

/** Google Maps directions link (BRAND.md §11). */
export const mapsUrl = ({ address, city, state, zip }) =>
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`Guacado Mexican Grill ${address} ${city} ${state} ${zip}`)

export const cityLine = ({ city, state, zip }) => `${city}, ${state} ${zip}`
