import { useState, useMemo } from 'react';

export default function StockSearch({ stocks, investorIndex, onSelectStock, onSelectShareholder, selectedCode }) {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Build shareholder list from investorIndex for search
    const shareholderList = useMemo(() => {
        if (!investorIndex) return [];
        return Object.entries(investorIndex).map(([name, holdings]) => ({
            name,
            stockCount: holdings.length,
            topStock: holdings[0]?.shareCode || '',
            topPct: holdings[0]?.percentage || 0,
        }));
    }, [investorIndex]);

    const lowerQ = query.toLowerCase();

    const filteredStocks = query.length > 0
        ? stocks.filter(
            s =>
                s.code.toLowerCase().includes(lowerQ) ||
                s.name.toLowerCase().includes(lowerQ)
        ).slice(0, 10)
        : [];

    const filteredShareholders = query.length >= 2
        ? shareholderList.filter(
            s => s.name.toLowerCase().includes(lowerQ)
        ).slice(0, 10)
        : [];

    const hasResults = filteredStocks.length > 0 || filteredShareholders.length > 0;

    const handleSelectStock = (code) => {
        onSelectStock(code);
        setQuery('');
        setShowDropdown(false);
    };

    const handleSelectShareholder = (name) => {
        if (onSelectShareholder) {
            onSelectShareholder(name);
        }
        setQuery('');
        setShowDropdown(false);
    };

    return (
        <div className="search-container">
            <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search stocks or shareholders..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => query && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                {showDropdown && hasResults && (
                    <div className="search-results-dropdown">
                        {/* Stock Results */}
                        {filteredStocks.length > 0 && (
                            <>
                                <div className="search-group-label">
                                    <span className="search-group-icon">📊</span> Stocks
                                </div>
                                {filteredStocks.map((s) => (
                                    <div
                                        key={`stock-${s.code}`}
                                        className="search-result-item"
                                        onMouseDown={() => handleSelectStock(s.code)}
                                    >
                                        <span className="search-result-code">{s.code}</span>
                                        <span className="search-result-name">{s.name}</span>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Shareholder Results */}
                        {filteredShareholders.length > 0 && (
                            <>
                                <div className="search-group-label">
                                    <span className="search-group-icon">👤</span> Shareholders
                                </div>
                                {filteredShareholders.map((s) => (
                                    <div
                                        key={`sh-${s.name}`}
                                        className="search-result-item search-result-shareholder"
                                        onMouseDown={() => handleSelectShareholder(s.name)}
                                    >
                                        <span className="search-result-avatar">
                                            {s.name.charAt(0)}
                                        </span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="search-result-sh-name">{s.name}</div>
                                            <div className="search-result-sh-meta">
                                                Holds {s.stockCount} stock{s.stockCount > 1 ? 's' : ''} · Top: {s.topStock} ({s.topPct.toFixed(2)}%)
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
