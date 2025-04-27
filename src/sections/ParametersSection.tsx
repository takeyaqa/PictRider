import { Button, Section, TextInput } from '../components'
import { Message, Parameter } from '../types'

interface ParametersSectionProps {
  parameters: Parameter[]
  messages: Message[]
  handleChangeParameter: (
    id: string,
    field: 'name' | 'values',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
  handleClickAddRow: () => void
  handleClickRemoveRow: () => void
  handleClickClear: () => void
}

function ParametersSection({
  parameters,
  messages,
  handleChangeParameter,
  handleClickAddRow,
  handleClickRemoveRow,
  handleClickClear,
}: ParametersSectionProps) {
  return (
    <Section>
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <h2 className="text-lg font-bold" id="parameters_label">
            Parameters
          </h2>
        </div>
        <div className="col-span-2">
          <h2 className="text-lg font-bold" id="values_label">
            Values
          </h2>
        </div>
        <div className="col-span-7 flex items-center justify-end gap-5">
          <Button
            type="secondary"
            label="Add Row"
            size="sm"
            disabled={parameters.length >= 50}
            onClick={handleClickAddRow}
          />
          <Button
            type="secondary"
            label="Remove Row"
            size="sm"
            disabled={parameters.length <= 1}
            onClick={handleClickRemoveRow}
          />
          <Button
            type="warning"
            label="Clear"
            size="sm"
            onClick={handleClickClear}
          />
        </div>
      </div>
      {parameters.map((p) => (
        <div className="mb-1 grid grid-cols-12 gap-5" key={p.id}>
          <div className="col-span-3">
            <TextInput
              name="parameter_name"
              value={p.name}
              isValid={p.isValidName}
              ariaLabelledby="parameters_label"
              onChange={(e) => {
                handleChangeParameter(p.id, 'name', e)
              }}
            />
          </div>
          <div className="col-span-9">
            <TextInput
              name="parameter_values"
              value={p.values}
              isValid={p.isValidValues}
              ariaLabelledby="values_label"
              onChange={(e) => {
                handleChangeParameter(p.id, 'values', e)
              }}
            />
          </div>
        </div>
      ))}
      {messages.length > 0 && (
        <div
          className="mt-5 rounded-md border-2 border-red-400 bg-red-100 p-7 text-red-700"
          role="alert"
        >
          {messages.map((message) => (
            <p key={message.id}>{message.text}</p>
          ))}
        </div>
      )}
    </Section>
  )
}

export default ParametersSection
