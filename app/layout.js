import "./globals.css";

export const metadata = {
  title: "Abdul Wahid — Computer Vision & Full-Stack Engineer",
  description:
    "Abdul Wahid — Computer Science graduate majoring in Data Science. Building real-time computer-vision systems, FastAPI & Next.js applications, and Python automation pipelines.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
