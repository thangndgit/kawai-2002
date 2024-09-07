// ********************
export const switchScreen = (screenId) => {
  const allScreens = document.querySelectorAll("[id^=screen]");
  allScreens.forEach((screen) => {
    screen.classList.remove("screen--show");
    screen.id === screenId && screen.classList.add("screen--show");
  });
};
