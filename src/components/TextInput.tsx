interface ButtonProps {
  name: string
  value: string
  isValid: boolean
  ariaLabelledby?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function TextInput({
  name,
  value,
  isValid,
  ariaLabelledby,
  onChange,
}: ButtonProps) {
  const validClass = isValid
    ? 'border-black focus:ring-blue-500'
    : 'border-red-500 focus:ring-red-500'
  return (
    <input
      type="text"
      name={name}
      value={value}
      className={`w-full rounded border bg-white px-3 py-2 focus:border-transparent focus:ring-3 focus:outline-none ${validClass}`}
      aria-labelledby={ariaLabelledby}
      autoComplete="false"
      onChange={onChange}
    />
  )
}

export default TextInput
