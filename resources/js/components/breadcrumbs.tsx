import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    return (
        <>
            {breadcrumbs.length > 0 && (
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center gap-1.5 text-sm">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <Fragment key={index}>
                                    <li>
                                        {isLast ? (
                                            <span className="font-medium text-white">{item.title}</span>
                                        ) : (
                                            <Link href={item.href} className="text-white/60 transition hover:text-white">
                                                {item.title}
                                            </Link>
                                        )}
                                    </li>
                                    {!isLast && (
                                        <li className="text-white/40">/</li>
                                    )}
                                </Fragment>
                            );
                        })}
                    </ol>
                </nav>
            )}
        </>
    );
}
