import { AlertMessage, Button, Section, TextInput } from '../components'
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
}

function ParametersSection({
  parameters,
  messages,
  handleChangeParameter,
  handleClickAddRow,
  handleClickRemoveRow,
}: ParametersSectionProps) {
  return (
    <Section>
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <h2 className="text-lg font-bold">Parameters</h2>
        </div>
        <div className="col-span-2">
          <h2 className="text-lg font-bold">Values</h2>
        </div>
        <div className="col-span-7 flex items-center justify-end gap-5">
          <Button
            type="secondary"
            size="sm"
            disabled={parameters.length >= 50}
            onClick={handleClickAddRow}
          >
            Add Row
          </Button>
          <Button
            type="secondary"
            size="sm"
            disabled={parameters.length <= 1}
            onClick={handleClickRemoveRow}
          >
            Remove Row
          </Button>
        </div>
      </div>
      {parameters.map((p) => (
        <div className="mb-1 grid grid-cols-12 gap-5" key={p.id}>
          <div className="col-span-3">
            <TextInput
              label="Parameters"
              value={p.name}
              isValid={p.isValidName}
              onChange={(e) => {
                handleChangeParameter(p.id, 'name', e)
              }}
            />
          </div>
          <div className="col-span-9">
            <TextInput
              label="Values"
              value={p.values}
              isValid={p.isValidValues}
              onChange={(e) => {
                handleChangeParameter(p.id, 'values', e)
              }}
            />
          </div>
        </div>
      ))}
      <AlertMessage messages={messages} />
    </Section>
  )
}

export default ParametersSection
