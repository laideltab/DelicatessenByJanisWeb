# Plan de Implementacion — Delicatessen by Janis
**Fecha:** Abril 2026  
**Version:** 1.1 — checkboxes actualizados al estado real del repo (8 julio 2026)

---

## Vision General

Reescritura completa del sitio web de Delicatessen by Janis con foco en:
- SEO tecnico y posicionamiento en Google
- Integracion nativa con Square (catalogo, inventario, pagos)
- Dashboard admin unificado via Payload CMS
- Performance y Core Web Vitals optimizados

---

## Stack Tecnologico

| Capa | Tecnologia | Rol |
|---|---|---|
| Frontend | Next.js 16 (App Router) | Sitio web SEO-optimizado |
| CMS / Admin | Payload CMS v3 | Dashboard, contenido, auth |
| Pagos / Catalogo | Square API | Productos, ordenes, pagos |
| Base de datos | Supabase (PostgreSQL) | Datos del sitio y pedidos |
| Media / Imagenes | Cloudflare R2 | Storage persistente de fotos |
| Hosting | Vercel | Deploy, CDN global |
| Email | Resend | Confirmaciones de orden |

---

## Arquitectura de Datos

```
Square Catalog API          Payload CMS (Postgres)
──────────────────          ──────────────────────
Productos                   Banners / Hero
Precios                     Anuncios / Promociones
Inventario                  Blog / Noticias
Ordenes                     Configuracion del sitio
Clientes                    Usuarios admin
Pagos                       Paginas estaticas (About, etc)
```

Square es la fuente de verdad para productos y transacciones.
Payload maneja todo el contenido editorial del sitio.

---

## Fases del Proyecto

---

## FASE 1 — Fundacion y Setup
**Duracion estimada:** 1 semana

### Sesion 1.1 — Inicializacion del proyecto
- [x] Crear repositorio en GitHub
- [x] Scaffold Next.js con App Router y TypeScript
- [x] Instalar y configurar Payload CMS v3 (como plugin de Next.js)
- [x] Configurar Supabase: crear proyecto, obtener connection string
- [x] Configurar Cloudflare R2: bucket, credenciales, CORS
- [x] Setup variables de entorno (.env.local y Vercel env vars)
- [ ] Primer deploy en Vercel conectado al repo

**Entregable:** App base corriendo en Vercel con Payload admin accesible en `/admin`

### Sesion 1.2 — Diseno y sistema visual
- [x] Definir paleta de colores (extraida del branding actual)
- [x] Tipografia: seleccionar fuentes Google Fonts o Adobe
- [x] Configurar Tailwind CSS con tokens de diseno del brand
- [x] Crear componentes base: Button, Card, Badge, Input
- [x] Layout base: Header, Footer, Navigation
- [x] Diseno responsive (mobile-first)

**Entregable:** Design system base, layout funcional en mobile y desktop

### Sesion 1.3 — Configuracion Square
- [x] Crear app en Square Developer Dashboard
- [x] Obtener credentials: Access Token, Location ID, App ID
- [x] Instalar Square Node SDK
- [x] Crear wrapper de cliente Square con manejo de errores
- [x] Probar conexion: listar productos del catalog existente
- [x] Mapear estructura de datos Square → modelo del sitio

**Entregable:** Conexion Square funcional, catalogo existente accesible via API

---

## FASE 2 — Paginas Principales y SEO Base
**Duracion estimada:** 1.5 semanas

### Sesion 2.1 — Homepage
- [x] Hero section con imagen destacada y CTA (video + banner editable desde Payload)
- [x] Seccion "Nuestras Especialidades" (categorias de productos)
- [x] Seccion "Sobre Janis" (historia, valores)
- [x] Seccion de galeria/fotos del local (desde coleccion Gallery de Payload)
- [x] Seccion de horarios y ubicacion con Google Maps embed
- [x] Instagram feed o galeria manual (galeria manual via Payload)
- [x] Testimonios / resenas de clientes (desde coleccion Testimonials de Payload)

