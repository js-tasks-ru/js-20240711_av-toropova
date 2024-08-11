import {default as ColumnChartV1} from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
    constructor(props = {}) {
        super(props);
        this.subElements = this.getSubElements(this.element);
    }

    async update(from, to) {
        this.element.classList.add('column-chart_loading');
        
        const data = await this.fetchData(from, to);
        this.data = Object.values(data);
        
        this.element.classList.remove('column-chart_loading');
        this.renderChart();
        
        return data;
    }

    async fetchData(from, to) {
        const response = await fetch(`${BACKEND_URL}?from=${from}&to=${to}`);
        return await response.json();
    }

    renderChart() {
        const { body } = this.subElements;

        body.innerHTML = '';

        const chartTemplate = this.createChartTemplate(this.data);
        body.insertAdjacentHTML('beforeend', chartTemplate);
    }

    getSubElements(element) {
        const result = {};
        const elements = element.querySelectorAll('[data-element]');
        for (const subElement of elements) {
            const name = subElement.dataset.element;
            result[name] = subElement;
        }
        return result;
    }

}
