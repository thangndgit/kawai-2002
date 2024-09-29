import { TimerBar } from "./timer-bar.js";
import { GameCell } from "./game-cell.js";
import { GameSheet } from "./game-sheet.js";
import { GameStatus } from "./game-status.js";

import { Screen } from "./screen.js";
import { ScreenHome } from "./screen-home.js";
import { ScreenGame } from "./screen-game.js";
import { ScreenInstall } from "./screen-install.js";

!customElements.get("mtm-timer-bar") && customElements.define("mtm-timer-bar", TimerBar);
!customElements.get("mtm-game-cell") && customElements.define("mtm-game-cell", GameCell);
!customElements.get("mtm-game-sheet") && customElements.define("mtm-game-sheet", GameSheet);
!customElements.get("mtm-game-status") && customElements.define("mtm-game-status", GameStatus);

!customElements.get("mtm-screen") && customElements.define("mtm-screen", Screen);
!customElements.get("mtm-screen-home") && customElements.define("mtm-screen-home", ScreenHome);
!customElements.get("mtm-screen-game") && customElements.define("mtm-screen-game", ScreenGame);
!customElements.get("mtm-screen-install") && customElements.define("mtm-screen-install", ScreenInstall);
