import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid'
import React, { useState } from 'react'
import {
  AlertMessage,
  AugmentDiv,
  Button,
  ConfirmDialog,
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

const PREDICATE_INPUT_SYNTAX = [
  { syntax: 'value', description: 'Equals (=)' },
  { syntax: '#value', description: 'Not equals (<>)' },
  { syntax: '>value', description: 'Greater than' },
  { syntax: '<value', description: 'Less than' },
  { syntax: '>=value', description: 'Greater than or equal' },
  { syntax: '<=value', description: 'Less than or equal' },
  {
    syntax: 'a, b',
    description: 'Multiple values (OR for =, AND for #/comparison)',
  },
  { syntax: '* and ?', description: 'Wildcard pattern (LIKE)' },
  { syntax: '#pattern*', description: 'Negated wildcard (NOT LIKE)' },
]

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
      <Disclosure>
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
          <DisclosureButton
            className="ml-auto flex cursor-pointer items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label="Toggle constraints help"
          >
            <QuestionMarkCircleIcon className="size-5" />
            <span>Help</span>
          </DisclosureButton>
        </div>
        <DisclosurePanel className="mb-5 rounded border border-gray-300 bg-white p-4 text-sm dark:border-gray-500 dark:bg-gray-700">
          <h3 className="mb-2 font-bold">Predicate Input Syntax</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {PREDICATE_INPUT_SYNTAX.map((item) => (
              <React.Fragment key={item.syntax}>
                <dt className="font-mono">{item.syntax}</dt>
                <dd>{item.description}</dd>
              </React.Fragment>
            ))}
          </dl>
        </DisclosurePanel>
      </Disclosure>
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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
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
              type="primary"
              size="sm"
              onClick={() => {
                setIsConfirmDialogOpen(true)
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
        <Button
          type="warning"
          size="md"
          onClick={() => {
            setIsResetDialogOpen(true)
          }}
        >
          Reset Constraints
        </Button>
      )}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        title="Switch to Direct Edit Mode?"
        message="Once you switch to direct edit mode, you cannot return to the table format. To go back, you will need to reset all constraints. Do you want to continue?"
        confirmLabel="Continue"
        cancelLabel="Cancel"
        confirmButtonType="danger"
        onConfirm={() => {
          setIsConfirmDialogOpen(false)
          onToggleConstraintDirectEditMode()
          setIsEditing(true)
        }}
        onCancel={() => {
          setIsConfirmDialogOpen(false)
        }}
      />
      <ConfirmDialog
        open={isResetDialogOpen}
        title="Reset All Constraints?"
        message="All constraint formulas will be deleted and the input will return to table format. This action cannot be undone. Do you want to continue?"
        confirmLabel="Reset"
        cancelLabel="Cancel"
        confirmButtonType="warning"
        onConfirm={() => {
          setIsResetDialogOpen(false)
          onClickResetConstraints()
        }}
        onCancel={() => {
          setIsResetDialogOpen(false)
        }}
      />
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
