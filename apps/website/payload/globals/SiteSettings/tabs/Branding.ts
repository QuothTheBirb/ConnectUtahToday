import {Tab} from "payload";

export const BrandingTab: Tab = {
  name: 'branding',
  label: 'Branding',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      admin: {
        description: 'Optional, currently unused.'
      }
    }
  ]
}
