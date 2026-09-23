const styles = {
  LOW: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border border-amber-200',
  HIGH: 'bg-red-100 text-red-700 border border-red-200',
};

export default function RiskBadge({ level = 'LOW', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[level] || styles.LOW} ${className}`}
    >
      {level}
    </span>
  );
}
