import { formatDateTime } from '../../utils'
const TableRow = ({ study }) => {
  const isCompleted = study.status === 'COMPLETED'

  return (
    <>
      <div className="table-row">
        <div className="study-filename">
          <img src="/icons/filetype.svg" alt="file type" className="file-tag" />
          NHRA-{study.user.nhra}-Patient-{study.patientId}
        </div>

        <div className="study-date">{formatDateTime(study.createdAt)}</div>

        <div className="study-status">
          {isCompleted ? (
            <>
              <span className="status-complete">Complete.</span>
              <img
                className="download-icon"
                src="/icons/download-icon.svg"
                alt="download"
                onClick={() => window.open(study.report.filePath, '_blank')}
              />
            </>
          ) : (
            <span className="status-processing">Processing</span>
          )}
        </div>
      </div>
    </>
  )
}
export default TableRow
