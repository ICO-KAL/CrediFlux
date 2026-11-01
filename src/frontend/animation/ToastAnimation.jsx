import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

function ToastAnimation({ toast, children }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed left-1/2 top-[22px] z-20"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -18, scale: 0.97, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98, x: '-50%' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ToastAnimation
