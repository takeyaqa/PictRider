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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2">
        {config.enableSubModels &&
          subModels.map((subModel, i) => (
            <div
              key={subModel.id}
              className="mb-5 grid grid-cols-2 place-items-center gap-5"
            >
              <div>
                <h3 className="text-base font-bold">Sub Model {i + 1}</h3>
                <div>
                  <h4 className="mb-2">Parameters</h4>
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
              <div>
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
      </div>
    </Section>
  )
}

export default SubModelsSection
