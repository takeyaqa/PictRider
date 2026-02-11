import { useEffect, useRef } from 'react'
import Button from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmButtonType?: 'primary' | 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  confirmButtonType = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onCancel])

  useEffect(() => {
    if (open) {
      cancelButtonRef.current?.querySelector('button')?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-md border border-gray-400 bg-white p-4 shadow-lg dark:border-gray-500 dark:bg-gray-700">
        <h3
          id="confirm-dialog-title"
          className="text-lg font-bold text-black dark:text-white"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm text-black dark:text-white">{message}</p>
        <div className="mt-4 flex justify-end gap-3">
          <div ref={cancelButtonRef}>
            <Button type="secondary" size="sm" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </div>
          <Button type={confirmButtonType} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
