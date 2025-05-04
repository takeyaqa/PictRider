import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { AlertMessage, Button, Section, Switch, TextInput } from '../components'
import { useConfig } from '../features/config'
import { useModel } from '../features/model'
import { Constraint, ConstraintText, Parameter } from '../types'

function ConstraintsSection() {
  const { config, handlers: configHandlers } = useConfig()
  const { model, handlers: modelHandlers } = useModel()

  return (
    <Section>
      <div className="mb-5 flex items-center gap-5">
        <h2 className="w-30 text-lg font-bold">Constraints</h2>
        <div>
          <Switch
            label="Enable Constraints"
            checked={config.enableConstraints}
            onChange={(checked) => {
              configHandlers.handleChangeConfigCheckbox(
                'enableConstraints',
                checked,
              )
            }}
          />
        </div>
      </div>
      {config.enableConstraints && (
        <div>
          {!model.constraintDirectEditMode && (
            <ConstraintTables
              constraints={model.constraints}
              parameters={model.parameters}
              handleClickAddConstraint={modelHandlers.handleClickAddConstraint}
              handleClickRemoveConstraint={
                modelHandlers.handleClickRemoveConstraint
              }
              handleChangeCondition={modelHandlers.handleChangeCondition}
              handleToggleCondition={modelHandlers.handleToggleCondition}
            />
          )}
          <ConstraintEditor
            constraintTexts={model.constraintTexts}
            constraintDirectEditMode={model.constraintDirectEditMode}
            handleChangeConstraintFormula={
              modelHandlers.handleChangeConstraintFormula
            }
            handleToggleConstraintDirectEditMode={
              modelHandlers.handleToggleConstraintDirectEditMode
            }
            handleClickResetConstraints={
              modelHandlers.handleClickResetConstraints
            }
          />
          <AlertMessage messages={model.constraintErrors} />
        </div>
      )}
    </Section>
  )
}

interface ConstraintTablesProps {
  constraints: Constraint[]
  parameters: Parameter[]
  handleClickAddConstraint: () => void
  handleClickRemoveConstraint: () => void
  handleChangeCondition: (
    constraintId: string,
    parameterId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  handleToggleCondition: (constraintId: string, parameterId: string) => void
}

function ConstraintTables({
  constraints,
  parameters,
  handleClickAddConstraint,
  handleClickRemoveConstraint,
  handleChangeCondition,
  handleToggleCondition,
}: ConstraintTablesProps) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-3">
        {constraints.map((constraint, i) => (
          <div key={constraint.id}>
            <ConstraintTableHeader
              constraintHeading={`Constraint ${(i + 1).toString()}`}
              constraintsLength={constraints.length}
              isRenderButtons={i + 1 === constraints.length}
              handleClickAddConstraint={handleClickAddConstraint}
              handleClickRemoveConstraint={handleClickRemoveConstraint}
            />
            <ConstraintTableBody
              constraintHeading={`Constraint ${(i + 1).toString()}`}
              constraint={constraint}
              parameters={parameters}
              handleChangeCondition={handleChangeCondition}
              handleToggleCondition={handleToggleCondition}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface ConstraintTableHeaderProps {
  constraintHeading: string
  constraintsLength: number
  isRenderButtons: boolean
  handleClickAddConstraint: () => void
  handleClickRemoveConstraint: () => void
}

function ConstraintTableHeader({
  constraintHeading,
  constraintsLength,
  isRenderButtons,
  handleClickAddConstraint,
  handleClickRemoveConstraint,
}: ConstraintTableHeaderProps) {
  return (
    <div className="flex h-10 border-collapse grid-cols-3 items-center justify-between border bg-gray-200 px-4 py-2 text-left font-bold dark:border-gray-500 dark:bg-gray-600 dark:text-white">
      <div>{constraintHeading}</div>
      {isRenderButtons ? (
        <div className="flex gap-1">
          <Button
            type="secondary"
            size="2xs"
            disabled={constraintsLength <= 1}
            aria-label="Remove Constraint"
            onClick={handleClickRemoveConstraint}
          >
            <XMarkIcon />
          </Button>
          <Button
            type="secondary"
            size="2xs"
            disabled={constraintsLength >= 50}
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
  )
}

interface ConstraintTableBodyProps {
  constraintHeading: string
  constraint: Constraint
  parameters: Parameter[]
  handleChangeCondition: (
    constraintId: string,
    parameterId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  handleToggleCondition: (constraintId: string, parameterId: string) => void
}

function ConstraintTableBody({
  constraintHeading,
  constraint,
  parameters,
  handleChangeCondition,
  handleToggleCondition,
}: ConstraintTableBodyProps) {
  return (
    <>
      {constraint.conditions.map((condition) => (
        <div
          key={condition.parameterId}
          className="border-collapse border px-4 py-2 text-left dark:border-gray-500"
        >
          <div>
            <div className="text-sm font-bold">
              {getParameterName(parameters, condition.parameterId)}
            </div>
            <div className="flex gap-1">
              <Button
                type="secondary"
                size="xs"
                fontMono={true}
                aria-label={`${constraintHeading} ${getParameterName(parameters, condition.parameterId)} ${condition.ifOrThen}`}
                onClick={() => {
                  handleToggleCondition(constraint.id, condition.parameterId)
                }}
              >
                {condition.ifOrThen}
              </Button>
              <TextInput
                label={`${constraintHeading} ${getParameterName(parameters, condition.parameterId)} Predicate`}
                value={condition.predicate}
                isValid={condition.isValid}
                onChange={(e) => {
                  handleChangeCondition(constraint.id, condition.parameterId, e)
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

interface ConstraintEditorProps {
  constraintTexts: ConstraintText[]
  constraintDirectEditMode: boolean
  handleChangeConstraintFormula: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void
  handleToggleConstraintDirectEditMode: () => void
  handleClickResetConstraints: () => void
}

function ConstraintEditor({
  constraintTexts,
  constraintDirectEditMode,
  handleChangeConstraintFormula,
  handleToggleConstraintDirectEditMode,
  handleClickResetConstraints,
}: ConstraintEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="mt-3">
      {constraintDirectEditMode && isEditing ? (
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
            <ConstraintDirectEditButton
              handleToggleConstraintDirectEditMode={
                handleToggleConstraintDirectEditMode
              }
              setIsEditing={setIsEditing}
            />
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
              <code key={constraintText.id}>{`${constraintText.text}\n`}</code>
            ))}
          </pre>
        </>
      )}
      {constraintDirectEditMode && (
        <ConstraintResetButton
          handleClickResetConstraints={handleClickResetConstraints}
        />
      )}
    </div>
  )
}

interface ConstraintDirectEditButtonProps {
  handleToggleConstraintDirectEditMode: () => void
  setIsEditing: (isEditing: boolean) => void
}

function ConstraintDirectEditButton({
  handleToggleConstraintDirectEditMode,
  setIsEditing,
}: ConstraintDirectEditButtonProps) {
  return (
    <Button
      type="danger"
      size="sm"
      onClick={() => {
        handleToggleConstraintDirectEditMode()
        setIsEditing(true)
      }}
    >
      Edit Directly
    </Button>
  )
}

interface ConstraintResetButtonProps {
  handleClickResetConstraints: () => void
}

function ConstraintResetButton({
  handleClickResetConstraints,
}: ConstraintResetButtonProps) {
  return (
    <Button type="warning" size="md" onClick={handleClickResetConstraints}>
      Reset Constraints
    </Button>
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
