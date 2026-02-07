import { PlusIcon, XMarkIcon } from '@heroicons/react/16/solid'
import Button from './Button'

interface AugmentDivProps {
  children: React.ReactNode
  title: string
  heading: string
  totalLength: number
  maxLength: number
  canRenderButtons: boolean
  onClickAdd: () => void
  onClickRemove: () => void
}

function AugmentDiv({
  children,
  title,
  heading,
  totalLength,
  maxLength,
  canRenderButtons,
  onClickAdd,
  onClickRemove,
}: AugmentDivProps) {
  return (
    <div className="mb-5">
      <div className="flex h-10 border-collapse grid-cols-3 items-center justify-between border bg-gray-200 px-4 py-2 text-left font-bold dark:border-gray-500 dark:bg-gray-600 dark:text-white">
        <div>{heading}</div>
        {canRenderButtons ? (
          <div className="flex gap-1">
            <Button
              type="secondary"
              size="2xs"
              disabled={totalLength <= 1}
              aria-label={`Remove ${title}`}
              onClick={onClickRemove}
            >
              <XMarkIcon />
            </Button>
            <Button
              type="secondary"
              size="2xs"
              disabled={totalLength >= maxLength}
              aria-label={`Add ${title}`}
              onClick={onClickAdd}
            >
              <PlusIcon />
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
      {children}
    </div>
  )
}

export default AugmentDiv
