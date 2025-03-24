import { PictParameter, PictConstraint } from '../types'
import { convertConstraintWrapper } from '../helpers'

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
    <>
      <div className="-mx-2 mt-6 flex flex-wrap">
        <div className="w-2/3 px-2">
          <h4 className="text-xl font-medium">Constraints</h4>
        </div>
        <div className="w-1/6 px-2">
          <button
            type="button"
            className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            onClick={onAddConstraint}
          >
            Add Constraint
          </button>
        </div>
        <div className="w-1/6 px-2">
          <button
            type="button"
            className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onRemoveConstraint}
            disabled={constraints.length <= 1}
          >
            Remove Constraint
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Parameter</th>
                {constraints.map((c, i) => (
                  <th key={c.id} className="border px-4 py-2 text-left">
                    Constraint {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parameters.map((p, index) => (
                <tr
                  key={p.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border px-4 py-2">{p.name}</td>
                  {constraints.map((c) => (
                    <td key={`${c.id}-${p.id}`} className="border px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="rounded bg-gray-500 px-3 py-1 font-mono text-sm text-white hover:bg-gray-600"
                          onClick={() => {
                            onClickCondition(c.id, p.id)
                          }}
                        >
                          {
                            c.conditions.find(
                              (cond) => cond.parameterRef.id === p.id,
                            )?.ifOrThen
                          }
                        </button>
                        <input
                          type="text"
                          name="constraint_condition"
                          className="flex-1 rounded border border-gray-300 px-2 py-1 focus:border-transparent focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          autoComplete="off"
                          onChange={(e) => {
                            onChangeCondition(c.id, p.id, e)
                          }}
                          value={
                            c.conditions.find(
                              (cond) => cond.parameterRef.id === p.id,
                            )?.predicate
                          }
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
      <div className="mt-4">
        <div className="w-full">
          <pre className="overflow-x-auto rounded bg-gray-100 p-4">
            {constraints
              .map((v) => convertConstraintWrapper(v, parameters))
              .join('\n')}
          </pre>
        </div>
      </div>
    </>
  )
}

export default ConstraintsArea