**SEO en homepage:**
- Title: `Delicatessen by Janis | Bakery & Coffee Shop en [Ciudad]` ✓
- Meta description personalizada con keywords locales ✓
- Schema JSON-LD: `LocalBusiness` + `Bakery` ✓
- Open Graph completo para redes sociales ✓

### Sesion 2.2 — Paginas de Categorias
> Implementadas como ruta dinamica `/shop/[categoria]` en ingles, generadas
> desde el catalogo Square (no URLs fijas por categoria).

- [x] `/menu` — menu completo con filtros
- [x] Paginas de categoria dinamicas (`/shop/tortas-express`, `/shop/pasteles`, `/shop/bebidas`, `/shop/empanadas`, etc. — segun catalogo Square)

**SEO en categorias:**
- URLs descriptivas ✓
- H1 unico por categoria con keywords ✓
- Meta description unica por categoria ✓
- Schema `ItemList` con productos de la categoria ✓
- Breadcrumbs con Schema `BreadcrumbList` ✓

### Sesion 2.3 — Paginas de Producto Individual
- [x] Template dinamico `/shop/[categoria]/[producto-slug]`
- [x] Galeria de imagenes del producto
- [x] Descripcion, precio, variantes (tamanos, sabores)
- [x] Selector de cantidad
- [x] Boton "Agregar al carrito"
- [x] Productos relacionados
- [ ] Seccion de resenas (placeholder "coming soon" — falta implementar resenas reales)

**SEO en productos:**
- Title: `[Nombre Producto] | Delicatessen by Janis` ✓
- Schema JSON-LD: `Product` con precio, disponibilidad, imagenes ✓
- Meta description con descripcion y precio ✓
- URLs: `/shop/tortas-express/torta-de-chocolate-premium` ✓

### Sesion 2.4 — Paginas estaticas
- [x] `/about` — Historia de Janis, equipo, valores
- [x] `/contact` — Formulario, mapa, horarios, telefono, redes
- [x] `/memberships` — Planes de membresia con Square
- [x] `/special-orders` — Formulario para encargos custom
- [x] `/terms` — Terminos, privacidad, envios, devoluciones

---

## FASE 3 — Tienda y Checkout con Square
**Duracion estimada:** 1.5 semanas

### Sesion 3.1 — Catalogo de productos desde Square
- [x] Fetch de productos desde Square Catalog API (ISR con revalidate 60s)
- [x] Revalidacion automatica cuando Square actualiza un producto (webhook)
- [x] Mapeo de categorias Square → rutas del sitio
- [ ] Sincronizacion de imagenes Square → Cloudflare R2 (hoy se sirven directo desde el CDN de Square)
- [x] Manejo de productos sin stock (out of inventory)
- [x] Manejo de variantes (tamanos, sabores, extras)

### Sesion 3.2 — Carrito de compras
- [x] Estado del carrito con Zustand (persistente en localStorage)
- [x] Drawer/sidebar del carrito con items, cantidades, subtotal
- [x] Agregar / remover / actualizar cantidad de items
- [x] Validacion de stock en tiempo real antes de checkout
- [x] Calculo de impuestos via Square Tax API
- [x] Promo codes / descuentos via Square Discounts API

### Sesion 3.3 — Checkout con Square Web Payments SDK
- [x] Formulario de checkout: datos del cliente
- [x] Opciones de entrega: pickup en local vs delivery
- [x] Selector de fecha y hora para pickup
- [x] Integracion Square Web Payments SDK (tarjeta de credito)
- [ ] Apple Pay / Google Pay via Square (tipos declarados, falta UI de wallet buttons)
- [x] Creacion de Order en Square Orders API
- [x] Procesamiento de pago via Square Payments API
- [x] Pagina de confirmacion de orden

### Sesion 3.4 — Post-compra y notificaciones
- [x] Email de confirmacion al cliente via Resend
- [x] Email de notificacion a Janis con nuevo pedido
- [x] Pagina de estado del pedido (`/order/[order-id]`)
- [x] Webhook de Square para actualizar estado de orden

---

## FASE 4 — Dashboard Admin (Payload CMS)
**Duracion estimada:** 1 semana

### Sesion 4.1 — Colecciones de contenido en Payload
Configurar los modelos de contenido que Janis editara:

