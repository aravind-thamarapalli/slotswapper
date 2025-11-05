import { useState, useEffect } from 'react'
import { AppHeader } from './header'
import { SidebarNav } from './sidebar-nav'

export function AppLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when window is resized to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader 
        onMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Always visible on lg and above */}
        <aside className="hidden w-64 border-r bg-gradient-to-b from-slate-900/95 via-slate-900/92 to-slate-800/90 border-slate-700/80 lg:block overflow-y-auto backdrop-blur-sm shadow-lg shadow-slate-950/30">
          <SidebarNav />
        </aside>

        {/* Mobile Sidebar - Visible when menu is open */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <aside className="absolute left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900/95 via-slate-900/92 to-slate-800/90 border-r border-slate-700/80 overflow-y-auto z-50 animate-in slide-in-from-left-3 duration-300 backdrop-blur-md shadow-2xl shadow-slate-950/50">
              <SidebarNav onClose={() => setIsMobileMenuOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
