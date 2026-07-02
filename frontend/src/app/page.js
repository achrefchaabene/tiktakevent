import Link from "next/link";
import { CalendarHeart, Flower2, Gem, Sparkles } from "lucide-react";
import VisitorGallery from "./VisitorGallery";
import { getCategories, getContents } from "@/lib/api";

const services = [
  {
    title: "Decoration mariage",
    text: "Ambiances, arches, tables et details visuels pour valoriser chaque reception.",
    Icon: Sparkles
  },
  {
    title: "Fleurs & centres de table",
    text: "Compositions florales, bouquets et centres de table presentes avec elegance.",
    Icon: Flower2
  },
  {
    title: "Materiel de fete",
    text: "Chaises, supports, accessoires et elements techniques organises par categorie.",
    Icon: Gem
  },
  {
    title: "Organisation complete",
    text: "Une vitrine claire pour suivre les inspirations, les projets et les medias publies.",
    Icon: CalendarHeart
  }
];

export default async function HomePage() {
  let contents = [];
  let categories = [];

  try {
    [contents, categories] = await Promise.all([getContents(), getCategories()]);
  } catch {
    contents = [];
    categories = [];
  }

  return (
    <main className="page">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="brand">Hana Events</Link>
          <nav className="nav">
            <Link href="/">Accueil</Link>
            <a href="#services">Services</a>
            <a href="#galerie">Galerie</a>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero__image" aria-hidden="true" />
        <div className="container hero__content">
          <span className="eyebrow">Mariages, ceremonies & evenements</span>
          <h1>Hana Events</h1>
          <p>
            Une vitrine elegante pour presenter vos mariages, videos courtes,
            decorations florales, tables, arches, chaises et materiel avec une
            experience simple a administrer.
          </p>
          <div className="hero__actions">
            <a className="button" href="#galerie">Voir la galerie</a>
            <Link className="button button--light" href="/admin">Ajouter un projet</Link>
          </div>
          <div className="hero__metrics" aria-label="Apercu Hana Events">
            <span><strong>{contents.length}</strong> medias</span>
            <span><strong>{categories.length}</strong> categories</span>
            <span><strong>15s</strong> videos courtes</span>
          </div>
        </div>
      </section>

      <section className="services-band" id="services">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Services</span>
            <h2>Tout ce qu'il faut pour raconter un evenement avec style.</h2>
          </div>
          <div className="service-grid">
            {services.map(({ title, text, Icon }) => (
              <article className="service-card" key={title}>
                <span className="service-card__icon"><Icon size={22} strokeWidth={1.8} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container gallery-section" id="galerie">
        <div className="toolbar">
          <div>
            <span className="eyebrow">Galerie</span>
            <h2>Derniers evenements et inspirations</h2>
          </div>
          <Link className="button" href="/admin">Ajouter un media</Link>
        </div>

        <VisitorGallery initialContents={contents} categories={categories} />
      </section>
    </main>
  );
}

