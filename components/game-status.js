export class GameStatus extends HTMLElement {
  #lives = 10;
  #points = 0;

  constructor() {
    super();

    // Create elements
    this.lives = document.createElement("span");
    this.lives.classList.add("lives");

    this.points = document.createElement("span");
    this.points.classList.add("points");

    this.timer = document.createElement("mtm-timer-bar");
    this.timer.classList.add("timer");
    this.timer.setAttribute("duration", 10 * 60 * 1000);

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
        width: 12dvh;
        text-align: center;
        font-size: 4.5dvh;
        font-weight: bold;
        line-height: 1;
      }
      .timer {
        height: 100%;
      }
    `;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(statusBar);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.lives.innerText = "⚜ " + this.#lives;
    this.points.innerText = this.#points;
  }

  addPoints(points) {
    this.#points += points;
    this.render();
  }

  addLives(lives) {
    this.#lives += lives;
    this.render();
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
