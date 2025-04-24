import { useState } from 'react'
import { Parameter, Constraint, Config, ConstraintText } from '../types'

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

interface ConstraintsAreaProps {
  config: Config
  parameters: Parameter[]
  constraints: Constraint[]
  constraintTexts: ConstraintText[]
  messages: string[]
  handleToggleCondition: (constraintId: string, parameterId: string) => void
  handleChangeCondition: (
    constraintId: string,
    parameterId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
  handleClickAddConstraint: () => void
  handleClickRemoveConstraint: () => void
}

function ConstraintsArea({
  config,
  parameters,
  constraints,
  constraintTexts,
  messages,
  handleToggleCondition,
  handleChangeCondition,
  handleClickAddConstraint,
  handleClickRemoveConstraint,
}: ConstraintsAreaProps) {
  const [directEditMode, setDirectEditMode] = useState(false)
  if (!config.enableConstraints) {
    return null
  }

  return (
    <section className="mx-2 mb-10 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-6">
          <h2 className="text-lg font-bold" id="constraints-heading">
            Constraints
          </h2>
        </div>
        <div className="col-span-6 flex items-center justify-end gap-5">
          {!directEditMode && (
            <>
              <button
                type="button"
                className="w-25 cursor-pointer rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 lg:w-50"
                onClick={handleClickAddConstraint}
                disabled={constraints.length >= 50}
              >
                Add Constraint
              </button>
              <button
                type="button"
                className="w-25 cursor-pointer rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 lg:w-50"
                onClick={handleClickRemoveConstraint}
                disabled={constraints.length <= 1}
              >
                Remove Constraint
              </button>
              <button
                type="button"
                className="w-25 cursor-pointer rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 lg:w-50"
                onClick={() => {
                  setDirectEditMode(!directEditMode)
                }}
              >
                Edit Directly
              </button>
            </>
          )}
        </div>
      </div>
      {!directEditMode && (
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
                          <button
                            type="button"
                            className="w-15 cursor-pointer rounded bg-gray-500 px-3 py-1 font-mono text-sm text-white hover:bg-gray-600"
                            onClick={() => {
                              handleToggleCondition(
                                cell.constraintId,
                                row.parameterId,
                              )
                            }}
                          >
                            {cell.ifOrThen}
                          </button>
                          <input
                            type="text"
                            name="constraint_condition"
                            className={
                              cell.isValid
                                ? 'w-auto rounded border border-black bg-white px-1 py-1 focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none'
                                : 'w-auto rounded border border-red-500 bg-white px-1 py-1 focus:border-transparent focus:ring-3 focus:ring-red-500 focus:outline-none'
                            }
                            autoComplete="off"
                            onChange={(e) => {
                              handleChangeCondition(
                                cell.constraintId,
                                row.parameterId,
                                e,
                              )
                            }}
                            value={cell.predicate}
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
        <pre className="max-h-50 min-h-30 overflow-x-auto rounded bg-gray-100 p-4 font-mono text-sm text-black">
          {constraintTexts.map((constraintText) => (
            <code key={constraintText.id}>{`${constraintText.text}\n`}</code>
          ))}
        </pre>
      </div>
      {messages.length > 0 && (
        <div
          className="mt-5 rounded-md border-2 border-red-400 bg-red-100 p-7 text-red-700"
          role="alert"
        >
          {messages.map((message, index) => (
            // eslint-disable-next-line react-x/no-array-index-key
            <p key={index}>{message}</p>
          ))}
        </div>
      )}
    </section>
  )
}

export default ConstraintsArea
