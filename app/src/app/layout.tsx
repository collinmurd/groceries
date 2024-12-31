import type { Metadata } from 'next'
 
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
        <div id="root">{children}</div>
      </body>
    </html>
  )
}