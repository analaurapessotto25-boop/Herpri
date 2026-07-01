import { useState, useEffect, type ChangeEvent } from "react"
import {
  Heart, Menu, X, MessageCircle, Star, Gift,
  Plus, Trash2, Pencil, Save, LogOut, Eye, EyeOff,
  ShoppingBag, Leaf, ArrowRight, Package, Check, Camera,
} from "lucide-react"
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback"
import logoImg from "@/imports/6ad7c689-87f1-4ddf-9d70-e3e336f53017.png"

// ─── Constants ────────────────────────────────────────────────────────────────
const WA = "5511971895534"
const IG = "cestas_herpri"
const wa = (msg: string, phone = WA) => `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
const instagramUrl = (user = IG) => `https://instagram.com/${user.replace(/^@/, "")}`
const instagramHandle = (user = IG) => user.startsWith("@") ? user : `@${user}`
const STORAGE_KEY = "herpri_products"
const SITE_CONTENT_KEY = "herpri_site_content"
const ADMIN_PASS = "GaelHPM1234*"
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=380&fit=crop&auto=format"
const PRODUCT_IMAGE_MAX_SIDE = 1200
const PRODUCT_IMAGE_QUALITY = 0.82

// ─── Font helpers ─────────────────────────────────────────────────────────────
const DISPLAY: React.CSSProperties = { fontFamily: "'Playfair Display', serif" }
const SCRIPT: React.CSSProperties = { fontFamily: "'Great Vibes', cursive" }
const BODY: React.CSSProperties = { fontFamily: "'Lato', sans-serif" }

// ─── Types ────────────────────────────────────────────────────────────────────
type Page =
  | "inicio" | "sobre" | "produtos" | "monte"
  | "datas" | "galeria" | "depoimentos" | "contato" | "painel"

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  featured: boolean
}

interface HeroBadge {
  label: string
  sub: string
}

interface AboutPillar {
  title: string
  desc: string
}

interface DateItem {
  title: string
  emoji: string
  desc: string
}

interface GalleryItem {
  src: string
  cat: string
  alt: string
}

interface Testimonial {
  name: string
  stars: number
  occasion: string
  text: string
}

interface SiteContent {
  brandName: string
  tagline: string
  whatsappNumber: string
  whatsappDisplay: string
  instagramUser: string
  logoImage: string
  heroSloganLine1: string
  heroSloganLine2: string
  heroDescription: string
  heroPrimaryButton: string
  heroSecondaryButton: string
  heroBadges: HeroBadge[]
  aboutEyebrow: string
  aboutTitle: string
  aboutImage: string
  aboutParagraph1: string
  aboutParagraph2: string
  aboutParagraph3: string
  aboutQuote: string
  aboutPillars: AboutPillar[]
  productsEyebrow: string
  productsTitle: string
  basketEyebrow: string
  basketTitle: string
  basketDescription: string
  datesEyebrow: string
  datesTitle: string
  dates: DateItem[]
  galleryEyebrow: string
  galleryTitle: string
  gallery: GalleryItem[]
  testimonialsEyebrow: string
  testimonialsTitle: string
  testimonials: Testimonial[]
  contactEyebrow: string
  contactTitle: string
  contactDescription: string
  contactImage: string
  contactHoursTitle: string
  contactWeekHours: string
  contactSaturdayHours: string
  contactHoursNote: string
  contactDeliveryLabel: string
  contactDeliveryArea: string
  contactDeliveryNote: string
  footerSlogan: string
  footerCopyright: string
}

// ─── Sample Products ──────────────────────────────────────────────────────────
const SAMPLE: Product[] = [
  {
    id: "s1", name: "Cesta Café da Manhã Especial", category: "Café da Manhã", price: 89.90, featured: true,
    description: "Pães artesanais, geleia artesanal, mel, frutas frescas e muito amor numa cesta encantadora.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=380&fit=crop&auto=format",
  },
  {
    id: "s2", name: "Cesta de Chocolates Premium", category: "Chocolates", price: 79.90, featured: true,
    description: "Seleção especial de chocolates finos nacionais e importados em embalagem delicada.",
    image: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=500&h=380&fit=crop&auto=format",
  },
  {
    id: "s3", name: "Cesta de Aniversário", category: "Aniversários", price: 99.90, featured: false,
    description: "Surpresa personalizada para o aniversariante! Criada conforme seus gostos e preferências.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=380&fit=crop&auto=format",
  },
  {
    id: "s4", name: "Kit Romântico para Casais", category: "Românticos", price: 129.90, featured: true,
    description: "Velas aromáticas, taça, chocolates finos, pétalas de rosa e cartão personalizado.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=380&fit=crop&auto=format",
  },
  {
    id: "s5", name: "Kit Corporativo Elegante", category: "Corporativos", price: 149.90, featured: false,
    description: "Presenteie sua equipe ou clientes com sofisticação. Produtos selecionados e embalagem premium.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=380&fit=crop&auto=format",
  },
  {
    id: "s6", name: "Lembrancinha Personalizada", category: "Lembrancinhas", price: 19.90, featured: false,
    description: "Delicada lembrancinha para chás de bebê, casamentos, batizados e eventos especiais.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=380&fit=crop&auto=format",
  },
  {
    id: "s7", name: "Taça Personalizada", category: "Taças e Canecas", price: 59.90, featured: false,
    description: "Taça com nome e mensagem gravados. Presente único e especial para guardar para sempre.",
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=500&h=380&fit=crop&auto=format",
  },
  {
    id: "s8", name: "Cesta Dia das Mães", category: "Datas Comemorativas", price: 109.90, featured: true,
    description: "Mostre seu amor com uma cesta especialmente preparada para essa data inesquecível.",
    image: "https://images.unsplash.com/photo-1490750967868-88df5691cc53?w=500&h=380&fit=crop&auto=format",
  },
]

const CATEGORIES = [
  "Todos", "Café da Manhã", "Chocolates", "Aniversários", "Românticos",
  "Corporativos", "Lembrancinhas", "Taças e Canecas", "Datas Comemorativas",
]

const PRICE_RANGES = [
  { label: "Todos os preços", min: 0, max: Infinity },
  { label: "Até R$ 30", min: 0, max: 30 },
  { label: "R$ 30 – 60", min: 30, max: 60 },
  { label: "R$ 60 – 100", min: 60, max: 100 },
  { label: "Acima de R$ 100", min: 100, max: Infinity },
]

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const resizeImageForStorage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Escolha um arquivo de imagem."))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Nao foi possivel carregar a imagem."))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error("Nao foi possivel carregar a imagem."))
      image.onload = () => {
        const largestSide = Math.max(image.width, image.height)
        const scale = Math.min(1, PRODUCT_IMAGE_MAX_SIDE / largestSide)
        const width = Math.max(1, Math.round(image.width * scale))
        const height = Math.max(1, Math.round(image.height * scale))
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Nao foi possivel preparar a imagem."))
          return
        }

        canvas.width = width
        canvas.height = height
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(image, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", PRODUCT_IMAGE_QUALITY))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })

// ─── Decorative SVG Components ────────────────────────────────────────────────
function MiniHeart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" className={className} fill="currentColor">
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.4 4.068 2 6.281 2c1.312 0 4.151.501 5.719 4.457C13.59 2.489 16.464 2 17.726 2 20.266 2 23 3.621 23 7.181c0 4.069-5.136 8.625-11 14.412z" />
    </svg>
  )
}

function LeafPair({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 40" className={className} fill="currentColor">
      <path d="M40 38 C28 28 8 24 12 8 C18 0 34 8 40 22 C46 8 62 0 68 8 C72 24 52 28 40 38Z" />
    </svg>
  )
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="h-px w-16" style={{ backgroundColor: "rgba(184,147,90,0.35)" }} />
      <MiniHeart className="w-3 h-3 text-accent" />
      <div className="h-px w-16" style={{ backgroundColor: "rgba(184,147,90,0.35)" }} />
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV: { id: Page; label: string }[] = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "produtos", label: "Produtos" },
  { id: "monte", label: "Monte sua Cesta" },
  { id: "datas", label: "Datas Comemorativas" },
  { id: "galeria", label: "Galeria" },
  { id: "depoimentos", label: "Depoimentos" },
  { id: "contato", label: "Contato" },
]

