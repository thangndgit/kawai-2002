import { path } from "../utils/assets.js";

export class GameCell extends HTMLElement {
  constructor() {
    super();

    // html
    this.cell = document.createElement("div");
    this.cell.classList.add("cell");
    this.art = document.createElement("div");
    this.art.classList.add("art");
    this.cell.appendChild(this.art);

    // css
    const style = document.createElement("style");
    style.textContent = `
      .cell {
        box-sizing: border-box;
        width: 100%;
        aspect-ratio: 4/5;
        background: #f8f8f8;
        border-radius: 0.75vh;
        border: 1px solid #999;
        position: relative;
        box-shadow: 0.5vh 0.5vh 0px 0px #999;
        cursor: pointer;
        user-select: none;
        pointer-events: auto;
        padding: 0 0.75vh;
      }
      .cell:hover, .cell.picked {
        border: 0.4vh double #ff8d00;
      }
      .cell.selected {
        background: #dee2e6;
      }
      .art {
        height: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      .road, .road:hover, .road.picked {
        background: transparent;
        border: none;
        border-radius:0;
        box-shadow: none;
        z-index: -1;
      }
      .road .art {
        display: none;
      }
      .road.up.down::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        width: 0;
        height: 100%;
        border-left: 0.4vh double #ff8d00;
        transform: translateX(-50%);
      }
      .road.left.right::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 0;
        border-top: 0.4vh double #ff8d00;
        transform: translateY(-50%);
      }
      .road.up.left::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        width: 0;
        height: 50%;
        border-left: 0.4vh double #ff8d00;
        transform: translateX(-50%);
      }
      .road.up.left::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 50%;
        height: 0;
        border-top: 0.4vh double #ff8d00;
        transform: translateY(-50%);
      }
      .road.down.right::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0;
        height: 50%;
        border-left: 0.4vh double #ff8d00;
        transform: translateX(-50%);
      }
      .road.down.right::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 50%;
        height: 0;
        border-top: 0.4vh double #ff8d00;
        transform: translateY(-50%);
      }
      .road.up.right::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        width: 0;
        height: 50%;
        border-left: 0.4vh double #ff8d00;
        transform: translateX(-50%);
      }
      .road.up.right::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 50%;
        height: 0;
        border-top: 0.4vh double #ff8d00;
        transform: translateY(-50%);
      }
      .road.down.left::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0;
        height: 50%;
        border-left: 0.4vh double #ff8d00;
        transform: translateX(-50%);
      }
      .road.down.left::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 50%;
        height: 0;
        border-top: 0.4vh double #ff8d00;
        transform: translateY(-50%);
      }

    `;

    // add to shadow root
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.cell);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const picked = this.getAttribute("picked");
    const char = this.getAttribute("char");
    const dir1 = this.getAttribute("dir1");
    const dir2 = this.getAttribute("dir2");
    this.cell.classList = "";
    this.cell.classList.add("cell");
    if (picked) this.cell.classList.add("picked");
    if (!char) this.cell.classList.add("road");
    else if (char === "-1") this.cell.classList.add("road", dir1, dir2);
    else this.art.style.backgroundImage = `url('${path(`/assets/characters/pikachu_${char}.png`)}')`;
  }

  static observedAttributes = ["picked", "char", "dir1", "dir2"];

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "picked" || name === "char" || name === "dir1" || name === "dir2") {
      this.render();
    }
  }
}
