import { Calculator, DollarSign, Percent, Info } from 'lucide-react';
import { useMemo, useState } from 'react';

const ACCENT = '#F26B5E';

interface Props {
    initialPrice: number;
}

type DownPaymentMode = 'percent' | 'amount';

const labelClass = 'mb-1 block text-xs font-medium text-gray-600';
const inputBase = 'w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';

function toNumber(v: string): number {
    const n = Number(String(v).replace(/[,\s$]/g, ''));
    return isFinite(n) && n >= 0 ? n : 0;
}

function fmtMoney(n: number): string {
    return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function MortgageCalculator({ initialPrice }: Props) {
    const [price, setPrice] = useState<string>(String(Math.round(initialPrice)));
    const [downMode, setDownMode] = useState<DownPaymentMode>('percent');
    const [downPercent, setDownPercent] = useState<string>('20');
    const [downAmount, setDownAmount] = useState<string>(String(Math.round(initialPrice * 0.2)));
    const [rate, setRate] = useState<string>('7.0');
    const [term, setTerm] = useState<string>('30');
    const [tax, setTax] = useState<string>('0');
    const [insurance, setInsurance] = useState<string>('0');
    const [hoa, setHoa] = useState<string>('0');

    const priceNum = toNumber(price);

    const downPaymentAmount = useMemo(() => {
        if (downMode === 'percent') {
            const pct = Math.min(Math.max(toNumber(downPercent), 0), 100);
            return Math.round((priceNum * pct) / 100);
        }
        return Math.min(toNumber(downAmount), priceNum);
    }, [downMode, downPercent, downAmount, priceNum]);

    const downPaymentPercent = useMemo(() => {
        if (priceNum <= 0) return 0;
        return (downPaymentAmount / priceNum) * 100;
    }, [downPaymentAmount, priceNum]);

    const loanPrincipal = Math.max(priceNum - downPaymentAmount, 0);
    const annualRate = toNumber(rate);
    const months = toNumber(term) * 12;
    const monthlyRate = annualRate / 100 / 12;

    const monthlyPI = useMemo(() => {
        if (loanPrincipal <= 0 || months <= 0) return 0;
        if (monthlyRate === 0) return loanPrincipal / months;
        const factor = Math.pow(1 + monthlyRate, months);
        return (loanPrincipal * (monthlyRate * factor)) / (factor - 1);
    }, [loanPrincipal, monthlyRate, months]);

    const monthlyTax = toNumber(tax) / 12;
    const monthlyInsurance = toNumber(insurance) / 12;
    const monthlyHoa = toNumber(hoa);
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHoa;

    const totalInterest = Math.max(monthlyPI * months - loanPrincipal, 0);
    const totalOfPayments = monthlyPI * months;

    function updatePercent(v: string) {
        setDownMode('percent');
        setDownPercent(v);
        const pct = Math.min(Math.max(toNumber(v), 0), 100);
        setDownAmount(String(Math.round((priceNum * pct) / 100)));
    }

    function updateAmount(v: string) {
        setDownMode('amount');
        setDownAmount(v);
        if (priceNum > 0) {
            const pct = (Math.min(toNumber(v), priceNum) / priceNum) * 100;
            setDownPercent(pct.toFixed(2).replace(/\.00$/, ''));
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                    <Calculator className="h-5 w-5" style={{ color: ACCENT }} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mortgage Calculator</h3>
                    <p className="text-sm text-gray-500">Estimate your monthly payment for this property.</p>
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                {/* Inputs */}
                <div className="lg:col-span-3">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className={labelClass}>Home Price</label>
                            <div className="relative">
                                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    min={0}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className={`${inputBase} pl-9 pr-4`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Down Payment ($)</label>
                            <div className="relative">
                                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    min={0}
                                    max={priceNum}
                                    value={downMode === 'amount' ? downAmount : String(downPaymentAmount)}
                                    onChange={(e) => updateAmount(e.target.value)}
                                    className={`${inputBase} pl-9 pr-4`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Down Payment (%)</label>
                            <div className="relative">
                                <Percent className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    value={downMode === 'percent' ? downPercent : downPaymentPercent.toFixed(2).replace(/\.00$/, '')}
                                    onChange={(e) => updatePercent(e.target.value)}
                                    className={`${inputBase} pl-9 pr-4`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Interest Rate (%)</label>
                            <div className="relative">
                                <Percent className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    min={0}
                                    max={30}
                                    step={0.125}
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    className={`${inputBase} pl-9 pr-4`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Loan Term</label>
                            <select
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                className={`${inputBase} px-4`}
                            >
                                <option value="30">30 Years</option>
                                <option value="20">20 Years</option>
                                <option value="15">15 Years</option>
                                <option value="10">10 Years</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Property Tax / yr</label>
                            <div className="relative">
                                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    min={0}
                                    value={tax}
                                    onChange={(e) => setTax(e.target.value)}
                                    className={`${inputBase} pl-9 pr-4`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Home Insurance / yr</label>
                            <div className="relative">
                                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    min={0}
                                    value={insurance}
                                    onChange={(e) => setInsurance(e.target.value)}
                                    className={`${inputBase} pl-9 pr-4`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>HOA / mo</label>
                            <div className="relative">
                                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    min={0}
                                    value={hoa}
                                    onChange={(e) => setHoa(e.target.value)}
                                    className={`${inputBase} pl-9 pr-4`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border-2 p-5" style={{ borderColor: ACCENT, backgroundColor: `${ACCENT}08` }}>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
                            Estimated Monthly Payment
                        </p>
                        <p className="mt-1 text-4xl font-bold text-gray-900">
                            ${fmtMoney(Math.round(totalMonthly))}
                            <span className="ml-1 text-sm font-medium text-gray-500">/mo</span>
                        </p>

                        <div className="mt-5 space-y-2 text-sm">
                            <Row label="Principal &amp; Interest" value={monthlyPI} />
                            {monthlyTax > 0 && <Row label="Property Tax" value={monthlyTax} />}
                            {monthlyInsurance > 0 && <Row label="Home Insurance" value={monthlyInsurance} />}
                            {monthlyHoa > 0 && <Row label="HOA" value={monthlyHoa} />}
                        </div>

                        <div className="mt-5 border-t border-black/5 pt-4 text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span>Loan Amount</span>
                                <span className="font-medium text-gray-900">${fmtMoney(loanPrincipal)}</span>
                            </div>
                            <div className="mt-1 flex justify-between">
                                <span>Total Interest Paid</span>
                                <span className="font-medium text-gray-900">${fmtMoney(Math.round(totalInterest))}</span>
                            </div>
                            <div className="mt-1 flex justify-between">
                                <span>Total of Payments</span>
                                <span className="font-medium text-gray-900">${fmtMoney(Math.round(totalOfPayments))}</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-3 flex items-start gap-1.5 text-xs text-gray-500">
                        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span>Estimate only. Actual rate, taxes, and insurance may vary. Contact us for a personalized quote.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600" dangerouslySetInnerHTML={{ __html: label }} />
            <span className="font-semibold text-gray-900">${fmtMoney(Math.round(value))}</span>
        </div>
    );
}
