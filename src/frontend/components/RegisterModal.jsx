import { useEffect, useState } from 'react'

const fieldClassName =
  'h-[42px] w-full min-w-0 border-0 bg-transparent px-3 text-[11px] text-[#24352b] outline-none placeholder:text-[#b3bab5] focus-visible:outline-none'

const iconClassName =
  'size-[17px] shrink-0 stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]'

function RegisterModal({ onClose, onRegister, showToast, isSubmitting }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      showToast('Completa todos los campos para crear tu cuenta.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast('Ingresa un correo electrónico válido.')
      return
    }

    if (password.length < 8) {
      showToast('Tu contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden.')
      return
    }

    onRegister({ username: username.trim(), email, password })
  }

  return (
    <>
      <div className="absolute left-[23px] right-[23px] top-0 h-[3px] rounded-b-[5px] bg-[linear-gradient(90deg,#167a59,#a2d8b6)] sm:left-[42px] sm:right-[42px]" />
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-bold tracking-[1px] text-[#a0aaa3]">
          <span className="text-[#167a59]">01</span> / 01 · TU NUEVO COMIENZO
        </span>
        <button
          type="button"
          className="grid size-[31px] place-items-center rounded-full border border-[#e8ece8] bg-white text-[#78837b] transition hover:rotate-90 hover:border-[#c9ded0] hover:bg-[#f6faf7] hover:text-[#167a59]"
          onClick={onClose}
          aria-label="Cerrar registro"
        >
          <svg className="w-[14px] stroke-current [stroke-linecap:round] [stroke-width:1.7]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="mb-[19px] mt-4">
        <span className="inline-flex items-center gap-[9px] text-[9px] font-bold tracking-[1.6px] text-[#89958e]">
          HAZ ESPACIO PARA LO QUE SIGUE
        </span>
        <h2 className="mb-[5px] mt-2 font-[Aptos_Display,Segoe_UI,sans-serif] text-[32px] font-semibold tracking-[-1.6px]" id="register-title">
          Empecemos <em className="font-[Georgia,serif] font-normal text-[#167a59]">contigo.</em>
        </h2>
        <p className="text-[10px] text-[#89938d]">Crea tu cuenta y da el primer paso hacia tus metas.</p>
      </div>

      <form className="flex flex-col items-stretch" onSubmit={handleSubmit} noValidate>
        <label className="mb-1.5 text-[10px] font-bold text-[#35433c]" htmlFor="register-username">
          Nombre de usuario
        </label>
        <div className="mb-3 flex h-[42px] items-center rounded-[7px] border border-[#e6eae6] bg-white transition-[border-color,box-shadow,background] duration-200 focus-within:border-[#69a98a] focus-within:bg-[#fcfefc] focus-within:shadow-[0_0_0_3px_rgba(44,131,90,0.08)]">
          <span className="ml-[13px] grid size-[17px] shrink-0 place-items-center text-[#8d9991]" aria-hidden="true">
            <svg className={iconClassName} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </svg>
          </span>
          <input className={fieldClassName} id="register-username" name="username" type="text" autoComplete="username" maxLength={50} placeholder="Elige un nombre de usuario" value={username} onChange={(event) => setUsername(event.target.value)} aria-required="true" />
        </div>

        <label className="mb-1.5 text-[10px] font-bold text-[#35433c]" htmlFor="register-email">
          Correo electrónico
        </label>
        <div className="mb-3 flex h-[42px] items-center rounded-[7px] border border-[#e6eae6] bg-white transition-[border-color,box-shadow,background] duration-200 focus-within:border-[#69a98a] focus-within:bg-[#fcfefc] focus-within:shadow-[0_0_0_3px_rgba(44,131,90,0.08)]">
          <span className="ml-[13px] grid size-[17px] shrink-0 place-items-center text-[#8d9991]" aria-hidden="true">
            <svg className={iconClassName} viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="5" width="17" height="14" rx="3" />
              <path d="m5 7 7 5.5L19 7" />
            </svg>
          </span>
          <input className={fieldClassName} id="register-email" name="email" type="email" autoComplete="email" placeholder="nombre@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} aria-required="true" />
        </div>

        <label className="mb-1.5 text-[10px] font-bold text-[#35433c]" htmlFor="register-password">
          Contraseña
        </label>
        <div className="mb-3 flex h-[42px] items-center rounded-[7px] border border-[#e6eae6] bg-white transition-[border-color,box-shadow,background] duration-200 focus-within:border-[#69a98a] focus-within:bg-[#fcfefc] focus-within:shadow-[0_0_0_3px_rgba(44,131,90,0.08)]">
          <span className="ml-[13px] grid size-[17px] shrink-0 place-items-center text-[#8d9991]" aria-hidden="true">
            <svg className={iconClassName} viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="11" rx="3" />
              <path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" />
            </svg>
          </span>
          <input className={fieldClassName} id="register-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={password} onChange={(event) => setPassword(event.target.value)} aria-required="true" />
          <button type="button" className="shrink-0 px-3 py-1.5 text-[9px] font-semibold text-[#74877a] hover:text-[#167a59]" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword((visible) => !visible)}>
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <label className="mb-1.5 text-[10px] font-bold text-[#35433c]" htmlFor="register-confirm">
          Confirmar contraseña
        </label>
        <div className="mb-3 flex h-[42px] items-center rounded-[7px] border border-[#e6eae6] bg-white transition-[border-color,box-shadow,background] duration-200 focus-within:border-[#69a98a] focus-within:bg-[#fcfefc] focus-within:shadow-[0_0_0_3px_rgba(44,131,90,0.08)]">
          <span className="ml-[13px] grid size-[17px] shrink-0 place-items-center text-[#8d9991]" aria-hidden="true">
            <svg className={iconClassName} viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="11" rx="3" />
              <path d="M8 10V7a4 4 0 1 1 8 0v3M9 15l2 2 4-4" />
            </svg>
          </span>
          <input className={fieldClassName} id="register-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} aria-required="true" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative mt-[5px] flex min-h-[44px] w-full items-center justify-center rounded-[7px] border border-[#126b4d] bg-[linear-gradient(105deg,#167a59,#0d6649)] text-[11px] font-bold text-white shadow-[0_7px_17px_rgba(22,122,89,0.15)] transition hover:-translate-y-px hover:shadow-[0_10px_20px_rgba(22,122,89,0.21)] disabled:cursor-wait disabled:opacity-70"
        >
          <span>{isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta'}</span>
          <span className="absolute right-[15px] text-[15px] font-normal" aria-hidden="true">↗</span>
        </button>
      </form>

      <p className="mt-[15px] text-center text-[9px] text-[#929b95]">
        ¿Ya tienes una cuenta?{' '}
        <button
          type="button"
          className="font-bold text-[#167a59] hover:underline"
          onClick={onClose}
        >
          Volver al inicio de sesión
        </button>
      </p>
    </>
  )
}

export default RegisterModal
