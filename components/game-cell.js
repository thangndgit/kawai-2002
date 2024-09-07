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
        border-radius: 0.25em;
        border: 1px solid #999;
        position: relative;
        box-shadow: 0.3vw 0.3vw 0px 0px #999;
        cursor: pointer;
        user-select: none;
        pointer-events: auto;
        padding: 0 0.25vw;
      }
      .cell:hover, .cell.selected {
        border: 0.35vh solid #F8080F;
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
    `;

    // add to shadow root
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.cell);
  }

  connectedCallback() {
    const char = this.getAttribute("char");
    if (!char) return;
    this.art.style.backgroundImage = `url('/assets/characters/pikachu_${char}.png')`;
  }

  select() {
    this.cell.classList.add("selected");
  }

  deselect() {
    this.cell.classList.remove("selected");
  }
}
