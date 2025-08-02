var gameMode = "normal"; // Change to "memory" or "timed" as needed
var isPlayingBackSequence = false;
var timer;
var timeLimit = 3000;

var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;

$(document).one("keydown click", function () {
  unlockAudio();
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$(".btn").click(function () {
  if (isPlayingBackSequence) return;

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  if (gameMode === "memory" && userClickedPattern.length === gamePattern.length) {
    checkAnswer();
  } else if (gameMode !== "memory") {
    checkAnswer(userClickedPattern.length - 1);
  }
});

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  if (gameMode === "memory") {
    setTimeout(playFullSequence, 500);
  } else {
    flashButton(randomChosenColour);
    playSound(randomChosenColour);
    if (gameMode === "timed") startTimer();
  }
}

function playFullSequence() {
  isPlayingBackSequence = true;
  let i = 0;
  const interval = setInterval(() => {
    const color = gamePattern[i];
    flashButton(color);
    playSound(color);
    i++;
    if (i >= gamePattern.length) {
      clearInterval(interval);
      isPlayingBackSequence = false;
    }
  }, 800);
}

function flashButton(color) {
  $("#" + color).fadeOut(100).fadeIn(100);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(() => {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  const audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function unlockAudio() {
  const audio = new Audio("sounds/green.mp3");
  audio.volume = 0;
  audio.play();
}

function checkAnswer(index) {
  if (gameMode === "memory") {
    for (let i = 0; i < gamePattern.length; i++) {
      if (userClickedPattern[i] !== gamePattern[i]) return gameOver();
    }
    setTimeout(nextSequence, 1000);
  } else {
    if (gamePattern[index] === userClickedPattern[index]) {
      if (userClickedPattern.length === gamePattern.length) {
        clearTimeout(timer);
        setTimeout(nextSequence, 1000);
      }
    } else {
      gameOver();
    }
  }
}

function gameOver() {
  playSound("wrong");
  $("body").addClass("game-over");
  $("#level-title").text("Game Over, Press Any Key to Restart");
  setTimeout(() => {
    $("body").removeClass("game-over");
  }, 200);
  startOver();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  userClickedPattern = [];
  clearTimeout(timer);
  $(document).one("keydown click", function () {
    unlockAudio();
    if (!started) {
      $("#level-title").text("Level " + level);
      nextSequence();
      started = true;
    }
  });
}

function startTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    gameOver();
  }, timeLimit);
}
