import React from "react"

export default function Start(props){
    return(
        <section className="start-section">
            <h1>Quizzical</h1>
            <h3>How much do you really know?</h3>
            <button onClick={props.startQuiz}>Start Quiz</button>
        </section>
    )
     
}