import type { Metadata, Viewport } from 'next';
import './global.css';
export declare const metadata: Metadata;
export declare const viewport: Viewport;
export default function RootLayout({ children, }: {
    children: React.ReactNode;
}): import("react").JSX.Element;
