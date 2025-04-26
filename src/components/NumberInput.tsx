interface NumberInputProps {
  id: string
  value: number | ''
  min: number
  max: number
  disabled?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function NumberInput({
  id,
  value,
  min,
  max,
  disabled,
  onChange,
}: NumberInputProps) {
  return (
    <input
      type="number"
      id={id}
      value={value}
      className="ml-3 rounded border border-black bg-white pl-2 text-right focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none disabled:bg-gray-300"
      min={min}
      max={max}
      disabled={disabled}
      autoComplete="false"
      onChange={onChange}
    />
  )
}

export default NumberInput
