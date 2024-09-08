import { Screen } from "./screen.js";

export class ScreenGame extends Screen {
  constructor() {
    super();

    // html
    const container = document.createElement("div");
    container.classList.add("container");

    this.gameStatus = document.createElement("mtm-game-status");
    this.gameStatus.classList.add("game-status");

    this.gameSheet = document.createElement("mtm-game-sheet");
    this.gameSheet.classList.add("game-sheet");

    container.appendChild(this.gameStatus);
    container.appendChild(this.gameSheet);

    // css
    const style = document.createElement("style");
    style.textContent = `
      .container {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 6vw;
      }
      .game-status {
        box-sizing: border-box;
        height: 100%;
        padding: 4vh 0;
      }
      .game-sheet {
        height: 100vh;
        aspect-ratio: 72/55;
      }
    `;

    // add to shadow root
    this.shadowRoot.appendChild(style);
    this.screen.appendChild(container);
  }

  connectedCallback() {
    this.gameSheet.addEventListener("mtm-connect", (e) => {
      this.gameStatus.addPoints(e.detail.point);
    });
    this.show();
  }
}
