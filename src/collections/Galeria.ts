import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/lib/access/roles'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'active'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      defaultValue: 'shop',
      required: true,
      options: [
        { label: 'Shop / Locale', value: 'shop' },
        { label: 'Products', value: 'products' },
        { label: 'Events', value: 'events' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Show on site',
      defaultValue: true,
    },
  ],
}

export { Gallery as Galeria }
