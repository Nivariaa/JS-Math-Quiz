const wholeContainer = document.querySelector('#whole-container')
const timerContainer = document.querySelector('#timer-container')
const gameContainer = document.querySelector('#game-container')
const resultsContainer = document.querySelector('#results')
const goToMenuButton = document.querySelector('#goToMenu')
const firstDigit = document.querySelector('#firstDigit')
const selectDificulty = document.querySelector('#selectDifficulty')
const selectOperation = document.querySelector('#selectOperation')
const secondDigit = document.querySelector('#secondDigit')
const op = document.querySelector('#op')
const startGameButton = document.querySelector('#startGame')
const mainMenu = document.querySelector('#mainMenu')
const answerField = document.querySelector('#answerField')

let times = []
let userTime = 0
let digits
let operation 
let ans
let score = 0
let maxScore = 0
let time
let timerInterval

// this function is called whenever the program needs a random number between 0 and 9
const generateRandomNum = function (digits) {
	let num = ''

	for(let i = 0; i < digits; i++){
		num += (Math.floor(Math.random() * 10))
	}

	return parseInt(num)
}

// this function generates a new question with the desired operation and number of digits
const newQuestion = function (operation, digits) {
	clearInterval(timerInterval)
	answerField.value = ''
	answerField.focus()
	time = 10
	userTime = 0

	timerContainer.innerText = time

	// initiate the timer for this question
	timerInterval = setInterval(function(){
		userTime ++
		time --
		timerContainer.innerText = time

		if(time == 0){
			alert(`Time's up! The answer is ${ans}`)
			maxScore ++
			times.push(userTime)
			// if time's up, create a new question
			newQuestion(operation, digits)
		}
	}, 1000)

	let num1
	let num2
	switch(operation){
		case 'Addition':
			num1 = generateRandomNum(digits)
			num2 = generateRandomNum(digits)
			ans = num1 + num2
			firstDigit.value = num1
			secondDigit.value = num2
			op.value = '+'
			break

		case 'Subtraction':
			num1 = generateRandomNum(digits)
			num2 = generateRandomNum(digits)
			op.value = '-'

			// this avoids negative answers
			if(num2 > num1){
				ans = num2 - num1
				firstDigit.value = num2
				secondDigit.value = num1				
			}
			else{
				ans = num1 - num2
				firstDigit.value = num1
				secondDigit.value = num2				
			}
			break

		case 'Multiplication':
			num1 = generateRandomNum(digits)
			num2 = generateRandomNum(digits)
			ans = num1 * num2
			firstDigit.value = num1
			secondDigit.value = num2
			op.value = 'x'
			break
			
		case 'Division':
			num2 = generateRandomNum(digits)
			ans = generateRandomNum(1)
			num1 = num2 * ans
			op.value = '/'
			firstDigit.value = num1
			secondDigit.value = num2				
			break
	}
}

const submitAnswer = function (correctAnswer) {
	const userAnswer = answerField.value

	times.push(userTime)

	if(correctAnswer != userAnswer || userAnswer === ''){
		maxScore ++
		alert(`Wrong, answer is ${correctAnswer}`)
	}
	else{
		score ++
		maxScore ++
		alert('Correct')
	}

}

// generates a performance report post game
const evaluatePerformance = function () {
	const resultsText = document.querySelector('#resultsText')

	gameContainer.style.visibility = 'hidden'
	resultsContainer.style.visibility = 'visible'

	clearInterval(timerInterval)
	const totalTime = times.reduce((function(acc, cur){
		return acc += cur
	}), 0)
	
	if(maxScore == 0){
		resultsText.innerText = 'No item answered'
		return
	}

	resultsText.innerText = `Your score: ${score} / ${maxScore}\nAverage time: ${totalTime / maxScore} seconds`
}

// initiates all needed variables, then starts the game
const startGame = function () {
	mainMenu.style.visibility = 'hidden'
	resultsContainer.style.visibility = 'hidden'
	gameContainer.style.visibility = 'visible'
	operation = selectOperation.value
	times = []
	score = 0
	maxScore = 0

	if(selectDificulty.value == 'Easy'){
		digits = 1
	}
	else if(selectDificulty.value == 'Normal'){
		digits = 2
	}
	else{
		digits = 3
	}

	newQuestion(operation, digits)
}

startGameButton.addEventListener('click', function(){
	startGame()
})

goToMenuButton.addEventListener('click', function(){
	resultsContainer.style.visibility = 'hidden'
	mainMenu.style.visibility = 'visible'
})

// submits answer when Enter is pressed
document.onkeypress = function (e) {
	if(e.key == 'Enter' && gameContainer.style.visibility == 'visible' && document.activeElement == answerField){
		submitAnswer(ans)
		newQuestion(operation, digits)
	}
}