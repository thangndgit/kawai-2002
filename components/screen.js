export class Screen extends HTMLElement {
  constructor() {
    super();

    // html
    this.screen = document.createElement("section");
    this.screen.classList.add("screen");

    // inner
    const slot = document.createElement("slot");
    this.screen.appendChild(slot);

    // style
    const style = document.createElement("style");
    style.textContent = `
      .screen {
        width: 100dvw;
        height: 100dvh;
        position: absolute;
        bottom: -100%;
        left: 0;
        opacity: 0;
        z-index: -1;
        transition: all 0.5s;
      }
      .screen--show {
        opacity: 1;
        bottom: 0;
        z-index: 999;
      }
    `;

    // add to shadow root
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.screen);
  }

  show() {
    this.screen.classList.add("screen--show");
  }

  hide() {
    this.screen.classList.remove("screen--show");
  }
}
