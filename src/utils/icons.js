export const CATEGORY_ICONS = {
    'Food': '🍞',
    'Water': '💧',
    'Medical': '💊',
    'Shelter': '⛺',
    'Power': '🔋',
    'Transport': '🚗',
    'Other': '📦'
};

export const getIcon = (category) => CATEGORY_ICONS[category] || '📦';
