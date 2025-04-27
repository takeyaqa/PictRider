import { useState } from 'react'
import {
  Parameter,
  Constraint,
  Config,
  ConstraintText,
  Message,
} from '../types'
import { Button, Section, TextInput } from '../components'

interface ConstraintTableCell {
  constraintId: string
  ifOrThen: 'if' | 'then' | undefined
  predicate: string
  isIfWithPredicate: boolean
  isValid: boolean
}

interface ConstraintTableRow {
  parameterId: string
  parameterName: string
  cells: ConstraintTableCell[]
}

/**
 * Builds a table data structure from parameters and constraints
 * to avoid repetitive lookups in the JSX
 */
function buildConstraintTable(
  parameters: Parameter[],
  constraints: Constraint[],
): ConstraintTableRow[] {
  return parameters.map((parameter) => {
    const cells = constraints.map((constraint) => {
      const condition = constraint.conditions.find(
        (cond) => cond.parameterId === parameter.id,
      )

      const ifOrThen = condition?.ifOrThen
      const predicate = condition?.predicate ?? ''
      const isIfWithPredicate = ifOrThen === 'if' && predicate !== ''
      const isValid = condition ? condition.isValid : true

      return {
        constraintId: constraint.id,
        ifOrThen,
        predicate,
        isIfWithPredicate,
        isValid,
      }
    })

    return {
      parameterId: parameter.id,
      parameterName: parameter.name,
      cells,
    }
  })
}

interface ConstraintsSectionProps {
  config: Config
  parameters: Parameter[]
  constraints: Constraint[]
  constraintTexts: ConstraintText[]
  constraintDirectEditMode: boolean
  messages: Message[]
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
}

function ConstraintsSection({
  config,
  parameters,
  constraints,
  constraintTexts,
  constraintDirectEditMode,
  messages,
  handleToggleCondition,
  handleChangeCondition,
  handleChangeConstraintFormula,
  handleClickAddConstraint,
  handleClickRemoveConstraint,
  toggleConstraintDirectEditMode,
}: ConstraintsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  if (!config.enableConstraints) {
    return null
  }

  return (
    <Section>
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-6">
          <h2 className="text-lg font-bold" id="constraints-heading">
            Constraints
          </h2>
        </div>
        <div className="col-span-6 flex items-center justify-end gap-5">
          {!constraintDirectEditMode && (
            <>
              <Button
                type="secondary"
                label="Add Constraint"
                size="md"
                disabled={constraints.length >= 50}
                onClick={handleClickAddConstraint}
              />
              <Button
                type="secondary"
                label="Remove Constraint"
                size="md"
                disabled={constraints.length <= 1}
                onClick={handleClickRemoveConstraint}
              />
              <Button
                type="danger"
                label="Edit Directly"
                size="md"
                onClick={() => {
                  toggleConstraintDirectEditMode()
                  setIsEditing(true)
                }}
              />
            </>
          )}
        </div>
      </div>
      {!constraintDirectEditMode && (
        <div>
          <div className="overflow-x-auto">
            <table
              className="border-collapse border border-black"
              aria-labelledby="constraints-heading"
            >
              <thead>
                <tr className="border border-black bg-gray-200 text-left">
                  <th className="px-4 py-2">Parameter</th>
                  {constraints.map((c, i) => (
                    <th key={c.id} className="border border-black px-4 py-2">
                      Constraint {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buildConstraintTable(parameters, constraints).map((row) => (
                  <tr key={row.parameterId} className="bg-white">
                    <td className="border border-black px-4 py-2">
                      {row.parameterName}
                    </td>
                    {row.cells.map((cell) => (
                      <td
                        key={`${cell.constraintId}-${row.parameterId}`}
                        className={
                          cell.isIfWithPredicate
                            ? 'border border-black bg-sky-200 px-4 py-2'
                            : 'border border-black bg-white px-4 py-2'
                        }
                      >
                        <div className="flex gap-1">
                          <Button
                            type="secondary"
                            label={cell.ifOrThen ?? ''}
                            size="xs"
                            fontMono={true}
                            onClick={() => {
                              handleToggleCondition(
                                cell.constraintId,
                                row.parameterId,
                              )
                            }}
                          />
                          <TextInput
                            name="constraint_condition"
                            value={cell.predicate}
                            isValid={cell.isValid}
                            onChange={(e) => {
                              handleChangeCondition(
                                cell.constraintId,
                                row.parameterId,
                                e,
                              )
                            }}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="mt-3">
        {isEditing ? (
          <>
            <label
              className="mb-2 block text-sm font-bold text-gray-900"
              htmlFor="constraint_formula"
            >
              Constraint Formula
            </label>
            <textarea
              className="max-h-50 min-h-30 w-full rounded border border-black bg-white p-4 font-mono text-sm text-black focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none"
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
            <span className="mb-2 block text-sm font-bold text-gray-900">
              Constraint Formula
            </span>
            <pre
              className={
                constraintDirectEditMode
                  ? 'max-h-50 min-h-30 overflow-x-auto rounded bg-white p-4 font-mono text-sm text-black'
                  : 'max-h-50 min-h-30 overflow-x-auto rounded bg-gray-100 p-4 font-mono text-sm text-black'
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
      </div>
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

export default ConstraintsSection
