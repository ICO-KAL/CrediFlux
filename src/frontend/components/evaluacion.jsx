import { useState } from 'react'
import ResourceTable, { Tabs } from './ResourceTable.jsx'
import { SectionHeader} from './ui.jsx'
import {listDecisiones, listEvaluaciones} from '../services/dashboardApi.js'

import {evaluacionConfig, decisionConfig, evaluacionColumns, decisionColumns } from '../helpers/evaluacion.jsx'

export default function Evaluacion() {
  const [tab, setTab] = useState('evaluaciones')

  return (
    <div>
      <SectionHeader eyebrow="RIESGO" title="Evaluación y decisión" />
      <Tabs
        tabs={[{ id: 'evaluaciones', label: 'Evaluaciones' }, { id: 'decisiones', label: 'Decisiones' }]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'evaluaciones' ? (
        <ResourceTable key="evaluaciones" embedded load={listEvaluaciones} columns={evaluacionColumns} createConfig={evaluacionConfig} />
      ) : (
        <ResourceTable key="decisiones" embedded load={listDecisiones} columns={decisionColumns} createConfig={decisionConfig} />
      )}
    </div>
  )
}
