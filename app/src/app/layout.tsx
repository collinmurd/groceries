import type { Metadata } from 'next'
import GlobalProvider from './components/GlobalProvider'
 
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
        <GlobalProvider>
          <div id="root">{children}</div>
        </GlobalProvider>
      </body>
    </html>
  )
}