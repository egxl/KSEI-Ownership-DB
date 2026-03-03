import { formatNumber, getInvestorTypeLabel } from '../utils/dataLoader';

export default function StatsCards({ selectedStock, shareholders }) {
    if (!selectedStock || !shareholders) return null;

    const totalShares = shareholders.reduce((sum, s) => sum + s.totalHoldingShares, 0);
    const localShareholders = shareholders.filter(s => s.localForeign === 'L');
    const foreignShareholders = shareholders.filter(s => s.localForeign === 'A');
    const localPct = localShareholders.reduce((sum, s) => sum + s.percentage, 0);
    const foreignPct = foreignShareholders.reduce((sum, s) => sum + s.percentage, 0);

    const corporateCount = shareholders.filter(s => s.investorType === 'CP').length;
    const individualCount = shareholders.filter(s => s.investorType === 'ID').length;
    const institutionalCount = shareholders.filter(s =>
        ['IB', 'IS', 'SC', 'MF', 'PF'].includes(s.investorType)
    ).length;

    const controllingPct = shareholders.length > 0 ? shareholders[0].percentage : 0;
    const controllingName = shareholders.length > 0 ? shareholders[0].investorName : '-';

    return (
        <div className="stats-row">
            <div className="stat-card">
                <div className="stat-label">Total Shareholders</div>
                <div className="stat-value">{shareholders.length}</div>
                <div className="stat-sub">
                    {corporateCount} Corporate · {individualCount} Individual · {institutionalCount} Institution
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-label">Controlling Shareholder</div>
                <div className="stat-value">{controllingPct.toFixed(1)}%</div>
                <div className="stat-sub" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {controllingName}
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-label">Local Ownership</div>
                <div className="stat-value" style={{ color: '#3b82f6' }}>{localPct.toFixed(1)}%</div>
                <div className="stat-sub">{localShareholders.length} shareholders</div>
            </div>

            <div className="stat-card">
                <div className="stat-label">Foreign Ownership</div>
                <div className="stat-value" style={{ color: '#f59e0b' }}>{foreignPct.toFixed(1)}%</div>
                <div className="stat-sub">{foreignShareholders.length} shareholders</div>
            </div>
        </div>
    );
}
