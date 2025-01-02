import type { Metadata } from 'next'
import GlobalProvider from './components/GlobalProvider'
import classes from './layout.module.css';
 
export const metadata: Metadata = {
  title: 'Groceries',
  description: 'My grocery list',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className={classes.app}>
          <GlobalProvider>
            <div id="root">{children}</div>
          </GlobalProvider>
        </div>
      </body>
    </html>
  )
}