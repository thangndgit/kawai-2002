export class GameSheet extends HTMLElement {
  #sheetCol;
  #sheetRow;
  #charCount;
  #sheet;

  constructor() {
    super();

    // Private fields
    this.#sheetCol = 16 + 2;
    this.#sheetRow = 9 + 2;
    this.#charCount = 36;

    // html
    this.sheet = document.createElement("div");
    this.sheet.classList.add("sheet");

    // style
    const style = document.createElement("style");
    style.textContent = `
      .sheet {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
      }
      .row {
        display: flex;
        flex-wrap: nowrap;
      }
      .cell {
        width: 100%;
      }
    `;

    // add to shadow root
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.sheet);
  }

  // convert sheet to flat array (only cell)
  #sheetToCells(sheet) {
    let cells = [];
    for (let a = 0; a < sheet.length; a++) cells.push(...sheet[a]);
    cells = cells.filter((c) => c >= 0);
    return cells;
  }

  // shuffle cells => shuffle sheet
  #shuffleCells(cells) {
    for (let a = cells.length - 1; a > 0; a--) {
      const b = Math.floor(Math.random() * (a + 1));
      [cells[a], cells[b]] = [cells[b], cells[a]];
    }
    return cells;
  }

  // shuffle sheet for new order
  #shuffleSheet(sheet) {
    const cells = this.#sheetToCells(sheet);

    for (let a = 0; a < sheet.length; a++) {
      for (let b = 0; b < sheet[a].length; b++) {
        const cell = sheet[a][b];
        if (cell < 0) continue;
        sheet[a][b] = cells.pop();
      }
    }

    return sheet;
  }

  // generate a sheet from scratch
  #initSheet() {
    const cells = [];
    const totalCells = (this.#sheetCol - 2) * (this.#sheetRow - 2);
    const cellsPerChar = Math.ceil(totalCells / this.#charCount);

    // create cells
    for (let a = 0; a < this.#charCount; a++) {
      for (let b = 0; b < cellsPerChar; b++) {
        cells.push(a);
      }
    }

    const shuffledCells = this.#shuffleCells(cells);

    // create sheet
    const sheet = Array.from({ length: this.#sheetRow }, () => Array(this.#sheetCol).fill(-2));

    sheet.forEach((row, i) => {
      if (i === 0 || i === sheet.length - 1) return;
      row.forEach((_, i) => {
        if (i === 0 || i === row.length - 1) return;
        row[i] = shuffledCells.pop();
      });
    });

    return sheet;
  }

  render() {
    if (!this.#sheet) this.#sheet = this.#initSheet();
    this.#sheet.forEach((row, i) => {
      const rowEl = document.createElement("div");
      rowEl.classList.add("row");

      row.forEach((cell, j) => {
        const cellEl = document.createElement("mtm-game-cell");
        cellEl.classList.add("cell");

        if (i === 0 || i === this.#sheet.length - 1 || j === 0 || j === row.length - 1) {
          //
        } else {
          cellEl.setAttribute("char", cell);
        }

        rowEl.appendChild(cellEl);
      });

      this.sheet.appendChild(rowEl);
    });
  }

  connectedCallback() {
    this.render();
  }
}
