import { useState, useEffect, useRef } from 'react'
import { PictRunner } from '../pict/pict-runner'
import {
  ParametersArea,
  OptionsArea,
  ConstraintsArea,
  RunButtonArea,
  ErrorMessageArea,
  ResultArea,
} from '../components'
import { uuidv4 } from '../helpers'
import {
  PictParameter,
  PictCondition,
  PictConstraint,
  PictOutput,
  PictConfig,
} from '../types'

// Interface for the combined state
interface PictModelState {
  parameters: PictParameter[]
  parameterError: string[]
  constraints: PictConstraint[]
  constraintsError: string[]
}
import { getInitialParameters } from '../initial-parameters'

const invalidParameterNameCharacters = [
  '#', // comments identifier, constraints operator
  ':', // parameter and values separator
  '<', // values reference identifier, constraints operator
  '>', // values reference identifier, constraints operator
  '(', // values weight identifier
  ')', // values weight identifier
  '|', // values alias identifier
  ',', // values separator
  '~', // values negation identifier
  '{', // sub-models identifier
  '}', // sub-models identifier
  '@', // sub-models identifier
  '[', // constraints parameter identifier
  ']', // constraints parameter identifier
  ';', // constraints terminator
  '=', // constraints operator
  '!', // constraints operator
  '+', // constraints operator
  '&', // constraints operator
  '*', // pattern string wildcard
  '?', // pattern string wildcard
]

const invalidParameterValuesCharacters = [
  '#', // comments identifier, constraints operator
  ':', // parameter and values separator
  '{', // sub-models identifier
  '}', // sub-models identifier
  '@', // sub-models identifier
  '[', // constraints parameter identifier
  ']', // constraints parameter identifier
  ';', // constraints terminator
  '=', // constraints operator
  '!', // constraints operator
  '+', // constraints operator
  '&', // constraints operator
  '*', // pattern string wildcard
  '?', // pattern string wildcard
]

const invalidConstraintCharacters = [
  ':', // parameter and values separator
  '(', // values weight identifier
  ')', // values weight identifier
  '|', // values alias identifier
  ',', // values separator
  '~', // values negation identifier
  '{', // sub-models identifier
  '}', // sub-models identifier
  '@', // sub-models identifier
  '[', // constraints parameter identifier
  ']', // constraints parameter identifier
  ';', // constraints terminator
]

interface AppMainProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function AppMain({ pictRunnerInjection }: AppMainProps) {
  const [modelState, setModelState] = useState<PictModelState>(() => {
    const initialParameters = [...getInitialParameters()]
    return {
      parameters: initialParameters,
      parameterError: [],
      constraints: [createConstraintFromParameters(initialParameters)],
      constraintsError: [],
    }
  })
  const [config, setConfig] = useState<PictConfig>({
    enableConstraints: false,
    showModelFile: false,
    orderOfCombinations: 2,
  })
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
    const newParameters = [...modelState.parameters]

    // Reset validation flags
    for (const parameter of newParameters) {
      parameter.isValidName = true
      parameter.isValidValues = true
    }
    const newParameter = newParameters.find((p) => p.id === id)
    if (!newParameter) {
      return
    }
    newParameter[field] = e.target.value
    const errors: string[] = []

    // Check for duplicate parameter
    if (field === 'name') {
      const parameterNames = newParameters.map((p) => p.name)
      const duplicates = parameterNames.filter(
        (item, index) => item && parameterNames.indexOf(item) !== index,
      )
      if (duplicates.length > 0) {
        for (const parameter of newParameters) {
          if (duplicates.includes(parameter.name)) {
            parameter.isValidName = false
          }
        }
        errors.push('Parameter names must be unique.')
      }
    }

    // Check for invalid characters
    let invalidParameterName = false
    let invalidParameterValues = false
    for (const parameter of newParameters) {
      if (
        invalidParameterNameCharacters.some((char) =>
          parameter.name.includes(char),
        )
      ) {
        parameter.isValidName = false
        invalidParameterName = true
      }
      if (
        invalidParameterValuesCharacters.some((char) =>
          parameter.values.includes(char),
        )
      ) {
        parameter.isValidValues = false
        invalidParameterValues = true
      }
    }
    if (invalidParameterName) {
      errors.push(
        `Parameter name cannot contain special characters: ${invalidParameterNameCharacters.map((s) => `"${s}"`).join(', ')}`,
      )
    }
    if (invalidParameterValues) {
      errors.push(
        `Parameter values cannot contain special characters: ${invalidParameterValuesCharacters.map((s) => `"${s}"`).join(', ')}`,
      )
    }

