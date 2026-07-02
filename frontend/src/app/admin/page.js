import Link from "next/link";
import { FolderKanban, Images, LayoutDashboard } from "lucide-react";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <Link href="/" className="brand">Hana Events</Link>
        <p className="sidebar__text">Gestion de galerie evenementielle</p>
        <nav className="admin-nav" aria-label="Navigation admin">
          <Link href="/admin"><LayoutDashboard size={17} />Dashboard</Link>
          <a href="#categories"><FolderKanban size={17} />Categories</a>
          <a href="#medias"><Images size={17} />Medias</a>
        </nav>
      </aside>

      <section className="main">
        <AdminDashboard />
      </section>
    </main>
  );
}


