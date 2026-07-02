"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_SIZE = 12;

export default function VisitorGallery({ initialContents, categories }) {
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const contents = useMemo(() => {
    const search = query.trim().toLowerCase();

    return initialContents.filter((content) => {
      const matchesCategory =
        category === "all" || content.category?._id === category;
      const matchesType = type === "all" || content.media?.type === type;
      const searchableText = [
        content.title,
        content.description,
        content.category?.name
      ].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = !search || searchableText.includes(search);

      return matchesCategory && matchesType && matchesSearch;
    }).sort((a, b) => {
      if (sort === "title") {
        return a.title.localeCompare(b.title);
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [category, initialContents, query, sort, type]);

  const visibleContents = contents.slice(0, visibleCount);
  const imageContents = visibleContents.filter((content) => content.media?.type !== "video");
  const videoContents = visibleContents.filter((content) => content.media?.type === "video");
  const totalImages = contents.filter((content) => content.media?.type !== "video").length;
  const totalVideos = contents.filter((content) => content.media?.type === "video").length;

  function updateCategory(value) {
    setCategory(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateType(value) {
    setType(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateQuery(value) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateSort(value) {
    setSort(value);
    setVisibleCount(PAGE_SIZE);
  }

  function renderCards(items) {
    return items.map((content) => (
      <Link className="card" href={`/contents/${content.slug}`} key={content._id}>
        {content.media?.type === "video" ? (
          <video className="card__media" src={content.media.url} muted />
        ) : (
          <img className="card__media" src={content.media?.url} alt={content.title} />
        )}
        <div className="card__body">
          <span>{content.category?.name || "Evenement"}</span>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
      </Link>
    ));
  }

  return (
    <>
      <section className="gallery-controls" aria-label="Filtres de galerie">
        <div className="gallery-controls__search">
          <label htmlFor="gallery-search">Recherche</label>
          <input
            id="gallery-search"
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Rechercher par titre, description ou categorie"
          />
        </div>

        <div className="gallery-controls__row">
          <div className="field field--compact">
            <label htmlFor="gallery-category">Categorie</label>
            <select
              id="gallery-category"
              value={category}
              onChange={(event) => updateCategory(event.target.value)}
            >
              <option value="all">Toutes les categories</option>
              {categories.map((item) => (
                <option value={item._id} key={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="field field--compact">
            <label htmlFor="gallery-sort">Tri</label>
            <select
              id="gallery-sort"
              value={sort}
              onChange={(event) => updateSort(event.target.value)}
            >
              <option value="newest">Plus recents</option>
              <option value="title">Titre A-Z</option>
            </select>
          </div>
        </div>

        <div className="filter-bar filter-bar--small">
          <button
            className={type === "all" ? "filter is-active" : "filter"}
            type="button"
            onClick={() => updateType("all")}
          >
            Tous <span>{contents.length}</span>
          </button>
          <button
            className={type === "image" ? "filter is-active" : "filter"}
            type="button"
            onClick={() => updateType("image")}
          >
            Images <span>{totalImages}</span>
          </button>
          <button
            className={type === "video" ? "filter is-active" : "filter"}
            type="button"
            onClick={() => updateType("video")}
          >
            Videos <span>{totalVideos}</span>
          </button>
        </div>
      </section>

      <div className="gallery-summary">
        <strong>{contents.length}</strong>
        <span>resultat{contents.length > 1 ? "s" : ""} trouve{contents.length > 1 ? "s" : ""}</span>
      </div>

      <section className="gallery-results">
        {contents.length === 0 ? (
          <div className="empty-state">
            <h3>Aucune publication pour le moment</h3>
            <p>
              Ajoutez vos premieres photos de mariage, videos de 15 secondes,
              bouquets, tables, arches ou materiel depuis l'espace admin.
            </p>
          </div>
        ) : (
          <>
            {type !== "video" && imageContents.length > 0 ? (
              <div className="media-section">
                <div className="media-section__heading">
                  <h3>Images</h3>
                  <span>{totalImages} fichier{totalImages > 1 ? "s" : ""}</span>
                </div>
                <div className="grid">{renderCards(imageContents)}</div>
              </div>
            ) : null}

            {type !== "image" && videoContents.length > 0 ? (
              <div className="media-section">
                <div className="media-section__heading">
                  <h3>Videos</h3>
                  <span>{totalVideos} fichier{totalVideos > 1 ? "s" : ""}</span>
                </div>
                <div className="grid">{renderCards(videoContents)}</div>
              </div>
            ) : null}

            {visibleCount < contents.length ? (
              <div className="load-more">
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  Afficher plus
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
