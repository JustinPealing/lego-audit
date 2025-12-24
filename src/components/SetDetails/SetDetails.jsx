import './SetDetails.css'

export default function SetDetails({ setData }) {
  return (
    <div className="set-details">
      {setData.set_img_url && (
        <div className="set-image-container">
          <img
            src={setData.set_img_url}
            alt={setData.name}
            className="set-image"
          />
        </div>
      )}

      <div className="set-info">
        <h2 className="set-name">{setData.name}</h2>
        <div className="set-meta">
          <span className="set-number">#{setData.set_num}</span>
          {setData.year && (
            <>
              <span className="separator">•</span>
              <span className="set-year">{setData.year}</span>
            </>
          )}
          {setData.num_parts && (
            <>
              <span className="separator">•</span>
              <span className="set-parts">{setData.num_parts} parts</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
