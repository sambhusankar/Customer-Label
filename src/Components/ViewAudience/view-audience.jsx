import React, { useRef, useState, useEffect } from 'react'
import './view-audience.css'
import SavingSegment from '../SavingSegment/saving-segment'

function ViewAudience(){
    
    const screen = useRef(null)
    const [openPopUp, setOpenPopUp] = useState(false)

    function handleSave(){
        setOpenPopUp(true)
    }
    
    function handleClose(){
        setOpenPopUp(false)
    }
    

    return(
        <div className = "main-page" ref = { screen } >
            <header className = "navbar">
                <button className = 'view-btn'>&lt;   View Audience</button>
            </header>
            <section className = "home">
                <button className = "save-btn" onClick = { handleSave } >Save Segment</button>
                <SavingSegment isopen = { openPopUp } onClose = { handleClose }/>
            </section>
        </div>
    )
}

export default ViewAudience