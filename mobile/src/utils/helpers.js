/**
 * BharatFarm Utility Functions
 */

// Land conversion rates (from web config.js)
export const LAND_CONVERSIONS = {
  kathaPerBigha: 20,
  acrePerBigha: 0.62,
  kathaPerAcre: 32.26,
  bighaPerAcre: 1.61,
};

export function convertLand(value, from, to) {
  const acreValue =
    from === 'acre' ? value :
    from === 'bigha' ? value * LAND_CONVERSIONS.acrePerBigha :
    from === 'katha' ? value / LAND_CONVERSIONS.kathaPerAcre :
    value;

  if (to === 'acre') return acreValue;
  if (to === 'bigha') return acreValue * LAND_CONVERSIONS.bighaPerAcre;
  if (to === 'katha') return acreValue * LAND_CONVERSIONS.kathaPerAcre;
  return acreValue;
}

// Indian States list
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// Common crop categories
export const CROP_CATEGORIES = [
  { id: 'all', label: 'All', icon: '🌾' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { id: 'fruits', label: 'Fruits', icon: '🍎' },
  { id: 'grains', label: 'Grains & Pulses', icon: '🌾' },
  { id: 'seeds', label: 'Seeds', icon: '🌱' },
  { id: 'machinery', label: 'Machinery', icon: '🚜' },
];

// Format currency (INR)
export function formatINR(amount) {
  if (amount == null) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Format date relative
export function getRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN');
}

// Truncate text
export function truncate(text, maxLen = 100) {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}

// Generate greeting based on time
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Greeting in Hindi
export function getGreetingHi() {
  const hour = new Date().getHours();
  if (hour < 12) return 'सुप्रभात';
  if (hour < 17) return 'नमस्कार';
  return 'शुभ संध्या';
}
