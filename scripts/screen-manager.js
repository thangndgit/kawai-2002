const screens = [...document.querySelectorAll("[id^=screen]")];

const switchScreen = (screenId) => {
  screens.forEach((screen) => {
    screen.hide();
    if (screen.id === screenId) screen.show();
  });
};

const screenHome = document.getElementById("screen-home");
screenHome &&
  screenHome.buttonStart &&
  screenHome.buttonStart.addEventListener("click", () => {
    switchScreen("screen-game");
  });
