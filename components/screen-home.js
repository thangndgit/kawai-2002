import { assets } from "../utils/assets.js";
import { switchScreen } from "../utils/screen.js";
import { Screen } from "./screen.js";

export class ScreenHome extends Screen {
  constructor() {
    super();

    // extend style
    const style = document.createElement("style");
    style.textContent = `
      .screen {
        background-image: url("${assets("/images/bg_home.jpg")}");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: top;
      }

      #btn-start {
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 1dvw;
        cursor: pointer;
        position: absolute;
        left: 50%;
        bottom: 22.5dvh;
        width: 60dvh;
        transform: translateX(-50%);
        border-bottom: 0.75dvh solid #fff;
        transition: all 0.5s;
      }

      #btn-start [gif] {
        background-image: url("${assets("/images/ani_charizard.gif")}");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        width: 100%;
        aspect-ratio: 3/2;
      }

      #btn-start [gif]:first-child {
        transform: rotateY(180deg);
      }

      #btn-start [text] {
        color: #fff;
        font-size: 6dvh;
        font-weight: bold;
        transition: all 0.5s;
        text-align: center;
      }

      #btn-start:hover {
        border-color: #E57467;
      }

      #btn-start:hover [text] {
        color: #E57467;
      }

      #btn-continue {
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 1dvw;
        cursor: pointer;
        position: absolute;
        left: 50%;
        bottom: 10dvh;
        width: 60dvh;
        transform: translateX(-50%);
        border-bottom: 0.75dvh solid #fff;
        transition: all 0.5s;
      }

      #btn-continue [gif] {
        background-image: url("${assets("/images/ani_pikachu.gif")}");
        background-repeat: no-repeat;
        background-position: top;
        background-size: contain;
        width: 100%;
        aspect-ratio: 3/2;
      }

      #btn-continue [gif]:last-child {
        transform: rotateY(180deg);
      }

      #btn-continue [text] {
        color: #fff;
        font-size: 6dvh;
        font-weight: bold;
        transition: all 0.5s;
        text-align: center;
      }

      #btn-continue:hover {
        border-color: #F7E901;
      }

      #btn-continue:hover [text] {
        color: #F7E901;
      }
    `;

    // button start
    this.buttonStart = document.createElement("span");
    this.buttonStart.id = "btn-start";
    this.buttonStart.innerHTML = `
      <span gif></span>
      <span text>START</span>
      <span gif></span>
    `;

    // button continue
    this.buttonContinue = document.createElement("span");
    this.buttonContinue.id = "btn-continue";
    this.buttonContinue.innerHTML = `
      <span gif></span>
      <span text>CONTINUE</span>
      <span gif></span>
    `;

    // add to shadow root
    this.shadowRoot.appendChild(style);
    this.screen.appendChild(this.buttonStart);
    this.screen.appendChild(this.buttonContinue);
  }

  connectedCallback() {
    this.buttonStart.addEventListener("click", () => {
      switchScreen("screen-game", (screenGame) => {
        screenGame.gameStatus.startTimer();
      });
    });

    // this.show();
  }
}
