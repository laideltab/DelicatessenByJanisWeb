# Plan de Implementacion — Delicatessen by Janis
**Fecha:** Abril 2026  
**Version:** 1.0

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
| Frontend | Next.js 15 (App Router) | Sitio web SEO-optimizado |
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
- [ ] Crear repositorio en GitHub
- [ ] Scaffold Next.js 15 con App Router y TypeScript
- [ ] Instalar y configurar Payload CMS v3 (como plugin de Next.js)
- [ ] Configurar Supabase: crear proyecto, obtener connection string
- [ ] Configurar Cloudflare R2: bucket, credenciales, CORS
- [ ] Setup variables de entorno (.env.local y Vercel env vars)
- [ ] Primer deploy en Vercel conectado al repo

**Entregable:** App base corriendo en Vercel con Payload admin accesible en `/admin`

### Sesion 1.2 — Diseno y sistema visual
- [ ] Definir paleta de colores (extraida del branding actual)
- [ ] Tipografia: seleccionar fuentes Google Fonts o Adobe
- [ ] Configurar Tailwind CSS con tokens de diseno del brand
- [ ] Crear componentes base: Button, Card, Badge, Input
- [ ] Layout base: Header, Footer, Navigation
- [ ] Diseno responsive (mobile-first)

**Entregable:** Design system base, layout funcional en mobile y desktop

### Sesion 1.3 — Configuracion Square
- [ ] Crear app en Square Developer Dashboard
- [ ] Obtener credentials: Access Token, Location ID, App ID
- [ ] Instalar Square Node SDK
- [ ] Crear wrapper de cliente Square con manejo de errores
- [ ] Probar conexion: listar productos del catalog existente
- [ ] Mapear estructura de datos Square → modelo del sitio

**Entregable:** Conexion Square funcional, catalogo existente accesible via API

---

## FASE 2 — Paginas Principales y SEO Base
**Duracion estimada:** 1.5 semanas

### Sesion 2.1 — Homepage
- [ ] Hero section con imagen destacada y CTA
- [ ] Seccion "Nuestras Especialidades" (categorias de productos)
- [ ] Seccion "Sobre Janis" (historia, valores)
- [ ] Seccion de galeria/fotos del local
- [ ] Seccion de horarios y ubicacion con Google Maps embed
- [ ] Instagram feed o galeria manual
- [ ] Testimonios / resenas de clientes

**SEO en homepage:**
- Title: `Delicatessen by Janis | Bakery & Coffee Shop en [Ciudad]`
- Meta description personalizada con keywords locales
- Schema JSON-LD: `LocalBusiness` + `Bakery`
- Open Graph completo para redes sociales

### Sesion 2.2 — Paginas de Categorias
Paginas para cada categoria del catalogo Square:
- [ ] `/menu` — menu completo con filtros
- [ ] `/tienda/tortas-express` — Express Cakes
- [ ] `/tienda/charlotte-cakes` — Charlotte Cakes
- [ ] `/tienda/cookie-cakes` — Cookie Cakes
- [ ] `/tienda/pasteles` — Pasteles y reposteria
- [ ] `/tienda/bebidas` — Cafeteria y bebidas
- [ ] `/tienda/sandwiches` — Sandwiches y salados
- [ ] `/tienda/empanadas` — Empanadas

**SEO en categorias:**
- URLs descriptivas en espanol
- H1 unico por categoria con keywords
- Meta description unica por categoria
- Schema `ItemList` con productos de la categoria
- Breadcrumbs con Schema `BreadcrumbList`

### Sesion 2.3 — Paginas de Producto Individual
- [ ] Template dinamico `/tienda/[categoria]/[producto-slug]`
- [ ] Galeria de imagenes del producto
- [ ] Descripcion, precio, variantes (tamanos, sabores)
- [ ] Selector de cantidad
- [ ] Boton "Agregar al carrito"
- [ ] Productos relacionados
- [ ] Seccion de resenas

