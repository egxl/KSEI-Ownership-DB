import { useState } from 'react';

export default function StockSearch({ stocks, onSelect, selectedCode }) {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const filtered = query.length > 0
        ? stocks.filter(
            s =>
                s.code.toLowerCase().includes(query.toLowerCase()) ||
                s.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 20)
        : [];

    const handleSelect = (code) => {
        onSelect(code);
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
                    placeholder="Search stock by code or company name..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => query && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                {showDropdown && filtered.length > 0 && (
                    <div className="search-results-dropdown">
                        {filtered.map((s) => (
                            <div
                                key={s.code}
                                className="search-result-item"
                                onMouseDown={() => handleSelect(s.code)}
                            >
                                <span className="search-result-code">{s.code}</span>
                                <span className="search-result-name">{s.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
