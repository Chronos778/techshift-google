const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-warning/10 text-warning border-warning',
    dot: 'bg-warning',
  },
  open: {
    label: 'Open',
    color: 'bg-info/10 text-info border-info',
    dot: 'bg-info',
  },
  verified: {
    label: 'Verified',
    color: 'bg-success/10 text-success border-success',
    dot: 'bg-success',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-info/10 text-info border-info',
    dot: 'bg-info',
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-success/10 text-success border-success',
    dot: 'bg-success',
  },
  flagged: {
    label: 'Flagged',
    color: 'bg-warning/10 text-warning border-warning',
    dot: 'bg-warning',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-danger/10 text-danger border-danger',
    dot: 'bg-danger',
  },
}

export default function StatusBadge({ status, size = 'md', showDot = true }) {
  const config = statusConfig[status] || statusConfig.pending
  
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border-2 font-display font-semibold uppercase tracking-wide
        ${config.color} ${sizes[size]}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} pulse-dot`} />
      )}
      {config.label}
    </span>
  )
}