    setModelState({
      ...modelState,
      parameters: newParameters,
      parameterError: errors,
    })
  }

  function handleChangeConfig(
    type: 'enableConstraints' | 'showModelFile' | 'orderOfCombinations',
    e?: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newConfig = { ...config }
    switch (type) {
      case 'enableConstraints': {
        newConfig.enableConstraints = !config.enableConstraints
        break
      }
      case 'showModelFile': {
        newConfig.showModelFile = !config.showModelFile
        break
      }
      case 'orderOfCombinations': {
        if (e) {
          try {
            if (e.target.value !== '') {
              newConfig.orderOfCombinations = Number(e.target.value)
            }
          } catch {
            newConfig.orderOfCombinations = 2
          }
        }
        break
      }
    }
    setConfig(newConfig)
  }

  function addConstraint() {
    // Limit to maximum 50 constraints
    if (modelState.constraints.length >= 50) {
      return
    }
    setModelState({
      ...modelState,
      constraints: [
        ...modelState.constraints,
        createConstraintFromParameters(modelState.parameters),
      ],
    })
  }

  function createConstraintFromParameters(
    parameters: PictParameter[],
  ): PictConstraint {
    const conditions: PictCondition[] = parameters.map((p) => {
      return {
        ifOrThen: 'if',
        predicate: '',
        parameterRef: p,
        isValid: true,
      }
    })
    return { id: uuidv4(), conditions: conditions }
  }

  function removeConstraint() {
    if (modelState.constraints.length > 1) {
      const newConstraints = [...modelState.constraints]
      newConstraints.pop()
      setModelState({
        ...modelState,
        constraints: newConstraints,
      })
    }
  }

  function handleClickCondition(constraintId: string, parameterId: string) {
    const newConstraints = [...modelState.constraints]
    const newCondition = searchCondition(
      newConstraints,
      constraintId,
      parameterId,
    )
    newCondition.ifOrThen = newCondition.ifOrThen === 'if' ? 'then' : 'if'
    setModelState({
      ...modelState,
      constraints: newConstraints,
    })
  }

  function handleChangeCondition(
    constraintId: string,
    parameterId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newConstraints = [...modelState.constraints]
    const newCondition = searchCondition(
      newConstraints,
      constraintId,
      parameterId,
    )
    newCondition.predicate = e.target.value
    // Reset validation flags
    for (const condition of newConstraints) {
      for (const c of condition.conditions) {
        c.isValid = true
      }
    }
    // Check for invalid characters
    const errors: string[] = []
    let invalidConstraint = false
    for (const constraint of newConstraints) {
      for (const condition of constraint.conditions) {
        if (
          invalidConstraintCharacters.some((char) =>
            condition.predicate.includes(char),
          )
        ) {
          condition.isValid = false
          invalidConstraint = true
        }
      }
    }
    if (invalidConstraint) {
      errors.push(
        `Constraints cannot contain special characters: ${invalidConstraintCharacters.map((s) => `"${s}"`).join(', ')}`,
      )
    }
    setModelState({
      ...modelState,
      constraints: newConstraints,
      constraintsError: errors,
    })
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
    // Limit to maximum 50 rows
    if (modelState.parameters.length >= 50) {
      return
    }

    const newParameter = {
      id: uuidv4(),
      name: '',
      values: '',
      isValidName: true,
      isValidValues: true,
    }
    const newParameters = [...modelState.parameters, newParameter]
    const newConstraints = modelState.constraints.map((constraint) => ({
      ...constraint,
      conditions: constraint.conditions.map((condition) => ({ ...condition })),
    }))
    for (const newConstraint of newConstraints) {
      newConstraint.conditions.push({
        ifOrThen: 'if',
        predicate: '',
        parameterRef: newParameter,
        isValid: true,
      })
    }
    setModelState({
      ...modelState,
      parameters: newParameters,
      constraints: newConstraints,
    })
  }

  function removeParameterInputRow() {
    if (modelState.parameters.length > 1) {
      const newParameters = [...modelState.parameters]
      newParameters.pop()
      const newConstraints = modelState.constraints.map((constraint) => ({
        ...constraint,
        conditions: constraint.conditions.map((condition) => ({
          ...condition,
        })),
      }))
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < newConstraints.length; i++) {
        newConstraints[i].conditions.pop()
      }
      setModelState({
        ...modelState,
        parameters: newParameters,
        constraints: newConstraints,
      })
    }
  }

  function clearAllParameterValues() {
    const emptyParameters = modelState.parameters.map(() => ({
      id: uuidv4(),
      name: '',
      values: '',
      isValidName: true,
      isValidValues: true,
    }))
    setModelState({
      ...modelState,
      parameters: emptyParameters,
    })
  }

  function runPict() {
    if (!pictRunnerLoaded || !pictRunner.current) {
      return
    }
    try {
      const fixedParameters = modelState.parameters
        .filter((p) => p.name !== '' && p.values !== '')
        .map((p) => ({ name: p.name, values: p.values }))
      const fixedConstraints = modelState.constraints.map((c) => ({
        conditions: c.conditions.map((cond) => ({
          ifOrThen: cond.ifOrThen,
          predicate: cond.predicate,
          parameter: cond.parameterRef.name,
        })),
      }))
      const output = config.enableConstraints
        ? pictRunner.current.run(fixedParameters, {
            constraints: fixedConstraints,
            options: config,
          })
        : pictRunner.current.run(fixedParameters, {
            options: config,
          })
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
      setOutput({ header, body, modelFile: output.modelFile })
      setErrorMessage('')
    } catch (e) {
      if (e instanceof Error) {
        setOutput(null)
        setErrorMessage(e.message)
      }
    }
  }

  return (
    <main className="bg-white">
      <ParametersArea
        parameters={modelState.parameters}
        messages={modelState.parameterError}
        onInputChange={handleParameterInputChange}
        onAddRow={addParameterInputRow}
        onRemoveRow={removeParameterInputRow}
        onClearValues={clearAllParameterValues}
      />
      <OptionsArea config={config} handleChangeConfig={handleChangeConfig} />
      <ConstraintsArea
        config={config}
        parameters={modelState.parameters}
        constraints={modelState.constraints}
        messages={modelState.constraintsError}
        onAddConstraint={addConstraint}
        onRemoveConstraint={removeConstraint}
        onClickCondition={handleClickCondition}
        onChangeCondition={handleChangeCondition}
      />
      <RunButtonArea
        parameters={modelState.parameters}
        constraints={modelState.constraints}
        pictRunnerLoaded={pictRunnerLoaded}
        onClickRun={runPict}
      />
      <ErrorMessageArea message={errorMessage} />
      <ResultArea config={config} output={output} />
    </main>
  )
}

export default AppMain
