import { motion } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const EmptyState = ({ 
  type = 'general',
  title,
  description,
  actionText,
  onAction,
  icon: CustomIcon
}) => {
  const emptyStates = {
    general: {
      icon: InboxIcon,
      title: 'Nothing to see here',
      description: 'There is no data to display at the moment.'
    },
    search: {
      icon: MagnifyingGlassIcon,
      title: 'No results found',
      description: 'Try adjusting your search or filters to find what you\'re looking for.'
    },
    events: {
      icon: CalendarIcon,
      title: 'No events yet',
      description: 'Start by creating your first event to get your business rolling!'
    },
    employees: {
      icon: UserGroupIcon,
      title: 'No team members',
      description: 'Invite your first employee to start building your event team.'
    },
    documents: {
      icon: DocumentTextIcon,
      title: 'No documents',
      description: 'Upload or create your first document to get started.'
    },
    error: {
      icon: ExclamationTriangleIcon,
      title: 'Something went wrong',
      description: 'We encountered an error while loading this data. Please try again.'
    }
  }

  const state = emptyStates[type] || emptyStates.general
  const Icon = CustomIcon || state.icon
  const displayTitle = title || state.title
  const displayDescription = description || state.description

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-12 border border-white/10 text-center"
    >
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className={`p-4 rounded-full mb-6 ${
          type === 'error' 
            ? 'bg-red-500/20' 
            : 'bg-white/10'
        }`}>
          <Icon className={`h-12 w-12 ${
            type === 'error' 
              ? 'text-red-400' 
              : 'text-graytext'
          }`} />
        </div>

        <h3 className="font-clash font-bold text-2xl mb-2">{displayTitle}</h3>
        <p className="text-graytext mb-6">{displayDescription}</p>

        {onAction && actionText && (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-gold hover:bg-gold/90 text-black font-semibold rounded-md transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default EmptyState
