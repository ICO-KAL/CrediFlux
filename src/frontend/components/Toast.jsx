import { useEffect } from 'react'

function Toast({ message, type, onClose }) {
  const isSuccess = type === 'success'

  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 4200)
    return () => window.clearTimeout(timeoutId)
  }, [onClose])

  return (
    <div
      className={`flex min-h-[54px] w-[min(calc(100%-32px),440px)] items-center gap-[11px] rounded-[10px] border ${isSuccess ? 'border-[#d4eadd] text-[#285d40]' : 'border-[#f1d7d4] text-[#663b37]'} bg-white px-[14px] py-[11px] text-[11px] leading-[1.5] shadow-[0_13px_42px_rgba(31,51,40,0.17)]`}
      role={isSuccess ? 'status' : 'alert'}
      aria-live={isSuccess ? 'polite' : 'assertive'}
    >
      <span
        className={`grid size-[25px] shrink-0 place-items-center rounded-full text-[12px] font-bold text-white ${isSuccess ? 'bg-[#42976c]' : 'bg-[#c66a5e]'}`}
        aria-hidden="true"
      >
        {isSuccess ? '✓' : '!'}
      </span>
      <span>{message}</span>
      <button
        type="button"
        className="ml-auto grid size-[25px] shrink-0 place-items-center rounded-full text-[20px] leading-none text-[#78837b] hover:bg-[#f1f4f1]"
        aria-label="Cerrar aviso"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  )
}

export default Toast
