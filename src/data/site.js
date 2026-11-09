// Static site content that is not part of the menu/location JSON.
// Navigation labels, order and URLs come from BRAND.md §2 and must not change.

export const ORDER_URL = 'https://order.online/business/gaucado-14231153' // sic: live ordering link
const MAIN = 'https://guacadomexican.com'

export const site = {
  name: 'Guacado Mexican Grill',
  email: 'guacadomexicangrill@gmail.com',
  hours: 'Mon – Sun · 10:30am – 3am',
  hoursShort: '10:30am – 3am',
  hoursOpen: 'Open every day · 10:30am – 3am',
  hoursLong: 'Open every day, 10:30am – 3am',
  hoursProse: 'Open every day from 10:30am to 3am',
  orderUrl: ORDER_URL,
  facebook: 'https://www.facebook.com/61573724264624',
  instagram: 'https://www.instagram.com/guacadomexicangrill',
  accessibility: `${MAIN}/accessibility-page-01`,
}

// `to` = internal route (multi-page build, BRAND.md §2); `href` = external.
export const nav = [
  { label: 'Menu', to: '/menu', legacy: `${MAIN}/brooklyn-guacado-mexican-grill-food-menu` },
  { label: 'Order', href: ORDER_URL },
  { label: 'Catering', to: '/catering', legacy: `${MAIN}/brooklyn-guacado-mexican-grill-catering` },
  {
    label: 'Jobs',
    href: 'https://tmt.spotapps.co/job-listings?spot_id=466389&callback_url=http%3A%2F%2Fguacadomexican.com%2F',
  },
  { label: 'Locations', to: '/locations', legacy: `${MAIN}/brooklyn-guacado-mexican-grill-locations` },
  {
    label: 'Franchise Opportunities',
    href: `${MAIN}/brooklyn-guacado-mexican-grill-franchise-opportunities`,
  },
]

export const links = {
  jobs: nav.find((n) => n.label === 'Jobs').href,
  franchise: nav.find((n) => n.label === 'Franchise Opportunities').href,
  cateringPackages: `${MAIN}/brooklyn-guacado-mexican-grill-catering`,
  fullMenu: `${MAIN}/brooklyn-guacado-mexican-grill-food-menu`,
}

export const footerColumns = [
  {
    title: 'Explore',
    items: ['Menu', 'Order', 'Catering', 'Locations'],
  },
  {
    title: 'Company',
    items: ['Jobs', 'Franchise Opportunities'],
    extra: [{ label: 'Accessibility', href: site.accessibility }],
  },
]

export const occasions = [
  'Birthdays', 'Holiday Parties', 'Corporate', 'Weddings', 'Rehearsal Dinners', 'Game Day',
]

// Header shows these as text links; Order is the button, Jobs/Franchise live in the drawer + footer.
export const headerNav = ['Menu', 'Catering', 'Locations']

export const stateNames = {
  NY: 'New York',
  NJ: 'New Jersey',
  MD: 'Maryland',
  CT: 'Connecticut',
  PA: 'Pennsylvania',
  MI: 'Michigan',
}

export const advisory =
  'Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions. Please inform us of any allergies you may have prior to ordering.'

// Builder pricing rules (BRAND.md §8): protein sets the price; add-ons are flat.
export const heatLabels = { 1: 'Hot', 2: 'Very hot', 3: 'Extra hot' }
