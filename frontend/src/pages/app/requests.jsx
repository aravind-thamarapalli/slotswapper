import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/shared/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/helpers'
import { useSocket } from '@/hooks/useSocket'
import axios from 'axios'

export default function RequestsPage() {
  const navigate = useNavigate()
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { refreshTrigger } = useSocket()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchSwapRequests()
  }, [navigate, refreshTrigger])

  const fetchSwapRequests = async () => {
    try {
      setLoading(true)
      
      const response = await axios.get('/api/swaps/requests')
      
      setIncomingRequests(response.data.incoming || [])
      setOutgoingRequests(response.data.outgoing || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch swap requests:', err)
      setError('Failed to load swap requests')
      setIncomingRequests([])
      setOutgoingRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`/api/swaps/request/${requestId}/respond`, {
        accept: true,
      })
      fetchSwapRequests()
    } catch (err) {
      console.error('Failed to accept request:', err)
      alert('Failed to accept request')
    }
  }

  const handleReject = async (requestId) => {
    try {
      await axios.post(`/api/swaps/request/${requestId}/respond`, {
        accept: false,
      })
      fetchSwapRequests()
    } catch (err) {
      console.error('Failed to reject request:', err)
      alert('Failed to reject request')
    }
  }

  return (
    <AppLayout>
      <div className="container px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 sm:mb-6 md:mb-8">Swap Requests</h1>

        {loading && (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <p className="text-muted-foreground">Loading swap requests...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-900/30 p-3 sm:p-4 text-red-400 mb-4 text-sm sm:text-base border border-red-800">
            {error}
          </div>
        )}

        {!loading && (
          <div className="space-y-8">
            {/* Incoming Requests */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Incoming Requests</h2>
              {incomingRequests.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {incomingRequests.map((request) => (
                        <Card key={request._id}>
                          <CardHeader className="pb-3 sm:pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <CardTitle className="text-sm sm:text-base">
                                  🔄 Swap with {request.requesterId?.name || 'User'}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm mt-1">
                                  <div className="space-y-1 mt-2">
                                    <div>
                                      <span className="text-teal-400">{request.requesterId?.name || 'User'}</span>
                                      {' wants: '}
                                      <span className="text-slate-200 font-medium">{request.mySlotId?.title || 'Your slot'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-300">You offer: </span>
                                      <span className="text-slate-200 font-medium">{request.theirSlotId?.title || 'Their slot'}</span>
                                    </div>
                                  </div>
                                </CardDescription>
                              </div>
                              <Badge variant={request.status === 'PENDING' ? 'default' : 'secondary'} className="w-fit">
                                {request.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          {request.status === 'PENDING' && (
                            <CardContent className="pt-0 pb-3 sm:pb-4 flex flex-col sm:flex-row gap-2">
                              <Button
                                onClick={() => handleAccept(request._id)}
                                className="w-full sm:flex-1"
                                size="sm"
                              >
                                <CheckCircle2 className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                                <span className="text-xs sm:text-sm">Accept</span>
                              </Button>
                              <Button
                                onClick={() => handleReject(request._id)}
                                variant="outline"
                                className="w-full sm:flex-1"
                                size="sm"
                              >
                                <XCircle className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                                <span className="text-xs sm:text-sm">Reject</span>
                              </Button>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No incoming requests</p>
                  )}
                </div>

                {/* Outgoing Requests */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Outgoing Requests</h2>
                  {outgoingRequests.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {outgoingRequests.map((request) => (
                        <Card key={request._id}>
                          <CardHeader className="pb-3 sm:pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <CardTitle className="text-sm sm:text-base">
                                  🔄 Request to {request.recipientId?.name || 'User'}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm mt-1">
                                  <div className="space-y-1 mt-2">
                                    <div>
                                      <span className="text-slate-300">You want: </span>
                                      <span className="text-slate-200 font-medium">{request.theirSlotId?.title || 'Their slot'}</span>
                                      <span className="text-teal-400"> ({request.recipientId?.name || 'User'})</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-300">You offer: </span>
                                      <span className="text-slate-200 font-medium">{request.mySlotId?.title || 'Your slot'}</span>
                                    </div>
                                  </div>
                                </CardDescription>
                              </div>
                              <Badge
                                variant={
                                  request.status === 'PENDING'
                                    ? 'default'
                                    : request.status === 'ACCEPTED'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="w-fit"
                              >
                                {request.status === 'PENDING' ? 'Pending...' : request.status}
                              </Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No outgoing requests</p>
                  )}
                </div>
              </div>
            )}
          </div>
    </AppLayout>
  )
}
