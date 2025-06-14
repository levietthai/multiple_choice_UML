let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const restartButton = document.getElementById('restart-btn');
const themeSwitch = document.getElementById('theme-switch');

// Theme switching
themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeSwitch.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Load questions from JSON file
fetch('quiz_data_uml_100_real.json')
    .then(response => response.json())
    .then(data => {
        questions = shuffleArray(data);
        totalElement.textContent = questions.length;
    })
    .catch(error => console.error('Error loading questions:', error));

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', startGame);

function startGame() {
    startButton.classList.add('hide');
    scoreContainer.classList.add('hide');
    currentQuestionIndex = 0;
    score = 0;
    questionContainerElement.classList.remove('hide');
    questions = shuffleArray(questions); // Shuffle questions when starting new game
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    const shuffledAnswers = shuffleArray([...question.answers]);
    shuffledAnswers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn', 'answer-btn', 'fade-in');
        button.addEventListener('click', () => selectAnswer(shuffledAnswers.indexOf(answer)));
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(index) {
    const correct = questions[currentQuestionIndex].correct;
    const buttons = answerButtonsElement.children;
    
    // Disable all buttons after selection
    Array.from(buttons).forEach(button => {
        button.disabled = true;
    });

    // Show correct/wrong status with animation
    if (index === correct) {
        score++;
        buttons[index].classList.add('correct');
    } else {
        buttons[index].classList.add('wrong');
        buttons[correct].classList.add('correct');
        questionContainerElement.classList.add('shake');
        setTimeout(() => {
            questionContainerElement.classList.remove('shake');
        }, 500);
    }

    // Show next button or end game
    if (currentQuestionIndex < questions.length - 1) {
        nextButton.classList.remove('hide');
    } else {
        endGame();
    }
}

function endGame() {
    questionContainerElement.classList.add('hide');
    scoreContainer.classList.remove('hide');
    scoreElement.textContent = score;
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
} 