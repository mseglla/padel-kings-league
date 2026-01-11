import './globals.css';

export const metadata = {
  title: 'Lliga de Pàdel',
  description: 'Lliga amb classificació, temporades i gomets.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}
