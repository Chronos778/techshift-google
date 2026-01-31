import { motion, AnimatePresence } from 'framer-motion'
import { Card, IssueCard } from '../ui'
import { List, AlertCircle } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function IssueList({ issues, onSelectIssue }) {
  if (issues.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-cream border-2 border-dashed border-cream-muted p-12 text-center"
      >
        <div className="w-16 h-16 bg-cream-dark mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-slate-muted" />
        </div>
        <p className="text-slate-muted font-display font-medium">No issues found</p>
        <p className="text-slate-muted/70 font-body text-sm mt-1">Try adjusting your filters</p>
      </motion.div>
    )
  }

  return (
    <div>
      {/* List header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <List className="w-4 h-4 text-blueprint" />
        <span className="font-display text-sm font-medium text-slate">
          {issues.length} issue{issues.length !== 1 ? 's' : ''} in list view
        </span>
      </motion.div>
      
      {/* Issues grid */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {issues.map((issue) => (
            <motion.div
              key={issue.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            >
              <IssueCard
                issue={issue}
                onClick={() => onSelectIssue(issue)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
