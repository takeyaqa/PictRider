import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  PictParameter,
  PictCondition,
  PictConstraint,
  PictOutput,
} from './pict/pict-types'
import { PictRunner } from './pict/pict-runner'
import {
  ParametersArea,
  ConstraintsArea,
  RunButtonArea,
  ErrorMessageArea,
  OutputArea,
} from './components'

function App() {
  const INITIAL_PARAMETERS = [
    {
      id: uuidv4(),
      name: 'Type',
      values: 'Single, Span, Stripe, Mirror, RAID-5',
    },
    {
      id: uuidv4(),
      name: 'Size',
      values: '10, 100, 500, 1000, 5000, 10000, 40000',
    },
    { id: uuidv4(), name: 'Format method', values: 'Quick, Slow' },
    { id: uuidv4(), name: 'File system', values: 'FAT, FAT32, NTFS' },
    { id: uuidv4(), name: 'Cluster size', values: 'Quick, Slow' },
    { id: uuidv4(), name: 'Compression', values: 'ON, OFF' },
  ]

  const [parameters, setParameters] =
    useState<PictParameter[]>(INITIAL_PARAMETERS)
  const [constraints, setConstraints] = useState([
    convertToConstraint(INITIAL_PARAMETERS),
  ])
  const [enabledConstraints, setEnabledConstraints] = useState(false)
  const [output, setOutput] = useState<PictOutput | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [pictRunnerLoaded, setPictRunnerLoaded] = useState(false)
  const pictRunner = useRef<PictRunner>(null)

  useEffect(() => {
    const loadPictRunner = async () => {
      pictRunner.current = new PictRunner()
      await pictRunner.current.init()
      setPictRunnerLoaded(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadPictRunner()
  }, [])

  function handleParameterInputChange(
    id: string,
    field: 'name' | 'values',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newParameters = [...parameters]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    newParameters.find((p) => p.id === id)![field] = e.target.value
    setParameters(newParameters)
  }

  function enableConstraintsArea() {
    setEnabledConstraints(!enabledConstraints)
  }

  function convertToConstraint(parameters: PictParameter[]): PictConstraint {
    const conditions: PictCondition[] = parameters.map((value) => {
      return { ifOrThen: 'if', parameter: value.name, predicate: '' }
    })
    return { id: uuidv4(), conditions: conditions }
  }

  function addConstraint() {
    setConstraints([...constraints, convertToConstraint(parameters)])
  }

  function removeConstraint() {
    if (constraints.length > 1) {
      const newConstraints = [...constraints]
      newConstraints.pop()
      setConstraints(newConstraints)
    }
  }

  function handleClickCondition(
    constraintIndex: number,
    parameterIndex: number,
  ) {
    const currentCondition =
      constraints[constraintIndex].conditions[parameterIndex].ifOrThen
    const newCondition = currentCondition === 'if' ? 'then' : 'if'
    const newConstraints = [...constraints]
    newConstraints[constraintIndex].conditions[parameterIndex].ifOrThen =
      newCondition
    setConstraints(newConstraints)
  }

  function handleChangeCondition(
    constraintIndex: number,
    parameterIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newConstraints = [...constraints]
    newConstraints[constraintIndex].conditions[parameterIndex].predicate =
      e.target.value
    setConstraints(newConstraints)
  }

  function addParameterInputRow() {
    setParameters([...parameters, { id: uuidv4(), name: '', values: '' }])
    const newConstraints = constraints.map((constraint) => ({
      ...constraint,
      conditions: constraint.conditions.map((condition) => ({ ...condition })),
    }))
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < newConstraints.length; i++) {
      newConstraints[i].conditions.push({
        ifOrThen: 'if',
        parameter: '',
        predicate: '',
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
    }
  }

  function clearAllParameterValues() {
    const emptyParameters = parameters.map(() => ({
      id: uuidv4(),
      name: '',
      values: '',
    }))
    setParameters(emptyParameters)
  }

  function runPict() {
    if (!pictRunnerLoaded || !pictRunner.current) {
      return
    }
    try {
      const output = pictRunner.current.run(parameters, constraints)
      setErrorMessage('')
      setOutput(output)
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message)
        setOutput(null)
      }
    }
  }

  return (
    <div className="container">
      <h1>PictRider</h1>
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
      <RunButtonArea pictRunnerLoaded={pictRunnerLoaded} onClickRun={runPict} />
      <ErrorMessageArea message={errorMessage} />
      <OutputArea output={output} />
    </div>
  )
}

export default App
