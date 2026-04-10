import { Link } from '@inertiajs/react';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Fragment } from 'react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-14 w-full shrink-0 items-center border-b border-gray-200 bg-white px-6">
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-sm">
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <Fragment key={index}>
                                <li>
                                    {isLast ? (
                                        <span className="font-semibold text-gray-900">{item.title}</span>
                                    ) : (
                                        <Link href={item.href} className="text-gray-400 transition hover:text-gray-600">
                                            {item.title}
                                        </Link>
                                    )}
                                </li>
                                {!isLast && <li className="text-gray-300">/</li>}
                            </Fragment>
                        );
                    })}
                </ol>
            </nav>
        </header>
    );
}
