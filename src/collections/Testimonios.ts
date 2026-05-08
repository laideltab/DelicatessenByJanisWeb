import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/lib/access/roles'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Customer Name',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
    },
    {
      name: 'rating',
      type: 'select',
      label: 'Rating',
      defaultValue: '5',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
      ],
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Customer Photo',
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Show on site',
      defaultValue: true,
    },
  ],
}

export { Testimonials as Testimonios }
