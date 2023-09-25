import ThemeProvider from "./ThemeProvider";

export const metadata = {
  title: "PeerPrep",
  description: "CS3219 Group 41",
};

/**
 * Required RootLayout for Next to generate HTML
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
