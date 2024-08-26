let board;
let context;
let birdimage;
let gameover = false;
let gameStarted = false;
let startaudio = document.getElementById("start")
let bird = {
    x: 0,
    y: 0,
    width: 34,
    height: 24
};
let pipearray = [];
let pipeheight = 512;
let pipewidth = 64;
let pipex = 0;
let pipey = 0;
let topPipeImage;
let bottomPipeImage;
let velocityX = -2.5;
let velocityY = 0;
let gravity = 0.4;
let score = 0;
let highscore;
let end= document.getElementById("end")
let finderscore=0
let darkscore=0

function updateDimensions() {

    let boardwidth = window.innerWidth;
    let boardheight = window.innerHeight;

    board.width = boardwidth;
    board.height = boardheight;

    bird.x = boardwidth / 8;
    bird.y = boardheight / 2;

    pipex = boardwidth;
    
}

function startGame() {

    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    gameStarted = true;
    gameover = false;
    score = 0;
    velocityY = 0;
    pipearray = [];
    birdimage.onload = function() {
        context.drawImage(birdimage, bird.x, bird.y, bird.width, bird.height);
    };
    board.style.backgroundImage = "url('./flappybirdbg.png')";
    updateDimensions();
    requestAnimationFrame(update);
    if(board.width>768){
        setInterval(placepipes, 1000);
    }
    else{setInterval(placepipes, 1500);}

   
}

function endGame() {
    document.getElementById('your').textContent = score;
    gameStarted = false;
    document.getElementById('gameOver').style.display = 'flex';
    end.play()

}

window.onload = function() {
  
    board = document.getElementById("board");
    context = board.getContext("2d");
    birdimage = new Image();
    birdimage.src = "./flappybird.png";

    topPipeImage = new Image();
    topPipeImage.src = "./toppipe.png";
    bottomPipeImage = new Image();
    bottomPipeImage.src = "./bottompipe.png";

    highscore = localStorage.getItem('highscore') || 0;
    document.querySelectorAll(".high").forEach(span => {
        span.textContent = highscore;
    });

    document.getElementById('startButton').addEventListener('click', () => {
        startaudio.currentTime = 0;  // Reset the audio to the start
        startaudio.play().then(() => {
            startGame();  // Start the game after the audio plays
        }).catch((error) => {
            console.error("Audio playback failed:", error);
            startGame();  // Start the game even if audio playback fails
        });
    });
    
    document.getElementById('restartButton').addEventListener('click', () => {
        location.reload();
    });

    window.addEventListener("resize", updateDimensions);
    document.addEventListener("keydown", movebird);
    document.addEventListener("click", movebird);
    updateDimensions();
};

function update() {
    if (!gameStarted) return;
    requestAnimationFrame(update);
    if (gameover) return;

    context.clearRect(0, 0, board.width, board.height);
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdimage, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameover = true;
        endGame();
        return;
    }

    for (let i = 0; i < pipearray.length; i++) {
        let pipe = pipearray[i];
        pipe.x += velocityX;
        if (detection(bird, pipe)) {
            gameover = true;
            endGame();
            return;
        }
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            finderscore+=0.5
            darkscore+=0.5
            pipe.passed = true;
        }

    }

    while (pipearray.length > 0 && pipearray[0].x + pipewidth < 0) {
        pipearray.shift();
    }

    context.fillStyle = "black";
    context.font = "20px sans-serif";
    context.fillText(`HighScore : ${highscore}`, 15, 35);
    context.fillText(score, 15, 75);

    if (score > highscore) {
        highscore = score;
        document.querySelectorAll(".high").forEach(span => {
            span.textContent = highscore;
        });
        localStorage.setItem("highscore", highscore);
    }
    speed();
  
    
}

function placepipes() {
    if (!gameStarted) return;

    let opening = board.height / 4;
    let randomy = pipey - (pipeheight/4) - Math.random() * (pipeheight/2);

    let topPipe = {
        img: topPipeImage,
        x: pipex,
        y: randomy,
        width: pipewidth,
        height: pipeheight,
        passed: false
    };

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipex,
        y: pipeheight + opening + randomy,
        width: pipewidth,
        height: pipeheight + 100,
        passed: false
    };

    pipearray.push(topPipe);
    pipearray.push(bottomPipe);
}

function movebird() {
    if (!gameStarted) return;
    velocityY = -6;
}

function detection(a, b) {
    return a.x <= b.x + b.width &&
           a.x + a.width >= b.x &&
           a.y <= b.y + b.height &&
           a.y + a.height >= b.y;
}
function speed(){
    if(finderscore>=4){
        velocityX-=0.4
        finderscore=0
    }
}

   
