import { Button as HeadlessUiButton } from '@headlessui/react'

interface ButtonProps {
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size: '2xs' | 'xs' | 'sm' | 'md' | 'full'
  children: string | React.ReactNode
  disabled?: boolean
  'aria-label'?: string
  fontMono?: boolean
  onClick: () => void
}

function Button({
  type,
  children,
  size,
  disabled,
  'aria-label': ariaLabel,
  fontMono,
  onClick,
}: ButtonProps) {
  const colorClass = getColorClass(type)
  const sizeClass = getSizeClass(size)
  const fontMonoClass = fontMono ? 'font-mono' : ''
  return (
    <HeadlessUiButton
      type="button"
      className={`cursor-pointer rounded px-3 py-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 ${colorClass} ${sizeClass} ${fontMonoClass}`}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </HeadlessUiButton>
  )
}

function getColorClass(
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning',
) {
  switch (type) {
    case 'primary':
      return 'bg-blue-500 text-white data-hover:bg-blue-600'
    case 'secondary':
      return 'bg-gray-500 text-white data-hover:bg-gray-600'
    case 'success':
      return 'bg-green-700 text-white data-hover:bg-green-800'
    case 'danger':
      return 'bg-red-600 text-white data-hover:bg-red-700'
    case 'warning':
      return 'bg-yellow-400 text-black data-hover:bg-yellow-300'
  }
}

function getSizeClass(size: '2xs' | 'xs' | 'sm' | 'md' | 'full') {
  switch (size) {
    case '2xs':
      return 'w-9'
    case 'xs':
      return 'w-15'
    case 'sm':
      return 'w-20 lg:w-30'
    case 'md':
      return 'w-25 lg:w-50'
    case 'full':
      return 'w-full'
  }
}

export default Button
