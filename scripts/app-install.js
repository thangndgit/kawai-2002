export function assignButtonAction(button) {
  let deferredPrompt;

  if (window.matchMedia("(display-mode: fullscreen)").matches) {
    setButtonState("start", button);
  } else {
    setButtonState("install", button);
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setButtonState("install", button);
  });

  window.addEventListener("appinstalled", () => {
    setButtonState("start", button); 
    deferredPrompt = null;
  });

  function setButtonState(state, button) {
    const textElement = button.querySelector('span:nth-child(2)')

    if (state === "install") {
      textElement?.textContent = "Install";
      button.onclick = () => installApp(deferredPrompt, button);
    } else if (state === "start") {
      textElement?.textContent = "Start";
      button.onclick = startApp;
    }
  }

  // Hàm cài đặt app
  function installApp(deferredPrompt, button) {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Người dùng đã chấp nhận cài đặt.");
          setButtonState("start", button);
        } else {
          console.log("Người dùng đã từ chối cài đặt.");
        }
        deferredPrompt = null;
      });
    }
  }

  // Hàm mở app
  function startApp() {
    window.location.href = "/kawai-2002"; // Hoặc URL bạn muốn điều hướng tới khi mở app
  }
}
