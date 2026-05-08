import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isStaff } from '@/lib/access/roles'

export const SpecialOrders: CollectionConfig = {
  slug: 'special-orders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'eventDate', 'occasion', 'status', 'createdAt'],
    description:
      'Custom cake and catering requests submitted from /special-orders. Update status as you work each request.',
  },
  access: {
    // Viewers see read-only; only admin/editor can mutate. Public submissions
    // arrive via /api/special-orders using overrideAccess, so create here is
    // restricted to authenticated staff.
    read: isStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Customer Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: 'Phone', required: true },
        { name: 'eventDate', type: 'date', label: 'Event Date', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'guests', type: 'number', label: 'Guests', required: true, min: 1 },
        { name: 'occasion', type: 'text', label: 'Occasion', required: true },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Customer Description',
      required: true,
    },
    {
      name: 'reference',
      type: 'textarea',
      label: 'Reference / Inspiration',
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        description: 'Only visible to staff. Customer never sees this.',
      },
    },
  ],
}

export { SpecialOrders as PedidosEspeciales }
