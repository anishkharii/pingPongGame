var playBtn = document.querySelector(".play");
var canvas = document.getElementById("cnvs");
var c = canvas.getContext('2d');
var levelMenu = document.querySelector(".levelSelector");
var gameOverMenu = document.querySelector(".gameOver");
var navbarMenu = document.querySelector(".navbar");
var levelStatus = document.querySelector(".levelStatus");
var winStatus = document.querySelector(".winStatus");

var bgAudio = new Audio("sounds/BgMusic.mp3");
var wallHit = new Audio("sounds/wallHit.mp3");
var userHit = new Audio("sounds/userHit.mp3");
var compHit = new Audio("sounds/compHit.mp3");
bgAudio.loop = true;
var levels = document.querySelectorAll(".level");
var aiLevel = 0.025;
var gameOver = false;
var pause = false;


function setLevel(val){
    levelStatus.innerHTML = "Level: "+levels[val-1].innerHTML;
    switch(val){
        case 1:
            aiLevel = 0.025;
            levels[0].classList.add("level-active");
            levels[1].classList.remove("level-active");
            levels[2].classList.remove("level-active");
            break;
        case 2: 
            aiLevel = 0.045;
            levels[0].classList.remove("level-active");
            levels[1].classList.add("level-active");
            levels[2].classList.remove("level-active");
            break;
        case 3: 
            aiLevel = 0.070;
            levels[0].classList.remove("level-active");
            levels[1].classList.remove("level-active");
            levels[2].classList.add("level-active");
            break;
    }
}


playBtn.addEventListener("click",function(){
    gameOver=false;
    levelMenu.style.display="none";
    canvas.style.display="block";
    navbarMenu.style.display="block";
    levelStatus.style.display="block";
    bgAudio.currentTime=0;
    bgAudio.play();
    
});


const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    dx : 5,
    dy : 5,
    speed : 5,
    color : "WHITE"
}

const user = {
    x : canvas.height/2, 
    y : canvas.height -20, 
    width : 100,
    height : 15,
    score : 0,
    color : "WHITE"
}

const com = {
    x : canvas.width/2, 
    y : 5, 
    width : 100,
    height : 15,
    score : 0,
    color : "WHITE"
}

const net = {
    x : 0,
    y : canvas.height/2,
    height : 2,
    width : 10,
    color : "WHITE"
}

function drawRect(x, y, w, h, color){
    c.fillStyle = color;
    c.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color){
    c.beginPath() ;
    c.arc(x, y, r, 0, Math.PI *2, false);
    c.fillStyle = color;
    c.fill();
}

window.addEventListener("touchmove", function(e){
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var touch = e.changedTouches[0];
        var touchX = parseInt(touch.clientX) - rect.top - root.scrollTop ;
       // e.preventDefault();
        user.x = touchX- user.width/2 +user.width;});

document.addEventListener("keypress",function(event){
   alert("hi");
    var key = event.key;
    switch(key){
        case "ArrowLeft":
            if(user.x>=35){
                user.x -= 35;
            }
            break;
        case "ArrowRight":
            if(user.x+user.width <=315){
                user.x += 35;
            }
            break;
    }
});
function move(dir){
    if(dir==-1 && user.x>=35){
        user.x -= 35;
    }
    if(dir==1 && user.x+user.width <=315){
        user.x += 35;
    }
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.dx = -ball.dx;
    ball.speed = 7;
    ball.dx =5;
    ball.dy =5;
}

function drawNet(){
    for(let i = 0; i <= canvas.width; i+=15){
        drawRect(net.x +i, net.y, net.width, net.height, net.color);
    }
}

function drawText(text,x,y,font="40px Ubuntu"){
    c.fillStyle = "#FFF";
    c.font = font;
    c.fillText(text, x, y);
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(){
    if( ball.y - ball.radius < 0 ){
        com.score++;
        resetBall();
    }else if( ball.y + ball.radius > canvas.height){
        user.score++;
        resetBall();
    }
  
  
    ball.x += ball.dx;
    ball.y += ball.dy;
   if(ball.y < canvas.height/2){
    com.x += (ball.x - (com.x+(com.width/2))) *aiLevel;
    }
   
    if(ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width){
        ball.dx = -ball.dx;
        wallHit.play();
    }
    
    let player = (ball.y + ball.radius > canvas.height/2) ? user : com;
    
    if(collision(ball,player)){
        if(player == user){
            userHit.play();
        }
        else{
            compHit.play();
        }
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);
        ball.speed += .1;
    }
}

function render(){
    drawRect(0, 0, canvas.width, canvas.height, "#2a7a9b");
    drawText(com.score,0,5*(canvas.height/8));
    drawText(user.score,0,3*(canvas.height/8));
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
var isMusic = true;
function mute(){
    if(isMusic){
        bgAudio.pause();
        isMusic = false;
        document.querySelector(".fa-volume-xmark").style.color="#212cf5";
    }
    else{
        bgAudio.play();
        bgMusic.volume = 0.2;
        isMusic = true;
        document.querySelector(".fa-volume-xmark").style.color="#000";
    }
}
function restart(){
    user.score =0;
    com.score =0;
    gameOver = false;
    gameOverMenu.style.display="none";
    levelMenu.style.display="block";
}

function pauseGame(){
    if(pause == true){
        pause = false;
        isMusic=false;
        mute();
        game();
        document.querySelector(".fa-pause").style.color="#000";
    }
    else{
        pause = true;
        isMusic=true;
        mute();
        document.querySelector(".fa-pause").style.color="#212cf5";
    }
    
}

function win(reset=0){
    
    if(com.score == 5){
        winStatus.innerHTML = "WINNER!";
        winStatus.style.color = "green";
        winStatus.style.textShadow = "0 0 30px #00FF00";
    }
    if(user.score == 5){
        winStatus.innerHTML = "LOSS!";
        winStatus.style.color = "red";
        winStatus.style.textShadow = "0 0 30px #FF0000";
    }
    if(reset){
        gameOver=false;
        gameOverMenu.style.display = "none";
        levelMenu.style.display="block";
    }
    else{
        gameOverMenu.style.display = "block";
        gameOver=true;
    }
    navbarMenu.style.display = "none";
    levelStatus.style.display="none";
    user.score =0;
    com.score =0;
}

function run(){
    window.requestAnimationFrame(game);
    update();
    render();
    if(com.score==5 || user.score==5){
        win();
    }
    }
function game(){
    if(!gameOver){
    if(!pause){
    run();
    }
    }
    else{
    bgAudio.pause();
    canvas.style.display="none";
    }
}