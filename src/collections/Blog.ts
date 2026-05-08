import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/lib/access/roles'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
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
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      admin: {
        description: 'SEO-friendly URL, e.g. chocolate-cake-recipe',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt (for SEO and listings)',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish Date',
    },
  ],
}
