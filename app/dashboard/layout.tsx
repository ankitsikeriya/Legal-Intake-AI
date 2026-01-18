import Link from 'next/link';
import { Home, Users, FileText, Settings } from 'lucide-react';
import { SignOutButton } from './sign-out-button';
import { UserProfile } from './user-profile';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">L</div>
                        LegalIntake
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg">
                        <Home size={18} />
                        Cases
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg">
                        <Users size={18} />
                        Clients
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg">
                        <FileText size={18} />
                        Documents
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg">
                        <Settings size={18} />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-4">
                    <UserProfile />
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
