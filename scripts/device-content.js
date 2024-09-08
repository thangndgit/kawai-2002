function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function requestFullScreenAndLockOrientation() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().then(() => {
      screen.orientation.lock("landscape").catch((err) => {
        window.alert("fail");
        console.error("Không thể khóa xoay màn hình: ", err);
      });
    });
  } else {
    window.alert("hmm");
    console.error("Trình duyệt không hỗ trợ chế độ toàn màn hình.");
  }
}

var desktopElements = document.querySelectorAll(".desktop");
var mobileElements = document.querySelectorAll(".mobile");

if (isMobileDevice()) {
  desktopElements.forEach((e) => (e.style.display = "none"));
  mobileElements.forEach((e) => (e.style.display = "block"));
  requestFullScreenAndLockOrientation();
} else {
  desktopElements.forEach((e) => (e.style.display = "block"));
  mobileElements.forEach((e) => (e.style.display = "none"));
}
