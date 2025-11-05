import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignupForm } from '@/components/auth/signup-form'
import { Repeat } from 'lucide-react'

export default function SignupPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 sm:mb-8 md:mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <Repeat className="h-6 sm:h-8 w-6 sm:w-8 text-teal-400" />
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-400">SlotSwapper</span>
          </div>
          <p className="text-sm sm:text-base text-slate-300">Peer-to-Peer Time Slot Scheduling</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Create Account</CardTitle>
            <CardDescription className="text-sm sm:text-base">Join SlotSwapper and manage your time slots</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
