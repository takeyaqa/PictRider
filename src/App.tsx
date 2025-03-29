import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PictRunner } from './pict/pict-runner'
import {
  HeaderArea,
  ParametersArea,
  ConstraintsArea,
  RunButtonArea,
  ErrorMessageArea,
  ResultArea,
  FooterArea,
} from './components'
import {
  PictParameter,
  PictCondition,
  PictConstraint,
  PictOutput,
} from './types'
import { getInitialParameters } from './initial-parameters'

interface AppProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function App({ pictRunnerInjection }: AppProps) {
  const [parameters, setParameters] = useState<PictParameter[]>([
    ...getInitialParameters(),
  ])
  const [constraints, setConstraints] = useState([
    createConstraintFromParameters(parameters),
  ])
  const [enabledConstraints, setEnabledConstraints] = useState(false)
  const [output, setOutput] = useState<PictOutput | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [pictRunnerLoaded, setPictRunnerLoaded] = useState(false)
  const pictRunner = useRef<PictRunner>(null)

  useEffect(() => {
    // Use the injected PictRunner for testing
    if (pictRunnerInjection) {
      pictRunner.current = pictRunnerInjection
      setPictRunnerLoaded(true)
      return
    }
    const loadPictRunner = async () => {
      pictRunner.current = new PictRunner()
      await pictRunner.current.init()
      setPictRunnerLoaded(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadPictRunner()
  }, [pictRunnerInjection])

  function handleParameterInputChange(
    id: string,
    field: 'name' | 'values',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    // Update the parameter value
    const newParameters = [...parameters]
    const newParameter = newParameters.find((p) => p.id === id)
    if (!newParameter) {
      return
    }
    newParameter[field] = e.target.value

    // Check for duplicate parameter
    if (field === 'name') {
      const parameterNames = newParameters.map((p) => p.name)
      const duplicates = parameterNames.filter(
        (item, index) => item && parameterNames.indexOf(item) !== index,
      )
      if (duplicates.length > 0) {
        for (const parameter of newParameters) {
          if (duplicates.includes(parameter.name)) {
            parameter.isValid = false
          } else {
            parameter.isValid = true
          }
        }
        setErrorMessage('Parameter names must be unique.')
      } else {
        for (const parameter of newParameters) {
          parameter.isValid = true
        }
        setErrorMessage('')
      }
    }
    setParameters(newParameters)
  }

  function enableConstraintsArea() {
    setEnabledConstraints(!enabledConstraints)
  }

  function addConstraint() {
    setConstraints([...constraints, createConstraintFromParameters(parameters)])
  }

  function createConstraintFromParameters(
    parameters: PictParameter[],
  ): PictConstraint {
    const conditions: PictCondition[] = parameters.map((p) => {
      return {
        ifOrThen: 'if',
        predicate: '',
        parameterRef: p,
      }
    })
    return { id: uuidv4(), conditions: conditions }
  }

  function removeConstraint() {
    if (constraints.length > 1) {
      const newConstraints = [...constraints]
      newConstraints.pop()
      setConstraints(newConstraints)
    }
  }

  function handleClickCondition(constraintId: string, parameterId: string) {
    const newConstraints = [...constraints]
    const newCondition = searchCondition(
      newConstraints,
      constraintId,
      parameterId,
    )
    newCondition.ifOrThen = newCondition.ifOrThen === 'if' ? 'then' : 'if'
    setConstraints(newConstraints)
  }

  function handleChangeCondition(
    constraintId: string,
    parameterId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newConstraints = [...constraints]
    const newCondition = searchCondition(
      newConstraints,
      constraintId,
      parameterId,
    )
    newCondition.predicate = e.target.value
    setConstraints(newConstraints)
  }

  function searchCondition(
    constraints: PictConstraint[],
    constraintId: string,
    parameterId: string,
  ): PictCondition {
    const constraint = constraints.find((c) => c.id === constraintId)
    if (!constraint) {
      throw new Error('Constraint not found')
    }
    const condition = constraint.conditions.find(
      (p) => p.parameterRef.id === parameterId,
    )
    if (!condition) {
      throw new Error('Condition not found')
    }
    return condition
  }

  function addParameterInputRow() {
    const newParameter = { id: uuidv4(), name: '', values: '', isValid: true }
    setParameters([...parameters, newParameter])
    const newConstraints = constraints.map((constraint) => ({
      ...constraint,
      conditions: constraint.conditions.map((condition) => ({ ...condition })),
    }))
    for (const newConstraint of newConstraints) {
      newConstraint.conditions.push({
        ifOrThen: 'if',
        predicate: '',
        parameterRef: newParameter,
      })
    }
    setConstraints(newConstraints)
  }

  function removeParameterInputRow() {
    if (parameters.length > 1) {
      const newParameters = [...parameters]
      newParameters.pop()
      setParameters(newParameters)
      const newConstraints = constraints.map((constraint) => ({
        ...constraint,
        conditions: constraint.conditions.map((condition) => ({
          ...condition,
        })),
      }))
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < newConstraints.length; i++) {
        newConstraints[i].conditions.pop()
      }
      setConstraints(newConstraints)
    }
  }

  function clearAllParameterValues() {
    const emptyParameters = parameters.map(() => ({
      id: uuidv4(),
      name: '',
      values: '',
      isValid: true,
    }))
    setParameters(emptyParameters)
  }

  function runPict() {
    if (!pictRunnerLoaded || !pictRunner.current) {
      return
    }
    try {
      const fixedParameters = parameters
        .filter((p) => p.name !== '' && p.values !== '')
        .map((p) => ({ name: p.name, values: p.values }))
      const fixedConstraints = constraints.map((c) => ({
        conditions: c.conditions.map((cond) => ({
          ifOrThen: cond.ifOrThen,
          predicate: cond.predicate,
          parameter: cond.parameterRef.name,
        })),
      }))
      const output = enabledConstraints
        ? pictRunner.current.run(fixedParameters, fixedConstraints)
        : pictRunner.current.run(fixedParameters)
      const header = output.header.map((h, i) => {
        return { id: i, name: h }
      })
      const body = output.body.map((row, i) => {
        return {
          id: i,
          values: row.map((col, j) => {
            return { id: j, value: col }
          }),
        }
      })
      setOutput({ header, body })
      setErrorMessage('')
    } catch (e) {
      if (e instanceof Error) {
        setOutput(null)
        setErrorMessage(e.message)
      }
    }
  }

  return (
    <>
      <HeaderArea />
      <ParametersArea
        parameters={parameters}
        enabledConstraints={enabledConstraints}
        onEnableConstraintsArea={enableConstraintsArea}
        onInputChange={handleParameterInputChange}
        onAddRow={addParameterInputRow}
        onRemoveRow={removeParameterInputRow}
        onClearValues={clearAllParameterValues}
      />
      <ConstraintsArea
        enabledConstraints={enabledConstraints}
        parameters={parameters}
        constraints={constraints}
        onAddConstraint={addConstraint}
        onRemoveConstraint={removeConstraint}
        onClickCondition={handleClickCondition}
        onChangeCondition={handleChangeCondition}
      />
      <RunButtonArea
        parameters={parameters}
        pictRunnerLoaded={pictRunnerLoaded}
        onClickRun={runPict}
      />
      <ErrorMessageArea message={errorMessage} />
      <ResultArea output={output} />
      <FooterArea />
    </>
  )
}

export default App
