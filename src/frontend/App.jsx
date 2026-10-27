import { useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import RegisterModal from './components/RegisterModal.jsx'
import Toast from './components/Toast.jsx'
import GrowthChart from './animation/GrowthChart.jsx'
import Entrance from './animation/Entrance.jsx'
import RegisterModalAnimation from './animation/RegisterModalAnimation.jsx'
import ToastAnimation from './animation/ToastAnimation.jsx'

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [toast, setToast] = useState(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  const showToast = (message, type = 'error') => {
    setToast({ message, type, id: Date.now() })
  }

  const registerUser = (user) => {
    const email = user.email.trim().toLowerCase()

    if (users.some((existingUser) => existingUser.email === email)) {
      showToast('Este usuario ya existe. Intenta iniciar sesión.', 'error')
      return false
    }

    setUsers((currentUsers) => [...currentUsers, { ...user, email }])
    setLoginEmail(email)
    setIsRegisterOpen(false)
    setLoginSuccess(false)
    showToast('¡Tu cuenta fue creada correctamente!', 'success')
    return true
  }

  const loginUser = ({ email, password }) => {
    const user = users.find(
      (registeredUser) =>
        registeredUser.email === email.trim().toLowerCase() &&
        registeredUser.password === password,
    )

    if (!user) {
      showToast('Correo o contraseña incorrectos.', 'error')
      return
    }

    setLoginEmail(user.email)
    setLoginSuccess(true)
    showToast(`¡Qué gusto verte, ${user.name.split(' ')[0]}!`, 'success')
  }

  return (
    <main className="grid min-h-screen place-items-center overflow-x-hidden bg-[radial-gradient(ellipse_at_10%_12%,rgba(201,224,211,0.35),transparent_34%),#f3f5f1] p-0 md:p-5 lg:p-9">
      <section
        className="grid min-h-screen w-full grid-cols-1 overflow-hidden border-0 border-[rgba(26,58,45,0.08)] bg-white shadow-none md:min-h-[min(740px,calc(100vh-40px))] md:grid-cols-2 md:rounded-[22px] md:border md:shadow-[0_32px_90px_rgba(35,57,45,0.13),0_3px_12px_rgba(35,57,45,0.04)] xl:min-h-[min(760px,calc(100vh-72px))] xl:max-w-[1190px]"
        aria-label="Acceso a CrediFlux"
      >
        <aside className="relative isolate flex min-h-[320px] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_100%_5%,rgba(78,158,123,0.24),transparent_33%),linear-gradient(145deg,#123f33_0%,#0e342b_50%,#092b24_100%)] px-[26px] pb-[19px] pt-[25px] text-white md:min-h-[700px] md:px-[34px] md:pb-[25px] md:pt-[34px] lg:px-12 lg:pb-[30px] lg:pt-[42px]">
          <div className="pointer-events-none absolute -left-[280px] top-[135px] -z-10 size-[580px] rounded-full border border-[rgba(183,243,221,0.09)]" />
          <div className="pointer-events-none absolute -bottom-[155px] -right-[310px] -z-10 size-[490px] rounded-full border border-[rgba(183,243,221,0.09)]" />

          <div className="flex w-fit items-center gap-[11px] font-[Aptos_Display,Segoe_UI,sans-serif] text-[19px] font-extrabold tracking-[-0.8px]">
            <span className="grid size-[34px] place-items-center rounded-[11px] border border-[rgba(182,243,221,0.4)] bg-[rgba(182,243,221,0.1)]">
              <svg className="w-6 stroke-[#b6f3dd] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M7 22.5 13.5 9l4.25 9 2.5-5 4.75 9.5H7Z" />
                <path d="M8 25h16" />
              </svg>
            </span>
            <span>CrediFlux</span>
          </div>

          <Entrance className="mt-[37px] max-w-[390px] md:mt-[58px] lg:mt-[68px] lg:max-w-[440px]" delay={0.08}>
            <span className="inline-flex items-center gap-[9px] text-[9px] font-bold tracking-[1.6px] text-[#b3d2c3]">
              <span className="size-[6px] rounded-full bg-[#89d8b8] shadow-[0_0_11px_rgba(137,216,184,0.8)]" />
              FINANZAS CON PROPÓSITO
            </span>
            <h1 className="mb-2 mt-3 max-w-[380px] font-[Aptos_Display,Segoe_UI,sans-serif] text-[clamp(35px,9vw,48px)] font-semibold leading-[1.13] tracking-[-2.6px] md:mb-[13px] md:mt-[17px] md:max-w-[420px] md:text-[clamp(42px,4.2vw,57px)]">
              Tu próximo paso empieza <em className="font-[Georgia,serif] font-normal text-[#b6f3dd]">aquí.</em>
            </h1>
            <p className="max-w-[330px] text-[11px] leading-[1.8] text-[rgba(237,247,241,0.67)] md:text-[13px]">
              Una forma más clara y sencilla de acercarte a tus metas
              financieras.
            </p>
          </Entrance>

          <Entrance
            className="my-auto mb-[22px] mt-auto hidden min-h-[330px] w-full max-w-[440px] rounded-[16px] border border-[rgba(203,242,222,0.26)] bg-[linear-gradient(130deg,rgba(246,255,249,0.16),rgba(191,224,205,0.055))] px-5 pb-[17px] pt-5 shadow-[0_26px_58px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl md:block lg:px-[22px]"
            delay={0.25}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-[7px] text-[10px] font-semibold text-[rgba(239,251,243,0.88)]">
                <span className="size-[7px] rotate-45 rounded-[2px_6px_2px_6px] bg-[#b6f3dd]" />
                CrediFlux
              </span>
              <span className="h-[19px] w-[25px] rounded-[5px] border border-[rgba(215,246,228,0.42)] bg-[linear-gradient(90deg,transparent_47%,rgba(215,246,228,0.32)_49%,transparent_52%)]" />
            </div>
            <p className="mb-[5px] mt-[25px] text-[8px] font-semibold tracking-[1.3px] text-[rgba(218,237,223,0.62)]">
              TU TRANQUILIDAD, EN MOVIMIENTO
            </p>
            <GrowthChart />
            <div className="flex items-center justify-between border-t border-[rgba(222,246,229,0.12)] pt-[10px] text-[9px] text-[rgba(233,246,236,0.62)]">
              <span>Pequeños pasos.</span>
              <span className="text-[#b8edcf]">Grandes posibilidades. ↗</span>
            </div>
          </Entrance>

          <div className="mt-auto flex items-center justify-between text-[8px] font-semibold tracking-[1.1px] text-[rgba(218,237,223,0.44)]">
            <span>FINANZAS QUE FLUYEN CONTIGO</span>
            <span>01 — 03</span>
          </div>
        </aside>

        <section className="flex min-h-[570px] flex-col bg-white px-[26px] pb-[19px] pt-6 md:min-h-0 md:px-[34px] md:pb-6 md:pt-[30px] lg:px-12 lg:pb-[26px] lg:pt-9">
          <div className="flex items-center justify-between gap-3 md:gap-2">
            <span className="inline-flex items-center gap-[7px] text-[8px] font-bold tracking-[1.2px] text-[#89918c]">
              <span className="size-[6px] rounded-full bg-[#4aa77e] shadow-[0_0_0_3px_#e9f5ee]" />
              ACCESO SEGURO
            </span>
            <span className="text-right text-[10px] text-[#929b95]">
              ¿Primera vez aquí?{' '}
              <button
                type="button"
                className="font-bold text-[#167a59] hover:text-[#0d4f3a] hover:underline"
                onClick={() => setIsRegisterOpen(true)}
              >
                Crear cuenta
              </button>
            </span>
          </div>

          <Entrance className="my-auto w-full self-center py-[48px] md:max-w-[385px] md:py-[34px] lg:py-[34px]" delay={0.12}>
            <div className="relative mb-[27px]">
              <svg className="absolute -right-2 -top-6 size-10 stroke-[#dcefe4] [stroke-linecap:round] [stroke-width:1.6]" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M20 3v34M3 20h34M8 8l24 24M32 8 8 32" />
                <circle cx="20" cy="20" r="3" />
              </svg>
              <span className="inline-flex items-center gap-[9px] text-[9px] font-bold tracking-[1.6px] text-[#89958e]">
                BIENVENIDO DE VUELTA
              </span>
              <h2 className="mb-2 mt-3 font-[Aptos_Display,Segoe_UI,sans-serif] text-[39px] font-semibold leading-[1.16] tracking-[-2.6px] md:text-[43px]">
                Nos alegra<br />tenerte <em className="font-[Georgia,serif] font-normal text-[#167a59]">de vuelta.</em>
              </h2>
              <p className="text-[11px] text-[#929a95]">Ingresa tus datos para continuar tu camino.</p>
            </div>

            {loginSuccess && (
              <div className="-mt-[13px] mb-[17px] flex items-center gap-2 rounded-[7px] border border-[#d5ecde] bg-[#f1faf4] px-3 py-[10px] text-[10px] leading-[1.5] text-[#286347]" role="status">
                <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#489d70] text-[11px] text-white">✓</span>
                Sesión iniciada correctamente. Tu acceso está listo.
              </div>
            )}

            <LoginForm
              email={loginEmail}
              onEmailChange={setLoginEmail}
              onLogin={loginUser}
              onRegister={() => setIsRegisterOpen(true)}
              showToast={showToast}
            />
          </Entrance>

          <div className="flex items-center justify-between text-[8px] font-medium tracking-[0.2px] text-[#a2aaa5]">
            <span>© 2026 CrediFlux</span>
            <span>Confianza en cada decisión <span className="ml-1 text-[#7aaa8c]">✳</span></span>
          </div>
        </section>
      </section>

      <RegisterModalAnimation
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      >
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onRegister={registerUser}
          showToast={showToast}
        />
      </RegisterModalAnimation>

      <ToastAnimation toast={toast}>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </ToastAnimation>
    </main>
  )
}

export default App