function Navbar({ page, setPage, content }: { page: Page; setPage: (p: Page) => void; content: SiteContent }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => { setPage("inicio"); setOpen(false) }}
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <ImageWithFallback
              src={content.logoImage || logoImg}
              alt={`Logo ${content.brandName}`}
              className="h-10 w-10 object-contain"
            />
            <span className="text-sm font-semibold tracking-widest text-foreground/60 uppercase hidden sm:block" style={DISPLAY}>
              {content.brandName}
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`px-3 py-2 text-xs tracking-wide rounded-lg transition-all ${
                  page === item.id
                    ? "text-primary font-semibold"
                    : "text-foreground/55 hover:text-foreground"
                }`}
                style={BODY}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setPage("painel")}
              className="ml-3 px-3 py-1.5 text-xs rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
              style={BODY}
            >
              Painel
            </button>
          </nav>

          <button
            className="xl:hidden p-2 text-foreground/60 hover:text-foreground transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="xl:hidden border-t border-border bg-background px-4 pb-5 pt-3">
          {[...NAV, { id: "painel" as Page, label: `Painel ${content.brandName}` }].map(item => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setOpen(false) }}
              className={`block w-full text-left px-4 py-3 text-sm rounded-xl transition-all ${
                page === item.id ? "bg-muted text-primary font-semibold" : "text-foreground/70 hover:bg-muted"
              }`}
              style={BODY}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ setPage, content }: { setPage: (p: Page) => void; content: SiteContent }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Subtle ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #b8935a, transparent)" }} />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #6b7c5a, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #d4a0a0, transparent)", transform: "translate(-50%,-50%)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left — copy */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="text-5xl sm:text-6xl text-primary leading-tight mb-6" style={SCRIPT}>
              {content.heroSloganLine1}<br />{content.heroSloganLine2}
            </p>

            <SectionDivider />

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-none mb-3" style={DISPLAY}>
              {content.brandName}
            </h1>
            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6" style={BODY}>
              {content.tagline}
            </p>
            <p className="text-base text-foreground/70 leading-relaxed mb-9 max-w-md mx-auto lg:mx-0" style={BODY}>
              {content.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => setPage("produtos")}
                className="px-8 py-3.5 bg-primary text-white rounded-full text-sm font-medium tracking-wide hover:bg-primary/85 transition-all shadow-md hover:shadow-lg"
                style={BODY}
              >
                {content.heroPrimaryButton}
              </button>
              <a
                href={wa("Olá, Herpri! 🌿 Vim pelo site e gostaria de fazer um pedido.", content.whatsappNumber)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3.5 border border-primary text-primary rounded-full text-sm font-medium tracking-wide hover:bg-primary hover:text-white transition-all"
                style={BODY}
              >
                <MessageCircle size={15} />
                {content.heroSecondaryButton}
              </a>
            </div>

            {/* Quick trust badges */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              {content.heroBadges.map(b => (
                <div key={b.label} className="text-center">
                  <p className="text-base font-bold text-primary" style={DISPLAY}>{b.sub}</p>
                  <p className="text-xs text-muted-foreground" style={BODY}>{b.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — logo showcase */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="relative">
              {/* Outer rings */}
              <div className="absolute inset-0 rounded-full border border-primary/10 scale-[1.18]" />
              <div className="absolute inset-0 rounded-full border border-primary/06 scale-[1.35]" />

              {/* Main circle */}
              <div
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center shadow-2xl border-2"
                style={{ backgroundColor: "#fdf0e4", borderColor: "rgba(184,147,90,0.4)" }}
              >
                <ImageWithFallback
                  src={content.logoImage || logoImg}
                  alt={`${content.brandName} - ${content.tagline}`}
                  className="w-52 h-52 sm:w-68 sm:h-68 object-contain"
                  style={{ width: "85%", height: "85%" }}
                />
              </div>

              {/* Floating accents */}
              <div className="absolute -top-5 -right-3 text-accent">
                <MiniHeart className="w-7 h-7 drop-shadow-sm" />
              </div>
              <div className="absolute top-10 -left-9 text-accent opacity-50">
                <MiniHeart className="w-4 h-4" />
              </div>
              <div className="absolute -bottom-4 -left-8 text-[#6b7c5a] opacity-50">
                <LeafPair className="w-16 h-8" />
              </div>
              <div className="absolute -bottom-2 -right-8 text-[#6b7c5a] opacity-35">
                <LeafPair className="w-12 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection({ content }: { content: SiteContent }) {
  const pillarIcons = [Heart, Leaf, Package, ShoppingBag]

  return (
    <section className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-4xl text-primary mb-2 leading-snug" style={SCRIPT}>{content.aboutEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1" style={DISPLAY}>{content.aboutTitle}</h2>
          <SectionDivider />
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
          <div className="relative">
            <div className="aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden shadow-xl border border-border">
              <ImageWithFallback
                src={content.aboutImage}
                alt={content.aboutTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 text-[#6b7c5a] opacity-30">
              <LeafPair className="w-24 h-14" />
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-lg text-foreground/80 leading-relaxed" style={BODY}>
              {content.aboutParagraph1}
            </p>
            <p className="text-base text-foreground/65 leading-relaxed" style={BODY}>
              {content.aboutParagraph2}
            </p>
            <p className="text-base text-foreground/65 leading-relaxed" style={BODY}>
              {content.aboutParagraph3}
            </p>
            <div className="pt-4 pl-1">
              <p className="text-3xl text-primary leading-snug" style={SCRIPT}>
                "{content.aboutQuote}"
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.aboutPillars.map(({ title, desc }, index) => {
            const Icon = pillarIcons[index] || Heart
            return (
            <div
              key={title}
              className="bg-card rounded-2xl p-6 text-center border border-border hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fdf0e4" }}>
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm" style={DISPLAY}>{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed" style={BODY}>{desc}</p>
            </div>
          )})}
        </div>
      </div>
    </section>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, content }: { product: Product; content: SiteContent }) {
  const msg = `Olá, Herpri! 🌿 Tenho interesse no produto *${product.name}* (${fmt(product.price)}) que vi no site. Pode me dar mais informações?`
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:border-primary/25 transition-all duration-300 group flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <ImageWithFallback
          src={product.image || FALLBACK_PRODUCT_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <span
            className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: "#b8935a", ...BODY }}
          >
            ★ Destaque
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span
          className="inline-block text-xs px-2.5 py-1 rounded-full mb-3 w-fit"
          style={{ color: "#b8935a", backgroundColor: "#fdf0e4", ...BODY }}
        >
          {product.category}
        </span>
        <h3 className="font-semibold text-foreground mb-2 text-sm leading-snug" style={DISPLAY}>{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed flex-1" style={BODY}>{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <span className="text-lg font-bold text-foreground" style={DISPLAY}>{fmt(product.price)}</span>
          <a
            href={wa(msg, content.whatsappNumber)} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-full text-white hover:opacity-90 transition-all shadow-sm"
            style={{ backgroundColor: "#b8935a", ...BODY }}
          >
            <MessageCircle size={12} /> Pedir
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Products Section ─────────────────────────────────────────────────────────
function ProductsSection({ products, content }: { products: Product[]; content: SiteContent }) {
  const [cat, setCat] = useState("Todos")
  const [priceIdx, setPriceIdx] = useState(0)

  const filtered = products.filter(p => {
    const catOk = cat === "Todos" || p.category === cat
    const r = PRICE_RANGES[priceIdx]
    return catOk && p.price >= r.min && p.price <= r.max
  })

  return (
    <section className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-4xl text-primary mb-2" style={SCRIPT}>{content.productsEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1" style={DISPLAY}>{content.productsTitle}</h2>
          <SectionDivider />
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                  cat === c
                    ? "bg-primary text-white border-primary"
                    : "border-border text-foreground/55 hover:border-primary hover:text-primary"
                }`}
                style={BODY}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {PRICE_RANGES.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setPriceIdx(i)}
                className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                  priceIdx === i
                    ? "text-white border-transparent"
                    : "border-border text-foreground/55 hover:text-[#6b7c5a] hover:border-[#6b7c5a]"
                }`}
                style={{ ...BODY, ...(priceIdx === i ? { backgroundColor: "#6b7c5a" } : {}) }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} content={content} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground">
            <Gift size={44} className="mx-auto mb-4 opacity-25" />
            <p style={BODY}>Nenhum produto encontrado para esse filtro.</p>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Basket Builder ───────────────────────────────────────────────────────────
interface BasketForm {
  name: string; recipient: string; occasion: string; budget: string
  items: string; colors: string; wantCard: string; wantBalloon: string
  deliveryDate: string; notes: string
}

function BasketBuilderSection({ content }: { content: SiteContent }) {
  const [form, setForm] = useState<BasketForm>({
    name: "", recipient: "", occasion: "", budget: "",
    items: "", colors: "", wantCard: "Sim", wantBalloon: "Não",
    deliveryDate: "", notes: ""
  })
  const [sent, setSent] = useState(false)

  const upd = (k: keyof BasketForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg =
      `🌿 *Pedido de Cesta Personalizada — Herpri*\n\n` +
      `👤 *Nome:* ${form.name}\n` +
      `🎁 *Para quem:* ${form.recipient}\n` +
      `🎉 *Ocasião:* ${form.occasion || "Não informada"}\n` +
      `💰 *Orçamento:* ${form.budget || "A combinar"}\n` +
      `📦 *Itens desejados:* ${form.items || "A combinar"}\n` +
      `🎨 *Cores preferidas:* ${form.colors || "Sem preferência"}\n` +
      `💌 *Cartão personalizado:* ${form.wantCard}\n` +
      `🎈 *Balão personalizado:* ${form.wantBalloon}\n` +
      `📅 *Data de entrega:* ${form.deliveryDate || "A combinar"}\n` +
      `📝 *Observações:* ${form.notes || "Nenhuma"}`
    window.open(wa(msg, content.whatsappNumber), "_blank")
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const input = "w-full border border-border rounded-xl px-4 py-3 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
  const lbl = "block text-xs font-medium uppercase tracking-widest text-foreground/55 mb-2"

  return (
    <section className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-4xl text-primary mb-2" style={SCRIPT}>{content.basketEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1" style={DISPLAY}>{content.basketTitle}</h2>
          <SectionDivider />
          <p className="text-sm text-muted-foreground" style={BODY}>
            {content.basketDescription}
          </p>
        </div>

        <form onSubmit={submit} className="bg-card rounded-3xl border border-border p-8 shadow-sm space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={lbl} style={BODY}>Seu nome *</label>
              <input required value={form.name} onChange={upd("name")} placeholder="Maria Silva" className={input} style={BODY} />
            </div>
            <div>
              <label className={lbl} style={BODY}>Para quem é o presente?</label>
              <input required value={form.recipient} onChange={upd("recipient")} placeholder="Minha mãe" className={input} style={BODY} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={lbl} style={BODY}>Ocasião</label>
              <select value={form.occasion} onChange={upd("occasion")} className={input} style={BODY}>
                <option value="">Selecione...</option>
                {["Aniversário","Dia das Mães","Dia dos Pais","Dia dos Namorados","Natal","Páscoa","Casamento","Formatura","Batizado","Corporativo","Outro"].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl} style={BODY}>Orçamento disponível</label>
              <select value={form.budget} onChange={upd("budget")} className={input} style={BODY}>
                <option value="">Selecione...</option>
                {["Até R$ 30","De R$ 30 a R$ 60","De R$ 60 a R$ 100","Acima de R$ 100","A combinar"].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={lbl} style={BODY}>Itens que gostaria de incluir</label>
            <textarea value={form.items} onChange={upd("items")} rows={3}
              placeholder="Chocolates, vinho, flores, perfume..."
              className={`${input} resize-none`} style={BODY} />
          </div>

          <div>
            <label className={lbl} style={BODY}>Cores preferidas</label>
            <input value={form.colors} onChange={upd("colors")} placeholder="Rosa, branco, dourado..." className={input} style={BODY} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={lbl} style={BODY}>Cartão personalizado?</label>
              <select value={form.wantCard} onChange={upd("wantCard")} className={input} style={BODY}>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </div>
            <div>
              <label className={lbl} style={BODY}>Balão personalizado?</label>
              <select value={form.wantBalloon} onChange={upd("wantBalloon")} className={input} style={BODY}>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </div>
          </div>

          <div>
            <label className={lbl} style={BODY}>Data desejada para entrega</label>
            <input type="date" value={form.deliveryDate} onChange={upd("deliveryDate")} className={input} style={BODY} />
          </div>

          <div>
            <label className={lbl} style={BODY}>Observações adicionais</label>
            <textarea value={form.notes} onChange={upd("notes")} rows={3}
              placeholder="Algo especial que queira compartilhar..."
              className={`${input} resize-none`} style={BODY} />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#b8935a", ...BODY }}
          >
            {sent ? <><Check size={16} />Enviado! Abrindo WhatsApp…</> : <><MessageCircle size={16} />Enviar pedido pelo WhatsApp</>}
          </button>
        </form>
      </div>
    </section>
  )
}

// ─── Seasonal Dates ───────────────────────────────────────────────────────────
const DATES: DateItem[] = [
  { title: "Dia das Mães", emoji: "🌸", desc: "Surpreenda a mamãe com uma cesta repleta de amor e delicadeza." },
  { title: "Dia dos Namorados", emoji: "❤️", desc: "Declare seu amor com um presente inesquecível, feito para dois." },
  { title: "Dia dos Pais", emoji: "🤍", desc: "Honre essa figura especial com uma cesta exclusiva e cheia de carinho." },
  { title: "Natal", emoji: "🎄", desc: "Espalhe alegria nessa data tão especial com presentes cheios de afeto." },
  { title: "Páscoa", emoji: "🐣", desc: "Chocolates artesanais e cestas temáticas para adoçar a celebração." },
  { title: "Aniversários", emoji: "🎂", desc: "Faça o aniversariante se sentir único com uma cesta totalmente personalizada." },
  { title: "Casamentos", emoji: "💍", desc: "Lembrancinhas e presentes para tornar esse dia ainda mais inesquecível." },
  { title: "Formaturas", emoji: "🎓", desc: "Celebre a conquista com um presente à altura dessa grande ocasião." },
  { title: "Empresas", emoji: "🤝", desc: "Kits corporativos elegantes para presentear clientes e equipes com classe." },
]

function SeasonalDatesSection({ content }: { content: SiteContent }) {
  return (
    <section className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-4xl text-primary mb-2" style={SCRIPT}>{content.datesEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1" style={DISPLAY}>{content.datesTitle}</h2>
          <SectionDivider />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.dates.map(d => (
            <div
              key={d.title}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-md hover:border-primary/25 transition-all group"
            >
              <div className="text-4xl mb-4">{d.emoji}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2" style={DISPLAY}>{d.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed" style={BODY}>{d.desc}</p>
              <a
                href={wa(`Olá, Herpri! 🌿 Gostaria de um orçamento para *${d.title}*. Podem me ajudar?`, content.whatsappNumber)}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
                style={BODY}
              >
                Pedir orçamento <ArrowRight size={11} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
const GALLERY: GalleryItem[] = [
  { src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=500&fit=crop&auto=format", cat: "Românticas", alt: "Cesta romântica com rosas" },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=500&fit=crop&auto=format", cat: "Românticas", alt: "Buquê de rosas para presente especial" },
  { src: "https://images.unsplash.com/photo-1583396321770-4e91d6ff9264?w=500&h=500&fit=crop&auto=format", cat: "Românticas", alt: "Presente romântico embrulhado" },
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&auto=format", cat: "Café da Manhã", alt: "Cesta de café da manhã especial" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop&auto=format", cat: "Café da Manhã", alt: "Mesa de café da manhã delicioso" },
  { src: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&h=500&fit=crop&auto=format", cat: "Café da Manhã", alt: "Pães e frutas para o café" },
  { src: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=500&h=500&fit=crop&auto=format", cat: "Chocolates", alt: "Cesta de chocolates especiais" },
  { src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop&auto=format", cat: "Chocolates", alt: "Chocolates finos embrulhados com cuidado" },
  { src: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=500&fit=crop&auto=format", cat: "Chocolates", alt: "Bombons artesanais delicados" },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=500&fit=crop&auto=format", cat: "Corporativas", alt: "Kit corporativo elegante" },
  { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=500&fit=crop&auto=format", cat: "Corporativas", alt: "Presente corporativo profissional" },
  { src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop&auto=format", cat: "Lembrancinhas", alt: "Lembrancinha delicada personalizada" },
  { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=500&fit=crop&auto=format", cat: "Lembrancinhas", alt: "Lembrancinha de aniversário" },
  { src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&h=500&fit=crop&auto=format", cat: "Personalizados", alt: "Cesta personalizada especial" },
  { src: "https://images.unsplash.com/photo-1490750967868-88df5691cc53?w=500&h=500&fit=crop&auto=format", cat: "Personalizados", alt: "Presente personalizado com flores" },
  { src: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&h=500&fit=crop&auto=format", cat: "Personalizados", alt: "Cesta de presentes variados" },
]
const GCATS = ["Todas", "Românticas", "Café da Manhã", "Chocolates", "Corporativas", "Lembrancinhas", "Personalizados"]

function GallerySection({ content }: { content: SiteContent }) {
  const [cat, setCat] = useState("Todas")
  const cats = ["Todas", ...Array.from(new Set(content.gallery.map(g => g.cat)))]
  const filtered = cat === "Todas" ? content.gallery : content.gallery.filter(g => g.cat === cat)

  return (
    <section className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-4xl text-primary mb-2" style={SCRIPT}>{content.galleryEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1" style={DISPLAY}>{content.galleryTitle}</h2>
          <SectionDivider />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                cat === c ? "bg-primary text-white border-primary" : "border-border text-foreground/55 hover:border-primary hover:text-primary"
              }`}
              style={BODY}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-muted group cursor-pointer border border-border">
              <ImageWithFallback
                src={img.src} alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS: Testimonial[] = [
  { name: "Ana Carolina", stars: 5, occasion: "Dia das Mães", text: "Tudo ficou perfeito, muito delicado e feito com tanto carinho. A cesta superou todas as minhas expectativas!" },
  { name: "Juliana Ferreira", stars: 5, occasion: "Aniversário", text: "A cesta ficou lindíssima! As flores, os chocolates… tudo combinando. Minha mãe ficou emocionada com tanta delicadeza." },
  { name: "Roberto Santos", stars: 5, occasion: "Dia dos Pais", text: "Atendimento maravilhoso, super humanizado. A Pri é incrível e entregou tudo com muito cuidado e amor." },
  { name: "Fernanda Lima", stars: 5, occasion: "Corporativo", text: "Encomendei kits corporativos e todos os meus clientes amaram! Qualidade impecável e embalagem linda." },
  { name: "Mariana Costa", stars: 5, occasion: "Casamento", text: "Presente de casamento feito com tanto amor. Todos os convidados quiseram saber onde comprei as lembrancinhas." },
  { name: "Patricia Alves", stars: 5, occasion: "Dia dos Namorados", text: "A Herpri transformou meu sentimento em um presente que emocionou muito. Recomendo de olhos fechados!" },
]

const DEFAULT_SITE_CONTENT: SiteContent = {
  brandName: "Herpri",
  tagline: "Cestas e Presentes Personalizados",
  whatsappNumber: WA,
  whatsappDisplay: "(11) 97189-5534",
  instagramUser: IG,
  logoImage: logoImg,
  heroSloganLine1: "Do meu coração",
  heroSloganLine2: "para o seu coração.",
  heroDescription: "Transformamos sentimentos em presentes personalizados, feitos com carinho para tornar cada momento ainda mais especial.",
  heroPrimaryButton: "Ver Produtos",
  heroSecondaryButton: "Fazer Pedido",
  heroBadges: [
    { label: "Personalizado", sub: "100%" },
    { label: "Atendimento", sub: "Humanizado" },
    { label: "Entrega", sub: "Com Carinho" },
  ],
  aboutEyebrow: "Nossa história",
  aboutTitle: "Sobre a Herpri",
  aboutImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop&auto=format",
  aboutParagraph1: "A Herpri nasceu do desejo de transformar momentos em lembranças inesquecíveis. O nome carrega uma homenagem muito especial: ele une um pedacinho do nome do pai da empreendedora com o dela, Pri.",
  aboutParagraph2: "Depois da partida dele, ela encontrou na criação de presentes personalizados uma forma de espalhar amor, carinho e eternizar histórias. Cada cesta é muito mais que um produto: é um sentimento embrulhado com delicadeza.",
  aboutParagraph3: "A marca acredita que um presente vai muito além de um objeto. Ele transmite sentimentos, aproxima pessoas e torna cada ocasião ainda mais especial.",
  aboutQuote: "Transformamos sentimentos em presentes que emocionam.",
  aboutPillars: [
    { title: "Feito com Amor", desc: "Cada detalhe é pensado com carinho, do laço ao cartão personalizado." },
    { title: "Natural e Delicado", desc: "Estética natural com elementos que transmitem aconchego e romantismo." },
    { title: "100% Personalizado", desc: "Criado conforme o seu gosto, orçamento e ocasião especial." },
    { title: "Entrega Cuidadosa", desc: "Seu presente chega com o mesmo cuidado com que foi preparado." },
  ],
  productsEyebrow: "Com carinho para você",
  productsTitle: "Nossos Produtos",
  basketEyebrow: "Vamos criar juntos",
  basketTitle: "Monte sua Cesta",
  basketDescription: "Preencha o formulário e enviaremos uma proposta personalizada pelo WhatsApp.",
  datesEyebrow: "Para cada momento",
  datesTitle: "Datas Comemorativas",
  dates: DATES,
  galleryEyebrow: "Inspirações",
  galleryTitle: "Galeria",
  gallery: GALLERY,
  testimonialsEyebrow: "O que nossos clientes dizem",
  testimonialsTitle: "Depoimentos",
  testimonials: TESTIMONIALS,
  contactEyebrow: "Vamos conversar",
  contactTitle: "Contato",
  contactDescription: "Será um prazer transformar seu sentimento em um presente especial.",
  contactImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=500&fit=crop&auto=format",
  contactHoursTitle: "Horário de Atendimento",
  contactWeekHours: "Segunda a sexta: 9h às 18h",
  contactSaturdayHours: "Sábado: 9h às 14h",
  contactHoursNote: "Atendemos todas as mensagens com carinho e atenção.",
  contactDeliveryLabel: "Entregamos em",
  contactDeliveryArea: "São Paulo e região",
  contactDeliveryNote: "Com muito carinho",
  footerSlogan: "Do meu coração para o seu coração.",
  footerCopyright: "© 2025 Herpri - Cestas e Presentes Personalizados. Feito com amor para você.",
}

const mergeSiteContent = (stored?: Partial<SiteContent>): SiteContent => ({
  ...DEFAULT_SITE_CONTENT,
  ...stored,
  heroBadges: stored?.heroBadges?.length ? stored.heroBadges : DEFAULT_SITE_CONTENT.heroBadges,
  aboutPillars: stored?.aboutPillars?.length ? stored.aboutPillars : DEFAULT_SITE_CONTENT.aboutPillars,
  dates: stored?.dates?.length ? stored.dates : DEFAULT_SITE_CONTENT.dates,
  gallery: stored?.gallery?.length ? stored.gallery : DEFAULT_SITE_CONTENT.gallery,
  testimonials: stored?.testimonials?.length ? stored.testimonials : DEFAULT_SITE_CONTENT.testimonials,
})

const loadSiteContent = () => {
  try {
    const stored = localStorage.getItem(SITE_CONTENT_KEY)
    return stored ? mergeSiteContent(JSON.parse(stored)) : DEFAULT_SITE_CONTENT
  } catch {
    return DEFAULT_SITE_CONTENT
  }
}

function TestimonialsSection({ content }: { content: SiteContent }) {
  return (
    <section className="min-h-screen pt-24 pb-20 px-4" style={{ backgroundColor: "#fdf0e4" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-4xl text-primary mb-2" style={SCRIPT}>{content.testimonialsEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1" style={DISPLAY}>{content.testimonialsTitle}</h2>
          <SectionDivider />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={13} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground/75 mb-5 leading-relaxed italic" style={BODY}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-primary flex-shrink-0"
                  style={{ backgroundColor: "#fdf0e4", ...DISPLAY }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground" style={BODY}>{t.name}</p>
                  <p className="text-xs text-muted-foreground" style={BODY}>{t.occasion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactSection({ content }: { content: SiteContent }) {
  return (
    <section className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-4xl text-primary mb-2" style={SCRIPT}>{content.contactEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1" style={DISPLAY}>{content.contactTitle}</h2>
          <SectionDivider />
          <p className="text-base text-muted-foreground" style={BODY}>
            {content.contactDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <a
              href={wa("Olá, Herpri! 🌿 Gostaria de fazer um pedido. Podem me ajudar?", content.whatsappNumber)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(37,211,102,0.1)" }}>
                <MessageCircle size={22} style={{ color: "#25d366" }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5" style={BODY}>WhatsApp</p>
                <p className="font-semibold text-foreground" style={BODY}>{content.whatsappDisplay}</p>
                <p className="text-xs text-muted-foreground" style={BODY}>Chamar agora</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            <a
              href={instagramUrl(content.instagramUser)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #f7e8f6, #fde6f0)" }}>
                <Camera size={22} style={{ color: "#c13584" }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5" style={BODY}>Instagram</p>
                <p className="font-semibold text-foreground" style={BODY}>{instagramHandle(content.instagramUser)}</p>
                <p className="text-xs text-muted-foreground" style={BODY}>Seguir no Instagram</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            <div className="rounded-2xl p-6 border" style={{ backgroundColor: "#fdf0e4", borderColor: "rgba(184,147,90,0.25)" }}>
              <h4 className="font-semibold text-foreground mb-2 text-sm" style={DISPLAY}>{content.contactHoursTitle}</h4>
              <p className="text-sm text-foreground/70" style={BODY}>{content.contactWeekHours}</p>
              <p className="text-sm text-foreground/70" style={BODY}>{content.contactSaturdayHours}</p>
              <p className="text-xs text-muted-foreground mt-3" style={BODY}>
                {content.contactHoursNote}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-border">
              <ImageWithFallback
                src={content.contactImage}
                alt={content.contactTitle}
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 bg-card rounded-2xl border border-border p-4 shadow-lg">
              <p className="text-xs text-muted-foreground mb-1" style={BODY}>{content.contactDeliveryLabel}</p>
              <p className="text-sm font-semibold text-foreground" style={BODY}>{content.contactDeliveryArea}</p>
              <p className="text-xs text-primary mt-1" style={BODY}>{content.contactDeliveryNote}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-14">
          <a
            href={wa("Olá, Herpri! 🌿 Quero solicitar um orçamento.", content.whatsappNumber)}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-4 text-white rounded-full font-medium shadow-md hover:opacity-90 transition-all"
            style={{ backgroundColor: "#b8935a", ...BODY }}
          >
            <MessageCircle size={17} /> Fazer Orçamento
          </a>
          <a
            href={instagramUrl(content.instagramUser)}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground rounded-full font-medium hover:border-primary hover:text-primary transition-all"
            style={BODY}
          >
            <Camera size={17} /> Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({
  products,
  onSave,
  siteContent,
  onSiteContentSave,
}: {
  products: Product[]
  onSave: (p: Product[]) => void
  siteContent: SiteContent
  onSiteContentSave: (content: SiteContent) => void
}) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [pw, setPw] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Product>>({})
  const [imageError, setImageError] = useState("")
  const [isReadingImage, setIsReadingImage] = useState(false)
  const [contentForm, setContentForm] = useState<SiteContent>(siteContent)
  const [siteImageError, setSiteImageError] = useState("")
  const [isReadingSiteImage, setIsReadingSiteImage] = useState(false)
  const [contentSaved, setContentSaved] = useState(false)

  useEffect(() => {
    setContentForm(siteContent)
  }, [siteContent])

  const login = () => {
    if (pw === ADMIN_PASS) { setLoggedIn(true); setErr("") }
    else setErr("Senha incorreta. Tente novamente.")
  }

  const startAdd = () => {
    setEditId(null)
    setForm({ name: "", category: CATEGORIES[1], price: 0, description: "", image: "", featured: false })
    setImageError("")
    setIsReadingImage(false)
    setIsAdding(true)
  }

  const startEdit = (p: Product) => {
    setEditId(p.id)
    setForm({ ...p })
    setImageError("")
    setIsReadingImage(false)
    setIsAdding(true)
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const file = input.files?.[0]
    setImageError("")

    if (!file) return

    setIsReadingImage(true)
    try {
      const image = await resizeImageForStorage(file)
      setForm(f => ({ ...f, image }))
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Nao foi possivel carregar a imagem.")
    } finally {
      setIsReadingImage(false)
      input.value = ""
    }
  }

  const saveProduct = () => {
    if (!form.name || !form.price) return
    const p: Product = {
      id: editId || `a${Date.now()}`,
      name: form.name || "",
      category: form.category || CATEGORIES[1],
      price: Number(form.price) || 0,
      description: form.description || "",
      image: form.image || FALLBACK_PRODUCT_IMAGE,
      featured: form.featured || false,
    }
    const updated = editId ? products.map(x => x.id === editId ? p : x) : [...products, p]
    onSave(updated)
    setIsAdding(false)
    setEditId(null)
    setImageError("")
    setForm({})
  }

  const del = (id: string) => onSave(products.filter(p => p.id !== id))

  const inp = "w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
  const lbl = "block text-xs font-medium uppercase tracking-widest text-foreground/55 mb-1.5"
  const editorGroup = "rounded-2xl border border-border p-5 bg-background/60"

  const updateContent = <K extends keyof SiteContent,>(key: K, value: SiteContent[K]) => {
    setContentForm(f => ({ ...f, [key]: value }))
  }

  const updateHeroBadge = (index: number, field: keyof HeroBadge, value: string) => {
    setContentForm(f => ({
      ...f,
      heroBadges: f.heroBadges.map((badge, i) => i === index ? { ...badge, [field]: value } : badge),
    }))
  }

  const updatePillar = (index: number, field: keyof AboutPillar, value: string) => {
    setContentForm(f => ({
      ...f,
      aboutPillars: f.aboutPillars.map((pillar, i) => i === index ? { ...pillar, [field]: value } : pillar),
    }))
  }

  const updateDateItem = (index: number, field: keyof DateItem, value: string) => {
    setContentForm(f => ({
      ...f,
      dates: f.dates.map((date, i) => i === index ? { ...date, [field]: value } : date),
    }))
  }

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: string) => {
    setContentForm(f => ({
      ...f,
      gallery: f.gallery.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }))
  }

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
    setContentForm(f => ({
      ...f,
      testimonials: f.testimonials.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }))
  }

  const handleSiteImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    onImage: (image: string) => void,
  ) => {
    const input = e.currentTarget
    const file = input.files?.[0]
    setSiteImageError("")

    if (!file) return

    setIsReadingSiteImage(true)
    try {
      const image = await resizeImageForStorage(file)
      onImage(image)
    } catch (error) {
      setSiteImageError(error instanceof Error ? error.message : "Nao foi possivel carregar a imagem.")
    } finally {
      setIsReadingSiteImage(false)
      input.value = ""
    }
  }

  const saveSiteContent = () => {
    const updated = mergeSiteContent(contentForm)
    onSiteContentSave(updated)
    setContentSaved(true)
    setTimeout(() => setContentSaved(false), 2500)
  }

  const resetSiteDraft = () => {
    setContentForm(siteContent)
    setSiteImageError("")
    setContentSaved(false)
  }

  const imagePicker = (
    label: string,
    image: string,
    onImage: (image: string) => void,
    previewClass = "w-20 h-20",
  ) => (
    <div>
      <label className={lbl} style={BODY}>{label}</label>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
        <div className={`${previewClass} rounded-xl overflow-hidden bg-muted flex-shrink-0`}>
          <ImageWithFallback src={image || FALLBACK_PRODUCT_IMAGE} alt={label} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept="image/*"
            disabled={isReadingSiteImage}
            onChange={e => handleSiteImageChange(e, onImage)}
            className="w-full text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-[#fdf0e4] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#b8935a] hover:file:bg-[#f9e6d0]"
            style={BODY}
          />
          <p className="text-xs text-muted-foreground mt-2" style={BODY}>
            {isReadingSiteImage ? "Carregando imagem..." : "Escolha uma imagem da galeria."}
          </p>
        </div>
      </div>
    </div>
  )

  if (!loggedIn) {
    return (
      <section className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center" style={{ backgroundColor: "#fdf0e4" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-md border-2"
              style={{ backgroundColor: "#ffffff", borderColor: "rgba(184,147,90,0.35)" }}
            >
              <ImageWithFallback src={siteContent.logoImage || logoImg} alt={siteContent.brandName} className="w-14 h-14 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-foreground" style={DISPLAY}>Painel {siteContent.brandName}</h2>
            <p className="text-sm text-muted-foreground mt-1" style={BODY}>Área administrativa</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-7 shadow-sm">
            <div className="mb-5">
              <label className={lbl} style={BODY}>Senha de acesso</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && login()}
                  placeholder="Digite a senha..."
                  className={inp}
                  style={BODY}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {err && <p className="text-xs text-red-500 mt-1.5" style={BODY}>{err}</p>}
            </div>
            <button
              onClick={login}
              className="w-full py-3 text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all"
              style={{ backgroundColor: "#b8935a", ...BODY }}
            >
              Entrar
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0"
              style={{ backgroundColor: "#fdf0e4", borderColor: "rgba(184,147,90,0.3)" }}>
              <ImageWithFallback src={siteContent.logoImage || logoImg} alt={siteContent.brandName} className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground" style={DISPLAY}>Painel {siteContent.brandName}</h2>
              <p className="text-xs text-muted-foreground" style={BODY}>{products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={startAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-sm hover:opacity-90 transition-all"
              style={{ backgroundColor: "#b8935a", ...BODY }}
            >
              <Plus size={14} /> Novo Produto
            </button>
            <button
              onClick={() => { setLoggedIn(false); setPw("") }}
              className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all"
              style={BODY}
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground" style={DISPLAY}>Conteúdo do site</h3>
              <p className="text-xs text-muted-foreground" style={BODY}>Edite textos e imagens gerais exibidos nas páginas.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveSiteContent}
                disabled={isReadingSiteImage}
                className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-sm hover:opacity-90 transition-all ${isReadingSiteImage ? "opacity-60 cursor-not-allowed" : ""}`}
                style={{ backgroundColor: "#6b7c5a", ...BODY }}
              >
                <Save size={14} /> {contentSaved ? "Salvo" : "Salvar site"}
              </button>
              <button
                type="button"
                onClick={resetSiteDraft}
                className="px-4 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-muted transition-all"
                style={BODY}
              >
                Desfazer
              </button>
            </div>
          </div>

          {siteImageError && <p className="text-xs text-red-500 mb-3" style={BODY}>{siteImageError}</p>}

          <div className="space-y-4">
            <details open className={editorGroup}>
              <summary className="cursor-pointer font-semibold text-foreground text-sm" style={DISPLAY}>Identidade e início</summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className={lbl} style={BODY}>Nome da marca</label>
                  <input value={contentForm.brandName} onChange={e => updateContent("brandName", e.target.value)} className={inp} style={BODY} />
                </div>
                <div>
                  <label className={lbl} style={BODY}>Subtítulo da marca</label>
                  <input value={contentForm.tagline} onChange={e => updateContent("tagline", e.target.value)} className={inp} style={BODY} />
                </div>
                <div>
                  <label className={lbl} style={BODY}>WhatsApp do link</label>
                  <input value={contentForm.whatsappNumber} onChange={e => updateContent("whatsappNumber", e.target.value.replace(/\D/g, ""))} className={inp} style={BODY} />
                </div>
                <div>
                  <label className={lbl} style={BODY}>WhatsApp exibido</label>
                  <input value={contentForm.whatsappDisplay} onChange={e => updateContent("whatsappDisplay", e.target.value)} className={inp} style={BODY} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl} style={BODY}>Instagram</label>
                  <input value={contentForm.instagramUser} onChange={e => updateContent("instagramUser", e.target.value)} className={inp} style={BODY} />
                </div>
                <div className="sm:col-span-2">
                  {imagePicker("Logo do site", contentForm.logoImage, image => updateContent("logoImage", image), "w-20 h-20")}
                </div>
                <div>
                  <label className={lbl} style={BODY}>Frase inicial - linha 1</label>
                  <input value={contentForm.heroSloganLine1} onChange={e => updateContent("heroSloganLine1", e.target.value)} className={inp} style={BODY} />
                </div>
                <div>
                  <label className={lbl} style={BODY}>Frase inicial - linha 2</label>
                  <input value={contentForm.heroSloganLine2} onChange={e => updateContent("heroSloganLine2", e.target.value)} className={inp} style={BODY} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl} style={BODY}>Descrição inicial</label>
                  <textarea rows={3} value={contentForm.heroDescription} onChange={e => updateContent("heroDescription", e.target.value)} className={`${inp} resize-none`} style={BODY} />
                </div>
                <div>
                  <label className={lbl} style={BODY}>Botão principal</label>
                  <input value={contentForm.heroPrimaryButton} onChange={e => updateContent("heroPrimaryButton", e.target.value)} className={inp} style={BODY} />
                </div>
                <div>
                  <label className={lbl} style={BODY}>Botão WhatsApp</label>
                  <input value={contentForm.heroSecondaryButton} onChange={e => updateContent("heroSecondaryButton", e.target.value)} className={inp} style={BODY} />
                </div>
                {contentForm.heroBadges.map((badge, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3 sm:col-span-2">
                    <div>
                      <label className={lbl} style={BODY}>Destaque {i + 1}</label>
                      <input value={badge.sub} onChange={e => updateHeroBadge(i, "sub", e.target.value)} className={inp} style={BODY} />
                    </div>
                    <div>
                      <label className={lbl} style={BODY}>Legenda {i + 1}</label>
                      <input value={badge.label} onChange={e => updateHeroBadge(i, "label", e.target.value)} className={inp} style={BODY} />
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className={editorGroup}>
              <summary className="cursor-pointer font-semibold text-foreground text-sm" style={DISPLAY}>Sobre</summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div className="sm:col-span-2">
                  {imagePicker("Imagem da seção Sobre", contentForm.aboutImage, image => updateContent("aboutImage", image), "w-24 h-24")}
                </div>
                <div>
                  <label className={lbl} style={BODY}>Chamada</label>
                  <input value={contentForm.aboutEyebrow} onChange={e => updateContent("aboutEyebrow", e.target.value)} className={inp} style={BODY} />
                </div>
                <div>
                  <label className={lbl} style={BODY}>Título</label>
                  <input value={contentForm.aboutTitle} onChange={e => updateContent("aboutTitle", e.target.value)} className={inp} style={BODY} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl} style={BODY}>Texto 1</label>
                  <textarea rows={3} value={contentForm.aboutParagraph1} onChange={e => updateContent("aboutParagraph1", e.target.value)} className={`${inp} resize-none`} style={BODY} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl} style={BODY}>Texto 2</label>
                  <textarea rows={3} value={contentForm.aboutParagraph2} onChange={e => updateContent("aboutParagraph2", e.target.value)} className={`${inp} resize-none`} style={BODY} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl} style={BODY}>Texto 3</label>
                  <textarea rows={3} value={contentForm.aboutParagraph3} onChange={e => updateContent("aboutParagraph3", e.target.value)} className={`${inp} resize-none`} style={BODY} />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl} style={BODY}>Frase de destaque</label>
                  <input value={contentForm.aboutQuote} onChange={e => updateContent("aboutQuote", e.target.value)} className={inp} style={BODY} />
                </div>
                {contentForm.aboutPillars.map((pillar, i) => (
                  <div key={i} className="sm:col-span-2 grid sm:grid-cols-2 gap-3 border-t border-border pt-4">
                    <div>
                      <label className={lbl} style={BODY}>Pilar {i + 1}</label>
                      <input value={pillar.title} onChange={e => updatePillar(i, "title", e.target.value)} className={inp} style={BODY} />
                    </div>
                    <div>
                      <label className={lbl} style={BODY}>Descrição do pilar</label>
                      <input value={pillar.desc} onChange={e => updatePillar(i, "desc", e.target.value)} className={inp} style={BODY} />
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className={editorGroup}>
              <summary className="cursor-pointer font-semibold text-foreground text-sm" style={DISPLAY}>Títulos das páginas</summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div><label className={lbl} style={BODY}>Produtos - chamada</label><input value={contentForm.productsEyebrow} onChange={e => updateContent("productsEyebrow", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Produtos - título</label><input value={contentForm.productsTitle} onChange={e => updateContent("productsTitle", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Monte - chamada</label><input value={contentForm.basketEyebrow} onChange={e => updateContent("basketEyebrow", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Monte - título</label><input value={contentForm.basketTitle} onChange={e => updateContent("basketTitle", e.target.value)} className={inp} style={BODY} /></div>
                <div className="sm:col-span-2"><label className={lbl} style={BODY}>Monte - descrição</label><input value={contentForm.basketDescription} onChange={e => updateContent("basketDescription", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Datas - chamada</label><input value={contentForm.datesEyebrow} onChange={e => updateContent("datesEyebrow", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Datas - título</label><input value={contentForm.datesTitle} onChange={e => updateContent("datesTitle", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Galeria - chamada</label><input value={contentForm.galleryEyebrow} onChange={e => updateContent("galleryEyebrow", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Galeria - título</label><input value={contentForm.galleryTitle} onChange={e => updateContent("galleryTitle", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Depoimentos - chamada</label><input value={contentForm.testimonialsEyebrow} onChange={e => updateContent("testimonialsEyebrow", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Depoimentos - título</label><input value={contentForm.testimonialsTitle} onChange={e => updateContent("testimonialsTitle", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Contato - chamada</label><input value={contentForm.contactEyebrow} onChange={e => updateContent("contactEyebrow", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Contato - título</label><input value={contentForm.contactTitle} onChange={e => updateContent("contactTitle", e.target.value)} className={inp} style={BODY} /></div>
              </div>
            </details>

            <details className={editorGroup}>
              <summary className="cursor-pointer font-semibold text-foreground text-sm" style={DISPLAY}>Contato e rodapé</summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div className="sm:col-span-2">
                  {imagePicker("Imagem da seção Contato", contentForm.contactImage, image => updateContent("contactImage", image), "w-24 h-24")}
                </div>
                <div className="sm:col-span-2"><label className={lbl} style={BODY}>Descrição do contato</label><input value={contentForm.contactDescription} onChange={e => updateContent("contactDescription", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Título do horário</label><input value={contentForm.contactHoursTitle} onChange={e => updateContent("contactHoursTitle", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Segunda a sexta</label><input value={contentForm.contactWeekHours} onChange={e => updateContent("contactWeekHours", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Sábado</label><input value={contentForm.contactSaturdayHours} onChange={e => updateContent("contactSaturdayHours", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Observação do horário</label><input value={contentForm.contactHoursNote} onChange={e => updateContent("contactHoursNote", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Etiqueta da entrega</label><input value={contentForm.contactDeliveryLabel} onChange={e => updateContent("contactDeliveryLabel", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Região de entrega</label><input value={contentForm.contactDeliveryArea} onChange={e => updateContent("contactDeliveryArea", e.target.value)} className={inp} style={BODY} /></div>
                <div className="sm:col-span-2"><label className={lbl} style={BODY}>Mensagem da entrega</label><input value={contentForm.contactDeliveryNote} onChange={e => updateContent("contactDeliveryNote", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Frase do rodapé</label><input value={contentForm.footerSlogan} onChange={e => updateContent("footerSlogan", e.target.value)} className={inp} style={BODY} /></div>
                <div><label className={lbl} style={BODY}>Copyright</label><input value={contentForm.footerCopyright} onChange={e => updateContent("footerCopyright", e.target.value)} className={inp} style={BODY} /></div>
              </div>
            </details>

            <details className={editorGroup}>
              <summary className="cursor-pointer font-semibold text-foreground text-sm" style={DISPLAY}>Datas comemorativas</summary>
              <div className="space-y-4 mt-5">
                {contentForm.dates.map((date, i) => (
                  <div key={i} className="grid sm:grid-cols-[80px_1fr] gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <label className={lbl} style={BODY}>Ícone</label>
                      <input value={date.emoji} onChange={e => updateDateItem(i, "emoji", e.target.value)} className={inp} style={BODY} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={lbl} style={BODY}>Data</label>
                        <input value={date.title} onChange={e => updateDateItem(i, "title", e.target.value)} className={inp} style={BODY} />
                      </div>
                      <div>
                        <label className={lbl} style={BODY}>Descrição</label>
                        <input value={date.desc} onChange={e => updateDateItem(i, "desc", e.target.value)} className={inp} style={BODY} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className={editorGroup}>
              <summary className="cursor-pointer font-semibold text-foreground text-sm" style={DISPLAY}>Galeria</summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {contentForm.gallery.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border p-4 bg-background">
                    {imagePicker(`Imagem ${i + 1}`, item.src, image => updateGalleryItem(i, "src", image), "w-20 h-20")}
                    <div className="grid gap-3 mt-3">
                      <div>
                        <label className={lbl} style={BODY}>Categoria</label>
                        <input value={item.cat} onChange={e => updateGalleryItem(i, "cat", e.target.value)} className={inp} style={BODY} />
                      </div>
                      <div>
                        <label className={lbl} style={BODY}>Texto alternativo</label>
                        <input value={item.alt} onChange={e => updateGalleryItem(i, "alt", e.target.value)} className={inp} style={BODY} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className={editorGroup}>
              <summary className="cursor-pointer font-semibold text-foreground text-sm" style={DISPLAY}>Depoimentos</summary>
              <div className="space-y-4 mt-5">
                {contentForm.testimonials.map((item, i) => (
                  <div key={i} className="grid sm:grid-cols-2 gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <label className={lbl} style={BODY}>Nome</label>
                      <input value={item.name} onChange={e => updateTestimonial(i, "name", e.target.value)} className={inp} style={BODY} />
                    </div>
                    <div>
                      <label className={lbl} style={BODY}>Ocasião</label>
                      <input value={item.occasion} onChange={e => updateTestimonial(i, "occasion", e.target.value)} className={inp} style={BODY} />
                    </div>
                    <div>
                      <label className={lbl} style={BODY}>Estrelas</label>
                      <input type="number" min="1" max="5" value={item.stars} onChange={e => updateTestimonial(i, "stars", Math.min(5, Math.max(1, Number(e.target.value) || 5)))} className={inp} style={BODY} />
                    </div>
                    <div>
                      <label className={lbl} style={BODY}>Texto</label>
                      <input value={item.text} onChange={e => updateTestimonial(i, "text", e.target.value)} className={inp} style={BODY} />
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground" style={DISPLAY}>Produtos</h3>
            <p className="text-xs text-muted-foreground" style={BODY}>Cadastre, edite e remova produtos do catálogo.</p>
          </div>
        </div>

        {/* Form */}
        {isAdding && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-8 shadow-sm">
            <h3 className="font-semibold text-foreground mb-5 text-sm" style={DISPLAY}>
              {editId ? "Editar Produto" : "Adicionar Novo Produto"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl} style={BODY}>Nome do produto *</label>
                <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do produto" className={inp} style={BODY} />
              </div>
              <div>
                <label className={lbl} style={BODY}>Categoria</label>
                <select value={form.category || ""} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp} style={BODY}>
                  {CATEGORIES.filter(c => c !== "Todos").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl} style={BODY}>Preço (R$) *</label>
                <input type="number" step="0.01" min="0" value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} placeholder="0,00" className={inp} style={BODY} />
              </div>
              <div>
                <label className={lbl} style={BODY}>Foto do produto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isReadingImage}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-[#fdf0e4] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#b8935a] hover:file:bg-[#f9e6d0]"
                  style={BODY}
                />
                <p className="text-xs text-muted-foreground mt-2" style={BODY}>
                  {isReadingImage ? "Carregando foto..." : "Selecione uma imagem da galeria do dispositivo."}
                </p>
                {imageError && (
                  <p className="text-xs text-red-500 mt-1.5" style={BODY}>{imageError}</p>
                )}
                {form.image && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback src={form.image || FALLBACK_PRODUCT_IMAGE} alt="Previa da foto do produto" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground" style={BODY}>Foto selecionada</p>
                      <button
                        type="button"
                        onClick={() => { setForm(f => ({ ...f, image: "" })); setImageError("") }}
                        className="text-xs text-primary hover:underline"
                        style={BODY}
                      >
                        Remover foto
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className={lbl} style={BODY}>Descrição</label>
                <textarea rows={3} value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descrição do produto..." className={`${inp} resize-none`} style={BODY} />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox" id="feat"
                  checked={form.featured || false}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="feat" className="text-sm text-foreground/70" style={BODY}>Marcar como produto em destaque</label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={saveProduct}
                disabled={isReadingImage}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-white rounded-xl text-sm hover:opacity-90 transition-all ${isReadingImage ? "opacity-60 cursor-not-allowed" : ""}`}
                style={{ backgroundColor: "#b8935a", ...BODY }}
              >
                <Save size={14} /> {isReadingImage ? "Carregando foto..." : editId ? "Salvar alterações" : "Adicionar produto"}
              </button>
              <button onClick={() => { setIsAdding(false); setEditId(null); setImageError("") }} className="px-5 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:bg-muted transition-all" style={BODY}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-border">
            <Package size={40} className="mx-auto mb-3 opacity-20 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4" style={BODY}>Nenhum produto cadastrado ainda.</p>
            <button onClick={startAdd} className="text-sm text-primary hover:underline" style={BODY}>Adicionar primeiro produto</button>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:border-primary/25 transition-all">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate" style={BODY}>{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground" style={BODY}>{p.category}</span>
                    {p.featured && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ color: "#b8935a", backgroundColor: "#fdf0e4", ...BODY }}>
                        ★ Destaque
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-bold text-foreground text-sm flex-shrink-0" style={DISPLAY}>{fmt(p.price)}</p>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(p)} className="p-2 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => del(p.id)} className="p-2 rounded-xl border border-border text-muted-foreground hover:text-red-500 hover:border-red-300 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage, content }: { setPage: (p: Page) => void; content: SiteContent }) {
  return (
    <footer className="border-t px-4 py-14" style={{ backgroundColor: "#fdf0e4", borderColor: "rgba(184,147,90,0.2)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <ImageWithFallback src={content.logoImage || logoImg} alt={content.brandName} className="w-14 h-14 object-contain" />
              <div>
                <h3 className="font-bold text-foreground text-base" style={DISPLAY}>{content.brandName}</h3>
                <p className="text-xs text-muted-foreground" style={BODY}>{content.tagline}</p>
              </div>
            </div>
            <p className="text-2xl text-primary leading-tight" style={SCRIPT}>{content.footerSlogan}</p>
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-widest mb-5" style={BODY}>Navegação</h4>
            <div className="grid grid-cols-2 gap-1">
              {NAV.map(item => (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className="text-xs text-foreground/60 hover:text-primary transition-colors py-1.5"
                  style={BODY}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-widest mb-5" style={BODY}>Fale Conosco</h4>
            <div className="space-y-3">
              <a
                href={wa("Olá, Herpri! 🌿 Gostaria de fazer um pedido.", content.whatsappNumber)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-foreground/65 hover:text-primary justify-center md:justify-end transition-colors"
                style={BODY}
              >
                <MessageCircle size={13} /> {content.whatsappDisplay}
              </a>
              <a
                href={instagramUrl(content.instagramUser)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-foreground/65 hover:text-primary justify-center md:justify-end transition-colors"
                style={BODY}
              >
                <Camera size={13} /> {instagramHandle(content.instagramUser)}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 text-center" style={{ borderColor: "rgba(184,147,90,0.2)" }}>
          <p className="text-xs text-muted-foreground" style={BODY}>
            {content.footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Floating WhatsApp ────────────────────────────────────────────────────────
function FloatingWhatsApp({ content }: { content: SiteContent }) {
  return (
    <a
      href={wa("Olá, Herpri! 🌿 Gostaria de fazer um pedido.", content.whatsappNumber)}
      target="_blank" rel="noopener noreferrer"
      title="Chamar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:shadow-2xl transition-all"
      style={{ backgroundColor: "#25d366" }}
    >
      <MessageCircle size={26} className="text-white" />
    </a>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("inicio")
  const [siteContent, setSiteContent] = useState<SiteContent>(loadSiteContent)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : SAMPLE
    } catch {
      return SAMPLE
    }
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  const saveProducts = (updated: Product[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setProducts(updated)
    } catch {
      alert("Nao foi possivel salvar a foto no navegador. Tente escolher uma imagem menor.")
    }
  }

  const saveSiteContent = (updated: SiteContent) => {
    try {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(updated))
      setSiteContent(updated)
    } catch {
      alert("Nao foi possivel salvar as alteracoes do site. Tente usar imagens menores.")
    }
  }

  return (
    <div className="min-h-screen bg-background" style={BODY}>
      <Navbar page={page} setPage={setPage} content={siteContent} />

      <main>
        {page === "inicio" && <HeroSection setPage={setPage} content={siteContent} />}
        {page === "sobre" && <AboutSection content={siteContent} />}
        {page === "produtos" && <ProductsSection products={products} content={siteContent} />}
        {page === "monte" && <BasketBuilderSection content={siteContent} />}
        {page === "datas" && <SeasonalDatesSection content={siteContent} />}
        {page === "galeria" && <GallerySection content={siteContent} />}
        {page === "depoimentos" && <TestimonialsSection content={siteContent} />}
        {page === "contato" && <ContactSection content={siteContent} />}
        {page === "painel" && <AdminPanel products={products} onSave={saveProducts} siteContent={siteContent} onSiteContentSave={saveSiteContent} />}
      </main>

      {page !== "painel" && <Footer setPage={setPage} content={siteContent} />}
      <FloatingWhatsApp content={siteContent} />
    </div>
  )
}
