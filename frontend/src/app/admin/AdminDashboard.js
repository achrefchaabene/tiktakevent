"use client";

import { Image, Layers3, Video, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const emptyContent = {
  title: "",
  description: "",
  body: "",
  category: "",
  status: "published",
  file: null
};

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminName, setAdminName] = useState("Admin");
  const [canCreateAdmin, setCanCreateAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [contents, setContents] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [contentForm, setContentForm] = useState(emptyContent);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    return {
      contents: contents.length,
      categories: categories.length,
      images: contents.filter((item) => item.media?.type === "image").length,
      videos: contents.filter((item) => item.media?.type === "video").length
    };
  }, [categories.length, contents]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadSetupStatus();
  }, []);

  async function request(path, options = {}) {
    let response;

    try {
      response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {})
        }
      });
    } catch {
      throw new Error(`API inaccessible: ${API_URL}. Verifie que le backend est lance et que la page est ouverte avec http://localhost:3000.`);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Action impossible");
    }

    return response.json();
  }

  async function loadData() {
    try {
      const [categoryData, contentData] = await Promise.all([
        fetch(`${API_URL}/categories`).then((res) => res.json()),
        fetch(`${API_URL}/contents?status=all`).then((res) => res.json())
      ]);
      setCategories(categoryData);
      setContents(contentData);
    } catch {
      setMessage("Impossible de charger les donnees.");
    }
  }

  async function loadSetupStatus() {
    try {
      const data = await request("/auth/setup-status");
      setCanCreateAdmin(data.canCreateAdmin);
    } catch {
      setCanCreateAdmin(false);
    }
  }

  async function createFirstAdmin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await request("/auth/setup-admin", {
        method: "POST",
        body: JSON.stringify({ name: adminName, email, password })
      });

      setToken(data.token);
      setCanCreateAdmin(false);
      window.localStorage.setItem("adminToken", data.token);
      setMessage("Compte admin cree avec succes.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      setToken(data.token);
      window.localStorage.setItem("adminToken", data.token);
      setMessage("Connexion admin reussie.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    window.localStorage.removeItem("adminToken");
    setToken("");
  }

  async function createCategory(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await request("/categories", {
        method: "POST",
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription
        })
      });
      setCategoryName("");
      setCategoryDescription("");
      setMessage("Categorie ajoutee.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id) {
    setLoading(true);
    setMessage("");

    try {
      await request(`/categories/${id}`, { method: "DELETE" });
      setMessage("Categorie supprimee.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createContent(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!contentForm.file) {
        throw new Error("Choisis une image ou une video.");
      }

      const uploadData = new FormData();
      uploadData.append("file", contentForm.file);

      const media = await request("/uploads", {
        method: "POST",
        body: uploadData
      });

      await request("/contents", {
        method: "POST",
        body: JSON.stringify({
          title: contentForm.title,
          description: contentForm.description,
          body: contentForm.body,
          category: contentForm.category,
          status: contentForm.status,
          media
        })
      });

      setContentForm(emptyContent);
      setMessage("Media ajoute avec succes.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteContent(id) {
    setLoading(true);
    setMessage("");

    try {
      await request(`/contents/${id}`, { method: "DELETE" });
      setMessage("Media supprime.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <section className="admin-panel admin-panel--login">
        <div>
          <span className="eyebrow">Administration</span>
          <h1>{canCreateAdmin ? "Creer le premier admin" : "Connexion admin"}</h1>
          <p>
            {canCreateAdmin
              ? "Aucun admin n'existe encore. Cree le premier compte pour proteger le dashboard."
              : "Connecte-toi pour gerer les images, videos et categories."}
          </p>
        </div>
        <form className="form" onSubmit={canCreateAdmin ? createFirstAdmin : login}>
          {canCreateAdmin ? (
            <div className="field">
              <label htmlFor="adminName">Nom admin</label>
              <input
                id="adminName"
                value={adminName}
                onChange={(event) => setAdminName(event.target.value)}
                placeholder="Admin"
                required
              />
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ad@gmail.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mot de passe admin"
              required
            />
          </div>
          <button className="button" type="submit" disabled={loading}>
            {loading
              ? "Traitement..."
              : canCreateAdmin
                ? "Creer le compte admin"
                : "Se connecter"}
          </button>
          {message ? <p className="notice">{message}</p> : null}
        </form>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-topbar">
        <div>
          <span className="eyebrow">Dashboard admin</span>
          <h1>Organisation des medias</h1>
          <p>Gere les categories, images et videos affichees aux visiteurs.</p>
        </div>
        <button className="button button--ghost" type="button" onClick={logout}>
          Deconnexion
        </button>
      </div>

      <div className="stat-grid">
        <article><span className="stat-icon"><WalletCards size={20} /></span><strong>{stats.contents}</strong><span>Medias</span></article>
        <article><span className="stat-icon"><Layers3 size={20} /></span><strong>{stats.categories}</strong><span>Categories</span></article>
        <article><span className="stat-icon"><Image size={20} /></span><strong>{stats.images}</strong><span>Images</span></article>
        <article><span className="stat-icon"><Video size={20} /></span><strong>{stats.videos}</strong><span>Videos</span></article>
      </div>

      {message ? <p className="notice">{message}</p> : null}

      <div className="admin-grid">
        <form className="panel-card form" id="medias" onSubmit={createContent}>
          <div>
            <span className="eyebrow">Media</span>
            <h2>Ajouter image ou video</h2>
          </div>
          <div className="field">
            <label htmlFor="title">Titre</label>
            <input
              id="title"
              value={contentForm.title}
              onChange={(event) => setContentForm({ ...contentForm, title: event.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="3"
              value={contentForm.description}
              onChange={(event) => setContentForm({ ...contentForm, description: event.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="body">Details</label>
            <textarea
              id="body"
              rows="5"
              value={contentForm.body}
              onChange={(event) => setContentForm({ ...contentForm, body: event.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="category">Categorie</label>
            <select
              id="category"
              value={contentForm.category}
              onChange={(event) => setContentForm({ ...contentForm, category: event.target.value })}
              required
            >
              <option value="">Choisir une categorie</option>
              {categories.map((item) => (
                <option value={item._id} key={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="status">Statut</label>
            <select
              id="status"
              value={contentForm.status}
              onChange={(event) => setContentForm({ ...contentForm, status: event.target.value })}
            >
              <option value="published">Publie</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="file">Fichier</label>
            <input
              id="file"
              type="file"
              accept="image/*,video/*"
              onChange={(event) => setContentForm({ ...contentForm, file: event.target.files?.[0] || null })}
              required
            />
          </div>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Traitement..." : "Uploader et publier"}
          </button>
        </form>

        <form className="panel-card form" id="categories" onSubmit={createCategory}>
          <div>
            <span className="eyebrow">Categories</span>
            <h2>Organiser la galerie</h2>
          </div>
          <div className="field">
            <label htmlFor="categoryName">Nom categorie</label>
            <input
              id="categoryName"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Decoration mariage"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="categoryDescription">Description</label>
            <textarea
              id="categoryDescription"
              rows="4"
              value={categoryDescription}
              onChange={(event) => setCategoryDescription(event.target.value)}
            />
          </div>
          <button className="button" type="submit" disabled={loading}>
            Ajouter categorie
          </button>

          <div className="compact-list">
            {categories.map((item) => (
              <article key={item._id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.description || "Sans description"}</span>
                </div>
                <button type="button" onClick={() => deleteCategory(item._id)}>Supprimer</button>
              </article>
            ))}
          </div>
        </form>
      </div>

      <div className="panel-card" id="liste-medias">
        <div className="table-heading">
          <div>
            <span className="eyebrow">CRUD medias</span>
            <h2>Images et videos publiees</h2>
          </div>
        </div>
        <div className="media-list">
          {contents.length === 0 ? (
            <p>Aucun media ajoute.</p>
          ) : (
            contents.map((item) => (
              <article className="media-row" key={item._id}>
                {item.media?.type === "video" ? (
                  <video src={item.media.url} muted />
                ) : (
                  <img src={item.media?.url} alt={item.title} />
                )}
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.category?.name || "Sans categorie"} - {item.status}</span>
                </div>
                <button type="button" onClick={() => deleteContent(item._id)}>
                  Supprimer
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
