import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

function RegisterModalAnimation({ open, onClose, children }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-10 grid place-items-center overflow-y-auto bg-[rgba(10,29,22,0.58)] p-5 backdrop-blur-[7px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            className="relative max-h-[min(92vh,850px)] w-full max-w-[488px] overflow-y-auto rounded-[17px] border border-[rgba(239,245,240,0.9)] bg-white px-[23px] pb-[22px] pt-6 shadow-[0_28px_100px_rgba(0,0,0,0.25)] sm:px-[42px] sm:pb-[26px] sm:pt-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-title"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 40, scale: 0.94, rotateX: 4 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96, rotateX: -2 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 280, damping: 25, mass: 0.8 }
            }
          >
            {children}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RegisterModalAnimation
