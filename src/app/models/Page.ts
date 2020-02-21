export class Page {
  totalPages: number;
  totalElements: number;
  pageSize: number;

  constructor(object) {
    this.totalPages = object.totalPages;
    this.totalElements = object.totalElements;
    this.pageSize = object.pageable.pageSize;
  }
}
