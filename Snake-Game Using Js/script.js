//snake food
const playBoard = document.querySelector(".play-board");
const updateScore = document.querySelector(".score");
const HighScore = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");


let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;

let gameOver = false;
let setIntervalId;
let score = 0;
//getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
HighScore.innerText = `High Score: ${highScore}`;
//change food position
const changeFoodPosition = () => {
    //passing a random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
const changeDirection = (e) => {
    //changing velocity based on key press
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
    initGame();
}

//add controls if the screen is small
controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});
const handleGameOver = () => {
    //clear the timer and reload the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK To Replay....");
    location.reload();
}
const initGame = () => {
    //checking if the game is over or not
    if(gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`
    //check if the snake eat the food
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // pushing food position to snake body array
        score++; //increment score by 1

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        updateScore.innerText = `Score: ${score}`; //show score to display
        HighScore.innerText = `High Score: ${highScore}`; //show highest score
    }

    for(let i=snakeBody.length-1; i>0; i--){
        //shifting forward the value of the element in the snake body one by one
        snakeBody[i] = snakeBody[i-1];
    }
    snakeBody[0] = [snakeX, snakeY]; //setting first element of snake body to current snake position
    
    //updating the snake head position based on the current velocity 
    snakeX += velocityX;
    snakeY += velocityY;

    //if snake hit the wall then game over-:
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    //create snake body
    for(let i=0; i<snakeBody.length; i++){
        //adding a div for each part of the snake body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`
        //check if the snake head hit the body, if so set game over to true
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
//snake is move after every 125 ms
setIntervalId = setInterval(initGame, 125);

document.addEventListener('keydown', changeDirection);