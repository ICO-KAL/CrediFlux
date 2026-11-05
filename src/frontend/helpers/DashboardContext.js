import { createContext, useContext } from 'react'

export const DashboardContext = createContext({ notify: () => {}, session: null })

export const useDashboard = () => useContext(DashboardContext)
