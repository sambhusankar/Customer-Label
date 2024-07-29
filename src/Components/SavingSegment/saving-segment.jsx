import React, { useEffect, useRef, useState} from 'react'
import './saving-segment.css'

function SavingSegment({ isopen , onClose}){

    const screen = useRef(null)

    //making a transparent grey layer to make the body dark on pop up open
    const layer = document.createElement("div")
    layer.classList.add("layer")


    const [segmentName, setSegmentName] = useState('')    // the segment name
    const [activeSchemaNo, setActiveSchemaNo] = useState(2)   // the number of active schemas 

    //states of schemas
    const [selectedFname, setSelectedFname] = useState('')
    const [selectedLname, setSelectedLname] = useState('')
    const [selectedAge, setSelectedAge] = useState('')
    const [selectedGender, setSelectedGender] = useState('')
    const [selectedAname, setSelectedAname] = useState('')
    const  [selectedCity, setSelectedCity] = useState('')

    //the schema values and functins to change their state 
    const selectedValues = [selectedFname, selectedLname, selectedGender, selectedAge, selectedAname, selectedCity]
    const schemaChangeFunctions = [setSelectedFname, setSelectedLname, setSelectedGender, setSelectedAge, setSelectedAname, setSelectedCity]
    
    const [activeSchemas, setActiveSchemas] = useState([])  //schemas are active in the form rightly

    //schema options list with label and value
    let schemas = [
        {Label: "First Name", Value: 'first_name'},
        {Label: "Last Name", Value: 'last_name'},
        {Label: "Gender", Value: 'gender'},
        {Label: "Age", Value: 'age'},
        {Label: "Account Name", Value: 'account_name'},
        {Label: "City", Value: 'city'},
    ] 

    //makes a array of selected schema values
    useEffect(() => {
        const  newActiveSchemas = selectedValues.filter(sel_val => sel_val != null)
        setActiveSchemas(newActiveSchemas)
        
    }, [selectedValues])

    //opening the pop up screen on the save segment button click
    useEffect(() => {
        const element = screen.current
        if(isopen == true){
            element.style.right = "0px"
            document.body.appendChild(layer)
        }
    }, [isopen]);

    //closing the pop up screen on cancel button click
    function handleCloseBtn(){
        const element = screen.current
        element.style.right = "-500px"
        const existing_layer = document.body.querySelector(".layer")
        if(existing_layer){
            document.body.removeChild(existing_layer)
        }
        onClose()
    }

    //handling the add schema buttton for creating another schema selector in the DOM
    function handleAddSchema(){
        if(activeSchemaNo < 6 ){
        setActiveSchemaNo(activeSchemaNo + 1)
        }
    }

    // creating a dynamic form for selecting schemas and rendering it in the DOM
    function renderSchemas(){
        const elements = []
        for(let i = 0; i < activeSchemaNo; i++){
            elements.push(   
                    <li key = { i }>
                        <select value = {selectedValues[i]} onChange = { (e) => schemaChangeFunctions[i](e.target.value)}>
                        {
                            schemas.map(schema => {
                                return(
                                <option key = {schema.Label} value = {schema.Value}>{schema.Label}</option>
                                )
                            })
                        }
                        </select>
                        <button className = "rm-schema-btn" onClick = { () => handleRemoveSch(i)}>-</button>
                    </li>
                    
                )
                    
                }
                return elements
    }

     //handling remove an schema from the form
     function handleRemoveSch(index){
        if (activeSchemaNo > 1){       //checks atleat one schema shold be there
        selectedValues[index] = ''
        setActiveSchemaNo(activeSchemaNo - 1)
    }}

    //Handling  the save segment and posting the data to server
    function handleSaveSegment(){
        fetch("https://webhook.site/", {
            method: 'POST',
            header: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                schema: activeSchemas.map(val => {
                    const schema = schemas.find(schema => schema.Value === val);
                    return schema ? { [schema.Label]: schema.Value } : null;          // if schema is available then return the data otherwise null
                }).filter(Boolean)      // this is to remove falsy values like null, undefined
            }),
            mode: 'no-cors'

        }).then(
            (res) => console.log(res.text())
        ).catch(
            err => console.log(err)
        )

    };

    return(
        <div className = "save-seg" ref = { screen } >
            <header className = "save-seg-nav">
                <p>&lt;  Saving Segment</p>
                
            </header>
            <div className = "form">
                <p>Enter the name of the Segment</p>
                <input type = "text" placeholder = "Name of the segment" value = {segmentName} onChange = { (e) => setSegmentName(e.target.value)}/>
                <p>To save the segments you need to add the schemas to build the queries</p>
                <ul className = "schemas">
                    {
                        renderSchemas()
                    }
                </ul>
                <button className = "ad-schema-btn" onClick = {handleAddSchema}>•add new schema</button>
            </div>
            <footer className = "footer">
                <button className = "save-schemas" onClick = {handleSaveSegment}>Save The Segment</button>
                <button className = "cls-btn" onClick = {handleCloseBtn}>Cancel</button>
            </footer>
        </div>
    )
}
export default SavingSegment