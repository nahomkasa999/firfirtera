'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useMealStore } from '@/store/useMealStore';

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const { organized, joined } = useMealStore();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: '/', label: 'Home', icon: 'home' },
        { href: '/restaurants', label: 'Restaurants', icon: 'restaurant' },
        { href: '/meals', label: 'My Meals', icon: 'event_available' },
        { href: '/create', label: 'Plan Meal', icon: 'add_circle' },
        { href: '/settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground p-6">
            {/* Logo Area */}
            <div className="mb-10 px-2">
                <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
                    Firfirtera
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.href)
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm'
                            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                            }`}
                    >
                        <span
                            className={`material-symbols-outlined text-[24px] transition-colors ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                                }`}
                        >
                            {item.icon}
                        </span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* User Profile Summary */}
            {user && (
                <div className="mt-auto pt-6 border-t border-sidebar-border">
                    <Link href="/profile">
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {user.firstName?.[0] || user.username?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-sidebar-foreground">
                                    {user.firstName || user.username}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {organized.length} organized • {joined.length} joined
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </aside>
    );
}
