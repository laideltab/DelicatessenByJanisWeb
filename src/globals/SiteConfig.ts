import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Configuration',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      label: 'Business Name',
      defaultValue: 'Delicatessen by Janis',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline / Slogan',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        { name: 'phone', type: 'text', label: 'Phone' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'address', type: 'text', label: 'Address' },
        { name: 'city', type: 'text', label: 'City' },
      ],
    },
    {
      name: 'hours',
      type: 'array',
      label: 'Business Hours',
      fields: [
        { name: 'days', type: 'text', label: 'Days (e.g. Monday - Friday)' },
        { name: 'hours', type: 'text', label: 'Hours (e.g. 8:00am - 6:00pm)' },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
      fields: [
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'tiktok', type: 'text', label: 'TikTok URL' },
        { name: 'whatsapp', type: 'text', label: 'WhatsApp Number' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Global SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Default Meta Title',
          defaultValue: 'Delicatessen by Janis | Bakery & Coffee Shop',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Default Meta Description',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Main Keywords',
        },
      ],
    },
  ],
}
