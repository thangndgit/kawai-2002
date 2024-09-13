import { SOUNDS } from "../constants/constants.js";
import { playSound } from "../utils/assets.js";

export class GameSheet extends HTMLElement {
  #sheetCol;
  #sheetRow;
  #charCount;
  #sheetMtx;
  #cells;
  #pickedCell1;
  #pickedCell2;
  #level;
  #rule;

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
    let cells = this.#sheetToCells(sheet);
    cells = this.#shuffleCells(cells);

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
    this.#sheetMtx.forEach((row, i) => {
      const rowArr = [];
      const rowEl = document.createElement("div");
      rowEl.classList.add("row");

      row.forEach((_, j) => {
        const cellEl = document.createElement("mtm-game-cell");
        cellEl.classList.add("cell");
        cellEl.setAttribute("x", i);
        cellEl.setAttribute("y", j);

        cellEl.addEventListener("click", () => {
          if (cellEl.getAttribute("char") === "-1") return;

          // select first
          if (!this.#pickedCell1) {
            this.#pickedCell1 = cellEl;
            cellEl.setAttribute("picked", true);
            playSound(SOUNDS.BASE_CLICK);
          }
          // deselect first
          else if (this.#pickedCell1 === cellEl) {
            this.#pickedCell1 = null;
            cellEl.removeAttribute("picked");
            playSound(SOUNDS.UNDO_CLICK);
          }
          // select second
          else if (!this.#pickedCell2) {
            this.#pickedCell2 = cellEl;
            cellEl.setAttribute("picked", true);
            this.#connectCells();
          }
        });

        rowArr.push(cellEl);
        rowEl.appendChild(cellEl);
      });

