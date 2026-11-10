import TabbedResourceSection from './TabbedResourceSection.jsx'
import { Badge, formatDate } from './ui.jsx'
import { createPermiso, createRol, listPermisos, listRoles, listUsuarios } from '../services/dashboardApi.js'

const fecha = { key: 'createdAt', label: 'Creado', render: (row) => formatDate(row.createdAt) }

const tabs = {
  usuarios: {
    label: 'Usuarios',
    load: listUsuarios,
    filters: [{ key: 'activo', label: 'Cuenta', options: [{ value: 'true', label: 'activos' }, { value: 'false', label: 'inactivos' }] }],
    columns: [
      { key: 'username', label: 'Usuario', render: (row) => <span className="font-semibold text-white">{row.username}</span> },
      { key: 'email', label: 'Correo' },
      {
        key: 'roles',
        label: 'Roles',
        render: (row) => (
          <div className="flex flex-wrap gap-1.5">
            {(row.roles || []).length === 0 && <span className="text-[#6f8f82]">Sin roles</span>}
            {(row.roles || []).map((rol) => <Badge key={rol._id || rol} value={rol.nombre || 'rol'} tone="info" />)}
          </div>
        ),
      },
      { key: 'activo', label: 'Estado', render: (row) => <Badge value={row.activo ? 'activo' : 'inactivo'} tone={row.activo ? 'good' : 'bad'} /> },
      fecha,
    ],
  },
  roles: {
    label: 'Roles',
    load: listRoles,
    createConfig: {
      label: 'Nuevo rol',
      title: 'Crear rol',
      successMessage: 'Rol creado correctamente.',
      submit: createRol,
      fields: [
        { name: 'nombre', label: 'Nombre', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'textarea' },
      ],
    },
    columns: [
      { key: 'nombre', label: 'Rol', render: (row) => <span className="font-semibold text-white">{row.nombre}</span> },
      { key: 'descripcion', label: 'Descripción' },
      { key: 'permisos', label: 'Permisos', align: 'right', render: (row) => (row.permisos || []).length },
      fecha,
    ],
  },
  permisos: {
    label: 'Permisos',
    load: listPermisos,
    createConfig: {
      label: 'Nuevo permiso',
      title: 'Crear permiso',
      successMessage: 'Permiso creado correctamente.',
      submit: createPermiso,
      fields: [
        { name: 'modulo', label: 'Módulo', required: true, placeholder: 'clientes' },
        { name: 'nombreAccion', label: 'Acción', required: true, placeholder: 'crear' },
      ],
    },
    columns: [
      { key: 'modulo', label: 'Módulo', render: (row) => <Badge value={row.modulo} tone="info" /> },
      { key: 'nombreAccion', label: 'Acción', render: (row) => <span className="font-semibold text-white">{row.nombreAccion}</span> },
      fecha,
    ],
  },
}

export default function Administracion() {
  return (
    <TabbedResourceSection tabs={tabs} initialTab="usuarios" eyebrow="SEGURIDAD" title="Administración" />
  )
}
