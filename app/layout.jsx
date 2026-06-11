import "./globals.css";

export const metadata = {
  title: "WK 2026 Predictor",
  description: "Poisson + AI voorspeltool voor het WK 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
