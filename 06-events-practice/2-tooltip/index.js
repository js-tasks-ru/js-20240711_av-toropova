class Tooltip {
  element;

  constructor() {
    if (Tooltip.prototype.instance) {
      return Tooltip.prototype.instance;
    }
    Tooltip.prototype.instance = this;

    this.initialize();
  }

  createTooltipElement() {
    const element = document.createElement('div');
    element.className = 'tooltip';
    return element;
  }

  initialize() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
    document.addEventListener('pointermove', this.onPointerMove);
  }

  destroy() {
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
    this.element.remove();
  }

  onPointerOver = (event) => {
    const target = event.target.closest('[data-tooltip]');
    if (target) {
      this.render(target.dataset.tooltip);
    }
  };

  onPointerOut = (event) => {
    if (this.element) {
      this.element.remove()
    }
  };

  onPointerMove = (event) => {
    if (!this.element) return;
    this.element.style.left = event.clientX + 'px';
    this.element.style.top  = event.clientY + 'px';
  }


  render(text) {
    this.element = this.createTooltipElement();
    this.element.textContent = text;
    document.body.append(this.element);
  }
}

export default Tooltip;