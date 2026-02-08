import { Switch as HeadlessUiSwitch, Field, Label } from '@headlessui/react'

interface SwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Switch({ label, checked, onChange }: SwitchProps) {
  return (
    <Field className="flex items-center">
      <HeadlessUiSwitch
        checked={checked}
        className="group relative flex h-7 w-14 cursor-pointer rounded-full border-gray-300 bg-gray-400 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-blue-500 data-focus:outline data-focus:outline-white dark:bg-gray-700 dark:data-checked:bg-blue-600"
        onChange={onChange}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
        />
      </HeadlessUiSwitch>
      <Label className="hidden cursor-pointer">{label}</Label>
    </Field>
  )
}

export default Switch