- [x] **Banners** — Hero principal, imagenes, texto, CTA, fechas activas → renderizado en el hero de homepage
- [x] **Promociones** — Ofertas temporales, descuentos, badges → seccion "This Week at Janis" en homepage con filtro por fechas
- [x] **Galeria** — Fotos del local, productos, eventos → seccion Gallery en homepage
- [x] **Blog/Noticias** — Posts con editor rich text → `/blog` y `/blog/[slug]` con SEO, JSON-LD Article y sitemap
- [x] **Testimonios** — Resenas manuales con foto y nombre → seccion Kind Words en homepage
- [x] **Configuracion del Sitio** — global SiteConfig en Payload
- [x] **Pedidos Especiales** — Formularios recibidos de clientes

### Sesion 4.2 — Panel de ordenes Square en el admin
- [x] Vista de ordenes recientes desde Square Orders API
- [x] Filtros: fecha, estado (pending, completed, cancelled)
- [x] Detalle de orden con items y datos del cliente
- [x] Boton para marcar orden como lista / entregada
- [x] Notas internas por orden

### Sesion 4.3 — Gestion de usuarios admin
- [x] Usuario administrador principal (Janis)
- [x] Rol "Editor" — puede editar contenido, no productos
- [x] Rol "Viewer" — solo lectura de ordenes
- [x] Login seguro con JWT via Payload Auth
- [x] Reset de password por email

### Sesion 4.4 — Integracion Payload + Square para productos
- [x] Vista de productos Square desde el admin de Payload
- [x] Editar descripcion larga, SEO title/description por producto
- [x] Campo para imagen adicional del sitio (separada de Square)
- [x] Toggle "Destacado en homepage" por producto
- [x] Orden de aparicion en categorias

---

## FASE 5 — SEO Tecnico Avanzado
**Duracion estimada:** 4-5 dias**

### Sesion 5.1 — Metadata dinamica
- [x] `generateMetadata()` en cada ruta dinamica
- [x] Open Graph images dinamicas con `next/og`
- [x] Twitter Cards
- [x] Canonical URLs en todas las paginas
- [ ] Hreflang si se necesita espanol/ingles (sitio hoy solo en ingles)

### Sesion 5.2 — Structured Data (Schema.org)
- [x] `LocalBusiness` + `Bakery` en homepage
- [x] `Product` en cada pagina de producto
- [x] `BreadcrumbList` en categorias y productos
- [x] `ItemList` en paginas de categoria
- [x] `FAQPage` en paginas relevantes (special-orders)
- [ ] `Review` / `AggregateRating` en productos con resenas (depende de implementar resenas)

### Sesion 5.3 — Sitemap y crawlability
- [x] Sitemap dinamico (nativo de Next via `app/sitemap.ts`, incluye productos, categorias y blog)
- [x] Sitemap de productos actualizado con cada sync de Square
- [x] robots.txt optimizado
- [ ] Google Search Console: verificacion y envio de sitemap
- [ ] Google Business Profile: vincular y verificar

### Sesion 5.4 — Performance (Core Web Vitals)
- [x] Optimizacion de imagenes con `next/image`
- [x] Lazy loading de secciones below the fold
- [x] Font optimization con `next/font`
- [x] Prefetch de rutas criticas (default de `next/link`)
- [ ] Bundle analysis y code splitting
- [ ] Target: LCP < 2.5s, CLS < 0.1, FID < 100ms (auditoria pendiente)

---

## FASE 6 — Testing, QA y Launch
**Duracion estimada:** 4-5 dias**

### Sesion 6.1 — Testing funcional
- [ ] Flujo completo de compra: browse → carrito → checkout → confirmacion
- [ ] Pago con tarjeta real en modo sandbox Square
- [ ] Formularios de contacto y pedidos especiales
- [ ] Admin: crear/editar/publicar contenido
- [ ] Responsive en iPhone, Android, tablet, desktop
- [ ] Cross-browser: Chrome, Safari, Firefox, Edge

