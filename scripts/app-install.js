export function assignButtonAction(button) {
  let deferredPrompt;

  // Kiểm tra nếu ứng dụng đã cài đặt PWA
  if (window.matchMedia("(display-mode: fullscreen)").matches) {
    setButtonState("start", button); // Đã cài đặt -> 'Start'
  } else {
    setButtonState("install", button); // Chưa cài đặt -> 'Install'
  }

  // Xử lý sự kiện beforeinstallprompt khi app chưa được cài đặt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setButtonState("install", button); // Hiển thị 'Install'
  });

  // Kiểm tra sự kiện appinstalled khi app đã được cài đặt
  window.addEventListener("appinstalled", () => {
    setButtonState("start", button); // Khi app được cài, chuyển thành 'Start'
    deferredPrompt = null;
  });

  // Hàm thay đổi trạng thái button
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
          setButtonState("start", button); // Sau khi cài, đổi thành 'Start'
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
