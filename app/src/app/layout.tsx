import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import GlobalProvider from './components/GlobalProvider';
import './global.css';
import classes from './layout.module.css';
 
export const metadata: Metadata = {
  title: 'Groceries',
  description: 'My grocery list',
}

export const viewport: Viewport = {
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <LoginButton />
        </header>
        <div className={classes.app}>
          <GlobalProvider>
            <div id="root">{children}</div>
          </GlobalProvider>
        </div>
      </body>
    </html>
  )
}

function LoginButton() {
  return (
    <Link href="http://localhost:8000/auth/login">
      <button>Login with GitHub</button>
    </Link>
  );
}