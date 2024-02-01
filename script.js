let box = document.querySelectorAll(".innerBox");
let outerBox = document.querySelector(".outerBox");
let close = document.querySelector(".closeInstructions");
let instructions = document.querySelector(".instructions");
let instructIcon = document.querySelector(".instructIcon");
let updatedScore = document.querySelector(".score");
let restart = document.querySelector(".restart");
let gameEndText = document.querySelector(".GameEndTextBox");
let winningText = document.querySelector(".winningText");
let loosingText = document.querySelector(".loosingText");
let overlay = document.querySelector(".overlay");
let blur = document.querySelector(".blur");
let swipeDirection;
let arrowKeyPressed = false;
let score = 0;
let touchArea = document.querySelector(".outerBox");
let mouseX,initialX = 0;
let mouseY,initialY = 0;
let isSwiped;
let deviceType = "";
let events = {
    mouse : {
        down : "mousedown",
        move : "mousemove",
        up : "mouseup"
    },
    touch : {
        down : "touchstart",
        move : "touchmove",
        up : "touchend"
    }
}

//Generate two random tiles with number 2
let generated = randomBoxGenerator();
box.item(generated).innerText = "2";
let next = randomBoxGenerator();
while (generated === next) {
    next = randomBoxGenerator();
}
box.item(next).innerText = "2";
innerBoxColor();

// Take key event
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }
    catch(e) {
        deviceType = "mouse";
        return false;
    }
};

let rectLeft = touchArea.getBoundingClientRect().left;
let rectTop = touchArea.getBoundingClientRect().top;
const getXY = (e) => {
    mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
    mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
};
isTouchDevice();
// console.log(mouseX,mouseY);
touchArea.addEventListener(events[deviceType].down,(event) => {
    isSwiped = true;
    getXY(event);
    initialX = mouseX;
    initialY = mouseY;
});

touchArea.addEventListener(events[deviceType].move, (event) => {
    if(!isTouchDevice()) {
        event.preventDefault();
    }
    if(isSwiped) {
        getXY(event);
        let diffX = mouseX - initialX;
        let diffY = mouseY - initialY;
        if(Math.abs(diffY) > Math.abs(diffX)) {
            swipeDirection = diffY > 10 ? "down" : "Up";
        }else{
            swipeDirection = diffX > 10 ? "Right" : "Left";
        }
    }
});


document.addEventListener("keyup", (event) => {
    let keyEvent = event.key;
    mainGame(keyEvent);
});
touchArea.addEventListener(events[deviceType].up, () => {
    isSwiped = false;
    if(deviceType !== "mouse")
    mainGame(swipeDirection);
    swipeDirection = null;
});

touchArea.addEventListener("mouseleave", () => {
    isSwiped = false;
});

window.onload = () => {
    isSwiped = false;
}

function mainGame (event) {
    if(event === null) return;
    if (event === "ArrowDown" || event === "down") {
        gameLogicDown(0, 3, 12, 4);
        innerBoxColor();
        updateScore()
        arrowKeyPressed = true;
    } else if (event === "ArrowUp" || event === "Up") {
        gameLogicUp();
        innerBoxColor();
        updateScore()
        arrowKeyPressed = true;
    }
    else if (event === "ArrowLeft" || event === "Left") {
        gameLogicLeft(0, 12, 3, 1);
        innerBoxColor();
        updateScore()
        arrowKeyPressed = true;
    }
    else if (event === "ArrowRight" || event === "Right") {
        gameLogicRight();
        innerBoxColor();
        updateScore()
        arrowKeyPressed = true;
    }

    if (arrowKeyPressed && !boxFull()) {
        generateANumber();
        innerBoxColor();
    }

    if (gameWon()) {
        winnerCard();
    }
    if (boxFull() && checkValidMoves()) {
        looserCard();
    }
}

// check if box is full
function boxFull() {
    for (let i = 0; i < 16; i++) {
        if (box.item(i).innerText === "") return false;
    }
    return true;
}

//function for generating numbers od 2 0r 4 at random tiles
function generateANumber() {
    let generated = randomBoxGenerator();
    while (box.item(generated).innerText !== "") {
        generated = randomBoxGenerator();
    }
    let num = randomNumberGenerator();
    box.item(generated).innerText = num;
    return num;
}

// generate random tile to place a new number
function randomBoxGenerator() {
    return Math.floor(Math.random() * 16);
}

//generate a new number of 2 or 4
function randomNumberGenerator() {
    return Math.floor(((Math.random() * 2) + 1)) * 2;

}
//logic for up arrow
function gameLogicUp() {
    for (let i = 0; i <= 3; i++) {
        for (let j = i; j <= 12 + i; j += 4) {
            if (box.item(j).innerText === "") {
                for (let k = j + 4; k <= 12 + i; k += 4) {
                    if (box.item(k).innerText === "") continue;
                    box.item(j).innerText = box.item(k).innerText;
                    box.item(k).innerText = "";
                    break;
                }
            }
            for (let k = j + 4; k <= 12 + i; k += 4) {
                if (box.item(k).innerText === "") continue;
                if (box.item(k).innerText !== box.item(j).innerText) break;
                box.item(j).innerText = box.item(k).innerText * 2;
                score += box.item(k).innerText * 2;
                box.item(k).innerText = "";
            }
        }
    }
}

