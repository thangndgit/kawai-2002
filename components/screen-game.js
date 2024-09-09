import { isMobileDevice } from "../utils/device.js";
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
    if (isMobileDevice()) this.gameSheet.classList.add("mobile");

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
        padding: 0 6dvw;
      }
      .game-status {
        box-sizing: border-box;
        height: 100%;
        padding: 4dvh 0;
      }
      .game-sheet {
        height: 100dvh;
        aspect-ratio: 72/55;
      }
      .game-sheet.mobile {
        aspect-ratio: 18/11;
      }
    `;

    // add to shadow root
    this.shadowRoot.appendChild(style);
    this.screen.appendChild(container);
  }

  connectedCallback() {
    this.gameSheet.addEventListener("mtm-change-point", (e) => {
      this.gameStatus.addPoints(e.detail.point);
    });
    this.gameSheet.addEventListener("mtm-change-live", (e) => {
      this.gameStatus.addLives(e.detail.live);
    });
    this.gameSheet.addEventListener("mtm-finish-level", (e) => {
      this.gameStatus.addLives(e.detail.live);
      window.alert("Congratulation");
    });
    this.show();
  }
}
