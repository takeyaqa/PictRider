import { Input } from '@headlessui/react'

interface TextInputProps {
  value: string
  isValid: boolean
  ariaLabelledby?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function TextInput({
  value,
  isValid,
  ariaLabelledby,
  onChange,
}: TextInputProps) {
  const validClass = isValid
    ? 'border-black data-focus:ring-blue-500'
    : 'border-red-500 data-focus:ring-red-500'
  return (
    <Input
      type="text"
      value={value}
      className={`w-full cursor-text rounded border bg-white px-3 py-2 data-focus:border-transparent data-focus:ring-3 data-focus:outline-none ${validClass}`}
      aria-labelledby={ariaLabelledby}
      autoComplete="off"
      onChange={onChange}
    />
  )
}

export default TextInput
