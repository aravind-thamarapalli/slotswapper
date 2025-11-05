import { X, Bell, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const getNotificationIcon = (notification) => {
  if (notification.acceptedBy) {
    return <CheckCircle2 className="w-5 h-5 text-green-400" />
  } else if (notification.declinedBy) {
    return <XCircle className="w-5 h-5 text-red-400" />
  } else if (notification.cancelledBy) {
    return <AlertCircle className="w-5 h-5 text-orange-400" />
  } else if (notification.requesterName) {
    return <Bell className="w-5 h-5 text-teal-400 animate-pulse" />
  }
  return <Bell className="w-5 h-5 text-slate-400" />
}

const getNotificationMessage = (notification) => {
  if (notification.acceptedBy) {
    return `${notification.acceptedBy} accepted your swap request! 🎉`
  } else if (notification.declinedBy) {
    return `${notification.declinedBy} declined your swap request`
  } else if (notification.cancelledBy) {
    return `${notification.cancelledBy} cancelled the swap request`
  } else if (notification.requesterName) {
    return `${notification.requesterName} wants to swap their "${notification.mySlot?.title || 'slot'}" for your "${notification.theirSlot?.title || 'slot'}" 📬`
  }
  return 'New notification'
}

const formatTime = (isoString) => {
  try {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export const NotificationCenter = ({
  notifications,
  onClear,
  onClearAll,
  onNavigate,
}) => {
  const navigate = useNavigate()

  const handleNotificationClick = (notification) => {
    // Navigate to requests page for all notifications
    navigate('/requests')
    onNavigate?.()
  }
  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50 space-y-2">
      {/* Header with clear all button */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-400" />
          Notifications ({notifications.length})
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Notification cards */}
      <div className="space-y-2">
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.requestId}
            onClick={() => handleNotificationClick(notification)}
            className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-3 animate-in slide-in-from-bottom-2 duration-300 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getNotificationIcon(notification)}
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {getNotificationMessage(notification)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClear(notification.requestId)
                }}
                className="text-slate-400 hover:text-slate-200 transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slot details */}
            {notification.mySlot && (
              <div className="text-xs text-slate-400 space-y-1 pl-8">
                <div>
                  <span className="text-slate-300">Their slot:</span>{' '}
                  <span className="text-slate-200">{notification.mySlot.title}</span>
                  {notification.requesterName && (
                    <span className="text-teal-400 ml-1">({notification.requesterName})</span>
                  )}
                </div>
                <div>
                  {formatTime(notification.mySlot.startTime)} -{' '}
                  {formatTime(notification.mySlot.endTime)}
                </div>
              </div>
            )}

            {notification.theirSlot && (
              <div className="text-xs text-slate-400 space-y-1 pl-8">
                <div>
                  <span className="text-slate-300">Your slot:</span>{' '}
                  <span className="text-slate-200">{notification.theirSlot.title}</span>
                </div>
                <div>
                  {formatTime(notification.theirSlot.startTime)} -{' '}
                  {formatTime(notification.theirSlot.endTime)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show more indicator */}
      {notifications.length > 3 && (
        <div className="text-xs text-slate-400 text-center py-2">
          +{notifications.length - 3} more notifications
        </div>
      )}
    </div>
  )
}
