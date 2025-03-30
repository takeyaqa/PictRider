interface OptionsAreaProps {
  enabledConstraints: boolean
  onEnableConstraintsArea: () => void
}

function OptionsArea({
  enabledConstraints,
  onEnableConstraintsArea,
}: OptionsAreaProps) {
  return (
    <section className="mx-10 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md">
      <div className="">
        <input
          type="checkbox"
          className="mr-1 cursor-pointer rounded"
          id="enable-constraints-button"
          autoComplete="off"
          checked={enabledConstraints}
          onChange={onEnableConstraintsArea}
        />
        <label className="cursor-pointer" htmlFor="enable-constraints-button">
          Constraints
        </label>
      </div>
    </section>
  )
}

export default OptionsArea
