(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRegister (path, loader) {
		DYNAMIC_REQUIRE_LOADERS[path] = loader;
	}

	const DYNAMIC_REQUIRE_LOADERS = Object.create(null);
	const DYNAMIC_REQUIRE_CACHE = Object.create(null);
	const DEFAULT_PARENT_MODULE = {
		id: '<' + 'rollup>', exports: {}, parent: undefined, filename: null, loaded: false, children: [], paths: []
	};
	const CHECKED_EXTENSIONS = ['', '.js', '.json'];

	function normalize (path) {
		path = path.replace(/\\/g, '/');
		const parts = path.split('/');
		const slashed = parts[0] === '';
		for (let i = 1; i < parts.length; i++) {
			if (parts[i] === '.' || parts[i] === '') {
				parts.splice(i--, 1);
			}
		}
		for (let i = 1; i < parts.length; i++) {
			if (parts[i] !== '..') continue;
			if (i > 0 && parts[i - 1] !== '..' && parts[i - 1] !== '.') {
				parts.splice(--i, 2);
				i--;
			}
		}
		path = parts.join('/');
		if (slashed && path[0] !== '/')
		  path = '/' + path;
		else if (path.length === 0)
		  path = '.';
		return path;
	}

	function join () {
		if (arguments.length === 0)
		  return '.';
		let joined;
		for (let i = 0; i < arguments.length; ++i) {
		  let arg = arguments[i];
		  if (arg.length > 0) {
			if (joined === undefined)
			  joined = arg;
			else
			  joined += '/' + arg;
		  }
		}
		if (joined === undefined)
		  return '.';

		return joined;
	}

	function isPossibleNodeModulesPath (modulePath) {
		let c0 = modulePath[0];
		if (c0 === '/' || c0 === '\\') return false;
		let c1 = modulePath[1], c2 = modulePath[2];
		if ((c0 === '.' && (!c1 || c1 === '/' || c1 === '\\')) ||
			(c0 === '.' && c1 === '.' && (!c2 || c2 === '/' || c2 === '\\'))) return false;
		if (c1 === ':' && (c2 === '/' || c2 === '\\'))
			return false;
		return true;
	}

	function dirname (path) {
	  if (path.length === 0)
	    return '.';

	  let i = path.length - 1;
	  while (i > 0) {
	    const c = path.charCodeAt(i);
	    if ((c === 47 || c === 92) && i !== path.length - 1)
	      break;
	    i--;
	  }

	  if (i > 0)
	    return path.substr(0, i);

	  if (path.chartCodeAt(0) === 47 || path.chartCodeAt(0) === 92)
	    return path.charAt(0);

	  return '.';
	}

	function commonjsResolveImpl (path, originalModuleDir, testCache) {
		const shouldTryNodeModules = isPossibleNodeModulesPath(path);
		path = normalize(path);
		let relPath;
		if (path[0] === '/') {
			originalModuleDir = '/';
		}
		while (true) {
			if (!shouldTryNodeModules) {
				relPath = originalModuleDir ? normalize(originalModuleDir + '/' + path) : path;
			} else if (originalModuleDir) {
				relPath = normalize(originalModuleDir + '/node_modules/' + path);
			} else {
				relPath = normalize(join('node_modules', path));
			}

			if (relPath.endsWith('/..')) {
				break; // Travelled too far up, avoid infinite loop
			}

			for (let extensionIndex = 0; extensionIndex < CHECKED_EXTENSIONS.length; extensionIndex++) {
				const resolvedPath = relPath + CHECKED_EXTENSIONS[extensionIndex];
				if (DYNAMIC_REQUIRE_CACHE[resolvedPath]) {
					return resolvedPath;
				}			if (DYNAMIC_REQUIRE_LOADERS[resolvedPath]) {
					return resolvedPath;
				}		}
			if (!shouldTryNodeModules) break;
			const nextDir = normalize(originalModuleDir + '/..');
			if (nextDir === originalModuleDir) break;
			originalModuleDir = nextDir;
		}
		return null;
	}

	function commonjsResolve (path, originalModuleDir) {
		const resolvedPath = commonjsResolveImpl(path, originalModuleDir);
		if (resolvedPath !== null) {
			return resolvedPath;
		}
		return require.resolve(path);
	}

	function commonjsRequire (path, originalModuleDir) {
		const resolvedPath = commonjsResolveImpl(path, originalModuleDir);
		if (resolvedPath !== null) {
	    let cachedModule = DYNAMIC_REQUIRE_CACHE[resolvedPath];
	    if (cachedModule) return cachedModule.exports;
	    const loader = DYNAMIC_REQUIRE_LOADERS[resolvedPath];
	    if (loader) {
	      DYNAMIC_REQUIRE_CACHE[resolvedPath] = cachedModule = {
	        id: resolvedPath,
	        filename: resolvedPath,
	        path: dirname(resolvedPath),
	        exports: {},
	        parent: DEFAULT_PARENT_MODULE,
	        loaded: false,
	        children: [],
	        paths: [],
	        require: function (path, base) {
	          return commonjsRequire(path, (base === undefined || base === null) ? cachedModule.path : base);
	        }
	      };
	      try {
	        loader.call(commonjsGlobal, cachedModule, cachedModule.exports);
	      } catch (error) {
	        delete DYNAMIC_REQUIRE_CACHE[resolvedPath];
	        throw error;
	      }
	      cachedModule.loaded = true;
	      return cachedModule.exports;
	    }	}
		return require(path);
	}

	commonjsRequire.cache = DYNAMIC_REQUIRE_CACHE;
	commonjsRequire.resolve = commonjsResolve;

	commonjsRegister("/$$rollup_base$$/src/_11ty/filters/cleanCardContent.js", function (module, exports) {
	  /**
	 * Clean template content
	 *
	 * @param {String} text
	 */

	module.exports = function (text) {
	  var content = new String(text);

	  // remove all html elements and new lines
	  var html = /(&lt;.*?&gt;)|(<.*?>)/gi;
	  var result = unescape(content.replace(html, ''));

	  const unicode = /[\u0000-\u001F\u007F-\u009F]/g;
	  const punctuation = /[#$%()*+/\\<=>@[\]^_`{|}~¶]/g;
	  const lineBreaks = /[\r\n]+/gm;
	  const extraSpaces = /\s+/g;

	  return result
	    .replace(unicode, '')
	    .replace(punctuation, '')
	    .replace(lineBreaks, ' ')
	    .replace(extraSpaces, ' ');
	};

	});

	var site = {
	  title: 'Ceph',
	  url: 'https://ceph.io',
	  defaultLocale: 'en'
	};

	commonjsRegister("/$$rollup_base$$/src/_11ty/filters/formatDate.js", function (module, exports) {
	  const site$1 = site;
	const { defaultLocale } = site$1;

	module.exports = (date, locale = defaultLocale) => {
	  return new Intl.DateTimeFormat(locale, {
	    year: 'numeric',
	    month: 'short',
	    day: 'numeric',
	    // Dates should be converted to UTC to avoid off-by-one issues
	    // See docs: https://www.11ty.dev/docs/dates/#dates-off-by-one-day
	    timeZone: 'UTC',
	  }).format(new Date(date));
	};

	});

	commonjsRegister("/$$rollup_base$$/src/_11ty/filters/getSingleDigitFromDate.js", function (module, exports) {
	  /**
	 * "Random" but consistent single-digit numbers from a date
	 * https://stackoverflow.com/a/49892742/7000394
	 *
	 * @param {string} date
	 *
	 */

	const site$1 = site;
	const { defaultLocale } = site$1;

	module.exports = (date = '', locale = defaultLocale) => {
	  const newDate = new Intl.DateTimeFormat(locale, {
	    year: 'numeric',
	    month: 'numeric',
	    day: 'numeric',
	  }).format(new Date(date));

	  const dateAsNumber = Number(newDate.replace(/\//g, ''));
	  return dateAsNumber % 9 || 9;
	};

	});

	commonjsRegister("/$$rollup_base$$/src/_11ty/filters/truncate.js", function (module, exports) {
	  /**
	 * Truncates text to a specific length and appends ...
	 *
	 * @param {string} text
	 * @param {number} length
	 * @param {string} append
	 *
	 */

	module.exports = (text = '', length = 100, append = '…') => {
	  /* Return unchanged if not long enough */
	  if (text.length <= length) return text;

	  /* Otherwise truncate and lop off trailing orphan */
	  const truncatedText = text.substr(0, length);
	  const cleanText = truncatedText.substring(0, truncatedText.lastIndexOf(' '));

	  /* Tidy and append chars */
	  return cleanText.trim() + append;
	};

	});

	commonjsRegister("/$$rollup_base$$/src/_11ty/shortcodes/ArticleCard.js", function (module, exports) {
	  const filtersDir = `../filters`;
	const formatDate = commonjsRequire(`${filtersDir}/formatDate.js`,"/$$rollup_base$$/src/_11ty/shortcodes");
	const getSingleDigitFromDate = commonjsRequire(`${filtersDir}/getSingleDigitFromDate.js`,"/$$rollup_base$$/src/_11ty/shortcodes");
	const cleanCardContent = commonjsRequire(`${filtersDir}/cleanCardContent.js`,"/$$rollup_base$$/src/_11ty/shortcodes");
	const truncate = commonjsRequire(`${filtersDir}/truncate.js`,"/$$rollup_base$$/src/_11ty/shortcodes");

	module.exports = ({ data = {}, templateContent, url } = {}, { label } = {}) => {
	  const { author = '', date, image, title = '', locale = '' } = data;
	  const imageSrc = image
	    ? `${url}${image}`
	    : `/assets/bitmaps/photo-texture-0${getSingleDigitFromDate(date)}.jpg`;
	  const captionStrip = cleanCardContent(templateContent);
	  const caption = truncate(captionStrip);

	  return `
    <div class="relative">
      <div class="aspect-ratio aspect-ratio--16x9 aspect-ratio--cover mb-4 rounded-2">
        <img
          alt="" 
          class="absolute h-full left-0 rounded-2 top-0 w-full"
          loading="lazy"
          src="${imageSrc}" 
        />
        ${
          label
            ? `
          <span class="absolute bg-red-500 block color-white m-4 p px-3 py-2 right-0 rounded-2 text-semibold text-upper top-0">
            ${label}
          </span>
        `
            : ''
        }
      </div>
      ${
        title &&
        `
        <a class="block color-navy link-cover h4 mb-2" href="${url}">
          ${title}
        </a>
        `
      }
      <p class="p-sm">
        <time datetime="${date}">
          ${formatDate(date, locale)}
        </time> ${author && `by ${author}`}
      </p>
      ${
        caption &&
        `
        <p class="p">
          ${caption}
        </p>
      `
      }
    </div>
  `;
	};

	});

	createCommonjsModule(function (module, exports) {
	void (function (root, factory) {
	  module.exports = factory();
	}(commonjsGlobal, function () {
	  var DETAILS = 'details';
	  var SUMMARY = 'summary';

	  var supported = checkSupport();
	  if (supported) return

	  // Add a classname
	  document.documentElement.className += ' no-details';

	  window.addEventListener('click', clickHandler);

	  injectStyle('details-polyfill-style',
	    'html.no-details ' + DETAILS + ':not([open]) > :not(' + SUMMARY + ') { display: none; }\n' +
	    'html.no-details ' + DETAILS + ' > ' + SUMMARY + ':before { content: "\u25b6"; display: inline-block; font-size: .8em; width: 1.5em; }\n' +
	    'html.no-details ' + DETAILS + '[open] > ' + SUMMARY + ':before { content: "\u25bc"; }');

	  /*
	   * Click handler for `<summary>` tags
	   */

	  function clickHandler (e) {
	    if (e.target.nodeName.toLowerCase() === 'summary') {
	      var details = e.target.parentNode;
	      if (!details) return

	      if (details.getAttribute('open')) {
	        details.open = false;
	        details.removeAttribute('open');
	      } else {
	        details.open = true;
	        details.setAttribute('open', 'open');
	      }
	    }
	  }

	  /*
	   * Checks for support for `<details>`
	   */

	  function checkSupport () {
	    var el = document.createElement(DETAILS);
	    if (!('open' in el)) return false

	    el.innerHTML = '<' + SUMMARY + '>a</' + SUMMARY + '>b';
	    document.body.appendChild(el);

	    var diff = el.offsetHeight;
	    el.open = true;
	    var result = (diff != el.offsetHeight);

	    document.body.removeChild(el);
	    return result
	  }

	  /*
	   * Injects styles (idempotent)
	   */

	  function injectStyle (id, style) {
	    if (document.getElementById(id)) return

	    var el = document.createElement('style');
	    el.id = id;
	    el.innerHTML = style;

	    document.getElementsByTagName('head')[0].appendChild(el);
	  }
	})); // eslint-disable-line semi
	}, "/$$rollup_base$$/node_modules/details-polyfill");

	createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  factory() ;
	}(commonjsGlobal, (function () {
	  /**
	   * Applies the :focus-visible polyfill at the given scope.
	   * A scope in this case is either the top-level Document or a Shadow Root.
	   *
	   * @param {(Document|ShadowRoot)} scope
	   * @see https://github.com/WICG/focus-visible
	   */
	  function applyFocusVisiblePolyfill(scope) {
	    var hadKeyboardEvent = true;
	    var hadFocusVisibleRecently = false;
	    var hadFocusVisibleRecentlyTimeout = null;

	    var inputTypesAllowlist = {
	      text: true,
	      search: true,
	      url: true,
	      tel: true,
	      email: true,
	      password: true,
	      number: true,
	      date: true,
	      month: true,
	      week: true,
	      time: true,
	      datetime: true,
	      'datetime-local': true
	    };

	    /**
	     * Helper function for legacy browsers and iframes which sometimes focus
	     * elements like document, body, and non-interactive SVG.
	     * @param {Element} el
	     */
	    function isValidFocusTarget(el) {
	      if (
	        el &&
	        el !== document &&
	        el.nodeName !== 'HTML' &&
	        el.nodeName !== 'BODY' &&
	        'classList' in el &&
	        'contains' in el.classList
	      ) {
	        return true;
	      }
	      return false;
	    }

	    /**
	     * Computes whether the given element should automatically trigger the
	     * `focus-visible` class being added, i.e. whether it should always match
	     * `:focus-visible` when focused.
	     * @param {Element} el
	     * @return {boolean}
	     */
	    function focusTriggersKeyboardModality(el) {
	      var type = el.type;
	      var tagName = el.tagName;

	      if (tagName === 'INPUT' && inputTypesAllowlist[type] && !el.readOnly) {
	        return true;
	      }

	      if (tagName === 'TEXTAREA' && !el.readOnly) {
	        return true;
	      }

	      if (el.isContentEditable) {
	        return true;
	      }

	      return false;
	    }

	    /**
	     * Add the `focus-visible` class to the given element if it was not added by
	     * the author.
	     * @param {Element} el
	     */
	    function addFocusVisibleClass(el) {
	      if (el.classList.contains('focus-visible')) {
	        return;
	      }
	      el.classList.add('focus-visible');
	      el.setAttribute('data-focus-visible-added', '');
	    }

	    /**
	     * Remove the `focus-visible` class from the given element if it was not
	     * originally added by the author.
	     * @param {Element} el
	     */
	    function removeFocusVisibleClass(el) {
	      if (!el.hasAttribute('data-focus-visible-added')) {
	        return;
	      }
	      el.classList.remove('focus-visible');
	      el.removeAttribute('data-focus-visible-added');
	    }

	    /**
	     * If the most recent user interaction was via the keyboard;
	     * and the key press did not include a meta, alt/option, or control key;
	     * then the modality is keyboard. Otherwise, the modality is not keyboard.
	     * Apply `focus-visible` to any current active element and keep track
	     * of our keyboard modality state with `hadKeyboardEvent`.
	     * @param {KeyboardEvent} e
	     */
	    function onKeyDown(e) {
	      if (e.metaKey || e.altKey || e.ctrlKey) {
	        return;
	      }

	      if (isValidFocusTarget(scope.activeElement)) {
	        addFocusVisibleClass(scope.activeElement);
	      }

	      hadKeyboardEvent = true;
	    }

	    /**
	     * If at any point a user clicks with a pointing device, ensure that we change
	     * the modality away from keyboard.
	     * This avoids the situation where a user presses a key on an already focused
	     * element, and then clicks on a different element, focusing it with a
	     * pointing device, while we still think we're in keyboard modality.
	     * @param {Event} e
	     */
	    function onPointerDown(e) {
	      hadKeyboardEvent = false;
	    }

	    /**
	     * On `focus`, add the `focus-visible` class to the target if:
	     * - the target received focus as a result of keyboard navigation, or
	     * - the event target is an element that will likely require interaction
	     *   via the keyboard (e.g. a text box)
	     * @param {Event} e
	     */
	    function onFocus(e) {
	      // Prevent IE from focusing the document or HTML element.
	      if (!isValidFocusTarget(e.target)) {
	        return;
	      }

	      if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
	        addFocusVisibleClass(e.target);
	      }
	    }

	    /**
	     * On `blur`, remove the `focus-visible` class from the target.
	     * @param {Event} e
	     */
	    function onBlur(e) {
	      if (!isValidFocusTarget(e.target)) {
	        return;
	      }

	      if (
	        e.target.classList.contains('focus-visible') ||
	        e.target.hasAttribute('data-focus-visible-added')
	      ) {
	        // To detect a tab/window switch, we look for a blur event followed
	        // rapidly by a visibility change.
	        // If we don't see a visibility change within 100ms, it's probably a
	        // regular focus change.
	        hadFocusVisibleRecently = true;
	        window.clearTimeout(hadFocusVisibleRecentlyTimeout);
	        hadFocusVisibleRecentlyTimeout = window.setTimeout(function() {
	          hadFocusVisibleRecently = false;
	        }, 100);
	        removeFocusVisibleClass(e.target);
	      }
	    }

	    /**
	     * If the user changes tabs, keep track of whether or not the previously
	     * focused element had .focus-visible.
	     * @param {Event} e
	     */
	    function onVisibilityChange(e) {
	      if (document.visibilityState === 'hidden') {
	        // If the tab becomes active again, the browser will handle calling focus
	        // on the element (Safari actually calls it twice).
	        // If this tab change caused a blur on an element with focus-visible,
	        // re-apply the class when the user switches back to the tab.
	        if (hadFocusVisibleRecently) {
	          hadKeyboardEvent = true;
	        }
	        addInitialPointerMoveListeners();
	      }
	    }

	    /**
	     * Add a group of listeners to detect usage of any pointing devices.
	     * These listeners will be added when the polyfill first loads, and anytime
	     * the window is blurred, so that they are active when the window regains
	     * focus.
	     */
	    function addInitialPointerMoveListeners() {
	      document.addEventListener('mousemove', onInitialPointerMove);
	      document.addEventListener('mousedown', onInitialPointerMove);
	      document.addEventListener('mouseup', onInitialPointerMove);
	      document.addEventListener('pointermove', onInitialPointerMove);
	      document.addEventListener('pointerdown', onInitialPointerMove);
	      document.addEventListener('pointerup', onInitialPointerMove);
	      document.addEventListener('touchmove', onInitialPointerMove);
	      document.addEventListener('touchstart', onInitialPointerMove);
	      document.addEventListener('touchend', onInitialPointerMove);
	    }

	    function removeInitialPointerMoveListeners() {
	      document.removeEventListener('mousemove', onInitialPointerMove);
	      document.removeEventListener('mousedown', onInitialPointerMove);
	      document.removeEventListener('mouseup', onInitialPointerMove);
	      document.removeEventListener('pointermove', onInitialPointerMove);
	      document.removeEventListener('pointerdown', onInitialPointerMove);
	      document.removeEventListener('pointerup', onInitialPointerMove);
	      document.removeEventListener('touchmove', onInitialPointerMove);
	      document.removeEventListener('touchstart', onInitialPointerMove);
	      document.removeEventListener('touchend', onInitialPointerMove);
	    }

	    /**
	     * When the polfyill first loads, assume the user is in keyboard modality.
	     * If any event is received from a pointing device (e.g. mouse, pointer,
	     * touch), turn off keyboard modality.
	     * This accounts for situations where focus enters the page from the URL bar.
	     * @param {Event} e
	     */
	    function onInitialPointerMove(e) {
	      // Work around a Safari quirk that fires a mousemove on <html> whenever the
	      // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
	      if (e.target.nodeName && e.target.nodeName.toLowerCase() === 'html') {
	        return;
	      }

	      hadKeyboardEvent = false;
	      removeInitialPointerMoveListeners();
	    }

	    // For some kinds of state, we are interested in changes at the global scope
	    // only. For example, global pointer input, global key presses and global
	    // visibility change should affect the state at every scope:
	    document.addEventListener('keydown', onKeyDown, true);
	    document.addEventListener('mousedown', onPointerDown, true);
	    document.addEventListener('pointerdown', onPointerDown, true);
	    document.addEventListener('touchstart', onPointerDown, true);
	    document.addEventListener('visibilitychange', onVisibilityChange, true);

	    addInitialPointerMoveListeners();

	    // For focus and blur, we specifically care about state changes in the local
	    // scope. This is because focus / blur events that originate from within a
	    // shadow root are not re-dispatched from the host element if it was already
	    // the active element in its own scope:
	    scope.addEventListener('focus', onFocus, true);
	    scope.addEventListener('blur', onBlur, true);

	    // We detect that a node is a ShadowRoot by ensuring that it is a
	    // DocumentFragment and also has a host property. This check covers native
	    // implementation and polyfill implementation transparently. If we only cared
	    // about the native implementation, we could just check if the scope was
	    // an instance of a ShadowRoot.
	    if (scope.nodeType === Node.DOCUMENT_FRAGMENT_NODE && scope.host) {
	      // Since a ShadowRoot is a special kind of DocumentFragment, it does not
	      // have a root element to add a class to. So, we add this attribute to the
	      // host element instead:
	      scope.host.setAttribute('data-js-focus-visible', '');
	    } else if (scope.nodeType === Node.DOCUMENT_NODE) {
	      document.documentElement.classList.add('js-focus-visible');
	      document.documentElement.setAttribute('data-js-focus-visible', '');
	    }
	  }

	  // It is important to wrap all references to global window and document in
	  // these checks to support server-side rendering use cases
	  // @see https://github.com/WICG/focus-visible/issues/199
	  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	    // Make the polyfill helper globally available. This can be used as a signal
	    // to interested libraries that wish to coordinate with the polyfill for e.g.,
	    // applying the polyfill to a shadow root:
	    window.applyFocusVisiblePolyfill = applyFocusVisiblePolyfill;

	    // Notify interested libraries of the polyfill's presence, in case the
	    // polyfill was loaded lazily:
	    var event;

	    try {
	      event = new CustomEvent('focus-visible-polyfill-ready');
	    } catch (error) {
	      // IE11 does not support using CustomEvent as a constructor directly:
	      event = document.createEvent('CustomEvent');
	      event.initCustomEvent('focus-visible-polyfill-ready', false, false, {});
	    }

	    window.dispatchEvent(event);
	  }

	  if (typeof document !== 'undefined') {
	    // Apply the polyfill to the global document, so that no JavaScript
	    // coordination is required to use the polyfill in the top-level document:
	    applyFocusVisiblePolyfill(document);
	  }

	})));
	}, "/$$rollup_base$$/node_modules/focus-visible/dist");

	var NavSecondary = {
	  init: function init() {
	    var navigation = document.querySelector('[data-nav-secondary]');

	    if (navigation) {
	      var toggle = navigation.querySelector('[data-nav-secondary-toggle]');
	      var navigation_sub = navigation.querySelector('[data-nav-secondary-sub]');
	      var mediaQueryList = window.matchMedia('(max-width: 63.9375em)');

	      function toggle_nav(e) {
	        if (toggle.getAttribute('aria-expanded') === 'true') {
	          toggle.setAttribute('aria-expanded', 'false');
	          toggle.setAttribute('aria-pressed', 'false');
	          navigation_sub.setAttribute('aria-hidden', 'true');
	        } else {
	          toggle.setAttribute('aria-expanded', 'true');
	          toggle.setAttribute('aria-pressed', 'true');
	          navigation_sub.setAttribute('aria-hidden', 'false');
	        }

	        e.preventDefault();
	      }

	      function handle_size_change(e) {
	        if (e.matches) {
	          toggle.addEventListener('click', toggle_nav);
	          toggle.setAttribute('aria-expanded', 'false');
	          toggle.setAttribute('aria-pressed', 'false');
	          toggle.setAttribute('role', 'button');
	          navigation_sub.setAttribute('aria-hidden', 'true');
	        } else {
	          toggle.removeEventListener('click', toggle_nav);
	          toggle.removeAttribute('aria-expanded');
	          toggle.removeAttribute('aria-pressed');
	          toggle.removeAttribute('role');
	          navigation_sub.setAttribute('aria-hidden', 'false');
	        }
	      } // Register event listener
	      // Includes fallback for Safari <14


	      if (mediaQueryList.addEventListener) {
	        mediaQueryList.addEventListener('change', handle_size_change);
	      } else {
	        mediaQueryList.addListener(handle_size_change);
	      } // Initial check


	      handle_size_change(mediaQueryList);
	    }
	  }
	};

	var OffCanvas = {
	  init: function init() {
	    var html = document.querySelector('html');
	    var header = document.querySelector('[data-site-header]');
	    var menu = header.querySelector('[data-menu]');
	    var menu_open = header.querySelector('[data-menu-open]');
	    var menu_close = header.querySelector('[data-menu-close]');
	    var mediaQueryList = window.matchMedia('(max-width: 63.9375em)');

	    function toggleMenu() {
	      menu_open.addEventListener('click', function (e) {
	        header.classList.add('site-header--opened');
	        menu.setAttribute('aria-hidden', 'false');
	        html.classList.add('no-scroll');
	        e.preventDefault();
	      });
	      menu_close.addEventListener('click', function (e) {
	        header.classList.remove('site-header--opened');
	        menu.setAttribute('aria-hidden', 'true');
	        html.classList.remove('no-scroll');
	        e.preventDefault();
	      });
	    }

	    function handle_size_change(e) {
	      if (e.matches) {
	        menu.setAttribute('aria-hidden', 'true');
	        toggleMenu();
	      } else {
	        menu.setAttribute('aria-hidden', 'false');
	        header.classList.remove('site-header--opened');
	        html.classList.remove('no-scroll');
	      }
	    } // Register event listener
	    // Includes fallback for Safari <14


	    if (mediaQueryList.addEventListener) {
	      mediaQueryList.addEventListener('change', handle_size_change);
	    } else {
	      mediaQueryList.addListener(handle_size_change);
	    } // Initial check


	    handle_size_change(mediaQueryList);
	  }
	};

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	var StickyScroll = {
	  init: function init() {
	    var body = document.querySelector('body');
	    var scroll_offset = document.querySelector('[data-scroll-offset]');
	    var site_header = document.querySelector('[data-site-header]');
	    var observer = new IntersectionObserver(function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          e = _ref2[0];

	      return site_header.classList.toggle('site-header--stuck', e.intersectionRatio < 1);
	    }, {
	      threshold: [1]
	    });
	    if (!body.classList.contains('home')) return;
	    observer.observe(scroll_offset);
	  }
	};

	NavSecondary.init();
	OffCanvas.init();
	StickyScroll.init();

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLW1haW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fZGF0YS9zaXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2RldGFpbHMtcG9seWZpbGwvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZm9jdXMtdmlzaWJsZS9kaXN0L2ZvY3VzLXZpc2libGUuanMiLCIuLi8uLi9zcmMvanMvbmF2LXNlY29uZGFyeS5qcyIsIi4uLy4uL3NyYy9qcy9vZmYtY2FudmFzLmpzIiwiLi4vLi4vc3JjL2pzL3N0aWNreS1zY3JvbGwuanMiLCIuLi8uLi9zcmMvanMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdGl0bGU6ICdDZXBoJyxcbiAgdXJsOiAnaHR0cHM6Ly9jZXBoLmlvJyxcbiAgZGVmYXVsdExvY2FsZTogJ2VuJyxcbn07XG4iLCJ2b2lkIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZmFjdG9yeSlcbiAgZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxuICBlbHNlIGZhY3RvcnkoKVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBERVRBSUxTID0gJ2RldGFpbHMnXG4gIHZhciBTVU1NQVJZID0gJ3N1bW1hcnknXG5cbiAgdmFyIHN1cHBvcnRlZCA9IGNoZWNrU3VwcG9ydCgpXG4gIGlmIChzdXBwb3J0ZWQpIHJldHVyblxuXG4gIC8vIEFkZCBhIGNsYXNzbmFtZVxuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgbm8tZGV0YWlscydcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXG5cbiAgaW5qZWN0U3R5bGUoJ2RldGFpbHMtcG9seWZpbGwtc3R5bGUnLFxuICAgICdodG1sLm5vLWRldGFpbHMgJyArIERFVEFJTFMgKyAnOm5vdChbb3Blbl0pID4gOm5vdCgnICsgU1VNTUFSWSArICcpIHsgZGlzcGxheTogbm9uZTsgfVxcbicgK1xuICAgICdodG1sLm5vLWRldGFpbHMgJyArIERFVEFJTFMgKyAnID4gJyArIFNVTU1BUlkgKyAnOmJlZm9yZSB7IGNvbnRlbnQ6IFwiXFx1MjViNlwiOyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogLjhlbTsgd2lkdGg6IDEuNWVtOyB9XFxuJyArXG4gICAgJ2h0bWwubm8tZGV0YWlscyAnICsgREVUQUlMUyArICdbb3Blbl0gPiAnICsgU1VNTUFSWSArICc6YmVmb3JlIHsgY29udGVudDogXCJcXHUyNWJjXCI7IH0nKVxuXG4gIC8qXG4gICAqIENsaWNrIGhhbmRsZXIgZm9yIGA8c3VtbWFyeT5gIHRhZ3NcbiAgICovXG5cbiAgZnVuY3Rpb24gY2xpY2tIYW5kbGVyIChlKSB7XG4gICAgaWYgKGUudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdW1tYXJ5Jykge1xuICAgICAgdmFyIGRldGFpbHMgPSBlLnRhcmdldC5wYXJlbnROb2RlXG4gICAgICBpZiAoIWRldGFpbHMpIHJldHVyblxuXG4gICAgICBpZiAoZGV0YWlscy5nZXRBdHRyaWJ1dGUoJ29wZW4nKSkge1xuICAgICAgICBkZXRhaWxzLm9wZW4gPSBmYWxzZVxuICAgICAgICBkZXRhaWxzLnJlbW92ZUF0dHJpYnV0ZSgnb3BlbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXRhaWxzLm9wZW4gPSB0cnVlXG4gICAgICAgIGRldGFpbHMuc2V0QXR0cmlidXRlKCdvcGVuJywgJ29wZW4nKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIENoZWNrcyBmb3Igc3VwcG9ydCBmb3IgYDxkZXRhaWxzPmBcbiAgICovXG5cbiAgZnVuY3Rpb24gY2hlY2tTdXBwb3J0ICgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KERFVEFJTFMpXG4gICAgaWYgKCEoJ29wZW4nIGluIGVsKSkgcmV0dXJuIGZhbHNlXG5cbiAgICBlbC5pbm5lckhUTUwgPSAnPCcgKyBTVU1NQVJZICsgJz5hPC8nICsgU1VNTUFSWSArICc+YidcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKVxuXG4gICAgdmFyIGRpZmYgPSBlbC5vZmZzZXRIZWlnaHRcbiAgICBlbC5vcGVuID0gdHJ1ZVxuICAgIHZhciByZXN1bHQgPSAoZGlmZiAhPSBlbC5vZmZzZXRIZWlnaHQpXG5cbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qXG4gICAqIEluamVjdHMgc3R5bGVzIChpZGVtcG90ZW50KVxuICAgKi9cblxuICBmdW5jdGlvbiBpbmplY3RTdHlsZSAoaWQsIHN0eWxlKSB7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuXG5cbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgZWwuaWQgPSBpZFxuICAgIGVsLmlubmVySFRNTCA9IHN0eWxlXG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKGVsKVxuICB9XG59KSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgc2VtaVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgOmZvY3VzLXZpc2libGUgcG9seWZpbGwgYXQgdGhlIGdpdmVuIHNjb3BlLlxuICAgKiBBIHNjb3BlIGluIHRoaXMgY2FzZSBpcyBlaXRoZXIgdGhlIHRvcC1sZXZlbCBEb2N1bWVudCBvciBhIFNoYWRvdyBSb290LlxuICAgKlxuICAgKiBAcGFyYW0geyhEb2N1bWVudHxTaGFkb3dSb290KX0gc2NvcGVcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9mb2N1cy12aXNpYmxlXG4gICAqL1xuICBmdW5jdGlvbiBhcHBseUZvY3VzVmlzaWJsZVBvbHlmaWxsKHNjb3BlKSB7XG4gICAgdmFyIGhhZEtleWJvYXJkRXZlbnQgPSB0cnVlO1xuICAgIHZhciBoYWRGb2N1c1Zpc2libGVSZWNlbnRseSA9IGZhbHNlO1xuICAgIHZhciBoYWRGb2N1c1Zpc2libGVSZWNlbnRseVRpbWVvdXQgPSBudWxsO1xuXG4gICAgdmFyIGlucHV0VHlwZXNBbGxvd2xpc3QgPSB7XG4gICAgICB0ZXh0OiB0cnVlLFxuICAgICAgc2VhcmNoOiB0cnVlLFxuICAgICAgdXJsOiB0cnVlLFxuICAgICAgdGVsOiB0cnVlLFxuICAgICAgZW1haWw6IHRydWUsXG4gICAgICBwYXNzd29yZDogdHJ1ZSxcbiAgICAgIG51bWJlcjogdHJ1ZSxcbiAgICAgIGRhdGU6IHRydWUsXG4gICAgICBtb250aDogdHJ1ZSxcbiAgICAgIHdlZWs6IHRydWUsXG4gICAgICB0aW1lOiB0cnVlLFxuICAgICAgZGF0ZXRpbWU6IHRydWUsXG4gICAgICAnZGF0ZXRpbWUtbG9jYWwnOiB0cnVlXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEhlbHBlciBmdW5jdGlvbiBmb3IgbGVnYWN5IGJyb3dzZXJzIGFuZCBpZnJhbWVzIHdoaWNoIHNvbWV0aW1lcyBmb2N1c1xuICAgICAqIGVsZW1lbnRzIGxpa2UgZG9jdW1lbnQsIGJvZHksIGFuZCBub24taW50ZXJhY3RpdmUgU1ZHLlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1ZhbGlkRm9jdXNUYXJnZXQoZWwpIHtcbiAgICAgIGlmIChcbiAgICAgICAgZWwgJiZcbiAgICAgICAgZWwgIT09IGRvY3VtZW50ICYmXG4gICAgICAgIGVsLm5vZGVOYW1lICE9PSAnSFRNTCcgJiZcbiAgICAgICAgZWwubm9kZU5hbWUgIT09ICdCT0RZJyAmJlxuICAgICAgICAnY2xhc3NMaXN0JyBpbiBlbCAmJlxuICAgICAgICAnY29udGFpbnMnIGluIGVsLmNsYXNzTGlzdFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgc2hvdWxkIGF1dG9tYXRpY2FsbHkgdHJpZ2dlciB0aGVcbiAgICAgKiBgZm9jdXMtdmlzaWJsZWAgY2xhc3MgYmVpbmcgYWRkZWQsIGkuZS4gd2hldGhlciBpdCBzaG91bGQgYWx3YXlzIG1hdGNoXG4gICAgICogYDpmb2N1cy12aXNpYmxlYCB3aGVuIGZvY3VzZWQuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9jdXNUcmlnZ2Vyc0tleWJvYXJkTW9kYWxpdHkoZWwpIHtcbiAgICAgIHZhciB0eXBlID0gZWwudHlwZTtcbiAgICAgIHZhciB0YWdOYW1lID0gZWwudGFnTmFtZTtcblxuICAgICAgaWYgKHRhZ05hbWUgPT09ICdJTlBVVCcgJiYgaW5wdXRUeXBlc0FsbG93bGlzdFt0eXBlXSAmJiAhZWwucmVhZE9ubHkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0YWdOYW1lID09PSAnVEVYVEFSRUEnICYmICFlbC5yZWFkT25seSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsLmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBgZm9jdXMtdmlzaWJsZWAgY2xhc3MgdG8gdGhlIGdpdmVuIGVsZW1lbnQgaWYgaXQgd2FzIG5vdCBhZGRlZCBieVxuICAgICAqIHRoZSBhdXRob3IuXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZEZvY3VzVmlzaWJsZUNsYXNzKGVsKSB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb2N1cy12aXNpYmxlJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZm9jdXMtdmlzaWJsZScpO1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWZvY3VzLXZpc2libGUtYWRkZWQnLCAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBgZm9jdXMtdmlzaWJsZWAgY2xhc3MgZnJvbSB0aGUgZ2l2ZW4gZWxlbWVudCBpZiBpdCB3YXMgbm90XG4gICAgICogb3JpZ2luYWxseSBhZGRlZCBieSB0aGUgYXV0aG9yLlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW1vdmVGb2N1c1Zpc2libGVDbGFzcyhlbCkge1xuICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtZm9jdXMtdmlzaWJsZS1hZGRlZCcpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzLXZpc2libGUnKTtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1mb2N1cy12aXNpYmxlLWFkZGVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIG1vc3QgcmVjZW50IHVzZXIgaW50ZXJhY3Rpb24gd2FzIHZpYSB0aGUga2V5Ym9hcmQ7XG4gICAgICogYW5kIHRoZSBrZXkgcHJlc3MgZGlkIG5vdCBpbmNsdWRlIGEgbWV0YSwgYWx0L29wdGlvbiwgb3IgY29udHJvbCBrZXk7XG4gICAgICogdGhlbiB0aGUgbW9kYWxpdHkgaXMga2V5Ym9hcmQuIE90aGVyd2lzZSwgdGhlIG1vZGFsaXR5IGlzIG5vdCBrZXlib2FyZC5cbiAgICAgKiBBcHBseSBgZm9jdXMtdmlzaWJsZWAgdG8gYW55IGN1cnJlbnQgYWN0aXZlIGVsZW1lbnQgYW5kIGtlZXAgdHJhY2tcbiAgICAgKiBvZiBvdXIga2V5Ym9hcmQgbW9kYWxpdHkgc3RhdGUgd2l0aCBgaGFkS2V5Ym9hcmRFdmVudGAuXG4gICAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25LZXlEb3duKGUpIHtcbiAgICAgIGlmIChlLm1ldGFLZXkgfHwgZS5hbHRLZXkgfHwgZS5jdHJsS2V5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzVmFsaWRGb2N1c1RhcmdldChzY29wZS5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICBhZGRGb2N1c1Zpc2libGVDbGFzcyhzY29wZS5hY3RpdmVFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgaGFkS2V5Ym9hcmRFdmVudCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgYXQgYW55IHBvaW50IGEgdXNlciBjbGlja3Mgd2l0aCBhIHBvaW50aW5nIGRldmljZSwgZW5zdXJlIHRoYXQgd2UgY2hhbmdlXG4gICAgICogdGhlIG1vZGFsaXR5IGF3YXkgZnJvbSBrZXlib2FyZC5cbiAgICAgKiBUaGlzIGF2b2lkcyB0aGUgc2l0dWF0aW9uIHdoZXJlIGEgdXNlciBwcmVzc2VzIGEga2V5IG9uIGFuIGFscmVhZHkgZm9jdXNlZFxuICAgICAqIGVsZW1lbnQsIGFuZCB0aGVuIGNsaWNrcyBvbiBhIGRpZmZlcmVudCBlbGVtZW50LCBmb2N1c2luZyBpdCB3aXRoIGFcbiAgICAgKiBwb2ludGluZyBkZXZpY2UsIHdoaWxlIHdlIHN0aWxsIHRoaW5rIHdlJ3JlIGluIGtleWJvYXJkIG1vZGFsaXR5LlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvblBvaW50ZXJEb3duKGUpIHtcbiAgICAgIGhhZEtleWJvYXJkRXZlbnQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBgZm9jdXNgLCBhZGQgdGhlIGBmb2N1cy12aXNpYmxlYCBjbGFzcyB0byB0aGUgdGFyZ2V0IGlmOlxuICAgICAqIC0gdGhlIHRhcmdldCByZWNlaXZlZCBmb2N1cyBhcyBhIHJlc3VsdCBvZiBrZXlib2FyZCBuYXZpZ2F0aW9uLCBvclxuICAgICAqIC0gdGhlIGV2ZW50IHRhcmdldCBpcyBhbiBlbGVtZW50IHRoYXQgd2lsbCBsaWtlbHkgcmVxdWlyZSBpbnRlcmFjdGlvblxuICAgICAqICAgdmlhIHRoZSBrZXlib2FyZCAoZS5nLiBhIHRleHQgYm94KVxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvbkZvY3VzKGUpIHtcbiAgICAgIC8vIFByZXZlbnQgSUUgZnJvbSBmb2N1c2luZyB0aGUgZG9jdW1lbnQgb3IgSFRNTCBlbGVtZW50LlxuICAgICAgaWYgKCFpc1ZhbGlkRm9jdXNUYXJnZXQoZS50YXJnZXQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGhhZEtleWJvYXJkRXZlbnQgfHwgZm9jdXNUcmlnZ2Vyc0tleWJvYXJkTW9kYWxpdHkoZS50YXJnZXQpKSB7XG4gICAgICAgIGFkZEZvY3VzVmlzaWJsZUNsYXNzKGUudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBgYmx1cmAsIHJlbW92ZSB0aGUgYGZvY3VzLXZpc2libGVgIGNsYXNzIGZyb20gdGhlIHRhcmdldC5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25CbHVyKGUpIHtcbiAgICAgIGlmICghaXNWYWxpZEZvY3VzVGFyZ2V0KGUudGFyZ2V0KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb2N1cy12aXNpYmxlJykgfHxcbiAgICAgICAgZS50YXJnZXQuaGFzQXR0cmlidXRlKCdkYXRhLWZvY3VzLXZpc2libGUtYWRkZWQnKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFRvIGRldGVjdCBhIHRhYi93aW5kb3cgc3dpdGNoLCB3ZSBsb29rIGZvciBhIGJsdXIgZXZlbnQgZm9sbG93ZWRcbiAgICAgICAgLy8gcmFwaWRseSBieSBhIHZpc2liaWxpdHkgY2hhbmdlLlxuICAgICAgICAvLyBJZiB3ZSBkb24ndCBzZWUgYSB2aXNpYmlsaXR5IGNoYW5nZSB3aXRoaW4gMTAwbXMsIGl0J3MgcHJvYmFibHkgYVxuICAgICAgICAvLyByZWd1bGFyIGZvY3VzIGNoYW5nZS5cbiAgICAgICAgaGFkRm9jdXNWaXNpYmxlUmVjZW50bHkgPSB0cnVlO1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGhhZEZvY3VzVmlzaWJsZVJlY2VudGx5VGltZW91dCk7XG4gICAgICAgIGhhZEZvY3VzVmlzaWJsZVJlY2VudGx5VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGhhZEZvY3VzVmlzaWJsZVJlY2VudGx5ID0gZmFsc2U7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICAgIHJlbW92ZUZvY3VzVmlzaWJsZUNsYXNzKGUudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgdXNlciBjaGFuZ2VzIHRhYnMsIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBvciBub3QgdGhlIHByZXZpb3VzbHlcbiAgICAgKiBmb2N1c2VkIGVsZW1lbnQgaGFkIC5mb2N1cy12aXNpYmxlLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvblZpc2liaWxpdHlDaGFuZ2UoZSkge1xuICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgICAgLy8gSWYgdGhlIHRhYiBiZWNvbWVzIGFjdGl2ZSBhZ2FpbiwgdGhlIGJyb3dzZXIgd2lsbCBoYW5kbGUgY2FsbGluZyBmb2N1c1xuICAgICAgICAvLyBvbiB0aGUgZWxlbWVudCAoU2FmYXJpIGFjdHVhbGx5IGNhbGxzIGl0IHR3aWNlKS5cbiAgICAgICAgLy8gSWYgdGhpcyB0YWIgY2hhbmdlIGNhdXNlZCBhIGJsdXIgb24gYW4gZWxlbWVudCB3aXRoIGZvY3VzLXZpc2libGUsXG4gICAgICAgIC8vIHJlLWFwcGx5IHRoZSBjbGFzcyB3aGVuIHRoZSB1c2VyIHN3aXRjaGVzIGJhY2sgdG8gdGhlIHRhYi5cbiAgICAgICAgaWYgKGhhZEZvY3VzVmlzaWJsZVJlY2VudGx5KSB7XG4gICAgICAgICAgaGFkS2V5Ym9hcmRFdmVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYWRkSW5pdGlhbFBvaW50ZXJNb3ZlTGlzdGVuZXJzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgZ3JvdXAgb2YgbGlzdGVuZXJzIHRvIGRldGVjdCB1c2FnZSBvZiBhbnkgcG9pbnRpbmcgZGV2aWNlcy5cbiAgICAgKiBUaGVzZSBsaXN0ZW5lcnMgd2lsbCBiZSBhZGRlZCB3aGVuIHRoZSBwb2x5ZmlsbCBmaXJzdCBsb2FkcywgYW5kIGFueXRpbWVcbiAgICAgKiB0aGUgd2luZG93IGlzIGJsdXJyZWQsIHNvIHRoYXQgdGhleSBhcmUgYWN0aXZlIHdoZW4gdGhlIHdpbmRvdyByZWdhaW5zXG4gICAgICogZm9jdXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkSW5pdGlhbFBvaW50ZXJNb3ZlTGlzdGVuZXJzKCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSW5pdGlhbFBvaW50ZXJNb3ZlTGlzdGVuZXJzKCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hlbiB0aGUgcG9sZnlpbGwgZmlyc3QgbG9hZHMsIGFzc3VtZSB0aGUgdXNlciBpcyBpbiBrZXlib2FyZCBtb2RhbGl0eS5cbiAgICAgKiBJZiBhbnkgZXZlbnQgaXMgcmVjZWl2ZWQgZnJvbSBhIHBvaW50aW5nIGRldmljZSAoZS5nLiBtb3VzZSwgcG9pbnRlcixcbiAgICAgKiB0b3VjaCksIHR1cm4gb2ZmIGtleWJvYXJkIG1vZGFsaXR5LlxuICAgICAqIFRoaXMgYWNjb3VudHMgZm9yIHNpdHVhdGlvbnMgd2hlcmUgZm9jdXMgZW50ZXJzIHRoZSBwYWdlIGZyb20gdGhlIFVSTCBiYXIuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKGUpIHtcbiAgICAgIC8vIFdvcmsgYXJvdW5kIGEgU2FmYXJpIHF1aXJrIHRoYXQgZmlyZXMgYSBtb3VzZW1vdmUgb24gPGh0bWw+IHdoZW5ldmVyIHRoZVxuICAgICAgLy8gd2luZG93IGJsdXJzLCBldmVuIGlmIHlvdSdyZSB0YWJiaW5nIG91dCBvZiB0aGUgcGFnZS4gwq9cXF8o44OEKV8vwq9cbiAgICAgIGlmIChlLnRhcmdldC5ub2RlTmFtZSAmJiBlLnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaHRtbCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBoYWRLZXlib2FyZEV2ZW50ID0gZmFsc2U7XG4gICAgICByZW1vdmVJbml0aWFsUG9pbnRlck1vdmVMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICAvLyBGb3Igc29tZSBraW5kcyBvZiBzdGF0ZSwgd2UgYXJlIGludGVyZXN0ZWQgaW4gY2hhbmdlcyBhdCB0aGUgZ2xvYmFsIHNjb3BlXG4gICAgLy8gb25seS4gRm9yIGV4YW1wbGUsIGdsb2JhbCBwb2ludGVyIGlucHV0LCBnbG9iYWwga2V5IHByZXNzZXMgYW5kIGdsb2JhbFxuICAgIC8vIHZpc2liaWxpdHkgY2hhbmdlIHNob3VsZCBhZmZlY3QgdGhlIHN0YXRlIGF0IGV2ZXJ5IHNjb3BlOlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24sIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uUG9pbnRlckRvd24sIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgb25Qb2ludGVyRG93biwgdHJ1ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uUG9pbnRlckRvd24sIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBvblZpc2liaWxpdHlDaGFuZ2UsIHRydWUpO1xuXG4gICAgYWRkSW5pdGlhbFBvaW50ZXJNb3ZlTGlzdGVuZXJzKCk7XG5cbiAgICAvLyBGb3IgZm9jdXMgYW5kIGJsdXIsIHdlIHNwZWNpZmljYWxseSBjYXJlIGFib3V0IHN0YXRlIGNoYW5nZXMgaW4gdGhlIGxvY2FsXG4gICAgLy8gc2NvcGUuIFRoaXMgaXMgYmVjYXVzZSBmb2N1cyAvIGJsdXIgZXZlbnRzIHRoYXQgb3JpZ2luYXRlIGZyb20gd2l0aGluIGFcbiAgICAvLyBzaGFkb3cgcm9vdCBhcmUgbm90IHJlLWRpc3BhdGNoZWQgZnJvbSB0aGUgaG9zdCBlbGVtZW50IGlmIGl0IHdhcyBhbHJlYWR5XG4gICAgLy8gdGhlIGFjdGl2ZSBlbGVtZW50IGluIGl0cyBvd24gc2NvcGU6XG4gICAgc2NvcGUuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBvbkZvY3VzLCB0cnVlKTtcbiAgICBzY29wZS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25CbHVyLCB0cnVlKTtcblxuICAgIC8vIFdlIGRldGVjdCB0aGF0IGEgbm9kZSBpcyBhIFNoYWRvd1Jvb3QgYnkgZW5zdXJpbmcgdGhhdCBpdCBpcyBhXG4gICAgLy8gRG9jdW1lbnRGcmFnbWVudCBhbmQgYWxzbyBoYXMgYSBob3N0IHByb3BlcnR5LiBUaGlzIGNoZWNrIGNvdmVycyBuYXRpdmVcbiAgICAvLyBpbXBsZW1lbnRhdGlvbiBhbmQgcG9seWZpbGwgaW1wbGVtZW50YXRpb24gdHJhbnNwYXJlbnRseS4gSWYgd2Ugb25seSBjYXJlZFxuICAgIC8vIGFib3V0IHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24sIHdlIGNvdWxkIGp1c3QgY2hlY2sgaWYgdGhlIHNjb3BlIHdhc1xuICAgIC8vIGFuIGluc3RhbmNlIG9mIGEgU2hhZG93Um9vdC5cbiAgICBpZiAoc2NvcGUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERSAmJiBzY29wZS5ob3N0KSB7XG4gICAgICAvLyBTaW5jZSBhIFNoYWRvd1Jvb3QgaXMgYSBzcGVjaWFsIGtpbmQgb2YgRG9jdW1lbnRGcmFnbWVudCwgaXQgZG9lcyBub3RcbiAgICAgIC8vIGhhdmUgYSByb290IGVsZW1lbnQgdG8gYWRkIGEgY2xhc3MgdG8uIFNvLCB3ZSBhZGQgdGhpcyBhdHRyaWJ1dGUgdG8gdGhlXG4gICAgICAvLyBob3N0IGVsZW1lbnQgaW5zdGVhZDpcbiAgICAgIHNjb3BlLmhvc3Quc2V0QXR0cmlidXRlKCdkYXRhLWpzLWZvY3VzLXZpc2libGUnLCAnJyk7XG4gICAgfSBlbHNlIGlmIChzY29wZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFKSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnanMtZm9jdXMtdmlzaWJsZScpO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1qcy1mb2N1cy12aXNpYmxlJywgJycpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEl0IGlzIGltcG9ydGFudCB0byB3cmFwIGFsbCByZWZlcmVuY2VzIHRvIGdsb2JhbCB3aW5kb3cgYW5kIGRvY3VtZW50IGluXG4gIC8vIHRoZXNlIGNoZWNrcyB0byBzdXBwb3J0IHNlcnZlci1zaWRlIHJlbmRlcmluZyB1c2UgY2FzZXNcbiAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9mb2N1cy12aXNpYmxlL2lzc3Vlcy8xOTlcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBNYWtlIHRoZSBwb2x5ZmlsbCBoZWxwZXIgZ2xvYmFsbHkgYXZhaWxhYmxlLiBUaGlzIGNhbiBiZSB1c2VkIGFzIGEgc2lnbmFsXG4gICAgLy8gdG8gaW50ZXJlc3RlZCBsaWJyYXJpZXMgdGhhdCB3aXNoIHRvIGNvb3JkaW5hdGUgd2l0aCB0aGUgcG9seWZpbGwgZm9yIGUuZy4sXG4gICAgLy8gYXBwbHlpbmcgdGhlIHBvbHlmaWxsIHRvIGEgc2hhZG93IHJvb3Q6XG4gICAgd2luZG93LmFwcGx5Rm9jdXNWaXNpYmxlUG9seWZpbGwgPSBhcHBseUZvY3VzVmlzaWJsZVBvbHlmaWxsO1xuXG4gICAgLy8gTm90aWZ5IGludGVyZXN0ZWQgbGlicmFyaWVzIG9mIHRoZSBwb2x5ZmlsbCdzIHByZXNlbmNlLCBpbiBjYXNlIHRoZVxuICAgIC8vIHBvbHlmaWxsIHdhcyBsb2FkZWQgbGF6aWx5OlxuICAgIHZhciBldmVudDtcblxuICAgIHRyeSB7XG4gICAgICBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnZm9jdXMtdmlzaWJsZS1wb2x5ZmlsbC1yZWFkeScpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgdXNpbmcgQ3VzdG9tRXZlbnQgYXMgYSBjb25zdHJ1Y3RvciBkaXJlY3RseTpcbiAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICBldmVudC5pbml0Q3VzdG9tRXZlbnQoJ2ZvY3VzLXZpc2libGUtcG9seWZpbGwtcmVhZHknLCBmYWxzZSwgZmFsc2UsIHt9KTtcbiAgICB9XG5cbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEFwcGx5IHRoZSBwb2x5ZmlsbCB0byB0aGUgZ2xvYmFsIGRvY3VtZW50LCBzbyB0aGF0IG5vIEphdmFTY3JpcHRcbiAgICAvLyBjb29yZGluYXRpb24gaXMgcmVxdWlyZWQgdG8gdXNlIHRoZSBwb2x5ZmlsbCBpbiB0aGUgdG9wLWxldmVsIGRvY3VtZW50OlxuICAgIGFwcGx5Rm9jdXNWaXNpYmxlUG9seWZpbGwoZG9jdW1lbnQpO1xuICB9XG5cbn0pKSk7XG4iLCJjb25zdCBOYXZTZWNvbmRhcnkgPSB7XG4gIGluaXQ6ICgpID0+IHtcbiAgICBjb25zdCBuYXZpZ2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtbmF2LXNlY29uZGFyeV0nKTtcblxuICAgIGlmIChuYXZpZ2F0aW9uKSB7XG4gICAgICBjb25zdCB0b2dnbGUgPSBuYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5hdi1zZWNvbmRhcnktdG9nZ2xlXScpO1xuICAgICAgY29uc3QgbmF2aWdhdGlvbl9zdWIgPSBuYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICdbZGF0YS1uYXYtc2Vjb25kYXJ5LXN1Yl0nXG4gICAgICApO1xuICAgICAgY29uc3QgbWVkaWFRdWVyeUxpc3QgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogNjMuOTM3NWVtKScpO1xuXG4gICAgICBmdW5jdGlvbiB0b2dnbGVfbmF2KGUpIHtcbiAgICAgICAgaWYgKHRvZ2dsZS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgdG9nZ2xlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgIHRvZ2dsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScpO1xuICAgICAgICAgIG5hdmlnYXRpb25fc3ViLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvZ2dsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgIHRvZ2dsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyk7XG4gICAgICAgICAgbmF2aWdhdGlvbl9zdWIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICB9XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFuZGxlX3NpemVfY2hhbmdlKGUpIHtcbiAgICAgICAgaWYgKGUubWF0Y2hlcykge1xuICAgICAgICAgIHRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZV9uYXYpO1xuICAgICAgICAgIHRvZ2dsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB0b2dnbGUuc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB0b2dnbGUuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2J1dHRvbicpO1xuICAgICAgICAgIG5hdmlnYXRpb25fc3ViLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvZ2dsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZV9uYXYpO1xuICAgICAgICAgIHRvZ2dsZS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKTtcbiAgICAgICAgICB0b2dnbGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLXByZXNzZWQnKTtcbiAgICAgICAgICB0b2dnbGUucmVtb3ZlQXR0cmlidXRlKCdyb2xlJyk7XG4gICAgICAgICAgbmF2aWdhdGlvbl9zdWIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyXG4gICAgICAvLyBJbmNsdWRlcyBmYWxsYmFjayBmb3IgU2FmYXJpIDwxNFxuICAgICAgaWYgKG1lZGlhUXVlcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgbWVkaWFRdWVyeUxpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgaGFuZGxlX3NpemVfY2hhbmdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lZGlhUXVlcnlMaXN0LmFkZExpc3RlbmVyKGhhbmRsZV9zaXplX2NoYW5nZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluaXRpYWwgY2hlY2tcbiAgICAgIGhhbmRsZV9zaXplX2NoYW5nZShtZWRpYVF1ZXJ5TGlzdCk7XG4gICAgfVxuICB9LFxufTtcblxuZXhwb3J0IHsgTmF2U2Vjb25kYXJ5IH07XG4iLCJjb25zdCBPZmZDYW52YXMgPSB7XG4gIGluaXQ6ICgpID0+IHtcbiAgICBjb25zdCBodG1sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNpdGUtaGVhZGVyXScpO1xuICAgIGNvbnN0IG1lbnUgPSBoZWFkZXIucXVlcnlTZWxlY3RvcignW2RhdGEtbWVudV0nKTtcbiAgICBjb25zdCBtZW51X29wZW4gPSBoZWFkZXIucXVlcnlTZWxlY3RvcignW2RhdGEtbWVudS1vcGVuXScpO1xuICAgIGNvbnN0IG1lbnVfY2xvc2UgPSBoZWFkZXIucXVlcnlTZWxlY3RvcignW2RhdGEtbWVudS1jbG9zZV0nKTtcbiAgICBjb25zdCBtZWRpYVF1ZXJ5TGlzdCA9IHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiA2My45Mzc1ZW0pJyk7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgICAgbWVudV9vcGVuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdzaXRlLWhlYWRlci0tb3BlbmVkJyk7XG4gICAgICAgIG1lbnUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICBodG1sLmNsYXNzTGlzdC5hZGQoJ25vLXNjcm9sbCcpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcblxuICAgICAgbWVudV9jbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2l0ZS1oZWFkZXItLW9wZW5lZCcpO1xuICAgICAgICBtZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICBodG1sLmNsYXNzTGlzdC5yZW1vdmUoJ25vLXNjcm9sbCcpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVfc2l6ZV9jaGFuZ2UoZSkge1xuICAgICAgaWYgKGUubWF0Y2hlcykge1xuICAgICAgICBtZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB0b2dnbGVNZW51KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtaGVhZGVyLS1vcGVuZWQnKTtcbiAgICAgICAgaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCduby1zY3JvbGwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZWdpc3RlciBldmVudCBsaXN0ZW5lclxuICAgIC8vIEluY2x1ZGVzIGZhbGxiYWNrIGZvciBTYWZhcmkgPDE0XG4gICAgaWYgKG1lZGlhUXVlcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIG1lZGlhUXVlcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZV9zaXplX2NoYW5nZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lZGlhUXVlcnlMaXN0LmFkZExpc3RlbmVyKGhhbmRsZV9zaXplX2NoYW5nZSk7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbCBjaGVja1xuICAgIGhhbmRsZV9zaXplX2NoYW5nZShtZWRpYVF1ZXJ5TGlzdCk7XG4gIH0sXG59O1xuXG5leHBvcnQgeyBPZmZDYW52YXMgfTtcbiIsImNvbnN0IFN0aWNreVNjcm9sbCA9IHtcbiAgaW5pdDogKCkgPT4ge1xuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG4gICAgY29uc3Qgc2Nyb2xsX29mZnNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNjcm9sbC1vZmZzZXRdJyk7XG4gICAgY29uc3Qgc2l0ZV9oZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zaXRlLWhlYWRlcl0nKTtcblxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKFxuICAgICAgKFtlXSkgPT5cbiAgICAgICAgc2l0ZV9oZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICAgICAnc2l0ZS1oZWFkZXItLXN0dWNrJyxcbiAgICAgICAgICBlLmludGVyc2VjdGlvblJhdGlvIDwgMVxuICAgICAgICApLFxuICAgICAgeyB0aHJlc2hvbGQ6IFsxXSB9XG4gICAgKTtcblxuICAgIGlmICghYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2hvbWUnKSkgcmV0dXJuO1xuICAgIG9ic2VydmVyLm9ic2VydmUoc2Nyb2xsX29mZnNldCk7XG4gIH0sXG59O1xuXG5leHBvcnQgeyBTdGlja3lTY3JvbGwgfTtcbiIsImltcG9ydCAnZGV0YWlscy1wb2x5ZmlsbCc7XG5pbXBvcnQgJ2ZvY3VzLXZpc2libGUnO1xuaW1wb3J0IHsgTmF2U2Vjb25kYXJ5IH0gZnJvbSAnLi9uYXYtc2Vjb25kYXJ5JztcbmltcG9ydCB7IE9mZkNhbnZhcyB9IGZyb20gJy4vb2ZmLWNhbnZhcyc7XG5pbXBvcnQgeyBTdGlja3lTY3JvbGwgfSBmcm9tICcuL3N0aWNreS1zY3JvbGwnO1xuXG5OYXZTZWNvbmRhcnkuaW5pdCgpO1xuT2ZmQ2FudmFzLmluaXQoKTtcblN0aWNreVNjcm9sbC5pbml0KCk7XG4iXSwibmFtZXMiOlsic2l0ZSIsInRpdGxlIiwidXJsIiwiZGVmYXVsdExvY2FsZSIsInRoaXMiLCJOYXZTZWNvbmRhcnkiLCJpbml0IiwibmF2aWdhdGlvbiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInRvZ2dsZSIsIm5hdmlnYXRpb25fc3ViIiwibWVkaWFRdWVyeUxpc3QiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwidG9nZ2xlX25hdiIsImUiLCJnZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZV9zaXplX2NoYW5nZSIsIm1hdGNoZXMiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJlbW92ZUF0dHJpYnV0ZSIsImFkZExpc3RlbmVyIiwiT2ZmQ2FudmFzIiwiaHRtbCIsImhlYWRlciIsIm1lbnUiLCJtZW51X29wZW4iLCJtZW51X2Nsb3NlIiwidG9nZ2xlTWVudSIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsIlN0aWNreVNjcm9sbCIsImJvZHkiLCJzY3JvbGxfb2Zmc2V0Iiwic2l0ZV9oZWFkZXIiLCJvYnNlcnZlciIsIkludGVyc2VjdGlvbk9ic2VydmVyIiwiaW50ZXJzZWN0aW9uUmF0aW8iLCJ0aHJlc2hvbGQiLCJjb250YWlucyIsIm9ic2VydmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQUFBLElBQUFBLElBQWMsR0FBRztDQUNmQyxFQUFBQSxLQUFLLEVBQUUsTUFEUTtDQUVmQyxFQUFBQSxHQUFHLEVBQUUsaUJBRlU7Q0FHZkMsRUFBQUEsYUFBYSxFQUFFLElBQUE7Q0FIQSxDQUFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQ0FBLE1BQU0sVUFBVSxJQUFJLEVB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
