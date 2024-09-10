// ********************
export const switchScreen = (screenId, callback = () => {}) => {
  const allScreens = document.querySelectorAll("[id^=screen]");
  allScreens.forEach((screen) => {
    screen.hide();

    if (screen.id === screenId) {
      screen.show();
      callback(screen);
    }
  });
};
