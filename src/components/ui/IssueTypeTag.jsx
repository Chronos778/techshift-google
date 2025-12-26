const issueTypes = [
  { id: 'pothole', label: 'Pothole', icon: '🕳️', color: 'orange' },
  { id: 'streetlight', label: 'Broken Streetlight', icon: '💡', color: 'yellow' },
  { id: 'graffiti', label: 'Graffiti', icon: '🎨', color: 'purple' },
  { id: 'garbage', label: 'Garbage/Litter', icon: '🗑️', color: 'green' },
  { id: 'road-damage', label: 'Road Damage', icon: '🚧', color: 'red' },
  { id: 'flooding', label: 'Flooding', icon: '🌊', color: 'blue' },
  { id: 'tree', label: 'Fallen Tree', icon: '🌳', color: 'green' },
  { id: 'other', label: 'Other', icon: '📍', color: 'gray' },
]

export default function IssueTypeTag({ type, size = 'md' }) {
  const issueType = issueTypes.find((t) => t.id === type) || issueTypes[issueTypes.length - 1]

  const colorClasses = {
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${colorClasses[issueType.color]} ${sizes[size]}
      `}
    >
      <span>{issueType.icon}</span>
      {issueType.label}
    </span>
  )
}

export { issueTypes }
