import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/lib/access/roles'

export const ProductOverrides: CollectionConfig = {
  slug: 'product-overrides',
  admin: {
    useAsTitle: 'productNameSnapshot',
    defaultColumns: [
      'productNameSnapshot',
      'featuredOnHomepage',
      'displayOrder',
      'updatedAt',
    ],
    description:
      'Site-side overrides for Square catalog products: long descriptions, SEO, extra image, homepage feature toggle, and display order. One row per Square item; reach this collection through /admin/products.',
    group: 'Operations',
  },
  access: {
    // Public read so the storefront can SSG/SSR pages with overrides applied.
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'squareItemId',
      type: 'text',
      label: 'Square Item ID',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Set automatically when the override is created from /admin/products.',
      },
    },
    {
      name: 'productNameSnapshot',
      type: 'text',
      label: 'Product Name (snapshot)',
      admin: {
        description:
          'Captured from Square at the time the override was created. The live name in Square is always the source of truth — this is just to make the admin list readable.',
      },
    },
    {
      name: 'featuredOnHomepage',
      type: 'checkbox',
      label: 'Featured on Homepage',
      defaultValue: false,
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description:
          'Lower numbers appear first within a category. Leave at 0 for default Square ordering.',
      },
    },
    {
      name: 'longDescription',
      type: 'richText',
      label: 'Long Description',
      admin: {
        description:
          'Marketing copy shown on the product page below the Square description.',
      },
    },
    {
      name: 'additionalImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Additional Image',
      admin: {
        description:
          'A site-only image (e.g. a lifestyle photo) shown alongside Square images.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta Title' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
      ],
    },
  ],
}
