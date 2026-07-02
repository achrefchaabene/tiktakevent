import "./globals.css";

export const metadata = {
  title: "Hana Events | Tiktak Events",
  description: "Organisation de mariages, decoration florale et galerie evenementielle"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}


