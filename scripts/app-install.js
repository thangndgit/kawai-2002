let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installButton = document.getElementById("install-button");
  installButton.hidden = false;

  installButton.addEventListener("click", () => {
    installButton.hidden = true;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Cài đặt PWA được chấp nhận");
      } else {
        console.log("Cài đặt PWA bị từ chối");
      }
      deferredPrompt = null;
    });
  });
});
