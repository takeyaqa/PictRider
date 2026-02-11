import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Button from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  confirmButtonType: 'primary' | 'danger' | 'warning' | 'secondary' | 'success'
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmButtonType,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <DialogPanel className="relative w-full max-w-md rounded-md border border-gray-400 bg-white p-4 shadow-lg dark:border-gray-500 dark:bg-gray-700">
        <DialogTitle className="text-lg font-bold text-black dark:text-white">
          {title}
        </DialogTitle>
        <p className="mt-2 text-sm text-black dark:text-white">{message}</p>
        <div className="mt-4 flex justify-end gap-3">
          <Button type="secondary" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type={confirmButtonType} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </DialogPanel>
    </Dialog>
  )
}

export default ConfirmDialog
