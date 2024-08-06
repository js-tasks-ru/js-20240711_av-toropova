export default class SortableTableV1 {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = { id: headerConfig[0].id, order: 'asc' };
    this.element = this.createElement();
    this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createHeaderItemTemplate({ id, title, sortable }) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  createHeaderTemplate() {
    return this.headerConfig.map(item => this.createHeaderItemTemplate(item)).join('');
  }

  createBodyRowTemplate(item) {
    return `
      <div class="sortable-table__row">
        ${this.headerConfig.map(({ id, template }) => template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`).join('')}
      </div>`;
  }

  createBodyTemplate() {
    return this.data.map(item => this.createBodyRowTemplate(item)).join('');
  }

  createTemplate() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header">
          ${this.createHeaderTemplate()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createBodyTemplate()}
        </div>
      </div>
    `;
  }

  sort(field, order) {
    const { sortType } = this.headerConfig.find(item => item.id === field);

    this.sorted = { id: field, order };

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[order];

    const sortedData = [...this.data].sort((a, b) => {
      if (sortType === 'number') {
        return direction * (a[field] - b[field]);
      } else {
        return direction * a[field].localeCompare(b[field], ['ru', 'en'], { sensitivity: 'base' });
      }
    });

    this.data = sortedData;
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  destroy() {
    this.element.remove();
  }
}
