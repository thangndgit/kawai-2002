import { assets } from "../utils/assets.js";
import { Screen } from "./screen.js";

export class ScreenInstall extends Screen {
  constructor() {
    super();

    // extend style
    const style = document.createElement("style");
    style.textContent = `
      .screen {
        background-image: url("${assets("/images/bg_home.jpg")}");
        background-size: 180vw;
        background-repeat: no-repeat;
        background-position: center;
      }

      #btn-install {
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 1dvw;
        cursor: pointer;
        position: absolute;
        left: 50%;
        bottom: 10dvh;
        width: 80dvw;
        transform: translateX(-50%);
        border-bottom: 0.75dvh solid #fff;
        transition: all 0.5s;
      }

      #btn-install [gif] {
        background-image: url("${assets("/images/ani_pikachu.gif")}");
        background-repeat: no-repeat;
        background-position: top;
        background-size: contain;
        width: 100%;
        aspect-ratio: 3/2;
      }

      #btn-install [gif]:last-child {
        transform: rotateY(180deg);
      }

      #btn-install [text] {
        color: #fff;
        font-size: 10dvw;
        font-weight: bold;
        transition: all 0.5s;
        text-align: center;
      }

      #btn-install:hover {
        border-color: #F7E901;
      }

      #btn-install:hover [text] {
        color: #F7E901;
      }
    `;

    // button start
    this.buttonInstall = document.createElement("span");
    this.buttonInstall.id = "btn-install";
    this.buttonInstall.innerHTML = `
      <span gif></span>
      <span text>INSTALL</span>
      <span gif></span>
    `;

    // add to shadow root
    this.shadowRoot.appendChild(style);
    this.screen.appendChild(this.buttonInstall);
  }

  connectedCallback() {
    this.buttonInstall.addEventListener("click", () => {
      const installButton = document.getElementById("install-button");
      if (installButton) installButton.click();
    });
    // this.show();
  }
}
