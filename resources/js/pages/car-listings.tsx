import { Head, Link, router } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import {
    Search,
    Car,
    CarFront,
    Tag,
    Calendar,
    ChevronDown,
    SlidersHorizontal,
    Bookmark,
    X,
    Facebook,
    Twitter,
    Instagram,
    Phone,
    Mail,
    MapPin,
    Play,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RangeSlider } from '@/components/range-slider';
import { useState, useEffect, useMemo, useRef } from 'react';

const ACCENT = '#F26B5E';

interface CarListing {
    id: number;
    title: string;
    state: string;
    city: string;
    make: string;
    model: string;
    year: number;
    price: string;
    miles: number;
    transmission: string;
    vehicle_type: string;
    images: string[] | null;
    main_image_index: number;
    video_url: string | null;
    created_at: string;
}

interface PaginatedListings {
    data: CarListing[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search?: string;
    vehicle_type?: string;
    make?: string;
    model?: string;
    min_price?: string;
    max_price?: string;
    min_year?: string;
    max_year?: string;
    transmission?: string;
}

interface FilterMeta {
    priceMin: number;
    priceMax: number;
    yearMin: number;
    yearMax: number;
    makes: Record<string, string[]>;
}

interface Props {
    listings: PaginatedListings;
    filters: Filters;
    filterMeta: FilterMeta;
}

function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
}