// logic for left
function gameLogicLeft() {
    for (let i = 0; i <= 12; i += 4) {
        for (let j = i; j <= 3 + i; j++) {
            if (box.item(j).innerText === "") {
                for (let k = j + 1; k <= 3 + i; k++) {
                    if (box.item(k).innerText === "") continue;
                    box.item(j).innerText = box.item(k).innerText;
                    box.item(k).innerText = "";
                    break;
                }
            }
            for (let k = j + 1; k <= 3 + i; k++) {
                if (box.item(k).innerText === "") continue;
                if (box.item(k).innerText !== box.item(j).innerText) break;
                box.item(j).innerText = box.item(k).innerText * 2;
                score += box.item(k).innerText * 2;
                box.item(k).innerText = "";
            }
        }
    }
}

// logic for down
function gameLogicDown() {
    let index = -1;
    for (let i = 12; i <= 15; i++) {
        index++;
        for (let j = i; j >= index; j -= 4) {
            if (box.item(j).innerText === "") {
                for (let k = j - 4; k >= index; k -= 4) {
                    if (box.item(k).innerText === "") continue;
                    box.item(j).innerText = box.item(k).innerText;
                    box.item(k).innerText = "";
                    break;
                }
            }
            for (let k = j - 4; k >= index; k -= 4) {
                if (box.item(k).innerText === "") continue;
                if (box.item(k).innerText !== box.item(j).innerText) break;
                box.item(j).innerText = box.item(k).innerText * 2;
                score += box.item(k).innerText * 2;
                box.item(k).innerText = "";
            }

        }
    }
}

// logic for right
function gameLogicRight() {
    let index = -4;
    for (let i = 3; i <= 15; i += 4) {
        index += 4;
        for (let j = i; j >= index; j--) {
            if (box.item(j).innerText === "") {
                for (let k = j - 1; k >= index; k--) {
                    if (box.item(k).innerText === "") continue;
                    box.item(j).innerText = box.item(k).innerText;

                    box.item(k).innerText = "";
                    break;
                }
            }
            for (let k = j - 1; k >= index; k--) {
                if (box.item(k).innerText === "") continue;
                if (box.item(k).innerText !== box.item(j).innerText) break;
                box.item(j).innerText = box.item(k).innerText * 2;
                score += box.item(k).innerText * 2;
                box.item(k).innerText = "";
            }
        }
    }
}

// check if there are any valid moves

function checkValidMoves() {
    let count = 0;
    for (let i = 0; i < 16; i++) {
        let currBox = box.item(i).innerText;
        if (i !== 3 && i !== 7 && i != 11 && i + 1 < 16 && currBox === box.item(i + 1).innerText) {
            return false;
        }
        else if (i !== 4 && i !== 8 && i !== 12 && i - 1 >= 0 && currBox === box.item(i - 1).innerText) {
            return false;
        }
        else if (i + 4 < 16 && currBox === box.item(i + 4).innerText) {
            return false;
        }
        else if (i - 4 >= 0 && currBox === box.item(i - 4).innerText) {
            return false;
        }
    }
    return true;
}
// updateScore
function updateScore() {
    updatedScore.innerText = score;
}

function gameWon() {
    for (let i = 0; i < 16; i++) {
        if (box.item(i).innerText === "2048") return true;
    }
}

function winnerCard() {
    gameEndText.style.display = "inline";
    winningText.classList.remove("displayNone");
    restartButton();
}

function looserCard() {
    gameEndText.style.display = "inline";
    loosingText.classList.remove("displayNone");
    restartButton();
}

function restartButton() {
    restart.style.display = "block";
}

restart.addEventListener("click", () => {
    reloadPage();
});
function reloadPage() {
    location.reload();
}



// change color of tiles for every number
function innerBoxColor() {
    for (let i = 0; i < 16; i++) {
        if (box.item(i).innerText === "") {
            box.item(i).style.backgroundColor = "#aaaaaa";
        }
        if (box.item(i).innerText === "2") {
            box.item(i).style.backgroundColor = "#e6f7ff";
        }
        if (box.item(i).innerText === "4") {
            box.item(i).style.backgroundColor = "#ccf0ff";
        }
        if (box.item(i).innerText === "8") {
            box.item(i).style.backgroundColor = "#b3e8ff";
        }
        if (box.item(i).innerText === "16") {
            box.item(i).style.backgroundColor = "#99e1ff";
        }
        if (box.item(i).innerText === "32") {
            box.item(i).style.backgroundColor = "#80d9ff";
        }
        if (box.item(i).innerText === "64") {
            box.item(i).style.backgroundColor = "#66d1ff";
        }
        if (box.item(i).innerText === "128") {
            box.item(i).style.backgroundColor = "#4dcaff";
        }
        if (box.item(i).innerText === "256") {
            box.item(i).style.backgroundColor = "#33c2ff";
        }
        if (box.item(i).innerText === "512") {
            box.item(i).style.backgroundColor = "#19bbff";
        }
        if (box.item(i).innerText === "1024") {
            box.item(i).style.backgroundColor = "#00a1e6";
        }
        if (box.item(i).innerText === "2048") {
            box.item(i).style.backgroundColor = "#006b99";
        }
    }
}



instructIcon.addEventListener("click", () => {
    instructions.style.display = "flex";
    blur.style.display = "block";
});
overlay.addEventListener("click", () => {
    instructions.style.display = "none";
    blur.style.display = "none";
});

close.addEventListener("click", () => {
    instructions.style.display = "none";
    blur.style.display = "none";
});
