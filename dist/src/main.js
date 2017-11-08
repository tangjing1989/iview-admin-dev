'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _iview = require('iview');

var _iview2 = _interopRequireDefault(_iview);

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _router = require('./router');

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _util = require('./libs/util');

var _util2 = _interopRequireDefault(_util);

var _app = require('./app.vue');

var _app2 = _interopRequireDefault(_app);

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

require('iview/dist/styles/iview.css');

var _vueI18n = require('vue-i18n');

var _vueI18n2 = _interopRequireDefault(_vueI18n);

var _locale = require('./locale');

var _locale2 = _interopRequireDefault(_locale);

var _zhCN = require('iview/src/locale/lang/zh-CN');

var _zhCN2 = _interopRequireDefault(_zhCN);

var _enUS = require('iview/src/locale/lang/en-US');

var _enUS2 = _interopRequireDefault(_enUS);

var _zhTW = require('iview/src/locale/lang/zh-TW');

var _zhTW2 = _interopRequireDefault(_zhTW);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);
_vue2.default.use(_vuex2.default);
_vue2.default.use(_vueI18n2.default);
_vue2.default.use(_iview2.default);

var navLang = navigator.language;
var localLang = navLang === 'zh-CN' || navLang === 'en-US' ? navLang : false;
var lang = window.localStorage.lang || localLang || 'zh-CN';

_vue2.default.config.lang = lang;

var locales = _locale2.default;
var mergeZH = (0, _assign2.default)(_zhCN2.default, locales['zh-CN']);
var mergeEN = (0, _assign2.default)(_enUS2.default, locales['en-US']);
var mergeTW = (0, _assign2.default)(_zhTW2.default, locales['zh-TW']);
_vue2.default.locale('zh-CN', mergeZH);
_vue2.default.locale('en-US', mergeEN);
_vue2.default.locale('zh-TW', mergeTW);

var RouterConfig = {
    routes: _router.routers
};

var router = new _vueRouter2.default(RouterConfig);

router.beforeEach(function (to, from, next) {
    _iview2.default.LoadingBar.start();
    _util2.default.title(to.meta.title);
    if (_jsCookie2.default.get('locking') === '1' && to.name !== 'locking') {
        next(false);
        router.replace({
            name: 'locking'
        });
    } else if (_jsCookie2.default.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!_jsCookie2.default.get('user') && to.name !== 'login') {
            next({
                name: 'login'
            });
        } else if (_jsCookie2.default.get('user') && to.name === 'login') {
            _util2.default.title();
            next({
                name: 'home_index'
            });
        } else {
            if (_util2.default.getRouterObjByName([_router.otherRouter].concat((0, _toConsumableArray3.default)(_router.appRouter)), to.name).access !== undefined) {
                if (_util2.default.getRouterObjByName([_router.otherRouter].concat((0, _toConsumableArray3.default)(_router.appRouter)), to.name).access === parseInt(_jsCookie2.default.get('access'))) {
                    _util2.default.toDefaultPage([_router.otherRouter].concat((0, _toConsumableArray3.default)(_router.appRouter)), to.name, router, next);
                } else {
                    router.replace({
                        name: 'error_401'
                    });
                    next();
                }
            } else {
                _util2.default.toDefaultPage([_router.otherRouter].concat((0, _toConsumableArray3.default)(_router.appRouter)), to.name, router, next);
            }
        }
    }
    _iview2.default.LoadingBar.finish();
});

router.afterEach(function () {
    _iview2.default.LoadingBar.finish();
    window.scrollTo(0, 0);
});

