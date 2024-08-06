import SortableTableV1 from "./sortable-table-v1.js"
export default class SortableTable extends SortableTableV1 {
  isSortLocally = true;
  sortField;
  sortOrder;

  constructor(headerConfig = [], { data = [], sorted = {} } = {}) {
    super(headerConfig, data)
    this.sorted = sorted;
    super.sort(sorted.id, sorted.order);
    this.createEventListeners();
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  sortOnServer() { }

  sortOnClient() {
    super.sort(this.sortField, this.sortOrder)
  }

  createEventListeners() {
    this.handlePointerDownEvent = this.handlePointerDownEvent.bind(this);
    this.subElements.header.addEventListener(
      "pointerdown",
      this.handlePointerDownEvent
    );
  }

  handlePointerDownEvent(event) {
    const currentColumn = event.target.closest('[data-sortable="true"]');
    if (!currentColumn) return;
    this.sortField = currentColumn.dataset.id;
    this.sortOrder = currentColumn.dataset.order === "asc" ? "desc" : "asc";
    currentColumn.dataset.order = this.sortOrder;
    this.sort();
  }

  destroyEventListeners() {
    this.subElements.header.removeEventListener(
      "pointerdown",
      this.handlePointerDownEvent
    );
  }

  destroy() {
    super.destroy();
    this.destroyEventListeners();
  }
}
