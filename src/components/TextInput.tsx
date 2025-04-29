import { Field, Label, Input } from '@headlessui/react'

interface TextInputProps {
  label: string
  value: string
  isValid: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function TextInput({ label, value, isValid, onChange }: TextInputProps) {
  const validClass = isValid
    ? 'border-black data-focus:ring-blue-500'
    : 'border-red-500 data-focus:ring-red-500'
  return (
    <Field>
      <Label className="hidden">{label}</Label>
      <Input
        type="text"
        value={value}
        className={`w-full cursor-text rounded border bg-white px-3 py-2 data-focus:border-transparent data-focus:ring-3 data-focus:outline-none ${validClass}`}
        autoComplete="off"
        onChange={onChange}
      />
    </Field>
  )
}

export default TextInput