var store = new _vuex2.default.Store({
    state: {
        routers: [_router.otherRouter].concat((0, _toConsumableArray3.default)(_router.appRouter)),
        menuList: [],
        tagsList: [].concat((0, _toConsumableArray3.default)(_router.otherRouter.children)),
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        openedSubmenuArr: [],
        menuTheme: '',
        theme: '',
        cachePage: [],
        lang: '',
        isFullScreen: false
    },
    getters: {},
    mutations: {
        setTagsList: function setTagsList(state, list) {
            var _state$tagsList;

            (_state$tagsList = state.tagsList).push.apply(_state$tagsList, (0, _toConsumableArray3.default)(list));
        },
        closePage: function closePage(state, name) {
            state.cachePage.forEach(function (item, index) {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        increateTag: function increateTag(state, tagObj) {
            state.cachePage.push(tagObj.name);
            state.pageOpenedList.push(tagObj);
        },
        initCachepage: function initCachepage(state) {
            if (localStorage.pageOpenedList) {
                state.cachePage = JSON.parse(localStorage.pageOpenedList).map(function (item) {
                    if (item.name !== 'home_index') {
                        return item.name;
                    }
                });
            }
        },
        removeTag: function removeTag(state, name) {
            state.pageOpenedList.map(function (item, index) {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList: function pageOpenedList(state, get) {
            var openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = (0, _stringify2.default)(state.pageOpenedList);
        },
        clearAllTags: function clearAllTags(state) {
            state.pageOpenedList.splice(1);
            router.push({
                name: 'home_index'
            });
            state.cachePage = [];
            localStorage.pageOpenedList = (0, _stringify2.default)(state.pageOpenedList);
        },
        clearOtherTags: function clearOtherTags(state, vm) {
            var currentName = vm.$route.name;
            var currentIndex = 0;
            state.pageOpenedList.forEach(function (item, index) {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            var newCachepage = state.cachePage.filter(function (item) {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = (0, _stringify2.default)(state.pageOpenedList);
        },
        setOpenedList: function setOpenedList(state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [_router.otherRouter.children[0]];
        },
        setCurrentPath: function setCurrentPath(state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName: function setCurrentPageName(state, name) {
            state.currentPageName = name;
        },
        addOpenSubmenu: function addOpenSubmenu(state, name) {
            var hasThisName = false;
            var isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        clearOpenedSubmenu: function clearOpenedSubmenu(state) {
            state.openedSubmenuArr.length = 0;
        },
        changeMenuTheme: function changeMenuTheme(state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme: function changeMainTheme(state, mainTheme) {
            state.theme = mainTheme;
        },
        lock: function lock(state) {
            _jsCookie2.default.set('locking', '1');
        },
        unlock: function unlock(state) {
            _jsCookie2.default.set('locking', '0');
        },
        setMenuList: function setMenuList(state, menulist) {
            state.menuList = menulist;
        },
        updateMenulist: function updateMenulist(state) {
            var accessCode = parseInt(_jsCookie2.default.get('access'));
            var menuList = [];
            _router.appRouter.forEach(function (item, index) {
                if (item.access !== undefined) {
                    if (_util2.default.showThisRoute(item.access, accessCode)) {
                        if (item.children.length === 1) {
                            menuList.push(item);
                        } else {
                            var len = menuList.push(item);
                            var childrenArr = [];
                            childrenArr = item.children.filter(function (child) {
                                if (child.access !== undefined) {
                                    if (child.access === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            menuList[len - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        var _len = menuList.push(item);
                        var _childrenArr = [];
                        _childrenArr = item.children.filter(function (child) {
                            if (child.access !== undefined) {
                                if (_util2.default.showThisRoute(child.access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        var handledItem = JSON.parse((0, _stringify2.default)(menuList[_len - 1]));
                        handledItem.children = _childrenArr;
                        menuList.splice(_len - 1, 1, handledItem);
                    }
                }
            });
            state.menuList = menuList;
        },
        setAvator: function setAvator(state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang: function switchLang(state, lang) {
            state.lang = lang;
            _vue2.default.config.lang = lang;
        },
        handleFullScreen: function handleFullScreen(state) {
            var main = document.getElementById('main');
            if (state.isFullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
            }
        },
        changeFullScreenState: function changeFullScreenState(state) {
            state.isFullScreen = !state.isFullScreen;
        }
    },
    actions: {}
});

new _vue2.default({
    el: '#app',
    router: router,
    store: store,
    render: function render(h) {
        return h(_app2.default);
    },
    data: {
        currentPageName: ''
    },
    mounted: function mounted() {
        var _this = this;

        this.currentPageName = this.$route.name;
        this.$store.commit('initCachepage');

        this.$store.commit('updateMenulist');

        document.addEventListener('fullscreenchange', function () {
            _this.$store.commit('changeFullScreenState');
        });
        document.addEventListener('mozfullscreenchange', function () {
            _this.$store.commit('changeFullScreenState');
        });
        document.addEventListener('webkitfullscreenchange', function () {
            _this.$store.commit('changeFullScreenState');
        });
        document.addEventListener('msfullscreenchange', function () {
            _this.$store.commit('changeFullScreenState');
        });
    },
    created: function created() {
        var tagsList = [];
        _router.appRouter.map(function (item) {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push.apply(tagsList, (0, _toConsumableArray3.default)(item.children));
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
//# sourceMappingURL=main.js.map