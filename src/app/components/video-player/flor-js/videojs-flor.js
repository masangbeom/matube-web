/*! @name videojs-flor @version 0.0.0 @license UNLICENSED */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = global || self, global.videojsFlor = factory(global.videojs));
}(this, function (videojs) { 'use strict';

  videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var version = "0.0.0";

  function findChild(parent, name, result) {
    var children = [];

    if (parent && parent.childIndex_ && Object.keys(parent.childIndex_).length) {
      for (var componentId in parent.childIndex_) {
        var component = parent.childIndex_[componentId];

        if (component && component.name_ == name) {
          var _result$push;

          result.push((_result$push = {
            parent: parent,
            component: component,
            index: parent.children_.indexOf(component)
          }, _result$push[name] = component, _result$push));
        }

        children.push(findChild(component, name, result));
      }
    }

    return {
      name: name,
      parent: parent,
      children: children
    };
  }

  videojs.getComponent('Component').prototype.findChild = function (name) {
    var result = [];
    findChild(this, name, result);
    return result;
  };

  var Title =
  /*#__PURE__*/
  function (_videojs$getComponent) {
    _inheritsLoose(Title, _videojs$getComponent);

    function Title(player, options) {
      var _this;

      _this = _videojs$getComponent.call(this, player, options) || this;
      _this.title_ = options.playerOptions.title || '';

      _this.update(_this.title_);

      return _this;
    }

    var _proto = Title.prototype;

    _proto.createEl = function createEl() {
      var el = _videojs$getComponent.prototype.createEl.call(this, 'div', {
        className: 'vjs-title'
      });

      this.contentEl_ = videojs.dom.createEl('div', {
        className: 'vjs-title-field'
      });
      el.appendChild(this.contentEl_);
      return el;
    };

    _proto.update = function update(title_) {
      if (!title_) {
        this.hide();
      } else {
        this.show();
      }

      this.player_.cache_.title = this.title_;
      this.title_ = title_;
      this.contentEl_.innerHTML = title_;
    };

    return Title;
  }(videojs.getComponent('Component'));

  var title = function title(title_) {
    var videoTitle = this.player_.getChild('VideoTitle');

    if (typeof title_ === 'undefined') {
      return videoTitle.title_;
    }

    videoTitle.update(title_);
  };

  videojs.registerPlugin('title', title);
  videojs.registerComponent('VideoTitle', Title);
  videojs.getComponent('Player').prototype.options_.children.splice(2, 0, 'VideoTitle');

  var MenuItem = videojs.getComponent('MenuItem');

  var ContextMenuItem =
  /*#__PURE__*/
  function (_MenuItem) {
    _inheritsLoose(ContextMenuItem, _MenuItem);

    function ContextMenuItem(player, options) {
      var _this;

      _this = _MenuItem.call(this, player, _extends({}, options, {
        selectable: true
      })) || this;

      _this.addClass('vjs-context-menu-item');

      _this.controlText(options.label);

      return _this;
    }

    var _proto = ContextMenuItem.prototype;

    _proto.createEl = function createEl() {
      var _MenuItem$prototype$c;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var el = (_MenuItem$prototype$c = _MenuItem.prototype.createEl).call.apply(_MenuItem$prototype$c, [this].concat(args));

      el.insertAdjacentHTML('afterbegin', "<span aria-hidden=\"true\" class=\"vjs-icon-placeholder " + (this.options_.icon || '') + "\"></span>");
      return el;
    };

    _proto.handleClick = function handleClick() {
      var ContextMenu = this.player_.findChild('ContextMenu')[0].component;
      ContextMenu.hide();
    };

    return ContextMenuItem;
  }(MenuItem);

  videojs.registerComponent('ContextMenuItem', ContextMenuItem);

  var ContextMenuToggleLoop =
  /*#__PURE__*/
  function (_ContextMenuItem) {
    _inheritsLoose(ContextMenuToggleLoop, _ContextMenuItem);

    function ContextMenuToggleLoop(player) {
      var _this;

      _this = _ContextMenuItem.call(this, player, {
        name: 'ContextMenuToggleLoop',
        label: 'Loop',
        icon: 'vjs-icon-loop'
      }) || this;

      _this.addClass('vjs-checkbox');

      player.on('loadstart', _this.update.bind(_assertThisInitialized(_this)));
      return _this;
    }

    var _proto = ContextMenuToggleLoop.prototype;

    _proto.update = function update() {
      this.selected(this.player_.loop());
    };

    _proto.handleClick = function handleClick() {
      _ContextMenuItem.prototype.handleClick.call(this);

      this.player_.loop(!this.player_.loop());
      this.update();
    };

    return ContextMenuToggleLoop;
  }(ContextMenuItem);

  videojs.registerComponent('ContextMenuToggleLoop', ContextMenuToggleLoop);

  var AboutThisPlayer =
  /*#__PURE__*/
  function (_ContextMenuItem) {
    _inheritsLoose(AboutThisPlayer, _ContextMenuItem);

    function AboutThisPlayer(player) {
      return _ContextMenuItem.call(this, player, {
        name: 'AboutThisPlayer',
        label: 'Flor Player 1.1.0',
        //About
        icon: 'vjs-icon-about'
      }) || this;
    }

    var _proto = AboutThisPlayer.prototype;

    _proto.handleClick = function handleClick() {
      _ContextMenuItem.prototype.handleClick.call(this);

      window.open('https://vidjs.com', '_blank');
    };

    return AboutThisPlayer;
  }(ContextMenuItem);

  videojs.registerComponent('AboutThisPlayer', AboutThisPlayer);

  var ClickableComponent = videojs.getComponent('ClickableComponent'); // for mobile view

  var CloseContextMenu =
  /*#__PURE__*/
  function (_ClickableComponent) {
    _inheritsLoose(CloseContextMenu, _ClickableComponent);

    function CloseContextMenu() {
      return _ClickableComponent.apply(this, arguments) || this;
    }

    var _proto = CloseContextMenu.prototype;

    _proto.buildCSSClass = function buildCSSClass() {
      return 'vjs-close-menu-layer vjs-close-context-menu';
    };

    _proto.handleClick = function handleClick() {
      this.options_.menu.hide();
    };

    return CloseContextMenu;
  }(ClickableComponent);

  videojs.registerComponent('CloseContextMenu', CloseContextMenu);

  var Menu = videojs.getComponent('Menu');

  var ContextMenu =
  /*#__PURE__*/
  function (_Menu) {
    _inheritsLoose(ContextMenu, _Menu);

    function ContextMenu(player, options) {
      var _this;

      _this = _Menu.call(this, player, options) || this;

      _this.addClass('vjs-context-menu');

      _this.hide();

      _this.player_.on('contextmenu', _this.onContextmenu.bind(_assertThisInitialized(_this)));

      return _this;
    }

    var _proto = ContextMenu.prototype;

    _proto.createEl = function createEl() {
      var _Menu$prototype$creat;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var el = (_Menu$prototype$creat = _Menu.prototype.createEl).call.apply(_Menu$prototype$creat, [this].concat(args));

      var layer = new CloseContextMenu(this.player_, {
        menu: this
      });
      el.insertBefore(layer.el_, el.firstElementChild);
      return el;
    };

    _proto.show = function show(x, y) {
      _Menu.prototype.show.call(this);

      this.el_.style.top = y + 'px';
      this.el_.style.left = x + 'px';
    };

    _proto.onContextmenu = function onContextmenu(event) {
      event.preventDefault();
      var rect = this.player_.el().getBoundingClientRect();
      var pageX = event.pageX,
          pageY = event.pageY;

      if (pageY > rect.y && pageY - rect.height < rect.y && pageX > rect.x && pageX - rect.width < rect.x) {
        var x = pageX - rect.x;
        var y = pageY - rect.y;
        this.show(x, y);
      } else {
        this.hide();
      }
    };

    _proto.handleClick = function handleClick(evt) {
      if (evt.button || evt.button === 0) {
        if (evt.button !== 2) {
          this.hide();
        }
      }
    };

    return ContextMenu;
  }(Menu);

  ContextMenu.prototype.options_ = {
    children: ['ContextMenuToggleLoop', 'AboutThisPlayer']
  };
  videojs.registerComponent('ContextMenu', ContextMenu);
  videojs.getComponent('Player').prototype.options_.children.push('ContextMenu');

  var ClickableComponent$1 = videojs.getComponent('ClickableComponent');

  var CloseSettingMenu =
  /*#__PURE__*/
  function (_ClickableComponent) {
    _inheritsLoose(CloseSettingMenu, _ClickableComponent);

    function CloseSettingMenu() {
      return _ClickableComponent.apply(this, arguments) || this;
    }

    var _proto = CloseSettingMenu.prototype;

    _proto.buildCSSClass = function buildCSSClass() {
      return 'vjs-close-menu-layer vjs-close-setting-menu';
    };

    _proto.handleClick = function handleClick() {
      this.options_.menu.menuButton_.hideMenu();
    };

    return CloseSettingMenu;
  }(ClickableComponent$1);

  videojs.registerComponent('CloseSettingMenu', CloseSettingMenu);

  var Menu$1 = videojs.getComponent('Menu');

  var SettingMenu =
  /*#__PURE__*/
  function (_Menu) {
    _inheritsLoose(SettingMenu, _Menu);

    function SettingMenu(player, options) {
      var _this;

      _this = _Menu.call(this, player, _extends({}, options, {
        name: 'SettingMenu'
      })) || this;

      _this.addClass('vjs-setting-menu');

      setTimeout(_this.reset.bind(_assertThisInitialized(_this)), 0);
      return _this;
    }

    var _proto = SettingMenu.prototype;

    _proto.reset = function reset() {
      if (!this.contentEl_) {
        return;
      }

      this.removeStyle();
      var _this$contentEl_ = this.contentEl_,
          width = _this$contentEl_.offsetWidth,
          height = _this$contentEl_.offsetHeight;
      this.origin = {
        children: this.children().slice(0),
        width: width,
        height: height
      };
      this.resize({
        width: width,
        height: height
      });
      /**
       *  Since the width of setting menu depends on screen width.
       *  If player is initialized on small screen size then resize to a bigger screen,
       *  the width of setting menu will be too wide as the origin width is affected by css,
       *  A class `vjs-setting-menu-ready` as a condition for css on small screen,
       *  therefore the origin width will not be affected.
       */

      this.addClass('vjs-setting-menu-ready');
    };

    _proto.createEl = function createEl() {
      var el = _Menu.prototype.createEl.call(this);

      var layer = new CloseSettingMenu(this.player_, {
        menu: this
      });
      el.insertBefore(layer.el_, el.firstElementChild);
      return el;
    };

    _proto.update = function update(children) {
      var _this2 = this;

      if (children === void 0) {
        children = [];
      }

      var children_ = this.children().slice(0);
      children_.forEach(function (child) {
        _this2.removeChild(child);
      });
      children.forEach(function (child) {
        _this2.addChild(child);
      });
    };

    _proto.resize = function resize(_ref) {
      var width = _ref.width,
          height = _ref.height;
      this.contentEl_.style.width = width + 'px';
      this.contentEl_.style.height = height + 'px';
    };

    _proto.restore = function restore() {
      this.resize(this.origin);
      this.update(this.origin.children);
    };

    _proto.removeStyle = function removeStyle() {
      this.contentEl_.removeAttribute('style');
    };

    _proto.hide = function hide() {// Disable default hide function
      // As the default hide function violate the calculation of menu dimension
    };

    return SettingMenu;
  }(Menu$1);

  videojs.registerComponent('SettingMenu', SettingMenu);

  var MenuItem$1 = videojs.getComponent('MenuItem');

  var SettingMenuItem =
  /*#__PURE__*/
  function (_MenuItem) {
    _inheritsLoose(SettingMenuItem, _MenuItem);

    function SettingMenuItem(player, options) {
      var _this;

      _this = _MenuItem.call(this, player, videojs.mergeOptions({
        selectable: false
      }, options)) || this;
      _this.menu = options.menu;
      return _this;
    }

    return SettingMenuItem;
  }(MenuItem$1);

  videojs.registerComponent('SettingMenuItem', SettingMenuItem);

  var SettingOnOffItem =
  /*#__PURE__*/
  function (_SettingMenuItem) {
    _inheritsLoose(SettingOnOffItem, _SettingMenuItem);

    function SettingOnOffItem() {
      return _SettingMenuItem.apply(this, arguments) || this;
    }

    var _proto = SettingOnOffItem.prototype;

    _proto.createEl = function createEl() {
      var options = this.options_;
      var el = videojs.dom.createEl('li', {
        className: 'vjs-menu-item vjs-setting-onoff-item',
        innerHTML: "\n        <div class=\"vjs-icon-placeholder " + (this.options_.icon || '') + "\"></div>\n        <div>" + this.localize(options.label) + "</div>\n        <div class=\"vjs-spacer\"></div>\n        <div>\n          <div class=\"vjs-onoff-button\"></div>\n        </div>\n      "
      });
      return el;
    };

    _proto.update = function update(active) {
      this.active = typeof active === 'undefined' ? !this.active : active;

      if (this.active) {
        this.addClass('vjs-active');
      } else {
        this.removeClass('vjs-active');
      }
    };

    _proto.handleClick = function handleClick() {
      this.update();
    };

    _proto.selected = function selected() {};

    return SettingOnOffItem;
  }(SettingMenuItem);

  videojs.registerComponent('SettingOnOffItem', SettingOnOffItem);

  var SettingSubOptionTitle =
  /*#__PURE__*/
  function (_SettingMenuItem) {
    _inheritsLoose(SettingSubOptionTitle, _SettingMenuItem);

    function SettingSubOptionTitle(player, options) {
      var _this;

      _this = _SettingMenuItem.call(this, player, options) || this;

      _this.addChild('Component', {}, 0);

      _this.addClass('vjs-settings-sub-menu-item');

      _this.addClass('vjs-settings-sub-menu-title');

      return _this;
    }

    var _proto = SettingSubOptionTitle.prototype;

    _proto.handleClick = function handleClick() {
      this.options_.menu.restore();
    };

    return SettingSubOptionTitle;
  }(SettingMenuItem);

  videojs.registerComponent('SettingSubOptionTitle', SettingSubOptionTitle);

  var SettingSubOptionItem =
  /*#__PURE__*/
  function (_SettingMenuItem) {
    _inheritsLoose(SettingSubOptionItem, _SettingMenuItem);

    function SettingSubOptionItem(player, options) {
      var _this;

      _this = _SettingMenuItem.call(this, player, options) || this;
      _this.selectable = true;

      _extends(_assertThisInitialized(_this), options);

      _this.addChild('Component', {}, 0);

      _this.addClass('vjs-settings-sub-menu-item');

      _this.addClass('vjs-settings-sub-menu-option');

      _this.update();

      return _this;
    }

    var _proto = SettingSubOptionItem.prototype;

    _proto.update = function update() {
      this.selected(this.value === this.parent.selected.value);
    };

    _proto.handleClick = function handleClick() {
      this.parent.onChange(this.options_);
      this.restore();
    };

    _proto.restore = function restore() {
      this.menu.restore();
    };

    return SettingSubOptionItem;
  }(SettingMenuItem);

  videojs.registerComponent('SettingSubOptionItem', SettingSubOptionItem);

  var SettingMenu$1 = videojs.getComponent('SettingMenu');

  var SettingMenuTemp =
  /*#__PURE__*/
  function (_SettingMenu) {
    _inheritsLoose(SettingMenuTemp, _SettingMenu);

    function SettingMenuTemp(player) {
      return _SettingMenu.call(this, player, {
        name: 'SettingMenuTemp'
      }) || this;
    }

    return SettingMenuTemp;
  }(SettingMenu$1);

  var getMenuDimension = function getMenuDimension(player, items) {
    var tempMenu = new SettingMenuTemp(player);
    tempMenu.update(items);
    player.addChild(tempMenu);
    var rect = tempMenu.contentEl_.getBoundingClientRect(); // remove subMenuItem form tempMenu first, otherwise they will also be disposed

    tempMenu.update();
    tempMenu.dispose(); // remove tempMenu in `player.children`

    player.removeChild(tempMenu);
    return rect;
  };

  /**
   * @param {Array<Object|number|string>} entries
   */

  function parseEntries(entries, selectedIndex) {
    entries = entries.map(function (data, index) {
      if (data !== null && typeof data !== 'object') {
        data = {
          value: data,
          label: data
        };
      }

      var isDefault = false;

      if (typeof selectedIndex === 'undefined' && data.default === true) {
        isDefault = true;
        selectedIndex = index;
      }

      return _extends({}, data, {
        index: index,
        default: isDefault
      });
    });
    return {
      entries: entries,
      selected: entries[selectedIndex || 0]
    };
  }

  var SettingOptionItem =
  /*#__PURE__*/
  function (_SettingMenuItem) {
    _inheritsLoose(SettingOptionItem, _SettingMenuItem);

    function SettingOptionItem(player, options) {
      var _this;

      if (options === void 0) {
        options = {};
      }

      _this = _SettingMenuItem.call(this, player, options) || this;

      _this.setEntries(_this.options_.entries);

      if (!_this.entries.length) {
        _this.hide();
      }

      return _this;
    }

    var _proto = SettingOptionItem.prototype;

    _proto.createEl = function createEl() {
      var _this$options_ = this.options_,
          icon = _this$options_.icon,
          label = _this$options_.label;
      var el = videojs.dom.createEl('li', {
        className: 'vjs-menu-item vjs-setting-menu-item',
        innerHTML: "\n        <div class=\"vjs-icon-placeholder " + (icon || '') + "\"></div>\n        <div class=\"vjs-setting-menu-label\">" + this.localize(label) + "</div>\n        <div class=\"vjs-spacer\"></div>\n      "
      });
      this.selectedValueEl = videojs.dom.createEl('div', {
        className: 'vjs-setting-menu-value'
      });
      el.appendChild(this.selectedValueEl);
      return el;
    };

    _proto.setEntries = function setEntries(entries_, selectedIndex) {
      var _this2 = this;

      if (entries_ === void 0) {
        entries_ = [];
      }

      _extends(this, parseEntries(entries_, selectedIndex));

      this.updateSelectedValue();
      var SubOptionItem = videojs.getComponent(this.name_ + "Child") || SettingSubOptionItem;
      this.subMenuItems = this.entries.map(function (_ref, index) {
        var label = _ref.label,
            value = _ref.value;
        return new SubOptionItem(_this2.player_, {
          index: index,
          label: label,
          value: value,
          parent: _this2,
          menu: _this2.menu
        });
      });
      this.subMenuItems.splice(0, 0, new SettingSubOptionTitle(this.player_, {
        label: this.options_.label,
        menu: this.menu
      }));
    };

    _proto.handleClick = function handleClick() {
      var dimensions = getMenuDimension(this.player_, this.subMenuItems);
      this.menu.update(this.subMenuItems);
      this.menu.resize(dimensions);
    };

    _proto.select = function select(index) {
      this.selected = this.entries[index];
    };

    _proto.update = function update() {
      this.updateSelectedValue();
      this.subMenuItems.forEach(function (item) {
        item.update && item.update();
      });
    };

    _proto.onChange = function onChange(_ref2) {
      var index = _ref2.index;
      this.select(index);
      this.update(index);
    };

    _proto.updateSelectedValue = function updateSelectedValue() {
      if (this.selected) {
        this.selectedValueEl.innerHTML = this.localize(this.selected.label);
      }
    };

    _proto.show = function show() {
      _SettingMenuItem.prototype.show.call(this);

      this.menu.reset();
    };

    return SettingOptionItem;
  }(SettingMenuItem);

  videojs.registerComponent('SettingOptionItem', SettingOptionItem);

  var PlaybackRateSettingItem =
  /*#__PURE__*/
  function (_SettingOptionItem) {
    _inheritsLoose(PlaybackRateSettingItem, _SettingOptionItem);

    function PlaybackRateSettingItem(player, options) {
      var _this;

      _this = _SettingOptionItem.call(this, player, _extends({}, options, {
        label: 'Speed',
        icon: 'vjs-icon-slow-motion-video',
        entries: [0.25, 0.5, 0.75, {
          label: 'Normal',
          value: 1,
          default: true
        }, //1.25,
        1.5, 1.75, 2]
      })) || this;

      _this.addClass('vjs-setting-playback-rate'); // Since playback rate will be reset to noraml when video source changed
      // So we need to listen on `ratechange`


      player.on('ratechange', function () {
        var rate = player.playbackRate();

        var index = _this.entries.findIndex(function (_ref) {
          var value = _ref.value;
          return rate === value;
        });

        if (index > -1) {
          _this.select(index);

          _this.update(index);
        }
      });
      return _this;
    }

    var _proto = PlaybackRateSettingItem.prototype;

    _proto.onChange = function onChange(_ref2) {
      var value = _ref2.value;
      this.player_.playbackRate(value);
    };

    return PlaybackRateSettingItem;
  }(SettingOptionItem);

  videojs.registerComponent('PlaybackRateSettingItem', PlaybackRateSettingItem);

  var MenuButton = videojs.getComponent('MenuButton');

  var SettingMenuButton =
  /*#__PURE__*/
  function (_MenuButton) {
    _inheritsLoose(SettingMenuButton, _MenuButton);

    function SettingMenuButton(player, options) {
      var _this;

      _this = _MenuButton.call(this, player, options) || this; // move menu to player

      player.addChild(_this.menu); // remove videojs parent child relationship between button and menu

      _this.removeChild(_this.menu);

      return _this;
    }

    var _proto = SettingMenuButton.prototype;

    _proto.buildCSSClass = function buildCSSClass() {
      return "vjs-setting-button " + _MenuButton.prototype.buildCSSClass.call(this);
    };

    _proto.buildWrapperCSSClass = function buildWrapperCSSClass() {
      return "vjs-setting-button " + _MenuButton.prototype.buildWrapperCSSClass.call(this);
    };

    _proto.createMenu = function createMenu() {
      var menu = new SettingMenu(this.player_, {
        menuButton: this
      });
      var entries = this.options_.entries || [];
      entries.forEach(function (component) {
        menu.addChild(component, {
          menu: menu
        });
      });
      return menu;
    };

    _proto.hideMenu = function hideMenu() {
      this.unpressButton();
      this.el_.blur();
    };

    _proto.unpressButton = function unpressButton() {
      _MenuButton.prototype.unpressButton.call(this);

      this.player_.removeClass('vjs-keep-control-showing');
      this.menu.restore();
    };

    _proto.handleClick = function handleClick() {
      var _this2 = this;

      this.player_.addClass('vjs-keep-control-showing');

      if (this.buttonPressed_) {
        this.unpressButton();
      } else {
        this.pressButton();
      }

      this.off(document.body, 'click', this.hideMenu); // this.off(document.body, 'touchend', this.hideMenu);

      setTimeout(function () {
        _this2.one(document.body, 'click', _this2.hideMenu); // _this.buttonPressed_ && _this.one(document.body, 'touchend', _this.hideMenu);

      }, 0);
    };

    return SettingMenuButton;
  }(MenuButton);

  SettingMenuButton.prototype.controlText_ = 'Settings';
  SettingMenuButton.prototype.options_ = {
    entries: ['PlaybackRateSettingItem']
  };
  videojs.registerComponent('SettingMenuButton', SettingMenuButton);

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n.default || n;
  }

  var commonjsHelpers = /*#__PURE__*/Object.freeze({
    commonjsGlobal: commonjsGlobal,
    commonjsRequire: commonjsRequire,
    unwrapExports: unwrapExports,
    createCommonjsModule: createCommonjsModule,
    getCjsExportFromNamespace: getCjsExportFromNamespace
  });

  var videojsContribQualityLevels = createCommonjsModule(function (module, exports) {
    /**
     * videojs-contrib-quality-levels
     * @version 2.0.4
     * @copyright 2018 Brightcove, Inc.
     * @license Apache-2.0
     */
    (function (f) {
      {
        module.exports = f();
      }
    })(function () {
      return function e(t, n, r) {
        function s(o, u) {
          if (!n[o]) {
            if (!t[o]) {
              var a = typeof commonjsRequire == "function" && commonjsRequire;
              if (!u && a) return a(o, !0);
              if (i) return i(o, !0);
              var f = new Error("Cannot find module '" + o + "'");
              throw f.code = "MODULE_NOT_FOUND", f;
            }

            var l = n[o] = {
              exports: {}
            };
            t[o][0].call(l.exports, function (e) {
              var n = t[o][1][e];
              return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
          }

          return n[o].exports;
        }

        var i = typeof commonjsRequire == "function" && commonjsRequire;

        for (var o = 0; o < r.length; o++) {
          s(r[o]);
        }

        return s;
      }({
        1: [function (require, module, exports) {
          (function (global) {

            exports.__esModule = true;

            var _video = typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null;

            var _video2 = _interopRequireDefault(_video);

            var _document = require('global/document');

            var _document2 = _interopRequireDefault(_document);

            var _qualityLevel = require('./quality-level.js');

            var _qualityLevel2 = _interopRequireDefault(_qualityLevel);

            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : {
                'default': obj
              };
            }

            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }

            function _possibleConstructorReturn(self, call) {
              if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }

              return call && (typeof call === "object" || typeof call === "function") ? call : self;
            }

            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
              }

              subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                  value: subClass,
                  enumerable: false,
                  writable: true,
                  configurable: true
                }
              });
              if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            /**
             * A list of QualityLevels.
             *
             * interface QualityLevelList : EventTarget {
             *   getter QualityLevel (unsigned long index);
             *   readonly attribute unsigned long length;
             *   readonly attribute long selectedIndex;
             *
             *   void addQualityLevel(QualityLevel qualityLevel)
             *   void removeQualityLevel(QualityLevel remove)
             *   QualityLevel? getQualityLevelById(DOMString id);
             *
             *   attribute EventHandler onchange;
             *   attribute EventHandler onaddqualitylevel;
             *   attribute EventHandler onremovequalitylevel;
             * };
             *
             * @extends videojs.EventTarget
             * @class QualityLevelList
             */


            var QualityLevelList = function (_videojs$EventTarget) {
              _inherits(QualityLevelList, _videojs$EventTarget);

              function QualityLevelList() {
                var _ret;

                _classCallCheck(this, QualityLevelList);

                var _this = _possibleConstructorReturn(this, _videojs$EventTarget.call(this));

                var list = _this; // eslint-disable-line

                if (_video2['default'].browser.IS_IE8) {
                  list = _document2['default'].createElement('custom');

                  for (var prop in QualityLevelList.prototype) {
                    if (prop !== 'constructor') {
                      list[prop] = QualityLevelList.prototype[prop];
                    }
                  }
                }

                list.levels_ = [];
                list.selectedIndex_ = -1;
                /**
                 * Get the index of the currently selected QualityLevel.
                 *
                 * @returns {number} The index of the selected QualityLevel. -1 if none selected.
                 * @readonly
                 */

                Object.defineProperty(list, 'selectedIndex', {
                  get: function get() {
                    return list.selectedIndex_;
                  }
                });
                /**
                 * Get the length of the list of QualityLevels.
                 *
                 * @returns {number} The length of the list.
                 * @readonly
                 */

                Object.defineProperty(list, 'length', {
                  get: function get() {
                    return list.levels_.length;
                  }
                });
                return _ret = list, _possibleConstructorReturn(_this, _ret);
              }
              /**
               * Adds a quality level to the list.
               *
               * @param {Representation|Object} representation The representation of the quality level
               * @param {string}   representation.id        Unique id of the QualityLevel
               * @param {number=}  representation.width     Resolution width of the QualityLevel
               * @param {number=}  representation.height    Resolution height of the QualityLevel
               * @param {number}   representation.bandwidth Bitrate of the QualityLevel
               * @param {Function} representation.enabled   Callback to enable/disable QualityLevel
               * @return {QualityLevel} the QualityLevel added to the list
               * @method addQualityLevel
               */


              QualityLevelList.prototype.addQualityLevel = function addQualityLevel(representation) {
                var qualityLevel = this.getQualityLevelById(representation.id); // Do not add duplicate quality levels

                if (qualityLevel) {
                  return qualityLevel;
                }

                var index = this.levels_.length;
                qualityLevel = new _qualityLevel2['default'](representation);

                if (!('' + index in this)) {
                  Object.defineProperty(this, index, {
                    get: function get() {
                      return this.levels_[index];
                    }
                  });
                }

                this.levels_.push(qualityLevel);
                this.trigger({
                  qualityLevel: qualityLevel,
                  type: 'addqualitylevel'
                });
                return qualityLevel;
              };
              /**
               * Removes a quality level from the list.
               *
               * @param {QualityLevel} remove QualityLevel to remove to the list.
               * @return {QualityLevel|null} the QualityLevel removed or null if nothing removed
               * @method removeQualityLevel
               */


              QualityLevelList.prototype.removeQualityLevel = function removeQualityLevel(qualityLevel) {
                var removed = null;

                for (var i = 0, l = this.length; i < l; i++) {
                  if (this[i] === qualityLevel) {
                    removed = this.levels_.splice(i, 1)[0];

                    if (this.selectedIndex_ === i) {
                      this.selectedIndex_ = -1;
                    } else if (this.selectedIndex_ > i) {
                      this.selectedIndex_--;
                    }

                    break;
                  }
                }

                if (removed) {
                  this.trigger({
                    qualityLevel: qualityLevel,
                    type: 'removequalitylevel'
                  });
                }

                return removed;
              };
              /**
               * Searches for a QualityLevel with the given id.
               *
               * @param {string} id The id of the QualityLevel to find.
               * @returns {QualityLevel|null} The QualityLevel with id, or null if not found.
               * @method getQualityLevelById
               */


              QualityLevelList.prototype.getQualityLevelById = function getQualityLevelById(id) {
                for (var i = 0, l = this.length; i < l; i++) {
                  var level = this[i];

                  if (level.id === id) {
                    return level;
                  }
                }

                return null;
              };
              /**
               * Resets the list of QualityLevels to empty
               *
               * @method dispose
               */


              QualityLevelList.prototype.dispose = function dispose() {
                this.selectedIndex_ = -1;
                this.levels_.length = 0;
              };

              return QualityLevelList;
            }(_video2['default'].EventTarget);
            /**
             * change - The selected QualityLevel has changed.
             * addqualitylevel - A QualityLevel has been added to the QualityLevelList.
             * removequalitylevel - A QualityLevel has been removed from the QualityLevelList.
             */


            QualityLevelList.prototype.allowedEvents_ = {
              change: 'change',
              addqualitylevel: 'addqualitylevel',
              removequalitylevel: 'removequalitylevel'
            }; // emulate attribute EventHandler support to allow for feature detection

            for (var event in QualityLevelList.prototype.allowedEvents_) {
              QualityLevelList.prototype['on' + event] = null;
            }

            exports['default'] = QualityLevelList;
          }).call(this, typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {
          "./quality-level.js": 2,
          "global/document": 4
        }],
        2: [function (require, module, exports) {
          (function (global) {

            exports.__esModule = true;

            var _video = typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null;

            var _video2 = _interopRequireDefault(_video);

            var _document = require('global/document');

            var _document2 = _interopRequireDefault(_document);

            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : {
                'default': obj
              };
            }

            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            /**
             * A single QualityLevel.
             *
             * interface QualityLevel {
             *   readonly attribute DOMString id;
             *            attribute DOMString label;
             *   readonly attribute long width;
             *   readonly attribute long height;
             *   readonly attribute long bitrate;
             *            attribute boolean enabled;
             * };
             *
             * @class QualityLevel
             */


            var QualityLevel =
            /**
             * Creates a QualityLevel
             *
             * @param {Representation|Object} representation The representation of the quality level
             * @param {string}   representation.id        Unique id of the QualityLevel
             * @param {number=}  representation.width     Resolution width of the QualityLevel
             * @param {number=}  representation.height    Resolution height of the QualityLevel
             * @param {number}   representation.bandwidth Bitrate of the QualityLevel
             * @param {Function} representation.enabled   Callback to enable/disable QualityLevel
             */
            function QualityLevel(representation) {
              _classCallCheck(this, QualityLevel);

              var level = this; // eslint-disable-line

              if (_video2['default'].browser.IS_IE8) {
                level = _document2['default'].createElement('custom');

                for (var prop in QualityLevel.prototype) {
                  if (prop !== 'constructor') {
                    level[prop] = QualityLevel.prototype[prop];
                  }
                }
              }

              level.id = representation.id;
              level.label = level.id;
              level.width = representation.width;
              level.height = representation.height;
              level.bitrate = representation.bandwidth;
              level.enabled_ = representation.enabled;
              Object.defineProperty(level, 'enabled', {
                /**
                 * Get whether the QualityLevel is enabled.
                 *
                 * @returns {boolean} True if the QualityLevel is enabled.
                 */
                get: function get() {
                  return level.enabled_();
                },

                /**
                 * Enable or disable the QualityLevel.
                 *
                 * @param {boolean} enable true to enable QualityLevel, false to disable.
                 */
                set: function set(enable) {
                  level.enabled_(enable);
                }
              });
              return level;
            };

            exports['default'] = QualityLevel;
          }).call(this, typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {
          "global/document": 4
        }],
        3: [function (require, module, exports) {}, {}],
        4: [function (require, module, exports) {
          (function (global) {
            var topLevel = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};

            var minDoc = require('min-document');

            var doccy;

            if (typeof document !== 'undefined') {
              doccy = document;
            } else {
              doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

              if (!doccy) {
                doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
              }
            }

            module.exports = doccy;
          }).call(this, typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {
          "min-document": 3
        }],
        5: [function (require, module, exports) {
          (function (global) {

            exports.__esModule = true;

            var _video = typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null;

            var _video2 = _interopRequireDefault(_video);

            var _qualityLevelList = require('./quality-level-list.js');

            var _qualityLevelList2 = _interopRequireDefault(_qualityLevelList);

            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : {
                'default': obj
              };
            } // vjs 5/6 support


            var registerPlugin = _video2['default'].registerPlugin || _video2['default'].plugin;
            /**
             * Initialization function for the qualityLevels plugin. Sets up the QualityLevelList and
             * event handlers.
             *
             * @param {Player} player Player object.
             * @param {Object} options Plugin options object.
             * @function initPlugin
             */

            var initPlugin = function initPlugin(player, options) {
              var originalPluginFn = player.qualityLevels;
              var qualityLevelList = new _qualityLevelList2['default']();

              var disposeHandler = function disposeHandler() {
                qualityLevelList.dispose();
                player.qualityLevels = originalPluginFn;
                player.off('dispose', disposeHandler);
              };

              player.on('dispose', disposeHandler);

              player.qualityLevels = function () {
                return qualityLevelList;
              };

              player.qualityLevels.VERSION = '2.0.4';
              return qualityLevelList;
            };
            /**
             * A video.js plugin.
             *
             * In the plugin function, the value of `this` is a video.js `Player`
             * instance. You cannot rely on the player being in a "ready" state here,
             * depending on how the plugin is invoked. This may or may not be important
             * to you; if not, remove the wait for "ready"!
             *
             * @param {Object} options Plugin options object
             * @function qualityLevels
             */


            var qualityLevels = function qualityLevels(options) {
              return initPlugin(this, _video2['default'].mergeOptions({}, options));
            }; // Register the plugin with video.js.


            registerPlugin('qualityLevels', qualityLevels); // Include the version number.

            qualityLevels.VERSION = '2.0.4';
            exports['default'] = qualityLevels;
          }).call(this, typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {
          "./quality-level-list.js": 1
        }]
      }, {}, [5])(5);
    });
  });
  unwrapExports(videojsContribQualityLevels);

  var quality = createCommonjsModule(function (module, exports) {
    /* eslint-disable */
    (function (global, factory) {
      factory(videojs);
    })(commonjsGlobal, function (videojs) {

      videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

      function _extends() {
        _extends = Object.assign || function (target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }

          return target;
        };

        return _extends.apply(this, arguments);
      }

      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
      }

      var List =
      /*#__PURE__*/
      function () {
        function List(array, startIndex) {
          this.values = array.slice(0);
          this.index_ = startIndex || 0;
          this.loop_ = true;
        }

        var _proto = List.prototype;

        _proto.index = function index(value) {
          if (typeof value !== 'undefined') {
            this.index_ = Math.max(0, Math.min(value, this.values.length - 1));
          } else {
            return this.index_;
          }
        };

        _proto.loop = function loop(value) {
          if (typeof value !== 'undefined') {
            this.loop_ = !!value;
          } else {
            return this.loop_;
          }
        };

        _proto.calc = function calc(steps) {
          var newIndex = this.index_ + steps;
          var length = this.values.length;
          return this.loop_ ? (length + newIndex) % length : Math.max(0, Math.min(newIndex, length - 1));
        };

        _proto.step = function step(steps) {
          this.index_ = this.calc(steps);
          return this.values[this.index_];
        };

        _proto.current = function current() {
          return this.values[this.index_];
        };

        _proto.next = function next() {
          return this.step(1);
        };

        _proto.prev = function prev() {
          return this.step(-1);
        };

        _proto.ended = function ended() {
          return this.index_ === this.values.length - 1;
        };

        return List;
      }();

      var SettingOptionItem = videojs.getComponent('SettingOptionItem');

      var QualitySettingItem =
      /*#__PURE__*/
      function (_SettingOptionItem) {
        _inheritsLoose(QualitySettingItem, _SettingOptionItem);

        function QualitySettingItem(player, options) {
          var _this;

          _this = _SettingOptionItem.call(this, player, _extends({}, options, {
            name: 'QualitySettingItem',
            label: 'Quality',
            icon: 'vjs-icon-hd',
            entries: player.options_.quality || []
          })) || this;

          _this.addClass('vjs-setting-quality');

          player.on('quality', function (_, qualities) {
            var entries = qualities.map(function (quality, index) {
              quality.value = index;
              return quality;
            });

            _this.setEntries(entries, player.qualities.index());

            _this.show();
          });
          player.on('qualitychange', function (_, _ref) {
            var index = _ref.index;

            _this.select(index);

            _this.update(index);
          });
          return _this;
        }

        var _proto = QualitySettingItem.prototype;

        _proto.onChange = function onChange(_ref2) {
          var value = _ref2.value;
          this.player_.qualities.pick(value);
        };

        return QualitySettingItem;
      }(SettingOptionItem);

      videojs.getComponent('SettingMenuButton').prototype.options_.entries.push('QualitySettingItem');
      videojs.registerComponent('QualitySettingItem', QualitySettingItem);

      var Quality =
      /*#__PURE__*/
      function (_List) {
        _inheritsLoose(Quality, _List);

        function Quality(player, array, defaultQualityLevel) {
          var _this;

          if (defaultQualityLevel === void 0) {
            defaultQualityLevel = 0;
          }

          _this = _List.call(this, array, defaultQualityLevel) || this;
          _this.player_ = player;

          _this.pick(defaultQualityLevel, true);

          return _this;
        }

        var _proto = Quality.prototype;

        _proto.pick = function pick(index, skip) {
          if (typeof index !== 'undefined') {
            this.index(index);
          }

          var player = this.player_;
          var current = this.current();
          var cachedCurrentTime = player.ended() ? 0 : player.currentTime();

          if (!skip && cachedCurrentTime) {
            player.one('loadedmetadata', function () {
              player.one('canplaythrough', function () {
                player.currentTime(cachedCurrentTime);
              });
              player.play();
            });
          }

          player.src(current.sources);
          player.trigger('qualitychange', _extends({}, current, {
            index: this.index()
          }));
        };

        return Quality;
      }(List);

      var setQualities = function setQualities(qualities, defaultQualityLevel) {
        var player = this.player_;
        player.qualities = new Quality(player, qualities, defaultQualityLevel);
        player.trigger('quality', qualities);
      };

      videojs.registerPlugin('setQualities', setQualities);
      videojs.hook('setup', function (vjsPlayer) {
        var qualities = vjsPlayer.options_.qualities;

        if (qualities && qualities.length) {
          var defaultQualityLevel = qualities.findIndex(function (v) {
            return v["default"];
          });
          vjsPlayer.setQualities(qualities, defaultQualityLevel);
        }
      });
    });
  });

  var audioTrack = createCommonjsModule(function (module, exports) {
    /* eslint-disable */
    (function (global, factory) {
      factory(videojs);
    })(commonjsGlobal, function (videojs) {

      videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

      function _extends() {
        _extends = Object.assign || function (target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }

          return target;
        };

        return _extends.apply(this, arguments);
      }

      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
      }

      function _assertThisInitialized(self) {
        if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return self;
      }

      var SettingOptionItem = videojs.getComponent('SettingOptionItem');

      var AudioTrackSettingItem =
      /*#__PURE__*/
      function (_SettingOptionItem) {
        _inheritsLoose(AudioTrackSettingItem, _SettingOptionItem);

        function AudioTrackSettingItem(player, options) {
          var _this;

          _this = _SettingOptionItem.call(this, player, _extends({}, options, {
            name: 'AudioTrackSettingItem',
            label: 'Audio',
            icon: 'vjs-icon-audiotrack'
          })) || this;

          _this.addClass('vjs-setting-audio');

          var timeout;

          var onHlsUsageEvent = function onHlsUsageEvent(evt) {
            if (evt.name === 'hls-audio-change') {
              clearTimeout(timeout);
              timeout = setTimeout(_this.handleAudioChangeEvent.bind(_assertThisInitialized(_this)), 10);
            } else if (evt.name === 'hls-alternate-audio') {
              _this.onAlternateAudio();
            }
          };

          player.ready(function () {
            // show when alternate audio detected
            player.tech_.on('usage', onHlsUsageEvent);
          }); // unbind the callback on player dispose

          player.on('dispose', function () {
            player.tech_.off('usage', onHlsUsageEvent);
          });
          player.on('audiochange', function (_, _ref) {
            var index = _ref.index;

            _this.select(index);

            _this.update(index);
          }); // hide when new source set

          player.on('loadstart', function () {
            _this.hide();
          });
          return _this;
        }

        var _proto = AudioTrackSettingItem.prototype;

        _proto.onChange = function onChange(_ref2) {
          var value = _ref2.value;
          this.player_.audio().pick(value);
        };

        _proto.onAlternateAudio = function onAlternateAudio() {
          var _this2 = this;

          var audioTracks = this.player_.audio().values();
          var audioEntries = audioTracks.map(function (track, index) {
            var id = track.id,
                kind = track.kind,
                label = track.label,
                language = track.language; // label and value are necessary attributes

            return {
              label: _this2.localize(label),
              value: index,
              id: id,
              kind: kind,
              language: language,
              index: index,
              track: track
            };
          });
          this.player_.trigger('before-audio-setup', audioEntries);
          this.setEntries(audioEntries);
          this.show();
          this.player_.trigger('audio', audioEntries);
        };

        _proto.handleAudioChangeEvent = function handleAudioChangeEvent() {
          var _this3 = this;

          var audioTracks = this.player_.audio().values();
          var currentEntry = audioTracks.reduce(function (acc, track, index) {
            if (track.enabled) {
              acc = _this3.entries[index];
            }

            return acc;
          }, {});
          this.player_.trigger('audiochange', currentEntry);
        };

        return AudioTrackSettingItem;
      }(SettingOptionItem);

      videojs.getComponent('SettingMenuButton').prototype.options_.entries.push('AudioTrackSettingItem');
      videojs.registerComponent('AudioTrackSettingItem', AudioTrackSettingItem);

      var audio =
      /*#__PURE__*/
      function (_videojs$getPlugin) {
        _inheritsLoose(audio, _videojs$getPlugin);

        function audio(player, options) {
          var _this;

          if (options === void 0) {
            options = {};
          }

          _this = _videojs$getPlugin.call(this, player, options) || this;
          _this.track = _this.values().find(function (track) {
            return track.enabled;
          }); // I am worried about audio changed by other factor
          // So also listen on `audiochange` and update the value

          player.on('audiochange', function (_, _ref) {
            var index = _ref.index;
            _this.track = _this.values()[index];
          });
          return _this;
        }

        var _proto = audio.prototype;

        _proto.values = function values() {
          var tracks = this.player.audioTracks();
          var result = [];

          for (var i = 0; i < tracks.length; i++) {
            result.push(tracks[i]);
          }

          return result;
        };

        _proto.pick = function pick(index) {
          var values = this.values();
          var newAudio = values[index];

          if (newAudio) {
            this.track.enabled = false;
            this.track = newAudio;
            newAudio.enabled = true;
          }
        };

        return audio;
      }(videojs.getPlugin('plugin'));

      videojs.registerPlugin('audio', audio);
    });
  });

  var qualityHttp = createCommonjsModule(function (module, exports) {
    /* eslint-disable */
    (function (global, factory) {
      factory(videojs);
    })(commonjsGlobal, function (videojs) {

      videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

      function _extends() {
        _extends = Object.assign || function (target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }

          return target;
        };

        return _extends.apply(this, arguments);
      }

      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
      }

      var SettingOptionItem = videojs.getComponent('SettingOptionItem');

      var QualityHlsSettingItem =
      /*#__PURE__*/
      function (_SettingOptionItem) {
        _inheritsLoose(QualityHlsSettingItem, _SettingOptionItem);

        function QualityHlsSettingItem(player, options) {
          var _this;

          _this = _SettingOptionItem.call(this, player, _extends({}, options, {
            name: 'QualityHlsSettingItem',
            label: 'Quality',
            icon: 'vjs-icon-hd'
          })) || this;

          _this.addClass('vjs-setting-quality');

          _this.levels = [];

          _this.handleAllLevelsAdded();

          return _this;
        }

        var _proto = QualityHlsSettingItem.prototype;

        _proto.handleAllLevelsAdded = function handleAllLevelsAdded() {
          var _this2 = this;

          var player = this.player_;

          if (!player.qualityLevels) {
            videojs.log.warn('plugin videojs-contrib-quality-levels do not exsits');
            return false;
          }

          var qualityLevels = player.qualityLevels();
          var levels = [];
          var timeout;
          qualityLevels.on('addqualitylevel', function (_ref) {
            var qualityLevel = _ref.qualityLevel;
            clearTimeout(timeout);
            levels.push(qualityLevel);

            var callback = function callback() {
              _this2.levels = levels.slice(0);
              player.trigger('before-quality-setup', {
                levels: _this2.levels
              });

              _this2.onAllLevelsAdded();

              levels = [];
            };

            timeout = setTimeout(callback, 10);
          });
        };

        _proto.onAllLevelsAdded = function onAllLevelsAdded() {
          var _this3 = this;

          var entries = [].concat(this.levels.map(function (_ref2) {
            var height = _ref2.height;
            return {
              label: _this3.localize(height + "p"),
              value: height,
              "default": false
            };
          }).sort(function (a, b) {
            return b.value - a.value;
          }), [{
            label: 'Auto',
            value: 'auto',
            "default": true
          }]);

          if (this.levels.length > 1) {
            // use auto as default
            this.setEntries(entries, entries.length - 1);
            this.show();
            this.player_.trigger('hls-quality', this.levels);
          } else {
            this.hide();
          }
        };

        _proto.onChange = function onChange(selected) {
          var _this4 = this;

          var value = selected.value;

          _SettingOptionItem.prototype.onChange.call(this, selected);

          this.levels.forEach(function (lv) {
            lv.enabled = lv.height === value || value === 'auto';
          });
          this.player_.trigger('hls-qualitychange', this.entries.reduce(function (acc, entry, index) {
            if (entry.value === value) {
              var level = _this4.levels.find(function (v) {
                return v.height === value;
              }) || {};
              acc = _extends({
                index: index,
                level: level
              }, entry);
            }

            return acc;
          }, {}));
        };

        return QualityHlsSettingItem;
      }(SettingOptionItem);

      videojs.getComponent('SettingMenuButton').prototype.options_.entries.push('QualityHlsSettingItem');
      videojs.registerComponent('QualityHlsSettingItem', QualityHlsSettingItem);
    });
  });

  var Plugin = videojs.getPlugin('plugin'); // Default options for the plugin.

  var defaults = {};
  /**
   * An advanced Video.js plugin. For more information on the API
   *
   * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
   */

  var Flor =
  /*#__PURE__*/
  function (_Plugin) {
    _inheritsLoose(Flor, _Plugin);

    /**
     * Create a Flor plugin instance.
     *
     * @param  {Player} player
     *         A Video.js Player instance.
     *
     * @param  {Object} [options]
     *         An optional options object.
     *
     *         While not a core part of the Video.js plugin architecture, a
     *         second argument of options is a convenient way to accept inputs
     *         from your plugin's caller.
     */
    function Flor(player, options) {
      var _this;

      // the parent class will add player under this.player
      _this = _Plugin.call(this, player) || this;
      _this.options = videojs.mergeOptions(defaults, options);
      player.controlBar.addChild('SettingMenuButton', {}, player.controlBar.children_.length - 2);

      _this.player.ready(function () {
        _this.player.addClass('vjs-flor');
      });

      return _this;
    }

    return Flor;
  }(Plugin); // Define default values for the plugin's `state` object here.


  Flor.defaultState = {}; // Include the version number.

  Flor.VERSION = version; // Register the plugin with video.js.

  videojs.registerPlugin('flor', Flor);

  return Flor;

}));
