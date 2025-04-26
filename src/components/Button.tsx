interface ButtonProps {
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  label: string
  size: 'xs' | 'sm' | 'md' | 'full'
  disabled?: boolean
  fontMono?: boolean
  onClick: () => void
}

function Button({
  type,
  label,
  size,
  disabled,
  fontMono,
  onClick,
}: ButtonProps) {
  const colorClass = getColorClass(type)
  const sizeClass = getSizeClass(size)
  const fontMonoClass = fontMono ? 'font-mono' : ''
  return (
    <button
      type="button"
      className={`cursor-pointer rounded px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 ${colorClass} ${sizeClass} ${fontMonoClass}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function getColorClass(
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning',
) {
  switch (type) {
    case 'primary':
      return 'bg-blue-500 hover:bg-blue-600 text-white'
    case 'secondary':
      return 'bg-gray-500 hover:bg-gray-600 text-white'
    case 'success':
      return 'bg-green-700 hover:bg-green-800 text-white'
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white'
    case 'warning':
      return 'bg-yellow-400 hover:bg-yellow-300 text-black'
  }
}

function getSizeClass(size: 'xs' | 'sm' | 'md' | 'full') {
  switch (size) {
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
