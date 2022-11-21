import React from "react"

export default function Questions(props){
    
    function Answer(){
        return(
           <>
            {answerBlocks}
           </>
           
        )
    }
    
    
    const answerBlocks = props.answers.map( (answers,index) => 
        
       <div key={answers.id} 
            id={index}
            onClick={props.selectAnswer}
            className={
                !props.checkAnswer ?  
                    (answers.isSelected ? "answer-blocks selected-answer" : "answer-blocks") : (answers.isCorrect ? "answer-blocks correct" : "answer-blocks" && !answers.isCorrect && answers.isSelected ? "answer-blocks wrong" : "answer-blocks" &&
                    !answers.isCorrect ? "answer-blocks opacity" : "")}>
            {answers.answer}
        </div> 
    )
    
  

    return(
            <div className="qa-block" >
                <h2>{props.question}</h2>
                <div className={!props.gameOver ? "answer-section" : "answer-section disable-click"} id={props.id}>
                    <Answer/>
                </div>
            </div>
        
    )
}