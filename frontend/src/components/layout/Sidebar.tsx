import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  CreditCard,
  Wallet,
  ShoppingCart,
  FileText,
  Package,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  ShoppingBag,
  BarChart3,
  Boxes,
  UserCog,
  Shield,
  Cog
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    id: 'students',
    label: 'Estudiantes',
    icon: Users,
    path: '/students'
  },
  {
    id: 'enrollment',
    label: 'Nueva Inscripción',
    icon: UserPlus,
    path: '/enrollment'
  },
  {
    id: 'courses',
    label: 'Cursos',
    icon: BookOpen,
    path: '/courses'
  },
  {
    id: 'payments',
    label: 'Pagos',
    icon: CreditCard,
    path: '/payments'
  },
  {
    id: 'cash',
    label: 'Caja',
    icon: Wallet,
    path: '/cash'
  },
  {
    id: 'purchases',
    label: 'Compras',
    icon: ShoppingCart,
    children: [
      {
        id: 'new-purchase',
        label: 'Nueva Compra',
        icon: ShoppingBag,
        path: '/purchases/new'
      },
      {
        id: 'purchase-list',
        label: 'Lista de Compras',
        icon: FileText,
        path: '/purchases/list'
      }
    ]
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: BarChart3,
    path: '/reports'
  },
  {
    id: 'inventory',
    label: 'Inventario',
    icon: Package,
    children: [
      {
        id: 'products',
        label: 'Productos',
        icon: Boxes,
        path: '/inventory/products'
      },
      {
        id: 'categories',
        label: 'Categorías',
        icon: FileText,
        path: '/inventory/categories'
      },
      {
        id: 'suppliers',
        label: 'Proveedores',
        icon: Users,
        path: '/inventory/suppliers'
      }
    ]
  },
  {
    id: 'administration',
    label: 'Administración',
    icon: Settings,
    children: [
      {
        id: 'users',
        label: 'Usuarios',
        icon: UserCog,
        path: '/admin/users'
      },
      {
        id: 'roles',
        label: 'Roles y Permisos',
        icon: Shield,
        path: '/admin/roles'
      },
      {
        id: 'settings',
        label: 'Configuración General',
        icon: Cog,
        path: '/admin/settings'
      }
    ]
  }
]

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const location = useLocation()

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId)

  const isActive = (path?: string) => {
    if (!path) return false
    return location.pathname === path
  }

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = isMenuExpanded(item.id)
    const isItemActive = isActive(item.path)

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleMenu(item.id)}
            className={`sidebar-item w-full text-left ${
              isItemActive ? 'active' : ''
            }`}
            style={{ paddingLeft: `${0.75 + level * 1.5}rem` }}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <Link
            to={item.path || '#'}
            className={`sidebar-item ${
              isItemActive ? 'active' : ''
            }`}
            style={{ paddingLeft: `${0.75 + level * 1.5}rem` }}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="sidebar-submenu">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Home className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            Vipe School
          </h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Sistema de Gestión Educativa
        </div>
      </div>
    </div>
  )
}

export default Sidebar