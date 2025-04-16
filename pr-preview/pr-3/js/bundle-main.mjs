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
	  defaultLocale: 'en',
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

	const NavSecondary = {
	  init: () => {
	    const navigation = document.querySelector('[data-nav-secondary]');

	    if (navigation) {
	      const toggle = navigation.querySelector('[data-nav-secondary-toggle]');
	      const navigation_sub = navigation.querySelector(
	        '[data-nav-secondary-sub]'
	      );
	      const mediaQueryList = window.matchMedia('(max-width: 63.9375em)');

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
	      }

	      // Register event listener
	      // Includes fallback for Safari <14
	      if (mediaQueryList.addEventListener) {
	        mediaQueryList.addEventListener('change', handle_size_change);
	      } else {
	        mediaQueryList.addListener(handle_size_change);
	      }

	      // Initial check
	      handle_size_change(mediaQueryList);
	    }
	  },
	};

	const OffCanvas = {
	  init: () => {
	    const html = document.querySelector('html');
	    const header = document.querySelector('[data-site-header]');
	    const menu = header.querySelector('[data-menu]');
	    const menu_open = header.querySelector('[data-menu-open]');
	    const menu_close = header.querySelector('[data-menu-close]');
	    const mediaQueryList = window.matchMedia('(max-width: 63.9375em)');

	    function toggleMenu() {
	      menu_open.addEventListener('click', e => {
	        header.classList.add('site-header--opened');
	        menu.setAttribute('aria-hidden', 'false');
	        html.classList.add('no-scroll');
	        e.preventDefault();
	      });

	      menu_close.addEventListener('click', e => {
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
	    }

	    // Register event listener
	    // Includes fallback for Safari <14
	    if (mediaQueryList.addEventListener) {
	      mediaQueryList.addEventListener('change', handle_size_change);
	    } else {
	      mediaQueryList.addListener(handle_size_change);
	    }

	    // Initial check
	    handle_size_change(mediaQueryList);
	  },
	};

	const StickyScroll = {
	  init: () => {
	    const body = document.querySelector('body');
	    const scroll_offset = document.querySelector('[data-scroll-offset]');
	    const site_header = document.querySelector('[data-site-header]');

	    const observer = new IntersectionObserver(
	      ([e]) =>
	        site_header.classList.toggle(
	          'site-header--stuck',
	          e.intersectionRatio < 1
	        ),
	      { threshold: [1] }
	    );

	    if (!body.classList.contains('home')) return;
	    observer.observe(scroll_offset);
	  },
	};

	NavSecondary.init();
	OffCanvas.init();
	StickyScroll.init();

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLW1haW4ubWpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvX2RhdGEvc2l0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kZXRhaWxzLXBvbHlmaWxsL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2ZvY3VzLXZpc2libGUvZGlzdC9mb2N1cy12aXNpYmxlLmpzIiwiLi4vLi4vc3JjL2pzL25hdi1zZWNvbmRhcnkuanMiLCIuLi8uLi9zcmMvanMvb2ZmLWNhbnZhcy5qcyIsIi4uLy4uL3NyYy9qcy9zdGlja3ktc2Nyb2xsLmpzIiwiLi4vLi4vc3JjL2pzL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRpdGxlOiAnQ2VwaCcsXG4gIHVybDogJ2h0dHBzOi8vY2VwaC5pbycsXG4gIGRlZmF1bHRMb2NhbGU6ICdlbicsXG59O1xuIiwidm9pZCAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZhY3RvcnkpXG4gIGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JykgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KClcbiAgZWxzZSBmYWN0b3J5KClcbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICB2YXIgREVUQUlMUyA9ICdkZXRhaWxzJ1xuICB2YXIgU1VNTUFSWSA9ICdzdW1tYXJ5J1xuXG4gIHZhciBzdXBwb3J0ZWQgPSBjaGVja1N1cHBvcnQoKVxuICBpZiAoc3VwcG9ydGVkKSByZXR1cm5cblxuICAvLyBBZGQgYSBjbGFzc25hbWVcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIG5vLWRldGFpbHMnXG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxuXG4gIGluamVjdFN0eWxlKCdkZXRhaWxzLXBvbHlmaWxsLXN0eWxlJyxcbiAgICAnaHRtbC5uby1kZXRhaWxzICcgKyBERVRBSUxTICsgJzpub3QoW29wZW5dKSA+IDpub3QoJyArIFNVTU1BUlkgKyAnKSB7IGRpc3BsYXk6IG5vbmU7IH1cXG4nICtcbiAgICAnaHRtbC5uby1kZXRhaWxzICcgKyBERVRBSUxTICsgJyA+ICcgKyBTVU1NQVJZICsgJzpiZWZvcmUgeyBjb250ZW50OiBcIlxcdTI1YjZcIjsgZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IC44ZW07IHdpZHRoOiAxLjVlbTsgfVxcbicgK1xuICAgICdodG1sLm5vLWRldGFpbHMgJyArIERFVEFJTFMgKyAnW29wZW5dID4gJyArIFNVTU1BUlkgKyAnOmJlZm9yZSB7IGNvbnRlbnQ6IFwiXFx1MjViY1wiOyB9JylcblxuICAvKlxuICAgKiBDbGljayBoYW5kbGVyIGZvciBgPHN1bW1hcnk+YCB0YWdzXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNsaWNrSGFuZGxlciAoZSkge1xuICAgIGlmIChlLnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3VtbWFyeScpIHtcbiAgICAgIHZhciBkZXRhaWxzID0gZS50YXJnZXQucGFyZW50Tm9kZVxuICAgICAgaWYgKCFkZXRhaWxzKSByZXR1cm5cblxuICAgICAgaWYgKGRldGFpbHMuZ2V0QXR0cmlidXRlKCdvcGVuJykpIHtcbiAgICAgICAgZGV0YWlscy5vcGVuID0gZmFsc2VcbiAgICAgICAgZGV0YWlscy5yZW1vdmVBdHRyaWJ1dGUoJ29wZW4nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGV0YWlscy5vcGVuID0gdHJ1ZVxuICAgICAgICBkZXRhaWxzLnNldEF0dHJpYnV0ZSgnb3BlbicsICdvcGVuJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBDaGVja3MgZm9yIHN1cHBvcnQgZm9yIGA8ZGV0YWlscz5gXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNoZWNrU3VwcG9ydCAoKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChERVRBSUxTKVxuICAgIGlmICghKCdvcGVuJyBpbiBlbCkpIHJldHVybiBmYWxzZVxuXG4gICAgZWwuaW5uZXJIVE1MID0gJzwnICsgU1VNTUFSWSArICc+YTwvJyArIFNVTU1BUlkgKyAnPmInXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbClcblxuICAgIHZhciBkaWZmID0gZWwub2Zmc2V0SGVpZ2h0XG4gICAgZWwub3BlbiA9IHRydWVcbiAgICB2YXIgcmVzdWx0ID0gKGRpZmYgIT0gZWwub2Zmc2V0SGVpZ2h0KVxuXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbClcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICAvKlxuICAgKiBJbmplY3RzIHN0eWxlcyAoaWRlbXBvdGVudClcbiAgICovXG5cbiAgZnVuY3Rpb24gaW5qZWN0U3R5bGUgKGlkLCBzdHlsZSkge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVyblxuXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICAgIGVsLmlkID0gaWRcbiAgICBlbC5pbm5lckhUTUwgPSBzdHlsZVxuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChlbClcbiAgfVxufSkpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHNlbWlcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIDpmb2N1cy12aXNpYmxlIHBvbHlmaWxsIGF0IHRoZSBnaXZlbiBzY29wZS5cbiAgICogQSBzY29wZSBpbiB0aGlzIGNhc2UgaXMgZWl0aGVyIHRoZSB0b3AtbGV2ZWwgRG9jdW1lbnQgb3IgYSBTaGFkb3cgUm9vdC5cbiAgICpcbiAgICogQHBhcmFtIHsoRG9jdW1lbnR8U2hhZG93Um9vdCl9IHNjb3BlXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1dJQ0cvZm9jdXMtdmlzaWJsZVxuICAgKi9cbiAgZnVuY3Rpb24gYXBwbHlGb2N1c1Zpc2libGVQb2x5ZmlsbChzY29wZSkge1xuICAgIHZhciBoYWRLZXlib2FyZEV2ZW50ID0gdHJ1ZTtcbiAgICB2YXIgaGFkRm9jdXNWaXNpYmxlUmVjZW50bHkgPSBmYWxzZTtcbiAgICB2YXIgaGFkRm9jdXNWaXNpYmxlUmVjZW50bHlUaW1lb3V0ID0gbnVsbDtcblxuICAgIHZhciBpbnB1dFR5cGVzQWxsb3dsaXN0ID0ge1xuICAgICAgdGV4dDogdHJ1ZSxcbiAgICAgIHNlYXJjaDogdHJ1ZSxcbiAgICAgIHVybDogdHJ1ZSxcbiAgICAgIHRlbDogdHJ1ZSxcbiAgICAgIGVtYWlsOiB0cnVlLFxuICAgICAgcGFzc3dvcmQ6IHRydWUsXG4gICAgICBudW1iZXI6IHRydWUsXG4gICAgICBkYXRlOiB0cnVlLFxuICAgICAgbW9udGg6IHRydWUsXG4gICAgICB3ZWVrOiB0cnVlLFxuICAgICAgdGltZTogdHJ1ZSxcbiAgICAgIGRhdGV0aW1lOiB0cnVlLFxuICAgICAgJ2RhdGV0aW1lLWxvY2FsJzogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gZm9yIGxlZ2FjeSBicm93c2VycyBhbmQgaWZyYW1lcyB3aGljaCBzb21ldGltZXMgZm9jdXNcbiAgICAgKiBlbGVtZW50cyBsaWtlIGRvY3VtZW50LCBib2R5LCBhbmQgbm9uLWludGVyYWN0aXZlIFNWRy5cbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNWYWxpZEZvY3VzVGFyZ2V0KGVsKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGVsICYmXG4gICAgICAgIGVsICE9PSBkb2N1bWVudCAmJlxuICAgICAgICBlbC5ub2RlTmFtZSAhPT0gJ0hUTUwnICYmXG4gICAgICAgIGVsLm5vZGVOYW1lICE9PSAnQk9EWScgJiZcbiAgICAgICAgJ2NsYXNzTGlzdCcgaW4gZWwgJiZcbiAgICAgICAgJ2NvbnRhaW5zJyBpbiBlbC5jbGFzc0xpc3RcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IHNob3VsZCBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgdGhlXG4gICAgICogYGZvY3VzLXZpc2libGVgIGNsYXNzIGJlaW5nIGFkZGVkLCBpLmUuIHdoZXRoZXIgaXQgc2hvdWxkIGFsd2F5cyBtYXRjaFxuICAgICAqIGA6Zm9jdXMtdmlzaWJsZWAgd2hlbiBmb2N1c2VkLlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvY3VzVHJpZ2dlcnNLZXlib2FyZE1vZGFsaXR5KGVsKSB7XG4gICAgICB2YXIgdHlwZSA9IGVsLnR5cGU7XG4gICAgICB2YXIgdGFnTmFtZSA9IGVsLnRhZ05hbWU7XG5cbiAgICAgIGlmICh0YWdOYW1lID09PSAnSU5QVVQnICYmIGlucHV0VHlwZXNBbGxvd2xpc3RbdHlwZV0gJiYgIWVsLnJlYWRPbmx5KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGFnTmFtZSA9PT0gJ1RFWFRBUkVBJyAmJiAhZWwucmVhZE9ubHkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbC5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgYGZvY3VzLXZpc2libGVgIGNsYXNzIHRvIHRoZSBnaXZlbiBlbGVtZW50IGlmIGl0IHdhcyBub3QgYWRkZWQgYnlcbiAgICAgKiB0aGUgYXV0aG9yLlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGRGb2N1c1Zpc2libGVDbGFzcyhlbCkge1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucygnZm9jdXMtdmlzaWJsZScpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzLXZpc2libGUnKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1mb2N1cy12aXNpYmxlLWFkZGVkJywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgYGZvY3VzLXZpc2libGVgIGNsYXNzIGZyb20gdGhlIGdpdmVuIGVsZW1lbnQgaWYgaXQgd2FzIG5vdFxuICAgICAqIG9yaWdpbmFsbHkgYWRkZWQgYnkgdGhlIGF1dGhvci5cbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlRm9jdXNWaXNpYmxlQ2xhc3MoZWwpIHtcbiAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKCdkYXRhLWZvY3VzLXZpc2libGUtYWRkZWQnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1cy12aXNpYmxlJyk7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZm9jdXMtdmlzaWJsZS1hZGRlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBtb3N0IHJlY2VudCB1c2VyIGludGVyYWN0aW9uIHdhcyB2aWEgdGhlIGtleWJvYXJkO1xuICAgICAqIGFuZCB0aGUga2V5IHByZXNzIGRpZCBub3QgaW5jbHVkZSBhIG1ldGEsIGFsdC9vcHRpb24sIG9yIGNvbnRyb2wga2V5O1xuICAgICAqIHRoZW4gdGhlIG1vZGFsaXR5IGlzIGtleWJvYXJkLiBPdGhlcndpc2UsIHRoZSBtb2RhbGl0eSBpcyBub3Qga2V5Ym9hcmQuXG4gICAgICogQXBwbHkgYGZvY3VzLXZpc2libGVgIHRvIGFueSBjdXJyZW50IGFjdGl2ZSBlbGVtZW50IGFuZCBrZWVwIHRyYWNrXG4gICAgICogb2Ygb3VyIGtleWJvYXJkIG1vZGFsaXR5IHN0YXRlIHdpdGggYGhhZEtleWJvYXJkRXZlbnRgLlxuICAgICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9uS2V5RG93bihlKSB7XG4gICAgICBpZiAoZS5tZXRhS2V5IHx8IGUuYWx0S2V5IHx8IGUuY3RybEtleSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1ZhbGlkRm9jdXNUYXJnZXQoc2NvcGUuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgYWRkRm9jdXNWaXNpYmxlQ2xhc3Moc2NvcGUuYWN0aXZlRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGhhZEtleWJvYXJkRXZlbnQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIGF0IGFueSBwb2ludCBhIHVzZXIgY2xpY2tzIHdpdGggYSBwb2ludGluZyBkZXZpY2UsIGVuc3VyZSB0aGF0IHdlIGNoYW5nZVxuICAgICAqIHRoZSBtb2RhbGl0eSBhd2F5IGZyb20ga2V5Ym9hcmQuXG4gICAgICogVGhpcyBhdm9pZHMgdGhlIHNpdHVhdGlvbiB3aGVyZSBhIHVzZXIgcHJlc3NlcyBhIGtleSBvbiBhbiBhbHJlYWR5IGZvY3VzZWRcbiAgICAgKiBlbGVtZW50LCBhbmQgdGhlbiBjbGlja3Mgb24gYSBkaWZmZXJlbnQgZWxlbWVudCwgZm9jdXNpbmcgaXQgd2l0aCBhXG4gICAgICogcG9pbnRpbmcgZGV2aWNlLCB3aGlsZSB3ZSBzdGlsbCB0aGluayB3ZSdyZSBpbiBrZXlib2FyZCBtb2RhbGl0eS5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25Qb2ludGVyRG93bihlKSB7XG4gICAgICBoYWRLZXlib2FyZEV2ZW50ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gYGZvY3VzYCwgYWRkIHRoZSBgZm9jdXMtdmlzaWJsZWAgY2xhc3MgdG8gdGhlIHRhcmdldCBpZjpcbiAgICAgKiAtIHRoZSB0YXJnZXQgcmVjZWl2ZWQgZm9jdXMgYXMgYSByZXN1bHQgb2Yga2V5Ym9hcmQgbmF2aWdhdGlvbiwgb3JcbiAgICAgKiAtIHRoZSBldmVudCB0YXJnZXQgaXMgYW4gZWxlbWVudCB0aGF0IHdpbGwgbGlrZWx5IHJlcXVpcmUgaW50ZXJhY3Rpb25cbiAgICAgKiAgIHZpYSB0aGUga2V5Ym9hcmQgKGUuZy4gYSB0ZXh0IGJveClcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25Gb2N1cyhlKSB7XG4gICAgICAvLyBQcmV2ZW50IElFIGZyb20gZm9jdXNpbmcgdGhlIGRvY3VtZW50IG9yIEhUTUwgZWxlbWVudC5cbiAgICAgIGlmICghaXNWYWxpZEZvY3VzVGFyZ2V0KGUudGFyZ2V0KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChoYWRLZXlib2FyZEV2ZW50IHx8IGZvY3VzVHJpZ2dlcnNLZXlib2FyZE1vZGFsaXR5KGUudGFyZ2V0KSkge1xuICAgICAgICBhZGRGb2N1c1Zpc2libGVDbGFzcyhlLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gYGJsdXJgLCByZW1vdmUgdGhlIGBmb2N1cy12aXNpYmxlYCBjbGFzcyBmcm9tIHRoZSB0YXJnZXQuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9uQmx1cihlKSB7XG4gICAgICBpZiAoIWlzVmFsaWRGb2N1c1RhcmdldChlLnRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZm9jdXMtdmlzaWJsZScpIHx8XG4gICAgICAgIGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1mb2N1cy12aXNpYmxlLWFkZGVkJylcbiAgICAgICkge1xuICAgICAgICAvLyBUbyBkZXRlY3QgYSB0YWIvd2luZG93IHN3aXRjaCwgd2UgbG9vayBmb3IgYSBibHVyIGV2ZW50IGZvbGxvd2VkXG4gICAgICAgIC8vIHJhcGlkbHkgYnkgYSB2aXNpYmlsaXR5IGNoYW5nZS5cbiAgICAgICAgLy8gSWYgd2UgZG9uJ3Qgc2VlIGEgdmlzaWJpbGl0eSBjaGFuZ2Ugd2l0aGluIDEwMG1zLCBpdCdzIHByb2JhYmx5IGFcbiAgICAgICAgLy8gcmVndWxhciBmb2N1cyBjaGFuZ2UuXG4gICAgICAgIGhhZEZvY3VzVmlzaWJsZVJlY2VudGx5ID0gdHJ1ZTtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChoYWRGb2N1c1Zpc2libGVSZWNlbnRseVRpbWVvdXQpO1xuICAgICAgICBoYWRGb2N1c1Zpc2libGVSZWNlbnRseVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBoYWRGb2N1c1Zpc2libGVSZWNlbnRseSA9IGZhbHNlO1xuICAgICAgICB9LCAxMDApO1xuICAgICAgICByZW1vdmVGb2N1c1Zpc2libGVDbGFzcyhlLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHVzZXIgY2hhbmdlcyB0YWJzLCBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgb3Igbm90IHRoZSBwcmV2aW91c2x5XG4gICAgICogZm9jdXNlZCBlbGVtZW50IGhhZCAuZm9jdXMtdmlzaWJsZS5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25WaXNpYmlsaXR5Q2hhbmdlKGUpIHtcbiAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICAgIC8vIElmIHRoZSB0YWIgYmVjb21lcyBhY3RpdmUgYWdhaW4sIHRoZSBicm93c2VyIHdpbGwgaGFuZGxlIGNhbGxpbmcgZm9jdXNcbiAgICAgICAgLy8gb24gdGhlIGVsZW1lbnQgKFNhZmFyaSBhY3R1YWxseSBjYWxscyBpdCB0d2ljZSkuXG4gICAgICAgIC8vIElmIHRoaXMgdGFiIGNoYW5nZSBjYXVzZWQgYSBibHVyIG9uIGFuIGVsZW1lbnQgd2l0aCBmb2N1cy12aXNpYmxlLFxuICAgICAgICAvLyByZS1hcHBseSB0aGUgY2xhc3Mgd2hlbiB0aGUgdXNlciBzd2l0Y2hlcyBiYWNrIHRvIHRoZSB0YWIuXG4gICAgICAgIGlmIChoYWRGb2N1c1Zpc2libGVSZWNlbnRseSkge1xuICAgICAgICAgIGhhZEtleWJvYXJkRXZlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGFkZEluaXRpYWxQb2ludGVyTW92ZUxpc3RlbmVycygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGdyb3VwIG9mIGxpc3RlbmVycyB0byBkZXRlY3QgdXNhZ2Ugb2YgYW55IHBvaW50aW5nIGRldmljZXMuXG4gICAgICogVGhlc2UgbGlzdGVuZXJzIHdpbGwgYmUgYWRkZWQgd2hlbiB0aGUgcG9seWZpbGwgZmlyc3QgbG9hZHMsIGFuZCBhbnl0aW1lXG4gICAgICogdGhlIHdpbmRvdyBpcyBibHVycmVkLCBzbyB0aGF0IHRoZXkgYXJlIGFjdGl2ZSB3aGVuIHRoZSB3aW5kb3cgcmVnYWluc1xuICAgICAqIGZvY3VzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZEluaXRpYWxQb2ludGVyTW92ZUxpc3RlbmVycygpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUluaXRpYWxQb2ludGVyTW92ZUxpc3RlbmVycygpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbkluaXRpYWxQb2ludGVyTW92ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uSW5pdGlhbFBvaW50ZXJNb3ZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Jbml0aWFsUG9pbnRlck1vdmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gdGhlIHBvbGZ5aWxsIGZpcnN0IGxvYWRzLCBhc3N1bWUgdGhlIHVzZXIgaXMgaW4ga2V5Ym9hcmQgbW9kYWxpdHkuXG4gICAgICogSWYgYW55IGV2ZW50IGlzIHJlY2VpdmVkIGZyb20gYSBwb2ludGluZyBkZXZpY2UgKGUuZy4gbW91c2UsIHBvaW50ZXIsXG4gICAgICogdG91Y2gpLCB0dXJuIG9mZiBrZXlib2FyZCBtb2RhbGl0eS5cbiAgICAgKiBUaGlzIGFjY291bnRzIGZvciBzaXR1YXRpb25zIHdoZXJlIGZvY3VzIGVudGVycyB0aGUgcGFnZSBmcm9tIHRoZSBVUkwgYmFyLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvbkluaXRpYWxQb2ludGVyTW92ZShlKSB7XG4gICAgICAvLyBXb3JrIGFyb3VuZCBhIFNhZmFyaSBxdWlyayB0aGF0IGZpcmVzIGEgbW91c2Vtb3ZlIG9uIDxodG1sPiB3aGVuZXZlciB0aGVcbiAgICAgIC8vIHdpbmRvdyBibHVycywgZXZlbiBpZiB5b3UncmUgdGFiYmluZyBvdXQgb2YgdGhlIHBhZ2UuIMKvXFxfKOODhClfL8KvXG4gICAgICBpZiAoZS50YXJnZXQubm9kZU5hbWUgJiYgZS50YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaGFkS2V5Ym9hcmRFdmVudCA9IGZhbHNlO1xuICAgICAgcmVtb3ZlSW5pdGlhbFBvaW50ZXJNb3ZlTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgLy8gRm9yIHNvbWUga2luZHMgb2Ygc3RhdGUsIHdlIGFyZSBpbnRlcmVzdGVkIGluIGNoYW5nZXMgYXQgdGhlIGdsb2JhbCBzY29wZVxuICAgIC8vIG9ubHkuIEZvciBleGFtcGxlLCBnbG9iYWwgcG9pbnRlciBpbnB1dCwgZ2xvYmFsIGtleSBwcmVzc2VzIGFuZCBnbG9iYWxcbiAgICAvLyB2aXNpYmlsaXR5IGNoYW5nZSBzaG91bGQgYWZmZWN0IHRoZSBzdGF0ZSBhdCBldmVyeSBzY29wZTpcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCB0cnVlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvblBvaW50ZXJEb3duLCB0cnVlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIG9uUG9pbnRlckRvd24sIHRydWUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblBvaW50ZXJEb3duLCB0cnVlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5Q2hhbmdlLCB0cnVlKTtcblxuICAgIGFkZEluaXRpYWxQb2ludGVyTW92ZUxpc3RlbmVycygpO1xuXG4gICAgLy8gRm9yIGZvY3VzIGFuZCBibHVyLCB3ZSBzcGVjaWZpY2FsbHkgY2FyZSBhYm91dCBzdGF0ZSBjaGFuZ2VzIGluIHRoZSBsb2NhbFxuICAgIC8vIHNjb3BlLiBUaGlzIGlzIGJlY2F1c2UgZm9jdXMgLyBibHVyIGV2ZW50cyB0aGF0IG9yaWdpbmF0ZSBmcm9tIHdpdGhpbiBhXG4gICAgLy8gc2hhZG93IHJvb3QgYXJlIG5vdCByZS1kaXNwYXRjaGVkIGZyb20gdGhlIGhvc3QgZWxlbWVudCBpZiBpdCB3YXMgYWxyZWFkeVxuICAgIC8vIHRoZSBhY3RpdmUgZWxlbWVudCBpbiBpdHMgb3duIHNjb3BlOlxuICAgIHNjb3BlLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgb25Gb2N1cywgdHJ1ZSk7XG4gICAgc2NvcGUuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uQmx1ciwgdHJ1ZSk7XG5cbiAgICAvLyBXZSBkZXRlY3QgdGhhdCBhIG5vZGUgaXMgYSBTaGFkb3dSb290IGJ5IGVuc3VyaW5nIHRoYXQgaXQgaXMgYVxuICAgIC8vIERvY3VtZW50RnJhZ21lbnQgYW5kIGFsc28gaGFzIGEgaG9zdCBwcm9wZXJ0eS4gVGhpcyBjaGVjayBjb3ZlcnMgbmF0aXZlXG4gICAgLy8gaW1wbGVtZW50YXRpb24gYW5kIHBvbHlmaWxsIGltcGxlbWVudGF0aW9uIHRyYW5zcGFyZW50bHkuIElmIHdlIG9ubHkgY2FyZWRcbiAgICAvLyBhYm91dCB0aGUgbmF0aXZlIGltcGxlbWVudGF0aW9uLCB3ZSBjb3VsZCBqdXN0IGNoZWNrIGlmIHRoZSBzY29wZSB3YXNcbiAgICAvLyBhbiBpbnN0YW5jZSBvZiBhIFNoYWRvd1Jvb3QuXG4gICAgaWYgKHNjb3BlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUgJiYgc2NvcGUuaG9zdCkge1xuICAgICAgLy8gU2luY2UgYSBTaGFkb3dSb290IGlzIGEgc3BlY2lhbCBraW5kIG9mIERvY3VtZW50RnJhZ21lbnQsIGl0IGRvZXMgbm90XG4gICAgICAvLyBoYXZlIGEgcm9vdCBlbGVtZW50IHRvIGFkZCBhIGNsYXNzIHRvLiBTbywgd2UgYWRkIHRoaXMgYXR0cmlidXRlIHRvIHRoZVxuICAgICAgLy8gaG9zdCBlbGVtZW50IGluc3RlYWQ6XG4gICAgICBzY29wZS5ob3N0LnNldEF0dHJpYnV0ZSgnZGF0YS1qcy1mb2N1cy12aXNpYmxlJywgJycpO1xuICAgIH0gZWxzZSBpZiAoc2NvcGUubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSkge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2pzLWZvY3VzLXZpc2libGUnKTtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtanMtZm9jdXMtdmlzaWJsZScsICcnKTtcbiAgICB9XG4gIH1cblxuICAvLyBJdCBpcyBpbXBvcnRhbnQgdG8gd3JhcCBhbGwgcmVmZXJlbmNlcyB0byBnbG9iYWwgd2luZG93IGFuZCBkb2N1bWVudCBpblxuICAvLyB0aGVzZSBjaGVja3MgdG8gc3VwcG9ydCBzZXJ2ZXItc2lkZSByZW5kZXJpbmcgdXNlIGNhc2VzXG4gIC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1dJQ0cvZm9jdXMtdmlzaWJsZS9pc3N1ZXMvMTk5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gTWFrZSB0aGUgcG9seWZpbGwgaGVscGVyIGdsb2JhbGx5IGF2YWlsYWJsZS4gVGhpcyBjYW4gYmUgdXNlZCBhcyBhIHNpZ25hbFxuICAgIC8vIHRvIGludGVyZXN0ZWQgbGlicmFyaWVzIHRoYXQgd2lzaCB0byBjb29yZGluYXRlIHdpdGggdGhlIHBvbHlmaWxsIGZvciBlLmcuLFxuICAgIC8vIGFwcGx5aW5nIHRoZSBwb2x5ZmlsbCB0byBhIHNoYWRvdyByb290OlxuICAgIHdpbmRvdy5hcHBseUZvY3VzVmlzaWJsZVBvbHlmaWxsID0gYXBwbHlGb2N1c1Zpc2libGVQb2x5ZmlsbDtcblxuICAgIC8vIE5vdGlmeSBpbnRlcmVzdGVkIGxpYnJhcmllcyBvZiB0aGUgcG9seWZpbGwncyBwcmVzZW5jZSwgaW4gY2FzZSB0aGVcbiAgICAvLyBwb2x5ZmlsbCB3YXMgbG9hZGVkIGxhemlseTpcbiAgICB2YXIgZXZlbnQ7XG5cbiAgICB0cnkge1xuICAgICAgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2ZvY3VzLXZpc2libGUtcG9seWZpbGwtcmVhZHknKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IHVzaW5nIEN1c3RvbUV2ZW50IGFzIGEgY29uc3RydWN0b3IgZGlyZWN0bHk6XG4gICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgZXZlbnQuaW5pdEN1c3RvbUV2ZW50KCdmb2N1cy12aXNpYmxlLXBvbHlmaWxsLXJlYWR5JywgZmFsc2UsIGZhbHNlLCB7fSk7XG4gICAgfVxuXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBBcHBseSB0aGUgcG9seWZpbGwgdG8gdGhlIGdsb2JhbCBkb2N1bWVudCwgc28gdGhhdCBubyBKYXZhU2NyaXB0XG4gICAgLy8gY29vcmRpbmF0aW9uIGlzIHJlcXVpcmVkIHRvIHVzZSB0aGUgcG9seWZpbGwgaW4gdGhlIHRvcC1sZXZlbCBkb2N1bWVudDpcbiAgICBhcHBseUZvY3VzVmlzaWJsZVBvbHlmaWxsKGRvY3VtZW50KTtcbiAgfVxuXG59KSkpO1xuIiwiY29uc3QgTmF2U2Vjb25kYXJ5ID0ge1xuICBpbml0OiAoKSA9PiB7XG4gICAgY29uc3QgbmF2aWdhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5hdi1zZWNvbmRhcnldJyk7XG5cbiAgICBpZiAobmF2aWdhdGlvbikge1xuICAgICAgY29uc3QgdG9nZ2xlID0gbmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1uYXYtc2Vjb25kYXJ5LXRvZ2dsZV0nKTtcbiAgICAgIGNvbnN0IG5hdmlnYXRpb25fc3ViID0gbmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnW2RhdGEtbmF2LXNlY29uZGFyeS1zdWJdJ1xuICAgICAgKTtcbiAgICAgIGNvbnN0IG1lZGlhUXVlcnlMaXN0ID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDYzLjkzNzVlbSknKTtcblxuICAgICAgZnVuY3Rpb24gdG9nZ2xlX25hdihlKSB7XG4gICAgICAgIGlmICh0b2dnbGUuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICAgIHRvZ2dsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB0b2dnbGUuc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICBuYXZpZ2F0aW9uX3N1Yi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2dnbGUuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgICB0b2dnbGUuc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCAndHJ1ZScpO1xuICAgICAgICAgIG5hdmlnYXRpb25fc3ViLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZV9zaXplX2NoYW5nZShlKSB7XG4gICAgICAgIGlmIChlLm1hdGNoZXMpIHtcbiAgICAgICAgICB0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVfbmF2KTtcbiAgICAgICAgICB0b2dnbGUuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgdG9nZ2xlLnNldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgdG9nZ2xlLnNldEF0dHJpYnV0ZSgncm9sZScsICdidXR0b24nKTtcbiAgICAgICAgICBuYXZpZ2F0aW9uX3N1Yi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2dnbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVfbmF2KTtcbiAgICAgICAgICB0b2dnbGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJyk7XG4gICAgICAgICAgdG9nZ2xlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJyk7XG4gICAgICAgICAgdG9nZ2xlLnJlbW92ZUF0dHJpYnV0ZSgncm9sZScpO1xuICAgICAgICAgIG5hdmlnYXRpb25fc3ViLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZWdpc3RlciBldmVudCBsaXN0ZW5lclxuICAgICAgLy8gSW5jbHVkZXMgZmFsbGJhY2sgZm9yIFNhZmFyaSA8MTRcbiAgICAgIGlmIChtZWRpYVF1ZXJ5TGlzdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIG1lZGlhUXVlcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZV9zaXplX2NoYW5nZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZWRpYVF1ZXJ5TGlzdC5hZGRMaXN0ZW5lcihoYW5kbGVfc2l6ZV9jaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbml0aWFsIGNoZWNrXG4gICAgICBoYW5kbGVfc2l6ZV9jaGFuZ2UobWVkaWFRdWVyeUxpc3QpO1xuICAgIH1cbiAgfSxcbn07XG5cbmV4cG9ydCB7IE5hdlNlY29uZGFyeSB9O1xuIiwiY29uc3QgT2ZmQ2FudmFzID0ge1xuICBpbml0OiAoKSA9PiB7XG4gICAgY29uc3QgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zaXRlLWhlYWRlcl0nKTtcbiAgICBjb25zdCBtZW51ID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW1lbnVdJyk7XG4gICAgY29uc3QgbWVudV9vcGVuID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW1lbnUtb3Blbl0nKTtcbiAgICBjb25zdCBtZW51X2Nsb3NlID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW1lbnUtY2xvc2VdJyk7XG4gICAgY29uc3QgbWVkaWFRdWVyeUxpc3QgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogNjMuOTM3NWVtKScpO1xuXG4gICAgZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcbiAgICAgIG1lbnVfb3Blbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnc2l0ZS1oZWFkZXItLW9wZW5lZCcpO1xuICAgICAgICBtZW51LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgaHRtbC5jbGFzc0xpc3QuYWRkKCduby1zY3JvbGwnKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIG1lbnVfY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NpdGUtaGVhZGVyLS1vcGVuZWQnKTtcbiAgICAgICAgbWVudS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCduby1zY3JvbGwnKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlX3NpemVfY2hhbmdlKGUpIHtcbiAgICAgIGlmIChlLm1hdGNoZXMpIHtcbiAgICAgICAgbWVudS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgdG9nZ2xlTWVudSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVudS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdzaXRlLWhlYWRlci0tb3BlbmVkJyk7XG4gICAgICAgIGh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJcbiAgICAvLyBJbmNsdWRlcyBmYWxsYmFjayBmb3IgU2FmYXJpIDwxNFxuICAgIGlmIChtZWRpYVF1ZXJ5TGlzdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICBtZWRpYVF1ZXJ5TGlzdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBoYW5kbGVfc2l6ZV9jaGFuZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZWRpYVF1ZXJ5TGlzdC5hZGRMaXN0ZW5lcihoYW5kbGVfc2l6ZV9jaGFuZ2UpO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWwgY2hlY2tcbiAgICBoYW5kbGVfc2l6ZV9jaGFuZ2UobWVkaWFRdWVyeUxpc3QpO1xuICB9LFxufTtcblxuZXhwb3J0IHsgT2ZmQ2FudmFzIH07XG4iLCJjb25zdCBTdGlja3lTY3JvbGwgPSB7XG4gIGluaXQ6ICgpID0+IHtcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuICAgIGNvbnN0IHNjcm9sbF9vZmZzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zY3JvbGwtb2Zmc2V0XScpO1xuICAgIGNvbnN0IHNpdGVfaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2l0ZS1oZWFkZXJdJyk7XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihcbiAgICAgIChbZV0pID0+XG4gICAgICAgIHNpdGVfaGVhZGVyLmNsYXNzTGlzdC50b2dnbGUoXG4gICAgICAgICAgJ3NpdGUtaGVhZGVyLS1zdHVjaycsXG4gICAgICAgICAgZS5pbnRlcnNlY3Rpb25SYXRpbyA8IDFcbiAgICAgICAgKSxcbiAgICAgIHsgdGhyZXNob2xkOiBbMV0gfVxuICAgICk7XG5cbiAgICBpZiAoIWJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdob21lJykpIHJldHVybjtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHNjcm9sbF9vZmZzZXQpO1xuICB9LFxufTtcblxuZXhwb3J0IHsgU3RpY2t5U2Nyb2xsIH07XG4iLCJpbXBvcnQgJ2RldGFpbHMtcG9seWZpbGwnO1xuaW1wb3J0ICdmb2N1cy12aXNpYmxlJztcbmltcG9ydCB7IE5hdlNlY29uZGFyeSB9IGZyb20gJy4vbmF2LXNlY29uZGFyeSc7XG5pbXBvcnQgeyBPZmZDYW52YXMgfSBmcm9tICcuL29mZi1jYW52YXMnO1xuaW1wb3J0IHsgU3RpY2t5U2Nyb2xsIH0gZnJvbSAnLi9zdGlja3ktc2Nyb2xsJztcblxuTmF2U2Vjb25kYXJ5LmluaXQoKTtcbk9mZkNhbnZhcy5pbml0KCk7XG5TdGlja3lTY3JvbGwuaW5pdCgpO1xuIl0sIm5hbWVzIjpbInRoaXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
