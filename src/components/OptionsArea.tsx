interface OptionsAreaProps {
  enabledConstraints: boolean
  onEnableConstraintsArea: () => void
}

function OptionsArea({
  enabledConstraints,
  onEnableConstraintsArea,
}: OptionsAreaProps) {
  return (
    <section className="mx-2 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <h2 className="mb-5 text-lg font-bold">Options</h2>
      <div>
        <label className="cursor-pointer" htmlFor="enable-constraints-button">
          <input
            type="checkbox"
            className="mr-1 cursor-pointer rounded"
            id="enable-constraints-button"
            autoComplete="off"
            checked={enabledConstraints}
            onChange={onEnableConstraintsArea}
          />
          Constraints
        </label>
      </div>
    </section>
  )
}

export default OptionsArea
