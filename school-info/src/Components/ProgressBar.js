import React from 'react'
import "../ComponentsCSS/ProgressBar.css"

function ProgressBar({ progress }) {
    return (
        <div
            className='progress-bar'
            style={{ width: progress + '%' }}>
            {progress} %
        </div>
    )
}

export default ProgressBar;