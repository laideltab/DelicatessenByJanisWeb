import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isStaff } from '@/lib/access/roles'

export const OrderNotes: CollectionConfig = {
  slug: 'order-notes',
  admin: {
    useAsTitle: 'squareOrderId',
    defaultColumns: ['squareOrderId', 'note', 'createdBy', 'createdAt'],
    description:
      'Internal notes attached to a Square order. One row per note; the orders dashboard at /admin/orders shows the most recent first.',
    group: 'Operations',
  },
  access: {
    read: isStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'squareOrderId',
      type: 'text',
      label: 'Square Order ID',
      required: true,
      index: true,
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Note',
      required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Created By',
      admin: { readOnly: true },
      hooks: {
        beforeChange: [
          ({ operation, req, value }) => {
            if (operation === 'create' && !value && req.user) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
  ],
}

export { OrderNotes as NotasDeOrden }
