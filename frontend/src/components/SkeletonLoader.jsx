import { motion } from 'framer-motion'

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count })

  const CardSkeleton = () => (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
          {/* Subtitle */}
          <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
        </div>
        {/* Action button */}
        <div className="h-10 w-24 bg-white/10 rounded animate-pulse" />
      </div>
      {/* Content lines */}
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse" />
      </div>
    </div>
  )

  const TableRowSkeleton = () => (
    <div className="flex items-center gap-4 p-4 border-b border-white/10">
      {/* Avatar/Icon */}
      <div className="h-10 w-10 bg-white/10 rounded-full animate-pulse" />
      {/* Content columns */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-white/10 rounded w-1/4 animate-pulse" />
      </div>
      <div className="h-4 bg-white/10 rounded w-20 animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
      <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
    </div>
  )

  const StatCardSkeleton = () => (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 bg-white/10 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-white/10 rounded w-20 animate-pulse" />
          <div className="h-6 bg-white/10 rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  )

  const ChartSkeleton = () => (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <div className="h-6 bg-white/10 rounded w-1/3 mb-6 animate-pulse" />
      <div className="h-64 bg-white/10 rounded animate-pulse" />
    </div>
  )

  const TextSkeleton = () => (
    <div className="space-y-2">
      <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse" />
    </div>
  )

  const skeletonTypes = {
    card: CardSkeleton,
    tableRow: TableRowSkeleton,
    statCard: StatCardSkeleton,
    chart: ChartSkeleton,
    text: TextSkeleton
  }

  const SkeletonComponent = skeletonTypes[type] || CardSkeleton

  return (
    <div className="space-y-4">
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonComponent />
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader
