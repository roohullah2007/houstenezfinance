import { Link } from '@inertiajs/react';
import { Car, Building2, ClipboardList, CreditCard, FileText, LayoutGrid, Mail } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Car Listings',
        href: '/admin/car-listings',
        icon: Car,
    },
    {
        title: 'Real Estate',
        href: '/admin/real-estate-listings',
        icon: Building2,
    },
    {
        title: 'Real Estate Content',
        href: '/admin/real-estate-content',
        icon: FileText,
    },
    {
        title: 'Finance Applications',
        href: '/admin/finance-applications',
        icon: ClipboardList,
    },
    {
        title: 'Contact Messages',
        href: '/admin/contact-messages',
        icon: Mail,
    },
    {
        title: 'Payment Settings',
        href: '/admin/payment-settings',
        icon: CreditCard,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-gray-200">
            <SidebarHeader className="px-4 py-5">
                <Link href="/admin/dashboard" className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F26B5E]">
                        <span className="text-sm font-bold text-white">EZ</span>
                    </div>
                    <span className="text-base font-bold text-gray-900 group-data-[collapsible=icon]:hidden">
                        Admin Panel
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
