import { getInvestorTypeLabel, getLocalForeignLabel, formatShares } from '../utils/dataLoader';

function getTypeBadgeClass(type) {
    switch (type) {
        case 'CP': return 'type-corporate';
        case 'ID': return 'type-individual';
        case 'IB': case 'IS': case 'SC': case 'MF': case 'PF':
            return 'type-institution';
        default: return 'type-other';
    }
}

export default function ShareholderTable({ shareholders }) {
    if (!shareholders || shareholders.length === 0) return null;

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Investor Name</th>
                        <th>Type</th>
                        <th>L/F</th>
                        <th>Nationality</th>
                        <th>Total Shares</th>
                        <th style={{ minWidth: '180px' }}>Ownership %</th>
                    </tr>
                </thead>
                <tbody>
                    {shareholders.map((s, i) => (
                        <tr key={i}>
                            <td style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px' }}>
                                {i + 1}
                            </td>
                            <td className="investor-name">{s.investorName}</td>
                            <td>
                                <span className={`type-badge ${getTypeBadgeClass(s.investorType)}`}>
                                    {getInvestorTypeLabel(s.investorType)}
                                </span>
                            </td>
                            <td>
                                {s.localForeign && (
                                    <span className={`lf-badge ${s.localForeign === 'L' ? 'lf-local' : 'lf-foreign'}`}>
                                        {getLocalForeignLabel(s.localForeign)}
                                    </span>
                                )}
                            </td>
                            <td style={{ fontSize: '12px' }}>{s.nationality || s.domicile || '-'}</td>
                            <td style={{ fontVariantNumeric: 'tabular-nums', fontSize: '12px' }}>
                                {formatShares(s.totalHoldingShares)}
                            </td>
                            <td className="pct-bar-cell">
                                <div className="pct-bar-wrapper">
                                    <div className="pct-bar">
                                        <div
                                            className="pct-bar-fill"
                                            style={{ width: `${Math.min(s.percentage, 100)}%` }}
                                        />
                                    </div>
                                    <span className="pct-value">{s.percentage.toFixed(2)}%</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
