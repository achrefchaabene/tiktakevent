export default function NewContentPage() {
  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <h2>Admin</h2>
      </aside>

      <section className="main">
        <h1>Nouveau contenu</h1>
        <form className="form">
          <div className="field">
            <label htmlFor="title">Titre</label>
            <input id="title" name="title" placeholder="Titre du contenu" />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="3" placeholder="Description courte" />
          </div>

          <div className="field">
            <label htmlFor="body">Texte</label>
            <textarea id="body" name="body" rows="8" placeholder="Contenu detaille" />
          </div>

          <div className="field">
            <label htmlFor="file">Image ou video</label>
            <input id="file" name="file" type="file" accept="image/*,video/*" />
          </div>

          <button className="button" type="button">Publier</button>
        </form>
      </section>
    </main>
  );
}

