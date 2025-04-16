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

	/**
	 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.9
	 * Copyright (C) 2020 Oliver Nightingale
	 * @license MIT
	 */

	var lunr = createCommonjsModule(function (module, exports) {
	(function(){

	/**
	 * A convenience function for configuring and constructing
	 * a new lunr Index.
	 *
	 * A lunr.Builder instance is created and the pipeline setup
	 * with a trimmer, stop word filter and stemmer.
	 *
	 * This builder object is yielded to the configuration function
	 * that is passed as a parameter, allowing the list of fields
	 * and other builder parameters to be customised.
	 *
	 * All documents _must_ be added within the passed config function.
	 *
	 * @example
	 * var idx = lunr(function () {
	 *   this.field('title')
	 *   this.field('body')
	 *   this.ref('id')
	 *
	 *   documents.forEach(function (doc) {
	 *     this.add(doc)
	 *   }, this)
	 * })
	 *
	 * @see {@link lunr.Builder}
	 * @see {@link lunr.Pipeline}
	 * @see {@link lunr.trimmer}
	 * @see {@link lunr.stopWordFilter}
	 * @see {@link lunr.stemmer}
	 * @namespace {function} lunr
	 */
	var lunr = function (config) {
	  var builder = new lunr.Builder;

	  builder.pipeline.add(
	    lunr.trimmer,
	    lunr.stopWordFilter,
	    lunr.stemmer
	  );

	  builder.searchPipeline.add(
	    lunr.stemmer
	  );

	  config.call(builder, builder);
	  return builder.build()
	};

	lunr.version = "2.3.9";
	/*!
	 * lunr.utils
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * A namespace containing utils for the rest of the lunr library
	 * @namespace lunr.utils
	 */
	lunr.utils = {};

	/**
	 * Print a warning message to the console.
	 *
	 * @param {String} message The message to be printed.
	 * @memberOf lunr.utils
	 * @function
	 */
	lunr.utils.warn = (function (global) {
	  /* eslint-disable no-console */
	  return function (message) {
	    if (global.console && console.warn) {
	      console.warn(message);
	    }
	  }
	  /* eslint-enable no-console */
	})(this);

	/**
	 * Convert an object to a string.
	 *
	 * In the case of `null` and `undefined` the function returns
	 * the empty string, in all other cases the result of calling
	 * `toString` on the passed object is returned.
	 *
	 * @param {Any} obj The object to convert to a string.
	 * @return {String} string representation of the passed object.
	 * @memberOf lunr.utils
	 */
	lunr.utils.asString = function (obj) {
	  if (obj === void 0 || obj === null) {
	    return ""
	  } else {
	    return obj.toString()
	  }
	};

	/**
	 * Clones an object.
	 *
	 * Will create a copy of an existing object such that any mutations
	 * on the copy cannot affect the original.
	 *
	 * Only shallow objects are supported, passing a nested object to this
	 * function will cause a TypeError.
	 *
	 * Objects with primitives, and arrays of primitives are supported.
	 *
	 * @param {Object} obj The object to clone.
	 * @return {Object} a clone of the passed object.
	 * @throws {TypeError} when a nested object is passed.
	 * @memberOf Utils
	 */
	lunr.utils.clone = function (obj) {
	  if (obj === null || obj === undefined) {
	    return obj
	  }

	  var clone = Object.create(null),
	      keys = Object.keys(obj);

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i],
	        val = obj[key];

	    if (Array.isArray(val)) {
	      clone[key] = val.slice();
	      continue
	    }

	    if (typeof val === 'string' ||
	        typeof val === 'number' ||
	        typeof val === 'boolean') {
	      clone[key] = val;
	      continue
	    }

	    throw new TypeError("clone is not deep and does not support nested objects")
	  }

	  return clone
	};
	lunr.FieldRef = function (docRef, fieldName, stringValue) {
	  this.docRef = docRef;
	  this.fieldName = fieldName;
	  this._stringValue = stringValue;
	};

	lunr.FieldRef.joiner = "/";

	lunr.FieldRef.fromString = function (s) {
	  var n = s.indexOf(lunr.FieldRef.joiner);

	  if (n === -1) {
	    throw "malformed field ref string"
	  }

	  var fieldRef = s.slice(0, n),
	      docRef = s.slice(n + 1);

	  return new lunr.FieldRef (docRef, fieldRef, s)
	};

	lunr.FieldRef.prototype.toString = function () {
	  if (this._stringValue == undefined) {
	    this._stringValue = this.fieldName + lunr.FieldRef.joiner + this.docRef;
	  }

	  return this._stringValue
	};
	/*!
	 * lunr.Set
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * A lunr set.
	 *
	 * @constructor
	 */
	lunr.Set = function (elements) {
	  this.elements = Object.create(null);

	  if (elements) {
	    this.length = elements.length;

	    for (var i = 0; i < this.length; i++) {
	      this.elements[elements[i]] = true;
	    }
	  } else {
	    this.length = 0;
	  }
	};

	/**
	 * A complete set that contains all elements.
	 *
	 * @static
	 * @readonly
	 * @type {lunr.Set}
	 */
	lunr.Set.complete = {
	  intersect: function (other) {
	    return other
	  },

	  union: function () {
	    return this
	  },

	  contains: function () {
	    return true
	  }
	};

	/**
	 * An empty set that contains no elements.
	 *
	 * @static
	 * @readonly
	 * @type {lunr.Set}
	 */
	lunr.Set.empty = {
	  intersect: function () {
	    return this
	  },

	  union: function (other) {
	    return other
	  },

	  contains: function () {
	    return false
	  }
	};

	/**
	 * Returns true if this set contains the specified object.
	 *
	 * @param {object} object - Object whose presence in this set is to be tested.
	 * @returns {boolean} - True if this set contains the specified object.
	 */
	lunr.Set.prototype.contains = function (object) {
	  return !!this.elements[object]
	};

	/**
	 * Returns a new set containing only the elements that are present in both
	 * this set and the specified set.
	 *
	 * @param {lunr.Set} other - set to intersect with this set.
	 * @returns {lunr.Set} a new set that is the intersection of this and the specified set.
	 */

	lunr.Set.prototype.intersect = function (other) {
	  var a, b, elements, intersection = [];

	  if (other === lunr.Set.complete) {
	    return this
	  }

	  if (other === lunr.Set.empty) {
	    return other
	  }

	  if (this.length < other.length) {
	    a = this;
	    b = other;
	  } else {
	    a = other;
	    b = this;
	  }

	  elements = Object.keys(a.elements);

	  for (var i = 0; i < elements.length; i++) {
	    var element = elements[i];
	    if (element in b.elements) {
	      intersection.push(element);
	    }
	  }

	  return new lunr.Set (intersection)
	};

	/**
	 * Returns a new set combining the elements of this and the specified set.
	 *
	 * @param {lunr.Set} other - set to union with this set.
	 * @return {lunr.Set} a new set that is the union of this and the specified set.
	 */

	lunr.Set.prototype.union = function (other) {
	  if (other === lunr.Set.complete) {
	    return lunr.Set.complete
	  }

	  if (other === lunr.Set.empty) {
	    return this
	  }

	  return new lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)))
	};
	/**
	 * A function to calculate the inverse document frequency for
	 * a posting. This is shared between the builder and the index
	 *
	 * @private
	 * @param {object} posting - The posting for a given term
	 * @param {number} documentCount - The total number of documents.
	 */
	lunr.idf = function (posting, documentCount) {
	  var documentsWithTerm = 0;

	  for (var fieldName in posting) {
	    if (fieldName == '_index') continue // Ignore the term index, its not a field
	    documentsWithTerm += Object.keys(posting[fieldName]).length;
	  }

	  var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5);

	  return Math.log(1 + Math.abs(x))
	};

	/**
	 * A token wraps a string representation of a token
	 * as it is passed through the text processing pipeline.
	 *
	 * @constructor
	 * @param {string} [str=''] - The string token being wrapped.
	 * @param {object} [metadata={}] - Metadata associated with this token.
	 */
	lunr.Token = function (str, metadata) {
	  this.str = str || "";
	  this.metadata = metadata || {};
	};

	/**
	 * Returns the token string that is being wrapped by this object.
	 *
	 * @returns {string}
	 */
	lunr.Token.prototype.toString = function () {
	  return this.str
	};

	/**
	 * A token update function is used when updating or optionally
	 * when cloning a token.
	 *
	 * @callback lunr.Token~updateFunction
	 * @param {string} str - The string representation of the token.
	 * @param {Object} metadata - All metadata associated with this token.
	 */

	/**
	 * Applies the given function to the wrapped string token.
	 *
	 * @example
	 * token.update(function (str, metadata) {
	 *   return str.toUpperCase()
	 * })
	 *
	 * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.
	 * @returns {lunr.Token}
	 */
	lunr.Token.prototype.update = function (fn) {
	  this.str = fn(this.str, this.metadata);
	  return this
	};

	/**
	 * Creates a clone of this token. Optionally a function can be
	 * applied to the cloned token.
	 *
	 * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.
	 * @returns {lunr.Token}
	 */
	lunr.Token.prototype.clone = function (fn) {
	  fn = fn || function (s) { return s };
	  return new lunr.Token (fn(this.str, this.metadata), this.metadata)
	};
	/*!
	 * lunr.tokenizer
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * A function for splitting a string into tokens ready to be inserted into
	 * the search index. Uses `lunr.tokenizer.separator` to split strings, change
	 * the value of this property to change how strings are split into tokens.
	 *
	 * This tokenizer will convert its parameter to a string by calling `toString` and
	 * then will split this string on the character in `lunr.tokenizer.separator`.
	 * Arrays will have their elements converted to strings and wrapped in a lunr.Token.
	 *
	 * Optional metadata can be passed to the tokenizer, this metadata will be cloned and
	 * added as metadata to every token that is created from the object to be tokenized.
	 *
	 * @static
	 * @param {?(string|object|object[])} obj - The object to convert into tokens
	 * @param {?object} metadata - Optional metadata to associate with every token
	 * @returns {lunr.Token[]}
	 * @see {@link lunr.Pipeline}
	 */
	lunr.tokenizer = function (obj, metadata) {
	  if (obj == null || obj == undefined) {
	    return []
	  }

	  if (Array.isArray(obj)) {
	    return obj.map(function (t) {
	      return new lunr.Token(
	        lunr.utils.asString(t).toLowerCase(),
	        lunr.utils.clone(metadata)
	      )
	    })
	  }

	  var str = obj.toString().toLowerCase(),
	      len = str.length,
	      tokens = [];

	  for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {
	    var char = str.charAt(sliceEnd),
	        sliceLength = sliceEnd - sliceStart;

	    if ((char.match(lunr.tokenizer.separator) || sliceEnd == len)) {

	      if (sliceLength > 0) {
	        var tokenMetadata = lunr.utils.clone(metadata) || {};
	        tokenMetadata["position"] = [sliceStart, sliceLength];
	        tokenMetadata["index"] = tokens.length;

	        tokens.push(
	          new lunr.Token (
	            str.slice(sliceStart, sliceEnd),
	            tokenMetadata
	          )
	        );
	      }

	      sliceStart = sliceEnd + 1;
	    }

	  }

	  return tokens
	};

	/**
	 * The separator used to split a string into tokens. Override this property to change the behaviour of
	 * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
	 *
	 * @static
	 * @see lunr.tokenizer
	 */
	lunr.tokenizer.separator = /[\s\-]+/;
	/*!
	 * lunr.Pipeline
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * lunr.Pipelines maintain an ordered list of functions to be applied to all
	 * tokens in documents entering the search index and queries being ran against
	 * the index.
	 *
	 * An instance of lunr.Index created with the lunr shortcut will contain a
	 * pipeline with a stop word filter and an English language stemmer. Extra
	 * functions can be added before or after either of these functions or these
	 * default functions can be removed.
	 *
	 * When run the pipeline will call each function in turn, passing a token, the
	 * index of that token in the original list of all tokens and finally a list of
	 * all the original tokens.
	 *
	 * The output of functions in the pipeline will be passed to the next function
	 * in the pipeline. To exclude a token from entering the index the function
	 * should return undefined, the rest of the pipeline will not be called with
	 * this token.
	 *
	 * For serialisation of pipelines to work, all functions used in an instance of
	 * a pipeline should be registered with lunr.Pipeline. Registered functions can
	 * then be loaded. If trying to load a serialised pipeline that uses functions
	 * that are not registered an error will be thrown.
	 *
	 * If not planning on serialising the pipeline then registering pipeline functions
	 * is not necessary.
	 *
	 * @constructor
	 */
	lunr.Pipeline = function () {
	  this._stack = [];
	};

	lunr.Pipeline.registeredFunctions = Object.create(null);

	/**
	 * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token
	 * string as well as all known metadata. A pipeline function can mutate the token string
	 * or mutate (or add) metadata for a given token.
	 *
	 * A pipeline function can indicate that the passed token should be discarded by returning
	 * null, undefined or an empty string. This token will not be passed to any downstream pipeline
	 * functions and will not be added to the index.
	 *
	 * Multiple tokens can be returned by returning an array of tokens. Each token will be passed
	 * to any downstream pipeline functions and all will returned tokens will be added to the index.
	 *
	 * Any number of pipeline functions may be chained together using a lunr.Pipeline.
	 *
	 * @interface lunr.PipelineFunction
	 * @param {lunr.Token} token - A token from the document being processed.
	 * @param {number} i - The index of this token in the complete list of tokens for this document/field.
	 * @param {lunr.Token[]} tokens - All tokens for this document/field.
	 * @returns {(?lunr.Token|lunr.Token[])}
	 */

	/**
	 * Register a function with the pipeline.
	 *
	 * Functions that are used in the pipeline should be registered if the pipeline
	 * needs to be serialised, or a serialised pipeline needs to be loaded.
	 *
	 * Registering a function does not add it to a pipeline, functions must still be
	 * added to instances of the pipeline for them to be used when running a pipeline.
	 *
	 * @param {lunr.PipelineFunction} fn - The function to check for.
	 * @param {String} label - The label to register this function with
	 */
	lunr.Pipeline.registerFunction = function (fn, label) {
	  if (label in this.registeredFunctions) {
	    lunr.utils.warn('Overwriting existing registered function: ' + label);
	  }

	  fn.label = label;
	  lunr.Pipeline.registeredFunctions[fn.label] = fn;
	};

	/**
	 * Warns if the function is not registered as a Pipeline function.
	 *
	 * @param {lunr.PipelineFunction} fn - The function to check for.
	 * @private
	 */
	lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
	  var isRegistered = fn.label && (fn.label in this.registeredFunctions);

	  if (!isRegistered) {
	    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn);
	  }
	};

	/**
	 * Loads a previously serialised pipeline.
	 *
	 * All functions to be loaded must already be registered with lunr.Pipeline.
	 * If any function from the serialised data has not been registered then an
	 * error will be thrown.
	 *
	 * @param {Object} serialised - The serialised pipeline to load.
	 * @returns {lunr.Pipeline}
	 */
	lunr.Pipeline.load = function (serialised) {
	  var pipeline = new lunr.Pipeline;

	  serialised.forEach(function (fnName) {
	    var fn = lunr.Pipeline.registeredFunctions[fnName];

	    if (fn) {
	      pipeline.add(fn);
	    } else {
	      throw new Error('Cannot load unregistered function: ' + fnName)
	    }
	  });

	  return pipeline
	};

	/**
	 * Adds new functions to the end of the pipeline.
	 *
	 * Logs a warning if the function has not been registered.
	 *
	 * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.
	 */
	lunr.Pipeline.prototype.add = function () {
	  var fns = Array.prototype.slice.call(arguments);

	  fns.forEach(function (fn) {
	    lunr.Pipeline.warnIfFunctionNotRegistered(fn);
	    this._stack.push(fn);
	  }, this);
	};

	/**
	 * Adds a single function after a function that already exists in the
	 * pipeline.
	 *
	 * Logs a warning if the function has not been registered.
	 *
	 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
	 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
	 */
	lunr.Pipeline.prototype.after = function (existingFn, newFn) {
	  lunr.Pipeline.warnIfFunctionNotRegistered(newFn);

	  var pos = this._stack.indexOf(existingFn);
	  if (pos == -1) {
	    throw new Error('Cannot find existingFn')
	  }

	  pos = pos + 1;
	  this._stack.splice(pos, 0, newFn);
	};

	/**
	 * Adds a single function before a function that already exists in the
	 * pipeline.
	 *
	 * Logs a warning if the function has not been registered.
	 *
	 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
	 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
	 */
	lunr.Pipeline.prototype.before = function (existingFn, newFn) {
	  lunr.Pipeline.warnIfFunctionNotRegistered(newFn);

	  var pos = this._stack.indexOf(existingFn);
	  if (pos == -1) {
	    throw new Error('Cannot find existingFn')
	  }

	  this._stack.splice(pos, 0, newFn);
	};

	/**
	 * Removes a function from the pipeline.
	 *
	 * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.
	 */
	lunr.Pipeline.prototype.remove = function (fn) {
	  var pos = this._stack.indexOf(fn);
	  if (pos == -1) {
	    return
	  }

	  this._stack.splice(pos, 1);
	};

	/**
	 * Runs the current list of functions that make up the pipeline against the
	 * passed tokens.
	 *
	 * @param {Array} tokens The tokens to run through the pipeline.
	 * @returns {Array}
	 */
	lunr.Pipeline.prototype.run = function (tokens) {
	  var stackLength = this._stack.length;

	  for (var i = 0; i < stackLength; i++) {
	    var fn = this._stack[i];
	    var memo = [];

	    for (var j = 0; j < tokens.length; j++) {
	      var result = fn(tokens[j], j, tokens);

	      if (result === null || result === void 0 || result === '') continue

	      if (Array.isArray(result)) {
	        for (var k = 0; k < result.length; k++) {
	          memo.push(result[k]);
	        }
	      } else {
	        memo.push(result);
	      }
	    }

	    tokens = memo;
	  }

	  return tokens
	};

	/**
	 * Convenience method for passing a string through a pipeline and getting
	 * strings out. This method takes care of wrapping the passed string in a
	 * token and mapping the resulting tokens back to strings.
	 *
	 * @param {string} str - The string to pass through the pipeline.
	 * @param {?object} metadata - Optional metadata to associate with the token
	 * passed to the pipeline.
	 * @returns {string[]}
	 */
	lunr.Pipeline.prototype.runString = function (str, metadata) {
	  var token = new lunr.Token (str, metadata);

	  return this.run([token]).map(function (t) {
	    return t.toString()
	  })
	};

	/**
	 * Resets the pipeline by removing any existing processors.
	 *
	 */
	lunr.Pipeline.prototype.reset = function () {
	  this._stack = [];
	};

	/**
	 * Returns a representation of the pipeline ready for serialisation.
	 *
	 * Logs a warning if the function has not been registered.
	 *
	 * @returns {Array}
	 */
	lunr.Pipeline.prototype.toJSON = function () {
	  return this._stack.map(function (fn) {
	    lunr.Pipeline.warnIfFunctionNotRegistered(fn);

	    return fn.label
	  })
	};
	/*!
	 * lunr.Vector
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * A vector is used to construct the vector space of documents and queries. These
	 * vectors support operations to determine the similarity between two documents or
	 * a document and a query.
	 *
	 * Normally no parameters are required for initializing a vector, but in the case of
	 * loading a previously dumped vector the raw elements can be provided to the constructor.
	 *
	 * For performance reasons vectors are implemented with a flat array, where an elements
	 * index is immediately followed by its value. E.g. [index, value, index, value]. This
	 * allows the underlying array to be as sparse as possible and still offer decent
	 * performance when being used for vector calculations.
	 *
	 * @constructor
	 * @param {Number[]} [elements] - The flat list of element index and element value pairs.
	 */
	lunr.Vector = function (elements) {
	  this._magnitude = 0;
	  this.elements = elements || [];
	};


	/**
	 * Calculates the position within the vector to insert a given index.
	 *
	 * This is used internally by insert and upsert. If there are duplicate indexes then
	 * the position is returned as if the value for that index were to be updated, but it
	 * is the callers responsibility to check whether there is a duplicate at that index
	 *
	 * @param {Number} insertIdx - The index at which the element should be inserted.
	 * @returns {Number}
	 */
	lunr.Vector.prototype.positionForIndex = function (index) {
	  // For an empty vector the tuple can be inserted at the beginning
	  if (this.elements.length == 0) {
	    return 0
	  }

	  var start = 0,
	      end = this.elements.length / 2,
	      sliceLength = end - start,
	      pivotPoint = Math.floor(sliceLength / 2),
	      pivotIndex = this.elements[pivotPoint * 2];

	  while (sliceLength > 1) {
	    if (pivotIndex < index) {
	      start = pivotPoint;
	    }

	    if (pivotIndex > index) {
	      end = pivotPoint;
	    }

	    if (pivotIndex == index) {
	      break
	    }

	    sliceLength = end - start;
	    pivotPoint = start + Math.floor(sliceLength / 2);
	    pivotIndex = this.elements[pivotPoint * 2];
	  }

	  if (pivotIndex == index) {
	    return pivotPoint * 2
	  }

	  if (pivotIndex > index) {
	    return pivotPoint * 2
	  }

	  if (pivotIndex < index) {
	    return (pivotPoint + 1) * 2
	  }
	};

	/**
	 * Inserts an element at an index within the vector.
	 *
	 * Does not allow duplicates, will throw an error if there is already an entry
	 * for this index.
	 *
	 * @param {Number} insertIdx - The index at which the element should be inserted.
	 * @param {Number} val - The value to be inserted into the vector.
	 */
	lunr.Vector.prototype.insert = function (insertIdx, val) {
	  this.upsert(insertIdx, val, function () {
	    throw "duplicate index"
	  });
	};

	/**
	 * Inserts or updates an existing index within the vector.
	 *
	 * @param {Number} insertIdx - The index at which the element should be inserted.
	 * @param {Number} val - The value to be inserted into the vector.
	 * @param {function} fn - A function that is called for updates, the existing value and the
	 * requested value are passed as arguments
	 */
	lunr.Vector.prototype.upsert = function (insertIdx, val, fn) {
	  this._magnitude = 0;
	  var position = this.positionForIndex(insertIdx);

	  if (this.elements[position] == insertIdx) {
	    this.elements[position + 1] = fn(this.elements[position + 1], val);
	  } else {
	    this.elements.splice(position, 0, insertIdx, val);
	  }
	};

	/**
	 * Calculates the magnitude of this vector.
	 *
	 * @returns {Number}
	 */
	lunr.Vector.prototype.magnitude = function () {
	  if (this._magnitude) return this._magnitude

	  var sumOfSquares = 0,
	      elementsLength = this.elements.length;

	  for (var i = 1; i < elementsLength; i += 2) {
	    var val = this.elements[i];
	    sumOfSquares += val * val;
	  }

	  return this._magnitude = Math.sqrt(sumOfSquares)
	};

	/**
	 * Calculates the dot product of this vector and another vector.
	 *
	 * @param {lunr.Vector} otherVector - The vector to compute the dot product with.
	 * @returns {Number}
	 */
	lunr.Vector.prototype.dot = function (otherVector) {
	  var dotProduct = 0,
	      a = this.elements, b = otherVector.elements,
	      aLen = a.length, bLen = b.length,
	      aVal = 0, bVal = 0,
	      i = 0, j = 0;

	  while (i < aLen && j < bLen) {
	    aVal = a[i], bVal = b[j];
	    if (aVal < bVal) {
	      i += 2;
	    } else if (aVal > bVal) {
	      j += 2;
	    } else if (aVal == bVal) {
	      dotProduct += a[i + 1] * b[j + 1];
	      i += 2;
	      j += 2;
	    }
	  }

	  return dotProduct
	};

	/**
	 * Calculates the similarity between this vector and another vector.
	 *
	 * @param {lunr.Vector} otherVector - The other vector to calculate the
	 * similarity with.
	 * @returns {Number}
	 */
	lunr.Vector.prototype.similarity = function (otherVector) {
	  return this.dot(otherVector) / this.magnitude() || 0
	};

	/**
	 * Converts the vector to an array of the elements within the vector.
	 *
	 * @returns {Number[]}
	 */
	lunr.Vector.prototype.toArray = function () {
	  var output = new Array (this.elements.length / 2);

	  for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {
	    output[j] = this.elements[i];
	  }

	  return output
	};

	/**
	 * A JSON serializable representation of the vector.
	 *
	 * @returns {Number[]}
	 */
	lunr.Vector.prototype.toJSON = function () {
	  return this.elements
	};
	/* eslint-disable */
	/*!
	 * lunr.stemmer
	 * Copyright (C) 2020 Oliver Nightingale
	 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
	 */

	/**
	 * lunr.stemmer is an english language stemmer, this is a JavaScript
	 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
	 *
	 * @static
	 * @implements {lunr.PipelineFunction}
	 * @param {lunr.Token} token - The string to stem
	 * @returns {lunr.Token}
	 * @see {@link lunr.Pipeline}
	 * @function
	 */
	lunr.stemmer = (function(){
	  var step2list = {
	      "ational" : "ate",
	      "tional" : "tion",
	      "enci" : "ence",
	      "anci" : "ance",
	      "izer" : "ize",
	      "bli" : "ble",
	      "alli" : "al",
	      "entli" : "ent",
	      "eli" : "e",
	      "ousli" : "ous",
	      "ization" : "ize",
	      "ation" : "ate",
	      "ator" : "ate",
	      "alism" : "al",
	      "iveness" : "ive",
	      "fulness" : "ful",
	      "ousness" : "ous",
	      "aliti" : "al",
	      "iviti" : "ive",
	      "biliti" : "ble",
	      "logi" : "log"
	    },

	    step3list = {
	      "icate" : "ic",
	      "ative" : "",
	      "alize" : "al",
	      "iciti" : "ic",
	      "ical" : "ic",
	      "ful" : "",
	      "ness" : ""
	    },

	    c = "[^aeiou]",          // consonant
	    v = "[aeiouy]",          // vowel
	    C = c + "[^aeiouy]*",    // consonant sequence
	    V = v + "[aeiou]*",      // vowel sequence

	    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
	    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
	    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
	    s_v = "^(" + C + ")?" + v;                   // vowel in stem

	  var re_mgr0 = new RegExp(mgr0);
	  var re_mgr1 = new RegExp(mgr1);
	  var re_meq1 = new RegExp(meq1);
	  var re_s_v = new RegExp(s_v);

	  var re_1a = /^(.+?)(ss|i)es$/;
	  var re2_1a = /^(.+?)([^s])s$/;
	  var re_1b = /^(.+?)eed$/;
	  var re2_1b = /^(.+?)(ed|ing)$/;
	  var re_1b_2 = /.$/;
	  var re2_1b_2 = /(at|bl|iz)$/;
	  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
	  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

	  var re_1c = /^(.+?[^aeiou])y$/;
	  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

	  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

	  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
	  var re2_4 = /^(.+?)(s|t)(ion)$/;

	  var re_5 = /^(.+?)e$/;
	  var re_5_1 = /ll$/;
	  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

	  var porterStemmer = function porterStemmer(w) {
	    var stem,
	      suffix,
	      firstch,
	      re,
	      re2,
	      re3,
	      re4;

	    if (w.length < 3) { return w; }

	    firstch = w.substr(0,1);
	    if (firstch == "y") {
	      w = firstch.toUpperCase() + w.substr(1);
	    }

	    // Step 1a
	    re = re_1a;
	    re2 = re2_1a;

	    if (re.test(w)) { w = w.replace(re,"$1$2"); }
	    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

	    // Step 1b
	    re = re_1b;
	    re2 = re2_1b;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      re = re_mgr0;
	      if (re.test(fp[1])) {
	        re = re_1b_2;
	        w = w.replace(re,"");
	      }
	    } else if (re2.test(w)) {
	      var fp = re2.exec(w);
	      stem = fp[1];
	      re2 = re_s_v;
	      if (re2.test(stem)) {
	        w = stem;
	        re2 = re2_1b_2;
	        re3 = re3_1b_2;
	        re4 = re4_1b_2;
	        if (re2.test(w)) { w = w + "e"; }
	        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
	        else if (re4.test(w)) { w = w + "e"; }
	      }
	    }

	    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
	    re = re_1c;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      w = stem + "i";
	    }

	    // Step 2
	    re = re_2;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      suffix = fp[2];
	      re = re_mgr0;
	      if (re.test(stem)) {
	        w = stem + step2list[suffix];
	      }
	    }

	    // Step 3
	    re = re_3;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      suffix = fp[2];
	      re = re_mgr0;
	      if (re.test(stem)) {
	        w = stem + step3list[suffix];
	      }
	    }

	    // Step 4
	    re = re_4;
	    re2 = re2_4;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      re = re_mgr1;
	      if (re.test(stem)) {
	        w = stem;
	      }
	    } else if (re2.test(w)) {
	      var fp = re2.exec(w);
	      stem = fp[1] + fp[2];
	      re2 = re_mgr1;
	      if (re2.test(stem)) {
	        w = stem;
	      }
	    }

	    // Step 5
	    re = re_5;
	    if (re.test(w)) {
	      var fp = re.exec(w);
	      stem = fp[1];
	      re = re_mgr1;
	      re2 = re_meq1;
	      re3 = re3_5;
	      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
	        w = stem;
	      }
	    }

	    re = re_5_1;
	    re2 = re_mgr1;
	    if (re.test(w) && re2.test(w)) {
	      re = re_1b_2;
	      w = w.replace(re,"");
	    }

	    // and turn initial Y back to y

	    if (firstch == "y") {
	      w = firstch.toLowerCase() + w.substr(1);
	    }

	    return w;
	  };

	  return function (token) {
	    return token.update(porterStemmer);
	  }
	})();

	lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer');
	/*!
	 * lunr.stopWordFilter
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * lunr.generateStopWordFilter builds a stopWordFilter function from the provided
	 * list of stop words.
	 *
	 * The built in lunr.stopWordFilter is built using this generator and can be used
	 * to generate custom stopWordFilters for applications or non English languages.
	 *
	 * @function
	 * @param {Array} token The token to pass through the filter
	 * @returns {lunr.PipelineFunction}
	 * @see lunr.Pipeline
	 * @see lunr.stopWordFilter
	 */
	lunr.generateStopWordFilter = function (stopWords) {
	  var words = stopWords.reduce(function (memo, stopWord) {
	    memo[stopWord] = stopWord;
	    return memo
	  }, {});

	  return function (token) {
	    if (token && words[token.toString()] !== token.toString()) return token
	  }
	};

	/**
	 * lunr.stopWordFilter is an English language stop word list filter, any words
	 * contained in the list will not be passed through the filter.
	 *
	 * This is intended to be used in the Pipeline. If the token does not pass the
	 * filter then undefined will be returned.
	 *
	 * @function
	 * @implements {lunr.PipelineFunction}
	 * @params {lunr.Token} token - A token to check for being a stop word.
	 * @returns {lunr.Token}
	 * @see {@link lunr.Pipeline}
	 */
	lunr.stopWordFilter = lunr.generateStopWordFilter([
	  'a',
	  'able',
	  'about',
	  'across',
	  'after',
	  'all',
	  'almost',
	  'also',
	  'am',
	  'among',
	  'an',
	  'and',
	  'any',
	  'are',
	  'as',
	  'at',
	  'be',
	  'because',
	  'been',
	  'but',
	  'by',
	  'can',
	  'cannot',
	  'could',
	  'dear',
	  'did',
	  'do',
	  'does',
	  'either',
	  'else',
	  'ever',
	  'every',
	  'for',
	  'from',
	  'get',
	  'got',
	  'had',
	  'has',
	  'have',
	  'he',
	  'her',
	  'hers',
	  'him',
	  'his',
	  'how',
	  'however',
	  'i',
	  'if',
	  'in',
	  'into',
	  'is',
	  'it',
	  'its',
	  'just',
	  'least',
	  'let',
	  'like',
	  'likely',
	  'may',
	  'me',
	  'might',
	  'most',
	  'must',
	  'my',
	  'neither',
	  'no',
	  'nor',
	  'not',
	  'of',
	  'off',
	  'often',
	  'on',
	  'only',
	  'or',
	  'other',
	  'our',
	  'own',
	  'rather',
	  'said',
	  'say',
	  'says',
	  'she',
	  'should',
	  'since',
	  'so',
	  'some',
	  'than',
	  'that',
	  'the',
	  'their',
	  'them',
	  'then',
	  'there',
	  'these',
	  'they',
	  'this',
	  'tis',
	  'to',
	  'too',
	  'twas',
	  'us',
	  'wants',
	  'was',
	  'we',
	  'were',
	  'what',
	  'when',
	  'where',
	  'which',
	  'while',
	  'who',
	  'whom',
	  'why',
	  'will',
	  'with',
	  'would',
	  'yet',
	  'you',
	  'your'
	]);

	lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter');
	/*!
	 * lunr.trimmer
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * lunr.trimmer is a pipeline function for trimming non word
	 * characters from the beginning and end of tokens before they
	 * enter the index.
	 *
	 * This implementation may not work correctly for non latin
	 * characters and should either be removed or adapted for use
	 * with languages with non-latin characters.
	 *
	 * @static
	 * @implements {lunr.PipelineFunction}
	 * @param {lunr.Token} token The token to pass through the filter
	 * @returns {lunr.Token}
	 * @see lunr.Pipeline
	 */
	lunr.trimmer = function (token) {
	  return token.update(function (s) {
	    return s.replace(/^\W+/, '').replace(/\W+$/, '')
	  })
	};

	lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer');
	/*!
	 * lunr.TokenSet
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * A token set is used to store the unique list of all tokens
	 * within an index. Token sets are also used to represent an
	 * incoming query to the index, this query token set and index
	 * token set are then intersected to find which tokens to look
	 * up in the inverted index.
	 *
	 * A token set can hold multiple tokens, as in the case of the
	 * index token set, or it can hold a single token as in the
	 * case of a simple query token set.
	 *
	 * Additionally token sets are used to perform wildcard matching.
	 * Leading, contained and trailing wildcards are supported, and
	 * from this edit distance matching can also be provided.
	 *
	 * Token sets are implemented as a minimal finite state automata,
	 * where both common prefixes and suffixes are shared between tokens.
	 * This helps to reduce the space used for storing the token set.
	 *
	 * @constructor
	 */
	lunr.TokenSet = function () {
	  this.final = false;
	  this.edges = {};
	  this.id = lunr.TokenSet._nextId;
	  lunr.TokenSet._nextId += 1;
	};

	/**
	 * Keeps track of the next, auto increment, identifier to assign
	 * to a new tokenSet.
	 *
	 * TokenSets require a unique identifier to be correctly minimised.
	 *
	 * @private
	 */
	lunr.TokenSet._nextId = 1;

	/**
	 * Creates a TokenSet instance from the given sorted array of words.
	 *
	 * @param {String[]} arr - A sorted array of strings to create the set from.
	 * @returns {lunr.TokenSet}
	 * @throws Will throw an error if the input array is not sorted.
	 */
	lunr.TokenSet.fromArray = function (arr) {
	  var builder = new lunr.TokenSet.Builder;

	  for (var i = 0, len = arr.length; i < len; i++) {
	    builder.insert(arr[i]);
	  }

	  builder.finish();
	  return builder.root
	};

	/**
	 * Creates a token set from a query clause.
	 *
	 * @private
	 * @param {Object} clause - A single clause from lunr.Query.
	 * @param {string} clause.term - The query clause term.
	 * @param {number} [clause.editDistance] - The optional edit distance for the term.
	 * @returns {lunr.TokenSet}
	 */
	lunr.TokenSet.fromClause = function (clause) {
	  if ('editDistance' in clause) {
	    return lunr.TokenSet.fromFuzzyString(clause.term, clause.editDistance)
	  } else {
	    return lunr.TokenSet.fromString(clause.term)
	  }
	};

	/**
	 * Creates a token set representing a single string with a specified
	 * edit distance.
	 *
	 * Insertions, deletions, substitutions and transpositions are each
	 * treated as an edit distance of 1.
	 *
	 * Increasing the allowed edit distance will have a dramatic impact
	 * on the performance of both creating and intersecting these TokenSets.
	 * It is advised to keep the edit distance less than 3.
	 *
	 * @param {string} str - The string to create the token set from.
	 * @param {number} editDistance - The allowed edit distance to match.
	 * @returns {lunr.Vector}
	 */
	lunr.TokenSet.fromFuzzyString = function (str, editDistance) {
	  var root = new lunr.TokenSet;

	  var stack = [{
	    node: root,
	    editsRemaining: editDistance,
	    str: str
	  }];

	  while (stack.length) {
	    var frame = stack.pop();

	    // no edit
	    if (frame.str.length > 0) {
	      var char = frame.str.charAt(0),
	          noEditNode;

	      if (char in frame.node.edges) {
	        noEditNode = frame.node.edges[char];
	      } else {
	        noEditNode = new lunr.TokenSet;
	        frame.node.edges[char] = noEditNode;
	      }

	      if (frame.str.length == 1) {
	        noEditNode.final = true;
	      }

	      stack.push({
	        node: noEditNode,
	        editsRemaining: frame.editsRemaining,
	        str: frame.str.slice(1)
	      });
	    }

	    if (frame.editsRemaining == 0) {
	      continue
	    }

	    // insertion
	    if ("*" in frame.node.edges) {
	      var insertionNode = frame.node.edges["*"];
	    } else {
	      var insertionNode = new lunr.TokenSet;
	      frame.node.edges["*"] = insertionNode;
	    }

	    if (frame.str.length == 0) {
	      insertionNode.final = true;
	    }

	    stack.push({
	      node: insertionNode,
	      editsRemaining: frame.editsRemaining - 1,
	      str: frame.str
	    });

	    // deletion
	    // can only do a deletion if we have enough edits remaining
	    // and if there are characters left to delete in the string
	    if (frame.str.length > 1) {
	      stack.push({
	        node: frame.node,
	        editsRemaining: frame.editsRemaining - 1,
	        str: frame.str.slice(1)
	      });
	    }

	    // deletion
	    // just removing the last character from the str
	    if (frame.str.length == 1) {
	      frame.node.final = true;
	    }

	    // substitution
	    // can only do a substitution if we have enough edits remaining
	    // and if there are characters left to substitute
	    if (frame.str.length >= 1) {
	      if ("*" in frame.node.edges) {
	        var substitutionNode = frame.node.edges["*"];
	      } else {
	        var substitutionNode = new lunr.TokenSet;
	        frame.node.edges["*"] = substitutionNode;
	      }

	      if (frame.str.length == 1) {
	        substitutionNode.final = true;
	      }

	      stack.push({
	        node: substitutionNode,
	        editsRemaining: frame.editsRemaining - 1,
	        str: frame.str.slice(1)
	      });
	    }

	    // transposition
	    // can only do a transposition if there are edits remaining
	    // and there are enough characters to transpose
	    if (frame.str.length > 1) {
	      var charA = frame.str.charAt(0),
	          charB = frame.str.charAt(1),
	          transposeNode;

	      if (charB in frame.node.edges) {
	        transposeNode = frame.node.edges[charB];
	      } else {
	        transposeNode = new lunr.TokenSet;
	        frame.node.edges[charB] = transposeNode;
	      }

	      if (frame.str.length == 1) {
	        transposeNode.final = true;
	      }

	      stack.push({
	        node: transposeNode,
	        editsRemaining: frame.editsRemaining - 1,
	        str: charA + frame.str.slice(2)
	      });
	    }
	  }

	  return root
	};

	/**
	 * Creates a TokenSet from a string.
	 *
	 * The string may contain one or more wildcard characters (*)
	 * that will allow wildcard matching when intersecting with
	 * another TokenSet.
	 *
	 * @param {string} str - The string to create a TokenSet from.
	 * @returns {lunr.TokenSet}
	 */
	lunr.TokenSet.fromString = function (str) {
	  var node = new lunr.TokenSet,
	      root = node;

	  /*
	   * Iterates through all characters within the passed string
	   * appending a node for each character.
	   *
	   * When a wildcard character is found then a self
	   * referencing edge is introduced to continually match
	   * any number of any characters.
	   */
	  for (var i = 0, len = str.length; i < len; i++) {
	    var char = str[i],
	        final = (i == len - 1);

	    if (char == "*") {
	      node.edges[char] = node;
	      node.final = final;

	    } else {
	      var next = new lunr.TokenSet;
	      next.final = final;

	      node.edges[char] = next;
	      node = next;
	    }
	  }

	  return root
	};

	/**
	 * Converts this TokenSet into an array of strings
	 * contained within the TokenSet.
	 *
	 * This is not intended to be used on a TokenSet that
	 * contains wildcards, in these cases the results are
	 * undefined and are likely to cause an infinite loop.
	 *
	 * @returns {string[]}
	 */
	lunr.TokenSet.prototype.toArray = function () {
	  var words = [];

	  var stack = [{
	    prefix: "",
	    node: this
	  }];

	  while (stack.length) {
	    var frame = stack.pop(),
	        edges = Object.keys(frame.node.edges),
	        len = edges.length;

	    if (frame.node.final) {
	      /* In Safari, at this point the prefix is sometimes corrupted, see:
	       * https://github.com/olivernn/lunr.js/issues/279 Calling any
	       * String.prototype method forces Safari to "cast" this string to what
	       * it's supposed to be, fixing the bug. */
	      frame.prefix.charAt(0);
	      words.push(frame.prefix);
	    }

	    for (var i = 0; i < len; i++) {
	      var edge = edges[i];

	      stack.push({
	        prefix: frame.prefix.concat(edge),
	        node: frame.node.edges[edge]
	      });
	    }
	  }

	  return words
	};

	/**
	 * Generates a string representation of a TokenSet.
	 *
	 * This is intended to allow TokenSets to be used as keys
	 * in objects, largely to aid the construction and minimisation
	 * of a TokenSet. As such it is not designed to be a human
	 * friendly representation of the TokenSet.
	 *
	 * @returns {string}
	 */
	lunr.TokenSet.prototype.toString = function () {
	  // NOTE: Using Object.keys here as this.edges is very likely
	  // to enter 'hash-mode' with many keys being added
	  //
	  // avoiding a for-in loop here as it leads to the function
	  // being de-optimised (at least in V8). From some simple
	  // benchmarks the performance is comparable, but allowing
	  // V8 to optimize may mean easy performance wins in the future.

	  if (this._str) {
	    return this._str
	  }

	  var str = this.final ? '1' : '0',
	      labels = Object.keys(this.edges).sort(),
	      len = labels.length;

	  for (var i = 0; i < len; i++) {
	    var label = labels[i],
	        node = this.edges[label];

	    str = str + label + node.id;
	  }

	  return str
	};

	/**
	 * Returns a new TokenSet that is the intersection of
	 * this TokenSet and the passed TokenSet.
	 *
	 * This intersection will take into account any wildcards
	 * contained within the TokenSet.
	 *
	 * @param {lunr.TokenSet} b - An other TokenSet to intersect with.
	 * @returns {lunr.TokenSet}
	 */
	lunr.TokenSet.prototype.intersect = function (b) {
	  var output = new lunr.TokenSet,
	      frame = undefined;

	  var stack = [{
	    qNode: b,
	    output: output,
	    node: this
	  }];

	  while (stack.length) {
	    frame = stack.pop();

	    // NOTE: As with the #toString method, we are using
	    // Object.keys and a for loop instead of a for-in loop
	    // as both of these objects enter 'hash' mode, causing
	    // the function to be de-optimised in V8
	    var qEdges = Object.keys(frame.qNode.edges),
	        qLen = qEdges.length,
	        nEdges = Object.keys(frame.node.edges),
	        nLen = nEdges.length;

	    for (var q = 0; q < qLen; q++) {
	      var qEdge = qEdges[q];

	      for (var n = 0; n < nLen; n++) {
	        var nEdge = nEdges[n];

	        if (nEdge == qEdge || qEdge == '*') {
	          var node = frame.node.edges[nEdge],
	              qNode = frame.qNode.edges[qEdge],
	              final = node.final && qNode.final,
	              next = undefined;

	          if (nEdge in frame.output.edges) {
	            // an edge already exists for this character
	            // no need to create a new node, just set the finality
	            // bit unless this node is already final
	            next = frame.output.edges[nEdge];
	            next.final = next.final || final;

	          } else {
	            // no edge exists yet, must create one
	            // set the finality bit and insert it
	            // into the output
	            next = new lunr.TokenSet;
	            next.final = final;
	            frame.output.edges[nEdge] = next;
	          }

	          stack.push({
	            qNode: qNode,
	            output: next,
	            node: node
	          });
	        }
	      }
	    }
	  }

	  return output
	};
	lunr.TokenSet.Builder = function () {
	  this.previousWord = "";
	  this.root = new lunr.TokenSet;
	  this.uncheckedNodes = [];
	  this.minimizedNodes = {};
	};

	lunr.TokenSet.Builder.prototype.insert = function (word) {
	  var node,
	      commonPrefix = 0;

	  if (word < this.previousWord) {
	    throw new Error ("Out of order word insertion")
	  }

	  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
	    if (word[i] != this.previousWord[i]) break
	    commonPrefix++;
	  }

	  this.minimize(commonPrefix);

	  if (this.uncheckedNodes.length == 0) {
	    node = this.root;
	  } else {
	    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child;
	  }

	  for (var i = commonPrefix; i < word.length; i++) {
	    var nextNode = new lunr.TokenSet,
	        char = word[i];

	    node.edges[char] = nextNode;

	    this.uncheckedNodes.push({
	      parent: node,
	      char: char,
	      child: nextNode
	    });

	    node = nextNode;
	  }

	  node.final = true;
	  this.previousWord = word;
	};

	lunr.TokenSet.Builder.prototype.finish = function () {
	  this.minimize(0);
	};

	lunr.TokenSet.Builder.prototype.minimize = function (downTo) {
	  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
	    var node = this.uncheckedNodes[i],
	        childKey = node.child.toString();

	    if (childKey in this.minimizedNodes) {
	      node.parent.edges[node.char] = this.minimizedNodes[childKey];
	    } else {
	      // Cache the key for this node since
	      // we know it can't change anymore
	      node.child._str = childKey;

	      this.minimizedNodes[childKey] = node.child;
	    }

	    this.uncheckedNodes.pop();
	  }
	};
	/*!
	 * lunr.Index
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * An index contains the built index of all documents and provides a query interface
	 * to the index.
	 *
	 * Usually instances of lunr.Index will not be created using this constructor, instead
	 * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be
	 * used to load previously built and serialized indexes.
	 *
	 * @constructor
	 * @param {Object} attrs - The attributes of the built search index.
	 * @param {Object} attrs.invertedIndex - An index of term/field to document reference.
	 * @param {Object<string, lunr.Vector>} attrs.fieldVectors - Field vectors
	 * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.
	 * @param {string[]} attrs.fields - The names of indexed document fields.
	 * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.
	 */
	lunr.Index = function (attrs) {
	  this.invertedIndex = attrs.invertedIndex;
	  this.fieldVectors = attrs.fieldVectors;
	  this.tokenSet = attrs.tokenSet;
	  this.fields = attrs.fields;
	  this.pipeline = attrs.pipeline;
	};

	/**
	 * A result contains details of a document matching a search query.
	 * @typedef {Object} lunr.Index~Result
	 * @property {string} ref - The reference of the document this result represents.
	 * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.
	 * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.
	 */

	/**
	 * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple
	 * query language which itself is parsed into an instance of lunr.Query.
	 *
	 * For programmatically building queries it is advised to directly use lunr.Query, the query language
	 * is best used for human entered text rather than program generated text.
	 *
	 * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported
	 * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'
	 * or 'world', though those that contain both will rank higher in the results.
	 *
	 * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can
	 * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding
	 * wildcards will increase the number of documents that will be found but can also have a negative
	 * impact on query performance, especially with wildcards at the beginning of a term.
	 *
	 * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term
	 * hello in the title field will match this query. Using a field not present in the index will lead
	 * to an error being thrown.
	 *
	 * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term
	 * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported
	 * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.
	 * Avoid large values for edit distance to improve query performance.
	 *
	 * Each term also supports a presence modifier. By default a term's presence in document is optional, however
	 * this can be changed to either required or prohibited. For a term's presence to be required in a document the
	 * term should be prefixed with a '+', e.g. `+foo bar` is a search for documents that must contain 'foo' and
	 * optionally contain 'bar'. Conversely a leading '-' sets the terms presence to prohibited, i.e. it must not
	 * appear in a document, e.g. `-foo bar` is a search for documents that do not contain 'foo' but may contain 'bar'.
	 *
	 * To escape special characters the backslash character '\' can be used, this allows searches to include
	 * characters that would normally be considered modifiers, e.g. `foo\~2` will search for a term "foo~2" instead
	 * of attempting to apply a boost of 2 to the search term "foo".
	 *
	 * @typedef {string} lunr.Index~QueryString
	 * @example <caption>Simple single term query</caption>
	 * hello
	 * @example <caption>Multiple term query</caption>
	 * hello world
	 * @example <caption>term scoped to a field</caption>
	 * title:hello
	 * @example <caption>term with a boost of 10</caption>
	 * hello^10
	 * @example <caption>term with an edit distance of 2</caption>
	 * hello~2
	 * @example <caption>terms with presence modifiers</caption>
	 * -foo +bar baz
	 */

	/**
	 * Performs a search against the index using lunr query syntax.
	 *
	 * Results will be returned sorted by their score, the most relevant results
	 * will be returned first.  For details on how the score is calculated, please see
	 * the {@link https://lunrjs.com/guides/searching.html#scoring|guide}.
	 *
	 * For more programmatic querying use lunr.Index#query.
	 *
	 * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.
	 * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.
	 * @returns {lunr.Index~Result[]}
	 */
	lunr.Index.prototype.search = function (queryString) {
	  return this.query(function (query) {
	    var parser = new lunr.QueryParser(queryString, query);
	    parser.parse();
	  })
	};

	/**
	 * A query builder callback provides a query object to be used to express
	 * the query to perform on the index.
	 *
	 * @callback lunr.Index~queryBuilder
	 * @param {lunr.Query} query - The query object to build up.
	 * @this lunr.Query
	 */

	/**
	 * Performs a query against the index using the yielded lunr.Query object.
	 *
	 * If performing programmatic queries against the index, this method is preferred
	 * over lunr.Index#search so as to avoid the additional query parsing overhead.
	 *
	 * A query object is yielded to the supplied function which should be used to
	 * express the query to be run against the index.
	 *
	 * Note that although this function takes a callback parameter it is _not_ an
	 * asynchronous operation, the callback is just yielded a query object to be
	 * customized.
	 *
	 * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.
	 * @returns {lunr.Index~Result[]}
	 */
	lunr.Index.prototype.query = function (fn) {
	  // for each query clause
	  // * process terms
	  // * expand terms from token set
	  // * find matching documents and metadata
	  // * get document vectors
	  // * score documents

	  var query = new lunr.Query(this.fields),
	      matchingFields = Object.create(null),
	      queryVectors = Object.create(null),
	      termFieldCache = Object.create(null),
	      requiredMatches = Object.create(null),
	      prohibitedMatches = Object.create(null);

	  /*
	   * To support field level boosts a query vector is created per
	   * field. An empty vector is eagerly created to support negated
	   * queries.
	   */
	  for (var i = 0; i < this.fields.length; i++) {
	    queryVectors[this.fields[i]] = new lunr.Vector;
	  }

	  fn.call(query, query);

	  for (var i = 0; i < query.clauses.length; i++) {
	    /*
	     * Unless the pipeline has been disabled for this term, which is
	     * the case for terms with wildcards, we need to pass the clause
	     * term through the search pipeline. A pipeline returns an array
	     * of processed terms. Pipeline functions may expand the passed
	     * term, which means we may end up performing multiple index lookups
	     * for a single query term.
	     */
	    var clause = query.clauses[i],
	        terms = null,
	        clauseMatches = lunr.Set.empty;

	    if (clause.usePipeline) {
	      terms = this.pipeline.runString(clause.term, {
	        fields: clause.fields
	      });
	    } else {
	      terms = [clause.term];
	    }

	    for (var m = 0; m < terms.length; m++) {
	      var term = terms[m];

	      /*
	       * Each term returned from the pipeline needs to use the same query
	       * clause object, e.g. the same boost and or edit distance. The
	       * simplest way to do this is to re-use the clause object but mutate
	       * its term property.
	       */
	      clause.term = term;

	      /*
	       * From the term in the clause we create a token set which will then
	       * be used to intersect the indexes token set to get a list of terms
	       * to lookup in the inverted index
	       */
	      var termTokenSet = lunr.TokenSet.fromClause(clause),
	          expandedTerms = this.tokenSet.intersect(termTokenSet).toArray();

	      /*
	       * If a term marked as required does not exist in the tokenSet it is
	       * impossible for the search to return any matches. We set all the field
	       * scoped required matches set to empty and stop examining any further
	       * clauses.
	       */
	      if (expandedTerms.length === 0 && clause.presence === lunr.Query.presence.REQUIRED) {
	        for (var k = 0; k < clause.fields.length; k++) {
	          var field = clause.fields[k];
	          requiredMatches[field] = lunr.Set.empty;
	        }

	        break
	      }

	      for (var j = 0; j < expandedTerms.length; j++) {
	        /*
	         * For each term get the posting and termIndex, this is required for
	         * building the query vector.
	         */
	        var expandedTerm = expandedTerms[j],
	            posting = this.invertedIndex[expandedTerm],
	            termIndex = posting._index;

	        for (var k = 0; k < clause.fields.length; k++) {
	          /*
	           * For each field that this query term is scoped by (by default
	           * all fields are in scope) we need to get all the document refs
	           * that have this term in that field.
	           *
	           * The posting is the entry in the invertedIndex for the matching
	           * term from above.
	           */
	          var field = clause.fields[k],
	              fieldPosting = posting[field],
	              matchingDocumentRefs = Object.keys(fieldPosting),
	              termField = expandedTerm + "/" + field,
	              matchingDocumentsSet = new lunr.Set(matchingDocumentRefs);

	          /*
	           * if the presence of this term is required ensure that the matching
	           * documents are added to the set of required matches for this clause.
	           *
	           */
	          if (clause.presence == lunr.Query.presence.REQUIRED) {
	            clauseMatches = clauseMatches.union(matchingDocumentsSet);

	            if (requiredMatches[field] === undefined) {
	              requiredMatches[field] = lunr.Set.complete;
	            }
	          }

	          /*
	           * if the presence of this term is prohibited ensure that the matching
	           * documents are added to the set of prohibited matches for this field,
	           * creating that set if it does not yet exist.
	           */
	          if (clause.presence == lunr.Query.presence.PROHIBITED) {
	            if (prohibitedMatches[field] === undefined) {
	              prohibitedMatches[field] = lunr.Set.empty;
	            }

	            prohibitedMatches[field] = prohibitedMatches[field].union(matchingDocumentsSet);

	            /*
	             * Prohibited matches should not be part of the query vector used for
	             * similarity scoring and no metadata should be extracted so we continue
	             * to the next field
	             */
	            continue
	          }

	          /*
	           * The query field vector is populated using the termIndex found for
	           * the term and a unit value with the appropriate boost applied.
	           * Using upsert because there could already be an entry in the vector
	           * for the term we are working with. In that case we just add the scores
	           * together.
	           */
	          queryVectors[field].upsert(termIndex, clause.boost, function (a, b) { return a + b });

	          /**
	           * If we've already seen this term, field combo then we've already collected
	           * the matching documents and metadata, no need to go through all that again
	           */
	          if (termFieldCache[termField]) {
	            continue
	          }

	          for (var l = 0; l < matchingDocumentRefs.length; l++) {
	            /*
	             * All metadata for this term/field/document triple
	             * are then extracted and collected into an instance
	             * of lunr.MatchData ready to be returned in the query
	             * results
	             */
	            var matchingDocumentRef = matchingDocumentRefs[l],
	                matchingFieldRef = new lunr.FieldRef (matchingDocumentRef, field),
	                metadata = fieldPosting[matchingDocumentRef],
	                fieldMatch;

	            if ((fieldMatch = matchingFields[matchingFieldRef]) === undefined) {
	              matchingFields[matchingFieldRef] = new lunr.MatchData (expandedTerm, field, metadata);
	            } else {
	              fieldMatch.add(expandedTerm, field, metadata);
	            }

	          }

	          termFieldCache[termField] = true;
	        }
	      }
	    }

	    /**
	     * If the presence was required we need to update the requiredMatches field sets.
	     * We do this after all fields for the term have collected their matches because
	     * the clause terms presence is required in _any_ of the fields not _all_ of the
	     * fields.
	     */
	    if (clause.presence === lunr.Query.presence.REQUIRED) {
	      for (var k = 0; k < clause.fields.length; k++) {
	        var field = clause.fields[k];
	        requiredMatches[field] = requiredMatches[field].intersect(clauseMatches);
	      }
	    }
	  }

	  /**
	   * Need to combine the field scoped required and prohibited
	   * matching documents into a global set of required and prohibited
	   * matches
	   */
	  var allRequiredMatches = lunr.Set.complete,
	      allProhibitedMatches = lunr.Set.empty;

	  for (var i = 0; i < this.fields.length; i++) {
	    var field = this.fields[i];

	    if (requiredMatches[field]) {
	      allRequiredMatches = allRequiredMatches.intersect(requiredMatches[field]);
	    }

	    if (prohibitedMatches[field]) {
	      allProhibitedMatches = allProhibitedMatches.union(prohibitedMatches[field]);
	    }
	  }

	  var matchingFieldRefs = Object.keys(matchingFields),
	      results = [],
	      matches = Object.create(null);

	  /*
	   * If the query is negated (contains only prohibited terms)
	   * we need to get _all_ fieldRefs currently existing in the
	   * index. This is only done when we know that the query is
	   * entirely prohibited terms to avoid any cost of getting all
	   * fieldRefs unnecessarily.
	   *
	   * Additionally, blank MatchData must be created to correctly
	   * populate the results.
	   */
	  if (query.isNegated()) {
	    matchingFieldRefs = Object.keys(this.fieldVectors);

	    for (var i = 0; i < matchingFieldRefs.length; i++) {
	      var matchingFieldRef = matchingFieldRefs[i];
	      var fieldRef = lunr.FieldRef.fromString(matchingFieldRef);
	      matchingFields[matchingFieldRef] = new lunr.MatchData;
	    }
	  }

	  for (var i = 0; i < matchingFieldRefs.length; i++) {
	    /*
	     * Currently we have document fields that match the query, but we
	     * need to return documents. The matchData and scores are combined
	     * from multiple fields belonging to the same document.
	     *
	     * Scores are calculated by field, using the query vectors created
	     * above, and combined into a final document score using addition.
	     */
	    var fieldRef = lunr.FieldRef.fromString(matchingFieldRefs[i]),
	        docRef = fieldRef.docRef;

	    if (!allRequiredMatches.contains(docRef)) {
	      continue
	    }

	    if (allProhibitedMatches.contains(docRef)) {
	      continue
	    }

	    var fieldVector = this.fieldVectors[fieldRef],
	        score = queryVectors[fieldRef.fieldName].similarity(fieldVector),
	        docMatch;

	    if ((docMatch = matches[docRef]) !== undefined) {
	      docMatch.score += score;
	      docMatch.matchData.combine(matchingFields[fieldRef]);
	    } else {
	      var match = {
	        ref: docRef,
	        score: score,
	        matchData: matchingFields[fieldRef]
	      };
	      matches[docRef] = match;
	      results.push(match);
	    }
	  }

	  /*
	   * Sort the results objects by score, highest first.
	   */
	  return results.sort(function (a, b) {
	    return b.score - a.score
	  })
	};

	/**
	 * Prepares the index for JSON serialization.
	 *
	 * The schema for this JSON blob will be described in a
	 * separate JSON schema file.
	 *
	 * @returns {Object}
	 */
	lunr.Index.prototype.toJSON = function () {
	  var invertedIndex = Object.keys(this.invertedIndex)
	    .sort()
	    .map(function (term) {
	      return [term, this.invertedIndex[term]]
	    }, this);

	  var fieldVectors = Object.keys(this.fieldVectors)
	    .map(function (ref) {
	      return [ref, this.fieldVectors[ref].toJSON()]
	    }, this);

	  return {
	    version: lunr.version,
	    fields: this.fields,
	    fieldVectors: fieldVectors,
	    invertedIndex: invertedIndex,
	    pipeline: this.pipeline.toJSON()
	  }
	};

	/**
	 * Loads a previously serialized lunr.Index
	 *
	 * @param {Object} serializedIndex - A previously serialized lunr.Index
	 * @returns {lunr.Index}
	 */
	lunr.Index.load = function (serializedIndex) {
	  var attrs = {},
	      fieldVectors = {},
	      serializedVectors = serializedIndex.fieldVectors,
	      invertedIndex = Object.create(null),
	      serializedInvertedIndex = serializedIndex.invertedIndex,
	      tokenSetBuilder = new lunr.TokenSet.Builder,
	      pipeline = lunr.Pipeline.load(serializedIndex.pipeline);

	  if (serializedIndex.version != lunr.version) {
	    lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '" + lunr.version + "' does not match serialized index '" + serializedIndex.version + "'");
	  }

	  for (var i = 0; i < serializedVectors.length; i++) {
	    var tuple = serializedVectors[i],
	        ref = tuple[0],
	        elements = tuple[1];

	    fieldVectors[ref] = new lunr.Vector(elements);
	  }

	  for (var i = 0; i < serializedInvertedIndex.length; i++) {
	    var tuple = serializedInvertedIndex[i],
	        term = tuple[0],
	        posting = tuple[1];

	    tokenSetBuilder.insert(term);
	    invertedIndex[term] = posting;
	  }

	  tokenSetBuilder.finish();

	  attrs.fields = serializedIndex.fields;

	  attrs.fieldVectors = fieldVectors;
	  attrs.invertedIndex = invertedIndex;
	  attrs.tokenSet = tokenSetBuilder.root;
	  attrs.pipeline = pipeline;

	  return new lunr.Index(attrs)
	};
	/*!
	 * lunr.Builder
	 * Copyright (C) 2020 Oliver Nightingale
	 */

	/**
	 * lunr.Builder performs indexing on a set of documents and
	 * returns instances of lunr.Index ready for querying.
	 *
	 * All configuration of the index is done via the builder, the
	 * fields to index, the document reference, the text processing
	 * pipeline and document scoring parameters are all set on the
	 * builder before indexing.
	 *
	 * @constructor
	 * @property {string} _ref - Internal reference to the document reference field.
	 * @property {string[]} _fields - Internal reference to the document fields to index.
	 * @property {object} invertedIndex - The inverted index maps terms to document fields.
	 * @property {object} documentTermFrequencies - Keeps track of document term frequencies.
	 * @property {object} documentLengths - Keeps track of the length of documents added to the index.
	 * @property {lunr.tokenizer} tokenizer - Function for splitting strings into tokens for indexing.
	 * @property {lunr.Pipeline} pipeline - The pipeline performs text processing on tokens before indexing.
	 * @property {lunr.Pipeline} searchPipeline - A pipeline for processing search terms before querying the index.
	 * @property {number} documentCount - Keeps track of the total number of documents indexed.
	 * @property {number} _b - A parameter to control field length normalization, setting this to 0 disabled normalization, 1 fully normalizes field lengths, the default value is 0.75.
	 * @property {number} _k1 - A parameter to control how quickly an increase in term frequency results in term frequency saturation, the default value is 1.2.
	 * @property {number} termIndex - A counter incremented for each unique term, used to identify a terms position in the vector space.
	 * @property {array} metadataWhitelist - A list of metadata keys that have been whitelisted for entry in the index.
	 */
	lunr.Builder = function () {
	  this._ref = "id";
	  this._fields = Object.create(null);
	  this._documents = Object.create(null);
	  this.invertedIndex = Object.create(null);
	  this.fieldTermFrequencies = {};
	  this.fieldLengths = {};
	  this.tokenizer = lunr.tokenizer;
	  this.pipeline = new lunr.Pipeline;
	  this.searchPipeline = new lunr.Pipeline;
	  this.documentCount = 0;
	  this._b = 0.75;
	  this._k1 = 1.2;
	  this.termIndex = 0;
	  this.metadataWhitelist = [];
	};

	/**
	 * Sets the document field used as the document reference. Every document must have this field.
	 * The type of this field in the document should be a string, if it is not a string it will be
	 * coerced into a string by calling toString.
	 *
	 * The default ref is 'id'.
	 *
	 * The ref should _not_ be changed during indexing, it should be set before any documents are
	 * added to the index. Changing it during indexing can lead to inconsistent results.
	 *
	 * @param {string} ref - The name of the reference field in the document.
	 */
	lunr.Builder.prototype.ref = function (ref) {
	  this._ref = ref;
	};

	/**
	 * A function that is used to extract a field from a document.
	 *
	 * Lunr expects a field to be at the top level of a document, if however the field
	 * is deeply nested within a document an extractor function can be used to extract
	 * the right field for indexing.
	 *
	 * @callback fieldExtractor
	 * @param {object} doc - The document being added to the index.
	 * @returns {?(string|object|object[])} obj - The object that will be indexed for this field.
	 * @example <caption>Extracting a nested field</caption>
	 * function (doc) { return doc.nested.field }
	 */

	/**
	 * Adds a field to the list of document fields that will be indexed. Every document being
	 * indexed should have this field. Null values for this field in indexed documents will
	 * not cause errors but will limit the chance of that document being retrieved by searches.
	 *
	 * All fields should be added before adding documents to the index. Adding fields after
	 * a document has been indexed will have no effect on already indexed documents.
	 *
	 * Fields can be boosted at build time. This allows terms within that field to have more
	 * importance when ranking search results. Use a field boost to specify that matches within
	 * one field are more important than other fields.
	 *
	 * @param {string} fieldName - The name of a field to index in all documents.
	 * @param {object} attributes - Optional attributes associated with this field.
	 * @param {number} [attributes.boost=1] - Boost applied to all terms within this field.
	 * @param {fieldExtractor} [attributes.extractor] - Function to extract a field from a document.
	 * @throws {RangeError} fieldName cannot contain unsupported characters '/'
	 */
	lunr.Builder.prototype.field = function (fieldName, attributes) {
	  if (/\//.test(fieldName)) {
	    throw new RangeError ("Field '" + fieldName + "' contains illegal character '/'")
	  }

	  this._fields[fieldName] = attributes || {};
	};

	/**
	 * A parameter to tune the amount of field length normalisation that is applied when
	 * calculating relevance scores. A value of 0 will completely disable any normalisation
	 * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b
	 * will be clamped to the range 0 - 1.
	 *
	 * @param {number} number - The value to set for this tuning parameter.
	 */
	lunr.Builder.prototype.b = function (number) {
	  if (number < 0) {
	    this._b = 0;
	  } else if (number > 1) {
	    this._b = 1;
	  } else {
	    this._b = number;
	  }
	};

	/**
	 * A parameter that controls the speed at which a rise in term frequency results in term
	 * frequency saturation. The default value is 1.2. Setting this to a higher value will give
	 * slower saturation levels, a lower value will result in quicker saturation.
	 *
	 * @param {number} number - The value to set for this tuning parameter.
	 */
	lunr.Builder.prototype.k1 = function (number) {
	  this._k1 = number;
	};

	/**
	 * Adds a document to the index.
	 *
	 * Before adding fields to the index the index should have been fully setup, with the document
	 * ref and all fields to index already having been specified.
	 *
	 * The document must have a field name as specified by the ref (by default this is 'id') and
	 * it should have all fields defined for indexing, though null or undefined values will not
	 * cause errors.
	 *
	 * Entire documents can be boosted at build time. Applying a boost to a document indicates that
	 * this document should rank higher in search results than other documents.
	 *
	 * @param {object} doc - The document to add to the index.
	 * @param {object} attributes - Optional attributes associated with this document.
	 * @param {number} [attributes.boost=1] - Boost applied to all terms within this document.
	 */
	lunr.Builder.prototype.add = function (doc, attributes) {
	  var docRef = doc[this._ref],
	      fields = Object.keys(this._fields);

	  this._documents[docRef] = attributes || {};
	  this.documentCount += 1;

	  for (var i = 0; i < fields.length; i++) {
	    var fieldName = fields[i],
	        extractor = this._fields[fieldName].extractor,
	        field = extractor ? extractor(doc) : doc[fieldName],
	        tokens = this.tokenizer(field, {
	          fields: [fieldName]
	        }),
	        terms = this.pipeline.run(tokens),
	        fieldRef = new lunr.FieldRef (docRef, fieldName),
	        fieldTerms = Object.create(null);

	    this.fieldTermFrequencies[fieldRef] = fieldTerms;
	    this.fieldLengths[fieldRef] = 0;

	    // store the length of this field for this document
	    this.fieldLengths[fieldRef] += terms.length;

	    // calculate term frequencies for this field
	    for (var j = 0; j < terms.length; j++) {
	      var term = terms[j];

	      if (fieldTerms[term] == undefined) {
	        fieldTerms[term] = 0;
	      }

	      fieldTerms[term] += 1;

	      // add to inverted index
	      // create an initial posting if one doesn't exist
	      if (this.invertedIndex[term] == undefined) {
	        var posting = Object.create(null);
	        posting["_index"] = this.termIndex;
	        this.termIndex += 1;

	        for (var k = 0; k < fields.length; k++) {
	          posting[fields[k]] = Object.create(null);
	        }

	        this.invertedIndex[term] = posting;
	      }

	      // add an entry for this term/fieldName/docRef to the invertedIndex
	      if (this.invertedIndex[term][fieldName][docRef] == undefined) {
	        this.invertedIndex[term][fieldName][docRef] = Object.create(null);
	      }

	      // store all whitelisted metadata about this token in the
	      // inverted index
	      for (var l = 0; l < this.metadataWhitelist.length; l++) {
	        var metadataKey = this.metadataWhitelist[l],
	            metadata = term.metadata[metadataKey];

	        if (this.invertedIndex[term][fieldName][docRef][metadataKey] == undefined) {
	          this.invertedIndex[term][fieldName][docRef][metadataKey] = [];
	        }

	        this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata);
	      }
	    }

	  }
	};

	/**
	 * Calculates the average document length for this index
	 *
	 * @private
	 */
	lunr.Builder.prototype.calculateAverageFieldLengths = function () {

	  var fieldRefs = Object.keys(this.fieldLengths),
	      numberOfFields = fieldRefs.length,
	      accumulator = {},
	      documentsWithField = {};

	  for (var i = 0; i < numberOfFields; i++) {
	    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
	        field = fieldRef.fieldName;

	    documentsWithField[field] || (documentsWithField[field] = 0);
	    documentsWithField[field] += 1;

	    accumulator[field] || (accumulator[field] = 0);
	    accumulator[field] += this.fieldLengths[fieldRef];
	  }

	  var fields = Object.keys(this._fields);

	  for (var i = 0; i < fields.length; i++) {
	    var fieldName = fields[i];
	    accumulator[fieldName] = accumulator[fieldName] / documentsWithField[fieldName];
	  }

	  this.averageFieldLength = accumulator;
	};

	/**
	 * Builds a vector space model of every document using lunr.Vector
	 *
	 * @private
	 */
	lunr.Builder.prototype.createFieldVectors = function () {
	  var fieldVectors = {},
	      fieldRefs = Object.keys(this.fieldTermFrequencies),
	      fieldRefsLength = fieldRefs.length,
	      termIdfCache = Object.create(null);

	  for (var i = 0; i < fieldRefsLength; i++) {
	    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
	        fieldName = fieldRef.fieldName,
	        fieldLength = this.fieldLengths[fieldRef],
	        fieldVector = new lunr.Vector,
	        termFrequencies = this.fieldTermFrequencies[fieldRef],
	        terms = Object.keys(termFrequencies),
	        termsLength = terms.length;


	    var fieldBoost = this._fields[fieldName].boost || 1,
	        docBoost = this._documents[fieldRef.docRef].boost || 1;

	    for (var j = 0; j < termsLength; j++) {
	      var term = terms[j],
	          tf = termFrequencies[term],
	          termIndex = this.invertedIndex[term]._index,
	          idf, score, scoreWithPrecision;

	      if (termIdfCache[term] === undefined) {
	        idf = lunr.idf(this.invertedIndex[term], this.documentCount);
	        termIdfCache[term] = idf;
	      } else {
	        idf = termIdfCache[term];
	      }

	      score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[fieldName])) + tf);
	      score *= fieldBoost;
	      score *= docBoost;
	      scoreWithPrecision = Math.round(score * 1000) / 1000;
	      // Converts 1.23456789 to 1.234.
	      // Reducing the precision so that the vectors take up less
	      // space when serialised. Doing it now so that they behave
	      // the same before and after serialisation. Also, this is
	      // the fastest approach to reducing a number's precision in
	      // JavaScript.

	      fieldVector.insert(termIndex, scoreWithPrecision);
	    }

	    fieldVectors[fieldRef] = fieldVector;
	  }

	  this.fieldVectors = fieldVectors;
	};

	/**
	 * Creates a token set of all tokens in the index using lunr.TokenSet
	 *
	 * @private
	 */
	lunr.Builder.prototype.createTokenSet = function () {
	  this.tokenSet = lunr.TokenSet.fromArray(
	    Object.keys(this.invertedIndex).sort()
	  );
	};

	/**
	 * Builds the index, creating an instance of lunr.Index.
	 *
	 * This completes the indexing process and should only be called
	 * once all documents have been added to the index.
	 *
	 * @returns {lunr.Index}
	 */
	lunr.Builder.prototype.build = function () {
	  this.calculateAverageFieldLengths();
	  this.createFieldVectors();
	  this.createTokenSet();

	  return new lunr.Index({
	    invertedIndex: this.invertedIndex,
	    fieldVectors: this.fieldVectors,
	    tokenSet: this.tokenSet,
	    fields: Object.keys(this._fields),
	    pipeline: this.searchPipeline
	  })
	};

	/**
	 * Applies a plugin to the index builder.
	 *
	 * A plugin is a function that is called with the index builder as its context.
	 * Plugins can be used to customise or extend the behaviour of the index
	 * in some way. A plugin is just a function, that encapsulated the custom
	 * behaviour that should be applied when building the index.
	 *
	 * The plugin function will be called with the index builder as its argument, additional
	 * arguments can also be passed when calling use. The function will be called
	 * with the index builder as its context.
	 *
	 * @param {Function} plugin The plugin to apply.
	 */
	lunr.Builder.prototype.use = function (fn) {
	  var args = Array.prototype.slice.call(arguments, 1);
	  args.unshift(this);
	  fn.apply(this, args);
	};
	/**
	 * Contains and collects metadata about a matching document.
	 * A single instance of lunr.MatchData is returned as part of every
	 * lunr.Index~Result.
	 *
	 * @constructor
	 * @param {string} term - The term this match data is associated with
	 * @param {string} field - The field in which the term was found
	 * @param {object} metadata - The metadata recorded about this term in this field
	 * @property {object} metadata - A cloned collection of metadata associated with this document.
	 * @see {@link lunr.Index~Result}
	 */
	lunr.MatchData = function (term, field, metadata) {
	  var clonedMetadata = Object.create(null),
	      metadataKeys = Object.keys(metadata || {});

	  // Cloning the metadata to prevent the original
	  // being mutated during match data combination.
	  // Metadata is kept in an array within the inverted
	  // index so cloning the data can be done with
	  // Array#slice
	  for (var i = 0; i < metadataKeys.length; i++) {
	    var key = metadataKeys[i];
	    clonedMetadata[key] = metadata[key].slice();
	  }

	  this.metadata = Object.create(null);

	  if (term !== undefined) {
	    this.metadata[term] = Object.create(null);
	    this.metadata[term][field] = clonedMetadata;
	  }
	};

	/**
	 * An instance of lunr.MatchData will be created for every term that matches a
	 * document. However only one instance is required in a lunr.Index~Result. This
	 * method combines metadata from another instance of lunr.MatchData with this
	 * objects metadata.
	 *
	 * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.
	 * @see {@link lunr.Index~Result}
	 */
	lunr.MatchData.prototype.combine = function (otherMatchData) {
	  var terms = Object.keys(otherMatchData.metadata);

	  for (var i = 0; i < terms.length; i++) {
	    var term = terms[i],
	        fields = Object.keys(otherMatchData.metadata[term]);

	    if (this.metadata[term] == undefined) {
	      this.metadata[term] = Object.create(null);
	    }

	    for (var j = 0; j < fields.length; j++) {
	      var field = fields[j],
	          keys = Object.keys(otherMatchData.metadata[term][field]);

	      if (this.metadata[term][field] == undefined) {
	        this.metadata[term][field] = Object.create(null);
	      }

	      for (var k = 0; k < keys.length; k++) {
	        var key = keys[k];

	        if (this.metadata[term][field][key] == undefined) {
	          this.metadata[term][field][key] = otherMatchData.metadata[term][field][key];
	        } else {
	          this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key]);
	        }

	      }
	    }
	  }
	};

	/**
	 * Add metadata for a term/field pair to this instance of match data.
	 *
	 * @param {string} term - The term this match data is associated with
	 * @param {string} field - The field in which the term was found
	 * @param {object} metadata - The metadata recorded about this term in this field
	 */
	lunr.MatchData.prototype.add = function (term, field, metadata) {
	  if (!(term in this.metadata)) {
	    this.metadata[term] = Object.create(null);
	    this.metadata[term][field] = metadata;
	    return
	  }

	  if (!(field in this.metadata[term])) {
	    this.metadata[term][field] = metadata;
	    return
	  }

	  var metadataKeys = Object.keys(metadata);

	  for (var i = 0; i < metadataKeys.length; i++) {
	    var key = metadataKeys[i];

	    if (key in this.metadata[term][field]) {
	      this.metadata[term][field][key] = this.metadata[term][field][key].concat(metadata[key]);
	    } else {
	      this.metadata[term][field][key] = metadata[key];
	    }
	  }
	};
	/**
	 * A lunr.Query provides a programmatic way of defining queries to be performed
	 * against a {@link lunr.Index}.
	 *
	 * Prefer constructing a lunr.Query using the {@link lunr.Index#query} method
	 * so the query object is pre-initialized with the right index fields.
	 *
	 * @constructor
	 * @property {lunr.Query~Clause[]} clauses - An array of query clauses.
	 * @property {string[]} allFields - An array of all available fields in a lunr.Index.
	 */
	lunr.Query = function (allFields) {
	  this.clauses = [];
	  this.allFields = allFields;
	};

	/**
	 * Constants for indicating what kind of automatic wildcard insertion will be used when constructing a query clause.
	 *
	 * This allows wildcards to be added to the beginning and end of a term without having to manually do any string
	 * concatenation.
	 *
	 * The wildcard constants can be bitwise combined to select both leading and trailing wildcards.
	 *
	 * @constant
	 * @default
	 * @property {number} wildcard.NONE - The term will have no wildcards inserted, this is the default behaviour
	 * @property {number} wildcard.LEADING - Prepend the term with a wildcard, unless a leading wildcard already exists
	 * @property {number} wildcard.TRAILING - Append a wildcard to the term, unless a trailing wildcard already exists
	 * @see lunr.Query~Clause
	 * @see lunr.Query#clause
	 * @see lunr.Query#term
	 * @example <caption>query term with trailing wildcard</caption>
	 * query.term('foo', { wildcard: lunr.Query.wildcard.TRAILING })
	 * @example <caption>query term with leading and trailing wildcard</caption>
	 * query.term('foo', {
	 *   wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
	 * })
	 */

	lunr.Query.wildcard = new String ("*");
	lunr.Query.wildcard.NONE = 0;
	lunr.Query.wildcard.LEADING = 1;
	lunr.Query.wildcard.TRAILING = 2;

	/**
	 * Constants for indicating what kind of presence a term must have in matching documents.
	 *
	 * @constant
	 * @enum {number}
	 * @see lunr.Query~Clause
	 * @see lunr.Query#clause
	 * @see lunr.Query#term
	 * @example <caption>query term with required presence</caption>
	 * query.term('foo', { presence: lunr.Query.presence.REQUIRED })
	 */
	lunr.Query.presence = {
	  /**
	   * Term's presence in a document is optional, this is the default value.
	   */
	  OPTIONAL: 1,

	  /**
	   * Term's presence in a document is required, documents that do not contain
	   * this term will not be returned.
	   */
	  REQUIRED: 2,

	  /**
	   * Term's presence in a document is prohibited, documents that do contain
	   * this term will not be returned.
	   */
	  PROHIBITED: 3
	};

	/**
	 * A single clause in a {@link lunr.Query} contains a term and details on how to
	 * match that term against a {@link lunr.Index}.
	 *
	 * @typedef {Object} lunr.Query~Clause
	 * @property {string[]} fields - The fields in an index this clause should be matched against.
	 * @property {number} [boost=1] - Any boost that should be applied when matching this clause.
	 * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.
	 * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.
	 * @property {number} [wildcard=lunr.Query.wildcard.NONE] - Whether the term should have wildcards appended or prepended.
	 * @property {number} [presence=lunr.Query.presence.OPTIONAL] - The terms presence in any matching documents.
	 */

	/**
	 * Adds a {@link lunr.Query~Clause} to this query.
	 *
	 * Unless the clause contains the fields to be matched all fields will be matched. In addition
	 * a default boost of 1 is applied to the clause.
	 *
	 * @param {lunr.Query~Clause} clause - The clause to add to this query.
	 * @see lunr.Query~Clause
	 * @returns {lunr.Query}
	 */
	lunr.Query.prototype.clause = function (clause) {
	  if (!('fields' in clause)) {
	    clause.fields = this.allFields;
	  }

	  if (!('boost' in clause)) {
	    clause.boost = 1;
	  }

	  if (!('usePipeline' in clause)) {
	    clause.usePipeline = true;
	  }

	  if (!('wildcard' in clause)) {
	    clause.wildcard = lunr.Query.wildcard.NONE;
	  }

	  if ((clause.wildcard & lunr.Query.wildcard.LEADING) && (clause.term.charAt(0) != lunr.Query.wildcard)) {
	    clause.term = "*" + clause.term;
	  }

	  if ((clause.wildcard & lunr.Query.wildcard.TRAILING) && (clause.term.slice(-1) != lunr.Query.wildcard)) {
	    clause.term = "" + clause.term + "*";
	  }

	  if (!('presence' in clause)) {
	    clause.presence = lunr.Query.presence.OPTIONAL;
	  }

	  this.clauses.push(clause);

	  return this
	};

	/**
	 * A negated query is one in which every clause has a presence of
	 * prohibited. These queries require some special processing to return
	 * the expected results.
	 *
	 * @returns boolean
	 */
	lunr.Query.prototype.isNegated = function () {
	  for (var i = 0; i < this.clauses.length; i++) {
	    if (this.clauses[i].presence != lunr.Query.presence.PROHIBITED) {
	      return false
	    }
	  }

	  return true
	};

	/**
	 * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}
	 * to the list of clauses that make up this query.
	 *
	 * The term is used as is, i.e. no tokenization will be performed by this method. Instead conversion
	 * to a token or token-like string should be done before calling this method.
	 *
	 * The term will be converted to a string by calling `toString`. Multiple terms can be passed as an
	 * array, each term in the array will share the same options.
	 *
	 * @param {object|object[]} term - The term(s) to add to the query.
	 * @param {object} [options] - Any additional properties to add to the query clause.
	 * @returns {lunr.Query}
	 * @see lunr.Query#clause
	 * @see lunr.Query~Clause
	 * @example <caption>adding a single term to a query</caption>
	 * query.term("foo")
	 * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>
	 * query.term("foo", {
	 *   fields: ["title"],
	 *   boost: 10,
	 *   wildcard: lunr.Query.wildcard.TRAILING
	 * })
	 * @example <caption>using lunr.tokenizer to convert a string to tokens before using them as terms</caption>
	 * query.term(lunr.tokenizer("foo bar"))
	 */
	lunr.Query.prototype.term = function (term, options) {
	  if (Array.isArray(term)) {
	    term.forEach(function (t) { this.term(t, lunr.utils.clone(options)); }, this);
	    return this
	  }

	  var clause = options || {};
	  clause.term = term.toString();

	  this.clause(clause);

	  return this
	};
	lunr.QueryParseError = function (message, start, end) {
	  this.name = "QueryParseError";
	  this.message = message;
	  this.start = start;
	  this.end = end;
	};

	lunr.QueryParseError.prototype = new Error;
	lunr.QueryLexer = function (str) {
	  this.lexemes = [];
	  this.str = str;
	  this.length = str.length;
	  this.pos = 0;
	  this.start = 0;
	  this.escapeCharPositions = [];
	};

	lunr.QueryLexer.prototype.run = function () {
	  var state = lunr.QueryLexer.lexText;

	  while (state) {
	    state = state(this);
	  }
	};

	lunr.QueryLexer.prototype.sliceString = function () {
	  var subSlices = [],
	      sliceStart = this.start,
	      sliceEnd = this.pos;

	  for (var i = 0; i < this.escapeCharPositions.length; i++) {
	    sliceEnd = this.escapeCharPositions[i];
	    subSlices.push(this.str.slice(sliceStart, sliceEnd));
	    sliceStart = sliceEnd + 1;
	  }

	  subSlices.push(this.str.slice(sliceStart, this.pos));
	  this.escapeCharPositions.length = 0;

	  return subSlices.join('')
	};

	lunr.QueryLexer.prototype.emit = function (type) {
	  this.lexemes.push({
	    type: type,
	    str: this.sliceString(),
	    start: this.start,
	    end: this.pos
	  });

	  this.start = this.pos;
	};

	lunr.QueryLexer.prototype.escapeCharacter = function () {
	  this.escapeCharPositions.push(this.pos - 1);
	  this.pos += 1;
	};

	lunr.QueryLexer.prototype.next = function () {
	  if (this.pos >= this.length) {
	    return lunr.QueryLexer.EOS
	  }

	  var char = this.str.charAt(this.pos);
	  this.pos += 1;
	  return char
	};

	lunr.QueryLexer.prototype.width = function () {
	  return this.pos - this.start
	};

	lunr.QueryLexer.prototype.ignore = function () {
	  if (this.start == this.pos) {
	    this.pos += 1;
	  }

	  this.start = this.pos;
	};

	lunr.QueryLexer.prototype.backup = function () {
	  this.pos -= 1;
	};

	lunr.QueryLexer.prototype.acceptDigitRun = function () {
	  var char, charCode;

	  do {
	    char = this.next();
	    charCode = char.charCodeAt(0);
	  } while (charCode > 47 && charCode < 58)

	  if (char != lunr.QueryLexer.EOS) {
	    this.backup();
	  }
	};

	lunr.QueryLexer.prototype.more = function () {
	  return this.pos < this.length
	};

	lunr.QueryLexer.EOS = 'EOS';
	lunr.QueryLexer.FIELD = 'FIELD';
	lunr.QueryLexer.TERM = 'TERM';
	lunr.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE';
	lunr.QueryLexer.BOOST = 'BOOST';
	lunr.QueryLexer.PRESENCE = 'PRESENCE';

	lunr.QueryLexer.lexField = function (lexer) {
	  lexer.backup();
	  lexer.emit(lunr.QueryLexer.FIELD);
	  lexer.ignore();
	  return lunr.QueryLexer.lexText
	};

	lunr.QueryLexer.lexTerm = function (lexer) {
	  if (lexer.width() > 1) {
	    lexer.backup();
	    lexer.emit(lunr.QueryLexer.TERM);
	  }

	  lexer.ignore();

	  if (lexer.more()) {
	    return lunr.QueryLexer.lexText
	  }
	};

	lunr.QueryLexer.lexEditDistance = function (lexer) {
	  lexer.ignore();
	  lexer.acceptDigitRun();
	  lexer.emit(lunr.QueryLexer.EDIT_DISTANCE);
	  return lunr.QueryLexer.lexText
	};

	lunr.QueryLexer.lexBoost = function (lexer) {
	  lexer.ignore();
	  lexer.acceptDigitRun();
	  lexer.emit(lunr.QueryLexer.BOOST);
	  return lunr.QueryLexer.lexText
	};

	lunr.QueryLexer.lexEOS = function (lexer) {
	  if (lexer.width() > 0) {
	    lexer.emit(lunr.QueryLexer.TERM);
	  }
	};

	// This matches the separator used when tokenising fields
	// within a document. These should match otherwise it is
	// not possible to search for some tokens within a document.
	//
	// It is possible for the user to change the separator on the
	// tokenizer so it _might_ clash with any other of the special
	// characters already used within the search string, e.g. :.
	//
	// This means that it is possible to change the separator in
	// such a way that makes some words unsearchable using a search
	// string.
	lunr.QueryLexer.termSeparator = lunr.tokenizer.separator;

	lunr.QueryLexer.lexText = function (lexer) {
	  while (true) {
	    var char = lexer.next();

	    if (char == lunr.QueryLexer.EOS) {
	      return lunr.QueryLexer.lexEOS
	    }

	    // Escape character is '\'
	    if (char.charCodeAt(0) == 92) {
	      lexer.escapeCharacter();
	      continue
	    }

	    if (char == ":") {
	      return lunr.QueryLexer.lexField
	    }

	    if (char == "~") {
	      lexer.backup();
	      if (lexer.width() > 0) {
	        lexer.emit(lunr.QueryLexer.TERM);
	      }
	      return lunr.QueryLexer.lexEditDistance
	    }

	    if (char == "^") {
	      lexer.backup();
	      if (lexer.width() > 0) {
	        lexer.emit(lunr.QueryLexer.TERM);
	      }
	      return lunr.QueryLexer.lexBoost
	    }

	    // "+" indicates term presence is required
	    // checking for length to ensure that only
	    // leading "+" are considered
	    if (char == "+" && lexer.width() === 1) {
	      lexer.emit(lunr.QueryLexer.PRESENCE);
	      return lunr.QueryLexer.lexText
	    }

	    // "-" indicates term presence is prohibited
	    // checking for length to ensure that only
	    // leading "-" are considered
	    if (char == "-" && lexer.width() === 1) {
	      lexer.emit(lunr.QueryLexer.PRESENCE);
	      return lunr.QueryLexer.lexText
	    }

	    if (char.match(lunr.QueryLexer.termSeparator)) {
	      return lunr.QueryLexer.lexTerm
	    }
	  }
	};

	lunr.QueryParser = function (str, query) {
	  this.lexer = new lunr.QueryLexer (str);
	  this.query = query;
	  this.currentClause = {};
	  this.lexemeIdx = 0;
	};

	lunr.QueryParser.prototype.parse = function () {
	  this.lexer.run();
	  this.lexemes = this.lexer.lexemes;

	  var state = lunr.QueryParser.parseClause;

	  while (state) {
	    state = state(this);
	  }

	  return this.query
	};

	lunr.QueryParser.prototype.peekLexeme = function () {
	  return this.lexemes[this.lexemeIdx]
	};

	lunr.QueryParser.prototype.consumeLexeme = function () {
	  var lexeme = this.peekLexeme();
	  this.lexemeIdx += 1;
	  return lexeme
	};

	lunr.QueryParser.prototype.nextClause = function () {
	  var completedClause = this.currentClause;
	  this.query.clause(completedClause);
	  this.currentClause = {};
	};

	lunr.QueryParser.parseClause = function (parser) {
	  var lexeme = parser.peekLexeme();

	  if (lexeme == undefined) {
	    return
	  }

	  switch (lexeme.type) {
	    case lunr.QueryLexer.PRESENCE:
	      return lunr.QueryParser.parsePresence
	    case lunr.QueryLexer.FIELD:
	      return lunr.QueryParser.parseField
	    case lunr.QueryLexer.TERM:
	      return lunr.QueryParser.parseTerm
	    default:
	      var errorMessage = "expected either a field or a term, found " + lexeme.type;

	      if (lexeme.str.length >= 1) {
	        errorMessage += " with value '" + lexeme.str + "'";
	      }

	      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
	  }
	};

	lunr.QueryParser.parsePresence = function (parser) {
	  var lexeme = parser.consumeLexeme();

	  if (lexeme == undefined) {
	    return
	  }

	  switch (lexeme.str) {
	    case "-":
	      parser.currentClause.presence = lunr.Query.presence.PROHIBITED;
	      break
	    case "+":
	      parser.currentClause.presence = lunr.Query.presence.REQUIRED;
	      break
	    default:
	      var errorMessage = "unrecognised presence operator'" + lexeme.str + "'";
	      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
	  }

	  var nextLexeme = parser.peekLexeme();

	  if (nextLexeme == undefined) {
	    var errorMessage = "expecting term or field, found nothing";
	    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
	  }

	  switch (nextLexeme.type) {
	    case lunr.QueryLexer.FIELD:
	      return lunr.QueryParser.parseField
	    case lunr.QueryLexer.TERM:
	      return lunr.QueryParser.parseTerm
	    default:
	      var errorMessage = "expecting term or field, found '" + nextLexeme.type + "'";
	      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
	  }
	};

	lunr.QueryParser.parseField = function (parser) {
	  var lexeme = parser.consumeLexeme();

	  if (lexeme == undefined) {
	    return
	  }

	  if (parser.query.allFields.indexOf(lexeme.str) == -1) {
	    var possibleFields = parser.query.allFields.map(function (f) { return "'" + f + "'" }).join(', '),
	        errorMessage = "unrecognised field '" + lexeme.str + "', possible fields: " + possibleFields;

	    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
	  }

	  parser.currentClause.fields = [lexeme.str];

	  var nextLexeme = parser.peekLexeme();

	  if (nextLexeme == undefined) {
	    var errorMessage = "expecting term, found nothing";
	    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
	  }

	  switch (nextLexeme.type) {
	    case lunr.QueryLexer.TERM:
	      return lunr.QueryParser.parseTerm
	    default:
	      var errorMessage = "expecting term, found '" + nextLexeme.type + "'";
	      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
	  }
	};

	lunr.QueryParser.parseTerm = function (parser) {
	  var lexeme = parser.consumeLexeme();

	  if (lexeme == undefined) {
	    return
	  }

	  parser.currentClause.term = lexeme.str.toLowerCase();

	  if (lexeme.str.indexOf("*") != -1) {
	    parser.currentClause.usePipeline = false;
	  }

	  var nextLexeme = parser.peekLexeme();

	  if (nextLexeme == undefined) {
	    parser.nextClause();
	    return
	  }

	  switch (nextLexeme.type) {
	    case lunr.QueryLexer.TERM:
	      parser.nextClause();
	      return lunr.QueryParser.parseTerm
	    case lunr.QueryLexer.FIELD:
	      parser.nextClause();
	      return lunr.QueryParser.parseField
	    case lunr.QueryLexer.EDIT_DISTANCE:
	      return lunr.QueryParser.parseEditDistance
	    case lunr.QueryLexer.BOOST:
	      return lunr.QueryParser.parseBoost
	    case lunr.QueryLexer.PRESENCE:
	      parser.nextClause();
	      return lunr.QueryParser.parsePresence
	    default:
	      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
	      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
	  }
	};

	lunr.QueryParser.parseEditDistance = function (parser) {
	  var lexeme = parser.consumeLexeme();

	  if (lexeme == undefined) {
	    return
	  }

	  var editDistance = parseInt(lexeme.str, 10);

	  if (isNaN(editDistance)) {
	    var errorMessage = "edit distance must be numeric";
	    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
	  }

	  parser.currentClause.editDistance = editDistance;

	  var nextLexeme = parser.peekLexeme();

	  if (nextLexeme == undefined) {
	    parser.nextClause();
	    return
	  }

	  switch (nextLexeme.type) {
	    case lunr.QueryLexer.TERM:
	      parser.nextClause();
	      return lunr.QueryParser.parseTerm
	    case lunr.QueryLexer.FIELD:
	      parser.nextClause();
	      return lunr.QueryParser.parseField
	    case lunr.QueryLexer.EDIT_DISTANCE:
	      return lunr.QueryParser.parseEditDistance
	    case lunr.QueryLexer.BOOST:
	      return lunr.QueryParser.parseBoost
	    case lunr.QueryLexer.PRESENCE:
	      parser.nextClause();
	      return lunr.QueryParser.parsePresence
	    default:
	      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
	      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
	  }
	};

	lunr.QueryParser.parseBoost = function (parser) {
	  var lexeme = parser.consumeLexeme();

	  if (lexeme == undefined) {
	    return
	  }

	  var boost = parseInt(lexeme.str, 10);

	  if (isNaN(boost)) {
	    var errorMessage = "boost must be numeric";
	    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
	  }

	  parser.currentClause.boost = boost;

	  var nextLexeme = parser.peekLexeme();

	  if (nextLexeme == undefined) {
	    parser.nextClause();
	    return
	  }

	  switch (nextLexeme.type) {
	    case lunr.QueryLexer.TERM:
	      parser.nextClause();
	      return lunr.QueryParser.parseTerm
	    case lunr.QueryLexer.FIELD:
	      parser.nextClause();
	      return lunr.QueryParser.parseField
	    case lunr.QueryLexer.EDIT_DISTANCE:
	      return lunr.QueryParser.parseEditDistance
	    case lunr.QueryLexer.BOOST:
	      return lunr.QueryParser.parseBoost
	    case lunr.QueryLexer.PRESENCE:
	      parser.nextClause();
	      return lunr.QueryParser.parsePresence
	    default:
	      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
	      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
	  }
	}

	  /**
	   * export the module via AMD, CommonJS or as a browser global
	   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
	   */
	  ;(function (root, factory) {
	    {
	      /**
	       * Node. Does not work with strict CommonJS, but
	       * only CommonJS-like enviroments that support module.exports,
	       * like Node.
	       */
	      module.exports = factory();
	    }
	  }(this, function () {
	    /**
	     * Just return a value to define the module export.
	     * This example returns an object, but the module
	     * can return a function as the exported value.
	     */
	    return lunr
	  }));
	})();
	}, "/$$rollup_base$$/node_modules/lunr");

	var articleCard = commonjsRequire("/$$rollup_base$$/src/_11ty/shortcodes/ArticleCard.js", "/$$rollup_base$$/src/_11ty/shortcodes");

	var i18n = {
	  // General
	  articles_filtered_by: {
	    en: 'Articles filtered by',
	  },
	  category: {
	    en: 'Category',
	  },
	  coming_soon: {
	    en: 'Coming soon',
	  },
	  coming_up: {
	    en: 'Coming up',
	  },
	  filter_by_topic: {
	    en: 'Filter by topic',
	  },
	  find_out_more: {
	    en: 'Find out more',
	  },
	  go_to: {
	    en: 'Go to',
	  },
	  hello: {
	    en: 'Hello',
	  },
	  keep_reading: {
	    en: 'Keep reading',
	  },
	  loading: {
	    en: 'Loading…',
	  },
	  next: {
	    en: 'Next',
	  },
	  of: {
	    en: 'Of',
	  },
	  page: {
	    en: 'Page',
	  },
	  previous: {
	    en: 'Previous',
	  },
	  read_more_articles_like_this: {
	    en: 'Read more articles like this',
	  },
	  related: {
	    en: 'Related',
	  },
	  share: {
	    en: 'Share',
	  },
	  share_this_article: {
	    en: 'Share this article',
	  },
	  slides: {
	    en: 'Slides',
	  },
	  tags: {
	    en: 'Tags',
	  },
	  upcoming: {
	    en: 'Upcoming',
	  },
	  website: {
	    en: 'Website',
	  },
	  with: {
	    en: 'With',
	  },

	  // i18n
	  language: {
	    en: 'Language',
	  },
	  select_language: {
	    en: 'Select language',
	  },

	  // Blog
	  back_to_blog: {
	    en: 'Back to blog',
	  },
	  blog: {
	    en: 'Blog',
	  },
	  'blog-post': {
	    en: 'Blog',
	  },
	  blog_search_failed: {
	    en: 'Sorry, we couldn’t complete your search at this time. Please try again shortly.',
	  },
	  blog_search_no_results: {
	    en: 'No results for',
	  },
	  blog_search_unavailable: {
	    en: 'Please enable JavaScript to search',
	  },
	  blog_searched_for: {
	    en: 'You searched for',
	  },
	  search_all_blog_posts: {
	    en: 'Search all blog posts',
	  },

	  // Case study
	  about_this_case_study: {
	    en: 'About this case study',
	  },
	  case_studies_filtered_by: {
	    en: 'Case studies filtered by',
	  },
	  find_out_more_about_this_case_study_at_the: {
	    en: 'Find out more about this case study at the',
	  },
	  this_case_study_is_sponsored_by: {
	    en: 'This case study is sponsored by',
	  },

	  // Events
	  event: {
	    en: 'Event',
	  },
	  events: {
	    en: 'Events',
	  },
	  event_details: {
	    en: 'Event details',
	  },
	  events_filtered_by: {
	    en: 'Events filtered by',
	  },
	  event_sponsors: {
	    en: 'Event sponsors',
	  },
	  filter_by_event_type: {
	    en: 'Filter by event type',
	  },
	  previous_events: {
	    en: 'Previous events',
	  },
	  there_are_no_upcoming_events: {
	    en: 'There are no upcoming events',
	  },

	  // Press Releases
	  'press-release': {
	    en: 'Press Release',
	  },
	};

	const SearchOutput = {
	  init: () => {
	    const urlParts = window.location.pathname.split('/') || [];
	    const urlLocale = urlParts[1];
	    const blogDir = `/${urlLocale}/news/blog`;
	    const searchDataUrls = [
	      `${blogDir}/search-index.json`,
	      `${blogDir}/search-output.json`,
	    ];
	    const searchInput = document.getElementById('search-str');
	    const searchresultsContainer = document.getElementById('search-results');
	    const queryString = window.location.search;
	    const urlParams = new URLSearchParams(queryString);
	    const query = urlParams.get('q');

	    async function initSearchIndex() {
	      if (!urlParams.has('q')) return;

	      try {
	        searchInput.value = query;

	        const [searchIndex, searchOutput] = await Promise.all(
	          searchDataUrls.map(url =>
	            fetch(url, {
	              method: 'GET',
	              credentials: 'include',
	              mode: 'no-cors',
	            }).then(res => res.json())
	          )
	        );
	        const lunrIndex = lunr.Index.load(searchIndex);

	        search(lunrIndex, searchOutput);
	      } catch (error) {
	        console.error(error);
	        renderError();
	      }
	    }

	    function search(lunrIndex, searchOutput) {
	      let searchResults = lunrIndex.search(query);

	      searchResults.forEach(result => {
	        result.image = searchOutput[result.ref].image;
	        result.title = searchOutput[result.ref].title;
	        result.author = searchOutput[result.ref].author;
	        result.date = searchOutput[result.ref].date;
	        result.url = searchOutput[result.ref].url;
	        result.content = searchOutput[result.ref].content;
	      });

	      renderResults(searchResults);
	    }

	    function renderResults(results = []) {
	      let searchResultsHtml;

	      const { blog_search_no_results = {}, blog_searched_for = {} } =
	        i18n || {};
	      const noResultsString =
	        blog_search_no_results[urlLocale] || 'No results for';
	      const searchedForString =
	        blog_searched_for[urlLocale] || 'You searched for';

	      if (!searchresultsContainer) return;

	      if (!results.length) {
	        searchResultsHtml = `<p class="h3 mb-8 xl:mb-10">${noResultsString} “${query}”</p>`;
	      } else {
	        searchResultsHtml = `<p class="h3 mb-8 xl:mb-10">${searchedForString} “${query}”</p>
      <ul class="grid md:grid--cols-2 lg:grid--cols-3 xl:grid--cols-4 list-none m-0 p-0">${results
        .map(({ author, content, date, image, title, url }) => {
          const restucturedData = {
            data: {
              author,
              date,
              image,
              title,
              locale: urlLocale,
            },
            templateContent: content,
            url,
          };

          return `<li>${articleCard(restucturedData)}</li>`;
        })
        .join('')}</ul>`;
	      }

	      searchresultsContainer.innerHTML = searchResultsHtml;
	    }

	    function renderError() {
	      const { blog_search_failed = {} } = i18n || {};
	      const errorMessage =
	        blog_search_failed[urlLocale] ||
	        'Sorry, we couldn’t complete your search at this time. Please try again shortly.';

	      const searchResultsHtml = `<p class="h3 mb-8 xl:mb-10">${errorMessage}</p>`;

	      searchresultsContainer.innerHTML = searchResultsHtml;
	    }

	    initSearchIndex();
	  },
	};

	SearchOutput.init();

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLXNlYXJjaC5tanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fZGF0YS9zaXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2x1bnIvbHVuci5qcyIsIi4uLy4uL3NyYy9fMTF0eS9zaG9ydGNvZGVzL0FydGljbGVDYXJkLmpzIiwiLi4vLi4vc3JjL19kYXRhL2kxOG4vaW5kZXguanMiLCIuLi8uLi9zcmMvanMvc2VhcmNoLW91dHB1dC5qcyIsIi4uLy4uL3NyYy9qcy9zZWFyY2guanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRpdGxlOiAnQ2VwaCcsXG4gIHVybDogJ2h0dHBzOi8vY2VwaC5pbycsXG4gIGRlZmF1bHRMb2NhbGU6ICdlbicsXG59O1xuIiwiLyoqXG4gKiBsdW5yIC0gaHR0cDovL2x1bnJqcy5jb20gLSBBIGJpdCBsaWtlIFNvbHIsIGJ1dCBtdWNoIHNtYWxsZXIgYW5kIG5vdCBhcyBicmlnaHQgLSAyLjMuOVxuICogQ29weXJpZ2h0IChDKSAyMDIwIE9saXZlciBOaWdodGluZ2FsZVxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuOyhmdW5jdGlvbigpe1xuXG4vKipcbiAqIEEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNvbmZpZ3VyaW5nIGFuZCBjb25zdHJ1Y3RpbmdcbiAqIGEgbmV3IGx1bnIgSW5kZXguXG4gKlxuICogQSBsdW5yLkJ1aWxkZXIgaW5zdGFuY2UgaXMgY3JlYXRlZCBhbmQgdGhlIHBpcGVsaW5lIHNldHVwXG4gKiB3aXRoIGEgdHJpbW1lciwgc3RvcCB3b3JkIGZpbHRlciBhbmQgc3RlbW1lci5cbiAqXG4gKiBUaGlzIGJ1aWxkZXIgb2JqZWN0IGlzIHlpZWxkZWQgdG8gdGhlIGNvbmZpZ3VyYXRpb24gZnVuY3Rpb25cbiAqIHRoYXQgaXMgcGFzc2VkIGFzIGEgcGFyYW1ldGVyLCBhbGxvd2luZyB0aGUgbGlzdCBvZiBmaWVsZHNcbiAqIGFuZCBvdGhlciBidWlsZGVyIHBhcmFtZXRlcnMgdG8gYmUgY3VzdG9taXNlZC5cbiAqXG4gKiBBbGwgZG9jdW1lbnRzIF9tdXN0XyBiZSBhZGRlZCB3aXRoaW4gdGhlIHBhc3NlZCBjb25maWcgZnVuY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBpZHggPSBsdW5yKGZ1bmN0aW9uICgpIHtcbiAqICAgdGhpcy5maWVsZCgndGl0bGUnKVxuICogICB0aGlzLmZpZWxkKCdib2R5JylcbiAqICAgdGhpcy5yZWYoJ2lkJylcbiAqXG4gKiAgIGRvY3VtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAqICAgICB0aGlzLmFkZChkb2MpXG4gKiAgIH0sIHRoaXMpXG4gKiB9KVxuICpcbiAqIEBzZWUge0BsaW5rIGx1bnIuQnVpbGRlcn1cbiAqIEBzZWUge0BsaW5rIGx1bnIuUGlwZWxpbmV9XG4gKiBAc2VlIHtAbGluayBsdW5yLnRyaW1tZXJ9XG4gKiBAc2VlIHtAbGluayBsdW5yLnN0b3BXb3JkRmlsdGVyfVxuICogQHNlZSB7QGxpbmsgbHVuci5zdGVtbWVyfVxuICogQG5hbWVzcGFjZSB7ZnVuY3Rpb259IGx1bnJcbiAqL1xudmFyIGx1bnIgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gIHZhciBidWlsZGVyID0gbmV3IGx1bnIuQnVpbGRlclxuXG4gIGJ1aWxkZXIucGlwZWxpbmUuYWRkKFxuICAgIGx1bnIudHJpbW1lcixcbiAgICBsdW5yLnN0b3BXb3JkRmlsdGVyLFxuICAgIGx1bnIuc3RlbW1lclxuICApXG5cbiAgYnVpbGRlci5zZWFyY2hQaXBlbGluZS5hZGQoXG4gICAgbHVuci5zdGVtbWVyXG4gIClcblxuICBjb25maWcuY2FsbChidWlsZGVyLCBidWlsZGVyKVxuICByZXR1cm4gYnVpbGRlci5idWlsZCgpXG59XG5cbmx1bnIudmVyc2lvbiA9IFwiMi4zLjlcIlxuLyohXG4gKiBsdW5yLnV0aWxzXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjAgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKi9cblxuLyoqXG4gKiBBIG5hbWVzcGFjZSBjb250YWluaW5nIHV0aWxzIGZvciB0aGUgcmVzdCBvZiB0aGUgbHVuciBsaWJyYXJ5XG4gKiBAbmFtZXNwYWNlIGx1bnIudXRpbHNcbiAqL1xubHVuci51dGlscyA9IHt9XG5cbi8qKlxuICogUHJpbnQgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gYmUgcHJpbnRlZC5cbiAqIEBtZW1iZXJPZiBsdW5yLnV0aWxzXG4gKiBAZnVuY3Rpb25cbiAqL1xubHVuci51dGlscy53YXJuID0gKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAoZ2xvYmFsLmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICBjb25zb2xlLndhcm4obWVzc2FnZSlcbiAgICB9XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG59KSh0aGlzKVxuXG4vKipcbiAqIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgc3RyaW5nLlxuICpcbiAqIEluIHRoZSBjYXNlIG9mIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdGhlIGZ1bmN0aW9uIHJldHVybnNcbiAqIHRoZSBlbXB0eSBzdHJpbmcsIGluIGFsbCBvdGhlciBjYXNlcyB0aGUgcmVzdWx0IG9mIGNhbGxpbmdcbiAqIGB0b1N0cmluZ2Agb24gdGhlIHBhc3NlZCBvYmplY3QgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtBbnl9IG9iaiBUaGUgb2JqZWN0IHRvIGNvbnZlcnQgdG8gYSBzdHJpbmcuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgcGFzc2VkIG9iamVjdC5cbiAqIEBtZW1iZXJPZiBsdW5yLnV0aWxzXG4gKi9cbmx1bnIudXRpbHMuYXNTdHJpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gIGlmIChvYmogPT09IHZvaWQgMCB8fCBvYmogPT09IG51bGwpIHtcbiAgICByZXR1cm4gXCJcIlxuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmoudG9TdHJpbmcoKVxuICB9XG59XG5cbi8qKlxuICogQ2xvbmVzIGFuIG9iamVjdC5cbiAqXG4gKiBXaWxsIGNyZWF0ZSBhIGNvcHkgb2YgYW4gZXhpc3Rpbmcgb2JqZWN0IHN1Y2ggdGhhdCBhbnkgbXV0YXRpb25zXG4gKiBvbiB0aGUgY29weSBjYW5ub3QgYWZmZWN0IHRoZSBvcmlnaW5hbC5cbiAqXG4gKiBPbmx5IHNoYWxsb3cgb2JqZWN0cyBhcmUgc3VwcG9ydGVkLCBwYXNzaW5nIGEgbmVzdGVkIG9iamVjdCB0byB0aGlzXG4gKiBmdW5jdGlvbiB3aWxsIGNhdXNlIGEgVHlwZUVycm9yLlxuICpcbiAqIE9iamVjdHMgd2l0aCBwcmltaXRpdmVzLCBhbmQgYXJyYXlzIG9mIHByaW1pdGl2ZXMgYXJlIHN1cHBvcnRlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJuIHtPYmplY3R9IGEgY2xvbmUgb2YgdGhlIHBhc3NlZCBvYmplY3QuXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IHdoZW4gYSBuZXN0ZWQgb2JqZWN0IGlzIHBhc3NlZC5cbiAqIEBtZW1iZXJPZiBVdGlsc1xuICovXG5sdW5yLnV0aWxzLmNsb25lID0gZnVuY3Rpb24gKG9iaikge1xuICBpZiAob2JqID09PSBudWxsIHx8IG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG9ialxuICB9XG5cbiAgdmFyIGNsb25lID0gT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV0sXG4gICAgICAgIHZhbCA9IG9ialtrZXldXG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICBjbG9uZVtrZXldID0gdmFsLnNsaWNlKClcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgIHR5cGVvZiB2YWwgPT09ICdudW1iZXInIHx8XG4gICAgICAgIHR5cGVvZiB2YWwgPT09ICdib29sZWFuJykge1xuICAgICAgY2xvbmVba2V5XSA9IHZhbFxuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2xvbmUgaXMgbm90IGRlZXAgYW5kIGRvZXMgbm90IHN1cHBvcnQgbmVzdGVkIG9iamVjdHNcIilcbiAgfVxuXG4gIHJldHVybiBjbG9uZVxufVxubHVuci5GaWVsZFJlZiA9IGZ1bmN0aW9uIChkb2NSZWYsIGZpZWxkTmFtZSwgc3RyaW5nVmFsdWUpIHtcbiAgdGhpcy5kb2NSZWYgPSBkb2NSZWZcbiAgdGhpcy5maWVsZE5hbWUgPSBmaWVsZE5hbWVcbiAgdGhpcy5fc3RyaW5nVmFsdWUgPSBzdHJpbmdWYWx1ZVxufVxuXG5sdW5yLkZpZWxkUmVmLmpvaW5lciA9IFwiL1wiXG5cbmx1bnIuRmllbGRSZWYuZnJvbVN0cmluZyA9IGZ1bmN0aW9uIChzKSB7XG4gIHZhciBuID0gcy5pbmRleE9mKGx1bnIuRmllbGRSZWYuam9pbmVyKVxuXG4gIGlmIChuID09PSAtMSkge1xuICAgIHRocm93IFwibWFsZm9ybWVkIGZpZWxkIHJlZiBzdHJpbmdcIlxuICB9XG5cbiAgdmFyIGZpZWxkUmVmID0gcy5zbGljZSgwLCBuKSxcbiAgICAgIGRvY1JlZiA9IHMuc2xpY2UobiArIDEpXG5cbiAgcmV0dXJuIG5ldyBsdW5yLkZpZWxkUmVmIChkb2NSZWYsIGZpZWxkUmVmLCBzKVxufVxuXG5sdW5yLkZpZWxkUmVmLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuX3N0cmluZ1ZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX3N0cmluZ1ZhbHVlID0gdGhpcy5maWVsZE5hbWUgKyBsdW5yLkZpZWxkUmVmLmpvaW5lciArIHRoaXMuZG9jUmVmXG4gIH1cblxuICByZXR1cm4gdGhpcy5fc3RyaW5nVmFsdWVcbn1cbi8qIVxuICogbHVuci5TZXRcbiAqIENvcHlyaWdodCAoQykgMjAyMCBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqL1xuXG4vKipcbiAqIEEgbHVuciBzZXQuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmx1bnIuU2V0ID0gZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gIHRoaXMuZWxlbWVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgaWYgKGVsZW1lbnRzKSB7XG4gICAgdGhpcy5sZW5ndGggPSBlbGVtZW50cy5sZW5ndGhcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5lbGVtZW50c1tlbGVtZW50c1tpXV0gPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMubGVuZ3RoID0gMFxuICB9XG59XG5cbi8qKlxuICogQSBjb21wbGV0ZSBzZXQgdGhhdCBjb250YWlucyBhbGwgZWxlbWVudHMuXG4gKlxuICogQHN0YXRpY1xuICogQHJlYWRvbmx5XG4gKiBAdHlwZSB7bHVuci5TZXR9XG4gKi9cbmx1bnIuU2V0LmNvbXBsZXRlID0ge1xuICBpbnRlcnNlY3Q6IGZ1bmN0aW9uIChvdGhlcikge1xuICAgIHJldHVybiBvdGhlclxuICB9LFxuXG4gIHVuaW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcblxuICBjb250YWluczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cblxuLyoqXG4gKiBBbiBlbXB0eSBzZXQgdGhhdCBjb250YWlucyBubyBlbGVtZW50cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAcmVhZG9ubHlcbiAqIEB0eXBlIHtsdW5yLlNldH1cbiAqL1xubHVuci5TZXQuZW1wdHkgPSB7XG4gIGludGVyc2VjdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzXG4gIH0sXG5cbiAgdW5pb246IGZ1bmN0aW9uIChvdGhlcikge1xuICAgIHJldHVybiBvdGhlclxuICB9LFxuXG4gIGNvbnRhaW5zOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBzZXQgY29udGFpbnMgdGhlIHNwZWNpZmllZCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCAtIE9iamVjdCB3aG9zZSBwcmVzZW5jZSBpbiB0aGlzIHNldCBpcyB0byBiZSB0ZXN0ZWQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBUcnVlIGlmIHRoaXMgc2V0IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgb2JqZWN0LlxuICovXG5sdW5yLlNldC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gIHJldHVybiAhIXRoaXMuZWxlbWVudHNbb2JqZWN0XVxufVxuXG4vKipcbiAqIFJldHVybnMgYSBuZXcgc2V0IGNvbnRhaW5pbmcgb25seSB0aGUgZWxlbWVudHMgdGhhdCBhcmUgcHJlc2VudCBpbiBib3RoXG4gKiB0aGlzIHNldCBhbmQgdGhlIHNwZWNpZmllZCBzZXQuXG4gKlxuICogQHBhcmFtIHtsdW5yLlNldH0gb3RoZXIgLSBzZXQgdG8gaW50ZXJzZWN0IHdpdGggdGhpcyBzZXQuXG4gKiBAcmV0dXJucyB7bHVuci5TZXR9IGEgbmV3IHNldCB0aGF0IGlzIHRoZSBpbnRlcnNlY3Rpb24gb2YgdGhpcyBhbmQgdGhlIHNwZWNpZmllZCBzZXQuXG4gKi9cblxubHVuci5TZXQucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uIChvdGhlcikge1xuICB2YXIgYSwgYiwgZWxlbWVudHMsIGludGVyc2VjdGlvbiA9IFtdXG5cbiAgaWYgKG90aGVyID09PSBsdW5yLlNldC5jb21wbGV0ZSkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBpZiAob3RoZXIgPT09IGx1bnIuU2V0LmVtcHR5KSB7XG4gICAgcmV0dXJuIG90aGVyXG4gIH1cblxuICBpZiAodGhpcy5sZW5ndGggPCBvdGhlci5sZW5ndGgpIHtcbiAgICBhID0gdGhpc1xuICAgIGIgPSBvdGhlclxuICB9IGVsc2Uge1xuICAgIGEgPSBvdGhlclxuICAgIGIgPSB0aGlzXG4gIH1cblxuICBlbGVtZW50cyA9IE9iamVjdC5rZXlzKGEuZWxlbWVudHMpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV1cbiAgICBpZiAoZWxlbWVudCBpbiBiLmVsZW1lbnRzKSB7XG4gICAgICBpbnRlcnNlY3Rpb24ucHVzaChlbGVtZW50KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgbHVuci5TZXQgKGludGVyc2VjdGlvbilcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IHNldCBjb21iaW5pbmcgdGhlIGVsZW1lbnRzIG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgc2V0LlxuICpcbiAqIEBwYXJhbSB7bHVuci5TZXR9IG90aGVyIC0gc2V0IHRvIHVuaW9uIHdpdGggdGhpcyBzZXQuXG4gKiBAcmV0dXJuIHtsdW5yLlNldH0gYSBuZXcgc2V0IHRoYXQgaXMgdGhlIHVuaW9uIG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgc2V0LlxuICovXG5cbmx1bnIuU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uIChvdGhlcikge1xuICBpZiAob3RoZXIgPT09IGx1bnIuU2V0LmNvbXBsZXRlKSB7XG4gICAgcmV0dXJuIGx1bnIuU2V0LmNvbXBsZXRlXG4gIH1cblxuICBpZiAob3RoZXIgPT09IGx1bnIuU2V0LmVtcHR5KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHJldHVybiBuZXcgbHVuci5TZXQoT2JqZWN0LmtleXModGhpcy5lbGVtZW50cykuY29uY2F0KE9iamVjdC5rZXlzKG90aGVyLmVsZW1lbnRzKSkpXG59XG4vKipcbiAqIEEgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIHRoZSBpbnZlcnNlIGRvY3VtZW50IGZyZXF1ZW5jeSBmb3JcbiAqIGEgcG9zdGluZy4gVGhpcyBpcyBzaGFyZWQgYmV0d2VlbiB0aGUgYnVpbGRlciBhbmQgdGhlIGluZGV4XG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBwb3N0aW5nIC0gVGhlIHBvc3RpbmcgZm9yIGEgZ2l2ZW4gdGVybVxuICogQHBhcmFtIHtudW1iZXJ9IGRvY3VtZW50Q291bnQgLSBUaGUgdG90YWwgbnVtYmVyIG9mIGRvY3VtZW50cy5cbiAqL1xubHVuci5pZGYgPSBmdW5jdGlvbiAocG9zdGluZywgZG9jdW1lbnRDb3VudCkge1xuICB2YXIgZG9jdW1lbnRzV2l0aFRlcm0gPSAwXG5cbiAgZm9yICh2YXIgZmllbGROYW1lIGluIHBvc3RpbmcpIHtcbiAgICBpZiAoZmllbGROYW1lID09ICdfaW5kZXgnKSBjb250aW51ZSAvLyBJZ25vcmUgdGhlIHRlcm0gaW5kZXgsIGl0cyBub3QgYSBmaWVsZFxuICAgIGRvY3VtZW50c1dpdGhUZXJtICs9IE9iamVjdC5rZXlzKHBvc3RpbmdbZmllbGROYW1lXSkubGVuZ3RoXG4gIH1cblxuICB2YXIgeCA9IChkb2N1bWVudENvdW50IC0gZG9jdW1lbnRzV2l0aFRlcm0gKyAwLjUpIC8gKGRvY3VtZW50c1dpdGhUZXJtICsgMC41KVxuXG4gIHJldHVybiBNYXRoLmxvZygxICsgTWF0aC5hYnMoeCkpXG59XG5cbi8qKlxuICogQSB0b2tlbiB3cmFwcyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHRva2VuXG4gKiBhcyBpdCBpcyBwYXNzZWQgdGhyb3VnaCB0aGUgdGV4dCBwcm9jZXNzaW5nIHBpcGVsaW5lLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IFtzdHI9JyddIC0gVGhlIHN0cmluZyB0b2tlbiBiZWluZyB3cmFwcGVkLlxuICogQHBhcmFtIHtvYmplY3R9IFttZXRhZGF0YT17fV0gLSBNZXRhZGF0YSBhc3NvY2lhdGVkIHdpdGggdGhpcyB0b2tlbi5cbiAqL1xubHVuci5Ub2tlbiA9IGZ1bmN0aW9uIChzdHIsIG1ldGFkYXRhKSB7XG4gIHRoaXMuc3RyID0gc3RyIHx8IFwiXCJcbiAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhIHx8IHt9XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdG9rZW4gc3RyaW5nIHRoYXQgaXMgYmVpbmcgd3JhcHBlZCBieSB0aGlzIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5sdW5yLlRva2VuLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuc3RyXG59XG5cbi8qKlxuICogQSB0b2tlbiB1cGRhdGUgZnVuY3Rpb24gaXMgdXNlZCB3aGVuIHVwZGF0aW5nIG9yIG9wdGlvbmFsbHlcbiAqIHdoZW4gY2xvbmluZyBhIHRva2VuLlxuICpcbiAqIEBjYWxsYmFjayBsdW5yLlRva2VufnVwZGF0ZUZ1bmN0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdG9rZW4uXG4gKiBAcGFyYW0ge09iamVjdH0gbWV0YWRhdGEgLSBBbGwgbWV0YWRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdG9rZW4uXG4gKi9cblxuLyoqXG4gKiBBcHBsaWVzIHRoZSBnaXZlbiBmdW5jdGlvbiB0byB0aGUgd3JhcHBlZCBzdHJpbmcgdG9rZW4uXG4gKlxuICogQGV4YW1wbGVcbiAqIHRva2VuLnVwZGF0ZShmdW5jdGlvbiAoc3RyLCBtZXRhZGF0YSkge1xuICogICByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKClcbiAqIH0pXG4gKlxuICogQHBhcmFtIHtsdW5yLlRva2VufnVwZGF0ZUZ1bmN0aW9ufSBmbiAtIEEgZnVuY3Rpb24gdG8gYXBwbHkgdG8gdGhlIHRva2VuIHN0cmluZy5cbiAqIEByZXR1cm5zIHtsdW5yLlRva2VufVxuICovXG5sdW5yLlRva2VuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdGhpcy5zdHIgPSBmbih0aGlzLnN0ciwgdGhpcy5tZXRhZGF0YSlcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyB0b2tlbi4gT3B0aW9uYWxseSBhIGZ1bmN0aW9uIGNhbiBiZVxuICogYXBwbGllZCB0byB0aGUgY2xvbmVkIHRva2VuLlxuICpcbiAqIEBwYXJhbSB7bHVuci5Ub2tlbn51cGRhdGVGdW5jdGlvbn0gW2ZuXSAtIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIHRoZSBjbG9uZWQgdG9rZW4uXG4gKiBAcmV0dXJucyB7bHVuci5Ub2tlbn1cbiAqL1xubHVuci5Ub2tlbi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgZm4gPSBmbiB8fCBmdW5jdGlvbiAocykgeyByZXR1cm4gcyB9XG4gIHJldHVybiBuZXcgbHVuci5Ub2tlbiAoZm4odGhpcy5zdHIsIHRoaXMubWV0YWRhdGEpLCB0aGlzLm1ldGFkYXRhKVxufVxuLyohXG4gKiBsdW5yLnRva2VuaXplclxuICogQ29weXJpZ2h0IChDKSAyMDIwIE9saXZlciBOaWdodGluZ2FsZVxuICovXG5cbi8qKlxuICogQSBmdW5jdGlvbiBmb3Igc3BsaXR0aW5nIGEgc3RyaW5nIGludG8gdG9rZW5zIHJlYWR5IHRvIGJlIGluc2VydGVkIGludG9cbiAqIHRoZSBzZWFyY2ggaW5kZXguIFVzZXMgYGx1bnIudG9rZW5pemVyLnNlcGFyYXRvcmAgdG8gc3BsaXQgc3RyaW5ncywgY2hhbmdlXG4gKiB0aGUgdmFsdWUgb2YgdGhpcyBwcm9wZXJ0eSB0byBjaGFuZ2UgaG93IHN0cmluZ3MgYXJlIHNwbGl0IGludG8gdG9rZW5zLlxuICpcbiAqIFRoaXMgdG9rZW5pemVyIHdpbGwgY29udmVydCBpdHMgcGFyYW1ldGVyIHRvIGEgc3RyaW5nIGJ5IGNhbGxpbmcgYHRvU3RyaW5nYCBhbmRcbiAqIHRoZW4gd2lsbCBzcGxpdCB0aGlzIHN0cmluZyBvbiB0aGUgY2hhcmFjdGVyIGluIGBsdW5yLnRva2VuaXplci5zZXBhcmF0b3JgLlxuICogQXJyYXlzIHdpbGwgaGF2ZSB0aGVpciBlbGVtZW50cyBjb252ZXJ0ZWQgdG8gc3RyaW5ncyBhbmQgd3JhcHBlZCBpbiBhIGx1bnIuVG9rZW4uXG4gKlxuICogT3B0aW9uYWwgbWV0YWRhdGEgY2FuIGJlIHBhc3NlZCB0byB0aGUgdG9rZW5pemVyLCB0aGlzIG1ldGFkYXRhIHdpbGwgYmUgY2xvbmVkIGFuZFxuICogYWRkZWQgYXMgbWV0YWRhdGEgdG8gZXZlcnkgdG9rZW4gdGhhdCBpcyBjcmVhdGVkIGZyb20gdGhlIG9iamVjdCB0byBiZSB0b2tlbml6ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHs/KHN0cmluZ3xvYmplY3R8b2JqZWN0W10pfSBvYmogLSBUaGUgb2JqZWN0IHRvIGNvbnZlcnQgaW50byB0b2tlbnNcbiAqIEBwYXJhbSB7P29iamVjdH0gbWV0YWRhdGEgLSBPcHRpb25hbCBtZXRhZGF0YSB0byBhc3NvY2lhdGUgd2l0aCBldmVyeSB0b2tlblxuICogQHJldHVybnMge2x1bnIuVG9rZW5bXX1cbiAqIEBzZWUge0BsaW5rIGx1bnIuUGlwZWxpbmV9XG4gKi9cbmx1bnIudG9rZW5pemVyID0gZnVuY3Rpb24gKG9iaiwgbWV0YWRhdGEpIHtcbiAgaWYgKG9iaiA9PSBudWxsIHx8IG9iaiA9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gb2JqLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIG5ldyBsdW5yLlRva2VuKFxuICAgICAgICBsdW5yLnV0aWxzLmFzU3RyaW5nKHQpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIGx1bnIudXRpbHMuY2xvbmUobWV0YWRhdGEpXG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIHZhciBzdHIgPSBvYmoudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgbGVuID0gc3RyLmxlbmd0aCxcbiAgICAgIHRva2VucyA9IFtdXG5cbiAgZm9yICh2YXIgc2xpY2VFbmQgPSAwLCBzbGljZVN0YXJ0ID0gMDsgc2xpY2VFbmQgPD0gbGVuOyBzbGljZUVuZCsrKSB7XG4gICAgdmFyIGNoYXIgPSBzdHIuY2hhckF0KHNsaWNlRW5kKSxcbiAgICAgICAgc2xpY2VMZW5ndGggPSBzbGljZUVuZCAtIHNsaWNlU3RhcnRcblxuICAgIGlmICgoY2hhci5tYXRjaChsdW5yLnRva2VuaXplci5zZXBhcmF0b3IpIHx8IHNsaWNlRW5kID09IGxlbikpIHtcblxuICAgICAgaWYgKHNsaWNlTGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgdG9rZW5NZXRhZGF0YSA9IGx1bnIudXRpbHMuY2xvbmUobWV0YWRhdGEpIHx8IHt9XG4gICAgICAgIHRva2VuTWV0YWRhdGFbXCJwb3NpdGlvblwiXSA9IFtzbGljZVN0YXJ0LCBzbGljZUxlbmd0aF1cbiAgICAgICAgdG9rZW5NZXRhZGF0YVtcImluZGV4XCJdID0gdG9rZW5zLmxlbmd0aFxuXG4gICAgICAgIHRva2Vucy5wdXNoKFxuICAgICAgICAgIG5ldyBsdW5yLlRva2VuIChcbiAgICAgICAgICAgIHN0ci5zbGljZShzbGljZVN0YXJ0LCBzbGljZUVuZCksXG4gICAgICAgICAgICB0b2tlbk1ldGFkYXRhXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHNsaWNlU3RhcnQgPSBzbGljZUVuZCArIDFcbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiB0b2tlbnNcbn1cblxuLyoqXG4gKiBUaGUgc2VwYXJhdG9yIHVzZWQgdG8gc3BsaXQgYSBzdHJpbmcgaW50byB0b2tlbnMuIE92ZXJyaWRlIHRoaXMgcHJvcGVydHkgdG8gY2hhbmdlIHRoZSBiZWhhdmlvdXIgb2ZcbiAqIGBsdW5yLnRva2VuaXplcmAgYmVoYXZpb3VyIHdoZW4gdG9rZW5pemluZyBzdHJpbmdzLiBCeSBkZWZhdWx0IHRoaXMgc3BsaXRzIG9uIHdoaXRlc3BhY2UgYW5kIGh5cGhlbnMuXG4gKlxuICogQHN0YXRpY1xuICogQHNlZSBsdW5yLnRva2VuaXplclxuICovXG5sdW5yLnRva2VuaXplci5zZXBhcmF0b3IgPSAvW1xcc1xcLV0rL1xuLyohXG4gKiBsdW5yLlBpcGVsaW5lXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjAgT2xpdmVyIE5pZ2h0aW5nYWxlXG4gKi9cblxuLyoqXG4gKiBsdW5yLlBpcGVsaW5lcyBtYWludGFpbiBhbiBvcmRlcmVkIGxpc3Qgb2YgZnVuY3Rpb25zIHRvIGJlIGFwcGxpZWQgdG8gYWxsXG4gKiB0b2tlbnMgaW4gZG9jdW1lbnRzIGVudGVyaW5nIHRoZSBzZWFyY2ggaW5kZXggYW5kIHF1ZXJpZXMgYmVpbmcgcmFuIGFnYWluc3RcbiAqIHRoZSBpbmRleC5cbiAqXG4gKiBBbiBpbnN0YW5jZSBvZiBsdW5yLkluZGV4IGNyZWF0ZWQgd2l0aCB0aGUgbHVuciBzaG9ydGN1dCB3aWxsIGNvbnRhaW4gYVxuICogcGlwZWxpbmUgd2l0aCBhIHN0b3Agd29yZCBmaWx0ZXIgYW5kIGFuIEVuZ2xpc2ggbGFuZ3VhZ2Ugc3RlbW1lci4gRXh0cmFcbiAqIGZ1bmN0aW9ucyBjYW4gYmUgYWRkZWQgYmVmb3JlIG9yIGFmdGVyIGVpdGhlciBvZiB0aGVzZSBmdW5jdGlvbnMgb3IgdGhlc2VcbiAqIGRlZmF1bHQgZnVuY3Rpb25zIGNhbiBiZSByZW1vdmVkLlxuICpcbiAqIFdoZW4gcnVuIHRoZSBwaXBlbGluZSB3aWxsIGNhbGwgZWFjaCBmdW5jdGlvbiBpbiB0dXJuLCBwYXNzaW5nIGEgdG9rZW4sIHRoZVxuICogaW5kZXggb2YgdGhhdCB0b2tlbiBpbiB0aGUgb3JpZ2luYWwgbGlzdCBvZiBhbGwgdG9rZW5zIGFuZCBmaW5hbGx5IGEgbGlzdCBvZlxuICogYWxsIHRoZSBvcmlnaW5hbCB0b2tlbnMuXG4gKlxuICogVGhlIG91dHB1dCBvZiBmdW5jdGlvbnMgaW4gdGhlIHBpcGVsaW5lIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBuZXh0IGZ1bmN0aW9uXG4gKiBpbiB0aGUgcGlwZWxpbmUuIFRvIGV4Y2x1ZGUgYSB0b2tlbiBmcm9tIGVudGVyaW5nIHRoZSBpbmRleCB0aGUgZnVuY3Rpb25cbiAqIHNob3VsZCByZXR1cm4gdW5kZWZpbmVkLCB0aGUgcmVzdCBvZiB0aGUgcGlwZWxpbmUgd2lsbCBub3QgYmUgY2FsbGVkIHdpdGhcbiAqIHRoaXMgdG9rZW4uXG4gKlxuICogRm9yIHNlcmlhbGlzYXRpb24gb2YgcGlwZWxpbmVzIHRvIHdvcmssIGFsbCBmdW5jdGlvbnMgdXNlZCBpbiBhbiBpbnN0YW5jZSBvZlxuICogYSBwaXBlbGluZSBzaG91bGQgYmUgcmVnaXN0ZXJlZCB3aXRoIGx1bnIuUGlwZWxpbmUuIFJlZ2lzdGVyZWQgZnVuY3Rpb25zIGNhblxuICogdGhlbiBiZSBsb2FkZWQuIElmIHRyeWluZyB0byBsb2FkIGEgc2VyaWFsaXNlZCBwaXBlbGluZSB0aGF0IHVzZXMgZnVuY3Rpb25zXG4gKiB0aGF0IGFyZSBub3QgcmVnaXN0ZXJlZCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqXG4gKiBJZiBub3QgcGxhbm5pbmcgb24gc2VyaWFsaXNpbmcgdGhlIHBpcGVsaW5lIHRoZW4gcmVnaXN0ZXJpbmcgcGlwZWxpbmUgZnVuY3Rpb25zXG4gKiBpcyBub3QgbmVjZXNzYXJ5LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5sdW5yLlBpcGVsaW5lID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9zdGFjayA9IFtdXG59XG5cbmx1bnIuUGlwZWxpbmUucmVnaXN0ZXJlZEZ1bmN0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuLyoqXG4gKiBBIHBpcGVsaW5lIGZ1bmN0aW9uIG1hcHMgbHVuci5Ub2tlbiB0byBsdW5yLlRva2VuLiBBIGx1bnIuVG9rZW4gY29udGFpbnMgdGhlIHRva2VuXG4gKiBzdHJpbmcgYXMgd2VsbCBhcyBhbGwga25vd24gbWV0YWRhdGEuIEEgcGlwZWxpbmUgZnVuY3Rpb24gY2FuIG11dGF0ZSB0aGUgdG9rZW4gc3RyaW5nXG4gKiBvciBtdXRhdGUgKG9yIGFkZCkgbWV0YWRhdGEgZm9yIGEgZ2l2ZW4gdG9rZW4uXG4gKlxuICogQSBwaXBlbGluZSBmdW5jdGlvbiBjYW4gaW5kaWNhdGUgdGhhdCB0aGUgcGFzc2VkIHRva2VuIHNob3VsZCBiZSBkaXNjYXJkZWQgYnkgcmV0dXJuaW5nXG4gKiBudWxsLCB1bmRlZmluZWQgb3IgYW4gZW1wdHkgc3RyaW5nLiBUaGlzIHRva2VuIHdpbGwgbm90IGJlIHBhc3NlZCB0byBhbnkgZG93bnN0cmVhbSBwaXBlbGluZVxuICogZnVuY3Rpb25zIGFuZCB3aWxsIG5vdCBiZSBhZGRlZCB0byB0aGUgaW5kZXguXG4gKlxuICogTXVsdGlwbGUgdG9rZW5zIGNhbiBiZSByZXR1cm5lZCBieSByZXR1cm5pbmcgYW4gYXJyYXkgb2YgdG9rZW5zLiBFYWNoIHRva2VuIHdpbGwgYmUgcGFzc2VkXG4gKiB0byBhbnkgZG93bnN0cmVhbSBwaXBlbGluZSBmdW5jdGlvbnMgYW5kIGFsbCB3aWxsIHJldHVybmVkIHRva2VucyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBpbmRleC5cbiAqXG4gKiBBbnkgbnVtYmVyIG9mIHBpcGVsaW5lIGZ1bmN0aW9ucyBtYXkgYmUgY2hhaW5lZCB0b2dldGhlciB1c2luZyBhIGx1bnIuUGlwZWxpbmUuXG4gKlxuICogQGludGVyZmFjZSBsdW5yLlBpcGVsaW5lRnVuY3Rpb25cbiAqIEBwYXJhbSB7bHVuci5Ub2tlbn0gdG9rZW4gLSBBIHRva2VuIGZyb20gdGhlIGRvY3VtZW50IGJlaW5nIHByb2Nlc3NlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpIC0gVGhlIGluZGV4IG9mIHRoaXMgdG9rZW4gaW4gdGhlIGNvbXBsZXRlIGxpc3Qgb2YgdG9rZW5zIGZvciB0aGlzIGRvY3VtZW50L2ZpZWxkLlxuICogQHBhcmFtIHtsdW5yLlRva2VuW119IHRva2VucyAtIEFsbCB0b2tlbnMgZm9yIHRoaXMgZG9jdW1lbnQvZmllbGQuXG4gKiBAcmV0dXJucyB7KD9sdW5yLlRva2VufGx1bnIuVG9rZW5bXSl9XG4gKi9cblxuLyoqXG4gKiBSZWdpc3RlciBhIGZ1bmN0aW9uIHdpdGggdGhlIHBpcGVsaW5lLlxuICpcbiAqIEZ1bmN0aW9ucyB0aGF0IGFyZSB1c2VkIGluIHRoZSBwaXBlbGluZSBzaG91bGQgYmUgcmVnaXN0ZXJlZCBpZiB0aGUgcGlwZWxpbmVcbiAqIG5lZWRzIHRvIGJlIHNlcmlhbGlzZWQsIG9yIGEgc2VyaWFsaXNlZCBwaXBlbGluZSBuZWVkcyB0byBiZSBsb2FkZWQuXG4gKlxuICogUmVnaXN0ZXJpbmcgYSBmdW5jdGlvbiBkb2VzIG5vdCBhZGQgaXQgdG8gYSBwaXBlbGluZSwgZnVuY3Rpb25zIG11c3Qgc3RpbGwgYmVcbiAqIGFkZGVkIHRvIGluc3RhbmNlcyBvZiB0aGUgcGlwZWxpbmUgZm9yIHRoZW0gdG8gYmUgdXNlZCB3aGVuIHJ1bm5pbmcgYSBwaXBlbGluZS5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuUGlwZWxpbmVGdW5jdGlvbn0gZm4gLSBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgZm9yLlxuICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gVGhlIGxhYmVsIHRvIHJlZ2lzdGVyIHRoaXMgZnVuY3Rpb24gd2l0aFxuICovXG5sdW5yLlBpcGVsaW5lLnJlZ2lzdGVyRnVuY3Rpb24gPSBmdW5jdGlvbiAoZm4sIGxhYmVsKSB7XG4gIGlmIChsYWJlbCBpbiB0aGlzLnJlZ2lzdGVyZWRGdW5jdGlvbnMpIHtcbiAgICBsdW5yLnV0aWxzLndhcm4oJ092ZXJ3cml0aW5nIGV4aXN0aW5nIHJlZ2lzdGVyZWQgZnVuY3Rpb246ICcgKyBsYWJlbClcbiAgfVxuXG4gIGZuLmxhYmVsID0gbGFiZWxcbiAgbHVuci5QaXBlbGluZS5yZWdpc3RlcmVkRnVuY3Rpb25zW2ZuLmxhYmVsXSA9IGZuXG59XG5cbi8qKlxuICogV2FybnMgaWYgdGhlIGZ1bmN0aW9uIGlzIG5vdCByZWdpc3RlcmVkIGFzIGEgUGlwZWxpbmUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtsdW5yLlBpcGVsaW5lRnVuY3Rpb259IGZuIC0gVGhlIGZ1bmN0aW9uIHRvIGNoZWNrIGZvci5cbiAqIEBwcml2YXRlXG4gKi9cbmx1bnIuUGlwZWxpbmUud2FybklmRnVuY3Rpb25Ob3RSZWdpc3RlcmVkID0gZnVuY3Rpb24gKGZuKSB7XG4gIHZhciBpc1JlZ2lzdGVyZWQgPSBmbi5sYWJlbCAmJiAoZm4ubGFiZWwgaW4gdGhpcy5yZWdpc3RlcmVkRnVuY3Rpb25zKVxuXG4gIGlmICghaXNSZWdpc3RlcmVkKSB7XG4gICAgbHVuci51dGlscy53YXJuKCdGdW5jdGlvbiBpcyBub3QgcmVnaXN0ZXJlZCB3aXRoIHBpcGVsaW5lLiBUaGlzIG1heSBjYXVzZSBwcm9ibGVtcyB3aGVuIHNlcmlhbGlzaW5nIHRoZSBpbmRleC5cXG4nLCBmbilcbiAgfVxufVxuXG4vKipcbiAqIExvYWRzIGEgcHJldmlvdXNseSBzZXJpYWxpc2VkIHBpcGVsaW5lLlxuICpcbiAqIEFsbCBmdW5jdGlvbnMgdG8gYmUgbG9hZGVkIG11c3QgYWxyZWFkeSBiZSByZWdpc3RlcmVkIHdpdGggbHVuci5QaXBlbGluZS5cbiAqIElmIGFueSBmdW5jdGlvbiBmcm9tIHRoZSBzZXJpYWxpc2VkIGRhdGEgaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQgdGhlbiBhblxuICogZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNlcmlhbGlzZWQgLSBUaGUgc2VyaWFsaXNlZCBwaXBlbGluZSB0byBsb2FkLlxuICogQHJldHVybnMge2x1bnIuUGlwZWxpbmV9XG4gKi9cbmx1bnIuUGlwZWxpbmUubG9hZCA9IGZ1bmN0aW9uIChzZXJpYWxpc2VkKSB7XG4gIHZhciBwaXBlbGluZSA9IG5ldyBsdW5yLlBpcGVsaW5lXG5cbiAgc2VyaWFsaXNlZC5mb3JFYWNoKGZ1bmN0aW9uIChmbk5hbWUpIHtcbiAgICB2YXIgZm4gPSBsdW5yLlBpcGVsaW5lLnJlZ2lzdGVyZWRGdW5jdGlvbnNbZm5OYW1lXVxuXG4gICAgaWYgKGZuKSB7XG4gICAgICBwaXBlbGluZS5hZGQoZm4pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxvYWQgdW5yZWdpc3RlcmVkIGZ1bmN0aW9uOiAnICsgZm5OYW1lKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gcGlwZWxpbmVcbn1cblxuLyoqXG4gKiBBZGRzIG5ldyBmdW5jdGlvbnMgdG8gdGhlIGVuZCBvZiB0aGUgcGlwZWxpbmUuXG4gKlxuICogTG9ncyBhIHdhcm5pbmcgaWYgdGhlIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiByZWdpc3RlcmVkLlxuICpcbiAqIEBwYXJhbSB7bHVuci5QaXBlbGluZUZ1bmN0aW9uW119IGZ1bmN0aW9ucyAtIEFueSBudW1iZXIgb2YgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGUgcGlwZWxpbmUuXG4gKi9cbmx1bnIuUGlwZWxpbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cylcblxuICBmbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICBsdW5yLlBpcGVsaW5lLndhcm5JZkZ1bmN0aW9uTm90UmVnaXN0ZXJlZChmbilcbiAgICB0aGlzLl9zdGFjay5wdXNoKGZuKVxuICB9LCB0aGlzKVxufVxuXG4vKipcbiAqIEFkZHMgYSBzaW5nbGUgZnVuY3Rpb24gYWZ0ZXIgYSBmdW5jdGlvbiB0aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoZVxuICogcGlwZWxpbmUuXG4gKlxuICogTG9ncyBhIHdhcm5pbmcgaWYgdGhlIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiByZWdpc3RlcmVkLlxuICpcbiAqIEBwYXJhbSB7bHVuci5QaXBlbGluZUZ1bmN0aW9ufSBleGlzdGluZ0ZuIC0gQSBmdW5jdGlvbiB0aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBwaXBlbGluZS5cbiAqIEBwYXJhbSB7bHVuci5QaXBlbGluZUZ1bmN0aW9ufSBuZXdGbiAtIFRoZSBuZXcgZnVuY3Rpb24gdG8gYWRkIHRvIHRoZSBwaXBlbGluZS5cbiAqL1xubHVuci5QaXBlbGluZS5wcm90b3R5cGUuYWZ0ZXIgPSBmdW5jdGlvbiAoZXhpc3RpbmdGbiwgbmV3Rm4pIHtcbiAgbHVuci5QaXBlbGluZS53YXJuSWZGdW5jdGlvbk5vdFJlZ2lzdGVyZWQobmV3Rm4pXG5cbiAgdmFyIHBvcyA9IHRoaXMuX3N0YWNrLmluZGV4T2YoZXhpc3RpbmdGbilcbiAgaWYgKHBvcyA9PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgZXhpc3RpbmdGbicpXG4gIH1cblxuICBwb3MgPSBwb3MgKyAxXG4gIHRoaXMuX3N0YWNrLnNwbGljZShwb3MsIDAsIG5ld0ZuKVxufVxuXG4vKipcbiAqIEFkZHMgYSBzaW5nbGUgZnVuY3Rpb24gYmVmb3JlIGEgZnVuY3Rpb24gdGhhdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGVcbiAqIHBpcGVsaW5lLlxuICpcbiAqIExvZ3MgYSB3YXJuaW5nIGlmIHRoZSBmdW5jdGlvbiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZC5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuUGlwZWxpbmVGdW5jdGlvbn0gZXhpc3RpbmdGbiAtIEEgZnVuY3Rpb24gdGhhdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgcGlwZWxpbmUuXG4gKiBAcGFyYW0ge2x1bnIuUGlwZWxpbmVGdW5jdGlvbn0gbmV3Rm4gLSBUaGUgbmV3IGZ1bmN0aW9uIHRvIGFkZCB0byB0aGUgcGlwZWxpbmUuXG4gKi9cbmx1bnIuUGlwZWxpbmUucHJvdG90eXBlLmJlZm9yZSA9IGZ1bmN0aW9uIChleGlzdGluZ0ZuLCBuZXdGbikge1xuICBsdW5yLlBpcGVsaW5lLndhcm5JZkZ1bmN0aW9uTm90UmVnaXN0ZXJlZChuZXdGbilcblxuICB2YXIgcG9zID0gdGhpcy5fc3RhY2suaW5kZXhPZihleGlzdGluZ0ZuKVxuICBpZiAocG9zID09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmluZCBleGlzdGluZ0ZuJylcbiAgfVxuXG4gIHRoaXMuX3N0YWNrLnNwbGljZShwb3MsIDAsIG5ld0ZuKVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYSBmdW5jdGlvbiBmcm9tIHRoZSBwaXBlbGluZS5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuUGlwZWxpbmVGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHJlbW92ZSBmcm9tIHRoZSBwaXBlbGluZS5cbiAqL1xubHVuci5QaXBlbGluZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZuKSB7XG4gIHZhciBwb3MgPSB0aGlzLl9zdGFjay5pbmRleE9mKGZuKVxuICBpZiAocG9zID09IC0xKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB0aGlzLl9zdGFjay5zcGxpY2UocG9zLCAxKVxufVxuXG4vKipcbiAqIFJ1bnMgdGhlIGN1cnJlbnQgbGlzdCBvZiBmdW5jdGlvbnMgdGhhdCBtYWtlIHVwIHRoZSBwaXBlbGluZSBhZ2FpbnN0IHRoZVxuICogcGFzc2VkIHRva2Vucy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnMgVGhlIHRva2VucyB0byBydW4gdGhyb3VnaCB0aGUgcGlwZWxpbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmx1bnIuUGlwZWxpbmUucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICh0b2tlbnMpIHtcbiAgdmFyIHN0YWNrTGVuZ3RoID0gdGhpcy5fc3RhY2subGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFja0xlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGZuID0gdGhpcy5fc3RhY2tbaV1cbiAgICB2YXIgbWVtbyA9IFtdXG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRva2Vucy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIHJlc3VsdCA9IGZuKHRva2Vuc1tqXSwgaiwgdG9rZW5zKVxuXG4gICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdm9pZCAwIHx8IHJlc3VsdCA9PT0gJycpIGNvbnRpbnVlXG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCByZXN1bHQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBtZW1vLnB1c2gocmVzdWx0W2tdKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vLnB1c2gocmVzdWx0KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRva2VucyA9IG1lbW9cbiAgfVxuXG4gIHJldHVybiB0b2tlbnNcbn1cblxuLyoqXG4gKiBDb252ZW5pZW5jZSBtZXRob2QgZm9yIHBhc3NpbmcgYSBzdHJpbmcgdGhyb3VnaCBhIHBpcGVsaW5lIGFuZCBnZXR0aW5nXG4gKiBzdHJpbmdzIG91dC4gVGhpcyBtZXRob2QgdGFrZXMgY2FyZSBvZiB3cmFwcGluZyB0aGUgcGFzc2VkIHN0cmluZyBpbiBhXG4gKiB0b2tlbiBhbmQgbWFwcGluZyB0aGUgcmVzdWx0aW5nIHRva2VucyBiYWNrIHRvIHN0cmluZ3MuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gcGFzcyB0aHJvdWdoIHRoZSBwaXBlbGluZS5cbiAqIEBwYXJhbSB7P29iamVjdH0gbWV0YWRhdGEgLSBPcHRpb25hbCBtZXRhZGF0YSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgdG9rZW5cbiAqIHBhc3NlZCB0byB0aGUgcGlwZWxpbmUuXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XG4gKi9cbmx1bnIuUGlwZWxpbmUucHJvdG90eXBlLnJ1blN0cmluZyA9IGZ1bmN0aW9uIChzdHIsIG1ldGFkYXRhKSB7XG4gIHZhciB0b2tlbiA9IG5ldyBsdW5yLlRva2VuIChzdHIsIG1ldGFkYXRhKVxuXG4gIHJldHVybiB0aGlzLnJ1bihbdG9rZW5dKS5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdC50b1N0cmluZygpXG4gIH0pXG59XG5cbi8qKlxuICogUmVzZXRzIHRoZSBwaXBlbGluZSBieSByZW1vdmluZyBhbnkgZXhpc3RpbmcgcHJvY2Vzc29ycy5cbiAqXG4gKi9cbmx1bnIuUGlwZWxpbmUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9zdGFjayA9IFtdXG59XG5cbi8qKlxuICogUmV0dXJucyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwaXBlbGluZSByZWFkeSBmb3Igc2VyaWFsaXNhdGlvbi5cbiAqXG4gKiBMb2dzIGEgd2FybmluZyBpZiB0aGUgZnVuY3Rpb24gaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQuXG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICovXG5sdW5yLlBpcGVsaW5lLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9zdGFjay5tYXAoZnVuY3Rpb24gKGZuKSB7XG4gICAgbHVuci5QaXBlbGluZS53YXJuSWZGdW5jdGlvbk5vdFJlZ2lzdGVyZWQoZm4pXG5cbiAgICByZXR1cm4gZm4ubGFiZWxcbiAgfSlcbn1cbi8qIVxuICogbHVuci5WZWN0b3JcbiAqIENvcHlyaWdodCAoQykgMjAyMCBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqL1xuXG4vKipcbiAqIEEgdmVjdG9yIGlzIHVzZWQgdG8gY29uc3RydWN0IHRoZSB2ZWN0b3Igc3BhY2Ugb2YgZG9jdW1lbnRzIGFuZCBxdWVyaWVzLiBUaGVzZVxuICogdmVjdG9ycyBzdXBwb3J0IG9wZXJhdGlvbnMgdG8gZGV0ZXJtaW5lIHRoZSBzaW1pbGFyaXR5IGJldHdlZW4gdHdvIGRvY3VtZW50cyBvclxuICogYSBkb2N1bWVudCBhbmQgYSBxdWVyeS5cbiAqXG4gKiBOb3JtYWxseSBubyBwYXJhbWV0ZXJzIGFyZSByZXF1aXJlZCBmb3IgaW5pdGlhbGl6aW5nIGEgdmVjdG9yLCBidXQgaW4gdGhlIGNhc2Ugb2ZcbiAqIGxvYWRpbmcgYSBwcmV2aW91c2x5IGR1bXBlZCB2ZWN0b3IgdGhlIHJhdyBlbGVtZW50cyBjYW4gYmUgcHJvdmlkZWQgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICpcbiAqIEZvciBwZXJmb3JtYW5jZSByZWFzb25zIHZlY3RvcnMgYXJlIGltcGxlbWVudGVkIHdpdGggYSBmbGF0IGFycmF5LCB3aGVyZSBhbiBlbGVtZW50c1xuICogaW5kZXggaXMgaW1tZWRpYXRlbHkgZm9sbG93ZWQgYnkgaXRzIHZhbHVlLiBFLmcuIFtpbmRleCwgdmFsdWUsIGluZGV4LCB2YWx1ZV0uIFRoaXNcbiAqIGFsbG93cyB0aGUgdW5kZXJseWluZyBhcnJheSB0byBiZSBhcyBzcGFyc2UgYXMgcG9zc2libGUgYW5kIHN0aWxsIG9mZmVyIGRlY2VudFxuICogcGVyZm9ybWFuY2Ugd2hlbiBiZWluZyB1c2VkIGZvciB2ZWN0b3IgY2FsY3VsYXRpb25zLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtOdW1iZXJbXX0gW2VsZW1lbnRzXSAtIFRoZSBmbGF0IGxpc3Qgb2YgZWxlbWVudCBpbmRleCBhbmQgZWxlbWVudCB2YWx1ZSBwYWlycy5cbiAqL1xubHVuci5WZWN0b3IgPSBmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgdGhpcy5fbWFnbml0dWRlID0gMFxuICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHMgfHwgW11cbn1cblxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHBvc2l0aW9uIHdpdGhpbiB0aGUgdmVjdG9yIHRvIGluc2VydCBhIGdpdmVuIGluZGV4LlxuICpcbiAqIFRoaXMgaXMgdXNlZCBpbnRlcm5hbGx5IGJ5IGluc2VydCBhbmQgdXBzZXJ0LiBJZiB0aGVyZSBhcmUgZHVwbGljYXRlIGluZGV4ZXMgdGhlblxuICogdGhlIHBvc2l0aW9uIGlzIHJldHVybmVkIGFzIGlmIHRoZSB2YWx1ZSBmb3IgdGhhdCBpbmRleCB3ZXJlIHRvIGJlIHVwZGF0ZWQsIGJ1dCBpdFxuICogaXMgdGhlIGNhbGxlcnMgcmVzcG9uc2liaWxpdHkgdG8gY2hlY2sgd2hldGhlciB0aGVyZSBpcyBhIGR1cGxpY2F0ZSBhdCB0aGF0IGluZGV4XG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGluc2VydElkeCAtIFRoZSBpbmRleCBhdCB3aGljaCB0aGUgZWxlbWVudCBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5sdW5yLlZlY3Rvci5wcm90b3R5cGUucG9zaXRpb25Gb3JJbmRleCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAvLyBGb3IgYW4gZW1wdHkgdmVjdG9yIHRoZSB0dXBsZSBjYW4gYmUgaW5zZXJ0ZWQgYXQgdGhlIGJlZ2lubmluZ1xuICBpZiAodGhpcy5lbGVtZW50cy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICB2YXIgc3RhcnQgPSAwLFxuICAgICAgZW5kID0gdGhpcy5lbGVtZW50cy5sZW5ndGggLyAyLFxuICAgICAgc2xpY2VMZW5ndGggPSBlbmQgLSBzdGFydCxcbiAgICAgIHBpdm90UG9pbnQgPSBNYXRoLmZsb29yKHNsaWNlTGVuZ3RoIC8gMiksXG4gICAgICBwaXZvdEluZGV4ID0gdGhpcy5lbGVtZW50c1twaXZvdFBvaW50ICogMl1cblxuICB3aGlsZSAoc2xpY2VMZW5ndGggPiAxKSB7XG4gICAgaWYgKHBpdm90SW5kZXggPCBpbmRleCkge1xuICAgICAgc3RhcnQgPSBwaXZvdFBvaW50XG4gICAgfVxuXG4gICAgaWYgKHBpdm90SW5kZXggPiBpbmRleCkge1xuICAgICAgZW5kID0gcGl2b3RQb2ludFxuICAgIH1cblxuICAgIGlmIChwaXZvdEluZGV4ID09IGluZGV4KSB7XG4gICAgICBicmVha1xuICAgIH1cblxuICAgIHNsaWNlTGVuZ3RoID0gZW5kIC0gc3RhcnRcbiAgICBwaXZvdFBvaW50ID0gc3RhcnQgKyBNYXRoLmZsb29yKHNsaWNlTGVuZ3RoIC8gMilcbiAgICBwaXZvdEluZGV4ID0gdGhpcy5lbGVtZW50c1twaXZvdFBvaW50ICogMl1cbiAgfVxuXG4gIGlmIChwaXZvdEluZGV4ID09IGluZGV4KSB7XG4gICAgcmV0dXJuIHBpdm90UG9pbnQgKiAyXG4gIH1cblxuICBpZiAocGl2b3RJbmRleCA+IGluZGV4KSB7XG4gICAgcmV0dXJuIHBpdm90UG9pbnQgKiAyXG4gIH1cblxuICBpZiAocGl2b3RJbmRleCA8IGluZGV4KSB7XG4gICAgcmV0dXJuIChwaXZvdFBvaW50ICsgMSkgKiAyXG4gIH1cbn1cblxuLyoqXG4gKiBJbnNlcnRzIGFuIGVsZW1lbnQgYXQgYW4gaW5kZXggd2l0aGluIHRoZSB2ZWN0b3IuXG4gKlxuICogRG9lcyBub3QgYWxsb3cgZHVwbGljYXRlcywgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGVyZSBpcyBhbHJlYWR5IGFuIGVudHJ5XG4gKiBmb3IgdGhpcyBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5zZXJ0SWR4IC0gVGhlIGluZGV4IGF0IHdoaWNoIHRoZSBlbGVtZW50IHNob3VsZCBiZSBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB2YWwgLSBUaGUgdmFsdWUgdG8gYmUgaW5zZXJ0ZWQgaW50byB0aGUgdmVjdG9yLlxuICovXG5sdW5yLlZlY3Rvci5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGluc2VydElkeCwgdmFsKSB7XG4gIHRoaXMudXBzZXJ0KGluc2VydElkeCwgdmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgXCJkdXBsaWNhdGUgaW5kZXhcIlxuICB9KVxufVxuXG4vKipcbiAqIEluc2VydHMgb3IgdXBkYXRlcyBhbiBleGlzdGluZyBpbmRleCB3aXRoaW4gdGhlIHZlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5zZXJ0SWR4IC0gVGhlIGluZGV4IGF0IHdoaWNoIHRoZSBlbGVtZW50IHNob3VsZCBiZSBpbnNlcnRlZC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB2YWwgLSBUaGUgdmFsdWUgdG8gYmUgaW5zZXJ0ZWQgaW50byB0aGUgdmVjdG9yLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBBIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGZvciB1cGRhdGVzLCB0aGUgZXhpc3RpbmcgdmFsdWUgYW5kIHRoZVxuICogcmVxdWVzdGVkIHZhbHVlIGFyZSBwYXNzZWQgYXMgYXJndW1lbnRzXG4gKi9cbmx1bnIuVmVjdG9yLnByb3RvdHlwZS51cHNlcnQgPSBmdW5jdGlvbiAoaW5zZXJ0SWR4LCB2YWwsIGZuKSB7XG4gIHRoaXMuX21hZ25pdHVkZSA9IDBcbiAgdmFyIHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbkZvckluZGV4KGluc2VydElkeClcblxuICBpZiAodGhpcy5lbGVtZW50c1twb3NpdGlvbl0gPT0gaW5zZXJ0SWR4KSB7XG4gICAgdGhpcy5lbGVtZW50c1twb3NpdGlvbiArIDFdID0gZm4odGhpcy5lbGVtZW50c1twb3NpdGlvbiArIDFdLCB2YWwpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lbGVtZW50cy5zcGxpY2UocG9zaXRpb24sIDAsIGluc2VydElkeCwgdmFsKVxuICB9XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbWFnbml0dWRlIG9mIHRoaXMgdmVjdG9yLlxuICpcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbmx1bnIuVmVjdG9yLnByb3RvdHlwZS5tYWduaXR1ZGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLl9tYWduaXR1ZGUpIHJldHVybiB0aGlzLl9tYWduaXR1ZGVcblxuICB2YXIgc3VtT2ZTcXVhcmVzID0gMCxcbiAgICAgIGVsZW1lbnRzTGVuZ3RoID0gdGhpcy5lbGVtZW50cy5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IGVsZW1lbnRzTGVuZ3RoOyBpICs9IDIpIHtcbiAgICB2YXIgdmFsID0gdGhpcy5lbGVtZW50c1tpXVxuICAgIHN1bU9mU3F1YXJlcyArPSB2YWwgKiB2YWxcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9tYWduaXR1ZGUgPSBNYXRoLnNxcnQoc3VtT2ZTcXVhcmVzKVxufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHRoaXMgdmVjdG9yIGFuZCBhbm90aGVyIHZlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuVmVjdG9yfSBvdGhlclZlY3RvciAtIFRoZSB2ZWN0b3IgdG8gY29tcHV0ZSB0aGUgZG90IHByb2R1Y3Qgd2l0aC5cbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbmx1bnIuVmVjdG9yLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAob3RoZXJWZWN0b3IpIHtcbiAgdmFyIGRvdFByb2R1Y3QgPSAwLFxuICAgICAgYSA9IHRoaXMuZWxlbWVudHMsIGIgPSBvdGhlclZlY3Rvci5lbGVtZW50cyxcbiAgICAgIGFMZW4gPSBhLmxlbmd0aCwgYkxlbiA9IGIubGVuZ3RoLFxuICAgICAgYVZhbCA9IDAsIGJWYWwgPSAwLFxuICAgICAgaSA9IDAsIGogPSAwXG5cbiAgd2hpbGUgKGkgPCBhTGVuICYmIGogPCBiTGVuKSB7XG4gICAgYVZhbCA9IGFbaV0sIGJWYWwgPSBiW2pdXG4gICAgaWYgKGFWYWwgPCBiVmFsKSB7XG4gICAgICBpICs9IDJcbiAgICB9IGVsc2UgaWYgKGFWYWwgPiBiVmFsKSB7XG4gICAgICBqICs9IDJcbiAgICB9IGVsc2UgaWYgKGFWYWwgPT0gYlZhbCkge1xuICAgICAgZG90UHJvZHVjdCArPSBhW2kgKyAxXSAqIGJbaiArIDFdXG4gICAgICBpICs9IDJcbiAgICAgIGogKz0gMlxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkb3RQcm9kdWN0XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc2ltaWxhcml0eSBiZXR3ZWVuIHRoaXMgdmVjdG9yIGFuZCBhbm90aGVyIHZlY3Rvci5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuVmVjdG9yfSBvdGhlclZlY3RvciAtIFRoZSBvdGhlciB2ZWN0b3IgdG8gY2FsY3VsYXRlIHRoZVxuICogc2ltaWxhcml0eSB3aXRoLlxuICogQHJldHVybnMge051bWJlcn1cbiAqL1xubHVuci5WZWN0b3IucHJvdG90eXBlLnNpbWlsYXJpdHkgPSBmdW5jdGlvbiAob3RoZXJWZWN0b3IpIHtcbiAgcmV0dXJuIHRoaXMuZG90KG90aGVyVmVjdG9yKSAvIHRoaXMubWFnbml0dWRlKCkgfHwgMFxufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSB2ZWN0b3IgdG8gYW4gYXJyYXkgb2YgdGhlIGVsZW1lbnRzIHdpdGhpbiB0aGUgdmVjdG9yLlxuICpcbiAqIEByZXR1cm5zIHtOdW1iZXJbXX1cbiAqL1xubHVuci5WZWN0b3IucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXRwdXQgPSBuZXcgQXJyYXkgKHRoaXMuZWxlbWVudHMubGVuZ3RoIC8gMilcblxuICBmb3IgKHZhciBpID0gMSwgaiA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSArPSAyLCBqKyspIHtcbiAgICBvdXRwdXRbal0gPSB0aGlzLmVsZW1lbnRzW2ldXG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG5cbi8qKlxuICogQSBKU09OIHNlcmlhbGl6YWJsZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yLlxuICpcbiAqIEByZXR1cm5zIHtOdW1iZXJbXX1cbiAqL1xubHVuci5WZWN0b3IucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZWxlbWVudHNcbn1cbi8qIGVzbGludC1kaXNhYmxlICovXG4vKiFcbiAqIGx1bnIuc3RlbW1lclxuICogQ29weXJpZ2h0IChDKSAyMDIwIE9saXZlciBOaWdodGluZ2FsZVxuICogSW5jbHVkZXMgY29kZSBmcm9tIC0gaHR0cDovL3RhcnRhcnVzLm9yZy9+bWFydGluL1BvcnRlclN0ZW1tZXIvanMudHh0XG4gKi9cblxuLyoqXG4gKiBsdW5yLnN0ZW1tZXIgaXMgYW4gZW5nbGlzaCBsYW5ndWFnZSBzdGVtbWVyLCB0aGlzIGlzIGEgSmF2YVNjcmlwdFxuICogaW1wbGVtZW50YXRpb24gb2YgdGhlIFBvcnRlclN0ZW1tZXIgdGFrZW4gZnJvbSBodHRwOi8vdGFydGFydXMub3JnL35tYXJ0aW5cbiAqXG4gKiBAc3RhdGljXG4gKiBAaW1wbGVtZW50cyB7bHVuci5QaXBlbGluZUZ1bmN0aW9ufVxuICogQHBhcmFtIHtsdW5yLlRva2VufSB0b2tlbiAtIFRoZSBzdHJpbmcgdG8gc3RlbVxuICogQHJldHVybnMge2x1bnIuVG9rZW59XG4gKiBAc2VlIHtAbGluayBsdW5yLlBpcGVsaW5lfVxuICogQGZ1bmN0aW9uXG4gKi9cbmx1bnIuc3RlbW1lciA9IChmdW5jdGlvbigpe1xuICB2YXIgc3RlcDJsaXN0ID0ge1xuICAgICAgXCJhdGlvbmFsXCIgOiBcImF0ZVwiLFxuICAgICAgXCJ0aW9uYWxcIiA6IFwidGlvblwiLFxuICAgICAgXCJlbmNpXCIgOiBcImVuY2VcIixcbiAgICAgIFwiYW5jaVwiIDogXCJhbmNlXCIsXG4gICAgICBcIml6ZXJcIiA6IFwiaXplXCIsXG4gICAgICBcImJsaVwiIDogXCJibGVcIixcbiAgICAgIFwiYWxsaVwiIDogXCJhbFwiLFxuICAgICAgXCJlbnRsaVwiIDogXCJlbnRcIixcbiAgICAgIFwiZWxpXCIgOiBcImVcIixcbiAgICAgIFwib3VzbGlcIiA6IFwib3VzXCIsXG4gICAgICBcIml6YXRpb25cIiA6IFwiaXplXCIsXG4gICAgICBcImF0aW9uXCIgOiBcImF0ZVwiLFxuICAgICAgXCJhdG9yXCIgOiBcImF0ZVwiLFxuICAgICAgXCJhbGlzbVwiIDogXCJhbFwiLFxuICAgICAgXCJpdmVuZXNzXCIgOiBcIml2ZVwiLFxuICAgICAgXCJmdWxuZXNzXCIgOiBcImZ1bFwiLFxuICAgICAgXCJvdXNuZXNzXCIgOiBcIm91c1wiLFxuICAgICAgXCJhbGl0aVwiIDogXCJhbFwiLFxuICAgICAgXCJpdml0aVwiIDogXCJpdmVcIixcbiAgICAgIFwiYmlsaXRpXCIgOiBcImJsZVwiLFxuICAgICAgXCJsb2dpXCIgOiBcImxvZ1wiXG4gICAgfSxcblxuICAgIHN0ZXAzbGlzdCA9IHtcbiAgICAgIFwiaWNhdGVcIiA6IFwiaWNcIixcbiAgICAgIFwiYXRpdmVcIiA6IFwiXCIsXG4gICAgICBcImFsaXplXCIgOiBcImFsXCIsXG4gICAgICBcImljaXRpXCIgOiBcImljXCIsXG4gICAgICBcImljYWxcIiA6IFwiaWNcIixcbiAgICAgIFwiZnVsXCIgOiBcIlwiLFxuICAgICAgXCJuZXNzXCIgOiBcIlwiXG4gICAgfSxcblxuICAgIGMgPSBcIlteYWVpb3VdXCIsICAgICAgICAgIC8vIGNvbnNvbmFudFxuICAgIHYgPSBcIlthZWlvdXldXCIsICAgICAgICAgIC8vIHZvd2VsXG4gICAgQyA9IGMgKyBcIlteYWVpb3V5XSpcIiwgICAgLy8gY29uc29uYW50IHNlcXVlbmNlXG4gICAgViA9IHYgKyBcIlthZWlvdV0qXCIsICAgICAgLy8gdm93ZWwgc2VxdWVuY2VcblxuICAgIG1ncjAgPSBcIl4oXCIgKyBDICsgXCIpP1wiICsgViArIEMsICAgICAgICAgICAgICAgLy8gW0NdVkMuLi4gaXMgbT4wXG4gICAgbWVxMSA9IFwiXihcIiArIEMgKyBcIik/XCIgKyBWICsgQyArIFwiKFwiICsgViArIFwiKT8kXCIsICAvLyBbQ11WQ1tWXSBpcyBtPTFcbiAgICBtZ3IxID0gXCJeKFwiICsgQyArIFwiKT9cIiArIFYgKyBDICsgViArIEMsICAgICAgIC8vIFtDXVZDVkMuLi4gaXMgbT4xXG4gICAgc192ID0gXCJeKFwiICsgQyArIFwiKT9cIiArIHY7ICAgICAgICAgICAgICAgICAgIC8vIHZvd2VsIGluIHN0ZW1cblxuICB2YXIgcmVfbWdyMCA9IG5ldyBSZWdFeHAobWdyMCk7XG4gIHZhciByZV9tZ3IxID0gbmV3IFJlZ0V4cChtZ3IxKTtcbiAgdmFyIHJlX21lcTEgPSBuZXcgUmVnRXhwKG1lcTEpO1xuICB2YXIgcmVfc192ID0gbmV3IFJlZ0V4cChzX3YpO1xuXG4gIHZhciByZV8xYSA9IC9eKC4rPykoc3N8aSllcyQvO1xuICB2YXIgcmUyXzFhID0gL14oLis/KShbXnNdKXMkLztcbiAgdmFyIHJlXzFiID0gL14oLis/KWVlZCQvO1xuICB2YXIgcmUyXzFiID0gL14oLis/KShlZHxpbmcpJC87XG4gIHZhciByZV8xYl8yID0gLy4kLztcbiAgdmFyIHJlMl8xYl8yID0gLyhhdHxibHxpeikkLztcbiAgdmFyIHJlM18xYl8yID0gbmV3IFJlZ0V4cChcIihbXmFlaW91eWxzel0pXFxcXDEkXCIpO1xuICB2YXIgcmU0XzFiXzIgPSBuZXcgUmVnRXhwKFwiXlwiICsgQyArIHYgKyBcIlteYWVpb3V3eHldJFwiKTtcblxuICB2YXIgcmVfMWMgPSAvXiguKz9bXmFlaW91XSl5JC87XG4gIHZhciByZV8yID0gL14oLis/KShhdGlvbmFsfHRpb25hbHxlbmNpfGFuY2l8aXplcnxibGl8YWxsaXxlbnRsaXxlbGl8b3VzbGl8aXphdGlvbnxhdGlvbnxhdG9yfGFsaXNtfGl2ZW5lc3N8ZnVsbmVzc3xvdXNuZXNzfGFsaXRpfGl2aXRpfGJpbGl0aXxsb2dpKSQvO1xuXG4gIHZhciByZV8zID0gL14oLis/KShpY2F0ZXxhdGl2ZXxhbGl6ZXxpY2l0aXxpY2FsfGZ1bHxuZXNzKSQvO1xuXG4gIHZhciByZV80ID0gL14oLis/KShhbHxhbmNlfGVuY2V8ZXJ8aWN8YWJsZXxpYmxlfGFudHxlbWVudHxtZW50fGVudHxvdXxpc218YXRlfGl0aXxvdXN8aXZlfGl6ZSkkLztcbiAgdmFyIHJlMl80ID0gL14oLis/KShzfHQpKGlvbikkLztcblxuICB2YXIgcmVfNSA9IC9eKC4rPyllJC87XG4gIHZhciByZV81XzEgPSAvbGwkLztcbiAgdmFyIHJlM181ID0gbmV3IFJlZ0V4cChcIl5cIiArIEMgKyB2ICsgXCJbXmFlaW91d3h5XSRcIik7XG5cbiAgdmFyIHBvcnRlclN0ZW1tZXIgPSBmdW5jdGlvbiBwb3J0ZXJTdGVtbWVyKHcpIHtcbiAgICB2YXIgc3RlbSxcbiAgICAgIHN1ZmZpeCxcbiAgICAgIGZpcnN0Y2gsXG4gICAgICByZSxcbiAgICAgIHJlMixcbiAgICAgIHJlMyxcbiAgICAgIHJlNDtcblxuICAgIGlmICh3Lmxlbmd0aCA8IDMpIHsgcmV0dXJuIHc7IH1cblxuICAgIGZpcnN0Y2ggPSB3LnN1YnN0cigwLDEpO1xuICAgIGlmIChmaXJzdGNoID09IFwieVwiKSB7XG4gICAgICB3ID0gZmlyc3RjaC50b1VwcGVyQ2FzZSgpICsgdy5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgLy8gU3RlcCAxYVxuICAgIHJlID0gcmVfMWFcbiAgICByZTIgPSByZTJfMWE7XG5cbiAgICBpZiAocmUudGVzdCh3KSkgeyB3ID0gdy5yZXBsYWNlKHJlLFwiJDEkMlwiKTsgfVxuICAgIGVsc2UgaWYgKHJlMi50ZXN0KHcpKSB7IHcgPSB3LnJlcGxhY2UocmUyLFwiJDEkMlwiKTsgfVxuXG4gICAgLy8gU3RlcCAxYlxuICAgIHJlID0gcmVfMWI7XG4gICAgcmUyID0gcmUyXzFiO1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgcmUgPSByZV9tZ3IwO1xuICAgICAgaWYgKHJlLnRlc3QoZnBbMV0pKSB7XG4gICAgICAgIHJlID0gcmVfMWJfMjtcbiAgICAgICAgdyA9IHcucmVwbGFjZShyZSxcIlwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlMi50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZTIuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXTtcbiAgICAgIHJlMiA9IHJlX3NfdjtcbiAgICAgIGlmIChyZTIudGVzdChzdGVtKSkge1xuICAgICAgICB3ID0gc3RlbTtcbiAgICAgICAgcmUyID0gcmUyXzFiXzI7XG4gICAgICAgIHJlMyA9IHJlM18xYl8yO1xuICAgICAgICByZTQgPSByZTRfMWJfMjtcbiAgICAgICAgaWYgKHJlMi50ZXN0KHcpKSB7IHcgPSB3ICsgXCJlXCI7IH1cbiAgICAgICAgZWxzZSBpZiAocmUzLnRlc3QodykpIHsgcmUgPSByZV8xYl8yOyB3ID0gdy5yZXBsYWNlKHJlLFwiXCIpOyB9XG4gICAgICAgIGVsc2UgaWYgKHJlNC50ZXN0KHcpKSB7IHcgPSB3ICsgXCJlXCI7IH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdGVwIDFjIC0gcmVwbGFjZSBzdWZmaXggeSBvciBZIGJ5IGkgaWYgcHJlY2VkZWQgYnkgYSBub24tdm93ZWwgd2hpY2ggaXMgbm90IHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHdvcmQgKHNvIGNyeSAtPiBjcmksIGJ5IC0+IGJ5LCBzYXkgLT4gc2F5KVxuICAgIHJlID0gcmVfMWM7XG4gICAgaWYgKHJlLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV07XG4gICAgICB3ID0gc3RlbSArIFwiaVwiO1xuICAgIH1cblxuICAgIC8vIFN0ZXAgMlxuICAgIHJlID0gcmVfMjtcbiAgICBpZiAocmUudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUuZXhlYyh3KTtcbiAgICAgIHN0ZW0gPSBmcFsxXTtcbiAgICAgIHN1ZmZpeCA9IGZwWzJdO1xuICAgICAgcmUgPSByZV9tZ3IwO1xuICAgICAgaWYgKHJlLnRlc3Qoc3RlbSkpIHtcbiAgICAgICAgdyA9IHN0ZW0gKyBzdGVwMmxpc3Rbc3VmZml4XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdGVwIDNcbiAgICByZSA9IHJlXzM7XG4gICAgaWYgKHJlLnRlc3QodykpIHtcbiAgICAgIHZhciBmcCA9IHJlLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV07XG4gICAgICBzdWZmaXggPSBmcFsyXTtcbiAgICAgIHJlID0gcmVfbWdyMDtcbiAgICAgIGlmIChyZS50ZXN0KHN0ZW0pKSB7XG4gICAgICAgIHcgPSBzdGVtICsgc3RlcDNsaXN0W3N1ZmZpeF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RlcCA0XG4gICAgcmUgPSByZV80O1xuICAgIHJlMiA9IHJlMl80O1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdO1xuICAgICAgcmUgPSByZV9tZ3IxO1xuICAgICAgaWYgKHJlLnRlc3Qoc3RlbSkpIHtcbiAgICAgICAgdyA9IHN0ZW07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZTIudGVzdCh3KSkge1xuICAgICAgdmFyIGZwID0gcmUyLmV4ZWModyk7XG4gICAgICBzdGVtID0gZnBbMV0gKyBmcFsyXTtcbiAgICAgIHJlMiA9IHJlX21ncjE7XG4gICAgICBpZiAocmUyLnRlc3Qoc3RlbSkpIHtcbiAgICAgICAgdyA9IHN0ZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RlcCA1XG4gICAgcmUgPSByZV81O1xuICAgIGlmIChyZS50ZXN0KHcpKSB7XG4gICAgICB2YXIgZnAgPSByZS5leGVjKHcpO1xuICAgICAgc3RlbSA9IGZwWzFdO1xuICAgICAgcmUgPSByZV9tZ3IxO1xuICAgICAgcmUyID0gcmVfbWVxMTtcbiAgICAgIHJlMyA9IHJlM181O1xuICAgICAgaWYgKHJlLnRlc3Qoc3RlbSkgfHwgKHJlMi50ZXN0KHN0ZW0pICYmICEocmUzLnRlc3Qoc3RlbSkpKSkge1xuICAgICAgICB3ID0gc3RlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZSA9IHJlXzVfMTtcbiAgICByZTIgPSByZV9tZ3IxO1xuICAgIGlmIChyZS50ZXN0KHcpICYmIHJlMi50ZXN0KHcpKSB7XG4gICAgICByZSA9IHJlXzFiXzI7XG4gICAgICB3ID0gdy5yZXBsYWNlKHJlLFwiXCIpO1xuICAgIH1cblxuICAgIC8vIGFuZCB0dXJuIGluaXRpYWwgWSBiYWNrIHRvIHlcblxuICAgIGlmIChmaXJzdGNoID09IFwieVwiKSB7XG4gICAgICB3ID0gZmlyc3RjaC50b0xvd2VyQ2FzZSgpICsgdy5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHc7XG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHJldHVybiB0b2tlbi51cGRhdGUocG9ydGVyU3RlbW1lcik7XG4gIH1cbn0pKCk7XG5cbmx1bnIuUGlwZWxpbmUucmVnaXN0ZXJGdW5jdGlvbihsdW5yLnN0ZW1tZXIsICdzdGVtbWVyJylcbi8qIVxuICogbHVuci5zdG9wV29yZEZpbHRlclxuICogQ29weXJpZ2h0IChDKSAyMDIwIE9saXZlciBOaWdodGluZ2FsZVxuICovXG5cbi8qKlxuICogbHVuci5nZW5lcmF0ZVN0b3BXb3JkRmlsdGVyIGJ1aWxkcyBhIHN0b3BXb3JkRmlsdGVyIGZ1bmN0aW9uIGZyb20gdGhlIHByb3ZpZGVkXG4gKiBsaXN0IG9mIHN0b3Agd29yZHMuXG4gKlxuICogVGhlIGJ1aWx0IGluIGx1bnIuc3RvcFdvcmRGaWx0ZXIgaXMgYnVpbHQgdXNpbmcgdGhpcyBnZW5lcmF0b3IgYW5kIGNhbiBiZSB1c2VkXG4gKiB0byBnZW5lcmF0ZSBjdXN0b20gc3RvcFdvcmRGaWx0ZXJzIGZvciBhcHBsaWNhdGlvbnMgb3Igbm9uIEVuZ2xpc2ggbGFuZ3VhZ2VzLlxuICpcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtBcnJheX0gdG9rZW4gVGhlIHRva2VuIHRvIHBhc3MgdGhyb3VnaCB0aGUgZmlsdGVyXG4gKiBAcmV0dXJucyB7bHVuci5QaXBlbGluZUZ1bmN0aW9ufVxuICogQHNlZSBsdW5yLlBpcGVsaW5lXG4gKiBAc2VlIGx1bnIuc3RvcFdvcmRGaWx0ZXJcbiAqL1xubHVuci5nZW5lcmF0ZVN0b3BXb3JkRmlsdGVyID0gZnVuY3Rpb24gKHN0b3BXb3Jkcykge1xuICB2YXIgd29yZHMgPSBzdG9wV29yZHMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBzdG9wV29yZCkge1xuICAgIG1lbW9bc3RvcFdvcmRdID0gc3RvcFdvcmRcbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcblxuICByZXR1cm4gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgaWYgKHRva2VuICYmIHdvcmRzW3Rva2VuLnRvU3RyaW5nKCldICE9PSB0b2tlbi50b1N0cmluZygpKSByZXR1cm4gdG9rZW5cbiAgfVxufVxuXG4vKipcbiAqIGx1bnIuc3RvcFdvcmRGaWx0ZXIgaXMgYW4gRW5nbGlzaCBsYW5ndWFnZSBzdG9wIHdvcmQgbGlzdCBmaWx0ZXIsIGFueSB3b3Jkc1xuICogY29udGFpbmVkIGluIHRoZSBsaXN0IHdpbGwgbm90IGJlIHBhc3NlZCB0aHJvdWdoIHRoZSBmaWx0ZXIuXG4gKlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIGluIHRoZSBQaXBlbGluZS4gSWYgdGhlIHRva2VuIGRvZXMgbm90IHBhc3MgdGhlXG4gKiBmaWx0ZXIgdGhlbiB1bmRlZmluZWQgd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBpbXBsZW1lbnRzIHtsdW5yLlBpcGVsaW5lRnVuY3Rpb259XG4gKiBAcGFyYW1zIHtsdW5yLlRva2VufSB0b2tlbiAtIEEgdG9rZW4gdG8gY2hlY2sgZm9yIGJlaW5nIGEgc3RvcCB3b3JkLlxuICogQHJldHVybnMge2x1bnIuVG9rZW59XG4gKiBAc2VlIHtAbGluayBsdW5yLlBpcGVsaW5lfVxuICovXG5sdW5yLnN0b3BXb3JkRmlsdGVyID0gbHVuci5nZW5lcmF0ZVN0b3BXb3JkRmlsdGVyKFtcbiAgJ2EnLFxuICAnYWJsZScsXG4gICdhYm91dCcsXG4gICdhY3Jvc3MnLFxuICAnYWZ0ZXInLFxuICAnYWxsJyxcbiAgJ2FsbW9zdCcsXG4gICdhbHNvJyxcbiAgJ2FtJyxcbiAgJ2Ftb25nJyxcbiAgJ2FuJyxcbiAgJ2FuZCcsXG4gICdhbnknLFxuICAnYXJlJyxcbiAgJ2FzJyxcbiAgJ2F0JyxcbiAgJ2JlJyxcbiAgJ2JlY2F1c2UnLFxuICAnYmVlbicsXG4gICdidXQnLFxuICAnYnknLFxuICAnY2FuJyxcbiAgJ2Nhbm5vdCcsXG4gICdjb3VsZCcsXG4gICdkZWFyJyxcbiAgJ2RpZCcsXG4gICdkbycsXG4gICdkb2VzJyxcbiAgJ2VpdGhlcicsXG4gICdlbHNlJyxcbiAgJ2V2ZXInLFxuICAnZXZlcnknLFxuICAnZm9yJyxcbiAgJ2Zyb20nLFxuICAnZ2V0JyxcbiAgJ2dvdCcsXG4gICdoYWQnLFxuICAnaGFzJyxcbiAgJ2hhdmUnLFxuICAnaGUnLFxuICAnaGVyJyxcbiAgJ2hlcnMnLFxuICAnaGltJyxcbiAgJ2hpcycsXG4gICdob3cnLFxuICAnaG93ZXZlcicsXG4gICdpJyxcbiAgJ2lmJyxcbiAgJ2luJyxcbiAgJ2ludG8nLFxuICAnaXMnLFxuICAnaXQnLFxuICAnaXRzJyxcbiAgJ2p1c3QnLFxuICAnbGVhc3QnLFxuICAnbGV0JyxcbiAgJ2xpa2UnLFxuICAnbGlrZWx5JyxcbiAgJ21heScsXG4gICdtZScsXG4gICdtaWdodCcsXG4gICdtb3N0JyxcbiAgJ211c3QnLFxuICAnbXknLFxuICAnbmVpdGhlcicsXG4gICdubycsXG4gICdub3InLFxuICAnbm90JyxcbiAgJ29mJyxcbiAgJ29mZicsXG4gICdvZnRlbicsXG4gICdvbicsXG4gICdvbmx5JyxcbiAgJ29yJyxcbiAgJ290aGVyJyxcbiAgJ291cicsXG4gICdvd24nLFxuICAncmF0aGVyJyxcbiAgJ3NhaWQnLFxuICAnc2F5JyxcbiAgJ3NheXMnLFxuICAnc2hlJyxcbiAgJ3Nob3VsZCcsXG4gICdzaW5jZScsXG4gICdzbycsXG4gICdzb21lJyxcbiAgJ3RoYW4nLFxuICAndGhhdCcsXG4gICd0aGUnLFxuICAndGhlaXInLFxuICAndGhlbScsXG4gICd0aGVuJyxcbiAgJ3RoZXJlJyxcbiAgJ3RoZXNlJyxcbiAgJ3RoZXknLFxuICAndGhpcycsXG4gICd0aXMnLFxuICAndG8nLFxuICAndG9vJyxcbiAgJ3R3YXMnLFxuICAndXMnLFxuICAnd2FudHMnLFxuICAnd2FzJyxcbiAgJ3dlJyxcbiAgJ3dlcmUnLFxuICAnd2hhdCcsXG4gICd3aGVuJyxcbiAgJ3doZXJlJyxcbiAgJ3doaWNoJyxcbiAgJ3doaWxlJyxcbiAgJ3dobycsXG4gICd3aG9tJyxcbiAgJ3doeScsXG4gICd3aWxsJyxcbiAgJ3dpdGgnLFxuICAnd291bGQnLFxuICAneWV0JyxcbiAgJ3lvdScsXG4gICd5b3VyJ1xuXSlcblxubHVuci5QaXBlbGluZS5yZWdpc3RlckZ1bmN0aW9uKGx1bnIuc3RvcFdvcmRGaWx0ZXIsICdzdG9wV29yZEZpbHRlcicpXG4vKiFcbiAqIGx1bnIudHJpbW1lclxuICogQ29weXJpZ2h0IChDKSAyMDIwIE9saXZlciBOaWdodGluZ2FsZVxuICovXG5cbi8qKlxuICogbHVuci50cmltbWVyIGlzIGEgcGlwZWxpbmUgZnVuY3Rpb24gZm9yIHRyaW1taW5nIG5vbiB3b3JkXG4gKiBjaGFyYWN0ZXJzIGZyb20gdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIHRva2VucyBiZWZvcmUgdGhleVxuICogZW50ZXIgdGhlIGluZGV4LlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gbWF5IG5vdCB3b3JrIGNvcnJlY3RseSBmb3Igbm9uIGxhdGluXG4gKiBjaGFyYWN0ZXJzIGFuZCBzaG91bGQgZWl0aGVyIGJlIHJlbW92ZWQgb3IgYWRhcHRlZCBmb3IgdXNlXG4gKiB3aXRoIGxhbmd1YWdlcyB3aXRoIG5vbi1sYXRpbiBjaGFyYWN0ZXJzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBpbXBsZW1lbnRzIHtsdW5yLlBpcGVsaW5lRnVuY3Rpb259XG4gKiBAcGFyYW0ge2x1bnIuVG9rZW59IHRva2VuIFRoZSB0b2tlbiB0byBwYXNzIHRocm91Z2ggdGhlIGZpbHRlclxuICogQHJldHVybnMge2x1bnIuVG9rZW59XG4gKiBAc2VlIGx1bnIuUGlwZWxpbmVcbiAqL1xubHVuci50cmltbWVyID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gIHJldHVybiB0b2tlbi51cGRhdGUoZnVuY3Rpb24gKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKC9eXFxXKy8sICcnKS5yZXBsYWNlKC9cXFcrJC8sICcnKVxuICB9KVxufVxuXG5sdW5yLlBpcGVsaW5lLnJlZ2lzdGVyRnVuY3Rpb24obHVuci50cmltbWVyLCAndHJpbW1lcicpXG4vKiFcbiAqIGx1bnIuVG9rZW5TZXRcbiAqIENvcHlyaWdodCAoQykgMjAyMCBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqL1xuXG4vKipcbiAqIEEgdG9rZW4gc2V0IGlzIHVzZWQgdG8gc3RvcmUgdGhlIHVuaXF1ZSBsaXN0IG9mIGFsbCB0b2tlbnNcbiAqIHdpdGhpbiBhbiBpbmRleC4gVG9rZW4gc2V0cyBhcmUgYWxzbyB1c2VkIHRvIHJlcHJlc2VudCBhblxuICogaW5jb21pbmcgcXVlcnkgdG8gdGhlIGluZGV4LCB0aGlzIHF1ZXJ5IHRva2VuIHNldCBhbmQgaW5kZXhcbiAqIHRva2VuIHNldCBhcmUgdGhlbiBpbnRlcnNlY3RlZCB0byBmaW5kIHdoaWNoIHRva2VucyB0byBsb29rXG4gKiB1cCBpbiB0aGUgaW52ZXJ0ZWQgaW5kZXguXG4gKlxuICogQSB0b2tlbiBzZXQgY2FuIGhvbGQgbXVsdGlwbGUgdG9rZW5zLCBhcyBpbiB0aGUgY2FzZSBvZiB0aGVcbiAqIGluZGV4IHRva2VuIHNldCwgb3IgaXQgY2FuIGhvbGQgYSBzaW5nbGUgdG9rZW4gYXMgaW4gdGhlXG4gKiBjYXNlIG9mIGEgc2ltcGxlIHF1ZXJ5IHRva2VuIHNldC5cbiAqXG4gKiBBZGRpdGlvbmFsbHkgdG9rZW4gc2V0cyBhcmUgdXNlZCB0byBwZXJmb3JtIHdpbGRjYXJkIG1hdGNoaW5nLlxuICogTGVhZGluZywgY29udGFpbmVkIGFuZCB0cmFpbGluZyB3aWxkY2FyZHMgYXJlIHN1cHBvcnRlZCwgYW5kXG4gKiBmcm9tIHRoaXMgZWRpdCBkaXN0YW5jZSBtYXRjaGluZyBjYW4gYWxzbyBiZSBwcm92aWRlZC5cbiAqXG4gKiBUb2tlbiBzZXRzIGFyZSBpbXBsZW1lbnRlZCBhcyBhIG1pbmltYWwgZmluaXRlIHN0YXRlIGF1dG9tYXRhLFxuICogd2hlcmUgYm90aCBjb21tb24gcHJlZml4ZXMgYW5kIHN1ZmZpeGVzIGFyZSBzaGFyZWQgYmV0d2VlbiB0b2tlbnMuXG4gKiBUaGlzIGhlbHBzIHRvIHJlZHVjZSB0aGUgc3BhY2UgdXNlZCBmb3Igc3RvcmluZyB0aGUgdG9rZW4gc2V0LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5sdW5yLlRva2VuU2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmZpbmFsID0gZmFsc2VcbiAgdGhpcy5lZGdlcyA9IHt9XG4gIHRoaXMuaWQgPSBsdW5yLlRva2VuU2V0Ll9uZXh0SWRcbiAgbHVuci5Ub2tlblNldC5fbmV4dElkICs9IDFcbn1cblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgbmV4dCwgYXV0byBpbmNyZW1lbnQsIGlkZW50aWZpZXIgdG8gYXNzaWduXG4gKiB0byBhIG5ldyB0b2tlblNldC5cbiAqXG4gKiBUb2tlblNldHMgcmVxdWlyZSBhIHVuaXF1ZSBpZGVudGlmaWVyIHRvIGJlIGNvcnJlY3RseSBtaW5pbWlzZWQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xubHVuci5Ub2tlblNldC5fbmV4dElkID0gMVxuXG4vKipcbiAqIENyZWF0ZXMgYSBUb2tlblNldCBpbnN0YW5jZSBmcm9tIHRoZSBnaXZlbiBzb3J0ZWQgYXJyYXkgb2Ygd29yZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmdbXX0gYXJyIC0gQSBzb3J0ZWQgYXJyYXkgb2Ygc3RyaW5ncyB0byBjcmVhdGUgdGhlIHNldCBmcm9tLlxuICogQHJldHVybnMge2x1bnIuVG9rZW5TZXR9XG4gKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIGlucHV0IGFycmF5IGlzIG5vdCBzb3J0ZWQuXG4gKi9cbmx1bnIuVG9rZW5TZXQuZnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICB2YXIgYnVpbGRlciA9IG5ldyBsdW5yLlRva2VuU2V0LkJ1aWxkZXJcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYnVpbGRlci5pbnNlcnQoYXJyW2ldKVxuICB9XG5cbiAgYnVpbGRlci5maW5pc2goKVxuICByZXR1cm4gYnVpbGRlci5yb290XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRva2VuIHNldCBmcm9tIGEgcXVlcnkgY2xhdXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2xhdXNlIC0gQSBzaW5nbGUgY2xhdXNlIGZyb20gbHVuci5RdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGF1c2UudGVybSAtIFRoZSBxdWVyeSBjbGF1c2UgdGVybS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY2xhdXNlLmVkaXREaXN0YW5jZV0gLSBUaGUgb3B0aW9uYWwgZWRpdCBkaXN0YW5jZSBmb3IgdGhlIHRlcm0uXG4gKiBAcmV0dXJucyB7bHVuci5Ub2tlblNldH1cbiAqL1xubHVuci5Ub2tlblNldC5mcm9tQ2xhdXNlID0gZnVuY3Rpb24gKGNsYXVzZSkge1xuICBpZiAoJ2VkaXREaXN0YW5jZScgaW4gY2xhdXNlKSB7XG4gICAgcmV0dXJuIGx1bnIuVG9rZW5TZXQuZnJvbUZ1enp5U3RyaW5nKGNsYXVzZS50ZXJtLCBjbGF1c2UuZWRpdERpc3RhbmNlKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBsdW5yLlRva2VuU2V0LmZyb21TdHJpbmcoY2xhdXNlLnRlcm0pXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdG9rZW4gc2V0IHJlcHJlc2VudGluZyBhIHNpbmdsZSBzdHJpbmcgd2l0aCBhIHNwZWNpZmllZFxuICogZWRpdCBkaXN0YW5jZS5cbiAqXG4gKiBJbnNlcnRpb25zLCBkZWxldGlvbnMsIHN1YnN0aXR1dGlvbnMgYW5kIHRyYW5zcG9zaXRpb25zIGFyZSBlYWNoXG4gKiB0cmVhdGVkIGFzIGFuIGVkaXQgZGlzdGFuY2Ugb2YgMS5cbiAqXG4gKiBJbmNyZWFzaW5nIHRoZSBhbGxvd2VkIGVkaXQgZGlzdGFuY2Ugd2lsbCBoYXZlIGEgZHJhbWF0aWMgaW1wYWN0XG4gKiBvbiB0aGUgcGVyZm9ybWFuY2Ugb2YgYm90aCBjcmVhdGluZyBhbmQgaW50ZXJzZWN0aW5nIHRoZXNlIFRva2VuU2V0cy5cbiAqIEl0IGlzIGFkdmlzZWQgdG8ga2VlcCB0aGUgZWRpdCBkaXN0YW5jZSBsZXNzIHRoYW4gMy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBjcmVhdGUgdGhlIHRva2VuIHNldCBmcm9tLlxuICogQHBhcmFtIHtudW1iZXJ9IGVkaXREaXN0YW5jZSAtIFRoZSBhbGxvd2VkIGVkaXQgZGlzdGFuY2UgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7bHVuci5WZWN0b3J9XG4gKi9cbmx1bnIuVG9rZW5TZXQuZnJvbUZ1enp5U3RyaW5nID0gZnVuY3Rpb24gKHN0ciwgZWRpdERpc3RhbmNlKSB7XG4gIHZhciByb290ID0gbmV3IGx1bnIuVG9rZW5TZXRcblxuICB2YXIgc3RhY2sgPSBbe1xuICAgIG5vZGU6IHJvb3QsXG4gICAgZWRpdHNSZW1haW5pbmc6IGVkaXREaXN0YW5jZSxcbiAgICBzdHI6IHN0clxuICB9XVxuXG4gIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICB2YXIgZnJhbWUgPSBzdGFjay5wb3AoKVxuXG4gICAgLy8gbm8gZWRpdFxuICAgIGlmIChmcmFtZS5zdHIubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGNoYXIgPSBmcmFtZS5zdHIuY2hhckF0KDApLFxuICAgICAgICAgIG5vRWRpdE5vZGVcblxuICAgICAgaWYgKGNoYXIgaW4gZnJhbWUubm9kZS5lZGdlcykge1xuICAgICAgICBub0VkaXROb2RlID0gZnJhbWUubm9kZS5lZGdlc1tjaGFyXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9FZGl0Tm9kZSA9IG5ldyBsdW5yLlRva2VuU2V0XG4gICAgICAgIGZyYW1lLm5vZGUuZWRnZXNbY2hhcl0gPSBub0VkaXROb2RlXG4gICAgICB9XG5cbiAgICAgIGlmIChmcmFtZS5zdHIubGVuZ3RoID09IDEpIHtcbiAgICAgICAgbm9FZGl0Tm9kZS5maW5hbCA9IHRydWVcbiAgICAgIH1cblxuICAgICAgc3RhY2sucHVzaCh7XG4gICAgICAgIG5vZGU6IG5vRWRpdE5vZGUsXG4gICAgICAgIGVkaXRzUmVtYWluaW5nOiBmcmFtZS5lZGl0c1JlbWFpbmluZyxcbiAgICAgICAgc3RyOiBmcmFtZS5zdHIuc2xpY2UoMSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGZyYW1lLmVkaXRzUmVtYWluaW5nID09IDApIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgLy8gaW5zZXJ0aW9uXG4gICAgaWYgKFwiKlwiIGluIGZyYW1lLm5vZGUuZWRnZXMpIHtcbiAgICAgIHZhciBpbnNlcnRpb25Ob2RlID0gZnJhbWUubm9kZS5lZGdlc1tcIipcIl1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGluc2VydGlvbk5vZGUgPSBuZXcgbHVuci5Ub2tlblNldFxuICAgICAgZnJhbWUubm9kZS5lZGdlc1tcIipcIl0gPSBpbnNlcnRpb25Ob2RlXG4gICAgfVxuXG4gICAgaWYgKGZyYW1lLnN0ci5sZW5ndGggPT0gMCkge1xuICAgICAgaW5zZXJ0aW9uTm9kZS5maW5hbCA9IHRydWVcbiAgICB9XG5cbiAgICBzdGFjay5wdXNoKHtcbiAgICAgIG5vZGU6IGluc2VydGlvbk5vZGUsXG4gICAgICBlZGl0c1JlbWFpbmluZzogZnJhbWUuZWRpdHNSZW1haW5pbmcgLSAxLFxuICAgICAgc3RyOiBmcmFtZS5zdHJcbiAgICB9KVxuXG4gICAgLy8gZGVsZXRpb25cbiAgICAvLyBjYW4gb25seSBkbyBhIGRlbGV0aW9uIGlmIHdlIGhhdmUgZW5vdWdoIGVkaXRzIHJlbWFpbmluZ1xuICAgIC8vIGFuZCBpZiB0aGVyZSBhcmUgY2hhcmFjdGVycyBsZWZ0IHRvIGRlbGV0ZSBpbiB0aGUgc3RyaW5nXG4gICAgaWYgKGZyYW1lLnN0ci5sZW5ndGggPiAxKSB7XG4gICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgbm9kZTogZnJhbWUubm9kZSxcbiAgICAgICAgZWRpdHNSZW1haW5pbmc6IGZyYW1lLmVkaXRzUmVtYWluaW5nIC0gMSxcbiAgICAgICAgc3RyOiBmcmFtZS5zdHIuc2xpY2UoMSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gZGVsZXRpb25cbiAgICAvLyBqdXN0IHJlbW92aW5nIHRoZSBsYXN0IGNoYXJhY3RlciBmcm9tIHRoZSBzdHJcbiAgICBpZiAoZnJhbWUuc3RyLmxlbmd0aCA9PSAxKSB7XG4gICAgICBmcmFtZS5ub2RlLmZpbmFsID0gdHJ1ZVxuICAgIH1cblxuICAgIC8vIHN1YnN0aXR1dGlvblxuICAgIC8vIGNhbiBvbmx5IGRvIGEgc3Vic3RpdHV0aW9uIGlmIHdlIGhhdmUgZW5vdWdoIGVkaXRzIHJlbWFpbmluZ1xuICAgIC8vIGFuZCBpZiB0aGVyZSBhcmUgY2hhcmFjdGVycyBsZWZ0IHRvIHN1YnN0aXR1dGVcbiAgICBpZiAoZnJhbWUuc3RyLmxlbmd0aCA+PSAxKSB7XG4gICAgICBpZiAoXCIqXCIgaW4gZnJhbWUubm9kZS5lZGdlcykge1xuICAgICAgICB2YXIgc3Vic3RpdHV0aW9uTm9kZSA9IGZyYW1lLm5vZGUuZWRnZXNbXCIqXCJdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc3Vic3RpdHV0aW9uTm9kZSA9IG5ldyBsdW5yLlRva2VuU2V0XG4gICAgICAgIGZyYW1lLm5vZGUuZWRnZXNbXCIqXCJdID0gc3Vic3RpdHV0aW9uTm9kZVxuICAgICAgfVxuXG4gICAgICBpZiAoZnJhbWUuc3RyLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIHN1YnN0aXR1dGlvbk5vZGUuZmluYWwgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIHN0YWNrLnB1c2goe1xuICAgICAgICBub2RlOiBzdWJzdGl0dXRpb25Ob2RlLFxuICAgICAgICBlZGl0c1JlbWFpbmluZzogZnJhbWUuZWRpdHNSZW1haW5pbmcgLSAxLFxuICAgICAgICBzdHI6IGZyYW1lLnN0ci5zbGljZSgxKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyB0cmFuc3Bvc2l0aW9uXG4gICAgLy8gY2FuIG9ubHkgZG8gYSB0cmFuc3Bvc2l0aW9uIGlmIHRoZXJlIGFyZSBlZGl0cyByZW1haW5pbmdcbiAgICAvLyBhbmQgdGhlcmUgYXJlIGVub3VnaCBjaGFyYWN0ZXJzIHRvIHRyYW5zcG9zZVxuICAgIGlmIChmcmFtZS5zdHIubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIGNoYXJBID0gZnJhbWUuc3RyLmNoYXJBdCgwKSxcbiAgICAgICAgICBjaGFyQiA9IGZyYW1lLnN0ci5jaGFyQXQoMSksXG4gICAgICAgICAgdHJhbnNwb3NlTm9kZVxuXG4gICAgICBpZiAoY2hhckIgaW4gZnJhbWUubm9kZS5lZGdlcykge1xuICAgICAgICB0cmFuc3Bvc2VOb2RlID0gZnJhbWUubm9kZS5lZGdlc1tjaGFyQl1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYW5zcG9zZU5vZGUgPSBuZXcgbHVuci5Ub2tlblNldFxuICAgICAgICBmcmFtZS5ub2RlLmVkZ2VzW2NoYXJCXSA9IHRyYW5zcG9zZU5vZGVcbiAgICAgIH1cblxuICAgICAgaWYgKGZyYW1lLnN0ci5sZW5ndGggPT0gMSkge1xuICAgICAgICB0cmFuc3Bvc2VOb2RlLmZpbmFsID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgbm9kZTogdHJhbnNwb3NlTm9kZSxcbiAgICAgICAgZWRpdHNSZW1haW5pbmc6IGZyYW1lLmVkaXRzUmVtYWluaW5nIC0gMSxcbiAgICAgICAgc3RyOiBjaGFyQSArIGZyYW1lLnN0ci5zbGljZSgyKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcm9vdFxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBUb2tlblNldCBmcm9tIGEgc3RyaW5nLlxuICpcbiAqIFRoZSBzdHJpbmcgbWF5IGNvbnRhaW4gb25lIG9yIG1vcmUgd2lsZGNhcmQgY2hhcmFjdGVycyAoKilcbiAqIHRoYXQgd2lsbCBhbGxvdyB3aWxkY2FyZCBtYXRjaGluZyB3aGVuIGludGVyc2VjdGluZyB3aXRoXG4gKiBhbm90aGVyIFRva2VuU2V0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBUaGUgc3RyaW5nIHRvIGNyZWF0ZSBhIFRva2VuU2V0IGZyb20uXG4gKiBAcmV0dXJucyB7bHVuci5Ub2tlblNldH1cbiAqL1xubHVuci5Ub2tlblNldC5mcm9tU3RyaW5nID0gZnVuY3Rpb24gKHN0cikge1xuICB2YXIgbm9kZSA9IG5ldyBsdW5yLlRva2VuU2V0LFxuICAgICAgcm9vdCA9IG5vZGVcblxuICAvKlxuICAgKiBJdGVyYXRlcyB0aHJvdWdoIGFsbCBjaGFyYWN0ZXJzIHdpdGhpbiB0aGUgcGFzc2VkIHN0cmluZ1xuICAgKiBhcHBlbmRpbmcgYSBub2RlIGZvciBlYWNoIGNoYXJhY3Rlci5cbiAgICpcbiAgICogV2hlbiBhIHdpbGRjYXJkIGNoYXJhY3RlciBpcyBmb3VuZCB0aGVuIGEgc2VsZlxuICAgKiByZWZlcmVuY2luZyBlZGdlIGlzIGludHJvZHVjZWQgdG8gY29udGludWFsbHkgbWF0Y2hcbiAgICogYW55IG51bWJlciBvZiBhbnkgY2hhcmFjdGVycy5cbiAgICovXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzdHIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgY2hhciA9IHN0cltpXSxcbiAgICAgICAgZmluYWwgPSAoaSA9PSBsZW4gLSAxKVxuXG4gICAgaWYgKGNoYXIgPT0gXCIqXCIpIHtcbiAgICAgIG5vZGUuZWRnZXNbY2hhcl0gPSBub2RlXG4gICAgICBub2RlLmZpbmFsID0gZmluYWxcblxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbmV4dCA9IG5ldyBsdW5yLlRva2VuU2V0XG4gICAgICBuZXh0LmZpbmFsID0gZmluYWxcblxuICAgICAgbm9kZS5lZGdlc1tjaGFyXSA9IG5leHRcbiAgICAgIG5vZGUgPSBuZXh0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJvb3Rcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyB0aGlzIFRva2VuU2V0IGludG8gYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICogY29udGFpbmVkIHdpdGhpbiB0aGUgVG9rZW5TZXQuXG4gKlxuICogVGhpcyBpcyBub3QgaW50ZW5kZWQgdG8gYmUgdXNlZCBvbiBhIFRva2VuU2V0IHRoYXRcbiAqIGNvbnRhaW5zIHdpbGRjYXJkcywgaW4gdGhlc2UgY2FzZXMgdGhlIHJlc3VsdHMgYXJlXG4gKiB1bmRlZmluZWQgYW5kIGFyZSBsaWtlbHkgdG8gY2F1c2UgYW4gaW5maW5pdGUgbG9vcC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XG4gKi9cbmx1bnIuVG9rZW5TZXQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB3b3JkcyA9IFtdXG5cbiAgdmFyIHN0YWNrID0gW3tcbiAgICBwcmVmaXg6IFwiXCIsXG4gICAgbm9kZTogdGhpc1xuICB9XVxuXG4gIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICB2YXIgZnJhbWUgPSBzdGFjay5wb3AoKSxcbiAgICAgICAgZWRnZXMgPSBPYmplY3Qua2V5cyhmcmFtZS5ub2RlLmVkZ2VzKSxcbiAgICAgICAgbGVuID0gZWRnZXMubGVuZ3RoXG5cbiAgICBpZiAoZnJhbWUubm9kZS5maW5hbCkge1xuICAgICAgLyogSW4gU2FmYXJpLCBhdCB0aGlzIHBvaW50IHRoZSBwcmVmaXggaXMgc29tZXRpbWVzIGNvcnJ1cHRlZCwgc2VlOlxuICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL29saXZlcm5uL2x1bnIuanMvaXNzdWVzLzI3OSBDYWxsaW5nIGFueVxuICAgICAgICogU3RyaW5nLnByb3RvdHlwZSBtZXRob2QgZm9yY2VzIFNhZmFyaSB0byBcImNhc3RcIiB0aGlzIHN0cmluZyB0byB3aGF0XG4gICAgICAgKiBpdCdzIHN1cHBvc2VkIHRvIGJlLCBmaXhpbmcgdGhlIGJ1Zy4gKi9cbiAgICAgIGZyYW1lLnByZWZpeC5jaGFyQXQoMClcbiAgICAgIHdvcmRzLnB1c2goZnJhbWUucHJlZml4KVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBlZGdlID0gZWRnZXNbaV1cblxuICAgICAgc3RhY2sucHVzaCh7XG4gICAgICAgIHByZWZpeDogZnJhbWUucHJlZml4LmNvbmNhdChlZGdlKSxcbiAgICAgICAgbm9kZTogZnJhbWUubm9kZS5lZGdlc1tlZGdlXVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gd29yZHNcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBUb2tlblNldC5cbiAqXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIGFsbG93IFRva2VuU2V0cyB0byBiZSB1c2VkIGFzIGtleXNcbiAqIGluIG9iamVjdHMsIGxhcmdlbHkgdG8gYWlkIHRoZSBjb25zdHJ1Y3Rpb24gYW5kIG1pbmltaXNhdGlvblxuICogb2YgYSBUb2tlblNldC4gQXMgc3VjaCBpdCBpcyBub3QgZGVzaWduZWQgdG8gYmUgYSBodW1hblxuICogZnJpZW5kbHkgcmVwcmVzZW50YXRpb24gb2YgdGhlIFRva2VuU2V0LlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmx1bnIuVG9rZW5TZXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAvLyBOT1RFOiBVc2luZyBPYmplY3Qua2V5cyBoZXJlIGFzIHRoaXMuZWRnZXMgaXMgdmVyeSBsaWtlbHlcbiAgLy8gdG8gZW50ZXIgJ2hhc2gtbW9kZScgd2l0aCBtYW55IGtleXMgYmVpbmcgYWRkZWRcbiAgLy9cbiAgLy8gYXZvaWRpbmcgYSBmb3ItaW4gbG9vcCBoZXJlIGFzIGl0IGxlYWRzIHRvIHRoZSBmdW5jdGlvblxuICAvLyBiZWluZyBkZS1vcHRpbWlzZWQgKGF0IGxlYXN0IGluIFY4KS4gRnJvbSBzb21lIHNpbXBsZVxuICAvLyBiZW5jaG1hcmtzIHRoZSBwZXJmb3JtYW5jZSBpcyBjb21wYXJhYmxlLCBidXQgYWxsb3dpbmdcbiAgLy8gVjggdG8gb3B0aW1pemUgbWF5IG1lYW4gZWFzeSBwZXJmb3JtYW5jZSB3aW5zIGluIHRoZSBmdXR1cmUuXG5cbiAgaWYgKHRoaXMuX3N0cikge1xuICAgIHJldHVybiB0aGlzLl9zdHJcbiAgfVxuXG4gIHZhciBzdHIgPSB0aGlzLmZpbmFsID8gJzEnIDogJzAnLFxuICAgICAgbGFiZWxzID0gT2JqZWN0LmtleXModGhpcy5lZGdlcykuc29ydCgpLFxuICAgICAgbGVuID0gbGFiZWxzLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgbGFiZWwgPSBsYWJlbHNbaV0sXG4gICAgICAgIG5vZGUgPSB0aGlzLmVkZ2VzW2xhYmVsXVxuXG4gICAgc3RyID0gc3RyICsgbGFiZWwgKyBub2RlLmlkXG4gIH1cblxuICByZXR1cm4gc3RyXG59XG5cbi8qKlxuICogUmV0dXJucyBhIG5ldyBUb2tlblNldCB0aGF0IGlzIHRoZSBpbnRlcnNlY3Rpb24gb2ZcbiAqIHRoaXMgVG9rZW5TZXQgYW5kIHRoZSBwYXNzZWQgVG9rZW5TZXQuXG4gKlxuICogVGhpcyBpbnRlcnNlY3Rpb24gd2lsbCB0YWtlIGludG8gYWNjb3VudCBhbnkgd2lsZGNhcmRzXG4gKiBjb250YWluZWQgd2l0aGluIHRoZSBUb2tlblNldC5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuVG9rZW5TZXR9IGIgLSBBbiBvdGhlciBUb2tlblNldCB0byBpbnRlcnNlY3Qgd2l0aC5cbiAqIEByZXR1cm5zIHtsdW5yLlRva2VuU2V0fVxuICovXG5sdW5yLlRva2VuU2V0LnByb3RvdHlwZS5pbnRlcnNlY3QgPSBmdW5jdGlvbiAoYikge1xuICB2YXIgb3V0cHV0ID0gbmV3IGx1bnIuVG9rZW5TZXQsXG4gICAgICBmcmFtZSA9IHVuZGVmaW5lZFxuXG4gIHZhciBzdGFjayA9IFt7XG4gICAgcU5vZGU6IGIsXG4gICAgb3V0cHV0OiBvdXRwdXQsXG4gICAgbm9kZTogdGhpc1xuICB9XVxuXG4gIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICBmcmFtZSA9IHN0YWNrLnBvcCgpXG5cbiAgICAvLyBOT1RFOiBBcyB3aXRoIHRoZSAjdG9TdHJpbmcgbWV0aG9kLCB3ZSBhcmUgdXNpbmdcbiAgICAvLyBPYmplY3Qua2V5cyBhbmQgYSBmb3IgbG9vcCBpbnN0ZWFkIG9mIGEgZm9yLWluIGxvb3BcbiAgICAvLyBhcyBib3RoIG9mIHRoZXNlIG9iamVjdHMgZW50ZXIgJ2hhc2gnIG1vZGUsIGNhdXNpbmdcbiAgICAvLyB0aGUgZnVuY3Rpb24gdG8gYmUgZGUtb3B0aW1pc2VkIGluIFY4XG4gICAgdmFyIHFFZGdlcyA9IE9iamVjdC5rZXlzKGZyYW1lLnFOb2RlLmVkZ2VzKSxcbiAgICAgICAgcUxlbiA9IHFFZGdlcy5sZW5ndGgsXG4gICAgICAgIG5FZGdlcyA9IE9iamVjdC5rZXlzKGZyYW1lLm5vZGUuZWRnZXMpLFxuICAgICAgICBuTGVuID0gbkVkZ2VzLmxlbmd0aFxuXG4gICAgZm9yICh2YXIgcSA9IDA7IHEgPCBxTGVuOyBxKyspIHtcbiAgICAgIHZhciBxRWRnZSA9IHFFZGdlc1txXVxuXG4gICAgICBmb3IgKHZhciBuID0gMDsgbiA8IG5MZW47IG4rKykge1xuICAgICAgICB2YXIgbkVkZ2UgPSBuRWRnZXNbbl1cblxuICAgICAgICBpZiAobkVkZ2UgPT0gcUVkZ2UgfHwgcUVkZ2UgPT0gJyonKSB7XG4gICAgICAgICAgdmFyIG5vZGUgPSBmcmFtZS5ub2RlLmVkZ2VzW25FZGdlXSxcbiAgICAgICAgICAgICAgcU5vZGUgPSBmcmFtZS5xTm9kZS5lZGdlc1txRWRnZV0sXG4gICAgICAgICAgICAgIGZpbmFsID0gbm9kZS5maW5hbCAmJiBxTm9kZS5maW5hbCxcbiAgICAgICAgICAgICAgbmV4dCA9IHVuZGVmaW5lZFxuXG4gICAgICAgICAgaWYgKG5FZGdlIGluIGZyYW1lLm91dHB1dC5lZGdlcykge1xuICAgICAgICAgICAgLy8gYW4gZWRnZSBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyBjaGFyYWN0ZXJcbiAgICAgICAgICAgIC8vIG5vIG5lZWQgdG8gY3JlYXRlIGEgbmV3IG5vZGUsIGp1c3Qgc2V0IHRoZSBmaW5hbGl0eVxuICAgICAgICAgICAgLy8gYml0IHVubGVzcyB0aGlzIG5vZGUgaXMgYWxyZWFkeSBmaW5hbFxuICAgICAgICAgICAgbmV4dCA9IGZyYW1lLm91dHB1dC5lZGdlc1tuRWRnZV1cbiAgICAgICAgICAgIG5leHQuZmluYWwgPSBuZXh0LmZpbmFsIHx8IGZpbmFsXG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbm8gZWRnZSBleGlzdHMgeWV0LCBtdXN0IGNyZWF0ZSBvbmVcbiAgICAgICAgICAgIC8vIHNldCB0aGUgZmluYWxpdHkgYml0IGFuZCBpbnNlcnQgaXRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIG91dHB1dFxuICAgICAgICAgICAgbmV4dCA9IG5ldyBsdW5yLlRva2VuU2V0XG4gICAgICAgICAgICBuZXh0LmZpbmFsID0gZmluYWxcbiAgICAgICAgICAgIGZyYW1lLm91dHB1dC5lZGdlc1tuRWRnZV0gPSBuZXh0XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3RhY2sucHVzaCh7XG4gICAgICAgICAgICBxTm9kZTogcU5vZGUsXG4gICAgICAgICAgICBvdXRwdXQ6IG5leHQsXG4gICAgICAgICAgICBub2RlOiBub2RlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cbmx1bnIuVG9rZW5TZXQuQnVpbGRlciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5wcmV2aW91c1dvcmQgPSBcIlwiXG4gIHRoaXMucm9vdCA9IG5ldyBsdW5yLlRva2VuU2V0XG4gIHRoaXMudW5jaGVja2VkTm9kZXMgPSBbXVxuICB0aGlzLm1pbmltaXplZE5vZGVzID0ge31cbn1cblxubHVuci5Ub2tlblNldC5CdWlsZGVyLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAod29yZCkge1xuICB2YXIgbm9kZSxcbiAgICAgIGNvbW1vblByZWZpeCA9IDBcblxuICBpZiAod29yZCA8IHRoaXMucHJldmlvdXNXb3JkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yIChcIk91dCBvZiBvcmRlciB3b3JkIGluc2VydGlvblwiKVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3JkLmxlbmd0aCAmJiBpIDwgdGhpcy5wcmV2aW91c1dvcmQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAod29yZFtpXSAhPSB0aGlzLnByZXZpb3VzV29yZFtpXSkgYnJlYWtcbiAgICBjb21tb25QcmVmaXgrK1xuICB9XG5cbiAgdGhpcy5taW5pbWl6ZShjb21tb25QcmVmaXgpXG5cbiAgaWYgKHRoaXMudW5jaGVja2VkTm9kZXMubGVuZ3RoID09IDApIHtcbiAgICBub2RlID0gdGhpcy5yb290XG4gIH0gZWxzZSB7XG4gICAgbm9kZSA9IHRoaXMudW5jaGVja2VkTm9kZXNbdGhpcy51bmNoZWNrZWROb2Rlcy5sZW5ndGggLSAxXS5jaGlsZFxuICB9XG5cbiAgZm9yICh2YXIgaSA9IGNvbW1vblByZWZpeDsgaSA8IHdvcmQubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbmV4dE5vZGUgPSBuZXcgbHVuci5Ub2tlblNldCxcbiAgICAgICAgY2hhciA9IHdvcmRbaV1cblxuICAgIG5vZGUuZWRnZXNbY2hhcl0gPSBuZXh0Tm9kZVxuXG4gICAgdGhpcy51bmNoZWNrZWROb2Rlcy5wdXNoKHtcbiAgICAgIHBhcmVudDogbm9kZSxcbiAgICAgIGNoYXI6IGNoYXIsXG4gICAgICBjaGlsZDogbmV4dE5vZGVcbiAgICB9KVxuXG4gICAgbm9kZSA9IG5leHROb2RlXG4gIH1cblxuICBub2RlLmZpbmFsID0gdHJ1ZVxuICB0aGlzLnByZXZpb3VzV29yZCA9IHdvcmRcbn1cblxubHVuci5Ub2tlblNldC5CdWlsZGVyLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMubWluaW1pemUoMClcbn1cblxubHVuci5Ub2tlblNldC5CdWlsZGVyLnByb3RvdHlwZS5taW5pbWl6ZSA9IGZ1bmN0aW9uIChkb3duVG8pIHtcbiAgZm9yICh2YXIgaSA9IHRoaXMudW5jaGVja2VkTm9kZXMubGVuZ3RoIC0gMTsgaSA+PSBkb3duVG87IGktLSkge1xuICAgIHZhciBub2RlID0gdGhpcy51bmNoZWNrZWROb2Rlc1tpXSxcbiAgICAgICAgY2hpbGRLZXkgPSBub2RlLmNoaWxkLnRvU3RyaW5nKClcblxuICAgIGlmIChjaGlsZEtleSBpbiB0aGlzLm1pbmltaXplZE5vZGVzKSB7XG4gICAgICBub2RlLnBhcmVudC5lZGdlc1tub2RlLmNoYXJdID0gdGhpcy5taW5pbWl6ZWROb2Rlc1tjaGlsZEtleV1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2FjaGUgdGhlIGtleSBmb3IgdGhpcyBub2RlIHNpbmNlXG4gICAgICAvLyB3ZSBrbm93IGl0IGNhbid0IGNoYW5nZSBhbnltb3JlXG4gICAgICBub2RlLmNoaWxkLl9zdHIgPSBjaGlsZEtleVxuXG4gICAgICB0aGlzLm1pbmltaXplZE5vZGVzW2NoaWxkS2V5XSA9IG5vZGUuY2hpbGRcbiAgICB9XG5cbiAgICB0aGlzLnVuY2hlY2tlZE5vZGVzLnBvcCgpXG4gIH1cbn1cbi8qIVxuICogbHVuci5JbmRleFxuICogQ29weXJpZ2h0IChDKSAyMDIwIE9saXZlciBOaWdodGluZ2FsZVxuICovXG5cbi8qKlxuICogQW4gaW5kZXggY29udGFpbnMgdGhlIGJ1aWx0IGluZGV4IG9mIGFsbCBkb2N1bWVudHMgYW5kIHByb3ZpZGVzIGEgcXVlcnkgaW50ZXJmYWNlXG4gKiB0byB0aGUgaW5kZXguXG4gKlxuICogVXN1YWxseSBpbnN0YW5jZXMgb2YgbHVuci5JbmRleCB3aWxsIG5vdCBiZSBjcmVhdGVkIHVzaW5nIHRoaXMgY29uc3RydWN0b3IsIGluc3RlYWRcbiAqIGx1bnIuQnVpbGRlciBzaG91bGQgYmUgdXNlZCB0byBjb25zdHJ1Y3QgbmV3IGluZGV4ZXMsIG9yIGx1bnIuSW5kZXgubG9hZCBzaG91bGQgYmVcbiAqIHVzZWQgdG8gbG9hZCBwcmV2aW91c2x5IGJ1aWx0IGFuZCBzZXJpYWxpemVkIGluZGV4ZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gYXR0cnMgLSBUaGUgYXR0cmlidXRlcyBvZiB0aGUgYnVpbHQgc2VhcmNoIGluZGV4LlxuICogQHBhcmFtIHtPYmplY3R9IGF0dHJzLmludmVydGVkSW5kZXggLSBBbiBpbmRleCBvZiB0ZXJtL2ZpZWxkIHRvIGRvY3VtZW50IHJlZmVyZW5jZS5cbiAqIEBwYXJhbSB7T2JqZWN0PHN0cmluZywgbHVuci5WZWN0b3I+fSBhdHRycy5maWVsZFZlY3RvcnMgLSBGaWVsZCB2ZWN0b3JzXG4gKiBAcGFyYW0ge2x1bnIuVG9rZW5TZXR9IGF0dHJzLnRva2VuU2V0IC0gQW4gc2V0IG9mIGFsbCBjb3JwdXMgdG9rZW5zLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gYXR0cnMuZmllbGRzIC0gVGhlIG5hbWVzIG9mIGluZGV4ZWQgZG9jdW1lbnQgZmllbGRzLlxuICogQHBhcmFtIHtsdW5yLlBpcGVsaW5lfSBhdHRycy5waXBlbGluZSAtIFRoZSBwaXBlbGluZSB0byB1c2UgZm9yIHNlYXJjaCB0ZXJtcy5cbiAqL1xubHVuci5JbmRleCA9IGZ1bmN0aW9uIChhdHRycykge1xuICB0aGlzLmludmVydGVkSW5kZXggPSBhdHRycy5pbnZlcnRlZEluZGV4XG4gIHRoaXMuZmllbGRWZWN0b3JzID0gYXR0cnMuZmllbGRWZWN0b3JzXG4gIHRoaXMudG9rZW5TZXQgPSBhdHRycy50b2tlblNldFxuICB0aGlzLmZpZWxkcyA9IGF0dHJzLmZpZWxkc1xuICB0aGlzLnBpcGVsaW5lID0gYXR0cnMucGlwZWxpbmVcbn1cblxuLyoqXG4gKiBBIHJlc3VsdCBjb250YWlucyBkZXRhaWxzIG9mIGEgZG9jdW1lbnQgbWF0Y2hpbmcgYSBzZWFyY2ggcXVlcnkuXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBsdW5yLkluZGV4flJlc3VsdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHJlZiAtIFRoZSByZWZlcmVuY2Ugb2YgdGhlIGRvY3VtZW50IHRoaXMgcmVzdWx0IHJlcHJlc2VudHMuXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2NvcmUgLSBBIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEgcmVwcmVzZW50aW5nIGhvdyBzaW1pbGFyIHRoaXMgZG9jdW1lbnQgaXMgdG8gdGhlIHF1ZXJ5LlxuICogQHByb3BlcnR5IHtsdW5yLk1hdGNoRGF0YX0gbWF0Y2hEYXRhIC0gQ29udGFpbnMgbWV0YWRhdGEgYWJvdXQgdGhpcyBtYXRjaCBpbmNsdWRpbmcgd2hpY2ggdGVybShzKSBjYXVzZWQgdGhlIG1hdGNoLlxuICovXG5cbi8qKlxuICogQWx0aG91Z2ggbHVuciBwcm92aWRlcyB0aGUgYWJpbGl0eSB0byBjcmVhdGUgcXVlcmllcyB1c2luZyBsdW5yLlF1ZXJ5LCBpdCBhbHNvIHByb3ZpZGVzIGEgc2ltcGxlXG4gKiBxdWVyeSBsYW5ndWFnZSB3aGljaCBpdHNlbGYgaXMgcGFyc2VkIGludG8gYW4gaW5zdGFuY2Ugb2YgbHVuci5RdWVyeS5cbiAqXG4gKiBGb3IgcHJvZ3JhbW1hdGljYWxseSBidWlsZGluZyBxdWVyaWVzIGl0IGlzIGFkdmlzZWQgdG8gZGlyZWN0bHkgdXNlIGx1bnIuUXVlcnksIHRoZSBxdWVyeSBsYW5ndWFnZVxuICogaXMgYmVzdCB1c2VkIGZvciBodW1hbiBlbnRlcmVkIHRleHQgcmF0aGVyIHRoYW4gcHJvZ3JhbSBnZW5lcmF0ZWQgdGV4dC5cbiAqXG4gKiBBdCBpdHMgc2ltcGxlc3QgcXVlcmllcyBjYW4ganVzdCBiZSBhIHNpbmdsZSB0ZXJtLCBlLmcuIGBoZWxsb2AsIG11bHRpcGxlIHRlcm1zIGFyZSBhbHNvIHN1cHBvcnRlZFxuICogYW5kIHdpbGwgYmUgY29tYmluZWQgd2l0aCBPUiwgZS5nIGBoZWxsbyB3b3JsZGAgd2lsbCBtYXRjaCBkb2N1bWVudHMgdGhhdCBjb250YWluIGVpdGhlciAnaGVsbG8nXG4gKiBvciAnd29ybGQnLCB0aG91Z2ggdGhvc2UgdGhhdCBjb250YWluIGJvdGggd2lsbCByYW5rIGhpZ2hlciBpbiB0aGUgcmVzdWx0cy5cbiAqXG4gKiBXaWxkY2FyZHMgY2FuIGJlIGluY2x1ZGVkIGluIHRlcm1zIHRvIG1hdGNoIG9uZSBvciBtb3JlIHVuc3BlY2lmaWVkIGNoYXJhY3RlcnMsIHRoZXNlIHdpbGRjYXJkcyBjYW5cbiAqIGJlIGluc2VydGVkIGFueXdoZXJlIHdpdGhpbiB0aGUgdGVybSwgYW5kIG1vcmUgdGhhbiBvbmUgd2lsZGNhcmQgY2FuIGV4aXN0IGluIGEgc2luZ2xlIHRlcm0uIEFkZGluZ1xuICogd2lsZGNhcmRzIHdpbGwgaW5jcmVhc2UgdGhlIG51bWJlciBvZiBkb2N1bWVudHMgdGhhdCB3aWxsIGJlIGZvdW5kIGJ1dCBjYW4gYWxzbyBoYXZlIGEgbmVnYXRpdmVcbiAqIGltcGFjdCBvbiBxdWVyeSBwZXJmb3JtYW5jZSwgZXNwZWNpYWxseSB3aXRoIHdpbGRjYXJkcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGEgdGVybS5cbiAqXG4gKiBUZXJtcyBjYW4gYmUgcmVzdHJpY3RlZCB0byBzcGVjaWZpYyBmaWVsZHMsIGUuZy4gYHRpdGxlOmhlbGxvYCwgb25seSBkb2N1bWVudHMgd2l0aCB0aGUgdGVybVxuICogaGVsbG8gaW4gdGhlIHRpdGxlIGZpZWxkIHdpbGwgbWF0Y2ggdGhpcyBxdWVyeS4gVXNpbmcgYSBmaWVsZCBub3QgcHJlc2VudCBpbiB0aGUgaW5kZXggd2lsbCBsZWFkXG4gKiB0byBhbiBlcnJvciBiZWluZyB0aHJvd24uXG4gKlxuICogTW9kaWZpZXJzIGNhbiBhbHNvIGJlIGFkZGVkIHRvIHRlcm1zLCBsdW5yIHN1cHBvcnRzIGVkaXQgZGlzdGFuY2UgYW5kIGJvb3N0IG1vZGlmaWVycyBvbiB0ZXJtcy4gQSB0ZXJtXG4gKiBib29zdCB3aWxsIG1ha2UgZG9jdW1lbnRzIG1hdGNoaW5nIHRoYXQgdGVybSBzY29yZSBoaWdoZXIsIGUuZy4gYGZvb141YC4gRWRpdCBkaXN0YW5jZSBpcyBhbHNvIHN1cHBvcnRlZFxuICogdG8gcHJvdmlkZSBmdXp6eSBtYXRjaGluZywgZS5nLiAnaGVsbG9+Micgd2lsbCBtYXRjaCBkb2N1bWVudHMgd2l0aCBoZWxsbyB3aXRoIGFuIGVkaXQgZGlzdGFuY2Ugb2YgMi5cbiAqIEF2b2lkIGxhcmdlIHZhbHVlcyBmb3IgZWRpdCBkaXN0YW5jZSB0byBpbXByb3ZlIHF1ZXJ5IHBlcmZvcm1hbmNlLlxuICpcbiAqIEVhY2ggdGVybSBhbHNvIHN1cHBvcnRzIGEgcHJlc2VuY2UgbW9kaWZpZXIuIEJ5IGRlZmF1bHQgYSB0ZXJtJ3MgcHJlc2VuY2UgaW4gZG9jdW1lbnQgaXMgb3B0aW9uYWwsIGhvd2V2ZXJcbiAqIHRoaXMgY2FuIGJlIGNoYW5nZWQgdG8gZWl0aGVyIHJlcXVpcmVkIG9yIHByb2hpYml0ZWQuIEZvciBhIHRlcm0ncyBwcmVzZW5jZSB0byBiZSByZXF1aXJlZCBpbiBhIGRvY3VtZW50IHRoZVxuICogdGVybSBzaG91bGQgYmUgcHJlZml4ZWQgd2l0aCBhICcrJywgZS5nLiBgK2ZvbyBiYXJgIGlzIGEgc2VhcmNoIGZvciBkb2N1bWVudHMgdGhhdCBtdXN0IGNvbnRhaW4gJ2ZvbycgYW5kXG4gKiBvcHRpb25hbGx5IGNvbnRhaW4gJ2JhcicuIENvbnZlcnNlbHkgYSBsZWFkaW5nICctJyBzZXRzIHRoZSB0ZXJtcyBwcmVzZW5jZSB0byBwcm9oaWJpdGVkLCBpLmUuIGl0IG11c3Qgbm90XG4gKiBhcHBlYXIgaW4gYSBkb2N1bWVudCwgZS5nLiBgLWZvbyBiYXJgIGlzIGEgc2VhcmNoIGZvciBkb2N1bWVudHMgdGhhdCBkbyBub3QgY29udGFpbiAnZm9vJyBidXQgbWF5IGNvbnRhaW4gJ2JhcicuXG4gKlxuICogVG8gZXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyB0aGUgYmFja3NsYXNoIGNoYXJhY3RlciAnXFwnIGNhbiBiZSB1c2VkLCB0aGlzIGFsbG93cyBzZWFyY2hlcyB0byBpbmNsdWRlXG4gKiBjaGFyYWN0ZXJzIHRoYXQgd291bGQgbm9ybWFsbHkgYmUgY29uc2lkZXJlZCBtb2RpZmllcnMsIGUuZy4gYGZvb1xcfjJgIHdpbGwgc2VhcmNoIGZvciBhIHRlcm0gXCJmb29+MlwiIGluc3RlYWRcbiAqIG9mIGF0dGVtcHRpbmcgdG8gYXBwbHkgYSBib29zdCBvZiAyIHRvIHRoZSBzZWFyY2ggdGVybSBcImZvb1wiLlxuICpcbiAqIEB0eXBlZGVmIHtzdHJpbmd9IGx1bnIuSW5kZXh+UXVlcnlTdHJpbmdcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlNpbXBsZSBzaW5nbGUgdGVybSBxdWVyeTwvY2FwdGlvbj5cbiAqIGhlbGxvXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5NdWx0aXBsZSB0ZXJtIHF1ZXJ5PC9jYXB0aW9uPlxuICogaGVsbG8gd29ybGRcbiAqIEBleGFtcGxlIDxjYXB0aW9uPnRlcm0gc2NvcGVkIHRvIGEgZmllbGQ8L2NhcHRpb24+XG4gKiB0aXRsZTpoZWxsb1xuICogQGV4YW1wbGUgPGNhcHRpb24+dGVybSB3aXRoIGEgYm9vc3Qgb2YgMTA8L2NhcHRpb24+XG4gKiBoZWxsb14xMFxuICogQGV4YW1wbGUgPGNhcHRpb24+dGVybSB3aXRoIGFuIGVkaXQgZGlzdGFuY2Ugb2YgMjwvY2FwdGlvbj5cbiAqIGhlbGxvfjJcbiAqIEBleGFtcGxlIDxjYXB0aW9uPnRlcm1zIHdpdGggcHJlc2VuY2UgbW9kaWZpZXJzPC9jYXB0aW9uPlxuICogLWZvbyArYmFyIGJhelxuICovXG5cbi8qKlxuICogUGVyZm9ybXMgYSBzZWFyY2ggYWdhaW5zdCB0aGUgaW5kZXggdXNpbmcgbHVuciBxdWVyeSBzeW50YXguXG4gKlxuICogUmVzdWx0cyB3aWxsIGJlIHJldHVybmVkIHNvcnRlZCBieSB0aGVpciBzY29yZSwgdGhlIG1vc3QgcmVsZXZhbnQgcmVzdWx0c1xuICogd2lsbCBiZSByZXR1cm5lZCBmaXJzdC4gIEZvciBkZXRhaWxzIG9uIGhvdyB0aGUgc2NvcmUgaXMgY2FsY3VsYXRlZCwgcGxlYXNlIHNlZVxuICogdGhlIHtAbGluayBodHRwczovL2x1bnJqcy5jb20vZ3VpZGVzL3NlYXJjaGluZy5odG1sI3Njb3Jpbmd8Z3VpZGV9LlxuICpcbiAqIEZvciBtb3JlIHByb2dyYW1tYXRpYyBxdWVyeWluZyB1c2UgbHVuci5JbmRleCNxdWVyeS5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuSW5kZXh+UXVlcnlTdHJpbmd9IHF1ZXJ5U3RyaW5nIC0gQSBzdHJpbmcgY29udGFpbmluZyBhIGx1bnIgcXVlcnkuXG4gKiBAdGhyb3dzIHtsdW5yLlF1ZXJ5UGFyc2VFcnJvcn0gSWYgdGhlIHBhc3NlZCBxdWVyeSBzdHJpbmcgY2Fubm90IGJlIHBhcnNlZC5cbiAqIEByZXR1cm5zIHtsdW5yLkluZGV4flJlc3VsdFtdfVxuICovXG5sdW5yLkluZGV4LnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbiAocXVlcnlTdHJpbmcpIHtcbiAgcmV0dXJuIHRoaXMucXVlcnkoZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gICAgdmFyIHBhcnNlciA9IG5ldyBsdW5yLlF1ZXJ5UGFyc2VyKHF1ZXJ5U3RyaW5nLCBxdWVyeSlcbiAgICBwYXJzZXIucGFyc2UoKVxuICB9KVxufVxuXG4vKipcbiAqIEEgcXVlcnkgYnVpbGRlciBjYWxsYmFjayBwcm92aWRlcyBhIHF1ZXJ5IG9iamVjdCB0byBiZSB1c2VkIHRvIGV4cHJlc3NcbiAqIHRoZSBxdWVyeSB0byBwZXJmb3JtIG9uIHRoZSBpbmRleC5cbiAqXG4gKiBAY2FsbGJhY2sgbHVuci5JbmRleH5xdWVyeUJ1aWxkZXJcbiAqIEBwYXJhbSB7bHVuci5RdWVyeX0gcXVlcnkgLSBUaGUgcXVlcnkgb2JqZWN0IHRvIGJ1aWxkIHVwLlxuICogQHRoaXMgbHVuci5RdWVyeVxuICovXG5cbi8qKlxuICogUGVyZm9ybXMgYSBxdWVyeSBhZ2FpbnN0IHRoZSBpbmRleCB1c2luZyB0aGUgeWllbGRlZCBsdW5yLlF1ZXJ5IG9iamVjdC5cbiAqXG4gKiBJZiBwZXJmb3JtaW5nIHByb2dyYW1tYXRpYyBxdWVyaWVzIGFnYWluc3QgdGhlIGluZGV4LCB0aGlzIG1ldGhvZCBpcyBwcmVmZXJyZWRcbiAqIG92ZXIgbHVuci5JbmRleCNzZWFyY2ggc28gYXMgdG8gYXZvaWQgdGhlIGFkZGl0aW9uYWwgcXVlcnkgcGFyc2luZyBvdmVyaGVhZC5cbiAqXG4gKiBBIHF1ZXJ5IG9iamVjdCBpcyB5aWVsZGVkIHRvIHRoZSBzdXBwbGllZCBmdW5jdGlvbiB3aGljaCBzaG91bGQgYmUgdXNlZCB0b1xuICogZXhwcmVzcyB0aGUgcXVlcnkgdG8gYmUgcnVuIGFnYWluc3QgdGhlIGluZGV4LlxuICpcbiAqIE5vdGUgdGhhdCBhbHRob3VnaCB0aGlzIGZ1bmN0aW9uIHRha2VzIGEgY2FsbGJhY2sgcGFyYW1ldGVyIGl0IGlzIF9ub3RfIGFuXG4gKiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLCB0aGUgY2FsbGJhY2sgaXMganVzdCB5aWVsZGVkIGEgcXVlcnkgb2JqZWN0IHRvIGJlXG4gKiBjdXN0b21pemVkLlxuICpcbiAqIEBwYXJhbSB7bHVuci5JbmRleH5xdWVyeUJ1aWxkZXJ9IGZuIC0gQSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gYnVpbGQgdGhlIHF1ZXJ5LlxuICogQHJldHVybnMge2x1bnIuSW5kZXh+UmVzdWx0W119XG4gKi9cbmx1bnIuSW5kZXgucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGZuKSB7XG4gIC8vIGZvciBlYWNoIHF1ZXJ5IGNsYXVzZVxuICAvLyAqIHByb2Nlc3MgdGVybXNcbiAgLy8gKiBleHBhbmQgdGVybXMgZnJvbSB0b2tlbiBzZXRcbiAgLy8gKiBmaW5kIG1hdGNoaW5nIGRvY3VtZW50cyBhbmQgbWV0YWRhdGFcbiAgLy8gKiBnZXQgZG9jdW1lbnQgdmVjdG9yc1xuICAvLyAqIHNjb3JlIGRvY3VtZW50c1xuXG4gIHZhciBxdWVyeSA9IG5ldyBsdW5yLlF1ZXJ5KHRoaXMuZmllbGRzKSxcbiAgICAgIG1hdGNoaW5nRmllbGRzID0gT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICAgIHF1ZXJ5VmVjdG9ycyA9IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICB0ZXJtRmllbGRDYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICByZXF1aXJlZE1hdGNoZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgcHJvaGliaXRlZE1hdGNoZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgLypcbiAgICogVG8gc3VwcG9ydCBmaWVsZCBsZXZlbCBib29zdHMgYSBxdWVyeSB2ZWN0b3IgaXMgY3JlYXRlZCBwZXJcbiAgICogZmllbGQuIEFuIGVtcHR5IHZlY3RvciBpcyBlYWdlcmx5IGNyZWF0ZWQgdG8gc3VwcG9ydCBuZWdhdGVkXG4gICAqIHF1ZXJpZXMuXG4gICAqL1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgcXVlcnlWZWN0b3JzW3RoaXMuZmllbGRzW2ldXSA9IG5ldyBsdW5yLlZlY3RvclxuICB9XG5cbiAgZm4uY2FsbChxdWVyeSwgcXVlcnkpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVyeS5jbGF1c2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgLypcbiAgICAgKiBVbmxlc3MgdGhlIHBpcGVsaW5lIGhhcyBiZWVuIGRpc2FibGVkIGZvciB0aGlzIHRlcm0sIHdoaWNoIGlzXG4gICAgICogdGhlIGNhc2UgZm9yIHRlcm1zIHdpdGggd2lsZGNhcmRzLCB3ZSBuZWVkIHRvIHBhc3MgdGhlIGNsYXVzZVxuICAgICAqIHRlcm0gdGhyb3VnaCB0aGUgc2VhcmNoIHBpcGVsaW5lLiBBIHBpcGVsaW5lIHJldHVybnMgYW4gYXJyYXlcbiAgICAgKiBvZiBwcm9jZXNzZWQgdGVybXMuIFBpcGVsaW5lIGZ1bmN0aW9ucyBtYXkgZXhwYW5kIHRoZSBwYXNzZWRcbiAgICAgKiB0ZXJtLCB3aGljaCBtZWFucyB3ZSBtYXkgZW5kIHVwIHBlcmZvcm1pbmcgbXVsdGlwbGUgaW5kZXggbG9va3Vwc1xuICAgICAqIGZvciBhIHNpbmdsZSBxdWVyeSB0ZXJtLlxuICAgICAqL1xuICAgIHZhciBjbGF1c2UgPSBxdWVyeS5jbGF1c2VzW2ldLFxuICAgICAgICB0ZXJtcyA9IG51bGwsXG4gICAgICAgIGNsYXVzZU1hdGNoZXMgPSBsdW5yLlNldC5lbXB0eVxuXG4gICAgaWYgKGNsYXVzZS51c2VQaXBlbGluZSkge1xuICAgICAgdGVybXMgPSB0aGlzLnBpcGVsaW5lLnJ1blN0cmluZyhjbGF1c2UudGVybSwge1xuICAgICAgICBmaWVsZHM6IGNsYXVzZS5maWVsZHNcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRlcm1zID0gW2NsYXVzZS50ZXJtXVxuICAgIH1cblxuICAgIGZvciAodmFyIG0gPSAwOyBtIDwgdGVybXMubGVuZ3RoOyBtKyspIHtcbiAgICAgIHZhciB0ZXJtID0gdGVybXNbbV1cblxuICAgICAgLypcbiAgICAgICAqIEVhY2ggdGVybSByZXR1cm5lZCBmcm9tIHRoZSBwaXBlbGluZSBuZWVkcyB0byB1c2UgdGhlIHNhbWUgcXVlcnlcbiAgICAgICAqIGNsYXVzZSBvYmplY3QsIGUuZy4gdGhlIHNhbWUgYm9vc3QgYW5kIG9yIGVkaXQgZGlzdGFuY2UuIFRoZVxuICAgICAgICogc2ltcGxlc3Qgd2F5IHRvIGRvIHRoaXMgaXMgdG8gcmUtdXNlIHRoZSBjbGF1c2Ugb2JqZWN0IGJ1dCBtdXRhdGVcbiAgICAgICAqIGl0cyB0ZXJtIHByb3BlcnR5LlxuICAgICAgICovXG4gICAgICBjbGF1c2UudGVybSA9IHRlcm1cblxuICAgICAgLypcbiAgICAgICAqIEZyb20gdGhlIHRlcm0gaW4gdGhlIGNsYXVzZSB3ZSBjcmVhdGUgYSB0b2tlbiBzZXQgd2hpY2ggd2lsbCB0aGVuXG4gICAgICAgKiBiZSB1c2VkIHRvIGludGVyc2VjdCB0aGUgaW5kZXhlcyB0b2tlbiBzZXQgdG8gZ2V0IGEgbGlzdCBvZiB0ZXJtc1xuICAgICAgICogdG8gbG9va3VwIGluIHRoZSBpbnZlcnRlZCBpbmRleFxuICAgICAgICovXG4gICAgICB2YXIgdGVybVRva2VuU2V0ID0gbHVuci5Ub2tlblNldC5mcm9tQ2xhdXNlKGNsYXVzZSksXG4gICAgICAgICAgZXhwYW5kZWRUZXJtcyA9IHRoaXMudG9rZW5TZXQuaW50ZXJzZWN0KHRlcm1Ub2tlblNldCkudG9BcnJheSgpXG5cbiAgICAgIC8qXG4gICAgICAgKiBJZiBhIHRlcm0gbWFya2VkIGFzIHJlcXVpcmVkIGRvZXMgbm90IGV4aXN0IGluIHRoZSB0b2tlblNldCBpdCBpc1xuICAgICAgICogaW1wb3NzaWJsZSBmb3IgdGhlIHNlYXJjaCB0byByZXR1cm4gYW55IG1hdGNoZXMuIFdlIHNldCBhbGwgdGhlIGZpZWxkXG4gICAgICAgKiBzY29wZWQgcmVxdWlyZWQgbWF0Y2hlcyBzZXQgdG8gZW1wdHkgYW5kIHN0b3AgZXhhbWluaW5nIGFueSBmdXJ0aGVyXG4gICAgICAgKiBjbGF1c2VzLlxuICAgICAgICovXG4gICAgICBpZiAoZXhwYW5kZWRUZXJtcy5sZW5ndGggPT09IDAgJiYgY2xhdXNlLnByZXNlbmNlID09PSBsdW5yLlF1ZXJ5LnByZXNlbmNlLlJFUVVJUkVEKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgY2xhdXNlLmZpZWxkcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIHZhciBmaWVsZCA9IGNsYXVzZS5maWVsZHNba11cbiAgICAgICAgICByZXF1aXJlZE1hdGNoZXNbZmllbGRdID0gbHVuci5TZXQuZW1wdHlcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZXhwYW5kZWRUZXJtcy5sZW5ndGg7IGorKykge1xuICAgICAgICAvKlxuICAgICAgICAgKiBGb3IgZWFjaCB0ZXJtIGdldCB0aGUgcG9zdGluZyBhbmQgdGVybUluZGV4LCB0aGlzIGlzIHJlcXVpcmVkIGZvclxuICAgICAgICAgKiBidWlsZGluZyB0aGUgcXVlcnkgdmVjdG9yLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGV4cGFuZGVkVGVybSA9IGV4cGFuZGVkVGVybXNbal0sXG4gICAgICAgICAgICBwb3N0aW5nID0gdGhpcy5pbnZlcnRlZEluZGV4W2V4cGFuZGVkVGVybV0sXG4gICAgICAgICAgICB0ZXJtSW5kZXggPSBwb3N0aW5nLl9pbmRleFxuXG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgY2xhdXNlLmZpZWxkcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIC8qXG4gICAgICAgICAgICogRm9yIGVhY2ggZmllbGQgdGhhdCB0aGlzIHF1ZXJ5IHRlcm0gaXMgc2NvcGVkIGJ5IChieSBkZWZhdWx0XG4gICAgICAgICAgICogYWxsIGZpZWxkcyBhcmUgaW4gc2NvcGUpIHdlIG5lZWQgdG8gZ2V0IGFsbCB0aGUgZG9jdW1lbnQgcmVmc1xuICAgICAgICAgICAqIHRoYXQgaGF2ZSB0aGlzIHRlcm0gaW4gdGhhdCBmaWVsZC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIFRoZSBwb3N0aW5nIGlzIHRoZSBlbnRyeSBpbiB0aGUgaW52ZXJ0ZWRJbmRleCBmb3IgdGhlIG1hdGNoaW5nXG4gICAgICAgICAgICogdGVybSBmcm9tIGFib3ZlLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHZhciBmaWVsZCA9IGNsYXVzZS5maWVsZHNba10sXG4gICAgICAgICAgICAgIGZpZWxkUG9zdGluZyA9IHBvc3RpbmdbZmllbGRdLFxuICAgICAgICAgICAgICBtYXRjaGluZ0RvY3VtZW50UmVmcyA9IE9iamVjdC5rZXlzKGZpZWxkUG9zdGluZyksXG4gICAgICAgICAgICAgIHRlcm1GaWVsZCA9IGV4cGFuZGVkVGVybSArIFwiL1wiICsgZmllbGQsXG4gICAgICAgICAgICAgIG1hdGNoaW5nRG9jdW1lbnRzU2V0ID0gbmV3IGx1bnIuU2V0KG1hdGNoaW5nRG9jdW1lbnRSZWZzKVxuXG4gICAgICAgICAgLypcbiAgICAgICAgICAgKiBpZiB0aGUgcHJlc2VuY2Ugb2YgdGhpcyB0ZXJtIGlzIHJlcXVpcmVkIGVuc3VyZSB0aGF0IHRoZSBtYXRjaGluZ1xuICAgICAgICAgICAqIGRvY3VtZW50cyBhcmUgYWRkZWQgdG8gdGhlIHNldCBvZiByZXF1aXJlZCBtYXRjaGVzIGZvciB0aGlzIGNsYXVzZS5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGlmIChjbGF1c2UucHJlc2VuY2UgPT0gbHVuci5RdWVyeS5wcmVzZW5jZS5SRVFVSVJFRCkge1xuICAgICAgICAgICAgY2xhdXNlTWF0Y2hlcyA9IGNsYXVzZU1hdGNoZXMudW5pb24obWF0Y2hpbmdEb2N1bWVudHNTZXQpXG5cbiAgICAgICAgICAgIGlmIChyZXF1aXJlZE1hdGNoZXNbZmllbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmVxdWlyZWRNYXRjaGVzW2ZpZWxkXSA9IGx1bnIuU2V0LmNvbXBsZXRlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLypcbiAgICAgICAgICAgKiBpZiB0aGUgcHJlc2VuY2Ugb2YgdGhpcyB0ZXJtIGlzIHByb2hpYml0ZWQgZW5zdXJlIHRoYXQgdGhlIG1hdGNoaW5nXG4gICAgICAgICAgICogZG9jdW1lbnRzIGFyZSBhZGRlZCB0byB0aGUgc2V0IG9mIHByb2hpYml0ZWQgbWF0Y2hlcyBmb3IgdGhpcyBmaWVsZCxcbiAgICAgICAgICAgKiBjcmVhdGluZyB0aGF0IHNldCBpZiBpdCBkb2VzIG5vdCB5ZXQgZXhpc3QuXG4gICAgICAgICAgICovXG4gICAgICAgICAgaWYgKGNsYXVzZS5wcmVzZW5jZSA9PSBsdW5yLlF1ZXJ5LnByZXNlbmNlLlBST0hJQklURUQpIHtcbiAgICAgICAgICAgIGlmIChwcm9oaWJpdGVkTWF0Y2hlc1tmaWVsZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBwcm9oaWJpdGVkTWF0Y2hlc1tmaWVsZF0gPSBsdW5yLlNldC5lbXB0eVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcm9oaWJpdGVkTWF0Y2hlc1tmaWVsZF0gPSBwcm9oaWJpdGVkTWF0Y2hlc1tmaWVsZF0udW5pb24obWF0Y2hpbmdEb2N1bWVudHNTZXQpXG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBQcm9oaWJpdGVkIG1hdGNoZXMgc2hvdWxkIG5vdCBiZSBwYXJ0IG9mIHRoZSBxdWVyeSB2ZWN0b3IgdXNlZCBmb3JcbiAgICAgICAgICAgICAqIHNpbWlsYXJpdHkgc2NvcmluZyBhbmQgbm8gbWV0YWRhdGEgc2hvdWxkIGJlIGV4dHJhY3RlZCBzbyB3ZSBjb250aW51ZVxuICAgICAgICAgICAgICogdG8gdGhlIG5leHQgZmllbGRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIFRoZSBxdWVyeSBmaWVsZCB2ZWN0b3IgaXMgcG9wdWxhdGVkIHVzaW5nIHRoZSB0ZXJtSW5kZXggZm91bmQgZm9yXG4gICAgICAgICAgICogdGhlIHRlcm0gYW5kIGEgdW5pdCB2YWx1ZSB3aXRoIHRoZSBhcHByb3ByaWF0ZSBib29zdCBhcHBsaWVkLlxuICAgICAgICAgICAqIFVzaW5nIHVwc2VydCBiZWNhdXNlIHRoZXJlIGNvdWxkIGFscmVhZHkgYmUgYW4gZW50cnkgaW4gdGhlIHZlY3RvclxuICAgICAgICAgICAqIGZvciB0aGUgdGVybSB3ZSBhcmUgd29ya2luZyB3aXRoLiBJbiB0aGF0IGNhc2Ugd2UganVzdCBhZGQgdGhlIHNjb3Jlc1xuICAgICAgICAgICAqIHRvZ2V0aGVyLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHF1ZXJ5VmVjdG9yc1tmaWVsZF0udXBzZXJ0KHRlcm1JbmRleCwgY2xhdXNlLmJvb3N0LCBmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSArIGIgfSlcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIElmIHdlJ3ZlIGFscmVhZHkgc2VlbiB0aGlzIHRlcm0sIGZpZWxkIGNvbWJvIHRoZW4gd2UndmUgYWxyZWFkeSBjb2xsZWN0ZWRcbiAgICAgICAgICAgKiB0aGUgbWF0Y2hpbmcgZG9jdW1lbnRzIGFuZCBtZXRhZGF0YSwgbm8gbmVlZCB0byBnbyB0aHJvdWdoIGFsbCB0aGF0IGFnYWluXG4gICAgICAgICAgICovXG4gICAgICAgICAgaWYgKHRlcm1GaWVsZENhY2hlW3Rlcm1GaWVsZF0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCBtYXRjaGluZ0RvY3VtZW50UmVmcy5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFsbCBtZXRhZGF0YSBmb3IgdGhpcyB0ZXJtL2ZpZWxkL2RvY3VtZW50IHRyaXBsZVxuICAgICAgICAgICAgICogYXJlIHRoZW4gZXh0cmFjdGVkIGFuZCBjb2xsZWN0ZWQgaW50byBhbiBpbnN0YW5jZVxuICAgICAgICAgICAgICogb2YgbHVuci5NYXRjaERhdGEgcmVhZHkgdG8gYmUgcmV0dXJuZWQgaW4gdGhlIHF1ZXJ5XG4gICAgICAgICAgICAgKiByZXN1bHRzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBtYXRjaGluZ0RvY3VtZW50UmVmID0gbWF0Y2hpbmdEb2N1bWVudFJlZnNbbF0sXG4gICAgICAgICAgICAgICAgbWF0Y2hpbmdGaWVsZFJlZiA9IG5ldyBsdW5yLkZpZWxkUmVmIChtYXRjaGluZ0RvY3VtZW50UmVmLCBmaWVsZCksXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEgPSBmaWVsZFBvc3RpbmdbbWF0Y2hpbmdEb2N1bWVudFJlZl0sXG4gICAgICAgICAgICAgICAgZmllbGRNYXRjaFxuXG4gICAgICAgICAgICBpZiAoKGZpZWxkTWF0Y2ggPSBtYXRjaGluZ0ZpZWxkc1ttYXRjaGluZ0ZpZWxkUmVmXSkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBtYXRjaGluZ0ZpZWxkc1ttYXRjaGluZ0ZpZWxkUmVmXSA9IG5ldyBsdW5yLk1hdGNoRGF0YSAoZXhwYW5kZWRUZXJtLCBmaWVsZCwgbWV0YWRhdGEpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaWVsZE1hdGNoLmFkZChleHBhbmRlZFRlcm0sIGZpZWxkLCBtZXRhZGF0YSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRlcm1GaWVsZENhY2hlW3Rlcm1GaWVsZF0gPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcHJlc2VuY2Ugd2FzIHJlcXVpcmVkIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSByZXF1aXJlZE1hdGNoZXMgZmllbGQgc2V0cy5cbiAgICAgKiBXZSBkbyB0aGlzIGFmdGVyIGFsbCBmaWVsZHMgZm9yIHRoZSB0ZXJtIGhhdmUgY29sbGVjdGVkIHRoZWlyIG1hdGNoZXMgYmVjYXVzZVxuICAgICAqIHRoZSBjbGF1c2UgdGVybXMgcHJlc2VuY2UgaXMgcmVxdWlyZWQgaW4gX2FueV8gb2YgdGhlIGZpZWxkcyBub3QgX2FsbF8gb2YgdGhlXG4gICAgICogZmllbGRzLlxuICAgICAqL1xuICAgIGlmIChjbGF1c2UucHJlc2VuY2UgPT09IGx1bnIuUXVlcnkucHJlc2VuY2UuUkVRVUlSRUQpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgY2xhdXNlLmZpZWxkcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgZmllbGQgPSBjbGF1c2UuZmllbGRzW2tdXG4gICAgICAgIHJlcXVpcmVkTWF0Y2hlc1tmaWVsZF0gPSByZXF1aXJlZE1hdGNoZXNbZmllbGRdLmludGVyc2VjdChjbGF1c2VNYXRjaGVzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOZWVkIHRvIGNvbWJpbmUgdGhlIGZpZWxkIHNjb3BlZCByZXF1aXJlZCBhbmQgcHJvaGliaXRlZFxuICAgKiBtYXRjaGluZyBkb2N1bWVudHMgaW50byBhIGdsb2JhbCBzZXQgb2YgcmVxdWlyZWQgYW5kIHByb2hpYml0ZWRcbiAgICogbWF0Y2hlc1xuICAgKi9cbiAgdmFyIGFsbFJlcXVpcmVkTWF0Y2hlcyA9IGx1bnIuU2V0LmNvbXBsZXRlLFxuICAgICAgYWxsUHJvaGliaXRlZE1hdGNoZXMgPSBsdW5yLlNldC5lbXB0eVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5maWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZmllbGQgPSB0aGlzLmZpZWxkc1tpXVxuXG4gICAgaWYgKHJlcXVpcmVkTWF0Y2hlc1tmaWVsZF0pIHtcbiAgICAgIGFsbFJlcXVpcmVkTWF0Y2hlcyA9IGFsbFJlcXVpcmVkTWF0Y2hlcy5pbnRlcnNlY3QocmVxdWlyZWRNYXRjaGVzW2ZpZWxkXSlcbiAgICB9XG5cbiAgICBpZiAocHJvaGliaXRlZE1hdGNoZXNbZmllbGRdKSB7XG4gICAgICBhbGxQcm9oaWJpdGVkTWF0Y2hlcyA9IGFsbFByb2hpYml0ZWRNYXRjaGVzLnVuaW9uKHByb2hpYml0ZWRNYXRjaGVzW2ZpZWxkXSlcbiAgICB9XG4gIH1cblxuICB2YXIgbWF0Y2hpbmdGaWVsZFJlZnMgPSBPYmplY3Qua2V5cyhtYXRjaGluZ0ZpZWxkcyksXG4gICAgICByZXN1bHRzID0gW10sXG4gICAgICBtYXRjaGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gIC8qXG4gICAqIElmIHRoZSBxdWVyeSBpcyBuZWdhdGVkIChjb250YWlucyBvbmx5IHByb2hpYml0ZWQgdGVybXMpXG4gICAqIHdlIG5lZWQgdG8gZ2V0IF9hbGxfIGZpZWxkUmVmcyBjdXJyZW50bHkgZXhpc3RpbmcgaW4gdGhlXG4gICAqIGluZGV4LiBUaGlzIGlzIG9ubHkgZG9uZSB3aGVuIHdlIGtub3cgdGhhdCB0aGUgcXVlcnkgaXNcbiAgICogZW50aXJlbHkgcHJvaGliaXRlZCB0ZXJtcyB0byBhdm9pZCBhbnkgY29zdCBvZiBnZXR0aW5nIGFsbFxuICAgKiBmaWVsZFJlZnMgdW5uZWNlc3NhcmlseS5cbiAgICpcbiAgICogQWRkaXRpb25hbGx5LCBibGFuayBNYXRjaERhdGEgbXVzdCBiZSBjcmVhdGVkIHRvIGNvcnJlY3RseVxuICAgKiBwb3B1bGF0ZSB0aGUgcmVzdWx0cy5cbiAgICovXG4gIGlmIChxdWVyeS5pc05lZ2F0ZWQoKSkge1xuICAgIG1hdGNoaW5nRmllbGRSZWZzID0gT2JqZWN0LmtleXModGhpcy5maWVsZFZlY3RvcnMpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hdGNoaW5nRmllbGRSZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbWF0Y2hpbmdGaWVsZFJlZiA9IG1hdGNoaW5nRmllbGRSZWZzW2ldXG4gICAgICB2YXIgZmllbGRSZWYgPSBsdW5yLkZpZWxkUmVmLmZyb21TdHJpbmcobWF0Y2hpbmdGaWVsZFJlZilcbiAgICAgIG1hdGNoaW5nRmllbGRzW21hdGNoaW5nRmllbGRSZWZdID0gbmV3IGx1bnIuTWF0Y2hEYXRhXG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXRjaGluZ0ZpZWxkUmVmcy5sZW5ndGg7IGkrKykge1xuICAgIC8qXG4gICAgICogQ3VycmVudGx5IHdlIGhhdmUgZG9jdW1lbnQgZmllbGRzIHRoYXQgbWF0Y2ggdGhlIHF1ZXJ5LCBidXQgd2VcbiAgICAgKiBuZWVkIHRvIHJldHVybiBkb2N1bWVudHMuIFRoZSBtYXRjaERhdGEgYW5kIHNjb3JlcyBhcmUgY29tYmluZWRcbiAgICAgKiBmcm9tIG11bHRpcGxlIGZpZWxkcyBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgZG9jdW1lbnQuXG4gICAgICpcbiAgICAgKiBTY29yZXMgYXJlIGNhbGN1bGF0ZWQgYnkgZmllbGQsIHVzaW5nIHRoZSBxdWVyeSB2ZWN0b3JzIGNyZWF0ZWRcbiAgICAgKiBhYm92ZSwgYW5kIGNvbWJpbmVkIGludG8gYSBmaW5hbCBkb2N1bWVudCBzY29yZSB1c2luZyBhZGRpdGlvbi5cbiAgICAgKi9cbiAgICB2YXIgZmllbGRSZWYgPSBsdW5yLkZpZWxkUmVmLmZyb21TdHJpbmcobWF0Y2hpbmdGaWVsZFJlZnNbaV0pLFxuICAgICAgICBkb2NSZWYgPSBmaWVsZFJlZi5kb2NSZWZcblxuICAgIGlmICghYWxsUmVxdWlyZWRNYXRjaGVzLmNvbnRhaW5zKGRvY1JlZikpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgaWYgKGFsbFByb2hpYml0ZWRNYXRjaGVzLmNvbnRhaW5zKGRvY1JlZikpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgdmFyIGZpZWxkVmVjdG9yID0gdGhpcy5maWVsZFZlY3RvcnNbZmllbGRSZWZdLFxuICAgICAgICBzY29yZSA9IHF1ZXJ5VmVjdG9yc1tmaWVsZFJlZi5maWVsZE5hbWVdLnNpbWlsYXJpdHkoZmllbGRWZWN0b3IpLFxuICAgICAgICBkb2NNYXRjaFxuXG4gICAgaWYgKChkb2NNYXRjaCA9IG1hdGNoZXNbZG9jUmVmXSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZG9jTWF0Y2guc2NvcmUgKz0gc2NvcmVcbiAgICAgIGRvY01hdGNoLm1hdGNoRGF0YS5jb21iaW5lKG1hdGNoaW5nRmllbGRzW2ZpZWxkUmVmXSlcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG1hdGNoID0ge1xuICAgICAgICByZWY6IGRvY1JlZixcbiAgICAgICAgc2NvcmU6IHNjb3JlLFxuICAgICAgICBtYXRjaERhdGE6IG1hdGNoaW5nRmllbGRzW2ZpZWxkUmVmXVxuICAgICAgfVxuICAgICAgbWF0Y2hlc1tkb2NSZWZdID0gbWF0Y2hcbiAgICAgIHJlc3VsdHMucHVzaChtYXRjaClcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBTb3J0IHRoZSByZXN1bHRzIG9iamVjdHMgYnkgc2NvcmUsIGhpZ2hlc3QgZmlyc3QuXG4gICAqL1xuICByZXR1cm4gcmVzdWx0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGIuc2NvcmUgLSBhLnNjb3JlXG4gIH0pXG59XG5cbi8qKlxuICogUHJlcGFyZXMgdGhlIGluZGV4IGZvciBKU09OIHNlcmlhbGl6YXRpb24uXG4gKlxuICogVGhlIHNjaGVtYSBmb3IgdGhpcyBKU09OIGJsb2Igd2lsbCBiZSBkZXNjcmliZWQgaW4gYVxuICogc2VwYXJhdGUgSlNPTiBzY2hlbWEgZmlsZS5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5sdW5yLkluZGV4LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpbnZlcnRlZEluZGV4ID0gT2JqZWN0LmtleXModGhpcy5pbnZlcnRlZEluZGV4KVxuICAgIC5zb3J0KClcbiAgICAubWFwKGZ1bmN0aW9uICh0ZXJtKSB7XG4gICAgICByZXR1cm4gW3Rlcm0sIHRoaXMuaW52ZXJ0ZWRJbmRleFt0ZXJtXV1cbiAgICB9LCB0aGlzKVxuXG4gIHZhciBmaWVsZFZlY3RvcnMgPSBPYmplY3Qua2V5cyh0aGlzLmZpZWxkVmVjdG9ycylcbiAgICAubWFwKGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgIHJldHVybiBbcmVmLCB0aGlzLmZpZWxkVmVjdG9yc1tyZWZdLnRvSlNPTigpXVxuICAgIH0sIHRoaXMpXG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uOiBsdW5yLnZlcnNpb24sXG4gICAgZmllbGRzOiB0aGlzLmZpZWxkcyxcbiAgICBmaWVsZFZlY3RvcnM6IGZpZWxkVmVjdG9ycyxcbiAgICBpbnZlcnRlZEluZGV4OiBpbnZlcnRlZEluZGV4LFxuICAgIHBpcGVsaW5lOiB0aGlzLnBpcGVsaW5lLnRvSlNPTigpXG4gIH1cbn1cblxuLyoqXG4gKiBMb2FkcyBhIHByZXZpb3VzbHkgc2VyaWFsaXplZCBsdW5yLkluZGV4XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNlcmlhbGl6ZWRJbmRleCAtIEEgcHJldmlvdXNseSBzZXJpYWxpemVkIGx1bnIuSW5kZXhcbiAqIEByZXR1cm5zIHtsdW5yLkluZGV4fVxuICovXG5sdW5yLkluZGV4LmxvYWQgPSBmdW5jdGlvbiAoc2VyaWFsaXplZEluZGV4KSB7XG4gIHZhciBhdHRycyA9IHt9LFxuICAgICAgZmllbGRWZWN0b3JzID0ge30sXG4gICAgICBzZXJpYWxpemVkVmVjdG9ycyA9IHNlcmlhbGl6ZWRJbmRleC5maWVsZFZlY3RvcnMsXG4gICAgICBpbnZlcnRlZEluZGV4ID0gT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICAgIHNlcmlhbGl6ZWRJbnZlcnRlZEluZGV4ID0gc2VyaWFsaXplZEluZGV4LmludmVydGVkSW5kZXgsXG4gICAgICB0b2tlblNldEJ1aWxkZXIgPSBuZXcgbHVuci5Ub2tlblNldC5CdWlsZGVyLFxuICAgICAgcGlwZWxpbmUgPSBsdW5yLlBpcGVsaW5lLmxvYWQoc2VyaWFsaXplZEluZGV4LnBpcGVsaW5lKVxuXG4gIGlmIChzZXJpYWxpemVkSW5kZXgudmVyc2lvbiAhPSBsdW5yLnZlcnNpb24pIHtcbiAgICBsdW5yLnV0aWxzLndhcm4oXCJWZXJzaW9uIG1pc21hdGNoIHdoZW4gbG9hZGluZyBzZXJpYWxpc2VkIGluZGV4LiBDdXJyZW50IHZlcnNpb24gb2YgbHVuciAnXCIgKyBsdW5yLnZlcnNpb24gKyBcIicgZG9lcyBub3QgbWF0Y2ggc2VyaWFsaXplZCBpbmRleCAnXCIgKyBzZXJpYWxpemVkSW5kZXgudmVyc2lvbiArIFwiJ1wiKVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXJpYWxpemVkVmVjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0dXBsZSA9IHNlcmlhbGl6ZWRWZWN0b3JzW2ldLFxuICAgICAgICByZWYgPSB0dXBsZVswXSxcbiAgICAgICAgZWxlbWVudHMgPSB0dXBsZVsxXVxuXG4gICAgZmllbGRWZWN0b3JzW3JlZl0gPSBuZXcgbHVuci5WZWN0b3IoZWxlbWVudHMpXG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHNlcmlhbGl6ZWRJbnZlcnRlZEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHR1cGxlID0gc2VyaWFsaXplZEludmVydGVkSW5kZXhbaV0sXG4gICAgICAgIHRlcm0gPSB0dXBsZVswXSxcbiAgICAgICAgcG9zdGluZyA9IHR1cGxlWzFdXG5cbiAgICB0b2tlblNldEJ1aWxkZXIuaW5zZXJ0KHRlcm0pXG4gICAgaW52ZXJ0ZWRJbmRleFt0ZXJtXSA9IHBvc3RpbmdcbiAgfVxuXG4gIHRva2VuU2V0QnVpbGRlci5maW5pc2goKVxuXG4gIGF0dHJzLmZpZWxkcyA9IHNlcmlhbGl6ZWRJbmRleC5maWVsZHNcblxuICBhdHRycy5maWVsZFZlY3RvcnMgPSBmaWVsZFZlY3RvcnNcbiAgYXR0cnMuaW52ZXJ0ZWRJbmRleCA9IGludmVydGVkSW5kZXhcbiAgYXR0cnMudG9rZW5TZXQgPSB0b2tlblNldEJ1aWxkZXIucm9vdFxuICBhdHRycy5waXBlbGluZSA9IHBpcGVsaW5lXG5cbiAgcmV0dXJuIG5ldyBsdW5yLkluZGV4KGF0dHJzKVxufVxuLyohXG4gKiBsdW5yLkJ1aWxkZXJcbiAqIENvcHlyaWdodCAoQykgMjAyMCBPbGl2ZXIgTmlnaHRpbmdhbGVcbiAqL1xuXG4vKipcbiAqIGx1bnIuQnVpbGRlciBwZXJmb3JtcyBpbmRleGluZyBvbiBhIHNldCBvZiBkb2N1bWVudHMgYW5kXG4gKiByZXR1cm5zIGluc3RhbmNlcyBvZiBsdW5yLkluZGV4IHJlYWR5IGZvciBxdWVyeWluZy5cbiAqXG4gKiBBbGwgY29uZmlndXJhdGlvbiBvZiB0aGUgaW5kZXggaXMgZG9uZSB2aWEgdGhlIGJ1aWxkZXIsIHRoZVxuICogZmllbGRzIHRvIGluZGV4LCB0aGUgZG9jdW1lbnQgcmVmZXJlbmNlLCB0aGUgdGV4dCBwcm9jZXNzaW5nXG4gKiBwaXBlbGluZSBhbmQgZG9jdW1lbnQgc2NvcmluZyBwYXJhbWV0ZXJzIGFyZSBhbGwgc2V0IG9uIHRoZVxuICogYnVpbGRlciBiZWZvcmUgaW5kZXhpbmcuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gX3JlZiAtIEludGVybmFsIHJlZmVyZW5jZSB0byB0aGUgZG9jdW1lbnQgcmVmZXJlbmNlIGZpZWxkLlxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0gX2ZpZWxkcyAtIEludGVybmFsIHJlZmVyZW5jZSB0byB0aGUgZG9jdW1lbnQgZmllbGRzIHRvIGluZGV4LlxuICogQHByb3BlcnR5IHtvYmplY3R9IGludmVydGVkSW5kZXggLSBUaGUgaW52ZXJ0ZWQgaW5kZXggbWFwcyB0ZXJtcyB0byBkb2N1bWVudCBmaWVsZHMuXG4gKiBAcHJvcGVydHkge29iamVjdH0gZG9jdW1lbnRUZXJtRnJlcXVlbmNpZXMgLSBLZWVwcyB0cmFjayBvZiBkb2N1bWVudCB0ZXJtIGZyZXF1ZW5jaWVzLlxuICogQHByb3BlcnR5IHtvYmplY3R9IGRvY3VtZW50TGVuZ3RocyAtIEtlZXBzIHRyYWNrIG9mIHRoZSBsZW5ndGggb2YgZG9jdW1lbnRzIGFkZGVkIHRvIHRoZSBpbmRleC5cbiAqIEBwcm9wZXJ0eSB7bHVuci50b2tlbml6ZXJ9IHRva2VuaXplciAtIEZ1bmN0aW9uIGZvciBzcGxpdHRpbmcgc3RyaW5ncyBpbnRvIHRva2VucyBmb3IgaW5kZXhpbmcuXG4gKiBAcHJvcGVydHkge2x1bnIuUGlwZWxpbmV9IHBpcGVsaW5lIC0gVGhlIHBpcGVsaW5lIHBlcmZvcm1zIHRleHQgcHJvY2Vzc2luZyBvbiB0b2tlbnMgYmVmb3JlIGluZGV4aW5nLlxuICogQHByb3BlcnR5IHtsdW5yLlBpcGVsaW5lfSBzZWFyY2hQaXBlbGluZSAtIEEgcGlwZWxpbmUgZm9yIHByb2Nlc3Npbmcgc2VhcmNoIHRlcm1zIGJlZm9yZSBxdWVyeWluZyB0aGUgaW5kZXguXG4gKiBAcHJvcGVydHkge251bWJlcn0gZG9jdW1lbnRDb3VudCAtIEtlZXBzIHRyYWNrIG9mIHRoZSB0b3RhbCBudW1iZXIgb2YgZG9jdW1lbnRzIGluZGV4ZWQuXG4gKiBAcHJvcGVydHkge251bWJlcn0gX2IgLSBBIHBhcmFtZXRlciB0byBjb250cm9sIGZpZWxkIGxlbmd0aCBub3JtYWxpemF0aW9uLCBzZXR0aW5nIHRoaXMgdG8gMCBkaXNhYmxlZCBub3JtYWxpemF0aW9uLCAxIGZ1bGx5IG5vcm1hbGl6ZXMgZmllbGQgbGVuZ3RocywgdGhlIGRlZmF1bHQgdmFsdWUgaXMgMC43NS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBfazEgLSBBIHBhcmFtZXRlciB0byBjb250cm9sIGhvdyBxdWlja2x5IGFuIGluY3JlYXNlIGluIHRlcm0gZnJlcXVlbmN5IHJlc3VsdHMgaW4gdGVybSBmcmVxdWVuY3kgc2F0dXJhdGlvbiwgdGhlIGRlZmF1bHQgdmFsdWUgaXMgMS4yLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHRlcm1JbmRleCAtIEEgY291bnRlciBpbmNyZW1lbnRlZCBmb3IgZWFjaCB1bmlxdWUgdGVybSwgdXNlZCB0byBpZGVudGlmeSBhIHRlcm1zIHBvc2l0aW9uIGluIHRoZSB2ZWN0b3Igc3BhY2UuXG4gKiBAcHJvcGVydHkge2FycmF5fSBtZXRhZGF0YVdoaXRlbGlzdCAtIEEgbGlzdCBvZiBtZXRhZGF0YSBrZXlzIHRoYXQgaGF2ZSBiZWVuIHdoaXRlbGlzdGVkIGZvciBlbnRyeSBpbiB0aGUgaW5kZXguXG4gKi9cbmx1bnIuQnVpbGRlciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fcmVmID0gXCJpZFwiXG4gIHRoaXMuX2ZpZWxkcyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgdGhpcy5fZG9jdW1lbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICB0aGlzLmludmVydGVkSW5kZXggPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIHRoaXMuZmllbGRUZXJtRnJlcXVlbmNpZXMgPSB7fVxuICB0aGlzLmZpZWxkTGVuZ3RocyA9IHt9XG4gIHRoaXMudG9rZW5pemVyID0gbHVuci50b2tlbml6ZXJcbiAgdGhpcy5waXBlbGluZSA9IG5ldyBsdW5yLlBpcGVsaW5lXG4gIHRoaXMuc2VhcmNoUGlwZWxpbmUgPSBuZXcgbHVuci5QaXBlbGluZVxuICB0aGlzLmRvY3VtZW50Q291bnQgPSAwXG4gIHRoaXMuX2IgPSAwLjc1XG4gIHRoaXMuX2sxID0gMS4yXG4gIHRoaXMudGVybUluZGV4ID0gMFxuICB0aGlzLm1ldGFkYXRhV2hpdGVsaXN0ID0gW11cbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBkb2N1bWVudCBmaWVsZCB1c2VkIGFzIHRoZSBkb2N1bWVudCByZWZlcmVuY2UuIEV2ZXJ5IGRvY3VtZW50IG11c3QgaGF2ZSB0aGlzIGZpZWxkLlxuICogVGhlIHR5cGUgb2YgdGhpcyBmaWVsZCBpbiB0aGUgZG9jdW1lbnQgc2hvdWxkIGJlIGEgc3RyaW5nLCBpZiBpdCBpcyBub3QgYSBzdHJpbmcgaXQgd2lsbCBiZVxuICogY29lcmNlZCBpbnRvIGEgc3RyaW5nIGJ5IGNhbGxpbmcgdG9TdHJpbmcuXG4gKlxuICogVGhlIGRlZmF1bHQgcmVmIGlzICdpZCcuXG4gKlxuICogVGhlIHJlZiBzaG91bGQgX25vdF8gYmUgY2hhbmdlZCBkdXJpbmcgaW5kZXhpbmcsIGl0IHNob3VsZCBiZSBzZXQgYmVmb3JlIGFueSBkb2N1bWVudHMgYXJlXG4gKiBhZGRlZCB0byB0aGUgaW5kZXguIENoYW5naW5nIGl0IGR1cmluZyBpbmRleGluZyBjYW4gbGVhZCB0byBpbmNvbnNpc3RlbnQgcmVzdWx0cy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmIC0gVGhlIG5hbWUgb2YgdGhlIHJlZmVyZW5jZSBmaWVsZCBpbiB0aGUgZG9jdW1lbnQuXG4gKi9cbmx1bnIuQnVpbGRlci5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24gKHJlZikge1xuICB0aGlzLl9yZWYgPSByZWZcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBleHRyYWN0IGEgZmllbGQgZnJvbSBhIGRvY3VtZW50LlxuICpcbiAqIEx1bnIgZXhwZWN0cyBhIGZpZWxkIHRvIGJlIGF0IHRoZSB0b3AgbGV2ZWwgb2YgYSBkb2N1bWVudCwgaWYgaG93ZXZlciB0aGUgZmllbGRcbiAqIGlzIGRlZXBseSBuZXN0ZWQgd2l0aGluIGEgZG9jdW1lbnQgYW4gZXh0cmFjdG9yIGZ1bmN0aW9uIGNhbiBiZSB1c2VkIHRvIGV4dHJhY3RcbiAqIHRoZSByaWdodCBmaWVsZCBmb3IgaW5kZXhpbmcuXG4gKlxuICogQGNhbGxiYWNrIGZpZWxkRXh0cmFjdG9yXG4gKiBAcGFyYW0ge29iamVjdH0gZG9jIC0gVGhlIGRvY3VtZW50IGJlaW5nIGFkZGVkIHRvIHRoZSBpbmRleC5cbiAqIEByZXR1cm5zIHs/KHN0cmluZ3xvYmplY3R8b2JqZWN0W10pfSBvYmogLSBUaGUgb2JqZWN0IHRoYXQgd2lsbCBiZSBpbmRleGVkIGZvciB0aGlzIGZpZWxkLlxuICogQGV4YW1wbGUgPGNhcHRpb24+RXh0cmFjdGluZyBhIG5lc3RlZCBmaWVsZDwvY2FwdGlvbj5cbiAqIGZ1bmN0aW9uIChkb2MpIHsgcmV0dXJuIGRvYy5uZXN0ZWQuZmllbGQgfVxuICovXG5cbi8qKlxuICogQWRkcyBhIGZpZWxkIHRvIHRoZSBsaXN0IG9mIGRvY3VtZW50IGZpZWxkcyB0aGF0IHdpbGwgYmUgaW5kZXhlZC4gRXZlcnkgZG9jdW1lbnQgYmVpbmdcbiAqIGluZGV4ZWQgc2hvdWxkIGhhdmUgdGhpcyBmaWVsZC4gTnVsbCB2YWx1ZXMgZm9yIHRoaXMgZmllbGQgaW4gaW5kZXhlZCBkb2N1bWVudHMgd2lsbFxuICogbm90IGNhdXNlIGVycm9ycyBidXQgd2lsbCBsaW1pdCB0aGUgY2hhbmNlIG9mIHRoYXQgZG9jdW1lbnQgYmVpbmcgcmV0cmlldmVkIGJ5IHNlYXJjaGVzLlxuICpcbiAqIEFsbCBmaWVsZHMgc2hvdWxkIGJlIGFkZGVkIGJlZm9yZSBhZGRpbmcgZG9jdW1lbnRzIHRvIHRoZSBpbmRleC4gQWRkaW5nIGZpZWxkcyBhZnRlclxuICogYSBkb2N1bWVudCBoYXMgYmVlbiBpbmRleGVkIHdpbGwgaGF2ZSBubyBlZmZlY3Qgb24gYWxyZWFkeSBpbmRleGVkIGRvY3VtZW50cy5cbiAqXG4gKiBGaWVsZHMgY2FuIGJlIGJvb3N0ZWQgYXQgYnVpbGQgdGltZS4gVGhpcyBhbGxvd3MgdGVybXMgd2l0aGluIHRoYXQgZmllbGQgdG8gaGF2ZSBtb3JlXG4gKiBpbXBvcnRhbmNlIHdoZW4gcmFua2luZyBzZWFyY2ggcmVzdWx0cy4gVXNlIGEgZmllbGQgYm9vc3QgdG8gc3BlY2lmeSB0aGF0IG1hdGNoZXMgd2l0aGluXG4gKiBvbmUgZmllbGQgYXJlIG1vcmUgaW1wb3J0YW50IHRoYW4gb3RoZXIgZmllbGRzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZE5hbWUgLSBUaGUgbmFtZSBvZiBhIGZpZWxkIHRvIGluZGV4IGluIGFsbCBkb2N1bWVudHMuXG4gKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlcyAtIE9wdGlvbmFsIGF0dHJpYnV0ZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZmllbGQuXG4gKiBAcGFyYW0ge251bWJlcn0gW2F0dHJpYnV0ZXMuYm9vc3Q9MV0gLSBCb29zdCBhcHBsaWVkIHRvIGFsbCB0ZXJtcyB3aXRoaW4gdGhpcyBmaWVsZC5cbiAqIEBwYXJhbSB7ZmllbGRFeHRyYWN0b3J9IFthdHRyaWJ1dGVzLmV4dHJhY3Rvcl0gLSBGdW5jdGlvbiB0byBleHRyYWN0IGEgZmllbGQgZnJvbSBhIGRvY3VtZW50LlxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gZmllbGROYW1lIGNhbm5vdCBjb250YWluIHVuc3VwcG9ydGVkIGNoYXJhY3RlcnMgJy8nXG4gKi9cbmx1bnIuQnVpbGRlci5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbiAoZmllbGROYW1lLCBhdHRyaWJ1dGVzKSB7XG4gIGlmICgvXFwvLy50ZXN0KGZpZWxkTmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvciAoXCJGaWVsZCAnXCIgKyBmaWVsZE5hbWUgKyBcIicgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXIgJy8nXCIpXG4gIH1cblxuICB0aGlzLl9maWVsZHNbZmllbGROYW1lXSA9IGF0dHJpYnV0ZXMgfHwge31cbn1cblxuLyoqXG4gKiBBIHBhcmFtZXRlciB0byB0dW5lIHRoZSBhbW91bnQgb2YgZmllbGQgbGVuZ3RoIG5vcm1hbGlzYXRpb24gdGhhdCBpcyBhcHBsaWVkIHdoZW5cbiAqIGNhbGN1bGF0aW5nIHJlbGV2YW5jZSBzY29yZXMuIEEgdmFsdWUgb2YgMCB3aWxsIGNvbXBsZXRlbHkgZGlzYWJsZSBhbnkgbm9ybWFsaXNhdGlvblxuICogYW5kIGEgdmFsdWUgb2YgMSB3aWxsIGZ1bGx5IG5vcm1hbGlzZSBmaWVsZCBsZW5ndGhzLiBUaGUgZGVmYXVsdCBpcyAwLjc1LiBWYWx1ZXMgb2YgYlxuICogd2lsbCBiZSBjbGFtcGVkIHRvIHRoZSByYW5nZSAwIC0gMS5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gVGhlIHZhbHVlIHRvIHNldCBmb3IgdGhpcyB0dW5pbmcgcGFyYW1ldGVyLlxuICovXG5sdW5yLkJ1aWxkZXIucHJvdG90eXBlLmIgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gIGlmIChudW1iZXIgPCAwKSB7XG4gICAgdGhpcy5fYiA9IDBcbiAgfSBlbHNlIGlmIChudW1iZXIgPiAxKSB7XG4gICAgdGhpcy5fYiA9IDFcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9iID0gbnVtYmVyXG4gIH1cbn1cblxuLyoqXG4gKiBBIHBhcmFtZXRlciB0aGF0IGNvbnRyb2xzIHRoZSBzcGVlZCBhdCB3aGljaCBhIHJpc2UgaW4gdGVybSBmcmVxdWVuY3kgcmVzdWx0cyBpbiB0ZXJtXG4gKiBmcmVxdWVuY3kgc2F0dXJhdGlvbi4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMS4yLiBTZXR0aW5nIHRoaXMgdG8gYSBoaWdoZXIgdmFsdWUgd2lsbCBnaXZlXG4gKiBzbG93ZXIgc2F0dXJhdGlvbiBsZXZlbHMsIGEgbG93ZXIgdmFsdWUgd2lsbCByZXN1bHQgaW4gcXVpY2tlciBzYXR1cmF0aW9uLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBUaGUgdmFsdWUgdG8gc2V0IGZvciB0aGlzIHR1bmluZyBwYXJhbWV0ZXIuXG4gKi9cbmx1bnIuQnVpbGRlci5wcm90b3R5cGUuazEgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gIHRoaXMuX2sxID0gbnVtYmVyXG59XG5cbi8qKlxuICogQWRkcyBhIGRvY3VtZW50IHRvIHRoZSBpbmRleC5cbiAqXG4gKiBCZWZvcmUgYWRkaW5nIGZpZWxkcyB0byB0aGUgaW5kZXggdGhlIGluZGV4IHNob3VsZCBoYXZlIGJlZW4gZnVsbHkgc2V0dXAsIHdpdGggdGhlIGRvY3VtZW50XG4gKiByZWYgYW5kIGFsbCBmaWVsZHMgdG8gaW5kZXggYWxyZWFkeSBoYXZpbmcgYmVlbiBzcGVjaWZpZWQuXG4gKlxuICogVGhlIGRvY3VtZW50IG11c3QgaGF2ZSBhIGZpZWxkIG5hbWUgYXMgc3BlY2lmaWVkIGJ5IHRoZSByZWYgKGJ5IGRlZmF1bHQgdGhpcyBpcyAnaWQnKSBhbmRcbiAqIGl0IHNob3VsZCBoYXZlIGFsbCBmaWVsZHMgZGVmaW5lZCBmb3IgaW5kZXhpbmcsIHRob3VnaCBudWxsIG9yIHVuZGVmaW5lZCB2YWx1ZXMgd2lsbCBub3RcbiAqIGNhdXNlIGVycm9ycy5cbiAqXG4gKiBFbnRpcmUgZG9jdW1lbnRzIGNhbiBiZSBib29zdGVkIGF0IGJ1aWxkIHRpbWUuIEFwcGx5aW5nIGEgYm9vc3QgdG8gYSBkb2N1bWVudCBpbmRpY2F0ZXMgdGhhdFxuICogdGhpcyBkb2N1bWVudCBzaG91bGQgcmFuayBoaWdoZXIgaW4gc2VhcmNoIHJlc3VsdHMgdGhhbiBvdGhlciBkb2N1bWVudHMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGRvYyAtIFRoZSBkb2N1bWVudCB0byBhZGQgdG8gdGhlIGluZGV4LlxuICogQHBhcmFtIHtvYmplY3R9IGF0dHJpYnV0ZXMgLSBPcHRpb25hbCBhdHRyaWJ1dGVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGRvY3VtZW50LlxuICogQHBhcmFtIHtudW1iZXJ9IFthdHRyaWJ1dGVzLmJvb3N0PTFdIC0gQm9vc3QgYXBwbGllZCB0byBhbGwgdGVybXMgd2l0aGluIHRoaXMgZG9jdW1lbnQuXG4gKi9cbmx1bnIuQnVpbGRlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRvYywgYXR0cmlidXRlcykge1xuICB2YXIgZG9jUmVmID0gZG9jW3RoaXMuX3JlZl0sXG4gICAgICBmaWVsZHMgPSBPYmplY3Qua2V5cyh0aGlzLl9maWVsZHMpXG5cbiAgdGhpcy5fZG9jdW1lbnRzW2RvY1JlZl0gPSBhdHRyaWJ1dGVzIHx8IHt9XG4gIHRoaXMuZG9jdW1lbnRDb3VudCArPSAxXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZmllbGROYW1lID0gZmllbGRzW2ldLFxuICAgICAgICBleHRyYWN0b3IgPSB0aGlzLl9maWVsZHNbZmllbGROYW1lXS5leHRyYWN0b3IsXG4gICAgICAgIGZpZWxkID0gZXh0cmFjdG9yID8gZXh0cmFjdG9yKGRvYykgOiBkb2NbZmllbGROYW1lXSxcbiAgICAgICAgdG9rZW5zID0gdGhpcy50b2tlbml6ZXIoZmllbGQsIHtcbiAgICAgICAgICBmaWVsZHM6IFtmaWVsZE5hbWVdXG4gICAgICAgIH0pLFxuICAgICAgICB0ZXJtcyA9IHRoaXMucGlwZWxpbmUucnVuKHRva2VucyksXG4gICAgICAgIGZpZWxkUmVmID0gbmV3IGx1bnIuRmllbGRSZWYgKGRvY1JlZiwgZmllbGROYW1lKSxcbiAgICAgICAgZmllbGRUZXJtcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAgIHRoaXMuZmllbGRUZXJtRnJlcXVlbmNpZXNbZmllbGRSZWZdID0gZmllbGRUZXJtc1xuICAgIHRoaXMuZmllbGRMZW5ndGhzW2ZpZWxkUmVmXSA9IDBcblxuICAgIC8vIHN0b3JlIHRoZSBsZW5ndGggb2YgdGhpcyBmaWVsZCBmb3IgdGhpcyBkb2N1bWVudFxuICAgIHRoaXMuZmllbGRMZW5ndGhzW2ZpZWxkUmVmXSArPSB0ZXJtcy5sZW5ndGhcblxuICAgIC8vIGNhbGN1bGF0ZSB0ZXJtIGZyZXF1ZW5jaWVzIGZvciB0aGlzIGZpZWxkXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCB0ZXJtcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIHRlcm0gPSB0ZXJtc1tqXVxuXG4gICAgICBpZiAoZmllbGRUZXJtc1t0ZXJtXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZmllbGRUZXJtc1t0ZXJtXSA9IDBcbiAgICAgIH1cblxuICAgICAgZmllbGRUZXJtc1t0ZXJtXSArPSAxXG5cbiAgICAgIC8vIGFkZCB0byBpbnZlcnRlZCBpbmRleFxuICAgICAgLy8gY3JlYXRlIGFuIGluaXRpYWwgcG9zdGluZyBpZiBvbmUgZG9lc24ndCBleGlzdFxuICAgICAgaWYgKHRoaXMuaW52ZXJ0ZWRJbmRleFt0ZXJtXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIHBvc3RpbmcgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgICAgIHBvc3RpbmdbXCJfaW5kZXhcIl0gPSB0aGlzLnRlcm1JbmRleFxuICAgICAgICB0aGlzLnRlcm1JbmRleCArPSAxXG5cbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBmaWVsZHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBwb3N0aW5nW2ZpZWxkc1trXV0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmludmVydGVkSW5kZXhbdGVybV0gPSBwb3N0aW5nXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhbiBlbnRyeSBmb3IgdGhpcyB0ZXJtL2ZpZWxkTmFtZS9kb2NSZWYgdG8gdGhlIGludmVydGVkSW5kZXhcbiAgICAgIGlmICh0aGlzLmludmVydGVkSW5kZXhbdGVybV1bZmllbGROYW1lXVtkb2NSZWZdID09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmludmVydGVkSW5kZXhbdGVybV1bZmllbGROYW1lXVtkb2NSZWZdID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgICAgfVxuXG4gICAgICAvLyBzdG9yZSBhbGwgd2hpdGVsaXN0ZWQgbWV0YWRhdGEgYWJvdXQgdGhpcyB0b2tlbiBpbiB0aGVcbiAgICAgIC8vIGludmVydGVkIGluZGV4XG4gICAgICBmb3IgKHZhciBsID0gMDsgbCA8IHRoaXMubWV0YWRhdGFXaGl0ZWxpc3QubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgdmFyIG1ldGFkYXRhS2V5ID0gdGhpcy5tZXRhZGF0YVdoaXRlbGlzdFtsXSxcbiAgICAgICAgICAgIG1ldGFkYXRhID0gdGVybS5tZXRhZGF0YVttZXRhZGF0YUtleV1cblxuICAgICAgICBpZiAodGhpcy5pbnZlcnRlZEluZGV4W3Rlcm1dW2ZpZWxkTmFtZV1bZG9jUmVmXVttZXRhZGF0YUtleV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5pbnZlcnRlZEluZGV4W3Rlcm1dW2ZpZWxkTmFtZV1bZG9jUmVmXVttZXRhZGF0YUtleV0gPSBbXVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbnZlcnRlZEluZGV4W3Rlcm1dW2ZpZWxkTmFtZV1bZG9jUmVmXVttZXRhZGF0YUtleV0ucHVzaChtZXRhZGF0YSlcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGF2ZXJhZ2UgZG9jdW1lbnQgbGVuZ3RoIGZvciB0aGlzIGluZGV4XG4gKlxuICogQHByaXZhdGVcbiAqL1xubHVuci5CdWlsZGVyLnByb3RvdHlwZS5jYWxjdWxhdGVBdmVyYWdlRmllbGRMZW5ndGhzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmaWVsZFJlZnMgPSBPYmplY3Qua2V5cyh0aGlzLmZpZWxkTGVuZ3RocyksXG4gICAgICBudW1iZXJPZkZpZWxkcyA9IGZpZWxkUmVmcy5sZW5ndGgsXG4gICAgICBhY2N1bXVsYXRvciA9IHt9LFxuICAgICAgZG9jdW1lbnRzV2l0aEZpZWxkID0ge31cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlck9mRmllbGRzOyBpKyspIHtcbiAgICB2YXIgZmllbGRSZWYgPSBsdW5yLkZpZWxkUmVmLmZyb21TdHJpbmcoZmllbGRSZWZzW2ldKSxcbiAgICAgICAgZmllbGQgPSBmaWVsZFJlZi5maWVsZE5hbWVcblxuICAgIGRvY3VtZW50c1dpdGhGaWVsZFtmaWVsZF0gfHwgKGRvY3VtZW50c1dpdGhGaWVsZFtmaWVsZF0gPSAwKVxuICAgIGRvY3VtZW50c1dpdGhGaWVsZFtmaWVsZF0gKz0gMVxuXG4gICAgYWNjdW11bGF0b3JbZmllbGRdIHx8IChhY2N1bXVsYXRvcltmaWVsZF0gPSAwKVxuICAgIGFjY3VtdWxhdG9yW2ZpZWxkXSArPSB0aGlzLmZpZWxkTGVuZ3Roc1tmaWVsZFJlZl1cbiAgfVxuXG4gIHZhciBmaWVsZHMgPSBPYmplY3Qua2V5cyh0aGlzLl9maWVsZHMpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZmllbGROYW1lID0gZmllbGRzW2ldXG4gICAgYWNjdW11bGF0b3JbZmllbGROYW1lXSA9IGFjY3VtdWxhdG9yW2ZpZWxkTmFtZV0gLyBkb2N1bWVudHNXaXRoRmllbGRbZmllbGROYW1lXVxuICB9XG5cbiAgdGhpcy5hdmVyYWdlRmllbGRMZW5ndGggPSBhY2N1bXVsYXRvclxufVxuXG4vKipcbiAqIEJ1aWxkcyBhIHZlY3RvciBzcGFjZSBtb2RlbCBvZiBldmVyeSBkb2N1bWVudCB1c2luZyBsdW5yLlZlY3RvclxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmx1bnIuQnVpbGRlci5wcm90b3R5cGUuY3JlYXRlRmllbGRWZWN0b3JzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZmllbGRWZWN0b3JzID0ge30sXG4gICAgICBmaWVsZFJlZnMgPSBPYmplY3Qua2V5cyh0aGlzLmZpZWxkVGVybUZyZXF1ZW5jaWVzKSxcbiAgICAgIGZpZWxkUmVmc0xlbmd0aCA9IGZpZWxkUmVmcy5sZW5ndGgsXG4gICAgICB0ZXJtSWRmQ2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZFJlZnNMZW5ndGg7IGkrKykge1xuICAgIHZhciBmaWVsZFJlZiA9IGx1bnIuRmllbGRSZWYuZnJvbVN0cmluZyhmaWVsZFJlZnNbaV0pLFxuICAgICAgICBmaWVsZE5hbWUgPSBmaWVsZFJlZi5maWVsZE5hbWUsXG4gICAgICAgIGZpZWxkTGVuZ3RoID0gdGhpcy5maWVsZExlbmd0aHNbZmllbGRSZWZdLFxuICAgICAgICBmaWVsZFZlY3RvciA9IG5ldyBsdW5yLlZlY3RvcixcbiAgICAgICAgdGVybUZyZXF1ZW5jaWVzID0gdGhpcy5maWVsZFRlcm1GcmVxdWVuY2llc1tmaWVsZFJlZl0sXG4gICAgICAgIHRlcm1zID0gT2JqZWN0LmtleXModGVybUZyZXF1ZW5jaWVzKSxcbiAgICAgICAgdGVybXNMZW5ndGggPSB0ZXJtcy5sZW5ndGhcblxuXG4gICAgdmFyIGZpZWxkQm9vc3QgPSB0aGlzLl9maWVsZHNbZmllbGROYW1lXS5ib29zdCB8fCAxLFxuICAgICAgICBkb2NCb29zdCA9IHRoaXMuX2RvY3VtZW50c1tmaWVsZFJlZi5kb2NSZWZdLmJvb3N0IHx8IDFcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGVybXNMZW5ndGg7IGorKykge1xuICAgICAgdmFyIHRlcm0gPSB0ZXJtc1tqXSxcbiAgICAgICAgICB0ZiA9IHRlcm1GcmVxdWVuY2llc1t0ZXJtXSxcbiAgICAgICAgICB0ZXJtSW5kZXggPSB0aGlzLmludmVydGVkSW5kZXhbdGVybV0uX2luZGV4LFxuICAgICAgICAgIGlkZiwgc2NvcmUsIHNjb3JlV2l0aFByZWNpc2lvblxuXG4gICAgICBpZiAodGVybUlkZkNhY2hlW3Rlcm1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWRmID0gbHVuci5pZGYodGhpcy5pbnZlcnRlZEluZGV4W3Rlcm1dLCB0aGlzLmRvY3VtZW50Q291bnQpXG4gICAgICAgIHRlcm1JZGZDYWNoZVt0ZXJtXSA9IGlkZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWRmID0gdGVybUlkZkNhY2hlW3Rlcm1dXG4gICAgICB9XG5cbiAgICAgIHNjb3JlID0gaWRmICogKCh0aGlzLl9rMSArIDEpICogdGYpIC8gKHRoaXMuX2sxICogKDEgLSB0aGlzLl9iICsgdGhpcy5fYiAqIChmaWVsZExlbmd0aCAvIHRoaXMuYXZlcmFnZUZpZWxkTGVuZ3RoW2ZpZWxkTmFtZV0pKSArIHRmKVxuICAgICAgc2NvcmUgKj0gZmllbGRCb29zdFxuICAgICAgc2NvcmUgKj0gZG9jQm9vc3RcbiAgICAgIHNjb3JlV2l0aFByZWNpc2lvbiA9IE1hdGgucm91bmQoc2NvcmUgKiAxMDAwKSAvIDEwMDBcbiAgICAgIC8vIENvbnZlcnRzIDEuMjM0NTY3ODkgdG8gMS4yMzQuXG4gICAgICAvLyBSZWR1Y2luZyB0aGUgcHJlY2lzaW9uIHNvIHRoYXQgdGhlIHZlY3RvcnMgdGFrZSB1cCBsZXNzXG4gICAgICAvLyBzcGFjZSB3aGVuIHNlcmlhbGlzZWQuIERvaW5nIGl0IG5vdyBzbyB0aGF0IHRoZXkgYmVoYXZlXG4gICAgICAvLyB0aGUgc2FtZSBiZWZvcmUgYW5kIGFmdGVyIHNlcmlhbGlzYXRpb24uIEFsc28sIHRoaXMgaXNcbiAgICAgIC8vIHRoZSBmYXN0ZXN0IGFwcHJvYWNoIHRvIHJlZHVjaW5nIGEgbnVtYmVyJ3MgcHJlY2lzaW9uIGluXG4gICAgICAvLyBKYXZhU2NyaXB0LlxuXG4gICAgICBmaWVsZFZlY3Rvci5pbnNlcnQodGVybUluZGV4LCBzY29yZVdpdGhQcmVjaXNpb24pXG4gICAgfVxuXG4gICAgZmllbGRWZWN0b3JzW2ZpZWxkUmVmXSA9IGZpZWxkVmVjdG9yXG4gIH1cblxuICB0aGlzLmZpZWxkVmVjdG9ycyA9IGZpZWxkVmVjdG9yc1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB0b2tlbiBzZXQgb2YgYWxsIHRva2VucyBpbiB0aGUgaW5kZXggdXNpbmcgbHVuci5Ub2tlblNldFxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmx1bnIuQnVpbGRlci5wcm90b3R5cGUuY3JlYXRlVG9rZW5TZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMudG9rZW5TZXQgPSBsdW5yLlRva2VuU2V0LmZyb21BcnJheShcbiAgICBPYmplY3Qua2V5cyh0aGlzLmludmVydGVkSW5kZXgpLnNvcnQoKVxuICApXG59XG5cbi8qKlxuICogQnVpbGRzIHRoZSBpbmRleCwgY3JlYXRpbmcgYW4gaW5zdGFuY2Ugb2YgbHVuci5JbmRleC5cbiAqXG4gKiBUaGlzIGNvbXBsZXRlcyB0aGUgaW5kZXhpbmcgcHJvY2VzcyBhbmQgc2hvdWxkIG9ubHkgYmUgY2FsbGVkXG4gKiBvbmNlIGFsbCBkb2N1bWVudHMgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBpbmRleC5cbiAqXG4gKiBAcmV0dXJucyB7bHVuci5JbmRleH1cbiAqL1xubHVuci5CdWlsZGVyLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jYWxjdWxhdGVBdmVyYWdlRmllbGRMZW5ndGhzKClcbiAgdGhpcy5jcmVhdGVGaWVsZFZlY3RvcnMoKVxuICB0aGlzLmNyZWF0ZVRva2VuU2V0KClcblxuICByZXR1cm4gbmV3IGx1bnIuSW5kZXgoe1xuICAgIGludmVydGVkSW5kZXg6IHRoaXMuaW52ZXJ0ZWRJbmRleCxcbiAgICBmaWVsZFZlY3RvcnM6IHRoaXMuZmllbGRWZWN0b3JzLFxuICAgIHRva2VuU2V0OiB0aGlzLnRva2VuU2V0LFxuICAgIGZpZWxkczogT2JqZWN0LmtleXModGhpcy5fZmllbGRzKSxcbiAgICBwaXBlbGluZTogdGhpcy5zZWFyY2hQaXBlbGluZVxuICB9KVxufVxuXG4vKipcbiAqIEFwcGxpZXMgYSBwbHVnaW4gdG8gdGhlIGluZGV4IGJ1aWxkZXIuXG4gKlxuICogQSBwbHVnaW4gaXMgYSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aXRoIHRoZSBpbmRleCBidWlsZGVyIGFzIGl0cyBjb250ZXh0LlxuICogUGx1Z2lucyBjYW4gYmUgdXNlZCB0byBjdXN0b21pc2Ugb3IgZXh0ZW5kIHRoZSBiZWhhdmlvdXIgb2YgdGhlIGluZGV4XG4gKiBpbiBzb21lIHdheS4gQSBwbHVnaW4gaXMganVzdCBhIGZ1bmN0aW9uLCB0aGF0IGVuY2Fwc3VsYXRlZCB0aGUgY3VzdG9tXG4gKiBiZWhhdmlvdXIgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB3aGVuIGJ1aWxkaW5nIHRoZSBpbmRleC5cbiAqXG4gKiBUaGUgcGx1Z2luIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGluZGV4IGJ1aWxkZXIgYXMgaXRzIGFyZ3VtZW50LCBhZGRpdGlvbmFsXG4gKiBhcmd1bWVudHMgY2FuIGFsc28gYmUgcGFzc2VkIHdoZW4gY2FsbGluZyB1c2UuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZFxuICogd2l0aCB0aGUgaW5kZXggYnVpbGRlciBhcyBpdHMgY29udGV4dC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwbHVnaW4gVGhlIHBsdWdpbiB0byBhcHBseS5cbiAqL1xubHVuci5CdWlsZGVyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gIGFyZ3MudW5zaGlmdCh0aGlzKVxuICBmbi5hcHBseSh0aGlzLCBhcmdzKVxufVxuLyoqXG4gKiBDb250YWlucyBhbmQgY29sbGVjdHMgbWV0YWRhdGEgYWJvdXQgYSBtYXRjaGluZyBkb2N1bWVudC5cbiAqIEEgc2luZ2xlIGluc3RhbmNlIG9mIGx1bnIuTWF0Y2hEYXRhIGlzIHJldHVybmVkIGFzIHBhcnQgb2YgZXZlcnlcbiAqIGx1bnIuSW5kZXh+UmVzdWx0LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IHRlcm0gLSBUaGUgdGVybSB0aGlzIG1hdGNoIGRhdGEgaXMgYXNzb2NpYXRlZCB3aXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgLSBUaGUgZmllbGQgaW4gd2hpY2ggdGhlIHRlcm0gd2FzIGZvdW5kXG4gKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGEgLSBUaGUgbWV0YWRhdGEgcmVjb3JkZWQgYWJvdXQgdGhpcyB0ZXJtIGluIHRoaXMgZmllbGRcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBtZXRhZGF0YSAtIEEgY2xvbmVkIGNvbGxlY3Rpb24gb2YgbWV0YWRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZG9jdW1lbnQuXG4gKiBAc2VlIHtAbGluayBsdW5yLkluZGV4flJlc3VsdH1cbiAqL1xubHVuci5NYXRjaERhdGEgPSBmdW5jdGlvbiAodGVybSwgZmllbGQsIG1ldGFkYXRhKSB7XG4gIHZhciBjbG9uZWRNZXRhZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICBtZXRhZGF0YUtleXMgPSBPYmplY3Qua2V5cyhtZXRhZGF0YSB8fCB7fSlcblxuICAvLyBDbG9uaW5nIHRoZSBtZXRhZGF0YSB0byBwcmV2ZW50IHRoZSBvcmlnaW5hbFxuICAvLyBiZWluZyBtdXRhdGVkIGR1cmluZyBtYXRjaCBkYXRhIGNvbWJpbmF0aW9uLlxuICAvLyBNZXRhZGF0YSBpcyBrZXB0IGluIGFuIGFycmF5IHdpdGhpbiB0aGUgaW52ZXJ0ZWRcbiAgLy8gaW5kZXggc28gY2xvbmluZyB0aGUgZGF0YSBjYW4gYmUgZG9uZSB3aXRoXG4gIC8vIEFycmF5I3NsaWNlXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YWRhdGFLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IG1ldGFkYXRhS2V5c1tpXVxuICAgIGNsb25lZE1ldGFkYXRhW2tleV0gPSBtZXRhZGF0YVtrZXldLnNsaWNlKClcbiAgfVxuXG4gIHRoaXMubWV0YWRhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgaWYgKHRlcm0gIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMubWV0YWRhdGFbdGVybV0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgdGhpcy5tZXRhZGF0YVt0ZXJtXVtmaWVsZF0gPSBjbG9uZWRNZXRhZGF0YVxuICB9XG59XG5cbi8qKlxuICogQW4gaW5zdGFuY2Ugb2YgbHVuci5NYXRjaERhdGEgd2lsbCBiZSBjcmVhdGVkIGZvciBldmVyeSB0ZXJtIHRoYXQgbWF0Y2hlcyBhXG4gKiBkb2N1bWVudC4gSG93ZXZlciBvbmx5IG9uZSBpbnN0YW5jZSBpcyByZXF1aXJlZCBpbiBhIGx1bnIuSW5kZXh+UmVzdWx0LiBUaGlzXG4gKiBtZXRob2QgY29tYmluZXMgbWV0YWRhdGEgZnJvbSBhbm90aGVyIGluc3RhbmNlIG9mIGx1bnIuTWF0Y2hEYXRhIHdpdGggdGhpc1xuICogb2JqZWN0cyBtZXRhZGF0YS5cbiAqXG4gKiBAcGFyYW0ge2x1bnIuTWF0Y2hEYXRhfSBvdGhlck1hdGNoRGF0YSAtIEFub3RoZXIgaW5zdGFuY2Ugb2YgbWF0Y2ggZGF0YSB0byBtZXJnZSB3aXRoIHRoaXMgb25lLlxuICogQHNlZSB7QGxpbmsgbHVuci5JbmRleH5SZXN1bHR9XG4gKi9cbmx1bnIuTWF0Y2hEYXRhLnByb3RvdHlwZS5jb21iaW5lID0gZnVuY3Rpb24gKG90aGVyTWF0Y2hEYXRhKSB7XG4gIHZhciB0ZXJtcyA9IE9iamVjdC5rZXlzKG90aGVyTWF0Y2hEYXRhLm1ldGFkYXRhKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGVybXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGVybSA9IHRlcm1zW2ldLFxuICAgICAgICBmaWVsZHMgPSBPYmplY3Qua2V5cyhvdGhlck1hdGNoRGF0YS5tZXRhZGF0YVt0ZXJtXSlcblxuICAgIGlmICh0aGlzLm1ldGFkYXRhW3Rlcm1dID09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5tZXRhZGF0YVt0ZXJtXSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZpZWxkcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGZpZWxkID0gZmllbGRzW2pdLFxuICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhvdGhlck1hdGNoRGF0YS5tZXRhZGF0YVt0ZXJtXVtmaWVsZF0pXG5cbiAgICAgIGlmICh0aGlzLm1ldGFkYXRhW3Rlcm1dW2ZpZWxkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5tZXRhZGF0YVt0ZXJtXVtmaWVsZF0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwga2V5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1trXVxuXG4gICAgICAgIGlmICh0aGlzLm1ldGFkYXRhW3Rlcm1dW2ZpZWxkXVtrZXldID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMubWV0YWRhdGFbdGVybV1bZmllbGRdW2tleV0gPSBvdGhlck1hdGNoRGF0YS5tZXRhZGF0YVt0ZXJtXVtmaWVsZF1ba2V5XVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubWV0YWRhdGFbdGVybV1bZmllbGRdW2tleV0gPSB0aGlzLm1ldGFkYXRhW3Rlcm1dW2ZpZWxkXVtrZXldLmNvbmNhdChvdGhlck1hdGNoRGF0YS5tZXRhZGF0YVt0ZXJtXVtmaWVsZF1ba2V5XSlcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWRkIG1ldGFkYXRhIGZvciBhIHRlcm0vZmllbGQgcGFpciB0byB0aGlzIGluc3RhbmNlIG9mIG1hdGNoIGRhdGEuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRlcm0gLSBUaGUgdGVybSB0aGlzIG1hdGNoIGRhdGEgaXMgYXNzb2NpYXRlZCB3aXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgLSBUaGUgZmllbGQgaW4gd2hpY2ggdGhlIHRlcm0gd2FzIGZvdW5kXG4gKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGEgLSBUaGUgbWV0YWRhdGEgcmVjb3JkZWQgYWJvdXQgdGhpcyB0ZXJtIGluIHRoaXMgZmllbGRcbiAqL1xubHVuci5NYXRjaERhdGEucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0ZXJtLCBmaWVsZCwgbWV0YWRhdGEpIHtcbiAgaWYgKCEodGVybSBpbiB0aGlzLm1ldGFkYXRhKSkge1xuICAgIHRoaXMubWV0YWRhdGFbdGVybV0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgdGhpcy5tZXRhZGF0YVt0ZXJtXVtmaWVsZF0gPSBtZXRhZGF0YVxuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKCEoZmllbGQgaW4gdGhpcy5tZXRhZGF0YVt0ZXJtXSkpIHtcbiAgICB0aGlzLm1ldGFkYXRhW3Rlcm1dW2ZpZWxkXSA9IG1ldGFkYXRhXG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgbWV0YWRhdGFLZXlzID0gT2JqZWN0LmtleXMobWV0YWRhdGEpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhZGF0YUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0gbWV0YWRhdGFLZXlzW2ldXG5cbiAgICBpZiAoa2V5IGluIHRoaXMubWV0YWRhdGFbdGVybV1bZmllbGRdKSB7XG4gICAgICB0aGlzLm1ldGFkYXRhW3Rlcm1dW2ZpZWxkXVtrZXldID0gdGhpcy5tZXRhZGF0YVt0ZXJtXVtmaWVsZF1ba2V5XS5jb25jYXQobWV0YWRhdGFba2V5XSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZXRhZGF0YVt0ZXJtXVtmaWVsZF1ba2V5XSA9IG1ldGFkYXRhW2tleV1cbiAgICB9XG4gIH1cbn1cbi8qKlxuICogQSBsdW5yLlF1ZXJ5IHByb3ZpZGVzIGEgcHJvZ3JhbW1hdGljIHdheSBvZiBkZWZpbmluZyBxdWVyaWVzIHRvIGJlIHBlcmZvcm1lZFxuICogYWdhaW5zdCBhIHtAbGluayBsdW5yLkluZGV4fS5cbiAqXG4gKiBQcmVmZXIgY29uc3RydWN0aW5nIGEgbHVuci5RdWVyeSB1c2luZyB0aGUge0BsaW5rIGx1bnIuSW5kZXgjcXVlcnl9IG1ldGhvZFxuICogc28gdGhlIHF1ZXJ5IG9iamVjdCBpcyBwcmUtaW5pdGlhbGl6ZWQgd2l0aCB0aGUgcmlnaHQgaW5kZXggZmllbGRzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHByb3BlcnR5IHtsdW5yLlF1ZXJ5fkNsYXVzZVtdfSBjbGF1c2VzIC0gQW4gYXJyYXkgb2YgcXVlcnkgY2xhdXNlcy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IGFsbEZpZWxkcyAtIEFuIGFycmF5IG9mIGFsbCBhdmFpbGFibGUgZmllbGRzIGluIGEgbHVuci5JbmRleC5cbiAqL1xubHVuci5RdWVyeSA9IGZ1bmN0aW9uIChhbGxGaWVsZHMpIHtcbiAgdGhpcy5jbGF1c2VzID0gW11cbiAgdGhpcy5hbGxGaWVsZHMgPSBhbGxGaWVsZHNcbn1cblxuLyoqXG4gKiBDb25zdGFudHMgZm9yIGluZGljYXRpbmcgd2hhdCBraW5kIG9mIGF1dG9tYXRpYyB3aWxkY2FyZCBpbnNlcnRpb24gd2lsbCBiZSB1c2VkIHdoZW4gY29uc3RydWN0aW5nIGEgcXVlcnkgY2xhdXNlLlxuICpcbiAqIFRoaXMgYWxsb3dzIHdpbGRjYXJkcyB0byBiZSBhZGRlZCB0byB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSB0ZXJtIHdpdGhvdXQgaGF2aW5nIHRvIG1hbnVhbGx5IGRvIGFueSBzdHJpbmdcbiAqIGNvbmNhdGVuYXRpb24uXG4gKlxuICogVGhlIHdpbGRjYXJkIGNvbnN0YW50cyBjYW4gYmUgYml0d2lzZSBjb21iaW5lZCB0byBzZWxlY3QgYm90aCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aWxkY2FyZHMuXG4gKlxuICogQGNvbnN0YW50XG4gKiBAZGVmYXVsdFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHdpbGRjYXJkLk5PTkUgLSBUaGUgdGVybSB3aWxsIGhhdmUgbm8gd2lsZGNhcmRzIGluc2VydGVkLCB0aGlzIGlzIHRoZSBkZWZhdWx0IGJlaGF2aW91clxuICogQHByb3BlcnR5IHtudW1iZXJ9IHdpbGRjYXJkLkxFQURJTkcgLSBQcmVwZW5kIHRoZSB0ZXJtIHdpdGggYSB3aWxkY2FyZCwgdW5sZXNzIGEgbGVhZGluZyB3aWxkY2FyZCBhbHJlYWR5IGV4aXN0c1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHdpbGRjYXJkLlRSQUlMSU5HIC0gQXBwZW5kIGEgd2lsZGNhcmQgdG8gdGhlIHRlcm0sIHVubGVzcyBhIHRyYWlsaW5nIHdpbGRjYXJkIGFscmVhZHkgZXhpc3RzXG4gKiBAc2VlIGx1bnIuUXVlcnl+Q2xhdXNlXG4gKiBAc2VlIGx1bnIuUXVlcnkjY2xhdXNlXG4gKiBAc2VlIGx1bnIuUXVlcnkjdGVybVxuICogQGV4YW1wbGUgPGNhcHRpb24+cXVlcnkgdGVybSB3aXRoIHRyYWlsaW5nIHdpbGRjYXJkPC9jYXB0aW9uPlxuICogcXVlcnkudGVybSgnZm9vJywgeyB3aWxkY2FyZDogbHVuci5RdWVyeS53aWxkY2FyZC5UUkFJTElORyB9KVxuICogQGV4YW1wbGUgPGNhcHRpb24+cXVlcnkgdGVybSB3aXRoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdpbGRjYXJkPC9jYXB0aW9uPlxuICogcXVlcnkudGVybSgnZm9vJywge1xuICogICB3aWxkY2FyZDogbHVuci5RdWVyeS53aWxkY2FyZC5MRUFESU5HIHwgbHVuci5RdWVyeS53aWxkY2FyZC5UUkFJTElOR1xuICogfSlcbiAqL1xuXG5sdW5yLlF1ZXJ5LndpbGRjYXJkID0gbmV3IFN0cmluZyAoXCIqXCIpXG5sdW5yLlF1ZXJ5LndpbGRjYXJkLk5PTkUgPSAwXG5sdW5yLlF1ZXJ5LndpbGRjYXJkLkxFQURJTkcgPSAxXG5sdW5yLlF1ZXJ5LndpbGRjYXJkLlRSQUlMSU5HID0gMlxuXG4vKipcbiAqIENvbnN0YW50cyBmb3IgaW5kaWNhdGluZyB3aGF0IGtpbmQgb2YgcHJlc2VuY2UgYSB0ZXJtIG11c3QgaGF2ZSBpbiBtYXRjaGluZyBkb2N1bWVudHMuXG4gKlxuICogQGNvbnN0YW50XG4gKiBAZW51bSB7bnVtYmVyfVxuICogQHNlZSBsdW5yLlF1ZXJ5fkNsYXVzZVxuICogQHNlZSBsdW5yLlF1ZXJ5I2NsYXVzZVxuICogQHNlZSBsdW5yLlF1ZXJ5I3Rlcm1cbiAqIEBleGFtcGxlIDxjYXB0aW9uPnF1ZXJ5IHRlcm0gd2l0aCByZXF1aXJlZCBwcmVzZW5jZTwvY2FwdGlvbj5cbiAqIHF1ZXJ5LnRlcm0oJ2ZvbycsIHsgcHJlc2VuY2U6IGx1bnIuUXVlcnkucHJlc2VuY2UuUkVRVUlSRUQgfSlcbiAqL1xubHVuci5RdWVyeS5wcmVzZW5jZSA9IHtcbiAgLyoqXG4gICAqIFRlcm0ncyBwcmVzZW5jZSBpbiBhIGRvY3VtZW50IGlzIG9wdGlvbmFsLCB0aGlzIGlzIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgKi9cbiAgT1BUSU9OQUw6IDEsXG5cbiAgLyoqXG4gICAqIFRlcm0ncyBwcmVzZW5jZSBpbiBhIGRvY3VtZW50IGlzIHJlcXVpcmVkLCBkb2N1bWVudHMgdGhhdCBkbyBub3QgY29udGFpblxuICAgKiB0aGlzIHRlcm0gd2lsbCBub3QgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBSRVFVSVJFRDogMixcblxuICAvKipcbiAgICogVGVybSdzIHByZXNlbmNlIGluIGEgZG9jdW1lbnQgaXMgcHJvaGliaXRlZCwgZG9jdW1lbnRzIHRoYXQgZG8gY29udGFpblxuICAgKiB0aGlzIHRlcm0gd2lsbCBub3QgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBQUk9ISUJJVEVEOiAzXG59XG5cbi8qKlxuICogQSBzaW5nbGUgY2xhdXNlIGluIGEge0BsaW5rIGx1bnIuUXVlcnl9IGNvbnRhaW5zIGEgdGVybSBhbmQgZGV0YWlscyBvbiBob3cgdG9cbiAqIG1hdGNoIHRoYXQgdGVybSBhZ2FpbnN0IGEge0BsaW5rIGx1bnIuSW5kZXh9LlxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IGx1bnIuUXVlcnl+Q2xhdXNlXG4gKiBAcHJvcGVydHkge3N0cmluZ1tdfSBmaWVsZHMgLSBUaGUgZmllbGRzIGluIGFuIGluZGV4IHRoaXMgY2xhdXNlIHNob3VsZCBiZSBtYXRjaGVkIGFnYWluc3QuXG4gKiBAcHJvcGVydHkge251bWJlcn0gW2Jvb3N0PTFdIC0gQW55IGJvb3N0IHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgd2hlbiBtYXRjaGluZyB0aGlzIGNsYXVzZS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbZWRpdERpc3RhbmNlXSAtIFdoZXRoZXIgdGhlIHRlcm0gc2hvdWxkIGhhdmUgZnV6enkgbWF0Y2hpbmcgYXBwbGllZCwgYW5kIGhvdyBmdXp6eSB0aGUgbWF0Y2ggc2hvdWxkIGJlLlxuICogQHByb3BlcnR5IHtib29sZWFufSBbdXNlUGlwZWxpbmVdIC0gV2hldGhlciB0aGUgdGVybSBzaG91bGQgYmUgcGFzc2VkIHRocm91Z2ggdGhlIHNlYXJjaCBwaXBlbGluZS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbd2lsZGNhcmQ9bHVuci5RdWVyeS53aWxkY2FyZC5OT05FXSAtIFdoZXRoZXIgdGhlIHRlcm0gc2hvdWxkIGhhdmUgd2lsZGNhcmRzIGFwcGVuZGVkIG9yIHByZXBlbmRlZC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbcHJlc2VuY2U9bHVuci5RdWVyeS5wcmVzZW5jZS5PUFRJT05BTF0gLSBUaGUgdGVybXMgcHJlc2VuY2UgaW4gYW55IG1hdGNoaW5nIGRvY3VtZW50cy5cbiAqL1xuXG4vKipcbiAqIEFkZHMgYSB7QGxpbmsgbHVuci5RdWVyeX5DbGF1c2V9IHRvIHRoaXMgcXVlcnkuXG4gKlxuICogVW5sZXNzIHRoZSBjbGF1c2UgY29udGFpbnMgdGhlIGZpZWxkcyB0byBiZSBtYXRjaGVkIGFsbCBmaWVsZHMgd2lsbCBiZSBtYXRjaGVkLiBJbiBhZGRpdGlvblxuICogYSBkZWZhdWx0IGJvb3N0IG9mIDEgaXMgYXBwbGllZCB0byB0aGUgY2xhdXNlLlxuICpcbiAqIEBwYXJhbSB7bHVuci5RdWVyeX5DbGF1c2V9IGNsYXVzZSAtIFRoZSBjbGF1c2UgdG8gYWRkIHRvIHRoaXMgcXVlcnkuXG4gKiBAc2VlIGx1bnIuUXVlcnl+Q2xhdXNlXG4gKiBAcmV0dXJucyB7bHVuci5RdWVyeX1cbiAqL1xubHVuci5RdWVyeS5wcm90b3R5cGUuY2xhdXNlID0gZnVuY3Rpb24gKGNsYXVzZSkge1xuICBpZiAoISgnZmllbGRzJyBpbiBjbGF1c2UpKSB7XG4gICAgY2xhdXNlLmZpZWxkcyA9IHRoaXMuYWxsRmllbGRzXG4gIH1cblxuICBpZiAoISgnYm9vc3QnIGluIGNsYXVzZSkpIHtcbiAgICBjbGF1c2UuYm9vc3QgPSAxXG4gIH1cblxuICBpZiAoISgndXNlUGlwZWxpbmUnIGluIGNsYXVzZSkpIHtcbiAgICBjbGF1c2UudXNlUGlwZWxpbmUgPSB0cnVlXG4gIH1cblxuICBpZiAoISgnd2lsZGNhcmQnIGluIGNsYXVzZSkpIHtcbiAgICBjbGF1c2Uud2lsZGNhcmQgPSBsdW5yLlF1ZXJ5LndpbGRjYXJkLk5PTkVcbiAgfVxuXG4gIGlmICgoY2xhdXNlLndpbGRjYXJkICYgbHVuci5RdWVyeS53aWxkY2FyZC5MRUFESU5HKSAmJiAoY2xhdXNlLnRlcm0uY2hhckF0KDApICE9IGx1bnIuUXVlcnkud2lsZGNhcmQpKSB7XG4gICAgY2xhdXNlLnRlcm0gPSBcIipcIiArIGNsYXVzZS50ZXJtXG4gIH1cblxuICBpZiAoKGNsYXVzZS53aWxkY2FyZCAmIGx1bnIuUXVlcnkud2lsZGNhcmQuVFJBSUxJTkcpICYmIChjbGF1c2UudGVybS5zbGljZSgtMSkgIT0gbHVuci5RdWVyeS53aWxkY2FyZCkpIHtcbiAgICBjbGF1c2UudGVybSA9IFwiXCIgKyBjbGF1c2UudGVybSArIFwiKlwiXG4gIH1cblxuICBpZiAoISgncHJlc2VuY2UnIGluIGNsYXVzZSkpIHtcbiAgICBjbGF1c2UucHJlc2VuY2UgPSBsdW5yLlF1ZXJ5LnByZXNlbmNlLk9QVElPTkFMXG4gIH1cblxuICB0aGlzLmNsYXVzZXMucHVzaChjbGF1c2UpXG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBBIG5lZ2F0ZWQgcXVlcnkgaXMgb25lIGluIHdoaWNoIGV2ZXJ5IGNsYXVzZSBoYXMgYSBwcmVzZW5jZSBvZlxuICogcHJvaGliaXRlZC4gVGhlc2UgcXVlcmllcyByZXF1aXJlIHNvbWUgc3BlY2lhbCBwcm9jZXNzaW5nIHRvIHJldHVyblxuICogdGhlIGV4cGVjdGVkIHJlc3VsdHMuXG4gKlxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5sdW5yLlF1ZXJ5LnByb3RvdHlwZS5pc05lZ2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jbGF1c2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRoaXMuY2xhdXNlc1tpXS5wcmVzZW5jZSAhPSBsdW5yLlF1ZXJ5LnByZXNlbmNlLlBST0hJQklURUQpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogQWRkcyBhIHRlcm0gdG8gdGhlIGN1cnJlbnQgcXVlcnksIHVuZGVyIHRoZSBjb3ZlcnMgdGhpcyB3aWxsIGNyZWF0ZSBhIHtAbGluayBsdW5yLlF1ZXJ5fkNsYXVzZX1cbiAqIHRvIHRoZSBsaXN0IG9mIGNsYXVzZXMgdGhhdCBtYWtlIHVwIHRoaXMgcXVlcnkuXG4gKlxuICogVGhlIHRlcm0gaXMgdXNlZCBhcyBpcywgaS5lLiBubyB0b2tlbml6YXRpb24gd2lsbCBiZSBwZXJmb3JtZWQgYnkgdGhpcyBtZXRob2QuIEluc3RlYWQgY29udmVyc2lvblxuICogdG8gYSB0b2tlbiBvciB0b2tlbi1saWtlIHN0cmluZyBzaG91bGQgYmUgZG9uZSBiZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZC5cbiAqXG4gKiBUaGUgdGVybSB3aWxsIGJlIGNvbnZlcnRlZCB0byBhIHN0cmluZyBieSBjYWxsaW5nIGB0b1N0cmluZ2AuIE11bHRpcGxlIHRlcm1zIGNhbiBiZSBwYXNzZWQgYXMgYW5cbiAqIGFycmF5LCBlYWNoIHRlcm0gaW4gdGhlIGFycmF5IHdpbGwgc2hhcmUgdGhlIHNhbWUgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdHxvYmplY3RbXX0gdGVybSAtIFRoZSB0ZXJtKHMpIHRvIGFkZCB0byB0aGUgcXVlcnkuXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIC0gQW55IGFkZGl0aW9uYWwgcHJvcGVydGllcyB0byBhZGQgdG8gdGhlIHF1ZXJ5IGNsYXVzZS5cbiAqIEByZXR1cm5zIHtsdW5yLlF1ZXJ5fVxuICogQHNlZSBsdW5yLlF1ZXJ5I2NsYXVzZVxuICogQHNlZSBsdW5yLlF1ZXJ5fkNsYXVzZVxuICogQGV4YW1wbGUgPGNhcHRpb24+YWRkaW5nIGEgc2luZ2xlIHRlcm0gdG8gYSBxdWVyeTwvY2FwdGlvbj5cbiAqIHF1ZXJ5LnRlcm0oXCJmb29cIilcbiAqIEBleGFtcGxlIDxjYXB0aW9uPmFkZGluZyBhIHNpbmdsZSB0ZXJtIHRvIGEgcXVlcnkgYW5kIHNwZWNpZnlpbmcgc2VhcmNoIGZpZWxkcywgdGVybSBib29zdCBhbmQgYXV0b21hdGljIHRyYWlsaW5nIHdpbGRjYXJkPC9jYXB0aW9uPlxuICogcXVlcnkudGVybShcImZvb1wiLCB7XG4gKiAgIGZpZWxkczogW1widGl0bGVcIl0sXG4gKiAgIGJvb3N0OiAxMCxcbiAqICAgd2lsZGNhcmQ6IGx1bnIuUXVlcnkud2lsZGNhcmQuVFJBSUxJTkdcbiAqIH0pXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj51c2luZyBsdW5yLnRva2VuaXplciB0byBjb252ZXJ0IGEgc3RyaW5nIHRvIHRva2VucyBiZWZvcmUgdXNpbmcgdGhlbSBhcyB0ZXJtczwvY2FwdGlvbj5cbiAqIHF1ZXJ5LnRlcm0obHVuci50b2tlbml6ZXIoXCJmb28gYmFyXCIpKVxuICovXG5sdW5yLlF1ZXJ5LnByb3RvdHlwZS50ZXJtID0gZnVuY3Rpb24gKHRlcm0sIG9wdGlvbnMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodGVybSkpIHtcbiAgICB0ZXJtLmZvckVhY2goZnVuY3Rpb24gKHQpIHsgdGhpcy50ZXJtKHQsIGx1bnIudXRpbHMuY2xvbmUob3B0aW9ucykpIH0sIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHZhciBjbGF1c2UgPSBvcHRpb25zIHx8IHt9XG4gIGNsYXVzZS50ZXJtID0gdGVybS50b1N0cmluZygpXG5cbiAgdGhpcy5jbGF1c2UoY2xhdXNlKVxuXG4gIHJldHVybiB0aGlzXG59XG5sdW5yLlF1ZXJ5UGFyc2VFcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlLCBzdGFydCwgZW5kKSB7XG4gIHRoaXMubmFtZSA9IFwiUXVlcnlQYXJzZUVycm9yXCJcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICB0aGlzLnN0YXJ0ID0gc3RhcnRcbiAgdGhpcy5lbmQgPSBlbmRcbn1cblxubHVuci5RdWVyeVBhcnNlRXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yXG5sdW5yLlF1ZXJ5TGV4ZXIgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHRoaXMubGV4ZW1lcyA9IFtdXG4gIHRoaXMuc3RyID0gc3RyXG4gIHRoaXMubGVuZ3RoID0gc3RyLmxlbmd0aFxuICB0aGlzLnBvcyA9IDBcbiAgdGhpcy5zdGFydCA9IDBcbiAgdGhpcy5lc2NhcGVDaGFyUG9zaXRpb25zID0gW11cbn1cblxubHVuci5RdWVyeUxleGVyLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IGx1bnIuUXVlcnlMZXhlci5sZXhUZXh0XG5cbiAgd2hpbGUgKHN0YXRlKSB7XG4gICAgc3RhdGUgPSBzdGF0ZSh0aGlzKVxuICB9XG59XG5cbmx1bnIuUXVlcnlMZXhlci5wcm90b3R5cGUuc2xpY2VTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdWJTbGljZXMgPSBbXSxcbiAgICAgIHNsaWNlU3RhcnQgPSB0aGlzLnN0YXJ0LFxuICAgICAgc2xpY2VFbmQgPSB0aGlzLnBvc1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lc2NhcGVDaGFyUG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgc2xpY2VFbmQgPSB0aGlzLmVzY2FwZUNoYXJQb3NpdGlvbnNbaV1cbiAgICBzdWJTbGljZXMucHVzaCh0aGlzLnN0ci5zbGljZShzbGljZVN0YXJ0LCBzbGljZUVuZCkpXG4gICAgc2xpY2VTdGFydCA9IHNsaWNlRW5kICsgMVxuICB9XG5cbiAgc3ViU2xpY2VzLnB1c2godGhpcy5zdHIuc2xpY2Uoc2xpY2VTdGFydCwgdGhpcy5wb3MpKVxuICB0aGlzLmVzY2FwZUNoYXJQb3NpdGlvbnMubGVuZ3RoID0gMFxuXG4gIHJldHVybiBzdWJTbGljZXMuam9pbignJylcbn1cblxubHVuci5RdWVyeUxleGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgdGhpcy5sZXhlbWVzLnB1c2goe1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc3RyOiB0aGlzLnNsaWNlU3RyaW5nKCksXG4gICAgc3RhcnQ6IHRoaXMuc3RhcnQsXG4gICAgZW5kOiB0aGlzLnBvc1xuICB9KVxuXG4gIHRoaXMuc3RhcnQgPSB0aGlzLnBvc1xufVxuXG5sdW5yLlF1ZXJ5TGV4ZXIucHJvdG90eXBlLmVzY2FwZUNoYXJhY3RlciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5lc2NhcGVDaGFyUG9zaXRpb25zLnB1c2godGhpcy5wb3MgLSAxKVxuICB0aGlzLnBvcyArPSAxXG59XG5cbmx1bnIuUXVlcnlMZXhlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMucG9zID49IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGx1bnIuUXVlcnlMZXhlci5FT1NcbiAgfVxuXG4gIHZhciBjaGFyID0gdGhpcy5zdHIuY2hhckF0KHRoaXMucG9zKVxuICB0aGlzLnBvcyArPSAxXG4gIHJldHVybiBjaGFyXG59XG5cbmx1bnIuUXVlcnlMZXhlci5wcm90b3R5cGUud2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnBvcyAtIHRoaXMuc3RhcnRcbn1cblxubHVuci5RdWVyeUxleGVyLnByb3RvdHlwZS5pZ25vcmUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnN0YXJ0ID09IHRoaXMucG9zKSB7XG4gICAgdGhpcy5wb3MgKz0gMVxuICB9XG5cbiAgdGhpcy5zdGFydCA9IHRoaXMucG9zXG59XG5cbmx1bnIuUXVlcnlMZXhlci5wcm90b3R5cGUuYmFja3VwID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnBvcyAtPSAxXG59XG5cbmx1bnIuUXVlcnlMZXhlci5wcm90b3R5cGUuYWNjZXB0RGlnaXRSdW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGFyLCBjaGFyQ29kZVxuXG4gIGRvIHtcbiAgICBjaGFyID0gdGhpcy5uZXh0KClcbiAgICBjaGFyQ29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKVxuICB9IHdoaWxlIChjaGFyQ29kZSA+IDQ3ICYmIGNoYXJDb2RlIDwgNTgpXG5cbiAgaWYgKGNoYXIgIT0gbHVuci5RdWVyeUxleGVyLkVPUykge1xuICAgIHRoaXMuYmFja3VwKClcbiAgfVxufVxuXG5sdW5yLlF1ZXJ5TGV4ZXIucHJvdG90eXBlLm1vcmUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnBvcyA8IHRoaXMubGVuZ3RoXG59XG5cbmx1bnIuUXVlcnlMZXhlci5FT1MgPSAnRU9TJ1xubHVuci5RdWVyeUxleGVyLkZJRUxEID0gJ0ZJRUxEJ1xubHVuci5RdWVyeUxleGVyLlRFUk0gPSAnVEVSTSdcbmx1bnIuUXVlcnlMZXhlci5FRElUX0RJU1RBTkNFID0gJ0VESVRfRElTVEFOQ0UnXG5sdW5yLlF1ZXJ5TGV4ZXIuQk9PU1QgPSAnQk9PU1QnXG5sdW5yLlF1ZXJ5TGV4ZXIuUFJFU0VOQ0UgPSAnUFJFU0VOQ0UnXG5cbmx1bnIuUXVlcnlMZXhlci5sZXhGaWVsZCA9IGZ1bmN0aW9uIChsZXhlcikge1xuICBsZXhlci5iYWNrdXAoKVxuICBsZXhlci5lbWl0KGx1bnIuUXVlcnlMZXhlci5GSUVMRClcbiAgbGV4ZXIuaWdub3JlKClcbiAgcmV0dXJuIGx1bnIuUXVlcnlMZXhlci5sZXhUZXh0XG59XG5cbmx1bnIuUXVlcnlMZXhlci5sZXhUZXJtID0gZnVuY3Rpb24gKGxleGVyKSB7XG4gIGlmIChsZXhlci53aWR0aCgpID4gMSkge1xuICAgIGxleGVyLmJhY2t1cCgpXG4gICAgbGV4ZXIuZW1pdChsdW5yLlF1ZXJ5TGV4ZXIuVEVSTSlcbiAgfVxuXG4gIGxleGVyLmlnbm9yZSgpXG5cbiAgaWYgKGxleGVyLm1vcmUoKSkge1xuICAgIHJldHVybiBsdW5yLlF1ZXJ5TGV4ZXIubGV4VGV4dFxuICB9XG59XG5cbmx1bnIuUXVlcnlMZXhlci5sZXhFZGl0RGlzdGFuY2UgPSBmdW5jdGlvbiAobGV4ZXIpIHtcbiAgbGV4ZXIuaWdub3JlKClcbiAgbGV4ZXIuYWNjZXB0RGlnaXRSdW4oKVxuICBsZXhlci5lbWl0KGx1bnIuUXVlcnlMZXhlci5FRElUX0RJU1RBTkNFKVxuICByZXR1cm4gbHVuci5RdWVyeUxleGVyLmxleFRleHRcbn1cblxubHVuci5RdWVyeUxleGVyLmxleEJvb3N0ID0gZnVuY3Rpb24gKGxleGVyKSB7XG4gIGxleGVyLmlnbm9yZSgpXG4gIGxleGVyLmFjY2VwdERpZ2l0UnVuKClcbiAgbGV4ZXIuZW1pdChsdW5yLlF1ZXJ5TGV4ZXIuQk9PU1QpXG4gIHJldHVybiBsdW5yLlF1ZXJ5TGV4ZXIubGV4VGV4dFxufVxuXG5sdW5yLlF1ZXJ5TGV4ZXIubGV4RU9TID0gZnVuY3Rpb24gKGxleGVyKSB7XG4gIGlmIChsZXhlci53aWR0aCgpID4gMCkge1xuICAgIGxleGVyLmVtaXQobHVuci5RdWVyeUxleGVyLlRFUk0pXG4gIH1cbn1cblxuLy8gVGhpcyBtYXRjaGVzIHRoZSBzZXBhcmF0b3IgdXNlZCB3aGVuIHRva2VuaXNpbmcgZmllbGRzXG4vLyB3aXRoaW4gYSBkb2N1bWVudC4gVGhlc2Ugc2hvdWxkIG1hdGNoIG90aGVyd2lzZSBpdCBpc1xuLy8gbm90IHBvc3NpYmxlIHRvIHNlYXJjaCBmb3Igc29tZSB0b2tlbnMgd2l0aGluIGEgZG9jdW1lbnQuXG4vL1xuLy8gSXQgaXMgcG9zc2libGUgZm9yIHRoZSB1c2VyIHRvIGNoYW5nZSB0aGUgc2VwYXJhdG9yIG9uIHRoZVxuLy8gdG9rZW5pemVyIHNvIGl0IF9taWdodF8gY2xhc2ggd2l0aCBhbnkgb3RoZXIgb2YgdGhlIHNwZWNpYWxcbi8vIGNoYXJhY3RlcnMgYWxyZWFkeSB1c2VkIHdpdGhpbiB0aGUgc2VhcmNoIHN0cmluZywgZS5nLiA6LlxuLy9cbi8vIFRoaXMgbWVhbnMgdGhhdCBpdCBpcyBwb3NzaWJsZSB0byBjaGFuZ2UgdGhlIHNlcGFyYXRvciBpblxuLy8gc3VjaCBhIHdheSB0aGF0IG1ha2VzIHNvbWUgd29yZHMgdW5zZWFyY2hhYmxlIHVzaW5nIGEgc2VhcmNoXG4vLyBzdHJpbmcuXG5sdW5yLlF1ZXJ5TGV4ZXIudGVybVNlcGFyYXRvciA9IGx1bnIudG9rZW5pemVyLnNlcGFyYXRvclxuXG5sdW5yLlF1ZXJ5TGV4ZXIubGV4VGV4dCA9IGZ1bmN0aW9uIChsZXhlcikge1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciBjaGFyID0gbGV4ZXIubmV4dCgpXG5cbiAgICBpZiAoY2hhciA9PSBsdW5yLlF1ZXJ5TGV4ZXIuRU9TKSB7XG4gICAgICByZXR1cm4gbHVuci5RdWVyeUxleGVyLmxleEVPU1xuICAgIH1cblxuICAgIC8vIEVzY2FwZSBjaGFyYWN0ZXIgaXMgJ1xcJ1xuICAgIGlmIChjaGFyLmNoYXJDb2RlQXQoMCkgPT0gOTIpIHtcbiAgICAgIGxleGVyLmVzY2FwZUNoYXJhY3RlcigpXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGlmIChjaGFyID09IFwiOlwiKSB7XG4gICAgICByZXR1cm4gbHVuci5RdWVyeUxleGVyLmxleEZpZWxkXG4gICAgfVxuXG4gICAgaWYgKGNoYXIgPT0gXCJ+XCIpIHtcbiAgICAgIGxleGVyLmJhY2t1cCgpXG4gICAgICBpZiAobGV4ZXIud2lkdGgoKSA+IDApIHtcbiAgICAgICAgbGV4ZXIuZW1pdChsdW5yLlF1ZXJ5TGV4ZXIuVEVSTSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5TGV4ZXIubGV4RWRpdERpc3RhbmNlXG4gICAgfVxuXG4gICAgaWYgKGNoYXIgPT0gXCJeXCIpIHtcbiAgICAgIGxleGVyLmJhY2t1cCgpXG4gICAgICBpZiAobGV4ZXIud2lkdGgoKSA+IDApIHtcbiAgICAgICAgbGV4ZXIuZW1pdChsdW5yLlF1ZXJ5TGV4ZXIuVEVSTSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5TGV4ZXIubGV4Qm9vc3RcbiAgICB9XG5cbiAgICAvLyBcIitcIiBpbmRpY2F0ZXMgdGVybSBwcmVzZW5jZSBpcyByZXF1aXJlZFxuICAgIC8vIGNoZWNraW5nIGZvciBsZW5ndGggdG8gZW5zdXJlIHRoYXQgb25seVxuICAgIC8vIGxlYWRpbmcgXCIrXCIgYXJlIGNvbnNpZGVyZWRcbiAgICBpZiAoY2hhciA9PSBcIitcIiAmJiBsZXhlci53aWR0aCgpID09PSAxKSB7XG4gICAgICBsZXhlci5lbWl0KGx1bnIuUXVlcnlMZXhlci5QUkVTRU5DRSlcbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5TGV4ZXIubGV4VGV4dFxuICAgIH1cblxuICAgIC8vIFwiLVwiIGluZGljYXRlcyB0ZXJtIHByZXNlbmNlIGlzIHByb2hpYml0ZWRcbiAgICAvLyBjaGVja2luZyBmb3IgbGVuZ3RoIHRvIGVuc3VyZSB0aGF0IG9ubHlcbiAgICAvLyBsZWFkaW5nIFwiLVwiIGFyZSBjb25zaWRlcmVkXG4gICAgaWYgKGNoYXIgPT0gXCItXCIgJiYgbGV4ZXIud2lkdGgoKSA9PT0gMSkge1xuICAgICAgbGV4ZXIuZW1pdChsdW5yLlF1ZXJ5TGV4ZXIuUFJFU0VOQ0UpXG4gICAgICByZXR1cm4gbHVuci5RdWVyeUxleGVyLmxleFRleHRcbiAgICB9XG5cbiAgICBpZiAoY2hhci5tYXRjaChsdW5yLlF1ZXJ5TGV4ZXIudGVybVNlcGFyYXRvcikpIHtcbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5TGV4ZXIubGV4VGVybVxuICAgIH1cbiAgfVxufVxuXG5sdW5yLlF1ZXJ5UGFyc2VyID0gZnVuY3Rpb24gKHN0ciwgcXVlcnkpIHtcbiAgdGhpcy5sZXhlciA9IG5ldyBsdW5yLlF1ZXJ5TGV4ZXIgKHN0cilcbiAgdGhpcy5xdWVyeSA9IHF1ZXJ5XG4gIHRoaXMuY3VycmVudENsYXVzZSA9IHt9XG4gIHRoaXMubGV4ZW1lSWR4ID0gMFxufVxuXG5sdW5yLlF1ZXJ5UGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5sZXhlci5ydW4oKVxuICB0aGlzLmxleGVtZXMgPSB0aGlzLmxleGVyLmxleGVtZXNcblxuICB2YXIgc3RhdGUgPSBsdW5yLlF1ZXJ5UGFyc2VyLnBhcnNlQ2xhdXNlXG5cbiAgd2hpbGUgKHN0YXRlKSB7XG4gICAgc3RhdGUgPSBzdGF0ZSh0aGlzKVxuICB9XG5cbiAgcmV0dXJuIHRoaXMucXVlcnlcbn1cblxubHVuci5RdWVyeVBhcnNlci5wcm90b3R5cGUucGVla0xleGVtZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMubGV4ZW1lc1t0aGlzLmxleGVtZUlkeF1cbn1cblxubHVuci5RdWVyeVBhcnNlci5wcm90b3R5cGUuY29uc3VtZUxleGVtZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxleGVtZSA9IHRoaXMucGVla0xleGVtZSgpXG4gIHRoaXMubGV4ZW1lSWR4ICs9IDFcbiAgcmV0dXJuIGxleGVtZVxufVxuXG5sdW5yLlF1ZXJ5UGFyc2VyLnByb3RvdHlwZS5uZXh0Q2xhdXNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY29tcGxldGVkQ2xhdXNlID0gdGhpcy5jdXJyZW50Q2xhdXNlXG4gIHRoaXMucXVlcnkuY2xhdXNlKGNvbXBsZXRlZENsYXVzZSlcbiAgdGhpcy5jdXJyZW50Q2xhdXNlID0ge31cbn1cblxubHVuci5RdWVyeVBhcnNlci5wYXJzZUNsYXVzZSA9IGZ1bmN0aW9uIChwYXJzZXIpIHtcbiAgdmFyIGxleGVtZSA9IHBhcnNlci5wZWVrTGV4ZW1lKClcblxuICBpZiAobGV4ZW1lID09IHVuZGVmaW5lZCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgc3dpdGNoIChsZXhlbWUudHlwZSkge1xuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLlBSRVNFTkNFOlxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VQcmVzZW5jZVxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLkZJRUxEOlxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VGaWVsZFxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLlRFUk06XG4gICAgICByZXR1cm4gbHVuci5RdWVyeVBhcnNlci5wYXJzZVRlcm1cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IFwiZXhwZWN0ZWQgZWl0aGVyIGEgZmllbGQgb3IgYSB0ZXJtLCBmb3VuZCBcIiArIGxleGVtZS50eXBlXG5cbiAgICAgIGlmIChsZXhlbWUuc3RyLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgIGVycm9yTWVzc2FnZSArPSBcIiB3aXRoIHZhbHVlICdcIiArIGxleGVtZS5zdHIgKyBcIidcIlxuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgbHVuci5RdWVyeVBhcnNlRXJyb3IgKGVycm9yTWVzc2FnZSwgbGV4ZW1lLnN0YXJ0LCBsZXhlbWUuZW5kKVxuICB9XG59XG5cbmx1bnIuUXVlcnlQYXJzZXIucGFyc2VQcmVzZW5jZSA9IGZ1bmN0aW9uIChwYXJzZXIpIHtcbiAgdmFyIGxleGVtZSA9IHBhcnNlci5jb25zdW1lTGV4ZW1lKClcblxuICBpZiAobGV4ZW1lID09IHVuZGVmaW5lZCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgc3dpdGNoIChsZXhlbWUuc3RyKSB7XG4gICAgY2FzZSBcIi1cIjpcbiAgICAgIHBhcnNlci5jdXJyZW50Q2xhdXNlLnByZXNlbmNlID0gbHVuci5RdWVyeS5wcmVzZW5jZS5QUk9ISUJJVEVEXG4gICAgICBicmVha1xuICAgIGNhc2UgXCIrXCI6XG4gICAgICBwYXJzZXIuY3VycmVudENsYXVzZS5wcmVzZW5jZSA9IGx1bnIuUXVlcnkucHJlc2VuY2UuUkVRVUlSRURcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBcInVucmVjb2duaXNlZCBwcmVzZW5jZSBvcGVyYXRvcidcIiArIGxleGVtZS5zdHIgKyBcIidcIlxuICAgICAgdGhyb3cgbmV3IGx1bnIuUXVlcnlQYXJzZUVycm9yIChlcnJvck1lc3NhZ2UsIGxleGVtZS5zdGFydCwgbGV4ZW1lLmVuZClcbiAgfVxuXG4gIHZhciBuZXh0TGV4ZW1lID0gcGFyc2VyLnBlZWtMZXhlbWUoKVxuXG4gIGlmIChuZXh0TGV4ZW1lID09IHVuZGVmaW5lZCkge1xuICAgIHZhciBlcnJvck1lc3NhZ2UgPSBcImV4cGVjdGluZyB0ZXJtIG9yIGZpZWxkLCBmb3VuZCBub3RoaW5nXCJcbiAgICB0aHJvdyBuZXcgbHVuci5RdWVyeVBhcnNlRXJyb3IgKGVycm9yTWVzc2FnZSwgbGV4ZW1lLnN0YXJ0LCBsZXhlbWUuZW5kKVxuICB9XG5cbiAgc3dpdGNoIChuZXh0TGV4ZW1lLnR5cGUpIHtcbiAgICBjYXNlIGx1bnIuUXVlcnlMZXhlci5GSUVMRDpcbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5UGFyc2VyLnBhcnNlRmllbGRcbiAgICBjYXNlIGx1bnIuUXVlcnlMZXhlci5URVJNOlxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VUZXJtXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBcImV4cGVjdGluZyB0ZXJtIG9yIGZpZWxkLCBmb3VuZCAnXCIgKyBuZXh0TGV4ZW1lLnR5cGUgKyBcIidcIlxuICAgICAgdGhyb3cgbmV3IGx1bnIuUXVlcnlQYXJzZUVycm9yIChlcnJvck1lc3NhZ2UsIG5leHRMZXhlbWUuc3RhcnQsIG5leHRMZXhlbWUuZW5kKVxuICB9XG59XG5cbmx1bnIuUXVlcnlQYXJzZXIucGFyc2VGaWVsZCA9IGZ1bmN0aW9uIChwYXJzZXIpIHtcbiAgdmFyIGxleGVtZSA9IHBhcnNlci5jb25zdW1lTGV4ZW1lKClcblxuICBpZiAobGV4ZW1lID09IHVuZGVmaW5lZCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHBhcnNlci5xdWVyeS5hbGxGaWVsZHMuaW5kZXhPZihsZXhlbWUuc3RyKSA9PSAtMSkge1xuICAgIHZhciBwb3NzaWJsZUZpZWxkcyA9IHBhcnNlci5xdWVyeS5hbGxGaWVsZHMubWFwKGZ1bmN0aW9uIChmKSB7IHJldHVybiBcIidcIiArIGYgKyBcIidcIiB9KS5qb2luKCcsICcpLFxuICAgICAgICBlcnJvck1lc3NhZ2UgPSBcInVucmVjb2duaXNlZCBmaWVsZCAnXCIgKyBsZXhlbWUuc3RyICsgXCInLCBwb3NzaWJsZSBmaWVsZHM6IFwiICsgcG9zc2libGVGaWVsZHNcblxuICAgIHRocm93IG5ldyBsdW5yLlF1ZXJ5UGFyc2VFcnJvciAoZXJyb3JNZXNzYWdlLCBsZXhlbWUuc3RhcnQsIGxleGVtZS5lbmQpXG4gIH1cblxuICBwYXJzZXIuY3VycmVudENsYXVzZS5maWVsZHMgPSBbbGV4ZW1lLnN0cl1cblxuICB2YXIgbmV4dExleGVtZSA9IHBhcnNlci5wZWVrTGV4ZW1lKClcblxuICBpZiAobmV4dExleGVtZSA9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXJyb3JNZXNzYWdlID0gXCJleHBlY3RpbmcgdGVybSwgZm91bmQgbm90aGluZ1wiXG4gICAgdGhyb3cgbmV3IGx1bnIuUXVlcnlQYXJzZUVycm9yIChlcnJvck1lc3NhZ2UsIGxleGVtZS5zdGFydCwgbGV4ZW1lLmVuZClcbiAgfVxuXG4gIHN3aXRjaCAobmV4dExleGVtZS50eXBlKSB7XG4gICAgY2FzZSBsdW5yLlF1ZXJ5TGV4ZXIuVEVSTTpcbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5UGFyc2VyLnBhcnNlVGVybVxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgZXJyb3JNZXNzYWdlID0gXCJleHBlY3RpbmcgdGVybSwgZm91bmQgJ1wiICsgbmV4dExleGVtZS50eXBlICsgXCInXCJcbiAgICAgIHRocm93IG5ldyBsdW5yLlF1ZXJ5UGFyc2VFcnJvciAoZXJyb3JNZXNzYWdlLCBuZXh0TGV4ZW1lLnN0YXJ0LCBuZXh0TGV4ZW1lLmVuZClcbiAgfVxufVxuXG5sdW5yLlF1ZXJ5UGFyc2VyLnBhcnNlVGVybSA9IGZ1bmN0aW9uIChwYXJzZXIpIHtcbiAgdmFyIGxleGVtZSA9IHBhcnNlci5jb25zdW1lTGV4ZW1lKClcblxuICBpZiAobGV4ZW1lID09IHVuZGVmaW5lZCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgcGFyc2VyLmN1cnJlbnRDbGF1c2UudGVybSA9IGxleGVtZS5zdHIudG9Mb3dlckNhc2UoKVxuXG4gIGlmIChsZXhlbWUuc3RyLmluZGV4T2YoXCIqXCIpICE9IC0xKSB7XG4gICAgcGFyc2VyLmN1cnJlbnRDbGF1c2UudXNlUGlwZWxpbmUgPSBmYWxzZVxuICB9XG5cbiAgdmFyIG5leHRMZXhlbWUgPSBwYXJzZXIucGVla0xleGVtZSgpXG5cbiAgaWYgKG5leHRMZXhlbWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgcGFyc2VyLm5leHRDbGF1c2UoKVxuICAgIHJldHVyblxuICB9XG5cbiAgc3dpdGNoIChuZXh0TGV4ZW1lLnR5cGUpIHtcbiAgICBjYXNlIGx1bnIuUXVlcnlMZXhlci5URVJNOlxuICAgICAgcGFyc2VyLm5leHRDbGF1c2UoKVxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VUZXJtXG4gICAgY2FzZSBsdW5yLlF1ZXJ5TGV4ZXIuRklFTEQ6XG4gICAgICBwYXJzZXIubmV4dENsYXVzZSgpXG4gICAgICByZXR1cm4gbHVuci5RdWVyeVBhcnNlci5wYXJzZUZpZWxkXG4gICAgY2FzZSBsdW5yLlF1ZXJ5TGV4ZXIuRURJVF9ESVNUQU5DRTpcbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5UGFyc2VyLnBhcnNlRWRpdERpc3RhbmNlXG4gICAgY2FzZSBsdW5yLlF1ZXJ5TGV4ZXIuQk9PU1Q6XG4gICAgICByZXR1cm4gbHVuci5RdWVyeVBhcnNlci5wYXJzZUJvb3N0XG4gICAgY2FzZSBsdW5yLlF1ZXJ5TGV4ZXIuUFJFU0VOQ0U6XG4gICAgICBwYXJzZXIubmV4dENsYXVzZSgpXG4gICAgICByZXR1cm4gbHVuci5RdWVyeVBhcnNlci5wYXJzZVByZXNlbmNlXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBcIlVuZXhwZWN0ZWQgbGV4ZW1lIHR5cGUgJ1wiICsgbmV4dExleGVtZS50eXBlICsgXCInXCJcbiAgICAgIHRocm93IG5ldyBsdW5yLlF1ZXJ5UGFyc2VFcnJvciAoZXJyb3JNZXNzYWdlLCBuZXh0TGV4ZW1lLnN0YXJ0LCBuZXh0TGV4ZW1lLmVuZClcbiAgfVxufVxuXG5sdW5yLlF1ZXJ5UGFyc2VyLnBhcnNlRWRpdERpc3RhbmNlID0gZnVuY3Rpb24gKHBhcnNlcikge1xuICB2YXIgbGV4ZW1lID0gcGFyc2VyLmNvbnN1bWVMZXhlbWUoKVxuXG4gIGlmIChsZXhlbWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgZWRpdERpc3RhbmNlID0gcGFyc2VJbnQobGV4ZW1lLnN0ciwgMTApXG5cbiAgaWYgKGlzTmFOKGVkaXREaXN0YW5jZSkpIHtcbiAgICB2YXIgZXJyb3JNZXNzYWdlID0gXCJlZGl0IGRpc3RhbmNlIG11c3QgYmUgbnVtZXJpY1wiXG4gICAgdGhyb3cgbmV3IGx1bnIuUXVlcnlQYXJzZUVycm9yIChlcnJvck1lc3NhZ2UsIGxleGVtZS5zdGFydCwgbGV4ZW1lLmVuZClcbiAgfVxuXG4gIHBhcnNlci5jdXJyZW50Q2xhdXNlLmVkaXREaXN0YW5jZSA9IGVkaXREaXN0YW5jZVxuXG4gIHZhciBuZXh0TGV4ZW1lID0gcGFyc2VyLnBlZWtMZXhlbWUoKVxuXG4gIGlmIChuZXh0TGV4ZW1lID09IHVuZGVmaW5lZCkge1xuICAgIHBhcnNlci5uZXh0Q2xhdXNlKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIHN3aXRjaCAobmV4dExleGVtZS50eXBlKSB7XG4gICAgY2FzZSBsdW5yLlF1ZXJ5TGV4ZXIuVEVSTTpcbiAgICAgIHBhcnNlci5uZXh0Q2xhdXNlKClcbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5UGFyc2VyLnBhcnNlVGVybVxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLkZJRUxEOlxuICAgICAgcGFyc2VyLm5leHRDbGF1c2UoKVxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VGaWVsZFxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLkVESVRfRElTVEFOQ0U6XG4gICAgICByZXR1cm4gbHVuci5RdWVyeVBhcnNlci5wYXJzZUVkaXREaXN0YW5jZVxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLkJPT1NUOlxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VCb29zdFxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLlBSRVNFTkNFOlxuICAgICAgcGFyc2VyLm5leHRDbGF1c2UoKVxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VQcmVzZW5jZVxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgZXJyb3JNZXNzYWdlID0gXCJVbmV4cGVjdGVkIGxleGVtZSB0eXBlICdcIiArIG5leHRMZXhlbWUudHlwZSArIFwiJ1wiXG4gICAgICB0aHJvdyBuZXcgbHVuci5RdWVyeVBhcnNlRXJyb3IgKGVycm9yTWVzc2FnZSwgbmV4dExleGVtZS5zdGFydCwgbmV4dExleGVtZS5lbmQpXG4gIH1cbn1cblxubHVuci5RdWVyeVBhcnNlci5wYXJzZUJvb3N0ID0gZnVuY3Rpb24gKHBhcnNlcikge1xuICB2YXIgbGV4ZW1lID0gcGFyc2VyLmNvbnN1bWVMZXhlbWUoKVxuXG4gIGlmIChsZXhlbWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgYm9vc3QgPSBwYXJzZUludChsZXhlbWUuc3RyLCAxMClcblxuICBpZiAoaXNOYU4oYm9vc3QpKSB7XG4gICAgdmFyIGVycm9yTWVzc2FnZSA9IFwiYm9vc3QgbXVzdCBiZSBudW1lcmljXCJcbiAgICB0aHJvdyBuZXcgbHVuci5RdWVyeVBhcnNlRXJyb3IgKGVycm9yTWVzc2FnZSwgbGV4ZW1lLnN0YXJ0LCBsZXhlbWUuZW5kKVxuICB9XG5cbiAgcGFyc2VyLmN1cnJlbnRDbGF1c2UuYm9vc3QgPSBib29zdFxuXG4gIHZhciBuZXh0TGV4ZW1lID0gcGFyc2VyLnBlZWtMZXhlbWUoKVxuXG4gIGlmIChuZXh0TGV4ZW1lID09IHVuZGVmaW5lZCkge1xuICAgIHBhcnNlci5uZXh0Q2xhdXNlKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIHN3aXRjaCAobmV4dExleGVtZS50eXBlKSB7XG4gICAgY2FzZSBsdW5yLlF1ZXJ5TGV4ZXIuVEVSTTpcbiAgICAgIHBhcnNlci5uZXh0Q2xhdXNlKClcbiAgICAgIHJldHVybiBsdW5yLlF1ZXJ5UGFyc2VyLnBhcnNlVGVybVxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLkZJRUxEOlxuICAgICAgcGFyc2VyLm5leHRDbGF1c2UoKVxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VGaWVsZFxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLkVESVRfRElTVEFOQ0U6XG4gICAgICByZXR1cm4gbHVuci5RdWVyeVBhcnNlci5wYXJzZUVkaXREaXN0YW5jZVxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLkJPT1NUOlxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VCb29zdFxuICAgIGNhc2UgbHVuci5RdWVyeUxleGVyLlBSRVNFTkNFOlxuICAgICAgcGFyc2VyLm5leHRDbGF1c2UoKVxuICAgICAgcmV0dXJuIGx1bnIuUXVlcnlQYXJzZXIucGFyc2VQcmVzZW5jZVxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgZXJyb3JNZXNzYWdlID0gXCJVbmV4cGVjdGVkIGxleGVtZSB0eXBlICdcIiArIG5leHRMZXhlbWUudHlwZSArIFwiJ1wiXG4gICAgICB0aHJvdyBuZXcgbHVuci5RdWVyeVBhcnNlRXJyb3IgKGVycm9yTWVzc2FnZSwgbmV4dExleGVtZS5zdGFydCwgbmV4dExleGVtZS5lbmQpXG4gIH1cbn1cblxuICAvKipcbiAgICogZXhwb3J0IHRoZSBtb2R1bGUgdmlhIEFNRCwgQ29tbW9uSlMgb3IgYXMgYSBicm93c2VyIGdsb2JhbFxuICAgKiBFeHBvcnQgY29kZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvcmV0dXJuRXhwb3J0cy5qc1xuICAgKi9cbiAgOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgIGRlZmluZShmYWN0b3J5KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAvKipcbiAgICAgICAqIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgICAgICogb25seSBDb21tb25KUy1saWtlIGVudmlyb21lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAgICAqIGxpa2UgTm9kZS5cbiAgICAgICAqL1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KClcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgIHJvb3QubHVuciA9IGZhY3RvcnkoKVxuICAgIH1cbiAgfSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogSnVzdCByZXR1cm4gYSB2YWx1ZSB0byBkZWZpbmUgdGhlIG1vZHVsZSBleHBvcnQuXG4gICAgICogVGhpcyBleGFtcGxlIHJldHVybnMgYW4gb2JqZWN0LCBidXQgdGhlIG1vZHVsZVxuICAgICAqIGNhbiByZXR1cm4gYSBmdW5jdGlvbiBhcyB0aGUgZXhwb3J0ZWQgdmFsdWUuXG4gICAgICovXG4gICAgcmV0dXJuIGx1bnJcbiAgfSkpXG59KSgpO1xuIiwiZXhwb3J0IGRlZmF1bHQgcmVxdWlyZShcIi9ob21lL3J1bm5lci93b3JrL2NlcGguaW8vY2VwaC5pby9zcmMvXzExdHkvc2hvcnRjb2Rlcy9BcnRpY2xlQ2FyZC5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gR2VuZXJhbFxuICBhcnRpY2xlc19maWx0ZXJlZF9ieToge1xuICAgIGVuOiAnQXJ0aWNsZXMgZmlsdGVyZWQgYnknLFxuICB9LFxuICBjYXRlZ29yeToge1xuICAgIGVuOiAnQ2F0ZWdvcnknLFxuICB9LFxuICBjb21pbmdfc29vbjoge1xuICAgIGVuOiAnQ29taW5nIHNvb24nLFxuICB9LFxuICBjb21pbmdfdXA6IHtcbiAgICBlbjogJ0NvbWluZyB1cCcsXG4gIH0sXG4gIGZpbHRlcl9ieV90b3BpYzoge1xuICAgIGVuOiAnRmlsdGVyIGJ5IHRvcGljJyxcbiAgfSxcbiAgZmluZF9vdXRfbW9yZToge1xuICAgIGVuOiAnRmluZCBvdXQgbW9yZScsXG4gIH0sXG4gIGdvX3RvOiB7XG4gICAgZW46ICdHbyB0bycsXG4gIH0sXG4gIGhlbGxvOiB7XG4gICAgZW46ICdIZWxsbycsXG4gIH0sXG4gIGtlZXBfcmVhZGluZzoge1xuICAgIGVuOiAnS2VlcCByZWFkaW5nJyxcbiAgfSxcbiAgbG9hZGluZzoge1xuICAgIGVuOiAnTG9hZGluZ+KApicsXG4gIH0sXG4gIG5leHQ6IHtcbiAgICBlbjogJ05leHQnLFxuICB9LFxuICBvZjoge1xuICAgIGVuOiAnT2YnLFxuICB9LFxuICBwYWdlOiB7XG4gICAgZW46ICdQYWdlJyxcbiAgfSxcbiAgcHJldmlvdXM6IHtcbiAgICBlbjogJ1ByZXZpb3VzJyxcbiAgfSxcbiAgcmVhZF9tb3JlX2FydGljbGVzX2xpa2VfdGhpczoge1xuICAgIGVuOiAnUmVhZCBtb3JlIGFydGljbGVzIGxpa2UgdGhpcycsXG4gIH0sXG4gIHJlbGF0ZWQ6IHtcbiAgICBlbjogJ1JlbGF0ZWQnLFxuICB9LFxuICBzaGFyZToge1xuICAgIGVuOiAnU2hhcmUnLFxuICB9LFxuICBzaGFyZV90aGlzX2FydGljbGU6IHtcbiAgICBlbjogJ1NoYXJlIHRoaXMgYXJ0aWNsZScsXG4gIH0sXG4gIHNsaWRlczoge1xuICAgIGVuOiAnU2xpZGVzJyxcbiAgfSxcbiAgdGFnczoge1xuICAgIGVuOiAnVGFncycsXG4gIH0sXG4gIHVwY29taW5nOiB7XG4gICAgZW46ICdVcGNvbWluZycsXG4gIH0sXG4gIHdlYnNpdGU6IHtcbiAgICBlbjogJ1dlYnNpdGUnLFxuICB9LFxuICB3aXRoOiB7XG4gICAgZW46ICdXaXRoJyxcbiAgfSxcblxuICAvLyBpMThuXG4gIGxhbmd1YWdlOiB7XG4gICAgZW46ICdMYW5ndWFnZScsXG4gIH0sXG4gIHNlbGVjdF9sYW5ndWFnZToge1xuICAgIGVuOiAnU2VsZWN0IGxhbmd1YWdlJyxcbiAgfSxcblxuICAvLyBCbG9nXG4gIGJhY2tfdG9fYmxvZzoge1xuICAgIGVuOiAnQmFjayB0byBibG9nJyxcbiAgfSxcbiAgYmxvZzoge1xuICAgIGVuOiAnQmxvZycsXG4gIH0sXG4gICdibG9nLXBvc3QnOiB7XG4gICAgZW46ICdCbG9nJyxcbiAgfSxcbiAgYmxvZ19zZWFyY2hfZmFpbGVkOiB7XG4gICAgZW46ICdTb3JyeSwgd2UgY291bGRu4oCZdCBjb21wbGV0ZSB5b3VyIHNlYXJjaCBhdCB0aGlzIHRpbWUuIFBsZWFzZSB0cnkgYWdhaW4gc2hvcnRseS4nLFxuICB9LFxuICBibG9nX3NlYXJjaF9ub19yZXN1bHRzOiB7XG4gICAgZW46ICdObyByZXN1bHRzIGZvcicsXG4gIH0sXG4gIGJsb2dfc2VhcmNoX3VuYXZhaWxhYmxlOiB7XG4gICAgZW46ICdQbGVhc2UgZW5hYmxlIEphdmFTY3JpcHQgdG8gc2VhcmNoJyxcbiAgfSxcbiAgYmxvZ19zZWFyY2hlZF9mb3I6IHtcbiAgICBlbjogJ1lvdSBzZWFyY2hlZCBmb3InLFxuICB9LFxuICBzZWFyY2hfYWxsX2Jsb2dfcG9zdHM6IHtcbiAgICBlbjogJ1NlYXJjaCBhbGwgYmxvZyBwb3N0cycsXG4gIH0sXG5cbiAgLy8gQ2FzZSBzdHVkeVxuICBhYm91dF90aGlzX2Nhc2Vfc3R1ZHk6IHtcbiAgICBlbjogJ0Fib3V0IHRoaXMgY2FzZSBzdHVkeScsXG4gIH0sXG4gIGNhc2Vfc3R1ZGllc19maWx0ZXJlZF9ieToge1xuICAgIGVuOiAnQ2FzZSBzdHVkaWVzIGZpbHRlcmVkIGJ5JyxcbiAgfSxcbiAgZmluZF9vdXRfbW9yZV9hYm91dF90aGlzX2Nhc2Vfc3R1ZHlfYXRfdGhlOiB7XG4gICAgZW46ICdGaW5kIG91dCBtb3JlIGFib3V0IHRoaXMgY2FzZSBzdHVkeSBhdCB0aGUnLFxuICB9LFxuICB0aGlzX2Nhc2Vfc3R1ZHlfaXNfc3BvbnNvcmVkX2J5OiB7XG4gICAgZW46ICdUaGlzIGNhc2Ugc3R1ZHkgaXMgc3BvbnNvcmVkIGJ5JyxcbiAgfSxcblxuICAvLyBFdmVudHNcbiAgZXZlbnQ6IHtcbiAgICBlbjogJ0V2ZW50JyxcbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgZW46ICdFdmVudHMnLFxuICB9LFxuICBldmVudF9kZXRhaWxzOiB7XG4gICAgZW46ICdFdmVudCBkZXRhaWxzJyxcbiAgfSxcbiAgZXZlbnRzX2ZpbHRlcmVkX2J5OiB7XG4gICAgZW46ICdFdmVudHMgZmlsdGVyZWQgYnknLFxuICB9LFxuICBldmVudF9zcG9uc29yczoge1xuICAgIGVuOiAnRXZlbnQgc3BvbnNvcnMnLFxuICB9LFxuICBmaWx0ZXJfYnlfZXZlbnRfdHlwZToge1xuICAgIGVuOiAnRmlsdGVyIGJ5IGV2ZW50IHR5cGUnLFxuICB9LFxuICBwcmV2aW91c19ldmVudHM6IHtcbiAgICBlbjogJ1ByZXZpb3VzIGV2ZW50cycsXG4gIH0sXG4gIHRoZXJlX2FyZV9ub191cGNvbWluZ19ldmVudHM6IHtcbiAgICBlbjogJ1RoZXJlIGFyZSBubyB1cGNvbWluZyBldmVudHMnLFxuICB9LFxuXG4gIC8vIFByZXNzIFJlbGVhc2VzXG4gICdwcmVzcy1yZWxlYXNlJzoge1xuICAgIGVuOiAnUHJlc3MgUmVsZWFzZScsXG4gIH0sXG59O1xuIiwiaW1wb3J0IGx1bnIgZnJvbSAnbHVucic7XG5pbXBvcnQgYXJ0aWNsZUNhcmQgZnJvbSAnLi4vXzExdHkvc2hvcnRjb2Rlcy9BcnRpY2xlQ2FyZC5qcyc7XG5pbXBvcnQgdHJhbnNsYXRpb25zIGZyb20gJy4uL19kYXRhL2kxOG4nO1xuXG5jb25zdCBTZWFyY2hPdXRwdXQgPSB7XG4gIGluaXQ6ICgpID0+IHtcbiAgICBjb25zdCB1cmxQYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdO1xuICAgIGNvbnN0IHVybExvY2FsZSA9IHVybFBhcnRzWzFdO1xuICAgIGNvbnN0IGJsb2dEaXIgPSBgLyR7dXJsTG9jYWxlfS9uZXdzL2Jsb2dgO1xuICAgIGNvbnN0IHNlYXJjaERhdGFVcmxzID0gW1xuICAgICAgYCR7YmxvZ0Rpcn0vc2VhcmNoLWluZGV4Lmpzb25gLFxuICAgICAgYCR7YmxvZ0Rpcn0vc2VhcmNoLW91dHB1dC5qc29uYCxcbiAgICBdO1xuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1zdHInKTtcbiAgICBjb25zdCBzZWFyY2hyZXN1bHRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1yZXN1bHRzJyk7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICAgIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXVlcnlTdHJpbmcpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gdXJsUGFyYW1zLmdldCgncScpO1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gaW5pdFNlYXJjaEluZGV4KCkge1xuICAgICAgaWYgKCF1cmxQYXJhbXMuaGFzKCdxJykpIHJldHVybjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc2VhcmNoSW5wdXQudmFsdWUgPSBxdWVyeTtcblxuICAgICAgICBjb25zdCBbc2VhcmNoSW5kZXgsIHNlYXJjaE91dHB1dF0gPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICBzZWFyY2hEYXRhVXJscy5tYXAodXJsID0+XG4gICAgICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgICAgbW9kZTogJ25vLWNvcnMnLFxuICAgICAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGx1bnJJbmRleCA9IGx1bnIuSW5kZXgubG9hZChzZWFyY2hJbmRleCk7XG5cbiAgICAgICAgc2VhcmNoKGx1bnJJbmRleCwgc2VhcmNoT3V0cHV0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICByZW5kZXJFcnJvcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNlYXJjaChsdW5ySW5kZXgsIHNlYXJjaE91dHB1dCkge1xuICAgICAgbGV0IHNlYXJjaFJlc3VsdHMgPSBsdW5ySW5kZXguc2VhcmNoKHF1ZXJ5KTtcblxuICAgICAgc2VhcmNoUmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgIHJlc3VsdC5pbWFnZSA9IHNlYXJjaE91dHB1dFtyZXN1bHQucmVmXS5pbWFnZTtcbiAgICAgICAgcmVzdWx0LnRpdGxlID0gc2VhcmNoT3V0cHV0W3Jlc3VsdC5yZWZdLnRpdGxlO1xuICAgICAgICByZXN1bHQuYXV0aG9yID0gc2VhcmNoT3V0cHV0W3Jlc3VsdC5yZWZdLmF1dGhvcjtcbiAgICAgICAgcmVzdWx0LmRhdGUgPSBzZWFyY2hPdXRwdXRbcmVzdWx0LnJlZl0uZGF0ZTtcbiAgICAgICAgcmVzdWx0LnVybCA9IHNlYXJjaE91dHB1dFtyZXN1bHQucmVmXS51cmw7XG4gICAgICAgIHJlc3VsdC5jb250ZW50ID0gc2VhcmNoT3V0cHV0W3Jlc3VsdC5yZWZdLmNvbnRlbnQ7XG4gICAgICB9KTtcblxuICAgICAgcmVuZGVyUmVzdWx0cyhzZWFyY2hSZXN1bHRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJSZXN1bHRzKHJlc3VsdHMgPSBbXSkge1xuICAgICAgbGV0IHNlYXJjaFJlc3VsdHNIdG1sO1xuXG4gICAgICBjb25zdCB7IGJsb2dfc2VhcmNoX25vX3Jlc3VsdHMgPSB7fSwgYmxvZ19zZWFyY2hlZF9mb3IgPSB7fSB9ID1cbiAgICAgICAgdHJhbnNsYXRpb25zIHx8IHt9O1xuICAgICAgY29uc3Qgbm9SZXN1bHRzU3RyaW5nID1cbiAgICAgICAgYmxvZ19zZWFyY2hfbm9fcmVzdWx0c1t1cmxMb2NhbGVdIHx8ICdObyByZXN1bHRzIGZvcic7XG4gICAgICBjb25zdCBzZWFyY2hlZEZvclN0cmluZyA9XG4gICAgICAgIGJsb2dfc2VhcmNoZWRfZm9yW3VybExvY2FsZV0gfHwgJ1lvdSBzZWFyY2hlZCBmb3InO1xuXG4gICAgICBpZiAoIXNlYXJjaHJlc3VsdHNDb250YWluZXIpIHJldHVybjtcblxuICAgICAgaWYgKCFyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICBzZWFyY2hSZXN1bHRzSHRtbCA9IGA8cCBjbGFzcz1cImgzIG1iLTggeGw6bWItMTBcIj4ke25vUmVzdWx0c1N0cmluZ30g4oCcJHtxdWVyeX3igJ08L3A+YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlYXJjaFJlc3VsdHNIdG1sID0gYDxwIGNsYXNzPVwiaDMgbWItOCB4bDptYi0xMFwiPiR7c2VhcmNoZWRGb3JTdHJpbmd9IOKAnCR7cXVlcnl94oCdPC9wPlxuICAgICAgPHVsIGNsYXNzPVwiZ3JpZCBtZDpncmlkLS1jb2xzLTIgbGc6Z3JpZC0tY29scy0zIHhsOmdyaWQtLWNvbHMtNCBsaXN0LW5vbmUgbS0wIHAtMFwiPiR7cmVzdWx0c1xuICAgICAgICAubWFwKCh7IGF1dGhvciwgY29udGVudCwgZGF0ZSwgaW1hZ2UsIHRpdGxlLCB1cmwgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc3R1Y3R1cmVkRGF0YSA9IHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgYXV0aG9yLFxuICAgICAgICAgICAgICBkYXRlLFxuICAgICAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgIGxvY2FsZTogdXJsTG9jYWxlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlQ29udGVudDogY29udGVudCxcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuIGA8bGk+JHthcnRpY2xlQ2FyZChyZXN0dWN0dXJlZERhdGEpfTwvbGk+YDtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oJycpfTwvdWw+YDtcbiAgICAgIH1cblxuICAgICAgc2VhcmNocmVzdWx0c0NvbnRhaW5lci5pbm5lckhUTUwgPSBzZWFyY2hSZXN1bHRzSHRtbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJFcnJvcigpIHtcbiAgICAgIGNvbnN0IHsgYmxvZ19zZWFyY2hfZmFpbGVkID0ge30gfSA9IHRyYW5zbGF0aW9ucyB8fCB7fTtcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9XG4gICAgICAgIGJsb2dfc2VhcmNoX2ZhaWxlZFt1cmxMb2NhbGVdIHx8XG4gICAgICAgICdTb3JyeSwgd2UgY291bGRu4oCZdCBjb21wbGV0ZSB5b3VyIHNlYXJjaCBhdCB0aGlzIHRpbWUuIFBsZWFzZSB0cnkgYWdhaW4gc2hvcnRseS4nO1xuXG4gICAgICBjb25zdCBzZWFyY2hSZXN1bHRzSHRtbCA9IGA8cCBjbGFzcz1cImgzIG1iLTggeGw6bWItMTBcIj4ke2Vycm9yTWVzc2FnZX08L3A+YDtcblxuICAgICAgc2VhcmNocmVzdWx0c0NvbnRhaW5lci5pbm5lckhUTUwgPSBzZWFyY2hSZXN1bHRzSHRtbDtcbiAgICB9XG5cbiAgICBpbml0U2VhcmNoSW5kZXgoKTtcbiAgfSxcbn07XG5cbmV4cG9ydCB7IFNlYXJjaE91dHB1dCB9O1xuIiwiaW1wb3J0IHsgU2VhcmNoT3V0cHV0IH0gZnJvbSAnLi9zZWFyY2gtb3V0cHV0JztcblxuU2VhcmNoT3V0cHV0LmluaXQoKTtcbiJdLCJuYW1lcyI6WyJjb21tb25qc0hlbHBlcnMuY29tbW9uanNSZXF1aXJlIiwidHJhbnNsYXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FBQSxJQUFBLElBQWMs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Q2xDLEVBQUM7QUFDRDtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQSxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsR0FBRyxFQUFFLFFBQVEsRUFBRTtDQUN0QyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUU7Q0FDdEIsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsSUFBSSxHQUFFO0NBQ2hDLEVBQUM7QUFDRDtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsWUFBWTtDQUM1QyxFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUc7Q0FDakIsRUFBQztBQUNEO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtBQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEVBQUUsRUFBRTtDQUM1QyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBQztDQUN4QyxFQUFFLE9BQU8sSUFBSTtDQUNiLEVBQUM7QUFDRDtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0EsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFVBQVUsRUFBRSxFQUFFO0NBQzNDLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFFO0NBQ3RDLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7Q0FDcEUsRUFBQztD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QUc7Q0FDSCxFQUFDO0FBQ0Q7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO0NBQ2xELEVBQUUsR0FBRztDQUNMLEVBQUUsTUFBTTtDQUNSLEVBQUUsT0FBTztDQUNULEVBQUUsUUFBUTtDQUNWLEVBQUUsT0FBTztDQUNULEVBQUUsS0FBSztDQUNQLEVBQUUsUUFBUTtDQUNWLEVBQUUsTUFBTTtDQUNSLEVBQUUsSUFBSTtDQUNOLEVBQUUsT0FBTztDQUNULEVBQUUsSUFBSTtDQUNOLEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsSUFBSTtDQUNOLEVBQUUsSUFBSTtDQUNOLEVBQUUsSUFBSTtDQUNOLEVBQUUsU0FBUztDQUNYLEVBQUUsTUFBTTtDQUNSLEVBQUUsS0FBSztDQUNQLEVBQUUsSUFBSTtDQUNOLEVBQUUsS0FBSztDQUNQLEVBQUUsUUFBUTtDQUNWLEVBQUUsT0FBTztDQUNULEVBQUUsTUFBTTtDQUNSLEVBQUUsS0FBSztDQUNQLEVBQUUsSUFBSTtDQUNOLEVBQUUsTUFBTTtDQUNSLEVBQUUsUUFBUTtDQUNWLEVBQUUsTUFBTTtDQUNSLEVBQUUsTUFBTTtDQUNSLEVBQUUsT0FBTztDQUNULEVBQUUsS0FBSztDQUNQLEVBQUUsTUFBTTtDQUNSLEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsTUFBTTtDQUNSLEVBQUUsSUFBSTtDQUNOLEVBQUUsS0FBSztDQUNQLEVBQUUsTUFBTTtDQUNSLEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsU0FBUztDQUNYLEVBQUUsR0FBRztDQUNMLEVBQUUsSUFBSTtDQUNOLEVBQUUsSUFBSTtDQUNOLEVBQUUsTUFBTTtDQUNSLEVBQUUsSUFBSTtDQUNOLEVBQUUsSUFBSTtDQUNOLEVBQUUsS0FBSztDQUNQLEVBQUUsTUFBTTtDQUNSLEVBQUUsT0FBTztDQUNULEVBQUUsS0FBSztDQUNQLEVBQUUsTUFBTTtDQUNSLEVBQUUsUUFBUTtDQUNWLEVBQUUsS0FBSztDQUNQLEVBQUUsSUFBSTtDQUNOLEVBQUUsT0FBTztDQUNULEVBQUUsTUFBTTtDQUNSLEVBQUUsTUFBTTtDQUNSLEVBQUUsSUFBSTtDQUNOLEVBQUUsU0FBUztDQUNYLEVBQUUsSUFBSTtDQUNOLEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsSUFBSTtDQUNOLEVBQUUsS0FBSztDQUNQLEVBQUUsT0FBTztDQUNULEVBQUUsSUFBSTtDQUNOLEVBQUUsTUFBTTtDQUNSLEVBQUUsSUFBSTtDQUNOLEVBQUUsT0FBTztDQUNULEVBQUUsS0FBSztDQUNQLEVBQUUsS0FBSztDQUNQLEVBQUUsUUFBUTtDQUNWLEVBQUUsTUFBTTtDQUNSLEVBQUUsS0FBSztDQUNQLEVBQUUsTUFBTTtDQUNSLEVBQUUsS0FBSztDQUNQLEVBQUUsUUFBUTtDQUNWLEVBQUUsT0FBTztDQUNULEVBQUUsSUFBSTtDQUNOLEVBQUUsTUFBTTtDQUNSLEVBQUUsTUFBTTtDQUNSLEVBQUUsTUFBTTtDQUNSLEVBQUUsS0FBSztDQUNQLEVBQUUsT0FBTztDQUNULEVBQUUsTUFBTTtDQUNSLEVBQUUsTUFBTTtDQUNSLEVBQUUsT0FBTztDQUNULEVBQUUsT0FBTztDQUNULEVBQUUsTUFBTTtDQUNSLEVBQUUsTUFBTTtDQUNSLEVBQUUsS0FBSztDQUNQLEVBQUUsSUFBSTtDQUNOLEVBQUUsS0FBSztDQUNQLEVBQUUsTUFBTTtDQUNSLEVBQUUsSUFBSTtDQUNOLEVBQUUsT0FBTztDQUNULEVBQUUsS0FBSztDQUNQLEVBQUUsSUFBSTtDQUNOLEVBQUUsTUFBTTtDQUNSLEVBQUUsTUFBTTtDQUNSLEVBQUUsTUFBTTtDQUNSLEVBQUUsT0FBTztDQUNULEVBQUUsT0FBTztDQUNULEVBQUUsT0FBTztDQUNULEVBQUUsS0FBSztDQUNQ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SUFBSSxDQUFDLFNBQVE7Q0FDbkMsRUFBRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVE7Q0FDekMsRUFBRSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUM7Q0FDeEIsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUk7Q0FDaEIsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUc7Q0FDaEIsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUM7Q0FDcEIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRTtDQUM3QixFQUFDO0FBQ0Q7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEVBQUU7Q0FDNUMsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUc7Q0FDakIsRUFBQztBQUNEO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7QUFDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLFNBQVMsRUFBRSxVQUFVLEVBQUU7Q0FDaEUsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7Q0FDNUIsSUFBSSxNQUFNLElBQUksVUFBVSxFQUFFLFNBQVMsR0FBRyxTQUFTLEdBQUcsa0NBQWtDLENBQUM7Q0FDckYsR0FBRztBQUNIO0NBQ0EsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFVBQVUsSUFBSSxHQUFFO0NBQzVDLEVBQUM7QUFDRDtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FD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
