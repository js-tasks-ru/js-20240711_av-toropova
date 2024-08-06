export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], { data = [], sorted = {} } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.element = this.createElement();
    this.selectSubElements();
    this.sort(this.sorted.id || this.headerConfig[0].id, this.sorted.order || 'asc');
    this.initEventListeners();
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
        ${this.sorted.id === id ? this.getArrowTemplate() : ''}
      </div>
    `;
  }

  getArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>`;
  }

  createHeaderTemplate() {
    return this.headerConfig.map(item => this.createHeaderItemTemplate(item)).join('');
  }

  createBodyRowTemplate(item) {
    return `
      <div class="sortable-table__row">
        ${this.headerConfig.map(({ id }) => `<div class="sortable-table__cell">${item[id]}</div>`).join('')}
      </div>
    `;
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
    this.updateArrow(field);
  }

  updateArrow(field) {
    const headerCells = this.subElements.header.querySelectorAll('.sortable-table__cell');
    headerCells.forEach(cell => {
      cell.querySelector('[data-element="arrow"]')?.remove();
    });
    const currentCell = [...headerCells].find(cell => cell.dataset.id === field);
    currentCell.insertAdjacentHTML('beforeend', this.getArrowTemplate());
  }

  initEventListeners() {
    const headerCells = this.subElements.header.querySelectorAll('.sortable-table__cell[data-sortable="true"]');
    headerCells.forEach(cell => {
      cell.addEventListener('pointerdown', () => {
        const isAsc = this.sorted.id === cell.dataset.id && this.sorted.order === 'asc';
        const newOrder = isAsc ? 'desc' : 'asc';
        this.sort(cell.dataset.id, newOrder);
        this.sorted = { id: cell.dataset.id, order: newOrder };
      });
    });
  }

  destroyListeners() {
    document.removeEventListener('click', this.handleDocumentClick)
}

  destroy() {
    this.element.remove();
    this.destroyListeners();
  }
}