import { useLocation, useNavigate, Link } from 'react-router-dom'
import { LayoutGrid, ArrowRightLeft, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/swap', label: 'Swap Slots', icon: ArrowRightLeft },
  { href: '/requests', label: 'Requests', icon: Bell },
]

export function SidebarNav({ onClose }) {
  const location = useLocation()
  const pathname = location.pathname

  const handleNavClick = () => {
    // Close mobile menu when a nav item is clicked
    onClose?.()
  }

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname.startsWith(item.href)
        return (
          <Link key={item.href} to={item.href} onClick={handleNavClick}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
