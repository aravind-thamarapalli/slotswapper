import { Repeat, LogOut, User as UserIcon, Bell, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSocket } from '@/hooks/useSocket'
import { useState, useRef, useEffect } from 'react'

export function AppHeader({ onMenuToggle, isMobileMenuOpen }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const { notifications } = useSocket()
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleNotificationClick = () => {
    navigate('/requests')
    setShowNotifications(false)
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-slate-700 px-4 backdrop-blur-sm sm:px-6 shadow-lg shadow-slate-900/50">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - Visible on smaller screens */}
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden flex items-center text-slate-300 hover:bg-slate-700/50"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        )}
        
        <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/20">
          <Repeat className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">SlotSwapper</h1>
          <span className="text-xs text-slate-500 font-medium">Swap your schedule</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Notifications Bell */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center gap-2 hover:bg-slate-700/50 text-slate-300 transition-all duration-200 relative"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-700">
                  {notifications.slice(0, 5).map((notification, idx) => (
                    <div 
                      key={idx} 
                      onClick={handleNotificationClick}
                      className="p-3 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-100 break-words">
                            {notification.requesterName && !notification.acceptedBy && !notification.declinedBy && !notification.cancelledBy ? (
                              <>
                                <span className="text-teal-400">{notification.requesterName}</span> wants to swap their{' '}
                                <span className="text-slate-300">"{notification.mySlot?.title}"</span> for your{' '}
                                <span className="text-slate-300">"{notification.theirSlot?.title}"</span>
                              </>
                            ) : notification.acceptedBy ? (
                              <>
                                <span className="text-green-400">✓ Accepted!</span> {notification.acceptedBy} accepted your swap
                              </>
                            ) : notification.declinedBy ? (
                              <>
                                <span className="text-red-400">✗ Declined</span> {notification.declinedBy} declined your swap
                              </>
                            ) : notification.cancelledBy ? (
                              <>
                                <span className="text-orange-400">⊘ Cancelled</span> {notification.cancelledBy} cancelled the swap
                              </>
                            ) : (
                              'New notification'
                            )}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">Click to view</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length > 5 && (
                    <div className="p-2 text-center text-xs text-slate-400">
                      +{notifications.length - 5} more notifications
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
          <UserIcon className="h-4 w-4 text-teal-400" />
          <span className="text-sm font-medium text-slate-200">{user.name || 'User'}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 hover:bg-red-900/20 hover:text-red-400 text-slate-300 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
