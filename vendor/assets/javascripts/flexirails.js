// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window) {
    var Flexirails, defaults, document, extractAttribute, firstPageSVG, lastPageSVG, nextPageSVG, pluginName, prevPageSVG;
    pluginName = 'flexirails';
    document = window.document;
    firstPageSVG = '<svg version="1.2" baseProfile="tiny" id="Navigation_first" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 512 512" overflow="inherit" xml:space="preserve"> <path d="M186.178,256.243l211.583,166.934V89.312L186.178,256.243z M112.352,422.512h66.179V89.975h-66.179V422.512z"/> </svg>';
    prevPageSVG = '<svg version="1.2" baseProfile="tiny" id="Navigation_left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 512 512" overflow="inherit" xml:space="preserve"> <polygon points="148.584,255.516 360.168,88.583 360.166,422.445 "/> </svg>';
    lastPageSVG = '<svg version="1.2" baseProfile="tiny" id="Navigation_last" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 512 512" overflow="inherit" xml:space="preserve"> <path d="M111.708,424.514l211.581-166.927L111.708,90.654V424.514z M330.935,87.311v332.544h66.173V87.311H330.935z"/> </svg>';
    nextPageSVG = '<svg version="1.2" baseProfile="tiny" id="Navigation_right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 512 512" overflow="inherit" xml:space="preserve"> <polygon points="360.124,255.513 148.535,422.442 148.537,88.58 "/> </svg>';
    defaults = {
      limitFetchResultsTo: 50,
      limitDisplayPerPageTo: 25,
      limitDisplayPerPageOptions: [5, 25, 50, 100, 250],
      locales: {
        results: {
          perPage: 'Results per Page:',
          page: 'Page ',
          of: ' of ',
          total: ' Results'
        }
      }
    };
    extractAttribute = function(obj, qualifiedName) {
      var attribute, current, part, parts, value, _i, _len;
      parts = qualifiedName.split(".");
      current = obj;
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        if (current.hasOwnProperty(part)) {
          current = current[part];
        } else {
          break;
        }
      }
      value = current;
      attribute = parts[parts.length - 1];
      if ((value != null) && typeof value === 'object') {
        if (value.hasOwnProperty(attribute)) {
          value = current[attribute];
        } else {
          value = null;
        }
      }
      return value;
    };
    Flexirails = (function() {

      Flexirails.prototype.t = function(name) {
        return extractAttribute(this.options.locales, name);
      };

      function Flexirails(element, options) {
        this.element = element;
        this.updatePerPage = __bind(this.updatePerPage, this);

        this.changePerPageOption = __bind(this.changePerPageOption, this);

        this.paginateToLastPage = __bind(this.paginateToLastPage, this);

        this.paginateToNextPage = __bind(this.paginateToNextPage, this);

        this.paginateToPrevPage = __bind(this.paginateToPrevPage, this);

        this.paginateToFirstPage = __bind(this.paginateToFirstPage, this);

        this.paginateToAnyPage = __bind(this.paginateToAnyPage, this);

        this.changePerPage = __bind(this.changePerPage, this);

        this.buildFlexiview = __bind(this.buildFlexiview, this);

        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this._formatterFunctions = {};
        this._currentView = options.view;
        this._url = options.url;
        this._pagination = {
          last: 1,
          first: 1
        };
        if (options.hasOwnProperty('locales')) {
          this.locales = options.locales;
        }
        this.init();
      }

      Flexirails.prototype.init = function() {
        var bottomNavigation, topNavigation;
        this.initializingView = true;
        if (!this._currentView.hasOwnProperty('totalResults')) {
          this._currentView.totalResults = 1;
        }
        if (this._currentView.hasOwnProperty('current_page')) {
          this._currentView.currentPage = this._currentView.current_page;
          delete this._currentView.current_page;
        }
        this._currentView.currentPage = this._currentView.hasOwnProperty('currentPage') ? parseInt(this._currentView.currentPage, 10) : 1;
        if (this._currentView.hasOwnProperty('per_page')) {
          this._currentView.perPage = this._currentView.per_page;
          delete this._currentView.per_page;
        }
        this._currentView.perPage = this._currentView.hasOwnProperty('perPage') ? parseInt(this._currentView.perPage, 10) : this._defaults.perPage;
        this.initializingView = false;
        this.flexiContainer = $(document.createElement('div')).addClass('flexirails');
        if (this.flexiTable != null) {
          $(this.flexiTable).remove();
        }
        this.flexiTable = document.createElement('table');
        this.flexiContainer.append(this.flexiTable);
        topNavigation = $(document.createElement('div'));
        this.createNavigation(topNavigation);
        $(this.element).append(topNavigation);
        this.flexiContainer.append(this.flexiTable);
        $(this.element).append(this.flexiContainer);
        bottomNavigation = $(document.createElement('div'));
        this.createNavigation(bottomNavigation);
        $(this.element).append(bottomNavigation);
        return this.invalidateView();
      };

      Flexirails.prototype.reloadFlexidata = function() {
        var request;
        if (!(this._url != null) || this.dontExecuteQueries || this.initializingView || this.loadingData) {
          return;
        }
        $(this.element).find(".js-fr-from-page").attr('disabled', 'disabled');
        request = $.ajax({
          type: 'GET',
          url: this._url,
          data: this.buildFlexiOptions(),
          success: this.buildFlexiview,
          dataType: 'json'
        });
        this.loadingData = true;
        return this.appendResults = false;
      };

      Flexirails.prototype.buildFlexiview = function(data, textStatus, XMLHttpRequest) {
        var arr, col, cur_req, fragment, header, item, td, th, _i, _j, _len, _len1, _ref, _tr;
        this._currentView.totalResults = parseInt(data.total, 10) || 0;
        this.setFlexirailsOptions(data);
        fragment = document.createDocumentFragment();
        if (!this.appendResults) {
          while (this.flexiTable.hasChildNodes()) {
            this.flexiTable.removeChild(this.flexiTable.firstChild);
          }
          this.loadedRows = 0;
          header = document.createElement("tr");
          _ref = this._currentView.cols;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            col = _ref[_i];
            th = document.createElement('th');
            th.className = col.attribute;
            th.appendChild(document.createTextNode(col.title));
            header.appendChild(th);
          }
          fragment.appendChild(header);
        }
        arr = data.rows;
        this.loadedRows += arr.length;
        cur_req = Math.round(this.loadedRows / this._defaults.limitFetchResultsTo);
        if (arr.length === 0) {
          _tr = document.createElement('tr');
          _tr.className = 'no_results';
          td = document.createElement('td');
          td.className = 'center';
          td.appendChild(document.createTextNode("Keine Einträge vorhanden"));
          _tr.appendChild(td);
          fragment.appendChild(_tr);
        }
        for (_j = 0, _len1 = arr.length; _j < _len1; _j++) {
          item = arr[_j];
          fragment.appendChild(this.buildFlexiRow(item));
        }
        this.flexiTable.appendChild(fragment.cloneNode(true));
        this.setupFirstLastColumns();
        this.loadingData = false;
        if ((this.loadedRows < this._currentView.perPage) && (this.loadedRows < this._currentView.totalResults)) {
          this.appendFlexiData();
          if (this._currentView.currentPage === this._pagination.last) {
            return $(this.element).find(".js-fr-from-page").removeAttr('disabled');
          }
        } else {
          this.appendResults = false;
          $(this.element).find(".js-fr-from-page").removeAttr('disabled');
          return $(this.element).find(".flexirails-container").trigger("complete");
        }
      };

      Flexirails.prototype.appendFlexiData = function() {
        var limit;
        if ((this._currentView.perPage * (this._currentView.currentPage - 1) + this.loadedRows) < this._currentView.totalResults) {
          this.appendResults = true;
          limit = this._defaults.limitFetchResultsTo;
          if (this._currentView.perPage > 0) {
            limit = Math.min(this._defaults.limitFetchResultsTo, this._currentView.perPage - this.loadedRows);
          }
          return $.ajax({
            type: 'GET',
            url: this._url,
            data: this.buildFlexiOptions({}, {
              limit: limit,
              offset: this.loadedRows
            }),
            success: this.buildFlexiview,
            dataType: 'json'
          });
        }
      };

      Flexirails.prototype.buildFlexiRow = function(obj) {
        var col, j, td, _i, _len, _ref, _tr;
        _tr = document.createElement('tr');
        _tr.className = 'flexirow';
        if (obj.hasOwnProperty('id')) {
          _tr.className += ' row-' + obj.id;
        }
        _ref = this._currentView.cols;
        for (j = _i = 0, _len = _ref.length; _i < _len; j = ++_i) {
          col = _ref[j];
          td = document.createElement('td');
          this.appendClasses(td, j, col);
          this._formatterFunctions[col.attribute](td, obj, col, extractAttribute(obj, col.attribute));
          _tr.appendChild(td);
        }
        return _tr;
      };

      Flexirails.prototype.buildFlexiOptions = function(options, override) {
        var opts;
        opts = {};
        $.extend(opts, options);
        opts.pagination = {};
        opts.pagination.current_page = this._currentView.currentPage;
        opts.pagination.per_page = this._currentView.perPage;
        opts.limit = this._defaults.limitFetchResultsTo;
        opts.offset = 0;
        $.extend(opts, override);
        return opts;
      };

      Flexirails.prototype.changePerPage = function(evt) {
        return this.updatePerPage($(evt.currentTarget).val());
      };

      Flexirails.prototype.paginateToAnyPage = function(evt) {
        return this.paginate($(evt.currentTarget).val());
      };

      Flexirails.prototype.paginateToFirstPage = function() {
        return this.paginate(this._pagination.first);
      };

      Flexirails.prototype.paginateToPrevPage = function() {
        return this.paginate(Math.max(parseInt(this._currentView.currentPage, 10) - 1, this._pagination.first));
      };

      Flexirails.prototype.paginateToNextPage = function() {
        return this.paginate(Math.min(parseInt(this._currentView.currentPage, 10) + 1, this._pagination.last));
      };

      Flexirails.prototype.paginateToLastPage = function() {
        return this.paginate(this._pagination.last);
      };

      Flexirails.prototype.changePerPageOption = function(evt) {
        return this.updatePerPage($(evt.currentTarget).val());
      };

      Flexirails.prototype.paginate = function(to_page) {
        if (to_page > this._pagination.last || to_page < 1) {
          $(this.element).find(".js-fr-from-page").val(this._currentView.currentPage);
        }
        if (this._currentView.currentPage !== to_page) {
          this._currentView.currentPage = parseInt(to_page, 10);
          return this.reloadFlexidata();
        }
      };

      Flexirails.prototype.appendClasses = function(td, index, col) {
        var className;
        className = '';
        if (index === 0) {
          className = 'first ';
        } else if (index === this._currentView.cols.length - 1) {
          className = 'last ';
        }
        className += " " + col.attribute + " ";
        return td.className = className;
      };

      Flexirails.prototype.updatePerPage = function(new_per_page) {
        if (new_per_page === -1) {
          if (!confirm(this.t('confirm.loadAll'))) {
            $(":input[name=per_page]").val(this._currentView.perPage);
            return;
          }
        }
        if (new_per_page !== this._currentView.perPage) {
          this._currentView.currentPage = 1;
          this._currentView.perPage = new_per_page;
          return this.reloadFlexidata();
        }
      };

      Flexirails.prototype.setupFirstLastColumns = function() {
        var firstCol, lastCol;
        $(this.element).find("td.first,th.first").removeClass("first");
        $(this.element).find("td.last,th.last").removeClass("last");
        firstCol = this._currentView.cols[0];
        $(this.element).find("td." + firstCol.cacheName).addClass("first");
        $(this.element).find("th." + firstCol.cacheName).addClass("first");
        lastCol = this._currentView.cols[this._currentView.cols.length - 1];
        $(this.element).find("td." + lastCol.cacheName).addClass("last");
        return $(this.element).find("th." + lastCol.cacheName).addClass("last");
      };

      Flexirails.prototype.buildDefaultFlexiCell = function(td, obj, col, val) {
        if (val != null) {
          return td.appendChild(document.createTextNode(val));
        } else {
          val = "-";
          return td.className += 'center';
        }
      };

      Flexirails.prototype.setViewOptions = function() {
        $(this.element).find(".total_results").html(this._currentView.totalResults);
        $(this.element).find(".js-fr-from-page").val(this._currentView.currentPage);
        $(this.element).find(".to").html(this._pagination.last);
        return $(this.element).find(":input[name=per_page]").val(this._currentView.perPage);
      };

      Flexirails.prototype.setFlexirailsOptions = function(data) {
        if (this.appendResults) {
          return;
        }
        this._pagination.last = Math.ceil(this._currentView.totalResults / (this._currentView.perPage === -1 ? data.total : this._currentView.perPage));
        this._currentView.currentPage = data.currentPage;
        this.setViewOptions();
        this.dontExecuteQueries = false;
        if (this._currentView.perPage === -1 || this._pagination.last === this._pagination.first) {
          return $(this.element).find(".pagination.logic").hide();
        } else {
          return $(this.element).find(".pagination.logic").show();
        }
      };

      Flexirails.prototype.registerFormatter = function(keyPath, fnc) {
        return this._formatterFunctions[keyPath] = fnc;
      };

      Flexirails.prototype.updateRow = function(obj) {
        return $(".row-" + obj.id, this.flexiTable).replaceWith(this.buildFlexiRow(obj));
      };

      Flexirails.prototype.createNavigation = function(container) {
        var data, item, navigation, resultsPerPage, _i, _len, _ref;
        if (!this.hasOwnProperty('navigationTemplate')) {
          this.navigationTemplateSource = '<div class="results">' + '<span class="total_results">1</span>' + ' Ergebnisse,' + '</div>' + '<div class="label">{{locales/resultsPerPage}}</div>' + '<div class="select">' + '<select id="per_page" name="per_page">' + '{{#resultsPerPage}}' + '<option value="{{value}}">{{label}}</option>' + '{{/resultsPerPage}}' + '</select>' + '</div>' + '<div class="pagination">' + '<a name="toFirstPage"><span class="first">' + firstPageSVG + '</span></a>' + '<a name="toPrevPage"><span class="prev">' + prevPageSVG + '</span></a>' + '<div class="page">' + '<span>{{locales/page}}</span>' + '<input class="js-fr-from-page" name="current_page_box" type="text">' + '<span>{{locales/of}}</span>' + '<span class="to">1</span>' + '</div>' + '<a name="toNextPage"><span class="next">' + nextPageSVG + '</span></a>' + '<a name="toLastPage"><span class="last">' + lastPageSVG + '</span></a>' + '</div>';
          this.navigationTemplate = Handlebars.compile(this.navigationTemplateSource);
        }
        resultsPerPage = [];
        _ref = this._defaults.limitDisplayPerPageOptions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          resultsPerPage.push({
            value: item,
            label: item
          });
        }
        container.addClass('navigation');
        data = {
          locales: {
            "resultsPerPage": this.t('results.perPage', this),
            "page": this.t('results.page', this),
            "of": this.t('results.of', this)
          },
          "resultsPerPage": resultsPerPage
        };
        navigation = this.navigationTemplate(data);
        container.append(navigation);
        $(container).delegate("a[name=toFirstPage]", "click", this.paginateToFirstPage);
        $(container).delegate("a[name=toPrevPage]", "click", this.paginateToPrevPage);
        $(container).delegate("a[name=toNextPage]", "click", this.paginateToNextPage);
        $(container).delegate("a[name=toLastPage]", "click", this.paginateToLastPage);
        $(container).delegate(":input[name=current_page_box]", "change", this.paginateToAnyPage);
        return $(container).delegate(":input[name=per_page]", "change", this.changePerPage);
      };

      Flexirails.prototype.invalidateView = function() {
        var col, _i, _len, _ref;
        this.dontExecuteQueries = true;
        this.setViewOptions();
        if (this._pagination.last === this._pagination.first || this._currentView.totalResults === 0) {
          $(this.element).find(".pagination.logic").hide();
        } else {
          $(this.element).find(".pagination.logic").show();
        }
        this.dontExecuteQueries = false;
        _ref = this._currentView.cols;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          col = _ref[_i];
          if (!this._formatterFunctions.hasOwnProperty(col.attribute)) {
            this._formatterFunctions[col.attribute] = this.buildDefaultFlexiCell;
          }
        }
        return this.reloadFlexidata();
      };

      return Flexirails;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(this, "plugin_" + pluginName, new Flexirails(this, options));
          return $(this).trigger('initialized');
        }
      });
    };
  })(jQuery, window);

}).call(this);
