// ********************
export const isInDeployMode = () => {
  const currentURL = window.location.href;
  if (
    currentURL.includes("localhost") ||
    currentURL.startsWith("http://192.168.") ||
    currentURL.startsWith("http://127.0.0.1:")
  )
    return false;
  return true;
};

// ********************
export const path = (path) => {
  if (isInDeployMode()) return "/kawai-2002" + path;
  return path;
};

// ********************
export const playSound = (path, volume = 1) => {
  const isSoundOff = (localStorage.getItem(KEYS.isSoundOff) || "false") === "true";
  if (!isSoundOff) {
    const sound = new Audio(path);
    sound.volume = volume;
    sound.play();
  }
};
