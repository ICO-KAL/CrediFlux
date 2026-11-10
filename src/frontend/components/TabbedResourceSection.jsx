import { useState } from 'react'
import ResourceTable, { Tabs } from './ResourceTable.jsx'
import { SectionHeader } from './ui.jsx'

export default function TabbedResourceSection({ tabs, initialTab, eyebrow, title }) {
  const [tab, setTab] = useState(initialTab)
  const current = tabs[tab]

  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <Tabs
        tabs={Object.entries(tabs).map(([id, value]) => ({ id, label: value.label }))}
        active={tab}
        onChange={setTab}
      />
      <ResourceTable
        key={tab}
        embedded
        load={current.load}
        columns={current.columns}
        filters={current.filters}
        createConfig={current.createConfig}
      />
    </div>
  )
}
