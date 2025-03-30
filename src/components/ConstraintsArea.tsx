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
    <section className="mx-10 mb-10 rounded-md border-2 bg-gray-50 p-7 shadow-md">
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-6">
          <p className="text-lg font-bold">Constraints</p>
        </div>
        <div className="col-span-3">
          <button
            type="button"
            className="w-full cursor-pointer rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onAddConstraint}
          >
            Add Constraint
          </button>
        </div>
        <div className="col-span-3">
          <button
            type="button"
            className="w-full cursor-pointer rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
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
              {parameters.map((p) => (
                <tr key={p.id} className="bg-white">
                  <td className="border border-black px-4 py-2">{p.name}</td>
                  {constraints.map((c) => (
                    <td
                      key={`${c.id}-${p.id}`}
                      className={
                        c.conditions.find(
                          (cond) => cond.parameterRef.id === p.id,
                        )?.ifOrThen === 'if' &&
                        c.conditions.find(
                          (cond) => cond.parameterRef.id === p.id,
                        )?.predicate !== ''
                          ? 'border border-black bg-sky-200 px-4 py-2'
                          : 'border border-black bg-white px-4 py-2'
                      }
                    >
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="w-15 cursor-pointer rounded bg-gray-500 px-3 py-1 font-mono text-sm text-white hover:bg-gray-600"
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
                          className="w-auto rounded border border-black bg-white px-1 py-1 focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none"
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
      <div className="mt-3">
        <pre className="max-h-50 min-h-30 overflow-x-auto rounded bg-gray-100 p-4 font-mono text-sm text-black">
          {constraints
            .map((v) => convertConstraintWrapper(v, parameters))
            .join('\n')}
        </pre>
      </div>
    </section>
  )
}

export default ConstraintsArea
