export class TimerBar extends HTMLElement {
  constructor() {
    super();

    this._duration = this.getAttribute("duration") || 10 * 60 * 1000; // Total duration for the timer
    this._remainingTime = this._duration; // To track remaining time
    this._elapsedTime = 0; // Time already passed when stopped
    this._isRunning = false; // To track if the timer is currently running
    this._animationFrame = null; // RequestAnimationFrame ID for canceling
    this._timeoutID = null; // Timeout ID for stopping the timer after time-up

    // HTML structure
    this.bar = document.createElement("div");
    this.bar.classList.add("timer-bar");

    this.timePast = document.createElement("div");
    this.timePast.classList.add("time-past");
    this.bar.appendChild(this.timePast);

    // CSS styles
    const style = document.createElement("style");
    style.innerText = `
        .timer-bar {
          // width: 2.5dvw;
          aspect-ratio: 1/15;
          height: 100%;
          border: 0.25dvh solid #ad8;
          background: linear-gradient(to top, #f00 0%, yellow 30%, #0f0 60%, #0f0 100%);
          display: flex;
          flex-direction: column;
          justify-content: start;
        }
        .time-past {
          background: #000;
          width: 100%;
          height: 0%;
          transition: width linear;
        }
      `;

    // Attach shadow DOM
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.bar);
  }

  // Method to animate the timer bar based on the remaining time
  _animateTimer() {
    const elapsedTime = Date.now() - this._startTime;
    const progress = (elapsedTime / this._duration) * 100;

    if (progress < 100) {
      this.timePast.style.height = `${progress}%`;
      this._animationFrame = requestAnimationFrame(() => this._animateTimer());
    } else {
      this.timePast.style.height = "100%";
    }
  }

  // Method to start or resume the timer
  start() {
    if (this._isRunning) return; // Prevent multiple starts
    this._isRunning = true;

    // Set the start time based on the remaining time
    this._startTime = Date.now() - this._elapsedTime; // Continue from the time it was stopped

    // Animate the timer's progress
    this._animateTimer();

    // Set a timeout for when the timer is complete
    this._timeoutID = setTimeout(() => {
      this._isRunning = false;
      this.dispatchEvent(
        new CustomEvent("time-up", {
          bubbles: true,
          composed: true,
        })
      );
    }, this._remainingTime - this._elapsedTime); // Adjust time based on the already elapsed time
  }

  // Method to stop/pause the timer
  stop() {
    if (!this._isRunning) return; // Only stop if running
    this._isRunning = false;

    // Calculate the elapsed time
    this._elapsedTime = Date.now() - this._startTime; // Time passed since the timer started

    // Cancel the animation and timeout
    cancelAnimationFrame(this._animationFrame);
    clearTimeout(this._timeoutID);
  }

  // Method to reset the timer
  reset() {
    this.stop(); // Stop the timer
    this._elapsedTime = 0; // Reset the elapsed time
    this._remainingTime = this._duration; // Reset remaining time
    this.timePast.style.height = "0%"; // Reset the width of the progress bar
  }

  connectedCallback() {
    if (this.hasAttribute("autostart")) {
      this.start();
    }
  }
}
