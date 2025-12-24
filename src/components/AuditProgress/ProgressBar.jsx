import './ProgressBar.css'

export default function ProgressBar({ progress }) {
  const { completed, total, percentage } = progress || { completed: 0, total: 0, percentage: 0 }

  return (
    <div className="progress-bar-component">
      <div className="progress-stats">
        <span className="progress-count">
          {completed} / {total} parts
        </span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  )
}
