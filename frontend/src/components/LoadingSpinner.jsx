import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-white/20 border-t-gold rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-graytext text-sm">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