### Sesion 6.2 — Auditoria SEO pre-launch
- [ ] Lighthouse audit: target 90+ en todas las categorias
- [ ] Screaming Frog crawl del sitio completo
- [ ] Verificar todos los meta tags, schemas, OG tags
- [ ] Revisar estructura de headings (H1, H2, H3)
- [ ] Verificar velocidad con PageSpeed Insights
- [ ] Revisar que no hay paginas sin meta description

### Sesion 6.3 — Migracion y launch
- [ ] Configurar dominio en Vercel (delicatessenbyjanis.com)
- [ ] SSL verificado
- [ ] Redireccionamientos 301 de URLs viejas de Wix a nuevas URLs
- [ ] DNS cutover con minimo downtime
- [ ] Verificar Google Analytics 4 funcionando (GA4 aun no integrado en el codigo)
- [ ] Activar Square en modo produccion (live credentials)
- [ ] Monitoreo de errores con Sentry o Vercel Analytics

### Sesion 6.4 — Post-launch
- [ ] Monitorear Google Search Console los primeros 7 dias
- [ ] Verificar indexacion de paginas principales
- [ ] Prueba de compra real con orden pequena
- [ ] Ajustes de velocidad si es necesario
- [ ] Documentacion basica para Janis (como usar el admin)

---

## Infraestructura y Costos Mensuales

| Servicio | Plan | Costo/mes |
|---|---|---|
| Vercel | Hobby (gratis) o Pro | $0 - $20 |
| Supabase | Free tier | $0 |
| Cloudflare R2 | Free hasta 10GB | $0 |
| Resend | Free hasta 3,000 emails | $0 |
| Square | Sin costo mensual | 2.6% + $0.10 por transaccion |
| **Total infraestructura** | | **$0 - $20/mes** |

---

## Estructura de Carpetas del Proyecto

```
web/
├── src/
│   ├── app/
│   │   ├── (frontend)/           # Rutas publicas del sitio
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── shop/
│   │   │   │   ├── [category]/
│   │   │   │   │   ├── page.tsx  # Pagina de categoria
│   │   │   │   │   └── [product]/
│   │   │   │   │       └── page.tsx  # Pagina de producto
│   │   │   ├── menu/page.tsx
│   │   │   ├── blog/             # Blog desde Payload
│   │   │   ├── contact/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── checkout/
│   │   ├── (payload)/            # Admin de Payload
│   │   │   └── admin/[[...segments]]/page.tsx
│   │   └── api/
│   │       ├── square/webhook/route.ts
│   │       ├── checkout/place-order/route.ts
│   │       └── [...slug]/route.ts   # API de Payload
│   ├── collections/              # Modelos Payload CMS
│   ├── globals/                  # SiteConfig
│   ├── components/
│   │   ├── ui/                   # Componentes base
│   │   ├── layout/               # Header, Footer, Nav
│   │   ├── home/                 # Secciones de homepage
│   │   ├── shop/ cart/ checkout/ # Tienda
│   │   ├── admin/                # Vistas custom del admin
│   │   └── seo/                  # JSON-LD components
│   ├── lib/
│   │   ├── square/               # Cliente Square y helpers
│   │   ├── payload/              # Queries de contenido Payload
│   │   └── email/                # Templates Resend
│   └── store/                    # Zustand (carrito)
├── payload.config.ts
├── next.config.ts
└── tailwind (v4 via globals.css)
```

---

## KPIs de Exito (3 meses post-launch)

| Metrica | Baseline actual | Target |
|---|---|---|
| Google Lighthouse Performance | Desconocido | > 90 |
| Core Web Vitals (LCP) | Desconocido | < 2.5s |
| Posicion en Google "bakery [ciudad]" | Desconocido | Top 5 |
| Indexacion de paginas de producto | Parcial (Wix JS) | 100% |
| Tasa de conversion tienda | Desconocido | > 2% |
| Click-through rate Search Console | Desconocido | > 5% |

---

## Proximos Pasos Inmediatos

1. Deploy en Vercel conectado al repo (si aun no esta)
2. Apple Pay / Google Pay en el checkout (Square Web Payments SDK)
3. Sincronizacion de imagenes Square → Cloudflare R2
4. Google Analytics 4 + monitoreo de errores
5. FASE 6 completa: testing funcional, auditoria SEO, dominio y launch
