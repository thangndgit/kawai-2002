export class GameSheet extends HTMLElement {
  #sheetCol;
  #sheetRow;
  #charCount;
  #sheetMtx;
  #cells;

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
  #initSheetMtx() {
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
    const sheet = Array.from({ length: this.#sheetRow }, () => Array(this.#sheetCol).fill(-1));

    sheet.forEach((row, i) => {
      if (i === 0 || i === sheet.length - 1) return;
      row.forEach((_, j) => {
        if (j === 0 || j === row.length - 1) return;
        row[j] = shuffledCells.pop();
      });
    });

    return sheet;
  }

  #initCells() {
    const cells = [];

    if (!this.#sheetMtx) this.#sheetMtx = this.#initSheetMtx();
    this.#sheetMtx.forEach((row) => {
      const rowArr = [];
      const rowEl = document.createElement("div");
      rowEl.classList.add("row");

      row.forEach(() => {
        const cellEl = document.createElement("mtm-game-cell");
        cellEl.classList.add("cell");
        rowArr.push(cellEl);
        rowEl.appendChild(cellEl);
      });

      cells.push(rowArr);
      this.sheet.appendChild(rowEl);
    });

    return cells;
  }

  render() {
    if (!this.#cells) this.#cells = this.#initCells();
    this.#cells.forEach((row, i) => {
      row.forEach((cell, j) => {
        cell.setAttribute("char", this.#sheetMtx[i][j]);
      });
    });
  }

  connectedCallback() {
    this.render();
  }

  getMinMax(a, b, converter = (data) => data) {
    if (converter(a) <= converter(b)) return { min: a, max: b };
    return { min: b, max: a };
  }

  isRoadClear(...points) {
    let sum = 0;

    for (let i = 1; i < points.length; i++) {
      const startP = points[i - 1];
      const endP = points[i];

      // vertical line
      if (startP.x === endP.x) {
        const Y = this.getMinMax(startP.y, endP.y);
        for (let j = Y.min; j <= Y.max; j++) sum += this.#sheetMtx[startP.x][j] + 1;
      }
      // horizontal line
      else {
        const X = this.getMinMax(startP.x, endP.x);
        for (let j = X.min; j <= X.max; j++) sum += this.#sheetMtx[j][startP.y] + 1;
      }
    }

    // fix sum
    points.forEach((p) => {
      sum -= this.#sheetMtx[p.x][p.y] + 1;
    });

    return sum === 0;
  }

  getPath(p1, p2) {
    // not the same type
    if (this.#sheetMtx[p1.x][p1.y] !== this.#sheetMtx[p2.x][p2.y]) {
      return [];
    }

    // check 1 line
    if (p1.x === p2.x || p1.y === p2.y) {
      if (this.isRoadClear(p1, p2)) {
        return [p1, p2];
      }
    }

    // set corner
    const X = this.getMinMax(p1, p2, (p) => p.x);
    const Y = this.getMinMax(p1, p2, (p) => p.y);
    let path;

    // check 2 lines
    path = [p1, { x: p1.x, y: p2.y }, p2];
    if (this.isRoadClear(...path)) {
      return path;
    }

    path = [p1, { x: p2.x, y: p1.y }, p2];
    if (this.isRoadClear(...path)) {
      return path;
    }

    // check 3 lines (inner)
    // vertical
    for (let i = X.min.x + 1; i < X.max.x; i++) {
      path = [X.min, { x: i, y: X.min.y }, { x: i, y: X.max.y }, X.max];
      if (this.isRoadClear(...path)) {
        return path;
      }
    }
    // horizontal
    for (let i = Y.min.y + 1; i < Y.max.y; i++) {
      path = [Y.min, { x: Y.min.x, y: i }, { x: Y.max.x, y: i }, Y.max];
      if (this.isRoadClear(...path)) {
        return path;
      }
    }

    // check 3 lines (outer)
    const blocked = { up: false, down: false, left: false, right: false };

    for (let i = 1; i <= 1102; i++) {
      if (blocked.up && blocked.down && blocked.left && blocked.right) return;
      let newX, newY;
      // move up
      if (!blocked.up) {
        newX = X.min.x - i;
        if (newX < 0) {
          blocked.up = true;
        } else if (this.#sheetMtx[newX][X.min.y] !== -1) {
          blocked.up = true;
        } else {
          path = [X.min, { x: newX, y: X.min.y }, { x: newX, y: X.max.y }, X.max];
          if (this.isRoadClear(...path)) {
            return path;
          }
        }
      }
      // move down
      if (!blocked.down) {
        newX = X.max.x + i;
        if (newX > 10) {
          blocked.down = true;
        } else if (this.#sheetMtx[newX][X.max.y] !== -1) {
          blocked.down = true;
        } else {
          path = [X.max, { x: newX, y: X.max.y }, { x: newX, y: X.min.y }, X.min];
          if (this.isRoadClear(...path)) {
            return path;
          }
        }
      }
      // move left
      if (!blocked.left) {
        newY = Y.min.y - i;
        if (newY < 0) {
          blocked.left = true;
        } else if (this.#sheetMtx[Y.min.x][newY] !== -1) {
          blocked.left = true;
        } else {
          path = [Y.min, { x: Y.min.x, y: newY }, { x: Y.max.x, y: newY }, Y.max];
          if (this.isRoadClear(...path)) {
            return path;
          }
        }
      }
      // move right
      if (!blocked.right) {
        newY = Y.max.y + i;
        if (newY > 17) {
          blocked.right = true;
        } else if (this.#sheetMtx[Y.max.x][newY] !== -1) {
          blocked.right = true;
        } else {
          path = [Y.max, { x: Y.max.x, y: newY }, { x: Y.min.x, y: newY }, Y.min];
          if (this.isRoadClear(...path)) {
            return path;
          }
        }
      }
    }

    return [];
  }
}
