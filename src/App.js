import React from "react"
import Start from "./Components/Start"
import Questions from "./Components/Questions"
import {nanoid} from "nanoid"

export default function App(){
    
    const [start, setStart] = React.useState(true)
    const [trivia, setTriviaData] = React.useState([])
    
    //get the trivia data from the API and store it in state
    React.useEffect(() => {
        async function getTrivia() {
            const res = await fetch("https://opentdb.com/api.php?amount=5")
            const data = await res.json()
            setTriviaData(data.results)
        }
        getTrivia()
    }, [start])
    
    //function to decode special characters
    function decode(html){
        const txt = document.createElement('textarea')
        txt.innerHTML = html
        return txt.value
    }
    
    //function to reorder the answer array - Fishser Yates Algo
     function shuffle(arr){
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr
    }
    
    //variable to store the reformat API data, decode the trivia data, add random id key/value pairs
    //add key/value pairs to identify if the answer is Correct and if answer is Selected
    const quizArray = trivia.map(trivia => (
               {
                id: nanoid(),
                type: "multiple",
                question: decode(trivia.question),
                answers: shuffle([
                    {
                        answer: decode(trivia.correct_answer),
                        isCorrect: true,
                        isSelected: false,
                        id: nanoid()
                    }
                ].concat(
                    trivia.incorrect_answers.map(incorrect => 
                    (
                        {
                            answer: decode(incorrect),
                            isCorrect: false,
                            isSelected: false,
                            id: nanoid()
                        })))
                )
            }))
           
    //this function shifts the game from start mode to question mody
    function startQuiz(){
        setStart(false)
        setQuiz(quizArray) //this resets the quiz variable state to the quizArray
    }
   
    //this sets the state of the quiz variable to the quizArray
    const [quiz, setQuiz] = React.useState(quizArray)
    
    //this function lets the user select one answer for each question
    
    function selectAnswer(event) {
    
       let answerIndex = parseInt(event.currentTarget.id) // gets the id of the answer that is clicked
       let parent = event.target.parentNode.id //gets the id of the parent of the answer that is clicked
       
       //updates the quiz state   
       setQuiz((oldQuiz) => {
           //iterates through the quiz
        return oldQuiz.map((old, index) => {
            if (old.id !== parent) return old; //returns the question-answer object parent of the answer that is clicked
            return {
            ...old,
            //iterates and updates the key-value pairs of the nested answers object
            answers: old.answers.map((answers, index) => {
                //this resets the isSelected key value pairs of a previously clicked answer to false
                if(answers.isSelected === true){
                    return {
                        ...answers,
                        isSelected: false
                    }
                }
                //this updates the isSelected key value pair of the currently clicked answer to true (or false if clicked again)
                if (index !== answerIndex) return answers;
                return {
                ...answers,
                isSelected: !answers.isSelected
                };
            })
            }
        })
        })
    }

    const [checkAnswer, setCheckAnswer] = React.useState(false)
    const [score, setScore] = React.useState([])
    const [gameOver, setGameOver] = React.useState(false)
    
    function check(){
         setCheckAnswer(true)
         let score = []
         
         quiz.map(quiz => 
            quiz.answers.map(answer => {
                 if(answer.isCorrect && answer.isSelected){
                     score.push(answer.answer)
                 }
             })
         )
         setScore(score)
         setGameOver(true)
    }
    function restart(){
        setStart(true)
        setGameOver(false)
        setCheckAnswer(false)
        setScore([])
        setTriviaData([])
      
    }
  
   const questionBlock = quiz.map((qa, index) => 
                                <Questions 
                                    key={qa.id}
                                    id={qa.id}
                                    question={qa.question} 
                                    answers={qa.answers}
                                    selectAnswer={selectAnswer}
                                    checkAnswer={checkAnswer}
                                    gameOver={gameOver}
                                />)
    
            

    return(
        <main>
            <div className="container">
                <div className="blob-top">
                </div>
            </div>
            
            {start ? <Start startQuiz={startQuiz} /> : 
                <section className="question-section">
                    {questionBlock}
                    {!gameOver ? <button onClick={check}>Check Answers</button> : 
                    <section className="score-section"><p>You scored {score.length}/5 correct answers.</p><button onClick={restart}>Play Again</button></section>}
                </section>
            }
            <div className="container">
                <div className="blob-bottom">
                </div>
            </div>
        </main>
        
    )
}
