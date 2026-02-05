export function roundToFiveCents(value) {
  const num = Number(value) || 0;
  return Math.round(num * 20) / 20;
}

export function formatBAM(value) {
  const rounded = roundToFiveCents(value);
  const formatted = rounded.toFixed(2).replace('.', ',');
  return `${formatted} BAM`;
}

if (typeof window !== 'undefined') {
  window.roundToFiveCents = roundToFiveCents;
  window.formatBAM = formatBAM;
}
