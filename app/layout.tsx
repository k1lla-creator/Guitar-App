import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SongSeeker AI',
  description: 'Find it. Understand it. Play it.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
