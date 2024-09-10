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
export const assets = (path) => {
  if (isInDeployMode()) return "/kawai-2002/assets" + path;
  return "/assets" + path;
};

// ********************
export const playSound = (path, volume = 1) => {
  const sound = new Audio(assets(path));
  sound.volume = volume;
  sound.play();
};