function formatMoney(n: number | string): string {
    const num = Number(n);
    if (num >= 1000) return `$${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
    return `$${num}`;
}

// Hook to close a dropdown when clicking outside
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, onClose]);
}

interface SuggestionItem {
    type: 'listing' | 'make' | 'model' | 'city';
    label: string;
    value: string;
    id?: number;
}

interface SuggestionResponse {
    titles: SuggestionItem[];
    makes: SuggestionItem[];
    models: SuggestionItem[];
    cities: SuggestionItem[];
}

export default function CarListings({ listings, filters, filterMeta }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);

    // Price state
    const [minPrice, setMinPrice] = useState<number>(
        filters.min_price ? Number(filters.min_price) : filterMeta.priceMin
    );
    const [maxPrice, setMaxPrice] = useState<number>(
        filters.max_price ? Number(filters.max_price) : filterMeta.priceMax
    );

    // Make/Model state
    const [selectedMake, setSelectedMake] = useState(filters.make || '');
    const [selectedModel, setSelectedModel] = useState(filters.model || '');

    // Year state
    const [minYear, setMinYear] = useState<number>(
        filters.min_year ? Number(filters.min_year) : filterMeta.yearMin
    );
    const [maxYear, setMaxYear] = useState<number>(
        filters.max_year ? Number(filters.max_year) : filterMeta.yearMax
    );

    // Body type & full filters panel
    const [bodyType, setBodyType] = useState(filters.vehicle_type || '');
    const [transmission, setTransmission] = useState(filters.transmission || '');

    function buildParams(overrides: Record<string, string | number | undefined> = {}): Record<string, string> {
        const raw: Record<string, string | number | undefined> = {
            search: search || undefined,
            vehicle_type: bodyType || undefined,
            make: selectedMake || undefined,
            model: selectedModel || undefined,
            min_price: minPrice !== filterMeta.priceMin ? minPrice : undefined,
            max_price: maxPrice !== filterMeta.priceMax ? maxPrice : undefined,
            min_year: minYear !== filterMeta.yearMin ? minYear : undefined,
            max_year: maxYear !== filterMeta.yearMax ? maxYear : undefined,
            transmission: transmission || undefined,
            ...overrides,
        };
        const params: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
            if (v !== undefined && v !== '' && v !== null) params[k] = String(v);
        });
        return params;
    }

    function go(params: Record<string, string>) {
        router.get('/car-listings', params, { preserveState: true, replace: true });
        setOpenDropdown(null);
    }

    function applySearch() {
        go(buildParams());
    }

    function clearFilter(key: keyof Filters) {
        const params = buildParams({ [key]: undefined });
        // Also reset local state for that filter
        if (key === 'min_price' || key === 'max_price') {
            setMinPrice(filterMeta.priceMin);
            setMaxPrice(filterMeta.priceMax);
            delete params.min_price;
            delete params.max_price;
        }
        if (key === 'min_year' || key === 'max_year') {
            setMinYear(filterMeta.yearMin);
            setMaxYear(filterMeta.yearMax);
            delete params.min_year;
            delete params.max_year;
        }
        if (key === 'make' || key === 'model') {
            setSelectedMake('');
            setSelectedModel('');
            delete params.make;
            delete params.model;
        }
        if (key === 'vehicle_type') {
            setBodyType('');
            delete params.vehicle_type;
        }
        if (key === 'search') {
            setSearch('');
            delete params.search;
        }
        if (key === 'transmission') {
            setTransmission('');
            delete params.transmission;
        }
        go(params);
    }

    function resetAll() {
        setSearch('');
        setBodyType('');
        setSelectedMake('');
        setSelectedModel('');
        setMinPrice(filterMeta.priceMin);
        setMaxPrice(filterMeta.priceMax);
        setMinYear(filterMeta.yearMin);
        setMaxYear(filterMeta.yearMax);
        setTransmission('');
        router.get('/car-listings', {}, { preserveState: true, replace: true });
        setOpenDropdown(null);
    }

    // Refs for outside click handling
    const priceRef = useRef<HTMLDivElement>(null);
    const makeRef = useRef<HTMLDivElement>(null);
    const yearRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);

    useOutsideClick(priceRef, () => openDropdown === 'price' && setOpenDropdown(null));
    useOutsideClick(makeRef, () => openDropdown === 'make' && setOpenDropdown(null));
    useOutsideClick(yearRef, () => openDropdown === 'year' && setOpenDropdown(null));
    useOutsideClick(filtersRef, () => openDropdown === 'filters' && setOpenDropdown(null));
    useOutsideClick(searchRef, () => setShowSuggestions(false));

    // Debounced suggestion fetch
    useEffect(() => {
        if (!search || search.length < 1 || !showSuggestions) {
            setSuggestions(null);
            return;
        }
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/car-listings/suggestions?q=${encodeURIComponent(search)}`, {
                    signal: controller.signal,
                    headers: { Accept: 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                    setHighlightedIndex(-1);
                }
            } catch (e) {
                // ignore abort / network errors
            }
        }, 200);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [search, showSuggestions]);

    // Flatten suggestions for keyboard navigation
    const flatSuggestions = useMemo<SuggestionItem[]>(() => {
        if (!suggestions) return [];
        return [
            ...suggestions.titles,
            ...suggestions.makes,
            ...suggestions.models,
            ...suggestions.cities,
        ];
    }, [suggestions]);

    function selectSuggestion(item: SuggestionItem) {
        setShowSuggestions(false);
        if (item.type === 'listing' && item.id) {
            router.get(`/car-listings/${item.id}`);
            return;
        }
        if (item.type === 'make') {
            setSelectedMake(item.value);
            setSelectedModel('');
            go(buildParams({ search: undefined, make: item.value, model: undefined }));
            setSearch('');
            return;
        }
        if (item.type === 'model') {
            setSelectedModel(item.value);
            go(buildParams({ search: undefined, model: item.value }));
            setSearch('');
            return;
        }
        // city or fallback
        setSearch(item.value);
        go(buildParams({ search: item.value }));
    }

    function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showSuggestions || flatSuggestions.length === 0) {
            if (e.key === 'Enter') applySearch();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((i) => (i + 1) % flatSuggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((i) => (i - 1 + flatSuggestions.length) % flatSuggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0) {
                selectSuggestion(flatSuggestions[highlightedIndex]);
            } else {
                applySearch();
                setShowSuggestions(false);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }

    const priceActive = filters.min_price || filters.max_price;
    const makeActive = filters.make;
    const yearActive = filters.min_year || filters.max_year;
    const bodyActive = filters.vehicle_type;

    const yearsList: number[] = [];
    for (let y = filterMeta.yearMax; y >= filterMeta.yearMin; y--) yearsList.push(y);

    const availableModels = selectedMake && filterMeta.makes[selectedMake] ? filterMeta.makes[selectedMake] : [];

    return (
        <>
            <Head title="Car Listings — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />

                    <PublicHeader />

                </div>

                {/* Filter toolbar */}
                <div className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex min-h-[60px] max-w-[1408px] flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search with autocomplete */}
                            <div ref={searchRef} className="relative w-full sm:w-[260px]">
                                <div className="relative flex h-9 items-center">
                                    <Search className="absolute left-3 z-10 h-4 w-4 text-slate-500" />
                                    <Input
                                        style={{ backgroundColor: '#ffffff' }}
                                        placeholder="Search make, model, city"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => search.length > 0 && setShowSuggestions(true)}
                                        onKeyDown={handleSearchKeyDown}
                                        className="h-9 rounded-full border-gray-200 pl-9 text-[13px] text-slate-700 shadow-none placeholder:text-slate-500 focus-visible:ring-0"
                                    />
                                </div>

                                {showSuggestions && search.length > 0 && suggestions && flatSuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[380px] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                                        {suggestions.titles.length > 0 && (
                                            <div className="border-b border-gray-100 py-1">
                                                <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Listings</p>
                                                {suggestions.titles.map((item, i) => {
                                                    const idx = i;
                                                    return (
                                                        <button
                                                            key={`t-${item.id}`}
                                                            type="button"
                                                            onClick={() => selectSuggestion(item)}
                                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition ${highlightedIndex === idx ? 'bg-[#F26B5E]/10 text-[#F26B5E]' : 'text-slate-700 hover:bg-gray-50'}`}
                                                        >
                                                            <Car className="h-3.5 w-3.5 flex-shrink-0" />
                                                            <span className="truncate">{item.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {suggestions.makes.length > 0 && (
                                            <div className="border-b border-gray-100 py-1">
                                                <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Makes</p>
                                                {suggestions.makes.map((item, i) => {
                                                    const idx = suggestions.titles.length + i;
                                                    return (
                                                        <button
                                                            key={`make-${item.value}`}
                                                            type="button"
                                                            onClick={() => selectSuggestion(item)}
                                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition ${highlightedIndex === idx ? 'bg-[#F26B5E]/10 text-[#F26B5E]' : 'text-slate-700 hover:bg-gray-50'}`}
                                                        >
                                                            <Tag className="h-3.5 w-3.5 flex-shrink-0" />
                                                            {item.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {suggestions.models.length > 0 && (
                                            <div className="border-b border-gray-100 py-1">
                                                <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Models</p>
                                                {suggestions.models.map((item, i) => {
                                                    const idx = suggestions.titles.length + suggestions.makes.length + i;
                                                    return (
                                                        <button
                                                            key={`model-${item.value}`}
                                                            type="button"
                                                            onClick={() => selectSuggestion(item)}
                                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition ${highlightedIndex === idx ? 'bg-[#F26B5E]/10 text-[#F26B5E]' : 'text-slate-700 hover:bg-gray-50'}`}
                                                        >
                                                            <CarFront className="h-3.5 w-3.5 flex-shrink-0" />
                                                            {item.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {suggestions.cities.length > 0 && (
                                            <div className="py-1">
                                                <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cities</p>
                                                {suggestions.cities.map((item, i) => {
                                                    const idx = suggestions.titles.length + suggestions.makes.length + suggestions.models.length + i;
                                                    return (
                                                        <button
                                                            key={`city-${item.value}`}
                                                            type="button"
                                                            onClick={() => selectSuggestion(item)}
                                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition ${highlightedIndex === idx ? 'bg-[#F26B5E]/10 text-[#F26B5E]' : 'text-slate-700 hover:bg-gray-50'}`}
                                                        >
                                                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                            {item.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showSuggestions && search.length > 0 && suggestions && flatSuggestions.length === 0 && (
                                    <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-gray-200 bg-white p-4 text-center text-sm text-slate-500 shadow-xl">
                                        No matches found
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="relative" ref={priceRef}>
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                                    className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] ${priceActive ? 'border-[#F26B5E] bg-[#F26B5E]/10 text-[#F26B5E]' : 'border-gray-200 bg-white text-slate-700 hover:border-slate-300'}`}
                                >
                                    <Tag className="h-4 w-4" />
                                    {priceActive
                                        ? `${filters.min_price ? formatMoney(filters.min_price) : formatMoney(filterMeta.priceMin)} – ${filters.max_price ? formatMoney(filters.max_price) : formatMoney(filterMeta.priceMax)}`
                                        : 'Price'}
                                    {priceActive ? (
                                        <X className="h-3 w-3" onClick={(e) => { e.stopPropagation(); clearFilter('min_price'); }} />
                                    ) : (
                                        <ChevronDown className="h-3 w-3" />
                                    )}
                                </button>
                                {openDropdown === 'price' && (
                                    <div className="absolute left-0 z-40 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
                                        <h4 className="text-sm font-semibold text-slate-900">Price Range</h4>
                                        <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                                            <span className="font-semibold text-slate-900">${minPrice.toLocaleString()}</span>
                                            <span className="font-semibold text-slate-900">${maxPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="mt-3">
                                            <RangeSlider
                                                min={filterMeta.priceMin}
                                                max={filterMeta.priceMax}
                                                step={500}
                                                minValue={minPrice}
                                                maxValue={maxPrice}
                                                onMinChange={setMinPrice}
                                                onMaxChange={setMaxPrice}
                                            />
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] text-slate-500">Min</label>
                                                <input
                                                    type="number"
                                                    value={minPrice}
                                                    onChange={(e) => setMinPrice(Math.min(Number(e.target.value) || 0, maxPrice))}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] text-slate-500">Max</label>
                                                <input
                                                    type="number"
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(Math.max(Number(e.target.value) || 0, minPrice))}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => { setMinPrice(filterMeta.priceMin); setMaxPrice(filterMeta.priceMax); clearFilter('min_price'); }}
                                                className="text-xs text-slate-500 hover:text-slate-900"
                                            >
                                                Reset
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => go(buildParams({ min_price: minPrice, max_price: maxPrice }))}
                                                className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white"
                                                style={{ backgroundColor: ACCENT }}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Make & Model */}
                            <div className="relative hidden lg:block" ref={makeRef}>
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(openDropdown === 'make' ? null : 'make')}
                                    className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] ${makeActive ? 'border-[#F26B5E] bg-[#F26B5E]/10 text-[#F26B5E]' : 'border-gray-200 bg-white text-slate-700 hover:border-slate-300'}`}
                                >
                                    <Car className="h-4 w-4" />
                                    {makeActive
                                        ? `${filters.make}${filters.model ? ` ${filters.model}` : ''}`
                                        : 'Make & Model'}
                                    {makeActive ? (
                                        <X className="h-3 w-3" onClick={(e) => { e.stopPropagation(); clearFilter('make'); }} />
                                    ) : (
                                        <ChevronDown className="h-3 w-3" />
                                    )}
                                </button>
                                {openDropdown === 'make' && (
                                    <div className="absolute left-0 z-40 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
                                        <h4 className="text-sm font-semibold text-slate-900">Make</h4>
                                        <select
                                            value={selectedMake}
                                            onChange={(e) => { setSelectedMake(e.target.value); setSelectedModel(''); }}
                                            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                        >
                                            <option value="">Any Make</option>
                                            {Object.keys(filterMeta.makes).map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                        <h4 className="mt-4 text-sm font-semibold text-slate-900">Model</h4>
                                        <select
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            disabled={!selectedMake}
                                            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:border-[#F26B5E] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                                        >
                                            <option value="">{selectedMake ? 'Any Model' : 'Select Make First'}</option>
                                            {availableModels.map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                        <div className="mt-4 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => { setSelectedMake(''); setSelectedModel(''); clearFilter('make'); }}
                                                className="text-xs text-slate-500 hover:text-slate-900"
                                            >
                                                Reset
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => go(buildParams({ make: selectedMake || undefined, model: selectedModel || undefined }))}
                                                className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white"
                                                style={{ backgroundColor: ACCENT }}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Year */}
                            <div className="relative hidden lg:block" ref={yearRef}>
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                                    className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] ${yearActive ? 'border-[#F26B5E] bg-[#F26B5E]/10 text-[#F26B5E]' : 'border-gray-200 bg-white text-slate-700 hover:border-slate-300'}`}
                                >
                                    <Calendar className="h-4 w-4" />
                                    {yearActive
                                        ? `${filters.min_year || filterMeta.yearMin} – ${filters.max_year || filterMeta.yearMax}`
                                        : 'Year'}
                                    {yearActive ? (
                                        <X className="h-3 w-3" onClick={(e) => { e.stopPropagation(); clearFilter('min_year'); }} />
                                    ) : (
                                        <ChevronDown className="h-3 w-3" />
                                    )}
                                </button>
                                {openDropdown === 'year' && (
                                    <div className="absolute left-0 z-40 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
                                        <h4 className="text-sm font-semibold text-slate-900">Year Range</h4>
                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] text-slate-500">From</label>
                                                <select
                                                    value={minYear}
                                                    onChange={(e) => setMinYear(Math.min(Number(e.target.value), maxYear))}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                >
                                                    {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[11px] text-slate-500">To</label>
                                                <select
                                                    value={maxYear}
                                                    onChange={(e) => setMaxYear(Math.max(Number(e.target.value), minYear))}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                >
                                                    {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => { setMinYear(filterMeta.yearMin); setMaxYear(filterMeta.yearMax); clearFilter('min_year'); }}
                                                className="text-xs text-slate-500 hover:text-slate-900"
                                            >
                                                Reset
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => go(buildParams({ min_year: minYear, max_year: maxYear }))}
                                                className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white"
                                                style={{ backgroundColor: ACCENT }}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Body type */}
                            <div className="relative hidden lg:block">
                                <select
                                    value={bodyType}
                                    onChange={(e) => {
                                        setBodyType(e.target.value);
                                        go(buildParams({ vehicle_type: e.target.value || undefined }));
                                    }}
                                    className={`h-9 appearance-none rounded-full border pl-9 pr-8 text-[13px] focus:outline-none ${bodyActive ? 'border-[#F26B5E] bg-[#F26B5E]/10 text-[#F26B5E]' : 'border-gray-200 bg-white text-slate-700 hover:border-slate-300'}`}
                                >
                                    <option value="">Body Type</option>
                                    {['Sedan','SUV','Truck','Coupe','Convertible','Hatchback','Van','Wagon','Crossover'].map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                <CarFront className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${bodyActive ? 'text-[#F26B5E]' : 'text-slate-500'}`} />
                                <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 ${bodyActive ? 'text-[#F26B5E]' : 'text-slate-500'}`} />
                            </div>

                            {/* Filters panel */}
                            <div className="relative" ref={filtersRef}>
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(openDropdown === 'filters' ? null : 'filters')}
                                    className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[13px] text-slate-700 hover:border-slate-300"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filters
                                </button>
                                {openDropdown === 'filters' && (
                                    <div className="absolute right-0 z-40 mt-2 w-[320px] rounded-xl border border-gray-200 bg-white p-5 shadow-xl sm:w-[380px]">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-base font-semibold text-slate-900">All Filters</h4>
                                            <button onClick={() => setOpenDropdown(null)}>
                                                <X className="h-4 w-4 text-slate-500" />
                                            </button>
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            {/* Body type */}
                                            <div>
                                                <label className="text-xs font-medium text-slate-700">Body Type</label>
                                                <select
                                                    value={bodyType}
                                                    onChange={(e) => setBodyType(e.target.value)}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                >
                                                    <option value="">Any</option>
                                                    {['Sedan','SUV','Truck','Coupe','Convertible','Hatchback','Van','Wagon','Crossover'].map((t) => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Transmission */}
                                            <div>
                                                <label className="text-xs font-medium text-slate-700">Transmission</label>
                                                <select
                                                    value={transmission}
                                                    onChange={(e) => setTransmission(e.target.value)}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                >
                                                    <option value="">Any</option>
                                                    <option value="Automatic">Automatic</option>
                                                    <option value="Manual">Manual</option>
                                                    <option value="CVT">CVT</option>
                                                    <option value="Dual-Clutch">Dual-Clutch</option>
                                                </select>
                                            </div>

                                            {/* Make */}
                                            <div>
                                                <label className="text-xs font-medium text-slate-700">Make</label>
                                                <select
                                                    value={selectedMake}
                                                    onChange={(e) => { setSelectedMake(e.target.value); setSelectedModel(''); }}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                >
                                                    <option value="">Any Make</option>
                                                    {Object.keys(filterMeta.makes).map((m) => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Price */}
                                            <div>
                                                <label className="text-xs font-medium text-slate-700">
                                                    Price: ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}
                                                </label>
                                                <div className="mt-2">
                                                    <RangeSlider
                                                        min={filterMeta.priceMin}
                                                        max={filterMeta.priceMax}
                                                        step={500}
                                                        minValue={minPrice}
                                                        maxValue={maxPrice}
                                                        onMinChange={setMinPrice}
                                                        onMaxChange={setMaxPrice}
                                                    />
                                                </div>
                                            </div>

                                            {/* Year */}
                                            <div>
                                                <label className="text-xs font-medium text-slate-700">Year: {minYear} – {maxYear}</label>
                                                <div className="mt-1 grid grid-cols-2 gap-2">
                                                    <select
                                                        value={minYear}
                                                        onChange={(e) => setMinYear(Math.min(Number(e.target.value), maxYear))}
                                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                    >
                                                        {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                    <select
                                                        value={maxYear}
                                                        onChange={(e) => setMaxYear(Math.max(Number(e.target.value), minYear))}
                                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-slate-700 focus:border-[#F26B5E] focus:outline-none"
                                                    >
                                                        {yearsList.map((y) => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex justify-between border-t border-gray-100 pt-4">
                                            <button
                                                type="button"
                                                onClick={resetAll}
                                                className="text-sm text-slate-500 hover:text-slate-900"
                                            >
                                                Reset all
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => go(buildParams())}
                                                className="rounded-lg px-5 py-2 text-sm font-semibold text-white"
                                                style={{ backgroundColor: ACCENT }}
                                            >
                                                Apply Filters
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex h-9 items-center gap-1.5 rounded-full bg-black px-4 text-[12px] font-bold tracking-wider text-white hover:bg-slate-800"
                            >
                                <Bookmark className="h-3.5 w-3.5" />
                                SAVE SEARCH
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section header */}
                <div className="mx-auto max-w-[1408px] px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">All Listings</h2>
                            {(filters.vehicle_type || filters.search || filters.make || filters.model || filters.transmission || filters.min_price || filters.max_price || filters.min_year || filters.max_year) && (
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="text-xs text-slate-500">Active filters:</span>
                                    {filters.make && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F26B5E]/10 px-3 py-1 text-xs font-medium text-[#F26B5E]">
                                            Make: {filters.make}
                                            <button type="button" onClick={() => clearFilter('make')}><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    {filters.model && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F26B5E]/10 px-3 py-1 text-xs font-medium text-[#F26B5E]">
                                            Model: {filters.model}
                                            <button type="button" onClick={() => clearFilter('model')}><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    {filters.vehicle_type && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F26B5E]/10 px-3 py-1 text-xs font-medium text-[#F26B5E]">
                                            {filters.vehicle_type}
                                            <button type="button" onClick={() => clearFilter('vehicle_type')}><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    {filters.transmission && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F26B5E]/10 px-3 py-1 text-xs font-medium text-[#F26B5E]">
                                            {filters.transmission}
                                            <button type="button" onClick={() => clearFilter('transmission')}><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    {(filters.min_price || filters.max_price) && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F26B5E]/10 px-3 py-1 text-xs font-medium text-[#F26B5E]">
                                            ${Number(filters.min_price || filterMeta.priceMin).toLocaleString()} – ${Number(filters.max_price || filterMeta.priceMax).toLocaleString()}
                                            <button type="button" onClick={() => clearFilter('min_price')}><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    {(filters.min_year || filters.max_year) && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F26B5E]/10 px-3 py-1 text-xs font-medium text-[#F26B5E]">
                                            {filters.min_year || filterMeta.yearMin} – {filters.max_year || filterMeta.yearMax}
                                            <button type="button" onClick={() => clearFilter('min_year')}><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    {filters.search && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F26B5E]/10 px-3 py-1 text-xs font-medium text-[#F26B5E]">
                                            "{filters.search}"
                                            <button type="button" onClick={() => clearFilter('search')}><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={resetAll}
                                        className="text-xs text-slate-500 underline hover:text-slate-900"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-start gap-1 sm:items-end">
                            <button
                                type="button"
                                className="flex items-center gap-1 text-[13px] text-slate-700 hover:text-slate-900"
                            >
                                Sort: <span className="font-semibold">Recommended</span>
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            <p className="text-[12px] text-slate-500">{listings.total} {listings.total === 1 ? 'result' : 'results'}</p>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                <div className="mx-auto max-w-[1408px] px-4 pb-10 sm:px-6 lg:px-8">
                    {listings.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                            <Car className="mx-auto h-16 w-16 text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No listings found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filters.search || filters.vehicle_type
                                    ? 'Try adjusting your search or filters.'
                                    : 'Check back soon for new vehicle listings.'}
                            </p>
                            <Link
                                href="/sell-your-car"
                                className="mt-6 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                                style={{ backgroundColor: ACCENT }}
                            >
                                List Your Car
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {listings.data.map((car) => {
                                    const mainImg = car.images && car.images.length > 0
                                        ? car.images[car.main_image_index ?? 0] ?? car.images[0]
                                        : null;
                                    return (
                                        <Link
                                            key={car.id}
                                            href={`/car-listings/${car.id}`}
                                            className="group block overflow-hidden rounded-xl border border-gray-200 bg-white text-slate-900 transition-shadow hover:shadow-lg"
                                        >
                                            <div className="relative" style={{ height: 180 }}>
                                                {mainImg ? (
                                                    <img
                                                        src={`/storage/${mainImg}`}
                                                        alt={car.title}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                        <Car className="h-10 w-10 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                                                    {timeAgo(car.created_at)}
                                                </div>
                                                {car.video_url && (
                                                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                        <Play className="h-2.5 w-2.5 fill-white" />
                                                        Video
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <h3 className="truncate text-sm font-semibold text-slate-900">{car.title}</h3>
                                                <p className="mt-1 text-lg font-bold" style={{ color: ACCENT }}>
                                                    ${Number(car.price).toLocaleString()}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12px] text-gray-500">
                                                    <span><strong className="text-gray-700">{Number(car.miles).toLocaleString()}</strong> mi</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span><strong className="text-gray-700">{car.transmission}</strong></span>
                                                    <span className="text-gray-300">|</span>
                                                    <span>{car.vehicle_type}</span>
                                                </div>
                                                <p className="mt-1 truncate text-[12px] text-gray-500">
                                                    {car.city}, {car.state}
                                                </p>
                                                <p className="mt-1 text-[11px] text-gray-400">
                                                    {car.year} {car.make} {car.model}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Featured Video Tour */}
                            <div className="mt-12">
                                <div className="mb-4 flex items-center gap-2">
                                    <Play className="h-5 w-5 fill-current" style={{ color: ACCENT }} />
                                    <h2 className="text-lg font-semibold text-slate-900">Featured Video Tour</h2>
                                </div>
                                <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-lg" style={{ paddingBottom: 'min(40%, 480px)' }}>
                                    <iframe
                                        className="absolute inset-0 h-full w-full border-0"
                                        src="https://www.youtube.com/embed/kJ0XcrUckUs"
                                        title="Vehicle Video Tour"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            </div>

                            {/* Pagination */}
                            {listings.last_page > 1 && (
                                <div className="mt-10 flex items-center justify-center gap-2">
                                    {listings.links.map((link, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[13px] font-semibold transition ${
                                                link.active
                                                    ? 'text-white'
                                                    : link.url
                                                        ? 'border border-gray-200 bg-white text-slate-700 hover:border-slate-300'
                                                        : 'cursor-not-allowed text-gray-300'
                                            }`}
                                            style={link.active ? { backgroundColor: ACCENT } : undefined}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-[#0b1020] text-white">
                    <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <img src="/images/housten-logo-1.png" alt="Houston EZ Finance" className="h-14 w-auto" />
                                <p className="mt-4 text-sm leading-relaxed text-white/60">
                                    Your trusted marketplace for quality vehicles and hassle-free auto financing in Houston and beyond.
                                </p>
                                <div className="mt-5 flex items-center gap-3">
                                    {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                        <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#F26B5E]">
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['About Us', 'Car Listings', 'Categories', 'Locations', 'Dealers', 'Blog', 'Contact'].map((l) => (
                                        <li key={l}><a href="#" className="transition hover:text-[#F26B5E]">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Categories</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck'].map((c) => (
                                        <li key={c}><a href="#" className="transition hover:text-[#F26B5E]">{c}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Contact</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />3505 S Dairy Ashford Rd # 115 717, Houston, TX 77082</li>
                                    <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />832-322-2354</li>
                                    <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" />houstonezfinance@gmail.com</li>
                                </ul>
                            </div>
                        </div>
                        <div className="my-10 h-px bg-white/10" />
                        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/50 sm:flex-row">
                            <p>&copy; {new Date().getFullYear()} Houston EZ Finance. All rights reserved.</p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-white">Privacy Policy</a>
                                <a href="#" className="hover:text-white">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
