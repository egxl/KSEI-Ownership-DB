import * as XLSX from 'xlsx';

export async function loadKSEIData() {
    const response = await fetch('/ksei_data.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    // Normalize and clean data
    const data = rawData.map(row => {
        const clean = {};
        for (const key of Object.keys(row)) {
            const normalizedKey = key.trim().toUpperCase().replace(/\s+/g, '_');
            let value = row[key];
            if (typeof value === 'string') {
                value = value.trim();
            }
            clean[normalizedKey] = value;
        }

        // Parse numeric fields
        const parseNum = (v) => {
            if (typeof v === 'number') return v;
            if (!v) return 0;
            return parseFloat(String(v).replace(/,/g, '').trim()) || 0;
        };

        return {
            date: clean.DATE || '',
            shareCode: clean.SHARE_CODE || '',
            issuerName: clean.ISSUER_NAME || '',
            investorName: clean.INVESTOR_NAME || '',
            investorType: clean.INVESTOR_TYPE || '',
            localForeign: clean.LOCAL_FOREIGN || '',
            nationality: clean.NATIONALITY || '',
            domicile: clean.DOMICILE || '',
            holdingsScripless: parseNum(clean.HOLDINGS_SCRIPLESS),
            holdingsScript: parseNum(clean.HOLDINGS_SCRIP),
            totalHoldingShares: parseNum(clean.TOTAL_HOLDING_SHARES),
            percentage: parseNum(clean.PERCENTAGE),
        };
    });

    return data.filter(d => d.shareCode);
}

// Group data by stock code
export function groupByStock(data) {
    const map = {};
    for (const row of data) {
        if (!map[row.shareCode]) {
            map[row.shareCode] = {
                code: row.shareCode,
                name: row.issuerName,
                shareholders: [],
            };
        }
        map[row.shareCode].shareholders.push(row);
    }
    // Sort shareholders by percentage descending
    for (const code of Object.keys(map)) {
        map[code].shareholders.sort((a, b) => b.percentage - a.percentage);
    }
    return map;
}

// Get unique stock list
export function getStockList(stockMap) {
    return Object.values(stockMap)
        .map(s => ({ code: s.code, name: s.name }))
        .sort((a, b) => a.code.localeCompare(b.code));
}

// Investor type mapping
export const INVESTOR_TYPES = {
    CP: 'Corporate',
    ID: 'Individual',
    IB: 'Investment Bank',
    IS: 'Insurance',
    SC: 'Securities Co.',
    MF: 'Mutual Fund',
    PF: 'Pension Fund',
    FD: 'Foundation',
    OT: 'Others',
};

export function getInvestorTypeLabel(code) {
    return INVESTOR_TYPES[code] || code || 'Unknown';
}

export function getLocalForeignLabel(code) {
    if (code === 'L') return 'Local';
    if (code === 'A') return 'Foreign';
    return code || '-';
}

// Determine controlling shareholders (>= 5%)
export function getControllingShareholders(shareholders) {
    return shareholders.filter(s => s.percentage >= 5);
}

// Format numbers
export function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
}

export function formatShares(num) {
    return num.toLocaleString('id-ID');
}

// Chart colors
export const CHART_COLORS = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe',
    '#43e97b', '#fa709a', '#fee140', '#a18cd1', '#fbc2eb',
    '#ff6b6b', '#ffa36b', '#48c6ef',
];

// Build cross-stock investor index: investorName -> [{ shareCode, issuerName, percentage, ... }]
export function buildInvestorIndex(data) {
    const index = {};
    for (const row of data) {
        const name = row.investorName.toUpperCase().trim();
        if (!name) continue;
        if (!index[name]) {
            index[name] = [];
        }
        index[name].push({
            shareCode: row.shareCode,
            issuerName: row.issuerName,
            percentage: row.percentage,
            totalHoldingShares: row.totalHoldingShares,
            investorType: row.investorType,
            localForeign: row.localForeign,
        });
    }
    // Sort each investor's holdings by percentage descending
    for (const name of Object.keys(index)) {
        index[name].sort((a, b) => b.percentage - a.percentage);
    }
    return index;
}

// Get cross-stock connections for shareholders of a given stock
export function getCrossStockLinks(shareholders, investorIndex, currentCode) {
    const results = [];
    for (const s of shareholders) {
        const key = s.investorName.toUpperCase().trim();
        const holdings = investorIndex[key];
        if (holdings && holdings.length > 1) {
            const otherStocks = holdings.filter(h => h.shareCode !== currentCode);
            results.push({
                investorName: s.investorName,
                investorType: s.investorType,
                percentageInCurrent: s.percentage,
                otherStocks,
            });
        }
    }
    // Sort by number of other stocks held (most connected first)
    results.sort((a, b) => b.otherStocks.length - a.otherStocks.length);
    return results;
}
