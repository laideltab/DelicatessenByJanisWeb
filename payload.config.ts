import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Banners } from './src/collections/Banners'
import { Promotions } from './src/collections/Promociones'
import { Blog } from './src/collections/Blog'
import { Testimonials } from './src/collections/Testimonios'
import { Gallery } from './src/collections/Galeria'
import { SpecialOrders } from './src/collections/PedidosEspeciales'
import { OrderNotes } from './src/collections/OrderNotes'
import { ProductOverrides } from './src/collections/ProductOverrides'
import { SiteConfig } from './src/globals/SiteConfig'
import { resendPayloadAdapter } from './src/lib/email/payload-adapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Delicatessen by Janis Admin',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: [
        '/src/components/admin/orders/nav-link.tsx#default',
        '/src/components/admin/products/nav-link.tsx#default',
      ],
      views: {
        squareOrdersList: {
          Component: '/src/components/admin/orders/list-view.tsx#default',
          path: '/orders',
          exact: true,
          meta: { title: 'Square Orders' },
        },
        squareOrderDetail: {
          Component: '/src/components/admin/orders/detail-view.tsx#default',
          path: '/orders/:orderId',
          meta: { title: 'Order Detail' },
        },
        squareProductsList: {
          Component: '/src/components/admin/products/list-view.tsx#default',
          path: '/products',
          exact: true,
          meta: { title: 'Square Products' },
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Banners,
    Promotions,
    Blog,
    Testimonials,
    Gallery,
    SpecialOrders,
    OrderNotes,
    ProductOverrides,
  ],
  globals: [SiteConfig],
  editor: lexicalEditor(),
  email: resendPayloadAdapter,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      // Supabase's session-mode pooler caps clients at 15. `next build`
      // prerenders with 7 parallel workers, each holding its own pool, so
      // keep per-process connections low enough that they fit together.
      max: 2,
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET_NAME || '',
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
