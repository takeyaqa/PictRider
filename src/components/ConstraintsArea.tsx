import { PictParameter, PictConstraint } from '../types'
import { convertConstraint } from '../pict/pict-helper'

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
      <div className="row mt-3">
        <div className="col-8">
          <h4>Constraints</h4>
        </div>
        <div className="col-2">
          <button
            type="button"
            className="btn btn-success"
            onClick={onAddConstraint}
          >
            Add Constraint
          </button>
        </div>
        <div className="col-2">
          <button
            type="button"
            className="btn btn-danger"
            onClick={onRemoveConstraint}
            disabled={constraints.length <= 1}
          >
            Remove Constraint
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <table className="table table-striped-columns">
            <thead>
              <tr>
                <th>Parameter</th>
                {constraints.map((c, i) => (
                  <th key={c.id}>Constraint {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parameters.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  {constraints.map((c) => (
                    <td key={`${c.id}-${p.id}`}>
                      <button
                        type="button"
                        className="btn btn-secondary font-monospace"
                        onClick={() => {
                          onClickCondition(c.id, p.id)
                        }}
                      >
                        {
                          c.conditions.find((cond) => cond.parameterId === p.id)
                            ?.ifOrThen
                        }
                      </button>
                      <input
                        type="text"
                        onChange={(e) => {
                          onChangeCondition(c.id, p.id, e)
                        }}
                        value={
                          c.conditions.find((cond) => cond.parameterId === p.id)
                            ?.predicate
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <pre>{constraints.map((v) => convertConstraint(v)).join('\n')}</pre>
        </div>
      </div>
    </>
  )
}

export default ConstraintsArea
