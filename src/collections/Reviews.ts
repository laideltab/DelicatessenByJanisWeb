import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/lib/access/roles'

/**
 * Customer product reviews. Submitted from the storefront via
 * /api/reviews (always unapproved); Janis approves them in the admin
 * before they appear on the product page.
 */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['productNameSnapshot', 'name', 'rating', 'approved', 'createdAt'],
  },
  access: {
    // Public readers only see approved reviews; logged-in staff see all.
    read: ({ req }) => (req.user ? true : { approved: { equals: true } }),
    // Created server-side by the API route (overrideAccess), never directly.
    create: () => false,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'squareItemId',
      type: 'text',
      label: 'Square Item ID',
      required: true,
      index: true,
      admin: {
        description: 'Square catalog item this review belongs to',
      },
    },
    {
      name: 'productNameSnapshot',
      type: 'text',
      label: 'Product (at submission time)',
    },
    {
      name: 'name',
      type: 'text',
      label: 'Customer Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email (never shown publicly)',
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Rating (1-5)',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Review',
      required: true,
    },
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Approved (visible on site)',
      defaultValue: false,
    },
  ],
}
