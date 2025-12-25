const StartStudy = ({ setStarting }) => {
  return (
    <>
      <div className="starting-container">
        <img src="/images/bar.svg" alt="" id="bar-img" />
        <div className="starting-content">
          <h1 className="create-study-title">
            Intelligence––like never before.
          </h1>
          <div className="image-container">
            <div className="image-overlay">
              <h3>Oracle Health Possibilities</h3>
              <p>
                You can now process your local scans for precise and detailed
                discoveries. Explore the exclusive offerings of OHP.
              </p>
              <button
                className="uncover-button"
                onClick={() => setStarting(false)}
              >
                Uncover a new world
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default StartStudy
