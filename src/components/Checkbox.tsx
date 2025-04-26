interface CheckboxProps {
  id: string
  label: string
  checked: boolean
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Checkbox({ id, label, value, checked, onChange }: CheckboxProps) {
  return (
    <label className="cursor-pointer" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        value={value ?? label}
        checked={checked}
        className="mr-1 cursor-pointer rounded"
        autoComplete="off"
        onChange={onChange}
      />
      {label}
    </label>
  )
}

export default Checkbox
