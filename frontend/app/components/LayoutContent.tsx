'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import AxiosConfig from './AxiosConfig';
import UploadProgressPanelGlobal from './UploadProgressPanel';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            <Header />
            <AxiosConfig />
            <div className="page-transition" style={{ flex: 1 }}>
                {children}
            </div>
            {!isAdmin && <Footer />}
            <UploadProgressPanelGlobal />
        </>
    );
}
