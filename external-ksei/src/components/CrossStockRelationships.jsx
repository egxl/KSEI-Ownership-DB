import { useState } from 'react';
import { getInvestorTypeLabel, CHART_COLORS } from '../utils/dataLoader';

export default function CrossStockRelationships({ crossLinks, onStockClick }) {
    const [expandedIdx, setExpandedIdx] = useState(null);

    if (!crossLinks || crossLinks.length === 0) {
        return (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="icon">🔍</div>
                <p>No cross-stock shareholder connections found for this stock.</p>
            </div>
        );
    }

    return (
        <div className="cross-stock-container">
            {crossLinks.map((link, idx) => {
                const isExpanded = expandedIdx === idx;
                const displayStocks = isExpanded ? link.otherStocks : link.otherStocks.slice(0, 5);
                const hasMore = link.otherStocks.length > 5;

                return (
                    <div key={idx} className="cross-stock-card">
                        {/* Investor header */}
                        <div className="cross-stock-header">
                            <div className="cross-stock-investor">
                                <span className="cross-stock-avatar" style={{
                                    background: CHART_COLORS[idx % CHART_COLORS.length],
                                }}>
                                    {link.investorName.charAt(0)}
                                </span>
                                <div>
                                    <div className="cross-stock-investor-name">{link.investorName}</div>
                                    <div className="cross-stock-investor-meta">
                                        <span className={`type-badge ${getTypeBadgeClass(link.investorType)}`}>
                                            {getInvestorTypeLabel(link.investorType)}
                                        </span>
                                        <span className="cross-stock-pct-current">
                                            {link.percentageInCurrent.toFixed(2)}% in this stock
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="cross-stock-count">
                                <span className="cross-stock-count-num">{link.otherStocks.length}</span>
                                <span className="cross-stock-count-label">other stock{link.otherStocks.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* Connected stocks */}
                        <div className="cross-stock-links">
                            {displayStocks.map((stock, si) => (
                                <div
                                    key={si}
                                    className="cross-stock-link-item"
                                    onClick={() => onStockClick && onStockClick(stock.shareCode)}
                                    title={`Click to view ${stock.shareCode}`}
                                >
                                    <div className="cross-link-code">{stock.shareCode}</div>
                                    <div className="cross-link-name">{stock.issuerName}</div>
                                    <div className="cross-link-pct">
                                        <div className="pct-bar" style={{ flex: 1 }}>
                                            <div
                                                className="pct-bar-fill"
                                                style={{ width: `${Math.min(stock.percentage, 100)}%` }}
                                            />
                                        </div>
                                        <span className="pct-value" style={{ fontSize: 12 }}>
                                            {stock.percentage.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {hasMore && !isExpanded && (
                                <button
                                    className="cross-stock-expand-btn"
                                    onClick={() => setExpandedIdx(idx)}
                                >
                                    Show {link.otherStocks.length - 5} more stocks →
                                </button>
                            )}
                            {hasMore && isExpanded && (
                                <button
                                    className="cross-stock-expand-btn"
                                    onClick={() => setExpandedIdx(null)}
                                >
                                    Show less ↑
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function getTypeBadgeClass(type) {
    switch (type) {
        case 'CP': return 'type-corporate';
        case 'ID': return 'type-individual';
        case 'IB': case 'IS': case 'SC': case 'MF': case 'PF':
            return 'type-institution';
        default: return 'type-other';
    }
}
