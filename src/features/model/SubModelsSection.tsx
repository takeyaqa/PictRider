import {
  AugmentDiv,
  Checkbox,
  NumberInput,
  Section,
  Switch,
} from '../../shared/components'
import type { Parameter, SubModels } from '../../types'
import { useConfig } from '../config'

interface SubModelsSectionProps {
  subModels: SubModels
  parameters: Parameter[]
  onClickSubModelParameters: (
    subModelId: string,
    parameterId: string,
    checked: boolean,
  ) => void
  onChangeSubModelOrder: (id: string, order: number) => void
  onAddSubModel: () => void
  onRemoveSubModel: () => void
}

function SubModelsSection({
  subModels,
  parameters,
  onClickSubModelParameters,
  onChangeSubModelOrder,
  onAddSubModel,
  onRemoveSubModel,
}: SubModelsSectionProps) {
  const { config, handlers: configHandlers } = useConfig()

  return (
    <Section>
      <div className="mb-5 flex items-center gap-5">
        <h2 className="w-30 text-lg font-bold">Sub-Models</h2>
        <div>
          <Switch
            label="Enable Sub-Models"
            checked={config.enableSubModels}
            onChange={(checked) => {
              configHandlers.handleChangeConfigCheckbox(
                'enableSubModels',
                checked,
              )
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
        {config.enableSubModels &&
          subModels.subModels.map((subModel, i) => (
            <AugmentDiv
              key={subModel.id}
              title="Sub-Model"
              heading={`Sub-Model ${(i + 1).toString()}`}
              totalLength={subModels.subModels.length}
              maxLength={2}
              canRenderButtons={i + 1 === subModels.subModels.length}
              onClickAdd={onAddSubModel}
              onClickRemove={onRemoveSubModel}
            >
              <div className="grid grid-cols-2 items-center gap-5 border p-5 dark:border-gray-500">
                <div>
                  {parameters.map((parameter) => (
                    <div
                      key={`${subModel.id}-${parameter.id}`}
                      className="mb-1 items-center"
                    >
                      <Checkbox
                        label={parameter.name}
                        checked={subModel.parameterIds.includes(parameter.id)}
                        onChange={(checked) => {
                          onClickSubModelParameters(
                            subModel.id,
                            parameter.id,
                            checked,
                          )
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <NumberInput
                    label="Order"
                    value={subModel.order}
                    min={2}
                    max={parameters.length}
                    onChange={(e) => {
                      onChangeSubModelOrder(subModel.id, Number(e.target.value))
                    }}
                  />
                </div>
              </div>
            </AugmentDiv>
          ))}
      </div>
    </Section>
  )
}

export default SubModelsSection
