import { isMobileDevice } from "../utils/device.js";
import { Screen } from "./screen.js";

export class ScreenGame extends Screen {
  constructor() {
    super();

    // var
    this.level = 1;

    // html
    const container = document.createElement("div");
    container.classList.add("container");

    this.gameStatus = document.createElement("mtm-game-status");
    this.gameStatus.classList.add("game-status");

    this.gameSheet = document.createElement("mtm-game-sheet");
    this.gameSheet.classList.add("game-sheet");
    if (isMobileDevice()) this.gameSheet.classList.add("mobile");

    this.gameActions = document.createElement("div");
    this.gameActions.classList.add("game-actions");
    this.levelText = document.createElement("span");
    this.levelText.classList.add("level");
    this.suggest = document.createElement("span");
    this.suggest.classList.add("suggest");
    this.suggest.innerText = "SUGGEST";
    this.gameActions.appendChild(this.levelText);
    this.gameActions.appendChild(this.suggest);

    container.appendChild(this.gameStatus);
    container.appendChild(this.gameSheet);
    container.appendChild(this.gameActions);

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
        padding: 0 6dvw;
        gap: 2dvh;
      }
      .game-status {
        box-sizing: border-box;
        height: 100%;
        padding: 4dvh 0;
      }
      .game-sheet {
        height: 100dvh;
        aspect-ratio: 72/55;
        transform: scale(calc(12/11));
      }
      .game-sheet.mobile {
        aspect-ratio: 18/11;
      }
      .game-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2vh;
        z-index: 1;
      }
      .game-actions .level {
        font-size: 3vh;
        color: white;
        font-weight: bold;
        cursor: pointer;
      }
      .game-actions .suggest {
        background: white;
        padding: 1dvh 2dvh;
        border-radius: 1dvh;
        cursor:  pointer;
      }
      .game-actions .suggest:hover {
        opacity: 0.75;
      }
    `;

    // add to shadow root
    this.shadowRoot.appendChild(style);
    this.screen.appendChild(container);
  }

  connectedCallback() {
    this.gameSheet.setAttribute("level", this.level);

    this.gameSheet.addEventListener("mtm-change-point", (e) => {
      this.gameStatus.addPoints(e.detail.point);
    });
    this.gameSheet.addEventListener("mtm-change-live", (e) => {
      this.gameStatus.addLives(e.detail.live);
    });
    this.gameSheet.addEventListener("mtm-finish-level", (e) => {
      this.level++;
      this.gameStatus.addLives(e.detail.live);
      this.gameStatus.resetTimer();
      this.gameStatus.startTimer();
      this.gameSheet.setAttribute("level", this.level);
      this.render();
    });
    this.levelText.addEventListener("click", () => {
      this.level++;
      this.gameStatus.resetTimer();
      this.gameStatus.startTimer();
      this.gameSheet.setAttribute("level", this.level);
      this.render();
    });
    this.suggest.addEventListener("click", () => {
      this.gameSheet.suggestPath();
    });

    this.show();
    this.render();
    this.gameStatus.startTimer();
  }

  render() {
    this.levelText.innerText = `LEVEL ${this.level}`;
  }
}
