export default class NotificationMessage {
    element;
    duration;
    static lastShownComponent;
    constructor(message = '', props = {}) {
        const {
            duration = 0,
            type = ''
        } = props;

        this.message = message;
        this.duration = duration;
        this.type = type;

        this.element = this.createElement();
    }

    createElement() {
        const element = document.createElement('div');

        element.innerHTML = this.createTemplate();

        return element.firstElementChild;
    }

    createTemplate() {
        return `  <div class="notification ${this.type}" style="--value:${this.duration}">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
  </div>`;
    }

    show(container = document.body) {
        if (this.lastShownComponent) {
            this.lastShownComponent.destroy();
        }
        this.lastShownComponent = this.element;

        this.timerId = setTimeout(() => {
            this.remove();
        }, this.duration);
        
        container.append(this.element);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
    }
}
