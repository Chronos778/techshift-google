const issueTypes = [
  { id: 'pothole', label: 'Pothole', icon: '🕳️', color: 'accent' },
  { id: 'streetlight', label: 'Broken Streetlight', icon: '💡', color: 'warning' },
  { id: 'graffiti', label: 'Graffiti', icon: '🎨', color: 'info' },
  { id: 'garbage', label: 'Garbage/Litter', icon: '🗑️', color: 'success' },
  { id: 'road-damage', label: 'Road Damage', icon: '🚧', color: 'danger' },
  { id: 'flooding', label: 'Flooding', icon: '🌊', color: 'info' },
  { id: 'tree', label: 'Fallen Tree', icon: '🌳', color: 'success' },
  { id: 'other', label: 'Other', icon: '📍', color: 'muted' },
]

export default function IssueTypeTag({ type, size = 'md' }) {
  const issueType = issueTypes.find((t) => t.id === type) || issueTypes[issueTypes.length - 1]

  const colorClasses = {
    accent: 'bg-accent/10 text-accent border-accent',
    warning: 'bg-warning/10 text-warning border-warning',
    info: 'bg-info/10 text-info border-info',
    success: 'bg-success/10 text-success border-success',
    danger: 'bg-danger/10 text-danger border-danger',
    muted: 'bg-slate-muted/10 text-slate-muted border-slate-muted',
  }

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border font-display font-medium uppercase tracking-wide
        ${colorClasses[issueType.color]} ${sizes[size]}
      `}
    >
      <span>{issueType.icon}</span>
      {issueType.label}
    </span>
  )
}

export { issueTypes }
