'use strict';

angular.module('nlptabApp').service('Pagination',
  /**
   * Pagination service.
   *
   * @class nlptabApp.common.Pagination
   *
   * @constructor
   */
  function Pagination() {
    function PaginationInstance(page, itemsPerPage, totalItems) {
      this.page = page ? page : 1;

      this.itemsPerPage = itemsPerPage ? itemsPerPage : 10;

      this.totalItems = totalItems ? totalItems : 0;
    }

    PaginationInstance.prototype.getFrom = function () {
      return (this.page - 1) * this.itemsPerPage;
    };

    PaginationInstance.prototype.getSize = function () {
      return this.itemsPerPage;
    };

    PaginationInstance.prototype.totalPages = function () {
      return this.totalItems / this.itemsPerPage;
    };

    PaginationInstance.prototype.hasLowerPages = function () {
      return this.page > 1;
    };

    PaginationInstance.prototype.increment = function () {
      this.page = this.page + 1;
    };

    PaginationInstance.prototype.hasHigherPages = function () {
      return this.page < this.totalPages();
    };

    PaginationInstance.prototype.decrement = function () {
      this.page = this.page - 1;
    };

    PaginationInstance.prototype.reset = function () {
      this.page = 1;
      this.totalItems = 0;
    };

    /**
     * Constructs a new pagination object.
     *
     * @param {number} [page=1] the current page, indexes starting at 1.
     * @param {number} [itemsPerPage=10] the number of items that are displayed per page.
     * @param {number} [totalItems=0] the total number of items fetched.
     * @returns {nlptabApp.common.PaginationInstance}
     */
    this.withPageAndItemsPerPage = function (page, itemsPerPage, totalItems) {
      return new PaginationInstance(page, itemsPerPage, totalItems);
    };
  });
