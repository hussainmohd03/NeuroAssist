import { timeAgo } from '../../utils/timeAgo'
const OracleToast = ({ message, date }) => {
  return (
    <div className="oracle-toast">
      <div className="oracle-toast-header">
        <div className="oracle-left">
          <img src="/logos/oracle_notif_logo.svg" className="oracle-icon" />
          <span className="oracle-title">ORACLE</span>
        </div>

        <span className="oracle-time">{timeAgo(date)}</span>
      </div>

      <p className="oracle-message">{message}</p>
    </div>
  )
}

export default OracleToast
