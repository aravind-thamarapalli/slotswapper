import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { formatDateTime } from '@/lib/helpers'
import { AlertCircle, ArrowRightCircle, Calendar, Clock } from 'lucide-react'

export function SlotSelectorDialog({
  isOpen,
  onOpenChange,
  userSlots,
  theirSlot,
  onConfirm,
  loading = false,
}) {
  const [selectedSlotId, setSelectedSlotId] = useState(
    userSlots.length > 0 ? userSlots[0]._id : ''
  )

  const handleConfirm = () => {
    if (selectedSlotId) {
      onConfirm(selectedSlotId)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-2xl font-bold">Create Swap Request</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Select which of your time slots you want to offer in exchange
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Swap Direction Visualization */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Their Slot Preview */}
            <div className="flex-1 rounded-xl bg-gradient-to-br from-teal-900/40 to-teal-800/20 border border-teal-700/50 p-4 sm:p-5 hover:border-teal-600/80 transition-all duration-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-teal-500/20">
                  <Calendar className="h-4 w-4 text-teal-400" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-teal-300">You want</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-bold text-slate-100 line-clamp-2">{theirSlot.title}</p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <Clock className="h-3 w-3 text-teal-400" />
                  <span>{formatDateTime(new Date(theirSlot.startTime))}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <Clock className="h-3 w-3 text-teal-400" />
                  <span>{formatDateTime(new Date(theirSlot.endTime))}</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden sm:flex items-center justify-center">
              <ArrowRightCircle className="h-6 w-6 text-teal-500 animate-pulse" />
            </div>
            <div className="sm:hidden flex items-center justify-center">
              <div className="h-1 w-8 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
            </div>

            {/* Selection Placeholder */}
            <div className="flex-1 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 sm:p-5 flex items-center justify-center min-h-[120px]">
              <p className="text-xs sm:text-sm text-slate-400 text-center">← Select your slot</p>
            </div>
          </div>

          {/* Your Slots Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-slate-700/50">
                <Calendar className="h-4 w-4 text-slate-300" />
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-100">
                Select Your Slot to Offer
              </p>
            </div>

            {userSlots.length > 0 ? (
              <RadioGroup value={selectedSlotId} onValueChange={setSelectedSlotId}>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {userSlots.map((slot) => (
                    <div
                      key={slot._id}
                      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                        selectedSlotId === slot._id
                          ? 'border-teal-500 bg-teal-900/20 shadow-lg shadow-teal-500/10'
                          : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem
                          value={slot._id}
                          id={`slot-${slot._id}`}
                          className="mt-1 flex-shrink-0"
                          disabled={loading}
                        />
                        <Label
                          htmlFor={`slot-${slot._id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="space-y-2">
                            <p className="text-sm sm:text-base font-bold text-slate-100">
                              {slot.title}
                            </p>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                                <Clock className="h-3 w-3 text-slate-500" />
                                <span>{formatDateTime(new Date(slot.startTime))}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                                <Clock className="h-3 w-3 text-slate-500" />
                                <span>{formatDateTime(new Date(slot.endTime))}</span>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-900/20 border border-amber-800/50">
                <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-300 mb-1">
                    No slots available
                  </p>
                  <p className="text-xs sm:text-sm text-amber-200/80">
                    You need to create a slot first before you can request a swap.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || userSlots.length === 0}
            className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-500 text-white"
          >
            {loading ? 'Creating Request...' : 'Confirm Swap Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
