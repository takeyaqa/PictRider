import { Field, Label, Input } from '@headlessui/react'

interface NumberInputProps {
  label: string
  value: number | ''
  min: number
  max: number
  disabled?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function NumberInput({
  label,
  value,
  min,
  max,
  disabled,
  onChange,
}: NumberInputProps) {
  return (
    <Field>
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        className="ml-3 rounded border border-black bg-white pl-2 text-right data-disabled:bg-gray-300 data-focus:border-transparent data-focus:ring-3 data-focus:ring-blue-500 data-focus:outline-none"
        min={min}
        max={max}
        disabled={disabled}
        autoComplete="off"
        onChange={onChange}
      />
    </Field>
  )
}

export default NumberInput
