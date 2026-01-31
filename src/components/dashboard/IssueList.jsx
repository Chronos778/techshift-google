import { motion } from 'framer-motion'
import { Card, IssueCard } from '../ui'

export default function IssueList({ issues, onSelectIssue }) {
  if (issues.length === 0) {
    return (
      <Card hover={false} className="text-center py-12">
        <p className="text-slate-muted font-body">No issues found matching your filters.</p>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue, index) => (
        <motion.div
          key={issue.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <IssueCard
            issue={issue}
            onClick={() => onSelectIssue(issue)}
          />
        </motion.div>
      ))}
    </div>
  )
}
