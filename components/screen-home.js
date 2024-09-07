import { Screen } from "./screen.js";

export class ScreenHome extends Screen {
  constructor() {
    super();

    // extend style
    const style = document.createElement("style");
    style.textContent = `
      .screen {
        background-image: url("/assets/images/bg_home.jpg");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      #btn-start {
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 1vw;
        cursor: pointer;
        position: absolute;
        left: 50vw;
        bottom: 10vw;
        width: 30vw;
        transform: translateX(-50%);
        border-bottom: 0.75vh solid #fff;
        transition: all 0.5s;
      }

      #btn-start [gif] {
        background-image: url("/assets/images/ani_pikachu.gif");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        width: 15vw;
        aspect-ratio: 3/2;
      }

      #btn-start [gif]:last-child {
        transform: rotateY(180deg);
      }

      #btn-start [text] {
        color: #fff;
        font-size: 3vw;
        font-weight: bold;
        transition: all 0.5s;
        text-align: center;
        width: 15vw;
      }

      #btn-start:hover {
        gap: 0;
      }

      #btn-start:hover [text] {
        font-size: 0;
        width: 0;
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

    // add to shadow root
    this.shadowRoot.appendChild(style);
    this.screen.appendChild(this.buttonStart);
  }

  // connectedCallback() {
  //   this.show();
  // }
}
