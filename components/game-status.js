export class GameStatus extends HTMLElement {
  constructor() {
    super();

    // Create elements
    this.lives = document.createElement("span");
    this.lives.classList.add("lives");
    this.lives.innerText = "❤ " + (this.getAttribute("lives") || "10");

    this.points = document.createElement("span");
    this.points.classList.add("points");
    this.points.innerText = this.getAttribute("points") || "0";

    this.timer = document.createElement("mtm-timer-bar");
    this.timer.classList.add("timer");
    this.timer.setAttribute("autostart", true);
    this.timer.setAttribute("duration", this.getAttribute("timer-duration") || 10000);

    // Create status bar container
    const statusBar = document.createElement("div");
    statusBar.classList.add("status-bar");
    statusBar.appendChild(this.points);
    statusBar.appendChild(this.timer);
    statusBar.appendChild(this.lives);

    // Attach shadow DOM and elements
    const style = document.createElement("style");
    style.textContent = `
      .status-bar {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4dvh;
      }
      .lives, .points {
        color: #fff;
        font-size: 4.5dvh;
        font-weight: bold;
        line-height: 1;
      }
      .points {
        text-align: right;
      }
      .timer {
        height: 100%;
      }
    `;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(statusBar);
  }

  addPoints(points) {
    this.points.innerText = Number(this.points.innerText) + points;
  }

  addLives(lives) {
    this.lives.innerText = Number(this.lives.innerText) + lives;
  }

  startTimer() {
    this.timer.start();
  }

  stopTimer() {
    this.timer.stop();
  }

  resetTimer(duration) {
    this.timer.reset(duration);
  }
}
