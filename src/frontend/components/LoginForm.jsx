import { useState } from 'react'

const fieldClassName =
  'h-[46px] w-full min-w-0 border-0 bg-transparent px-3 text-[11px] text-[#24352b] outline-none placeholder:text-[#b3bab5] focus-visible:outline-none'

const iconClassName =
  'size-[17px] shrink-0 stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]'

function LoginForm({
  email,
  rememberSession,
  isSubmitting,
  onEmailChange,
  onRememberChange,
  onLogin,
  onRegister,
  showToast,
}) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      showToast('Completa tu correo y contraseña para continuar.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast('Ingresa un correo electrónico válido.')
      return
    }

    onLogin({ email, password, remember: rememberSession })
  }

  return (
    <form className="flex flex-col items-stretch" onSubmit={handleSubmit} noValidate>
      <label className="mb-[7px] text-[10px] font-bold text-[#35433c]" htmlFor="login-email">
        Correo electrónico
      </label>
      <div className="mb-[17px] flex h-[46px] items-center rounded-[7px] border border-[#e6eae6] bg-white transition-[border-color,box-shadow,background] duration-200 focus-within:border-[#69a98a] focus-within:bg-[#fcfefc] focus-within:shadow-[0_0_0_3px_rgba(44,131,90,0.08)]">
        <span className="ml-[13px] grid size-[17px] shrink-0 place-items-center text-[#8d9991]" aria-hidden="true">
          <svg className={iconClassName} viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="5" width="17" height="14" rx="3" />
            <path d="m5 7 7 5.5L19 7" />
          </svg>
        </span>
        <input
          className={fieldClassName}
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          aria-required="true"
        />
      </div>

      <div className="flex items-baseline justify-between">
        <label className="mb-[7px] text-[10px] font-bold text-[#35433c]" htmlFor="login-password">
          Contraseña
        </label>
        <button
          type="button"
          className="mb-[7px] text-[9px] font-medium text-[#75867b] hover:text-[#167a59]"
          onClick={() => showToast('La recuperación de contraseña estará disponible cuando conectemos el backend.')}
        >
          ¿La olvidaste?
        </button>
      </div>
      <div className="mb-[17px] flex h-[46px] items-center rounded-[7px] border border-[#e6eae6] bg-white transition-[border-color,box-shadow,background] duration-200 focus-within:border-[#69a98a] focus-within:bg-[#fcfefc] focus-within:shadow-[0_0_0_3px_rgba(44,131,90,0.08)]">
        <span className="ml-[13px] grid size-[17px] shrink-0 place-items-center text-[#8d9991]" aria-hidden="true">
          <svg className={iconClassName} viewBox="0 0 24 24" fill="none">
            <rect x="4" y="10" width="16" height="11" rx="3" />
            <path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" />
          </svg>
        </span>
        <input
          className={fieldClassName}
          id="login-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-required="true"
        />
        <button
          type="button"
          className="shrink-0 px-3 py-1.5 text-[9px] font-semibold text-[#74877a] hover:text-[#167a59]"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          onClick={() => setShowPassword((visible) => !visible)}
        >
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <label className="mb-[21px] flex w-fit cursor-pointer items-center gap-2 text-[9px] text-[#79837d]">
        <input
          className="peer sr-only"
          type="checkbox"
          checked={rememberSession}
          onChange={(event) => onRememberChange(event.target.checked)}
        />
        <span className="grid size-[14px] place-items-center rounded border border-[#dce3dd] bg-white text-[9px] text-transparent transition peer-checked:border-[#167a59] peer-checked:bg-[#167a59] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#167a59]">
          ✓
        </span>
        <span>Mantener mi sesión iniciada</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="relative flex min-h-[46px] w-full items-center justify-center rounded-[7px] border border-[#126b4d] bg-[linear-gradient(105deg,#167a59,#0d6649)] text-[11px] font-bold text-white shadow-[0_7px_17px_rgba(22,122,89,0.15)] transition hover:-translate-y-px hover:bg-[linear-gradient(105deg,#18835f,#0e7251)] hover:shadow-[0_10px_20px_rgba(22,122,89,0.21)] disabled:cursor-wait disabled:opacity-70"
      >
        <span>{isSubmitting ? 'Conectando...' : 'Iniciar sesión'}</span>
        <span className="absolute right-[15px] text-[15px] font-normal" aria-hidden="true">↗</span>
      </button>

      <div className="my-[17px] flex items-center gap-[11px] text-[9px] text-[#a4aca7]">
        <span className="h-px flex-1 bg-[#e9ece9]" />
        o continúa
        <span className="h-px flex-1 bg-[#e9ece9]" />
      </div>

      <button
        type="button"
        className="flex min-h-[42px] w-full items-center justify-center gap-[9px] rounded-[7px] border border-[#e5e9e5] bg-white text-[10px] font-bold text-[#526158] transition hover:border-[#b9d5c3] hover:bg-[#f8fbf8]"
        onClick={onRegister}
      >
        Crear una cuenta nueva <span className="text-[15px] font-normal text-[#167a59]" aria-hidden="true">＋</span>
      </button>

      <p className="mt-[15px] text-center text-[8px] leading-[1.8] text-[#a1a9a4]">
        Al continuar, aceptas nuestros{' '}
        <button
          type="button"
          className="font-semibold text-[#61796a] hover:underline"
          onClick={() => showToast('Los términos estarán disponibles próximamente.')}
        >
          Términos de servicio
        </button>{' '}
        y{' '}
        <button
          type="button"
          className="font-semibold text-[#61796a] hover:underline"
          onClick={() => showToast('La política de privacidad estará disponible próximamente.')}
        >
          Política de privacidad
        </button>.
      </p>
    </form>
  )
}

export default LoginForm