**SEO en productos:**
- Title: `[Nombre Producto] | Delicatessen by Janis`
- Schema JSON-LD: `Product` con precio, disponibilidad, imagenes
- Meta description con descripcion y precio
- URLs: `/tienda/tortas-express/torta-de-chocolate-premium`

### Sesion 2.4 — Paginas estaticas
- [ ] `/sobre-nosotros` — Historia de Janis, equipo, valores
- [ ] `/contacto` — Formulario, mapa, horarios, telefono, redes
- [ ] `/membresias` — Planes de membresia con Square
- [ ] `/pedidos-especiales` — Formulario para encargos custom
- [ ] `/politicas` — Terminos, privacidad, envios, devoluciones

---

## FASE 3 — Tienda y Checkout con Square
**Duracion estimada:** 1.5 semanas

### Sesion 3.1 — Catalogo de productos desde Square
- [ ] Fetch de productos desde Square Catalog API en build time (SSG)
- [ ] Revalidacion automatica cuando Square actualiza un producto (webhook)
- [ ] Mapeo de categorias Square → rutas del sitio
- [ ] Sincronizacion de imagenes Square → Cloudflare R2
- [ ] Manejo de productos sin stock (out of inventory)
- [ ] Manejo de variantes (tamanos, sabores, extras)

### Sesion 3.2 — Carrito de compras
- [ ] Estado del carrito con Zustand (persistente en localStorage)
- [ ] Drawer/sidebar del carrito con items, cantidades, subtotal
- [ ] Agregar / remover / actualizar cantidad de items
- [ ] Validacion de stock en tiempo real antes de checkout
- [ ] Calculo de impuestos via Square Tax API
- [ ] Promo codes / descuentos via Square Discounts API

### Sesion 3.3 — Checkout con Square Web Payments SDK
- [ ] Formulario de checkout: datos del cliente
- [ ] Opciones de entrega: pickup en local vs delivery
- [ ] Selector de fecha y hora para pickup
- [ ] Integracion Square Web Payments SDK (tarjeta de credito)
- [ ] Apple Pay / Google Pay via Square
- [ ] Creacion de Order en Square Orders API
- [ ] Procesamiento de pago via Square Payments API
- [ ] Pagina de confirmacion de orden

### Sesion 3.4 — Post-compra y notificaciones
- [ ] Email de confirmacion al cliente via Resend
- [ ] Email de notificacion a Janis con nuevo pedido
- [ ] Pagina de estado del pedido (`/mi-orden/[order-id]`)
- [ ] Webhook de Square para actualizar estado de orden

---

## FASE 4 — Dashboard Admin (Payload CMS)
**Duracion estimada:** 1 semana

### Sesion 4.1 — Colecciones de contenido en Payload
Configurar los modelos de contenido que Janis editara:

- [ ] **Banners** — Hero principal, imagenes, texto, CTA, fechas activas
- [ ] **Promociones** — Ofertas temporales, descuentos, badges
- [ ] **Galeria** — Fotos del local, productos, eventos
- [ ] **Blog/Noticias** — Posts con editor rich text
- [ ] **Testimonios** — Resenas manuales con foto y nombre
- [ ] **Configuracion del Sitio** — Logo, colores, redes sociales, horarios
- [ ] **Pedidos Especiales** — Formularios recibidos de clientes

### Sesion 4.2 — Panel de ordenes Square en el admin
- [ ] Vista de ordenes recientes desde Square Orders API
- [ ] Filtros: fecha, estado (pending, completed, cancelled)
- [ ] Detalle de orden con items y datos del cliente
- [ ] Boton para marcar orden como lista / entregada
- [ ] Notas internas por orden

### Sesion 4.3 — Gestion de usuarios admin
- [ ] Usuario administrador principal (Janis)
- [ ] Rol "Editor" — puede editar contenido, no productos
- [ ] Rol "Viewer" — solo lectura de ordenes
- [ ] Login seguro con JWT via Payload Auth
- [ ] Reset de password por email

