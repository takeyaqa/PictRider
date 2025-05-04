import { convertTableToConstraints } from '../../constraint-converter'
import { printCodeFromAST } from '../../pict-constraints-parser'
import { Constraint, FixedConstraint, Parameter } from '../../types'

export function fixConstraint(
  constraints: Constraint[],
  parameters: Parameter[],
): FixedConstraint[] {
  return constraints.map((c) => ({
    conditions: c.conditions.map((cond) => {
      const parameter = parameters.find((p) => p.id === cond.parameterId)
      if (!parameter) {
        throw new Error(
          `Parameter not found for condition: ${cond.parameterId}`,
        )
      }
      return {
        ifOrThen: cond.ifOrThen,
        predicate: cond.predicate,
        parameterName: parameter.name,
      }
    }),
  }))
}

export function printConstraints(
  constraints: FixedConstraint[],
  parameters: string[],
): string[] {
  return printCodeFromAST(convertTableToConstraints(constraints, parameters))
}
