import { Checkbox, NumberInput, Section, Switch } from '../components'
import { Config, Parameter, SubModel } from '../types'

interface SubModelsSectionProps {
  config: Config
  parameters: Parameter[]
  subModels: SubModel[]
  handleChangeConfigCheckbox: (
    type: 'enableSubModels',
    checked: boolean,
  ) => void
  handleClickSubModelParameters: (
    subModelId: string,
    parameterId: string,
    checked: boolean,
  ) => void
  handleChangeSubModelOrder: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

function SubModelsSection({
  config,
  parameters,
  subModels,
  handleChangeConfigCheckbox,
  handleClickSubModelParameters,
  handleChangeSubModelOrder,
}: SubModelsSectionProps) {
  return (
    <Section>
      <div className="mb-5 flex items-center gap-5">
        <h2 className="text-lg font-bold">Sub-Models</h2>
        <div>
          <Switch
            label="Enable Sub-Models"
            checked={config.enableSubModels}
            onChange={(checked) => {
              handleChangeConfigCheckbox('enableSubModels', checked)
            }}
          />
        </div>
      </div>
      {config.enableSubModels &&
        subModels.map((subModel) => (
          <div className="mb-5 grid grid-cols-12 gap-5" key={subModel.id}>
            <div className="col-span-3">
              <div className="flex flex-col">
                <h3 className="mb-2">Parameters</h3>
                {parameters.map((parameter) => (
                  <div
                    key={`${subModel.id}-${parameter.id}`}
                    className="mb-1 items-center"
                  >
                    <Checkbox
                      label={parameter.name}
                      checked={subModel.parameterIds.includes(parameter.id)}
                      onChange={(checked) => {
                        handleClickSubModelParameters(
                          subModel.id,
                          parameter.id,
                          checked,
                        )
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <NumberInput
                label="Order"
                value={subModel.order}
                min={2}
                max={parameters.length}
                onChange={(e) => {
                  handleChangeSubModelOrder(subModel.id, e)
                }}
              />
            </div>
          </div>
        ))}
    </Section>
  )
}

export default SubModelsSection
