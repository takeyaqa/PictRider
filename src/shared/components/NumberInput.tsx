import { Field, Label, Input } from '@headlessui/react'

interface NumberInputProps {
  label: string
  value: number | ''
  min: number
  max: number
  disabled?: boolean
  'aria-label'?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function NumberInput({
  label,
  value,
  min,
  max,
  disabled,
  'aria-label': ariaLabel,
  onChange,
}: NumberInputProps) {
  return (
    <Field disabled={disabled}>
      <Label>
        {ariaLabel ? (
          <>
            <span className="sr-only">{ariaLabel}</span>
            <span aria-hidden="true">{label}</span>
          </>
        ) : (
          label
        )}
      </Label>
      <Input
        type="number"
        value={value}
        className="ml-3 cursor-text rounded border border-black bg-white pl-2 text-right data-disabled:bg-gray-300 data-focus:border-transparent data-focus:ring-3 data-focus:ring-blue-500 data-focus:outline-none dark:bg-gray-600 dark:text-white dark:data-disabled:bg-gray-800"
        min={min}
        max={max}
        autoComplete="off"
        onChange={onChange}
      />
    </Field>
  )
}

export default NumberInput
