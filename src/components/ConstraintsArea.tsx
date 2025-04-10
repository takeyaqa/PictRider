import { PictParameter, PictConstraint } from '../types'
import { convertConstraintWrapper } from '../helpers'

interface ConstraintTableCell {
  constraintId: string
  ifOrThen: 'if' | 'then' | undefined
  predicate: string
  isIfWithPredicate: boolean
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
  parameters: PictParameter[],
  constraints: PictConstraint[],
): ConstraintTableRow[] {
  return parameters.map((parameter) => {
    const cells = constraints.map((constraint) => {
      const condition = constraint.conditions.find(
        (cond) => cond.parameterRef.id === parameter.id,
      )

      const ifOrThen = condition?.ifOrThen
      const predicate = condition?.predicate ?? ''
      const isIfWithPredicate = ifOrThen === 'if' && predicate !== ''

      return {
        constraintId: constraint.id,
        ifOrThen,
        predicate,
        isIfWithPredicate,
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
  enabledConstraints: boolean
  parameters: PictParameter[]
  constraints: PictConstraint[]
  onAddConstraint: () => void
  onRemoveConstraint: () => void
  onClickCondition: (constraintId: string, parameterId: string) => void
  onChangeCondition: (
    constraintId: string,
    parameterId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

function ConstraintsArea({
  enabledConstraints,
  parameters,
  constraints,
  onAddConstraint,
  onRemoveConstraint,
  onClickCondition,
  onChangeCondition,
}: ConstraintsAreaProps) {
  if (!enabledConstraints) {
    return null
  }
  return (
    <section className="mx-2 mb-10 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-6">
          <h2 className="text-lg font-bold">Constraints</h2>
        </div>
        <div className="col-span-6 flex items-center justify-end gap-5">
          <button
            type="button"
            className="w-25 cursor-pointer rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 lg:w-50"
            onClick={onAddConstraint}
            disabled={constraints.length >= 50}
          >
            Add Constraint
          </button>
          <button
            type="button"
            className="w-25 cursor-pointer rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 lg:w-50"
            onClick={onRemoveConstraint}
            disabled={constraints.length <= 1}
          >
            Remove Constraint
          </button>
        </div>
      </div>
      <div className="">
        <div className="overflow-x-auto">
          <table className="border-collapse border border-black">
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
                            onClickCondition(cell.constraintId, row.parameterId)
                          }}
                        >
                          {cell.ifOrThen}
                        </button>
                        <input
                          type="text"
                          name="constraint_condition"
                          className="w-auto rounded border border-black bg-white px-1 py-1 focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none"
                          autoComplete="off"
                          onChange={(e) => {
                            onChangeCondition(
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
      <div className="mt-3">
        <pre className="max-h-50 min-h-30 overflow-x-auto rounded bg-gray-100 p-4 font-mono text-sm text-black">
          {convertConstraintWrapper(constraints, parameters)}
        </pre>
      </div>
    </section>
  )
}

export default ConstraintsArea
