const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatINR = (value) => inr.format(Math.round(value || 0));

const toDate = (iso) => new Date(`${iso}T00:00:00Z`);

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const addDays = (iso, days) => {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const formatDate = (iso) =>
  toDate(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const formatRange = (startIso, nights) =>
  `${formatDate(startIso)} - ${formatDate(addDays(startIso, nights))}`;
