import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/16/solid'
import {
  Parameter,
  Constraint,
  Config,
  ConstraintText,
  Message,
} from '../types'
import { AlertMessage, Button, Switch, Section, TextInput } from '../components'

interface ConstraintsSectionProps {
  config: Config
  parameters: Parameter[]
  constraints: Constraint[]
  constraintTexts: ConstraintText[]
  constraintDirectEditMode: boolean
  messages: Message[]
  handleChangeConfigCheckbox: (
    type: 'enableConstraints',
    checked: boolean,
  ) => void
  handleToggleCondition: (constraintId: string, parameterId: string) => void
  handleChangeCondition: (
    constraintId: string,
    parameterId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
  handleChangeConstraintFormula: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void
  handleClickAddConstraint: () => void
  handleClickRemoveConstraint: () => void
  toggleConstraintDirectEditMode: () => void
  handleClickResetConstraints: () => void
}

function ConstraintsSection({
  config,
  parameters,
  constraints,
  constraintTexts,
  constraintDirectEditMode,
  messages,
  handleChangeConfigCheckbox,
  handleToggleCondition,
  handleChangeCondition,
  handleChangeConstraintFormula,
  handleClickAddConstraint,
  handleClickRemoveConstraint,
  toggleConstraintDirectEditMode,
  handleClickResetConstraints,
}: ConstraintsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Section>
      <div className="mb-5 flex items-center gap-5">
        <h2 className="w-30 text-lg font-bold">Constraints</h2>
        <div>
          <Switch
            label="Enable Constraints"
            checked={config.enableConstraints}
            onChange={(checked) => {
              handleChangeConfigCheckbox('enableConstraints', checked)
            }}
          />
        </div>
      </div>
      {config.enableConstraints && (
        <div>
          {!constraintDirectEditMode && (
            <div>
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-3">
                {constraints.map((constraint, i) => (
                  <div key={constraint.id}>
                    <div className="flex h-10 border-collapse grid-cols-3 items-center justify-between border bg-gray-200 px-4 py-2 text-left font-bold dark:border-gray-500 dark:bg-gray-600 dark:text-white">
                      <div>Constraint {i + 1}</div>
                      {i + 1 === constraints.length ? (
                        <div className="flex gap-1">
                          <Button
                            type="secondary"
                            size="2xs"
                            disabled={constraints.length <= 1}
                            aria-label="Remove Constraint"
                            onClick={handleClickRemoveConstraint}
                          >
                            <XMarkIcon />
                          </Button>
                          <Button
                            type="secondary"
                            size="2xs"
                            disabled={constraints.length >= 50}
                            aria-label="Add Constraint"
                            onClick={handleClickAddConstraint}
                          >
                            <PlusIcon />
                          </Button>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    {constraint.conditions.map((condition) => (
                      <div
                        key={condition.parameterId}
                        className="border-collapse border px-4 py-2 text-left dark:border-gray-500"
                      >
                        <div>
                          <div className="text-sm font-bold">
                            {getParameterName(
                              parameters,
                              condition.parameterId,
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="secondary"
                              size="xs"
                              fontMono={true}
                              aria-label={`Constraint ${(i + 1).toString()} ${getParameterName(parameters, condition.parameterId)} ${condition.ifOrThen}`}
                              onClick={() => {
                                handleToggleCondition(
                                  constraint.id,
                                  condition.parameterId,
                                )
                              }}
                            >
                              {condition.ifOrThen}
                            </Button>
                            <TextInput
                              label={`Constraint ${(i + 1).toString()} ${getParameterName(parameters, condition.parameterId)} Predicate`}
                              value={condition.predicate}
                              isValid={condition.isValid}
                              onChange={(e) => {
                                handleChangeCondition(
                                  constraint.id,
                                  condition.parameterId,
                                  e,
                                )
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3">
            {isEditing ? (
              <>
                <label
                  className="mb-2 block text-base font-bold text-gray-900 dark:text-white"
                  htmlFor="constraint_formula"
                >
                  Constraint Formula
                </label>
                <textarea
                  className="max-h-50 min-h-30 w-full rounded border border-black bg-white p-4 font-mono text-sm text-black focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none dark:border-gray-500 dark:bg-gray-600 dark:text-white"
                  value={constraintTexts.map((c) => c.text).join('\n')}
                  id="constraint_formula"
                  autoFocus={true}
                  onChange={(e) => {
                    handleChangeConstraintFormula(e)
                  }}
                  onBlur={() => {
                    setIsEditing(false)
                  }}
                ></textarea>
              </>
            ) : (
              <>
                <span className="mr-3 mb-2 inline text-base font-bold text-gray-900 dark:text-white">
                  Constraint Formula
                </span>
                {!constraintDirectEditMode && (
                  <Button
                    type="danger"
                    size="sm"
                    onClick={() => {
                      toggleConstraintDirectEditMode()
                      setIsEditing(true)
                    }}
                  >
                    Edit Directly
                  </Button>
                )}
                <pre
                  className={
                    constraintDirectEditMode
                      ? 'max-h-50 min-h-30 overflow-x-auto rounded bg-white p-4 font-mono text-sm text-black dark:bg-gray-600 dark:text-white'
                      : 'max-h-50 min-h-30 overflow-x-auto rounded bg-gray-100 p-4 font-mono text-sm text-black dark:bg-gray-600 dark:text-white'
                  }
                  onClick={() => {
                    setIsEditing(true)
                  }}
                >
                  {constraintTexts.map((constraintText) => (
                    <code
                      key={constraintText.id}
                    >{`${constraintText.text}\n`}</code>
                  ))}
                </pre>
              </>
            )}
            {constraintDirectEditMode && (
              <Button
                type="warning"
                size="md"
                onClick={handleClickResetConstraints}
              >
                Reset Constraints
              </Button>
            )}
          </div>
          <AlertMessage messages={messages} />
        </div>
      )}
    </Section>
  )
}

function getParameterName(
  parameters: Parameter[],
  parameterId: string,
): string {
  const parameter = parameters.find((p) => p.id === parameterId)
  return parameter ? parameter.name : ''
}

export default ConstraintsSection