      cells.push(rowArr);
      this.sheet.appendChild(rowEl);
    });

    return cells;
  }

  #connectCells() {
    const p1 = {
      x: Number(this.#pickedCell1.getAttribute("x")),
      y: Number(this.#pickedCell1.getAttribute("y")),
    };
    const p2 = {
      x: Number(this.#pickedCell2.getAttribute("x")),
      y: Number(this.#pickedCell2.getAttribute("y")),
    };
    const path = this.getPath(p1, p2);
    this.#pickedCell1.removeAttribute("picked");
    this.#pickedCell2.removeAttribute("picked");
    this.#pickedCell1 = null;
    this.#pickedCell2 = null;

    // if not match
    if (!path.length) {
      playSound(SOUNDS.DUMB_CLICK);
      return;
    }

    // draw path between 2 points
    playSound(SOUNDS.WIDE_CLICK);
    this.#drawPath(path);

    // make cells disappear
    this.#sheetMtx[p1.x][p1.y] = -1;
    this.#sheetMtx[p2.x][p2.y] = -1;

    // apply level rule
    this.#fillHole(p1.x, p1.y, this.#rule);
    this.#fillHole(p2.x, p2.y, this.#rule);

    // check if finish level
    const sheetSum = this.#sheetMtx.reduce((sum, row) => sum + row.reduce((sum, cell) => sum + cell + 1, 0), 0);
    if (sheetSum === 0) {
      this.dispatchEvent(
        new CustomEvent("mtm-finish-level", {
          detail: { live: 1 },
          bubbles: true,
          composed: true,
        })
      );
    }

    // check if there is any path left
    else {
      const anyPath = this.findPath();
      if (!anyPath.length) {
        this.#sheetMtx = this.#shuffleSheet(this.#sheetMtx);
        this.dispatchEvent(
          new CustomEvent("mtm-change-live", {
            detail: { live: -1 },
            bubbles: true,
            composed: true,
          })
        );
      }
    }

    // re- render
    window.setTimeout(() => this.render(), 100);

    // dispatch event increase point
    this.dispatchEvent(
      new CustomEvent("mtm-change-point", {
        detail: { point: 20 },
        bubbles: true,
        composed: true,
      })
    );
  }

  #drawPath(points) {
    for (let i = 1; i < points.length; i++) {
      const startP = points[i - 1];
      const endP = points[i];
      this.#drawLine(startP, endP);
    }
  }

  #drawLine(p1, p2) {
    // horizontal line
    if (p1.x === p2.x) {
      const Y = this.getMinMax(p1.y, p2.y);
      for (let i = Y.min; i <= Y.max; i++) {
        const cell = this.#cells[p1.x][i];
        if (i === Y.min)
          cell.getAttribute("dir1") ? cell.setAttribute("dir2", "right") : cell.setAttribute("dir1", "right");
        else if (i === Y.max)
          cell.getAttribute("dir1") ? cell.setAttribute("dir2", "left") : cell.setAttribute("dir1", "left");
        else {
          cell.setAttribute("dir1", "left");
          cell.setAttribute("dir2", "right");
        }

        window.setTimeout(() => {
          cell.removeAttribute("dir1");
          cell.removeAttribute("dir2");
        }, 100);
      }
    }
    // vertical line
    else {
      const X = this.getMinMax(p1.x, p2.x);
      for (let i = X.min; i <= X.max; i++) {
        const cell = this.#cells[i][p1.y];
        if (i === X.min)
          cell.getAttribute("dir1") ? cell.setAttribute("dir2", "down") : cell.setAttribute("dir1", "down");
        else if (i === X.max)
          cell.getAttribute("dir1") ? cell.setAttribute("dir2", "up") : cell.setAttribute("dir1", "up");
        else {
          cell.setAttribute("dir1", "up");
          cell.setAttribute("dir2", "down");
        }

        window.setTimeout(() => {
          cell.removeAttribute("dir1");
          cell.removeAttribute("dir2");
        }, 50);
      }
    }
  }

  #fillHole(x, y, rule) {
    if (x < 1 || y < 1 || x > this.#sheetRow - 2 || y > this.#sheetCol - 2 || this.#sheetMtx[x][y] !== -1) return;

    let newX = x;
    let newY = y;

    // cell around move up
    if (rule(x + 1, y) === "move_up") {
      newX++;
      if (this.#sheetMtx[newX][newY] === -1 && rule(x + 2, y) === "move_up") newX++;
    }
    // cell around move down
    else if (rule(x - 1, y) === "move_down") {
      newX--;
      if (this.#sheetMtx[newX][newY] === -1 && rule(x - 2, y) === "move_down") newX--;
    }
    // cell around move left
    else if (rule(x, y + 1) === "move_left") {
      newY++;
      if (this.#sheetMtx[newX][newY] === -1 && rule(x, y + 2) === "move_left") newY++;
    }
    // cell around move right
    else if (rule(x, y - 1) === "move_right") {
      newY--;
      if (this.#sheetMtx[newX][newY] === -1 && rule(x, y - 2) === "move_right") newY--;
    }

    if (x === newX && y === newY) return;

    if (this.#sheetMtx?.[newX]?.[newY] !== undefined) {
      this.#sheetMtx[x][y] = this.#sheetMtx[newX][newY];
      this.#sheetMtx[newX][newY] = -1;
      return this.#fillHole(newX, newY, rule);
    }

    return;
  }

  getMinMax(a, b, converter = (data) => data) {
    if (converter(a) <= converter(b)) return { min: a, max: b };
    return { min: b, max: a };
  }

  // check if can create a road from given points
  isRoadClear(...points) {
    let sum = 0;

    for (let i = 1; i < points.length; i++) {
      const startP = points[i - 1];
      const endP = points[i];

      // horizontal line
      if (startP.x === endP.x) {
        const Y = this.getMinMax(startP.y, endP.y);
        for (let j = Y.min; j <= Y.max; j++) sum += this.#sheetMtx[startP.x][j] + 1;
      }
      // vertical line
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

  // check if can this point go out
  isIntrovertPoint(p) {
    const centerP = this.#sheetMtx[p.x][p.y];
    const upP = this.#sheetMtx[p.x - 1][p.y];
    const downP = this.#sheetMtx[p.x + 1][p.y];
    const leftP = this.#sheetMtx[p.x][p.y - 1];
    const rightP = this.#sheetMtx[p.x][p.y + 1];
    if (centerP === upP || centerP === downP || centerP === leftP || centerP === rightP) return false;
    if (upP === -1 || downP === -1 || leftP === -1 || rightP === -1) return false;
    return true;
  }

  // find a random path
  findPath() {
    const mapPoints = {};
    for (let i = 0; i < this.#charCount; i++) mapPoints[i] = [];

    // get extrovert point and group them by type
    for (let i = 1; i <= this.#sheetMtx.length - 2; i++) {
      for (let j = 1; j <= this.#sheetMtx[i].length - 2; j++) {
        const pointChar = this.#sheetMtx[i][j].toString();
        if (pointChar === "-1") continue;

        const point = { x: i, y: j };
        if (!this.isIntrovertPoint(point)) {
          mapPoints[pointChar].push(point);
        }
      }
    }

    // convert group object to array
    const arrPoints = Object.keys(mapPoints)
      .map((key) => mapPoints[key])
      .filter((race) => race.length > 1);

    // find if there is any path between 2 point in same type
    for (let i = 0; i < arrPoints.length; i++) {
      const points = arrPoints[i];

      for (let j = 0; j < points.length; j++) {
        for (let k = j + 1; k < points.length; k++) {
          const path = this.getPath(points[j], points[k]);
          if (path.length) return path;
        }
      }
    }

    return [];
  }

  // show suggestion
  suggestPath() {
    const path = this.findPath();
    const { x: x1, y: y1 } = path[0];
    const { x: x2, y: y2 } = path[path.length - 1];
    this.#cells[x1][y1].setAttribute("picked", true);
    this.#cells[x2][y2].setAttribute("picked", true);
  }

  // get path from point 1 to point 2 if exist
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
    if (this.isRoadClear(...path)) return path;

    path = [p1, { x: p2.x, y: p1.y }, p2];
    if (this.isRoadClear(...path)) return path;

    // check 3 lines (inner)
    // vertical
    for (let i = X.min.x + 1; i < X.max.x; i++) {
      path = [X.min, { x: i, y: X.min.y }, { x: i, y: X.max.y }, X.max];
      if (this.isRoadClear(...path)) return path;
    }
    // horizontal
    for (let i = Y.min.y + 1; i < Y.max.y; i++) {
      path = [Y.min, { x: Y.min.x, y: i }, { x: Y.max.x, y: i }, Y.max];
      if (this.isRoadClear(...path)) return path;
    }

    // check 3 lines (outer)
    const blocked = { up: false, down: false, left: false, right: false };

    for (let i = 1; i <= 1102; i++) {
      if (blocked.up && blocked.down && blocked.left && blocked.right) break;
      let newX, newY;
      // move up
      if (!blocked.up) {
        newX = X.min.x - i;
        if (newX < 0 || this.#sheetMtx[newX][X.min.y] !== -1) {
          blocked.up = true;
        } else {
          path = [X.min, { x: newX, y: X.min.y }, { x: newX, y: X.max.y }, X.max];
          if (this.isRoadClear(...path)) return path;
        }
      }
      // move down
      if (!blocked.down) {
        newX = X.max.x + i;
        if (newX > 10 || this.#sheetMtx[newX][X.max.y] !== -1) {
          blocked.down = true;
        } else {
          path = [X.max, { x: newX, y: X.max.y }, { x: newX, y: X.min.y }, X.min];
          if (this.isRoadClear(...path)) return path;
        }
      }
      // move left
      if (!blocked.left) {
        newY = Y.min.y - i;
        if (newY < 0 || this.#sheetMtx[Y.min.x][newY] !== -1) {
          blocked.left = true;
        } else {
          path = [Y.min, { x: Y.min.x, y: newY }, { x: Y.max.x, y: newY }, Y.max];
          if (this.isRoadClear(...path)) return path;
        }
      }
      // move right
      if (!blocked.right) {
        newY = Y.max.y + i;
        if (newY > 17 || this.#sheetMtx[Y.max.x][newY] !== -1) {
          blocked.right = true;
        } else {
          path = [Y.max, { x: Y.max.x, y: newY }, { x: Y.min.x, y: newY }, Y.min];
          if (this.isRoadClear(...path)) return path;
        }
      }
    }

    return [];
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
    this.#level = this.getAttribute("level") || 1;
    const ruleId = (Number(this.#level) % 16) + 1;

    this.#rule = {
      1: () => "stand_still",
      2: () => "move_down",
      3: () => "move_up",
      4: () => "move_right",
      5: () => "move_left",
      6: (_, y) => (y <= 8 ? "move_left" : "move_right"),
      7: (_, y) => (y <= 8 ? "move_right" : "move_left"),
      8: (x) => (x <= 4 ? "move_up" : x >= 6 ? "move_down" : "stay_still"),
      9: (x) => (x <= 4 ? "move_down" : x >= 6 ? "move_up" : "stay_still"),
      10: (_, y) => (y <= 8 ? "move_up" : "move_down"),
      11: (_, y) => (y <= 8 ? "move_down" : "move_up"),
      12: (x) => (x <= 4 ? "move_left" : x >= 6 ? "move_right" : "stay_still"),
      13: (x) => (x <= 4 ? "move_right" : x >= 6 ? "move_left" : "stay_still"),
      14: (_, y) => (y % 2 === 0 ? "move_up" : "move_down"),
      15: (x) => (x % 2 === 0 ? "move_left" : "move_right"),
      16: (x, y) => {
        if (x <= 4 && y <= 8) return "move_up";
        if (x <= 4 && y >= 9) return "move_right";
        if (x >= 6 && y >= 9) return "move_down";
        if (x >= 6 && y <= 8) return "move_left";
        return "stand_still";
      },
    }[ruleId];

    this.render();
  }

  static observedAttributes = ["level"];

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "level") {
      this.#level = this.getAttribute("level") || 1;
      this.#rule = {
        1: () => "stand_still",
        2: () => "move_down",
        3: () => "move_up",
        4: () => "move_right",
        5: () => "move_left",
        6: (x) => (x <= 8 ? "move_left" : "move_right"),
        7: (x) => (x <= 8 ? "move_right" : "move_left"),
      }[this.#level];
      this.render();
    }
  }
}
