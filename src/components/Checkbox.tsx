import { Checkbox as HeadlessUiCheckbox, Field, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <Field className="flex items-center">
      <HeadlessUiCheckbox
        checked={checked}
        className="group mr-1 flex size-5 cursor-pointer rounded bg-white ring-1 ring-gray-400 data-checked:bg-blue-500"
        onChange={onChange}
      >
        <CheckIcon className="hidden fill-white group-data-checked:inline" />
      </HeadlessUiCheckbox>
      <Label className="cursor-pointer">{label}</Label>
    </Field>
  )
}

export default Checkbox
