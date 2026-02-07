import { useState } from 'react'
import {
  AlertMessage,
  AugmentDiv,
  Button,
  Section,
  Switch,
  TextInput,
} from '../../shared/components'
import type {
  Constraint,
  Constraints,
  ConstraintText,
  Parameter,
} from '../../types'
import { useConfig } from '../config'

interface ConstraintsSectionProps {
  constraints: Constraints
  parameters: Parameter[]
  onToggleCondition: (constraintId: string, parameterId: string) => void
  onChangeCondition: (
    constraintId: string,
    parameterId: string,
    value: string,
  ) => void
  onAddConstraint: () => void
  onRemoveConstraint: () => void
  onToggleConstraintDirectEditMode: () => void
  onChangeConstraintFormula: (value: string) => void
  onResetConstraints: () => void
}

function ConstraintsSection({
  constraints,
  parameters,
  onToggleCondition,
  onChangeCondition,
  onAddConstraint,
  onRemoveConstraint,
  onToggleConstraintDirectEditMode,
  onChangeConstraintFormula,
  onResetConstraints,
}: ConstraintsSectionProps) {
  const { config, handlers: configHandlers } = useConfig()

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
          {!constraints.constraintDirectEditMode && (
            <ConstraintTables
              constraints={constraints.constraints}
              parameters={parameters}
              onClickAddConstraint={onAddConstraint}
              onClickRemoveConstraint={onRemoveConstraint}
              onChangeCondition={(constraintId, parameterId, event) => {
                onChangeCondition(constraintId, parameterId, event.target.value)
              }}
              onToggleCondition={onToggleCondition}
            />
          )}
          <ConstraintEditor
            constraintTexts={constraints.constraintTexts}
            constraintDirectEditMode={constraints.constraintDirectEditMode}
            onChangeConstraintFormula={(e) => {
              onChangeConstraintFormula(e.target.value)
            }}
            onToggleConstraintDirectEditMode={onToggleConstraintDirectEditMode}
            onClickResetConstraints={onResetConstraints}
          />
          <AlertMessage messages={constraints.constraintErrors} />
        </div>
      )}
    </Section>
  )
}

interface ConstraintTablesProps {
  constraints: Constraint[]
  parameters: Parameter[]
  onToggleCondition: (constraintId: string, parameterId: string) => void
  onChangeCondition: (
    constraintId: string,
    parameterId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  onClickAddConstraint: () => void
  onClickRemoveConstraint: () => void
}

function ConstraintTables({
  constraints,
  parameters,
  onToggleCondition,
  onChangeCondition,
  onClickAddConstraint,
  onClickRemoveConstraint,
}: ConstraintTablesProps) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-2 2xl:grid-cols-3">
        {constraints.map((constraint, i) => (
          <AugmentDiv
            key={constraint.id}
            title="Constraint"
            heading={`Constraint ${(i + 1).toString()}`}
            totalLength={constraints.length}
            maxLength={25}
            canRenderButtons={i + 1 === constraints.length}
            onClickAdd={onClickAddConstraint}
            onClickRemove={onClickRemoveConstraint}
          >
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
                      aria-label={`Constraint ${(i + 1).toString()} ${getParameterName(parameters, condition.parameterId)} ${condition.ifOrThen}`}
                      onClick={() => {
                        onToggleCondition(constraint.id, condition.parameterId)
                      }}
                    >
                      {condition.ifOrThen}
                    </Button>
                    <TextInput
                      label={`Constraint ${(i + 1).toString()} ${getParameterName(parameters, condition.parameterId)} Predicate`}
                      value={condition.predicate}
                      isValid={condition.isValid}
                      onChange={(e) => {
                        onChangeCondition(
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
          </AugmentDiv>
        ))}
      </div>
    </div>
  )
}

interface ConstraintEditorProps {
  constraintTexts: ConstraintText[]
  constraintDirectEditMode: boolean
  onToggleConstraintDirectEditMode: () => void
  onChangeConstraintFormula: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onClickResetConstraints: () => void
}

function ConstraintEditor({
  constraintTexts,
  constraintDirectEditMode,
  onToggleConstraintDirectEditMode,
  onChangeConstraintFormula,
  onClickResetConstraints,
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
              onChangeConstraintFormula(e)
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
                onToggleConstraintDirectEditMode()
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
              <code key={constraintText.id}>{`${constraintText.text}\n`}</code>
            ))}
          </pre>
        </>
      )}
      {constraintDirectEditMode && (
        <Button type="warning" size="md" onClick={onClickResetConstraints}>
          Reset Constraints
        </Button>
      )}
    </div>
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
