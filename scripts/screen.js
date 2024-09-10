export const switchScreen = (screenId) => {
  const screens = document.querySelectorAll("[id^=screen]");

  screens.forEach((screen) => {
    screen.hide();
    if (screen.id === screenId) screen.show();
  });
};
