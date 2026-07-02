import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function ContentDetailPage({ params }) {
  const { slug } = await params;
  const content = await apiFetch(`/contents/${slug}`);

  return (
    <main className="page">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="brand">Hana Events</Link>
          <nav className="nav">
            <Link href="/">Accueil</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <article className="detail-page">
        <div className="container detail-page__inner">
          <div className="detail-page__copy">
            <span className="eyebrow">{content.category?.name || "Evenement"}</span>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
          </div>

          <div className="detail-media">
            {content.media?.type === "video" ? (
              <video src={content.media.url} controls />
            ) : (
              <img src={content.media?.url} alt={content.title} />
            )}
          </div>

          {content.body ? <p className="detail-body">{content.body}</p> : null}
        </div>
      </article>
    </main>
  );
}