### Sesion 4.4 — Integracion Payload + Square para productos
- [ ] Vista de productos Square desde el admin de Payload
- [ ] Editar descripcion larga, SEO title/description por producto
- [ ] Campo para imagen adicional del sitio (separada de Square)
- [ ] Toggle "Destacado en homepage" por producto
- [ ] Orden de aparicion en categorias

---

## FASE 5 — SEO Tecnico Avanzado
**Duracion estimada:** 4-5 dias**

### Sesion 5.1 — Metadata dinamica
- [ ] `generateMetadata()` en cada ruta dinamica
- [ ] Open Graph images dinamicas con `next/og`
- [ ] Twitter Cards
- [ ] Canonical URLs en todas las paginas
- [ ] Hreflang si se necesita espanol/ingles

### Sesion 5.2 — Structured Data (Schema.org)
- [ ] `LocalBusiness` + `Bakery` en homepage
- [ ] `Product` en cada pagina de producto
- [ ] `BreadcrumbList` en categorias y productos
- [ ] `ItemList` en paginas de categoria
- [ ] `FAQPage` en paginas relevantes
- [ ] `Review` / `AggregateRating` en productos con resenas

### Sesion 5.3 — Sitemap y crawlability
- [ ] Sitemap dinamico generado con `next-sitemap`
- [ ] Sitemap de productos actualizado con cada sync de Square
- [ ] robots.txt optimizado
- [ ] Google Search Console: verificacion y envio de sitemap
- [ ] Google Business Profile: vincular y verificar

### Sesion 5.4 — Performance (Core Web Vitals)
- [ ] Optimizacion de imagenes con `next/image` + Cloudflare R2
- [ ] Lazy loading de secciones below the fold
- [ ] Font optimization con `next/font`
- [ ] Prefetch de rutas criticas
- [ ] Bundle analysis y code splitting
- [ ] Target: LCP < 2.5s, CLS < 0.1, FID < 100ms

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
- [ ] Verificar Google Analytics 4 funcionando
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
delicatessen-by-janis/
├── src/
│   ├── app/
│   │   ├── (sitio)/              # Rutas publicas del sitio
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── tienda/
│   │   │   │   ├── [categoria]/
│   │   │   │   │   ├── page.tsx  # Pagina de categoria
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Pagina de producto
│   │   │   ├── menu/page.tsx
│   │   │   ├── contacto/page.tsx
│   │   │   ├── sobre-nosotros/page.tsx
│   │   │   └── checkout/
│   │   │       ├── page.tsx
│   │   │       └── confirmacion/page.tsx
│   │   ├── (payload)/            # Admin de Payload
│   │   │   └── admin/[[...segments]]/page.tsx
│   │   └── api/
│   │       ├── square/
│   │       │   ├── webhook/route.ts
│   │       │   └── checkout/route.ts
│   │       └── [...payload]/route.ts
│   ├── collections/              # Modelos Payload CMS
│   │   ├── Banners.ts
│   │   ├── Promociones.ts
│   │   ├── Blog.ts
│   │   └── Configuracion.ts
│   ├── components/
│   │   ├── ui/                   # Componentes base
│   │   ├── layout/               # Header, Footer, Nav
│   │   ├── shop/                 # ProductCard, Cart, etc
│   │   └── seo/                  # SchemaOrg, MetaTags
│   ├── lib/
│   │   ├── square/               # Cliente Square y helpers
│   │   ├── supabase/             # Cliente Supabase
│   │   └── email/                # Templates Resend
│   └── store/                    # Zustand (carrito)
├── payload.config.ts
├── next.config.ts
└── tailwind.config.ts
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

1. Confirmar stack: **Next.js 15 + Payload v3 + Square + Supabase + Vercel**
2. Crear cuentas: Supabase, Cloudflare, Vercel, Resend, Square Developer
3. Compartir credenciales Square existentes (Access Token, Location ID)
4. Iniciar **Sesion 1.1 — Setup del proyecto**
