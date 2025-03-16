interface RunButtonAreaProps {
  pictRunnerLoaded: boolean
  onClickRun: () => void
}

function RunButtonArea({ pictRunnerLoaded, onClickRun }: RunButtonAreaProps) {
  return (
    <div className="row mt-3">
      <div className="col-3">
        <input
          type="submit"
          value="実行"
          className="btn btn-primary"
          disabled={!pictRunnerLoaded}
          onClick={onClickRun}
        />
      </div>
    </div>
  )
}

export default RunButtonArea
