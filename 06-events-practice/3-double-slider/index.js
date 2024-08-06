export default class DoubleSlider {
    constructor({ min, max, selected = { from: min, to: max }, formatValue }) {
        this.min = min;
        this.max = max;
        this.selected = selected;
        this.formatValue = formatValue;
        this.element = this.render();
        this.initEventListeners();
    }

    render() {
        const slider = document.createElement('div');
        slider.classList.add('range-slider');

        const fromLabel = document.createElement('span');
        fromLabel.dataset.element = 'from';
        fromLabel.textContent = this.formatValue(this.selected.from);

        const toLabel = document.createElement('span');
        toLabel.dataset.element = 'to';
        toLabel.textContent = this.formatValue(this.selected.to);

        const leftThumb = document.createElement('div');
        leftThumb.classList.add('range-slider__thumb-left');

        const rightThumb = document.createElement('div');
        rightThumb.classList.add('range-slider__thumb-right');

        slider.append(fromLabel, leftThumb, rightThumb, toLabel);
        document.body.append(slider);
        return slider;
    }

    initEventListeners() {
        const leftThumb = this.element.querySelector('.range-slider__thumb-left');
        const rightThumb = this.element.querySelector('.range-slider__thumb-right');

        leftThumb.addEventListener('pointerdown', this.onThumbMouseDown.bind(this, 'left'));
        rightThumb.addEventListener('pointerdown', this.onThumbMouseDown.bind(this, 'right'));
    }

    onThumbMouseDown(direction, event) {
        event.preventDefault();

        const onMouseMove = (moveEvent) => {
            const clientX = moveEvent.clientX;
            const sliderRect = this.element.getBoundingClientRect();
            const sliderWidth = sliderRect.width;

            let newValue = direction === 'left'
                ? Math.round(this.min + ((clientX - sliderRect.left) / sliderWidth) * (this.max - this.min))
                : Math.round(this.min + ((clientX - sliderRect.left) / sliderWidth) * (this.max - this.min));

            if (direction === 'left') {
                this.selected.from = Math.max(this.min, Math.min(newValue, this.selected.to));
            } else {
                this.selected.to = Math.min(this.max, Math.max(newValue, this.selected.from));
            }

            this.updateLabels();
            this.dispatchRangeSelectEvent();

            if (this.selected.from === this.selected.to) {
                this.selected.to = this.selected.from; // Ensure both thumbs are at the same position if equal
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('pointermove', onMouseMove);
            document.removeEventListener('pointerup', onMouseUp);
        };

        document.addEventListener('pointermove', onMouseMove);
        document.addEventListener('pointerup', onMouseUp);
    }

    updateLabels() {
        const fromLabel = this.element.querySelector('span[data-element="from"]');
        const toLabel = this.element.querySelector('span[data-element="to"]');
        fromLabel.textContent = this.formatValue(this.selected.from);
        toLabel.textContent = this.formatValue(this.selected.to);
    }

    dispatchRangeSelectEvent() {
        const event = new CustomEvent('range-select', {
            detail: { from: this.selected.from, to: this.selected.to }
        });
        this.element.dispatchEvent(event);
    }

    destroy() {
        this.element.remove();
    }
}

