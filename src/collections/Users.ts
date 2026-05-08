import type { CollectionConfig } from 'payload'
import { fieldIsAdmin, hasRole, isAdmin, isAdminOrSelf } from '@/lib/access/roles'
import { siteConfig } from '@/lib/site-config'
import { buildForgotPasswordEmail } from '@/lib/email/templates/forgot-password'

const ADMIN_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? siteConfig.url

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    description:
      'Admin users and their roles. The first user created is automatically promoted to administrator.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 4, // 4 hours
    forgotPassword: {
      generateEmailSubject: () =>
        `Reset your ${siteConfig.name} admin password`,
      generateEmailHTML: (args) => {
        const token = args?.token ?? ''
        const user = args?.user as { name?: string | null } | undefined
        const resetUrl = `${ADMIN_BASE_URL}/admin/reset/${token}`
        return buildForgotPasswordEmail({
          resetUrl,
          recipientName: user?.name,
        }).html
      },
    },
  },
  access: {
    // Any logged-in staff member can list users (so relationships like
    // "createdBy" on order-notes can render). Field-level access still
    // hides the role selector from non-admins.
    read: ({ req }) => Boolean(req.user),
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      // First user becomes admin. After that, the default role applies.
      async ({ data, operation, req }) => {
        if (operation !== 'create' || !req.payload) return data
        const count = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
        })
        if (count.totalDocs === 0) {
          return { ...data, role: 'admin' }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      required: true,
      // Only admins can change someone's role (or assign one on create).
      access: {
        create: fieldIsAdmin,
        update: fieldIsAdmin,
      },
      admin: {
        description:
          'Administrator: full access. Editor: content + orders, no user management. Viewer: read-only orders.',
      },
    },
  ],
}

export { hasRole as hasUserRole }
