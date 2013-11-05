/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  cacheSize = 10;

  currentState = null;

  referer = null;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(position) {
    var page;
    cacheCurrentPage();
    page = pageCache[position];
    if (xhr != null) {
      xhr.abort();
    }
    changePage(page.title, page.body);
    recallScrollPosition(page);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.src || node.href);
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var state;
      state = event.state;
      if (state != null ? state.turbolinks : void 0) {
        if (pageCache[state.position]) {
          return fetchHistory(state.position);
        } else {
          return visit(event.target.location.href);
        }
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    visit = function(url) {
      referer = document.location.href;
      cacheCurrentPage();
      return fetchReplacement(url);
    };
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached
  };

}).call(this);
// This THREEx helper makes it easy to handle the fullscreen API
// * it hides the prefix for each browser
// * it hides the little discrepencies of the various vendor API
// * at the time of this writing (nov 2011) it is available in 
//   [firefox nightly](http://blog.pearce.org.nz/2011/11/firefoxs-html-full-screen-api-enabled.html),
//   [webkit nightly](http://peter.sh/2011/01/javascript-full-screen-api-navigation-timing-and-repeating-css-gradients/) and
//   [chrome stable](http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API).

// # Code

/** @namespace */

var THREEx		= THREEx 		|| {};
THREEx.FullScreen	= THREEx.FullScreen	|| {};

/**
 * test if it is possible to have fullscreen
 * 
 * @returns {Boolean} true if fullscreen API is available, false otherwise
*/
THREEx.FullScreen.available	= function()
{
	return this._hasWebkitFullScreen || this._hasMozFullScreen;
}

/**
 * test if fullscreen is currently activated
 * 
 * @returns {Boolean} true if fullscreen is currently activated, false otherwise
*/
THREEx.FullScreen.activated	= function()
{
	if( this._hasWebkitFullScreen ){
		return document.webkitIsFullScreen;
	}else if( this._hasMozFullScreen ){
		return document.mozFullScreen;
	}else{
		console.assert(false);
	}
}

/**
 * Request fullscreen on a given element
 * @param {DomElement} element to make fullscreen. optional. default to document.body
*/
THREEx.FullScreen.request	= function(element)
{
	element	= element	|| document.body;
	if( this._hasWebkitFullScreen ){
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}else if( this._hasMozFullScreen ){
		element.mozRequestFullScreen();
	}else{
		console.assert(false);
	}
}

/**
 * Cancel fullscreen
*/
THREEx.FullScreen.cancel	= function()
{
	if( this._hasWebkitFullScreen ){
		document.webkitCancelFullScreen();
	}else if( this._hasMozFullScreen ){
		document.mozCancelFullScreen();
	}else{
		console.assert(false);
	}
}

// internal functions to know which fullscreen API implementation is available
THREEx.FullScreen._hasWebkitFullScreen	= 'webkitCancelFullScreen' in document	? true : false;	
THREEx.FullScreen._hasMozFullScreen	= 'mozCancelFullScreen' in document	? true : false;	

/**
 * Bind a key to renderer screenshot
 * usage: THREEx.FullScreen.bindKey({ charCode : 'a'.charCodeAt(0) }); 
*/
THREEx.FullScreen.bindKey	= function(opts){
	opts		= opts		|| {};
	var charCode	= opts.charCode	|| 'f'.charCodeAt(0);
	var dblclick	= opts.dblclick !== undefined ? opts.dblclick : false;
	var element	= opts.element

	var toggle	= function(){
		if( THREEx.FullScreen.activated() ){
			THREEx.FullScreen.cancel();
		}else{
			THREEx.FullScreen.request(element);
		}		
	}

	var onKeyPress	= function(event){
		if( event.which !== charCode )	return;
		toggle();
	}.bind(this);

	document.addEventListener('keypress', onKeyPress, false);

	dblclick && document.addEventListener('dblclick', toggle, false);

	return {
		unbind	: function(){
			document.removeEventListener('keypress', onKeyPress, false);
			dblclick && document.removeEventListener('dblclick', toggle, false);
		}
	};
}
;
// THREEx.KeyboardState.js keep the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard	= new THREEx.KeyboardState();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// NOTE: this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// # Code
//

/** @namespace */

var THREEx	= THREEx 		|| {};

/**
 * - NOTE: it would be quite easy to push event-driven too
 *   - microevent.js for events handling
 *   - in this._onkeyChange, generate a string from the DOM event
 *   - use this as event name
*/
THREEx.KeyboardState	= function()
{
	// to store the current state
	this.keyCodes	= {};
	this.modifiers	= {};
	
	// create callback to bind/unbind keyboard events
	var self	= this;
	this._onKeyDown	= function(event){ self._onKeyChange(event, true); };
	this._onKeyUp	= function(event){ self._onKeyChange(event, false);};

	// bind keyEvents
	document.addEventListener("keydown", this._onKeyDown, false);
	document.addEventListener("keyup", this._onKeyUp, false);
}

/**
 * To stop listening of the keyboard events
*/
THREEx.KeyboardState.prototype.destroy	= function()
{
	// unbind keyEvents
	document.removeEventListener("keydown", this._onKeyDown, false);
	document.removeEventListener("keyup", this._onKeyUp, false);
}

THREEx.KeyboardState.MODIFIERS	= ['shift', 'ctrl', 'alt', 'meta'];
THREEx.KeyboardState.ALIAS	= {
	'left'		: 37,
	'up'		: 38,
	'right'		: 39,
	'down'		: 40,
	'space'		: 32,
	'pageup'	: 33,
	'pagedown'	: 34,
	'tab'		: 9
};

/**
 * to process the keyboard dom event
*/
THREEx.KeyboardState.prototype._onKeyChange	= function(event, pressed)
{
	// log to debug
	//console.log("onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

	// update this.keyCodes
	var keyCode		= event.keyCode;
	this.keyCodes[keyCode]	= pressed;

	// update this.modifiers
	this.modifiers['shift']= event.shiftKey;
	this.modifiers['ctrl']	= event.ctrlKey;
	this.modifiers['alt']	= event.altKey;
	this.modifiers['meta']	= event.metaKey;
}

/**
 * query keyboard state to know if a key is pressed of not
 *
 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
 * @returns {Boolean} true if the key is pressed, false otherwise
*/
THREEx.KeyboardState.prototype.pressed	= function(keyDesc)
{
	var keys	= keyDesc.split("+");
	for(var i = 0; i < keys.length; i++){
		var key		= keys[i];
		var pressed;
		if( THREEx.KeyboardState.MODIFIERS.indexOf( key ) !== -1 ){
			pressed	= this.modifiers[key];
		}else if( Object.keys(THREEx.KeyboardState.ALIAS).indexOf( key ) != -1 ){
			pressed	= this.keyCodes[ THREEx.KeyboardState.ALIAS[key] ];
		}else {
			pressed	= this.keyCodes[key.toUpperCase().charCodeAt(0)]
		}
		if( !pressed)	return false;
	};
	return true;
}
;
// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code

//

/** @namespace */

var THREEx	= THREEx 		|| {};

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.WindowResize	= function(renderer, camera){
	var callback	= function(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight );
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}
;
(function(){var b,d,c;b=jQuery;c=(function(){function b(){this.fadeDuration=500;this.fitImagesInViewport=true;this.resizeDuration=700;this.showImageNumberLabel=true;this.wrapAround=false}b.prototype.albumLabel=function(b,c){return"Image "+b+" of "+c};return b})();d=(function(){function c(b){this.options=b;this.album=[];this.currentImageIndex=void 0;this.init()}c.prototype.init=function(){this.enable();return this.build()};c.prototype.enable=function(){var c=this;return b('body').on('click','a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]',function(d){c.start(b(d.currentTarget));return false})};c.prototype.build=function(){var c=this;b("<div id='lightboxOverlay' class='lightboxOverlay'></div><div id='lightbox' class='lightbox'><div class='lb-outerContainer'><div class='lb-container'><img class='lb-image' src='' /><div class='lb-nav'><a class='lb-prev' href='' ></a><a class='lb-next' href='' ></a></div><div class='lb-loader'><a class='lb-cancel'></a></div></div></div><div class='lb-dataContainer'><div class='lb-data'><div class='lb-details'><span class='lb-caption'></span><span class='lb-number'></span></div><div class='lb-closeContainer'><a class='lb-close'></a></div></div></div></div>").appendTo(b('body'));this.$lightbox=b('#lightbox');this.$overlay=b('#lightboxOverlay');this.$outerContainer=this.$lightbox.find('.lb-outerContainer');this.$container=this.$lightbox.find('.lb-container');this.containerTopPadding=parseInt(this.$container.css('padding-top'),10);this.containerRightPadding=parseInt(this.$container.css('padding-right'),10);this.containerBottomPadding=parseInt(this.$container.css('padding-bottom'),10);this.containerLeftPadding=parseInt(this.$container.css('padding-left'),10);this.$overlay.hide().on('click',function(){c.end();return false});this.$lightbox.hide().on('click',function(d){if(b(d.target).attr('id')==='lightbox'){c.end()}return false});this.$outerContainer.on('click',function(d){if(b(d.target).attr('id')==='lightbox'){c.end()}return false});this.$lightbox.find('.lb-prev').on('click',function(){if(c.currentImageIndex===0){c.changeImage(c.album.length-1)}else{c.changeImage(c.currentImageIndex-1)}return false});this.$lightbox.find('.lb-next').on('click',function(){if(c.currentImageIndex===c.album.length-1){c.changeImage(0)}else{c.changeImage(c.currentImageIndex+1)}return false});return this.$lightbox.find('.lb-loader, .lb-close').on('click',function(){c.end();return false})};c.prototype.start=function(c){var f,e,j,d,g,n,o,k,l,m,p,h,i;b(window).on("resize",this.sizeOverlay);b('select, object, embed').css({visibility:"hidden"});this.$overlay.width(b(document).width()).height(b(document).height()).fadeIn(this.options.fadeDuration);this.album=[];g=0;j=c.attr('data-lightbox');if(j){h=b(c.prop("tagName")+'[data-lightbox="'+j+'"]');for(d=k=0,m=h.length;k<m;d=++k){e=h[d];this.album.push({link:b(e).attr('href'),title:b(e).attr('title')});if(b(e).attr('href')===c.attr('href')){g=d}}}else{if(c.attr('rel')==='lightbox'){this.album.push({link:c.attr('href'),title:c.attr('title')})}else{i=b(c.prop("tagName")+'[rel="'+c.attr('rel')+'"]');for(d=l=0,p=i.length;l<p;d=++l){e=i[d];this.album.push({link:b(e).attr('href'),title:b(e).attr('title')});if(b(e).attr('href')===c.attr('href')){g=d}}}}f=b(window);o=f.scrollTop()+f.height()/10;n=f.scrollLeft();this.$lightbox.css({top:o+'px',left:n+'px'}).fadeIn(this.options.fadeDuration);this.changeImage(g)};c.prototype.changeImage=function(f){var d,c,e=this;this.disableKeyboardNav();d=this.$lightbox.find('.lb-image');this.sizeOverlay();this.$overlay.fadeIn(this.options.fadeDuration);b('.lb-loader').fadeIn('slow');this.$lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();this.$outerContainer.addClass('animating');c=new Image();c.onload=function(){var m,g,h,i,j,k,l;d.attr('src',e.album[f].link);m=b(c);d.width(c.width);d.height(c.height);if(e.options.fitImagesInViewport){l=b(window).width();k=b(window).height();j=l-e.containerLeftPadding-e.containerRightPadding-20;i=k-e.containerTopPadding-e.containerBottomPadding-110;if((c.width>j)||(c.height>i)){if((c.width/j)>(c.height/i)){h=j;g=parseInt(c.height/(c.width/h),10);d.width(h);d.height(g)}else{g=i;h=parseInt(c.width/(c.height/g),10);d.width(h);d.height(g)}}}return e.sizeContainer(d.width(),d.height())};c.src=this.album[f].link;this.currentImageIndex=f};c.prototype.sizeOverlay=function(){return b('#lightboxOverlay').width(b(document).width()).height(b(document).height())};c.prototype.sizeContainer=function(f,g){var b,d,e,h,c=this;h=this.$outerContainer.outerWidth();e=this.$outerContainer.outerHeight();d=f+this.containerLeftPadding+this.containerRightPadding;b=g+this.containerTopPadding+this.containerBottomPadding;this.$outerContainer.animate({width:d,height:b},this.options.resizeDuration,'swing');setTimeout(function(){c.$lightbox.find('.lb-dataContainer').width(d);c.$lightbox.find('.lb-prevLink').height(b);c.$lightbox.find('.lb-nextLink').height(b);c.showImage()},this.options.resizeDuration)};c.prototype.showImage=function(){this.$lightbox.find('.lb-loader').hide();this.$lightbox.find('.lb-image').fadeIn('slow');this.updateNav();this.updateDetails();this.preloadNeighboringImages();this.enableKeyboardNav()};c.prototype.updateNav=function(){this.$lightbox.find('.lb-nav').show();if(this.album.length>1){if(this.options.wrapAround){this.$lightbox.find('.lb-prev, .lb-next').show()}else{if(this.currentImageIndex>0){this.$lightbox.find('.lb-prev').show()}if(this.currentImageIndex<this.album.length-1){this.$lightbox.find('.lb-next').show()}}}};c.prototype.updateDetails=function(){var b=this;if(typeof this.album[this.currentImageIndex].title!=='undefined'&&this.album[this.currentImageIndex].title!==""){this.$lightbox.find('.lb-caption').html(this.album[this.currentImageIndex].title).fadeIn('fast')}if(this.album.length>1&&this.options.showImageNumberLabel){this.$lightbox.find('.lb-number').text(this.options.albumLabel(this.currentImageIndex+1,this.album.length)).fadeIn('fast')}else{this.$lightbox.find('.lb-number').hide()}this.$outerContainer.removeClass('animating');this.$lightbox.find('.lb-dataContainer').fadeIn(this.resizeDuration,function(){return b.sizeOverlay()})};c.prototype.preloadNeighboringImages=function(){var c,b;if(this.album.length>this.currentImageIndex+1){c=new Image();c.src=this.album[this.currentImageIndex+1].link}if(this.currentImageIndex>0){b=new Image();b.src=this.album[this.currentImageIndex-1].link}};c.prototype.enableKeyboardNav=function(){b(document).on('keyup.keyboard',b.proxy(this.keyboardAction,this))};c.prototype.disableKeyboardNav=function(){b(document).off('.keyboard')};c.prototype.keyboardAction=function(g){var d,e,f,c,b;d=27;e=37;f=39;b=g.keyCode;c=String.fromCharCode(b).toLowerCase();if(b===d||c.match(/x|o|c/)){this.end()}else if(c==='p'||b===e){if(this.currentImageIndex!==0){this.changeImage(this.currentImageIndex-1)}}else if(c==='n'||b===f){if(this.currentImageIndex!==this.album.length-1){this.changeImage(this.currentImageIndex+1)}}};c.prototype.end=function(){this.disableKeyboardNav();b(window).off("resize",this.sizeOverlay);this.$lightbox.fadeOut(this.options.fadeDuration);this.$overlay.fadeOut(this.options.fadeDuration);return b('select, object, embed').css({visibility:"visible"})};return c})();b(function(){var e,b;b=new c();return e=new d(b)})}).call(this);
Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};
(function() {
  var animateImages, imagesTransition, renderImages;

  animateImages = function() {
    if (state.current_page === "images") {
      requestAnimationFrame(animate);
      renderImages();
      return updateImages();
    } else {
      return false;
    }
  };

  renderImages = function() {
    return render.render(scene, camera);
  };

  imagesTransition = function() {};

}).call(this);
(function() {
  var ME, trasition;

  ME = {};

  trasition = function() {
    return scene.objects.each(function(i) {
      if (i.page = Site.current_page) {

      } else {

      }
    });
  };

}).call(this);
{

    "metadata" :
    {
        "formatVersion" : 3,
        "sourceFile" : "tree_triangles.obj",
        "generatedBy" : "OBJConverter",
        "vertices" : 415,
        "faces" : 760,
        "normals" : 1636,
        "colors" : 0,
        "uvs" : 1498,
        "materials" : 0
    },

    "scale" : 1.000000,

    "materials": [	{
"DbgColor" : 15658734,
"DbgIndex" : 0,
"DbgName" : "default"
}],

    "vertices": [0.061043,0.025284,0.034490,0.011829,0.022302,0.083267,-0.058528,0.017917,0.083267,-0.109573,0.014532,-0.034490,-0.026732,0.060313,-0.099586,0.032816,0.217090,-0.081389,0.014186,0.220894,-0.037159,-0.030439,0.223336,-0.148347,0.014332,0.218101,-0.127445,-0.012410,0.359863,-0.058151,0.007135,0.364429,-0.096394,0.050050,0.365321,-0.111165,0.091197,0.362018,-0.093810,-0.034402,0.607330,0.018474,-0.047875,0.608469,0.045145,-0.075711,0.608536,0.056203,-0.101604,0.607492,0.045169,-0.110386,0.605948,0.018508,-0.096912,0.604808,-0.008164,-0.069076,0.604741,-0.019221,-0.043184,0.605786,-0.008188,-0.005259,0.780558,-0.089352,0.019098,0.779084,-0.078251,-0.049662,0.990274,0.082265,-0.065202,0.990373,0.074837,-0.057327,0.991273,0.057896,-0.041787,0.991173,0.065324,-0.025339,1.145101,0.000000,0.063987,-0.005220,-0.034490,0.064746,-0.005053,0.034490,0.015533,-0.008035,0.083267,-0.054824,-0.012419,0.083267,-0.105111,-0.015637,0.034490,-0.105869,-0.015804,-0.034490,-0.028686,-0.011068,-0.098198,0.016454,-0.008265,-0.098938,0.069705,0.132069,-0.030589,0.046198,0.133147,0.026017,-0.011239,0.134185,0.048551,-0.068960,0.134576,0.023813,-0.093153,0.134091,-0.033705,-0.069646,0.133013,-0.090311,-0.012209,0.131974,-0.112845,0.045512,0.131584,-0.088107,0.060284,0.025117,-0.034490,0.074466,0.040836,-0.004252,0.046764,0.038939,0.063257,-0.112630,0.073898,0.031315,-0.093477,0.019923,-0.074960,0.012751,0.022071,-0.098938,0.042219,0.064768,-0.071638,0.113534,0.005387,-0.027553,0.104410,0.016756,-0.004446,0.094627,0.004297,0.024654,0.097609,-0.020131,0.024654,0.116516,-0.019041,-0.027553,0.165229,-0.016172,0.022676,0.167928,-0.010108,0.034203,0.172309,-0.015681,0.049160,0.173781,-0.027741,0.049160,0.166701,-0.028232,0.022676,0.223852,-0.035138,0.004759,0.112872,-0.012736,-0.096485,0.084831,-0.014530,-0.123684,0.110807,0.004181,-0.096485,0.082766,0.002386,-0.123684,0.102484,0.011952,-0.117200,0.148290,-0.031922,-0.170902,-0.093294,-0.015045,-0.073807,-0.016381,0.021291,-0.153534,-0.018776,-0.001544,-0.148548,0.003238,-0.000669,-0.154808,-0.047505,0.015676,-0.131589,0.001476,0.014615,-0.156781,-0.047329,-0.001851,-0.128241,-0.055269,-0.001482,-0.184760,-0.055507,-0.015180,-0.181753,-0.047381,-0.014975,-0.185529,-0.066633,-0.004404,-0.171524,-0.048468,-0.005757,-0.186719,-0.066069,-0.014947,-0.169504,-0.073066,-0.010493,-0.226679,-0.157555,0.009940,0.089984,-0.172627,0.024322,0.054311,-0.158703,0.009746,0.001569,-0.156239,-0.010437,0.001569,-0.170901,-0.011277,0.054096,-0.155091,-0.010242,0.089984,-0.249887,-0.014220,0.054871,-0.255392,-0.004868,0.031186,-0.243244,-0.013881,0.017696,-0.241685,-0.026651,0.017696,-0.254251,-0.027389,0.030766,-0.248328,-0.026990,0.054871,-0.317616,-0.023315,0.001723,-0.024921,0.060970,0.091389,0.009011,0.002511,0.122996,-0.035581,0.005710,0.124806,0.011110,-0.014683,0.122996,-0.033239,-0.015454,0.124337,-0.003901,0.028029,0.134276,0.075910,-0.021050,0.221453,-0.008968,-0.003134,0.155814,-0.006853,-0.017537,0.156097,-0.065435,-0.002915,0.158962,-0.059811,-0.010030,0.158782,-0.059446,0.008571,0.162610,-0.054137,-0.002898,0.170905,-0.050128,-0.007679,0.171014,-0.101107,-0.037419,0.164454,-0.084857,0.247553,-0.084351,-0.065909,0.278454,-0.046870,-0.022049,0.241529,-0.018455,-0.027588,0.212620,-0.009760,-0.072023,0.197926,-0.031692,-0.093787,0.218469,-0.079454,-0.203335,0.323966,0.023975,-0.188092,0.331478,0.044959,-0.189917,0.324537,0.071675,-0.206985,0.310084,0.077408,-0.222228,0.302573,0.056424,-0.220403,0.309514,0.029708,-0.391278,0.444276,-0.008491,-0.383778,0.452632,0.007174,-0.388723,0.449201,0.027092,-0.401168,0.437414,0.031344,-0.408668,0.429059,0.015679,-0.403723,0.432490,-0.004239,-0.563896,0.515683,0.007964,-0.558852,0.519890,0.016664,-0.562857,0.518465,0.027740,-0.571905,0.512833,0.030116,-0.576949,0.508626,0.021417,-0.572945,0.510051,0.010341,-0.657225,0.660087,-0.048334,-0.650643,0.662540,-0.039216,-0.653534,0.660141,-0.027530,-0.663006,0.655289,-0.024963,-0.669588,0.652836,-0.034081,-0.666697,0.655235,-0.045767,-0.734590,0.711815,0.013046,-0.222939,0.330789,0.044135,-0.201473,0.335159,0.059299,-0.183694,0.321395,0.065855,-0.187381,0.303262,0.057248,-0.208847,0.298892,0.042084,-0.226626,0.312655,0.035528,-0.311111,0.302779,0.189061,-0.295547,0.305799,0.204549,-0.287339,0.292794,0.219836,-0.294697,0.276768,0.219635,-0.310261,0.273748,0.204147,-0.318468,0.286753,0.188860,-0.444054,0.378761,0.257440,-0.437794,0.381175,0.266621,-0.436022,0.375481,0.275497,-0.440510,0.367373,0.275194,-0.446770,0.364958,0.266014,-0.448542,0.370652,0.257137,-0.601728,0.372490,0.365952,-0.380935,0.435847,-0.001033,-0.379475,0.449425,0.007716,-0.394763,0.454423,0.020175,-0.411511,0.445843,0.023886,-0.412971,0.432266,0.015138,-0.397684,0.427268,0.002678,-0.496275,0.505590,-0.181381,-0.496029,0.513471,-0.177495,-0.505280,0.516724,-0.171907,-0.514777,0.512095,-0.170205,-0.515023,0.504214,-0.174091,-0.505772,0.500961,-0.179679,-0.568096,0.545817,-0.389724,-0.660813,0.661901,-0.046627,-0.652733,0.663915,-0.038791,-0.652035,0.659703,-0.028812,-0.659418,0.653475,-0.026670,-0.667499,0.651461,-0.034507,-0.668196,0.655673,-0.044485,-0.734590,0.711815,0.013046,-0.572490,0.519890,0.011844,-0.561270,0.520342,0.014729,-0.556681,0.514710,0.021925,-0.563311,0.508626,0.026236,-0.574531,0.508175,0.023351,-0.579120,0.513807,0.016155,-0.594487,0.559002,0.085473,-0.583530,0.559921,0.089239,-0.579676,0.555597,0.098898,-0.586780,0.550354,0.104792,-0.597736,0.549435,0.101026,-0.601590,0.553759,0.091367,-0.625342,0.621512,0.132529,-0.029237,0.484801,-0.057992,-0.000226,0.452443,-0.070622,0.034084,0.451258,-0.055985,0.028216,0.488878,-0.031632,0.014756,0.509774,-0.046013,-0.017973,0.510847,-0.059764,0.044635,0.552342,-0.227241,0.060131,0.542012,-0.237752,0.083936,0.544196,-0.236114,0.092244,0.556709,-0.223963,0.076748,0.567038,-0.213451,0.052943,0.564855,-0.215090,-0.025367,0.644074,-0.384664,-0.014775,0.638211,-0.396202,0.002306,0.641678,-0.397502,0.008796,0.651008,-0.387264,-0.001796,0.656871,-0.375726,-0.018878,0.653404,-0.374426,-0.040218,0.734709,-0.495677,-0.034171,0.731003,-0.501461,-0.024867,0.733596,-0.502924,-0.021610,0.739895,-0.498605,-0.027657,0.743601,-0.492822,-0.036961,0.741008,-0.491358,-0.133056,0.766329,-0.659632,-0.126082,0.762000,-0.663301,-0.115945,0.764092,-0.663631,-0.112782,0.770513,-0.660293,-0.119756,0.774843,-0.656624,-0.129894,0.772751,-0.656293,-0.101527,0.803591,-0.743173,0.058261,0.562815,-0.242395,0.070197,0.549322,-0.247133,0.080375,0.541032,-0.230340,0.078618,0.546236,-0.208809,0.066682,0.559729,-0.204071,0.056504,0.568019,-0.220864,0.181358,0.619533,-0.256831,0.193723,0.609766,-0.261079,0.210415,0.607017,-0.248570,0.214741,0.614036,-0.231812,0.202376,0.623803,-0.227564,0.185684,0.626552,-0.240073,0.209116,0.685765,-0.377896,0.216140,0.681633,-0.381587,0.225157,0.681507,-0.376878,0.227150,0.685513,-0.368478,0.220127,0.689645,-0.364787,0.211110,0.689771,-0.369496,0.293200,0.780213,-0.419826,-0.016346,0.639314,-0.375217,-0.013202,0.636186,-0.392048,-0.005142,0.644413,-0.402795,-0.000226,0.655768,-0.396711,-0.003369,0.658896,-0.379880,-0.011429,0.650670,-0.369133,-0.189015,0.696573,-0.432319,-0.188187,0.695117,-0.441926,-0.184971,0.700061,-0.448259,-0.182582,0.706461,-0.444984,-0.183409,0.707918,-0.435377,-0.186626,0.702974,-0.429045,-0.373963,0.732930,-0.443383,-0.132349,0.768156,-0.662605,-0.126230,0.763012,-0.665265,-0.116800,0.763277,-0.662622,-0.113489,0.768686,-0.657320,-0.119608,0.773830,-0.654660,-0.129039,0.773565,-0.657302,-0.101527,0.803591,-0.743173,-0.038654,0.739108,-0.502599,-0.035983,0.732367,-0.501931,-0.028242,0.730562,-0.496473,-0.023174,0.735496,-0.491683,-0.025846,0.742237,-0.492351,-0.033586,0.744043,-0.497809,0.008871,0.745565,-0.565837,0.012111,0.738902,-0.565925,0.021441,0.737312,-0.562583,0.027530,0.742385,-0.559152,0.024290,0.749049,-0.559063,0.014960,0.750639,-0.562406,0.027361,0.753459,-0.650835,0.098971,0.342262,-0.057236,0.080541,0.323799,-0.018567,0.035103,0.336234,-0.003772,0.036164,0.373471,0.001852,0.075348,0.398926,-0.012791,0.097638,0.378469,-0.050429,0.160964,0.456088,0.163408,0.159525,0.442620,0.184078,0.138063,0.442092,0.202779,0.118039,0.455033,0.200810,0.119478,0.468502,0.180139,0.140941,0.469029,0.161438,0.327304,0.580309,0.246148,0.329658,0.572729,0.264042,0.315857,0.574701,0.279728,0.299702,0.584251,0.277520,0.297349,0.591831,0.259625,0.311150,0.589859,0.243939,0.409892,0.693885,0.335919,0.410653,0.689097,0.345425,0.403594,0.691034,0.354673,0.395773,0.697759,0.354415,0.395012,0.702547,0.344908,0.402072,0.700610,0.335660,0.615162,0.751080,0.398964,0.613550,0.745336,0.407411,0.604984,0.746523,0.416354,0.598029,0.753454,0.416850,0.599640,0.759198,0.408404,0.608207,0.758011,0.399461,0.649796,0.795023,0.498981,0.159840,0.467405,0.188522,0.157287,0.450385,0.201068,0.136949,0.438541,0.194654,0.119163,0.443716,0.175695,0.121716,0.460736,0.163150,0.142055,0.472581,0.169563,0.056838,0.518954,0.309031,0.052611,0.506208,0.321905,0.029136,0.500244,0.325073,0.009889,0.507025,0.315367,0.014116,0.519771,0.302494,0.037590,0.525735,0.299326,0.118769,0.599184,0.440264,0.117087,0.593666,0.448790,0.105781,0.592138,0.452355,0.096158,0.596129,0.447393,0.097840,0.601648,0.438867,0.109145,0.603175,0.435303,0.061516,0.701163,0.555096,0.313179,0.573119,0.245279,0.325397,0.569948,0.261671,0.325722,0.579109,0.278226,0.313828,0.591441,0.278389,0.301609,0.594612,0.261997,0.301285,0.585451,0.245441,0.488666,0.664723,0.154918,0.496354,0.663420,0.163501,0.497782,0.669123,0.171988,0.491521,0.676130,0.171891,0.483833,0.677434,0.163307,0.482406,0.671731,0.154821,0.640971,0.731040,0.013651,0.616613,0.753281,0.402228,0.615062,0.746640,0.409034,0.605045,0.745625,0.414713,0.596578,0.751252,0.413586,0.598128,0.757894,0.406780,0.608146,0.758908,0.401101,0.649796,0.795023,0.498981,0.413302,0.699191,0.343465,0.412200,0.690944,0.344448,0.401731,0.687575,0.346149,0.392363,0.692453,0.346869,0.393465,0.700700,0.345886,0.403935,0.704069,0.344184,0.425402,0.704066,0.436689,0.424445,0.695877,0.438787,0.414380,0.692671,0.443607,0.405273,0.697655,0.446330,0.406230,0.705843,0.444232,0.416295,0.709049,0.439412,0.479156,0.715408,0.524064,-0.315152,0.899639,-0.108081,-0.315130,0.896911,-0.111069,-0.312304,0.896928,-0.114995,-0.312347,0.902383,-0.109021,-0.348501,0.914088,-0.137929,-0.075270,0.229728,-0.131852,0.002865,0.354300,-0.018838,0.031618,0.492900,-0.015978,0.013737,0.503698,0.016177,-0.019774,0.491003,0.029027,-0.049369,0.480896,0.013166,-0.061398,0.482906,-0.019822,-0.044889,0.484619,-0.052279,-0.015645,0.772807,-0.072454,-0.011121,0.780381,-0.077107,-0.013007,0.787936,-0.071803,0.008208,0.772392,-0.052438,-0.012764,0.778290,-0.058302,-0.314542,0.896940,-0.111858,-0.314140,0.900519,-0.108540,-0.313489,0.896985,-0.113481,-0.310529,0.902467,-0.113821,-0.311877,0.902315,-0.109827,-0.075132,0.802664,-0.104187,-0.076929,0.796972,-0.112541,-0.072179,0.797611,-0.123389,-0.065633,0.803942,-0.125883,-0.063836,0.809634,-0.117529,-0.068585,0.808995,-0.106681,-0.163488,0.844578,-0.103592,-0.166776,0.841150,-0.110105,-0.164587,0.842470,-0.118414,-0.159111,0.847219,-0.120211,-0.155823,0.850647,-0.113698,-0.158012,0.849327,-0.105389,-0.220905,0.886184,-0.120587,-0.222396,0.884074,-0.124149,-0.221581,0.885117,-0.128842,-0.219274,0.888271,-0.129974,-0.217783,0.890381,-0.126412,-0.218599,0.889337,-0.121718,-0.313827,0.898842,-0.107150,-0.314157,0.896468,-0.110748,-0.312656,0.897281,-0.115607,-0.310824,0.900468,-0.116867,-0.310493,0.902842,-0.113269,-0.311995,0.902029,-0.108410,-0.348501,0.914088,-0.137929,-0.313398,0.896989,-0.113563,-0.310488,0.902594,-0.113628,-0.311912,0.902312,-0.109781,-0.348501,0.914088,-0.137929,-0.348501,0.914088,-0.137929,-0.348501,0.914088,-0.137929,-0.348501,0.914088,-0.137929,-0.348501,0.914088,-0.137929],

    "morphTargets": [],

    "morphColors": [],

    "normals": [0.91273,0.15572,0.37772,0.91273,0.15572,0.37772,0.91273,0.15572,0.37772,0.91273,0.15572,0.37772,0.91273,0.15572,0.37772,0.39889,0.34736,0.84866,0.39889,0.34736,0.84866,0.39889,0.34736,0.84866,0.39889,0.34736,0.84866,0.39889,0.34736,0.84866,-0.44592,0.41068,0.7953,-0.44592,0.41068,0.7953,-0.44592,0.41068,0.7953,-0.44592,0.41068,0.7953,-0.44592,0.41068,0.7953,-0.75255,0.58014,0.31164,-0.75255,0.58014,0.31164,-0.75255,0.58014,0.31164,-0.947,0.13639,-0.29084,-0.947,0.13639,-0.29084,-0.947,0.13639,-0.29084,-0.947,0.13639,-0.29084,-0.947,0.13639,-0.29084,-0.33272,-0.076479,-0.93992,-0.33272,-0.076479,-0.93992,-0.33272,-0.076479,-0.93992,-0.33272,-0.076479,-0.93992,0.38045,-0.10294,-0.91906,0.38045,-0.10294,-0.91906,0.38045,-0.10294,-0.91906,0.38045,-0.10294,-0.91906,0.38045,-0.10294,-0.91906,0.89997,-0.088523,-0.42686,0.89997,-0.088523,-0.42686,0.89997,-0.088523,-0.42686,0.89997,-0.088523,-0.42686,0.89997,-0.088523,-0.42686,0.80975,-0.52103,0.26987,0.80975,-0.52103,0.26987,0.80975,-0.52103,0.26987,0.80975,-0.52103,0.26987,0.25023,-0.3108,0.91694,0.25023,-0.3108,0.91694,0.25023,-0.3108,0.91694,0.25023,-0.3108,0.91694,-0.43825,0.099853,0.89329,-0.43825,0.099853,0.89329,-0.43825,0.099853,0.89329,-0.43825,0.099853,0.89329,-0.81097,0.55753,0.17745,-0.81097,0.55753,0.17745,-0.81097,0.55753,0.17745,-0.81097,0.55753,0.17745,-0.75499,0.55891,-0.34293,-0.75499,0.55891,-0.34293,-0.75499,0.55891,-0.34293,-0.75499,0.55891,-0.34293,-0.28584,0.39724,-0.87207,-0.28584,0.39724,-0.87207,-0.28584,0.39724,-0.87207,-0.28584,0.39724,-0.87207,0.40696,0.002279,-0.91344,0.40696,0.002279,-0.91344,0.40696,0.002279,-0.91344,0.40696,0.002279,-0.91344,0.85231,-0.37461,-0.36501,0.85231,-0.37461,-0.36501,0.85231,-0.37461,-0.36501,0.85231,-0.37461,-0.36501,0.85783,0.40971,0.31027,0.85783,0.40971,0.31027,0.85783,0.40971,0.31027,0.85783,0.40971,0.31027,0.37096,-0.038182,0.92787,0.37096,-0.038182,0.92787,0.37096,-0.038182,0.92787,0.37096,-0.038182,0.92787,-0.3376,-0.36038,0.86957,-0.3376,-0.36038,0.86957,-0.3376,-0.36038,0.86957,-0.3376,-0.36038,0.86957,-0.85965,-0.42741,0.27986,-0.85965,-0.42741,0.27986,-0.85965,-0.42741,0.27986,-0.85965,-0.42741,0.27986,-0.86477,-0.20353,-0.45907,-0.86477,-0.20353,-0.45907,-0.86477,-0.20353,-0.45907,-0.86477,-0.20353,-0.45907,-0.26814,0.23891,-0.93329,-0.26814,0.23891,-0.93329,-0.26814,0.23891,-0.93329,-0.26814,0.23891,-0.93329,-0.26814,0.23891,-0.93329,0.3533,0.55106,-0.75599,0.3533,0.55106,-0.75599,0.3533,0.55106,-0.75599,0.3533,0.55106,-0.75599,0.70925,0.56179,-0.42585,0.70925,0.56179,-0.42585,0.70925,0.56179,-0.42585,0.70925,0.56179,-0.42585,0.70925,0.56179,-0.42585,0.34041,0.39225,0.85455,0.34041,0.39225,0.85455,0.34041,0.39225,0.85455,-0.066427,0.57479,0.8156,-0.066427,0.57479,0.8156,-0.066427,0.57479,0.8156,-0.79885,0.55543,0.23095,-0.79885,0.55543,0.23095,-0.79885,0.55543,0.23095,-0.89166,0.34926,-0.28803,-0.89166,0.34926,-0.28803,-0.89166,0.34926,-0.28803,-0.89166,0.34926,-0.28803,-0.35976,-0.2301,-0.90423,-0.35976,-0.2301,-0.90423,-0.35976,-0.2301,-0.90423,0.35549,-0.45604,-0.81588,0.35549,-0.45604,-0.81588,0.35549,-0.45604,-0.81588,0.35549,-0.45604,-0.81588,0.86955,-0.41851,-0.26217,0.86955,-0.4185,-0.26217,0.86955,-0.41851,-0.26217,-0.36071,-0.55824,0.74717,-0.36071,-0.55824,0.74717,-0.36071,-0.55824,0.74717,0.35851,0.59217,-0.72167,0.35851,0.59217,-0.72167,0.35851,0.59217,-0.72167,0.35851,0.59217,-0.72167,0.90196,0.083426,0.42369,0.90196,0.083426,0.42369,0.90196,0.083426,0.42369,-0.37579,0.48017,0.7926,-0.37579,0.48017,0.7926,-0.37579,0.48017,0.7926,-0.90702,0.030542,-0.41999,-0.90702,0.030542,-0.41999,-0.90702,0.030542,-0.41999,0.39425,-0.39439,-0.83007,0.39425,-0.39439,-0.83007,0.39425,-0.39439,-0.83007,0.79647,0.52058,0.30762,0.79647,0.52058,0.30762,0.79647,0.52058,0.30762,0.79647,0.52058,0.30762,0.31697,0.61812,0.71935,0.31697,0.61812,0.71935,0.31697,0.61812,0.71935,0.31697,0.61812,0.71935,-0.41181,0.5355,0.73733,-0.41181,0.5355,0.73733,-0.41181,0.5355,0.73733,-0.41181,0.5355,0.73733,-0.86193,0.2718,0.42803,-0.86193,0.2718,0.42803,-0.86193,0.2718,0.42803,-0.86193,0.2718,0.42803,-0.90574,-0.20902,-0.36871,-0.90574,-0.20902,-0.36871,-0.90574,-0.20902,-0.36871,-0.90574,-0.20902,-0.36871,-0.35268,-0.39266,-0.84937,-0.35268,-0.39266,-0.84937,-0.35268,-0.39266,-0.84937,-0.35268,-0.39266,-0.84937,0.37973,-0.26716,-0.88568,0.37973,-0.26716,-0.88568,0.37973,-0.26716,-0.88568,0.37973,-0.26716,-0.88568,0.91222,0.16491,-0.37504,0.91222,0.16491,-0.37504,0.91222,0.16491,-0.37504,0.91222,0.16491,-0.37504,0.59566,-0.5698,0.56615,0.59566,-0.5698,0.56615,0.59566,-0.5698,0.56615,0.69877,0.085304,0.71024,0.69877,0.085304,0.71024,0.69877,0.085304,0.71024,0.69877,0.085304,0.71024,-0.93775,-0.061837,-0.34176,-0.93775,-0.061837,-0.34176,-0.93775,-0.061837,-0.34176,-0.93775,-0.061837,-0.34176,0.062157,-0.99806,0.001536,0.062157,-0.99806,0.001536,0.062157,-0.99806,0.001536,0.062157,-0.99806,0.001536,0.062157,-0.99806,0.001536,0.062157,-0.99806,0.001536,0.062157,-0.99806,0.001536,0.062157,-0.99806,0.001536,0.062157,-0.99806,0.001536,0.44634,0.78009,-0.43845,0.44634,0.78009,-0.43845,0.44634,0.78009,-0.43845,0.44634,0.78009,-0.43845,0.55834,0.68189,0.47253,0.55834,0.68189,0.47253,0.55834,0.68189,0.47253,0.55834,0.68189,0.47253,0.30203,0.036871,0.95258,0.30203,0.036871,0.95258,0.30203,0.036871,0.95258,0.30203,0.036871,0.95258,-0.32177,-0.9452,-0.05538,-0.32177,-0.9452,-0.05538,-0.32177,-0.9452,-0.05538,-0.32177,-0.9452,-0.05538,0.13519,0.016504,-0.99068,0.13519,0.016504,-0.99068,0.13519,0.016504,-0.99068,0.13519,0.016504,-0.99068,0.55256,0.78113,-0.29071,0.55256,0.78113,-0.29071,0.55256,0.78113,-0.29071,0.55256,0.78113,-0.29071,0.12857,0.91217,0.38912,0.12857,0.91217,0.38912,0.12857,0.91217,0.38912,0.12857,0.91217,0.38912,-0.30945,-0.037777,0.95016,-0.30945,-0.037777,0.95016,-0.30945,-0.037777,0.95016,-0.30945,-0.037777,0.95016,-0.11714,-0.9928,-0.025149,-0.11714,-0.9928,-0.025149,-0.11714,-0.9928,-0.025149,-0.11714,-0.9928,-0.025149,0.71265,0.086998,-0.69611,0.71265,0.086998,-0.69611,0.71265,0.086998,-0.69611,0.71264,0.086998,-0.69611,0.13125,0.86433,-0.48549,0.13125,0.86433,-0.48549,0.13125,0.86433,-0.48549,0.47918,0.85911,0.17979,0.47918,0.85911,0.17979,0.47918,0.85911,0.17979,0.66798,0.081545,0.7397,0.66798,0.081545,0.7397,0.66798,0.081545,0.7397,-0.10542,-0.99333,0.04661,-0.10542,-0.99333,0.04661,-0.10542,-0.99333,0.04661,-0.303,-0.036989,-0.95227,-0.303,-0.036989,-0.95227,-0.303,-0.036989,-0.95227,-0.093709,0.60119,-0.79359,-0.093709,0.60119,-0.79359,-0.093709,0.60119,-0.79359,-0.093709,0.60119,-0.79359,0.69018,0.68137,0.24369,0.69018,0.68137,0.24369,0.69018,0.68137,0.24369,0.69018,0.68137,0.24369,-0.048463,-0.99453,0.092488,-0.048463,-0.99453,0.092488,-0.048463,-0.99453,0.092488,-0.048463,-0.99453,0.092488,-0.3434,-0.041922,-0.93825,-0.3434,-0.041922,-0.93825,-0.3434,-0.041922,-0.93825,-0.3434,-0.041922,-0.93825,0.78724,0.096105,0.60911,0.78724,0.096105,0.60911,0.78724,0.096105,0.60911,0.78724,0.096105,0.60911,-0.12099,0.71567,-0.68788,-0.12099,0.71567,-0.68788,-0.12099,0.71567,-0.68788,0.68879,0.72495,-0.004762,0.68879,0.72495,-0.004762,0.68879,0.72495,-0.004762,-0.12394,-0.97354,0.19201,-0.12394,-0.97354,0.19201,-0.12394,-0.97354,0.19201,-0.60833,-0.074263,-0.7902,-0.60833,-0.074263,-0.7902,-0.60833,-0.074263,-0.7902,0.90817,0.11087,0.40365,0.90817,0.11087,0.40365,0.90817,0.11087,0.40365,-0.55415,0.63974,-0.53259,-0.55415,0.63974,-0.53259,-0.55415,0.63974,-0.53259,-0.55415,0.63974,-0.53259,0.5757,0.75331,-0.31795,0.5757,0.75331,-0.31795,0.5757,0.75331,-0.31795,0.5757,0.75331,-0.31795,-0.075295,-0.96545,-0.24947,-0.075295,-0.96545,-0.24947,-0.075295,-0.96545,-0.24947,-0.075295,-0.96545,-0.24947,0.03733,-0.98639,-0.16014,0.03733,-0.98639,-0.16014,0.03733,-0.98639,-0.16014,0.03733,-0.98639,-0.16014,0.97196,0.1074,-0.2092,0.97196,0.1074,-0.2092,0.97196,0.1074,-0.2092,0.97196,0.1074,-0.2092,-0.76655,-0.060063,-0.63937,-0.76655,-0.060063,-0.63937,-0.76655,-0.060063,-0.63937,-0.76655,-0.060063,-0.63937,-0.3746,0.89698,-0.23475,-0.3746,0.89698,-0.23475,-0.3746,0.89698,-0.23475,-0.3746,0.89698,-0.23475,0.15521,0.68692,-0.70997,0.15521,0.68692,-0.70997,0.15521,0.68692,-0.70997,0.15521,0.68692,-0.70997,0.17834,-0.96084,0.21207,0.17834,-0.96084,0.21207,0.17834,-0.96084,0.21207,0.17834,-0.96084,0.21207,0.11957,-0.95928,0.25591,0.11957,-0.95928,0.25591,0.11957,-0.95928,0.25591,0.11957,-0.95928,0.25591,0.528,-0.048038,-0.84789,0.528,-0.048038,-0.84789,0.528,-0.048038,-0.84789,0.528,-0.048038,-0.84789,-0.91315,0.053197,0.40413,-0.91315,0.053197,0.40413,-0.91315,0.053197,0.40413,-0.91315,0.053197,0.40413,-0.32083,0.94477,-0.066877,-0.32083,0.94477,-0.066877,-0.32083,0.94477,-0.066877,0.42092,0.83352,-0.35787,0.42092,0.83352,-0.35787,0.42092,0.83352,-0.35787,-0.097697,-0.99306,-0.065414,-0.097697,-0.99306,-0.065414,-0.097697,-0.99306,-0.065414,-0.019617,-0.99517,-0.096152,-0.019617,-0.99517,-0.096152,-0.019617,-0.99517,-0.096152,0.84945,0.032189,-0.52669,0.84945,0.032189,-0.52669,0.84945,0.032189,-0.52669,-0.99242,-0.030255,0.11909,-0.99242,-0.030255,0.11909,-0.99242,-0.030255,0.11909,-0.13276,0.71903,0.68218,-0.13276,0.71903,0.68218,-0.13276,0.71903,0.68218,-0.13276,0.71903,0.68218,-0.58618,0.64705,-0.48756,-0.58618,0.64705,-0.48756,-0.58618,0.64705,-0.48756,-0.58618,0.64705,-0.48756,-0.58565,-0.071494,-0.80741,-0.58565,-0.071494,-0.80741,-0.58565,-0.071494,-0.80741,-0.58565,-0.071494,-0.80741,-0.091021,-0.99572,-0.015929,-0.091021,-0.99572,-0.015929,-0.091021,-0.99572,-0.015929,-0.091021,-0.99572,-0.015929,-0.027865,-0.99703,0.071836,-0.027865,-0.99703,0.071836,-0.027865,-0.99703,0.071836,-0.027865,-0.99703,0.071836,0.067009,0.00818,0.99772,0.067009,0.00818,0.99772,0.067009,0.00818,0.99772,0.067009,0.00818,0.99772,-0.39468,0.79779,0.45581,-0.39468,0.79779,0.45581,-0.39468,0.79779,0.45581,-0.39468,0.79779,0.45581,-0.25845,0.87338,-0.41281,-0.25845,0.87338,-0.41281,-0.25845,0.87338,-0.41281,-0.25845,0.87338,-0.41281,-0.18136,-0.02214,-0.98317,-0.18136,-0.02214,-0.98317,-0.18136,-0.02214,-0.98317,-0.18136,-0.02214,-0.98317,0.18562,-0.98117,0.05345,0.18562,-0.98117,0.05345,0.18562,-0.98117,0.05345,0.18562,-0.98117,0.05345,0.19819,-0.97897,-0.048403,0.19819,-0.97897,-0.048403,0.19819,-0.97897,-0.048403,0.19819,-0.97897,-0.048403,-0.34547,-0.042174,0.93748,-0.34547,-0.042174,0.93748,-0.34547,-0.042174,0.93748,-0.34547,-0.042174,0.93748,-0.43399,0.79895,0.41633,-0.43399,0.79895,0.41633,-0.43399,0.79895,0.41633,0.011678,0.83625,-0.54822,0.011678,0.83625,-0.54822,0.011678,0.83625,-0.54822,0.20686,0.025253,-0.97804,0.20686,0.025253,-0.97804,0.20686,0.025253,-0.97804,-0.026572,-0.9963,-0.08178,-0.026572,-0.9963,-0.08178,-0.026572,-0.9963,-0.08178,-0.080682,-0.99608,0.036304,-0.080682,-0.99608,0.036304,-0.080682,-0.99608,0.036304,-0.60943,-0.074397,0.78934,-0.60943,-0.074397,0.78934,-0.60943,-0.074397,0.78934,0.80354,0.56601,0.18424,0.80354,0.56601,0.18425,0.80354,0.56601,0.18425,0.80354,0.56601,0.18425,-0.64366,0.4831,0.59356,-0.64366,0.4831,0.59356,-0.64366,0.4831,0.59356,-0.64366,0.4831,0.59356,0.04303,-0.99086,-0.12789,0.04303,-0.99086,-0.12789,0.04303,-0.99086,-0.12789,0.04303,-0.99086,-0.12789,0.98425,0.12015,0.12969,0.98425,0.12015,0.12969,0.98425,0.12015,0.12969,0.98425,0.12015,0.12969,-0.88329,-0.10783,0.45626,-0.88329,-0.10783,0.45626,-0.88329,-0.10783,0.45626,-0.88329,-0.10783,0.45626,0.74812,0.54552,-0.37779,0.74812,0.54552,-0.37779,0.74812,0.54552,-0.37779,-0.42984,0.55962,0.70857,-0.42984,0.55962,0.70857,-0.42984,0.55962,0.70857,0.017884,-0.99693,-0.076236,0.017884,-0.99693,-0.076236,0.017884,-0.99693,-0.076236,0.83398,0.10181,-0.54231,0.83398,0.10181,-0.54231,0.83398,0.10181,-0.54231,-0.61994,-0.07568,0.78099,-0.61994,-0.07568,0.78099,-0.61994,-0.07568,0.78099,0.01496,-0.99686,-0.077816,0.01496,-0.99686,-0.077816,0.01496,-0.99686,-0.077816,-0.53417,0.74805,-0.39382,-0.53417,0.74805,-0.39382,-0.53417,0.74805,-0.39382,-0.53417,0.74805,-0.39382,-0.75254,-0.19756,-0.62821,-0.75254,-0.19756,-0.62821,-0.75254,-0.19756,-0.62821,-0.75254,-0.19756,-0.62821,-0.13366,-0.98426,0.11558,-0.13366,-0.98426,0.11558,-0.13366,-0.98426,0.11558,-0.13366,-0.98426,0.11558,0.23647,0.55799,0.79544,0.23647,0.55799,0.79544,0.23647,0.55799,0.79544,0.23647,0.55799,0.79544,0.33154,0.12492,0.93513,0.33154,0.12492,0.93513,0.33154,0.12492,0.93513,0.33154,0.12492,0.93513,-0.58725,0.50666,-0.63122,-0.58725,0.50666,-0.63122,-0.58725,0.50666,-0.63122,-0.1005,-0.05424,-0.99346,-0.1005,-0.05424,-0.99346,-0.1005,-0.05424,-0.99346,0.5118,-0.82283,-0.24702,0.5118,-0.82283,-0.24702,0.5118,-0.82283,-0.24702,-0.40869,0.40308,0.81884,-0.40869,0.40308,0.81884,-0.40869,0.40308,0.81884,-0.094738,-0.056813,0.99388,-0.094738,-0.056813,0.99388,-0.094738,-0.056813,0.99388,-0.004846,0.83704,-0.54713,-0.004846,0.83704,-0.54713,-0.004846,0.83704,-0.54713,-0.004846,0.83704,-0.54713,0.53177,0.81199,0.24062,0.53177,0.81199,0.24062,0.53177,0.81199,0.24062,0.53177,0.81199,0.24062,0.47313,0.046069,0.87979,0.47313,0.046069,0.87979,0.47313,0.046069,0.87979,0.47313,0.046069,0.87979,-0.1509,-0.77658,0.61168,-0.1509,-0.77658,0.61168,-0.1509,-0.77658,0.61168,-0.1509,-0.77658,0.61168,-0.62725,-0.77009,-0.11626,-0.62725,-0.77009,-0.11626,-0.62725,-0.77009,-0.11626,-0.62725,-0.77009,-0.11626,-0.59158,0.16036,-0.79014,-0.59158,0.16036,-0.79014,-0.59158,0.16036,-0.79014,-0.59158,0.16036,-0.79014,0.50543,0.63213,-0.58733,0.50543,0.63213,-0.58733,0.50543,0.63213,-0.58733,0.50543,0.63213,-0.58733,0.47212,0.8435,0.25614,0.47212,0.8435,0.25614,0.47212,0.8435,0.25614,0.47212,0.8435,0.25614,0.007268,0.34849,0.93728,0.007268,0.34849,0.93728,0.007268,0.34849,0.93728,0.007268,0.34849,0.93728,-0.536,-0.60103,0.59284,-0.536,-0.60103,0.59284,-0.536,-0.60103,0.59284,-0.536,-0.60103,0.59284,-0.5044,-0.82446,-0.25659,-0.5044,-0.82446,-0.25659,-0.5044,-0.82446,-0.25659,-0.5044,-0.82446,-0.25659,-0.038442,-0.31733,-0.94754,-0.038442,-0.31733,-0.94754,-0.038442,-0.31733,-0.94754,-0.038442,-0.31733,-0.94754,0.27413,0.78997,-0.54845,0.27413,0.78997,-0.54845,0.27413,0.78997,-0.54845,0.27413,0.78997,-0.54845,0.35919,0.90058,0.24481,0.35919,0.90058,0.24481,0.35919,0.90058,0.24481,0.35919,0.90058,0.24481,0.10042,0.24322,0.96476,0.10042,0.24322,0.96476,0.10042,0.24322,0.96476,0.10042,0.24322,0.96476,-0.33747,-0.75457,0.5628,-0.33747,-0.75457,0.5628,-0.33747,-0.75457,0.5628,-0.33747,-0.75457,0.5628,-0.42052,-0.86991,-0.25771,-0.42052,-0.86991,-0.25771,-0.42052,-0.86991,-0.25771,-0.42052,-0.86991,-0.25771,-0.16222,-0.16974,-0.97205,-0.16222,-0.16974,-0.97205,-0.16222,-0.16974,-0.97205,-0.16222,-0.16974,-0.97205,0.7617,0.25915,-0.59385,0.7617,0.25915,-0.59385,0.7617,0.25915,-0.59385,0.7617,0.25915,-0.59385,0.73418,0.59734,0.32276,0.73418,0.59734,0.32276,0.73418,0.59734,0.32276,0.73418,0.59734,0.32276,0.031958,0.37955,0.92462,0.031958,0.37955,0.92462,0.031958,0.37955,0.92462,0.031958,0.37955,0.92462,-0.7617,-0.25915,0.59385,-0.7617,-0.25915,0.59385,-0.7617,-0.25915,0.59385,-0.7617,-0.25915,0.59385,-0.73418,-0.59734,-0.32275,-0.73418,-0.59734,-0.32275,-0.73418,-0.59734,-0.32275,-0.73418,-0.59734,-0.32275,-0.031958,-0.37955,-0.92462,-0.031958,-0.37955,-0.92462,-0.031958,-0.37955,-0.92462,-0.031958,-0.37955,-0.92462,0.25267,0.87297,-0.41722,0.25267,0.87297,-0.41722,0.25267,0.87297,-0.41722,0.61531,0.72827,0.30171,0.61531,0.72827,0.30171,0.61531,0.72827,0.30171,0.34376,-0.18389,0.92088,0.34376,-0.18389,0.92088,0.34376,-0.18389,0.92088,-0.37123,-0.79392,0.48154,-0.37123,-0.79392,0.48154,-0.37123,-0.79392,0.48154,-0.7518,-0.58415,-0.30589,-0.7518,-0.58415,-0.30589,-0.7518,-0.58415,-0.30589,-0.41419,0.36823,-0.83238,-0.41419,0.36823,-0.83238,-0.41419,0.36823,-0.83238,-0.23219,0.97157,0.046256,-0.23219,0.97157,0.046256,-0.23219,0.97157,0.046256,-0.23219,0.97157,0.046256,0.43716,0.784,0.44072,0.43716,0.784,0.44072,0.43716,0.784,0.44072,0.43716,0.784,0.44072,0.7991,-0.37875,0.4669,0.7991,-0.37875,0.4669,0.7991,-0.37875,0.4669,0.7991,-0.37875,0.4669,0.21127,-0.97723,-0.019613,0.21127,-0.97723,-0.019613,0.21127,-0.97723,-0.019613,0.21127,-0.97723,-0.019613,-0.46332,-0.78513,-0.41097,-0.46332,-0.78513,-0.41097,-0.46332,-0.78513,-0.41097,-0.46332,-0.78513,-0.41097,-0.82181,0.37607,-0.42803,-0.82181,0.37607,-0.42803,-0.82181,0.37607,-0.42803,-0.82181,0.37607,-0.42803,0.27052,0.86175,-0.42919,0.27052,0.86175,-0.42919,0.27052,0.86175,-0.42919,0.27052,0.86175,-0.42919,0.55312,0.75375,0.35486,0.55312,0.75375,0.35486,0.55312,0.75375,0.35486,0.55312,0.75375,0.35486,0.26957,-0.15217,0.95088,0.26957,-0.15217,0.95088,0.26957,-0.15217,0.95088,0.26957,-0.15217,0.95088,-0.33006,-0.81742,0.4721,-0.33006,-0.81742,0.4721,-0.33006,-0.81742,0.4721,-0.33006,-0.81742,0.4721,-0.62201,-0.72237,-0.30213,-0.62201,-0.72237,-0.30213,-0.62201,-0.72237,-0.30213,-0.622,-0.72237,-0.30213,-0.35674,0.19418,-0.9138,-0.35674,0.19418,-0.9138,-0.35674,0.19418,-0.9138,-0.35674,0.19418,-0.9138,-0.14675,0.97667,-0.15679,-0.14675,0.97667,-0.15679,-0.14675,0.97667,-0.15679,0.2506,0.83682,0.48676,0.2506,0.83682,0.48676,0.2506,0.83682,0.48676,0.46289,-0.28756,0.83848,0.46289,-0.28756,0.83848,0.46289,-0.28756,0.83848,0.082046,-0.97619,0.20079,0.082046,-0.97619,0.20079,0.082046,-0.97619,0.20079,-0.33655,-0.82171,-0.45991,-0.33655,-0.82171,-0.45991,-0.33655,-0.82171,-0.45991,-0.54404,0.32997,-0.77146,-0.54404,0.32997,-0.77146,-0.54404,0.32997,-0.77146,0.5153,0.27973,-0.81007,0.5153,0.27973,-0.81007,0.5153,0.27973,-0.81007,0.5153,0.27973,-0.81007,0.5153,0.27973,-0.81007,0.5153,0.27973,-0.81007,0.85862,0.20767,-0.46866,0.85862,0.20767,-0.46866,0.85862,0.20767,-0.46866,0.85862,0.20767,-0.46866,0.37305,0.92392,0.084884,0.37305,0.92392,0.084884,0.37305,0.92392,0.084884,0.37305,0.92392,0.084884,-0.32357,0.82949,0.45525,-0.32357,0.82949,0.45525,-0.32357,0.82949,0.45525,-0.32357,0.82949,0.45525,-0.89281,-0.1737,0.41559,-0.89281,-0.1737,0.41559,-0.89281,-0.1737,0.41559,-0.89281,-0.1737,0.41559,-0.40014,-0.90729,-0.12932,-0.40014,-0.90728,-0.12932,-0.40014,-0.90728,-0.12932,-0.40014,-0.90728,-0.12932,0.30232,-0.80797,-0.50575,0.30232,-0.80797,-0.50575,0.30232,-0.80797,-0.50575,0.30232,-0.80797,-0.50575,0.94549,0.1198,-0.3028,0.94549,0.1198,-0.3028,0.94549,0.1198,-0.3028,0.34533,0.93813,0.025715,0.34533,0.93813,0.025715,0.34533,0.93813,0.025715,-0.39227,0.89011,0.23202,-0.39227,0.89011,0.23202,-0.39227,0.89011,0.23202,-0.97138,-0.079965,0.22365,-0.97138,-0.079965,0.22365,-0.97138,-0.079965,0.22365,-0.376,-0.92267,-0.085475,-0.376,-0.92267,-0.085475,-0.376,-0.92267,-0.085475,0.37439,-0.87789,-0.29857,0.37439,-0.87789,-0.29857,0.37439,-0.87789,-0.29857,0.43029,-0.52118,0.73703,0.43029,-0.52118,0.73703,0.43029,-0.52118,0.73703,0.43029,-0.52118,0.73703,0.43029,-0.52118,0.73703,0.43029,-0.52118,0.73703,0.22102,0.86507,-0.45034,0.22102,0.86507,-0.45034,0.22102,0.86507,-0.45034,0.60852,0.7454,0.27216,0.60852,0.7454,0.27216,0.60852,0.7454,0.27216,0.37918,-0.13465,0.91547,0.37918,-0.13465,0.91547,0.37918,-0.13465,0.91547,-0.3236,-0.7808,0.53444,-0.3236,-0.7808,0.53444,-0.3236,-0.7808,0.53444,-0.73397,-0.64257,-0.21998,-0.73397,-0.64257,-0.21998,-0.73397,-0.64257,-0.21998,-0.47989,0.28334,-0.83032,-0.47989,0.28334,-0.83032,-0.47989,0.28334,-0.83032,0.53857,-0.7621,-0.35937,0.53857,-0.7621,-0.35937,0.53857,-0.7621,-0.35937,0.53857,-0.7621,-0.35937,0.53857,-0.7621,-0.35937,0.53857,-0.7621,-0.35937,0.079639,0.88999,-0.44897,0.079639,0.88999,-0.44897,0.079639,0.88999,-0.44897,0.079639,0.88999,-0.44897,0.81259,0.57921,-0.064914,0.81259,0.57921,-0.064914,0.81259,0.57921,-0.064914,0.81259,0.57921,-0.064914,0.74253,-0.47376,0.47349,0.74253,-0.47376,0.47349,0.74253,-0.47376,0.47349,0.74253,-0.47376,0.47349,-0.079639,-0.88999,0.44897,-0.079639,-0.88999,0.44897,-0.079639,-0.88999,0.44897,-0.079639,-0.88999,0.44897,-0.81259,-0.57921,0.064914,-0.81259,-0.57921,0.064914,-0.81259,-0.57921,0.064914,-0.81259,-0.57921,0.064914,-0.74253,0.47376,-0.47349,-0.74253,0.47376,-0.47349,-0.74253,0.47376,-0.47349,-0.74253,0.47376,-0.47349,0.19768,0.64996,-0.73381,0.19768,0.64996,-0.73381,0.19768,0.64996,-0.73381,0.80643,0.58845,-0.058318,0.80643,0.58845,-0.058318,0.80643,0.58845,-0.058318,0.62345,0.03338,0.78115,0.62345,0.03338,0.78115,0.62345,0.03338,0.78115,-0.25212,-0.46701,0.84755,-0.25212,-0.46701,0.84755,-0.25212,-0.46701,0.84755,-0.89317,-0.41637,0.16995,-0.89317,-0.41637,0.16995,-0.89317,-0.41637,0.16995,-0.70163,0.17384,-0.69101,-0.70163,0.17384,-0.69101,-0.70163,0.17384,-0.69101,0.20332,-0.70389,-0.68059,0.20332,-0.70389,-0.68059,0.20332,-0.70389,-0.68059,0.20332,-0.70389,-0.68059,0.20332,-0.70389,-0.68059,0.20332,-0.70389,-0.68059,-0.71896,-0.47405,-0.50831,-0.71896,-0.47405,-0.50831,-0.71896,-0.47405,-0.50831,-0.71896,-0.47405,-0.50831,0.13497,-0.89409,-0.42707,0.13497,-0.89409,-0.42707,0.13497,-0.89409,-0.42707,0.13497,-0.89409,-0.42707,0.95803,-0.19775,0.20756,0.95803,-0.19775,0.20756,0.95803,-0.19775,0.20756,0.95803,-0.19775,0.20756,0.62953,0.63861,0.44256,0.62953,0.63861,0.44256,0.62953,0.63861,0.44256,0.62953,0.63861,0.44256,-0.097212,0.95257,0.28836,-0.097212,0.95257,0.28836,-0.097212,0.95257,0.28836,-0.097212,0.95257,0.28836,-0.8515,0.48552,-0.19803,-0.8515,0.48552,-0.19803,-0.8515,0.48552,-0.19803,-0.8515,0.48552,-0.19803,-0.61995,-0.76574,-0.17118,-0.61995,-0.76574,-0.17118,-0.61995,-0.76574,-0.17118,-0.61995,-0.76574,-0.17118,0.11831,-0.82267,-0.55608,0.11831,-0.82267,-0.55608,0.11831,-0.82267,-0.55608,0.11831,-0.82267,-0.55608,0.86719,-0.084445,-0.49077,0.86719,-0.084445,-0.49077,0.86719,-0.084445,-0.49077,0.86719,-0.084445,-0.49077,0.60563,0.78306,0.14153,0.60563,0.78306,0.14153,0.60563,0.78306,0.14153,0.60563,0.78306,0.14153,-0.12086,0.84304,0.5241,-0.12086,0.84304,0.5241,-0.12086,0.84304,0.5241,-0.12086,0.84304,0.5241,-0.8784,0.12123,0.46229,-0.8784,0.12123,0.46229,-0.8784,0.12123,0.46229,-0.8784,0.12123,0.46229,-0.72397,-0.5784,-0.37592,-0.72397,-0.5784,-0.37592,-0.72397,-0.5784,-0.37592,-0.72397,-0.5784,-0.37592,0.099322,-0.73723,-0.66831,0.099322,-0.73723,-0.66831,0.099322,-0.73723,-0.66831,0.099322,-0.73723,-0.66831,0.89788,-0.1901,-0.39707,0.89788,-0.1901,-0.39707,0.89788,-0.1901,-0.39707,0.89788,-0.1901,-0.39707,0.69973,0.6392,0.31905,0.69973,0.6392,0.31905,0.69973,0.6392,0.31905,0.69973,0.6392,0.31905,-0.11687,0.78581,0.60732,-0.11687,0.78581,0.60732,-0.11687,0.78581,0.60732,-0.11687,0.78581,0.60732,-0.90765,0.25683,0.33197,-0.90765,0.25683,0.33197,-0.90765,0.25683,0.33197,-0.90765,0.25683,0.33197,-0.47012,-0.87714,0.098009,-0.47012,-0.87714,0.098009,-0.47012,-0.87714,0.098009,-0.47012,-0.87714,0.098009,0.19866,-0.93583,-0.29112,0.19866,-0.93583,-0.29112,0.19866,-0.93583,-0.29112,0.19866,-0.93583,-0.29112,0.8532,-0.12589,-0.50617,0.8532,-0.12589,-0.50617,0.8532,-0.12589,-0.50617,0.8532,-0.12589,-0.50617,0.47013,0.87714,-0.09801,0.47013,0.87714,-0.09801,0.47013,0.87714,-0.09801,0.47013,0.87714,-0.09801,-0.19866,0.93583,0.29112,-0.19866,0.93583,0.29112,-0.19866,0.93583,0.29112,-0.19866,0.93583,0.29112,-0.8532,0.12589,0.50617,-0.8532,0.12589,0.50617,-0.8532,0.12589,0.50617,-0.8532,0.12589,0.50617,-0.63114,-0.59135,-0.50196,-0.63114,-0.59135,-0.50196,-0.63114,-0.59135,-0.50196,0.17111,-0.89444,-0.41315,0.17111,-0.89444,-0.41315,0.17111,-0.89444,-0.41315,0.90535,-0.42222,-0.045571,0.90535,-0.42222,-0.045571,0.90535,-0.42222,-0.045571,0.6216,0.69482,0.36172,0.6216,0.69482,0.36172,0.6216,0.69482,0.36172,-0.18577,0.94354,0.27428,-0.18577,0.94354,0.27428,-0.18577,0.94354,0.27428,-0.86744,0.48498,-0.11106,-0.86744,0.48498,-0.11106,-0.86744,0.48498,-0.11106,-0.1928,0.17181,-0.96608,-0.1928,0.17181,-0.96608,-0.1928,0.17181,-0.96608,-0.1928,0.17181,-0.96608,0.30781,-0.76226,-0.5694,0.30781,-0.76226,-0.5694,0.30781,-0.76226,-0.5694,0.30781,-0.76226,-0.5694,0.46541,-0.85175,0.24067,0.46541,-0.85175,0.24067,0.46541,-0.85175,0.24067,0.46541,-0.85175,0.24067,0.2294,-0.13286,0.96422,0.2294,-0.13286,0.96422,0.2294,-0.13286,0.96422,0.2294,-0.13286,0.96422,-0.27613,0.78813,0.5501,-0.27613,0.78813,0.5501,-0.27613,0.78813,0.5501,-0.27613,0.78813,0.5501,-0.42972,0.86815,-0.2483,-0.42972,0.86815,-0.2483,-0.42972,0.86815,-0.2483,-0.42972,0.86815,-0.2483,-0.63247,-0.60853,-0.47924,-0.63247,-0.60853,-0.47924,-0.63247,-0.60853,-0.47924,-0.63247,-0.60853,-0.47924,0.21928,-0.85492,-0.47013,0.21928,-0.85492,-0.47013,0.21928,-0.85492,-0.47013,0.21928,-0.85492,-0.47013,0.93791,-0.33537,-0.088639,0.93791,-0.33537,-0.088639,0.93791,-0.33537,-0.088639,0.93791,-0.33537,-0.088639,0.63651,0.65911,0.40054,0.63651,0.65911,0.40054,0.63651,0.65911,0.40054,0.63651,0.65911,0.40054,-0.17191,0.89734,0.40649,-0.17191,0.89734,0.40649,-0.17191,0.89734,0.40649,-0.17191,0.89734,0.40649,-0.89909,0.43638,0.034623,-0.89909,0.43638,0.034623,-0.89909,0.43638,0.034623,-0.89909,0.43638,0.034623,-0.4587,0.013928,-0.88848,-0.4587,0.013928,-0.88848,-0.4587,0.013928,-0.88848,0.3727,-0.57413,-0.72902,0.3727,-0.57413,-0.72902,0.3727,-0.57413,-0.72902,0.83432,-0.54765,0.063176,0.83432,-0.54765,0.063176,0.83432,-0.54765,0.063176,0.51083,0.10628,0.85309,0.51083,0.10628,0.85309,0.51083,0.10628,0.85309,-0.33544,0.67192,0.6603,-0.33544,0.67192,0.6603,-0.33544,0.67192,0.6603,-0.76719,0.63037,-0.11855,-0.76719,0.63037,-0.11855,-0.76719,0.63037,-0.11855,-0.72632,-0.6793,0.1049,-0.72632,-0.6793,0.1049,-0.72632,-0.6793,0.1049,-0.72632,-0.6793,0.1049,-0.72632,-0.6793,0.1049,-0.72632,-0.6793,0.1049,-0.34528,-0.93206,0.10978,-0.34528,-0.93206,0.10978,-0.34528,-0.93206,0.10978,-0.34528,-0.93206,0.10978,-0.075191,-0.76504,-0.63958,-0.075191,-0.76504,-0.63958,-0.075191,-0.76504,-0.63958,-0.075191,-0.76504,-0.63958,0.32653,0.33208,-0.88493,0.32653,0.33208,-0.88493,0.32653,0.33208,-0.88493,0.32653,0.33208,-0.88493,0.29518,0.94787,-0.12004,0.29518,0.94787,-0.12004,0.29518,0.94787,-0.12004,0.29518,0.94787,-0.12004,0.022421,0.78449,0.61974,0.022421,0.78449,0.61974,0.022421,0.78449,0.61974,0.022421,0.78449,0.61974,-0.38766,-0.29992,0.87164,-0.38766,-0.29992,0.87164,-0.38766,-0.29992,0.87164,-0.38766,-0.29992,0.87164,-0.19873,-0.97137,0.13016,-0.19873,-0.97137,0.13016,-0.19873,-0.97137,0.13016,-0.14599,-0.74246,-0.65379,-0.14599,-0.74246,-0.65379,-0.14599,-0.74246,-0.65379,0.053207,0.43897,-0.89693,0.053207,0.43897,-0.89693,0.053207,0.43897,-0.89693,0.13458,0.98136,-0.1372,0.13458,0.98136,-0.1372,0.13458,0.98136,-0.1372,0.073987,0.7675,0.63677,0.073987,0.7675,0.63677,0.073987,0.7675,0.63677,-0.13473,-0.41096,0.90164,-0.13473,-0.41096,0.90164,-0.13473,-0.41096,0.90164,0.83374,-0.4936,0.24746,0.83374,-0.4936,0.24746,0.83374,-0.4936,0.24746,0.83374,-0.4936,0.24746,0.83374,-0.4936,0.24746,0.83374,-0.4936,0.24746,-0.67461,-0.54506,-0.4978,-0.67461,-0.54506,-0.4978,-0.67461,-0.54506,-0.4978,0.14316,-0.89564,-0.42111,0.14316,-0.89564,-0.42111,0.14316,-0.89564,-0.42111,0.87953,-0.47082,-0.068877,0.87953,-0.47082,-0.068877,0.87953,-0.47082,-0.068877,0.6872,0.63454,0.35373,0.6872,0.63454,0.35373,0.6872,0.63454,0.35373,-0.10975,0.94869,0.29656,-0.10975,0.94869,0.29656,-0.10975,0.94869,0.29656,-0.82144,0.56657,-0.065066,-0.82144,0.56657,-0.065066,-0.82144,0.56657,-0.065066,-0.19471,-0.62327,0.75738,-0.19471,-0.62327,0.75738,-0.19471,-0.62327,0.75738,-0.19471,-0.62327,0.75738,-0.19471,-0.62327,0.75738,-0.19471,-0.62327,0.75738,-0.73198,-0.34816,-0.58565,-0.73198,-0.34816,-0.58565,-0.73198,-0.34816,-0.58565,-0.73198,-0.34816,-0.58565,-0.10318,-0.9787,-0.17748,-0.10318,-0.9787,-0.17748,-0.10318,-0.9787,-0.17748,-0.10318,-0.9787,-0.17748,0.50635,-0.80923,0.29791,0.50635,-0.80923,0.29791,0.50635,-0.80923,0.29791,0.50635,-0.80923,0.29791,0.73198,0.34816,0.58565,0.73198,0.34816,0.58565,0.73198,0.34816,0.58565,0.73198,0.34816,0.58565,0.10318,0.9787,0.17748,0.10318,0.9787,0.17748,0.10318,0.9787,0.17748,0.10318,0.9787,0.17748,-0.50635,0.80923,-0.29791,-0.50635,0.80923,-0.29791,-0.50635,0.80923,-0.29791,-0.50635,0.80923,-0.29791,-0.87641,-0.42312,-0.22995,-0.87641,-0.42312,-0.22995,-0.87641,-0.42312,-0.22995,-0.10009,-0.97752,-0.18556,-0.10009,-0.97752,-0.18556,-0.10009,-0.97752,-0.18556,0.66708,-0.73946,-0.090538,0.66708,-0.73946,-0.090538,0.66708,-0.73946,-0.090538,0.89841,0.43619,0.051027,0.89841,0.43619,0.051027,0.89841,0.43619,0.051027,0.14946,0.98738,0.052448,0.14946,0.98738,0.052448,0.14946,0.98738,0.052448,-0.61813,0.78365,-0.061694,-0.61813,0.78365,-0.061694,-0.61813,0.78365,-0.061694,-0.59333,-0.15696,0.78951,-0.59333,-0.15696,0.78951,-0.59333,-0.15696,0.78951,-0.59333,-0.15696,0.78951,-0.59333,-0.15696,0.78951,-0.59333,-0.15696,0.78951,0.85217,-0.52326,0.003774,0.85217,-0.52326,0.003774,0.85217,-0.52326,0.003774,0.85217,-0.52326,0.003774,0.07033,-0.88725,0.45589,0.07033,-0.88725,0.45589,0.07033,-0.88725,0.45589,0.07033,-0.88725,0.45589,-0.78892,-0.33564,0.51473,-0.78892,-0.33564,0.51473,-0.78892,-0.33564,0.51473,-0.78892,-0.33564,0.51473,-0.71027,0.70264,-0.042605,-0.71027,0.70264,-0.042605,-0.71027,0.70264,-0.042605,-0.71027,0.70264,-0.042605,-0.039294,0.93204,-0.36022,-0.039294,0.93204,-0.36022,-0.039294,0.93204,-0.36022,-0.039294,0.93204,-0.36022,0.82967,0.39894,-0.39051,0.82967,0.39894,-0.39051,0.82967,0.39894,-0.39051,0.82967,0.39894,-0.39051,0.66738,-0.64693,-0.3689,0.66738,-0.64693,-0.3689,0.66738,-0.64693,-0.3689,0.66738,-0.64693,-0.3689,0.40237,-0.79938,0.4462,0.40237,-0.79938,0.4462,0.40237,-0.79938,0.4462,0.40237,-0.79938,0.4462,-0.24482,-0.2183,0.94467,-0.24482,-0.2183,0.94467,-0.24482,-0.2183,0.94467,-0.24482,-0.2183,0.94467,-0.63655,0.67053,0.38105,-0.63655,0.67053,0.38105,-0.63655,0.67053,0.38105,-0.63655,0.67053,0.38105,-0.37961,0.82236,-0.42382,-0.37961,0.82236,-0.42382,-0.37961,0.82236,-0.42382,-0.37961,0.82236,-0.42382,0.26774,0.25822,-0.92824,0.26774,0.25822,-0.92824,0.26774,0.25822,-0.92824,0.26774,0.25822,-0.92824,0.86841,-0.40744,-0.2826,0.86841,-0.40744,-0.2826,0.86841,-0.40744,-0.2826,0.86841,-0.40744,-0.2826,0.48808,-0.70217,0.5184,0.48808,-0.70217,0.5184,0.48808,-0.70217,0.5184,0.48808,-0.70217,0.5184,-0.31733,-0.33286,0.88798,-0.31733,-0.33286,0.88798,-0.31733,-0.33286,0.88798,-0.31733,-0.33286,0.88798,-0.81881,0.4826,0.31089,-0.81881,0.4826,0.31089,-0.81881,0.4826,0.31089,-0.81881,0.4826,0.31089,-0.43642,0.75846,-0.48401,-0.43642,0.75846,-0.48401,-0.43642,0.75846,-0.48401,-0.43642,0.75846,-0.48401,0.3599,0.40258,-0.84167,0.3599,0.40258,-0.84167,0.3599,0.40258,-0.84167,0.3599,0.40258,-0.84167,0.3655,-0.81031,-0.45805,0.3655,-0.81031,-0.45805,0.3655,-0.81031,-0.45805,0.3655,-0.81031,-0.45805,0.16628,-0.93808,0.30392,0.16628,-0.93808,0.30392,0.16628,-0.93808,0.30392,0.16628,-0.93808,0.30392,-0.21964,-0.25409,0.94191,-0.21964,-0.25409,0.94191,-0.21964,-0.25409,0.94191,-0.21964,-0.25409,0.94191,-0.3655,0.81031,0.45805,-0.3655,0.81031,0.45805,-0.3655,0.81031,0.45805,-0.3655,0.81031,0.45805,-0.16628,0.93808,-0.30392,-0.16628,0.93807,-0.30392,-0.16628,0.93808,-0.30392,-0.16628,0.93807,-0.30392,0.21964,0.25409,-0.94191,0.21964,0.25409,-0.94191,0.21964,0.25409,-0.94191,0.21964,0.25409,-0.94191,0.89494,-0.42939,-0.12124,0.89494,-0.42939,-0.12124,0.89494,-0.42939,-0.12124,0.26863,-0.88722,0.37508,0.26863,-0.88722,0.37508,0.26863,-0.88722,0.37508,-0.5286,-0.57518,0.6243,-0.5286,-0.57518,0.6243,-0.5286,-0.57518,0.6243,-0.80127,0.55467,0.22431,-0.80127,0.55467,0.22431,-0.80127,0.55467,0.22431,-0.16428,0.94501,-0.2828,-0.16428,0.94501,-0.2828,-0.16428,0.94501,-0.2828,0.59893,0.63588,-0.48677,0.59893,0.63588,-0.48677,0.59893,0.63588,-0.48677,0.78547,0.28863,0.54748,0.78547,0.28863,0.54748,0.78547,0.28863,0.54748,0.78547,0.28863,0.54748,0.26792,-0.7657,0.58474,0.26792,-0.7657,0.58474,0.26792,-0.7657,0.58474,0.26792,-0.7657,0.58474,-0.38459,-0.91592,0.11482,-0.38459,-0.91592,0.11482,-0.38459,-0.91592,0.11482,-0.38459,-0.91592,0.11482,-0.81435,-0.25833,-0.51971,-0.81435,-0.25833,-0.51971,-0.81435,-0.25833,-0.51971,-0.81435,-0.25833,-0.51971,-0.27959,0.78784,-0.54877,-0.27959,0.78784,-0.54877,-0.27959,0.78784,-0.54877,-0.27959,0.78784,-0.54877,0.36519,0.92704,-0.085107,0.36519,0.92704,-0.085107,0.36519,0.92704,-0.085107,0.36519,0.92704,-0.085107,0.88224,-0.4495,-0.14003,0.88224,-0.4495,-0.14003,0.88224,-0.4495,-0.14003,0.88224,-0.4495,-0.14003,0.27046,-0.85094,0.45029,0.27046,-0.85094,0.45029,0.27046,-0.85094,0.45029,0.27046,-0.85094,0.45029,-0.53322,-0.49888,0.68322,-0.53322,-0.49888,0.68322,-0.53322,-0.49888,0.68322,-0.53322,-0.49888,0.68322,-0.83561,0.50987,0.20443,-0.83561,0.50987,0.20443,-0.83561,0.50987,0.20443,-0.83561,0.50987,0.20443,-0.26359,0.89057,-0.37067,-0.26359,0.89057,-0.37067,-0.26359,0.89057,-0.37067,-0.26359,0.89057,-0.37067,0.52988,0.58766,-0.61146,0.52988,0.58766,-0.61146,0.52988,0.58766,-0.61146,0.52988,0.58766,-0.61146,0.93508,0.18351,0.30324,0.93508,0.18351,0.30324,0.93508,0.18351,0.30324,0.3152,-0.57995,0.75121,0.3152,-0.57995,0.75121,0.3152,-0.57995,0.75121,-0.53787,-0.68347,0.49353,-0.53787,-0.68347,0.49353,-0.53787,-0.68347,0.49353,-0.96817,-0.07421,-0.23903,-0.96817,-0.07421,-0.23903,-0.96817,-0.07421,-0.23903,-0.30327,0.67495,-0.67266,-0.30327,0.67495,-0.67266,-0.30327,0.67495,-0.67266,0.52091,0.75047,-0.40675,0.52091,0.75047,-0.40675,0.52091,0.75047,-0.40675,0.52616,-0.5543,-0.6449,0.52616,-0.5543,-0.6449,0.52616,-0.5543,-0.6449,0.52616,-0.5543,-0.6449,0.52616,-0.5543,-0.6449,0.52616,-0.5543,-0.6449,0.27021,-0.88707,-0.37428,0.27021,-0.88707,-0.37428,0.27021,-0.88707,-0.37428,0.27021,-0.88707,-0.37428,0.6013,-0.70485,0.37633,0.6013,-0.70485,0.37633,0.6013,-0.70485,0.37633,0.6013,-0.70485,0.37633,0.36118,0.33611,0.86982,0.36118,0.33611,0.86982,0.36118,0.33611,0.86982,0.36118,0.33611,0.86982,-0.22751,0.9108,0.3445,-0.22751,0.9108,0.3445,-0.22751,0.9108,0.3445,-0.22751,0.9108,0.3445,-0.54928,0.73488,-0.3978,-0.54928,0.73488,-0.3978,-0.54928,0.73488,-0.3978,-0.54928,0.73488,-0.3978,-0.31346,-0.29119,-0.90385,-0.31346,-0.29119,-0.90385,-0.31346,-0.29119,-0.90385,-0.31346,-0.29119,-0.90385,0.15247,-0.94767,-0.28049,0.15247,-0.94767,-0.28049,0.15247,-0.94767,-0.28049,0.6626,-0.66847,0.33781,0.6626,-0.66847,0.33781,0.6626,-0.66847,0.33781,0.54084,0.49266,0.68175,0.54084,0.49266,0.68175,0.54084,0.49266,0.68175,-0.10241,0.96575,0.2384,-0.10241,0.96575,0.2384,-0.10241,0.96575,0.2384,-0.59863,0.70782,-0.37502,-0.59863,0.70782,-0.37502,-0.59863,0.70782,-0.37502,-0.49337,-0.45111,-0.7437,-0.49337,-0.45111,-0.7437,-0.49337,-0.45111,-0.7437,-0.6659,-0.64716,0.37116,-0.6659,-0.64716,0.37116,-0.6659,-0.64716,0.37116,-0.6659,-0.64716,0.37116,-0.6659,-0.64716,0.37116,-0.6659,-0.64716,0.37116,0.91564,-0.3714,-0.1538,0.91564,-0.3714,-0.1538,0.91564,-0.3714,-0.1538,0.29472,-0.8844,0.36191,0.29472,-0.8844,0.36191,0.29472,-0.8844,0.36191,-0.48999,-0.61316,0.61964,-0.48999,-0.61316,0.61964,-0.48999,-0.61316,0.61964,-0.83452,0.47717,0.27549,-0.83452,0.47717,0.27549,-0.83452,0.47717,0.27549,-0.23512,0.9401,-0.24682,-0.23512,0.9401,-0.24682,-0.23512,0.9401,-0.24682,0.52844,0.69848,-0.48258,0.52844,0.69848,-0.48258,0.52844,0.69848,-0.48258,-0.33045,-0.63677,-0.69665,-0.33045,-0.63677,-0.69665,-0.33045,-0.63677,-0.69665,-0.33045,-0.63677,-0.69665,-0.33045,-0.63677,-0.69665,-0.33045,-0.63677,-0.69665,0.98207,-0.14552,-0.11986,0.98207,-0.14552,-0.11986,0.98207,-0.14552,-0.11986,0.98207,-0.14552,-0.11986,0.30773,-0.95142,0.009813,0.30773,-0.95142,0.009813,0.30773,-0.95142,0.009813,0.30773,-0.95142,0.009813,-0.45298,-0.88531,0.10509,-0.45298,-0.88531,0.10509,-0.45298,-0.88531,0.10509,-0.45298,-0.88531,0.10509,-0.98207,0.14552,0.11986,-0.98207,0.14552,0.11986,-0.98207,0.14552,0.11986,-0.98207,0.14552,0.11986,-0.30772,0.95142,-0.009813,-0.30772,0.95142,-0.009813,-0.30772,0.95142,-0.009813,-0.30772,0.95142,-0.009813,0.45298,0.88531,-0.10509,0.45298,0.88531,-0.10509,0.45298,0.88531,-0.10509,0.45298,0.88531,-0.10509,0.84281,-0.22391,-0.48943,0.84281,-0.22391,-0.48943,0.84281,-0.22391,-0.48943,0.31122,-0.95017,0.017951,0.31122,-0.95017,0.017951,0.31122,-0.95017,0.017951,-0.30666,-0.82234,0.47929,-0.30666,-0.82234,0.47929,-0.30666,-0.82234,0.47929,-0.72981,0.24848,0.6369,-0.72981,0.24848,0.6369,-0.72981,0.24848,0.6369,-0.25131,0.96112,0.11442,-0.25131,0.96112,0.11442,-0.25131,0.96112,0.11442,0.37098,0.86401,-0.34039,0.37098,0.86401,-0.34039,0.37098,0.86401,-0.34039,-0.12807,-0.10046,-0.98666,-0.12807,-0.10046,-0.98666,-0.12807,-0.10046,-0.98666,-0.12807,-0.10046,-0.98666,-0.12807,-0.10046,-0.98666,-0.12807,-0.10046,-0.98666,-0.67772,-0.54539,0.4932,-0.67772,-0.54539,0.4932,-0.67772,-0.54539,0.4932,0.68733,-0.53389,0.49248,0.68733,-0.53389,0.49248,0.68733,-0.53389,0.49248,0.68733,-0.53389,0.49248,-0.25734,-0.96389,-0.068448,-0.25734,-0.96389,-0.068448,-0.25734,-0.96389,-0.068448,0.52064,0.15289,0.83998,0.52064,0.15289,0.83998,0.52064,0.15289,0.83998,-0.93053,0.23901,-0.27748,-0.93053,0.23901,-0.27748,-0.93053,0.23901,-0.27748,0.98273,0.068486,-0.17188,0.98273,0.068486,-0.17188,0.98273,0.068486,-0.17188,-0.47404,-0.11829,0.87252,-0.47404,-0.11829,0.87252,-0.47404,-0.11829,0.87252,0.84484,0.38419,0.37234,0.84484,0.38419,0.37234,0.84484,0.38419,0.37234,0.84484,0.38419,0.37234,0.36979,-0.03891,0.9283,0.36979,-0.03891,0.9283,0.36979,-0.03891,0.9283,0.36979,-0.03891,0.9283,-0.34629,-0.36312,0.865,-0.34629,-0.36312,0.865,-0.34629,-0.36312,0.865,-0.34629,-0.36312,0.865,-0.85384,-0.42919,0.29453,-0.85384,-0.42919,0.29453,-0.85384,-0.42919,0.29453,-0.85384,-0.42919,0.29453,-0.87092,-0.2113,-0.44367,-0.87092,-0.2113,-0.44367,-0.87092,-0.2113,-0.44367,-0.87092,-0.2113,-0.44367,-0.3861,0.16657,-0.90729,-0.3861,0.16657,-0.90729,-0.3861,0.16657,-0.90729,-0.3861,0.16657,-0.90729,-0.3861,0.16657,-0.90729,0.33357,0.51688,-0.7884,0.33357,0.51688,-0.7884,0.33357,0.51688,-0.7884,0.33357,0.51688,-0.7884,0.81166,0.54104,-0.22021,0.81166,0.54104,-0.22021,0.81166,0.54104,-0.22021,0.81166,0.54104,-0.22021,0.81166,0.54104,-0.22021,-0.89946,0.078168,-0.42996,-0.89946,0.078168,-0.42996,-0.89946,0.078168,-0.42996,-0.89946,0.078168,-0.42996,0.30913,0.92829,0.20669,0.30913,0.92829,0.20669,0.30913,0.92829,0.20669,0.25734,0.96389,0.068448,0.25734,0.96389,0.068448,0.25734,0.96389,0.068448,-0.30913,-0.92829,-0.20669,-0.30913,-0.92829,-0.20669,-0.30913,-0.92829,-0.20669,-0.29632,0.6869,0.6636,-0.29632,0.6869,0.6636,-0.29632,0.6869,0.6636,-0.44058,-0.8869,0.13892,-0.44058,-0.8869,0.13892,-0.44058,-0.8869,0.13892,-0.44058,-0.8869,0.13892,-0.34833,-0.74121,0.57383,-0.34833,-0.74121,0.57383,-0.34833,-0.74121,0.57383,-0.34833,-0.74121,0.57383,-0.43354,-0.86699,-0.2457,-0.43354,-0.86699,-0.2457,-0.43354,-0.86699,-0.2457,-0.43354,-0.86699,-0.2457,-0.15367,-0.20739,-0.96611,-0.15367,-0.20739,-0.96611,-0.15367,-0.20739,-0.96611,-0.15367,-0.20739,-0.96611,0.31484,0.75726,-0.57222,0.31484,0.75726,-0.57222,0.31484,0.75726,-0.57222,0.31484,0.75726,-0.57222,0.4031,0.88409,0.23642,0.4031,0.88409,0.23642,0.4031,0.88409,0.23642,0.4031,0.88409,0.23642,0.12166,0.24088,0.9629,0.12166,0.24088,0.9629,0.12166,0.24088,0.9629,0.12166,0.24088,0.9629,-0.58231,-0.56352,0.58597,-0.58231,-0.56352,0.58597,-0.58231,-0.56352,0.58597,-0.58231,-0.56352,0.58597,-0.54461,-0.79399,-0.27017,-0.54461,-0.79399,-0.27017,-0.54461,-0.79399,-0.27017,-0.54461,-0.79399,-0.27017,-0.051625,-0.3019,-0.95194,-0.051625,-0.3019,-0.95194,-0.051625,-0.3019,-0.95194,-0.051625,-0.3019,-0.95194,0.5189,0.62097,-0.58748,0.5189,0.62097,-0.58748,0.5189,0.62097,-0.58748,0.5189,0.62097,-0.58748,0.48158,0.83594,0.26323,0.48158,0.83594,0.26323,0.48158,0.83594,0.26323,0.48158,0.83594,0.26323,-0.014491,0.35995,0.93286,-0.014491,0.35995,0.93286,-0.014491,0.35995,0.93286,-0.014491,0.35994,0.93286,-0.036287,-0.84279,0.53702,-0.036287,-0.84279,0.53702,-0.036287,-0.84279,0.53702,-0.036287,-0.84279,0.53702,0.03624,0.84279,-0.53702,0.03624,0.84279,-0.53702,0.03624,0.84279,-0.53702,0.03624,0.84279,-0.53702,0.03624,0.84279,-0.53702,0.17066,0.24828,0.95354,0.17066,0.24828,0.95354,0.17066,0.24828,0.95354,0.17066,0.24828,0.95354,-0.28028,-0.92756,-0.24715,-0.28028,-0.92756,-0.24715,-0.28028,-0.92756,-0.24715,0.28406,-0.48932,-0.82455,0.28406,-0.48932,-0.82455,0.28406,-0.48932,-0.82455,0.52079,0.70526,-0.48103,0.52079,0.70526,-0.48103,0.52079,0.70526,-0.48103,0.16193,0.96059,0.22594,0.16193,0.96059,0.22594,0.16193,0.96059,0.22594,0.16193,0.96059,0.22594,0.16193,0.96059,0.22594,-0.41924,0.53191,0.73574,-0.41924,0.53191,0.73574,-0.41924,0.53191,0.73574,0.34678,-0.63222,-0.69285,0.34678,-0.63222,-0.69285,0.34678,-0.63222,-0.69285,0.34678,-0.63222,-0.69285,0.092891,0.91093,0.40197,0.092891,0.91093,0.40197,0.092891,0.91093,0.40197,0.092891,0.91093,0.40197,0.6816,0.52746,-0.50716,0.6816,0.52746,-0.50716,0.6816,0.52746,-0.50716,0.6816,0.52746,-0.50716,-0.97715,-0.098512,0.18832,-0.97715,-0.098512,0.18832,-0.97715,-0.098512,0.18832,-0.97715,-0.098512,0.18832,-0.28738,-0.92798,-0.23722,-0.28738,-0.92798,-0.23722,-0.28738,-0.92798,-0.23722,-0.17066,-0.24828,-0.95354,-0.17066,-0.24828,-0.95354,-0.17066,-0.24828,-0.95354,-0.17066,-0.24828,-0.95354,0.52848,0.68368,-0.50328,0.52848,0.68368,-0.50328,0.52848,0.68368,-0.50328,0.15076,0.96637,0.20833,0.15076,0.96637,0.20833,0.15076,0.96637,0.20833,0.90787,-0.055859,0.41551,0.90787,-0.055859,0.41551,0.90787,-0.055859,0.41551,0.90787,-0.055859,0.41551,-0.3316,0.60899,0.72054,-0.3316,0.60899,0.72054,-0.3316,0.60899,0.72054,-0.87111,0.26274,-0.41489,-0.87111,0.26274,-0.41489,-0.87111,0.26274,-0.41489,-0.87111,0.26274,-0.41489,0.66046,-0.26147,0.70387,0.66046,-0.26147,0.70387,0.66046,-0.26147,0.70387,0.66046,-0.26147,0.70387,0.66046,-0.26147,0.70387,-0.28163,-0.92809,-0.2436,-0.28163,-0.92809,-0.2436,-0.28163,-0.92809,-0.2436,-0.96332,-0.058697,-0.26186,-0.96332,-0.058697,-0.26186,-0.96332,-0.058697,-0.26186,-0.96332,-0.058697,-0.26186,-0.61703,-0.58223,0.52941,-0.61703,-0.58223,0.52941,-0.61703,-0.58223,0.52941,-0.30479,0.60495,0.73562,-0.30479,0.60495,0.73562,-0.30479,0.60495,0.73562,-0.16211,-0.96054,-0.22601,-0.16211,-0.96054,-0.22601,-0.16211,-0.96054,-0.22601,-0.16211,-0.96054,-0.22601,-0.16211,-0.96054,-0.22601,0.1508,0.96637,0.20828,0.1508,0.96637,0.20828,0.1508,0.96637,0.20828,-0.41924,0.5319,0.73574,-0.41924,0.5319,0.73574,-0.41924,0.5319,0.73574,0.22423,0.92236,0.3146,0.22423,0.92236,0.3146,0.22423,0.92236,0.3146],

    "colors": [],

    "uvs": [[0.13137,0.23767,0.4375,0.03658,0.086658,0.29125,0.46148,0.080159,0.35767,0.2057,0.32384,0.25911,0.22053,0.061206,0.99908,0.51781,0.12918,0.21338,0.27352,0.19478,0.22259,0.78974,0.4641,0.4062,0.88097,0.51849,0.45184,0.38366,0.061173,0.003497,0.65534,0.45484,0.021411,0.56792,0.88416,0.48328,0.76848,0.55759,0.6612,0.46914,0.10459,0.7711,0.78218,0.38998,0.72401,0.25659,0.72799,0.26541,0.77292,0.57959,0.47338,0.036306,0.25448,0.80906,0.38001,0.28589,0.13721,0.11754,0.79424,0.8949,0.78861,0.90908,0,0.38757,0.49075,0.23449,0.22704,0.24848,0.93674,0.85233,0.93327,0.84345,0.12918,0.095772,0.97252,0.58715,0.89624,0.97987,0.84414,0.25861,0.69035,0.2925,0,0.56506,0.6395,0.41386,0.30799,0.14553,0.66932,0.60029,0.51894,0.45615,0.30498,0.13128,0.33414,0.32344,0.93769,0.85848,0.40655,0.050629,0.93973,0.8722,0.31494,0.19478,0.3738,0.23732,0.34338,0.29313,0.10776,0.57505,0.32384,0.19938,0.77691,0.42783,0,0.12704,0.32541,0.17421,0.26353,0.05888,0.22704,0.05871,0.31351,0.070224,0.4375,0.10849,0.42502,0.32344,0.96136,0.73082,0.38421,0.14978,0.53348,0.40626,0.30821,0.081825,0.28643,0.07045,0.22704,0.18851,7.1e-05,0.11814,0.011217,0.036103,0.88484,0.54314,0.38001,0.058827,0.2729,0.15482,0.22053,0.039244,0.51913,0.37738,0.38258,0.079055,0.997,0.73119,0.029315,0.006545,0.029686,0.029954,0.00198,0.70142,0.03064,0.70051,0.001927,0.65973,0.11609,0.12684,0.037841,0.094656,0.81395,0.50829,0.96637,0.60934,0.95667,0.589,0.013868,0.66723,0.81546,0.47643,0,0.054985,0.97506,0.60896,0.031721,0.64146,0.4375,0.080375,0.41103,0.059123,0.91243,0.60925,0.38001,0.12823,0.25428,0.16229,0.12918,0.27906,0.17038,0.25082,0.16607,0.27058,0.96531,0.4507,0.10269,0.40395,0.09109,0.406,0.12058,0.40679,0.018236,0.57042,0.40468,0.072579,0.00299,0.57069,0.29035,0.024815,0.42244,0.3091,0.33635,0.46914,0.51279,0.45605,0.27718,0.081825,0.29169,0.020414,0.45673,0.21876,0.28333,0.077473,0.995,0.15453,0.50916,0.46424,0.32384,0.11778,0.080191,0.039763,0.35972,0.1461,0.45675,0.20985,0.96669,0.61898,0.63308,0.83097,0.63671,0.81671,0.7669,0.81903,0.7674,0.80815,0.43754,0.086523,0.12918,0.061206,0.52539,0.36072,0.84993,0.51544,0.27013,0.065028,0.10687,0.7968,0.82162,0.0086,0.96267,0.25641,0.96263,0.26541,0.18183,0.18889,0.49033,0.60752,0.49105,0.58746,0.00495,0.32017,0.45246,0.36578,0.45269,0.048499,0.27834,0.60401,0.32384,0.13978,0.76072,0.85528,0.030972,0.054106,0.17357,0.84671,0.8728,0.003407,0.040004,0.038902,0.17353,0.84192,0.096023,0.054985,0.77824,0.013134,0.14922,0.84489,0.44086,0.057356,0.45908,0.056697,0.32384,0.14602,0.90798,0.59572,0.87008,0.59438,0.76065,0.86145,0.77436,0.02096,0.74374,0.014216,0.38001,0.10544,0.28491,0.031163,0.042842,0.073271,0.31247,0.05888,0.31484,0.030553,0.005574,0.50079,0.386,0.12208,0.48817,0.086782,0.78159,0.035073,0.084942,0.40663,0.85048,0.52144,0.28255,0.24821,0.33169,0.12393,0.64568,0.88173,0.052655,0.28123,0.044114,0.25437,0.99974,0.8954,0.051477,0.23567,0.94588,0.85854,0.6447,0.88812,0.2458,0.20093,0.48153,0.097069,0.12241,0.29075,0.006678,0.27472,0.087527,0.31721,0.51679,0.053616,0.52674,0.045506,0.48153,0.045687,0.26096,0.037847,0.99751,0.90984,0.95014,0.88812,0.38024,0.012534,0.34632,0.090959,0.44139,0.003684,0.95041,0.32344,0.95041,0.3142,0.14323,0.087574,0.11025,0.3227,0.34726,0.069642,0.593,0.85428,0.47538,0.11463,0.38001,0.023946,0.52431,0.84964,0.28742,0.011782,0.28351,0.002104,0.44105,0.030157,0.67865,0.020924,0.68413,0.012901,0.74913,0.000748,0.31107,0.004954,0.71821,0.020573,0.44569,0.38883,0.74374,0.006985,0.97681,0.2409,0.77787,0.006038,0.86949,0.83377,0.86905,0.82761,0.62056,0.7777,0.62693,0.79011,0.80566,0.45524,0.4375,0.019631,0.80168,0.46914,0.99525,0.31996,0.89018,0.33596,0.81633,0.3095,0.4428,0.37519,0.32518,0.29204,0.32799,0.3057,0.4375,0.013482,0.71581,0.25407,0.47312,0.026352,0.4301,0.09929,0.42622,0.085203,0.71358,0.26541,0.19055,0.5884,0.22704,0.31353,0.61201,0.25428,0.61208,0.26028,0.95925,0.2255,0.36421,0.13987,0.60962,0.021905,0.23542,0.32344,0.48334,0.12244,0.086137,0.44828,0.60962,0.03115,0.53999,0.37339,0.64937,0.025332,0.31239,0.043748,0.86332,0.96129,0.64373,0.6036,0.7263,0.52172,0.35742,0.40626,0.89008,0.34677,0.98613,0.39504,0.78651,0.33681,0.89752,0.017202,0.97962,0.40626,0.87189,0.96417,0.64695,0.92668,0.21201,0.22826,0.077336,0.28123,0.71968,0.54848,0.2337,0.011782,0.8845,0.39526,0.53963,0.38419,0.78591,0.3428,0.83234,0.96398,0.22704,0.001507,0.96499,0.51771,0.74467,0.083798,0.34493,0.96386,0.74356,0.077825,0.46708,0.10249,0.88267,0.40121,0.46808,0.091424,0.007341,0.86258,0.23106,0.39299,0.80296,0.079471,0.014041,0.86253,0.0138,0.88702,0.34596,0.97779,0.64846,0.16195,0.65638,0.28589,0.23567,0.37193,0.86074,0.64926,0.32384,0.20553,0.64856,0.91599,0.11282,0.082788,0.8647,0.66316,0.64872,0.15596,0.65657,0.27508,0.10906,0.094656,0.69201,1,0.48332,0.18338,0.38885,0.20035,0.48336,0.1942,0.048991,0.083517,0,0.067122,0.000705,0.061134,0.6938,0.98614,0.38001,0.18681,0.38058,0.1928,0.11926,0.065611,0.60962,0.083798,0.60972,0.077802,0.60156,0.52322,0.86387,0.14668,0.67043,0.081889,0.54355,0.65275,0.53097,0.15844,0.86502,0.14071,0.21037,0.71227,0.24233,0.73271,0.2065,0.9669,0.10532,0.17904,0.96751,0.66982,0.56105,0.99009,0.56301,0.97939,0.46429,0.95783,0.13124,0.75024,0.13168,0.76495,0.53075,0.59342,0.63046,0.73854,0.41823,0.012496,0.63038,0.73237,0.53128,0.58743,0.74436,0.76495,0.74337,0.75857,0.79561,0.73071,0.38001,0.2409,0.97479,0.67957,0.2275,0.32959,0.57511,0.97595,0.21658,0.35853,0.38018,0.22696,0.46415,0.95152,0.96523,0.20068,0.96317,0.20662,0.86763,0.20105,0.12076,0.52469,0.11336,0.5168,0.10283,0.51926,0.53937,0.82079,0.099698,0.52961,0.10709,0.5375,0.13045,0.35177,0.53905,0.83377,0.067054,0.030813,0.053109,0.030831,0.046153,0.042917,0.54097,0.64734,0.053141,0.054985,0.067086,0.054966,0.074043,0.04288,0.49956,0.67368,0.86542,0.077876,0.47814,0.24079,0.45542,0.77478,0.45385,0.7808,0.86354,0.083798,0.80911,0.078435,0.64985,0.27327,0.11762,0.53504,0,0.14398,0.65023,0.28408,0.22025,0.29736,0.5811,0.97595,0.58411,0.97076,0.22089,0.28521,0.79167,0.42571,0.59877,0.03341,0.60003,0.50829,0.55491,0.1407,0.55568,0.14668,0.4375,0.14636,0.80277,0.44185,0.59894,0.047597,0.58111,0.96557,0.65487,0.15595,0.3537,0.91221,0.76277,0.097069,0.65675,0.16195,0.59903,0.053593,0.75385,0.15926,0.9835,0.12244,0.53823,0.051423,0.57511,0.96556,0.76279,0.091073,0.82354,0.094301,0.73421,0.04125,0.80246,0.065688,0.89463,0.50829,0.57211,0.97075,0.80162,0.071654,0.74557,0.066237,0.82969,0.095956,0.42954,0.15593,0.48418,0.58836,0.4811,0.60041,0.98321,0.11645,0.37113,0.59833,0.3707,0.60752,0.001434,0.13319,0.22704,0.1221,0.2273,0.11032,0.31354,0.12291,0.92266,0.12238,0.88937,0.97907,0.10278,0.14266,0.88387,0.98146,0.88319,0.98742,0.88801,0.99099,0.10431,0.13668,0.43136,0.16165,0.12918,0.36578,0.11097,0.15013,0.35283,0.92398,0.31211,0.11325,0.66829,0.10323,0.77278,0.12947,0.82982,0.08996,0.77415,0.13455,0.69216,0.13139,0.4375,0.1681,0.4375,0.16195,0.43776,0.15282,0.46461,0.91451,0.12918,0.46094,0.52482,0.16182,0.5245,0.15675,0.46346,0.92363,0.78774,0.030062,0.67444,0.10829,0.78915,0.035073,0.84115,0.030327,0.92708,0.14551,0.89351,0.9886,0.38001,0.1717,0.38238,0.17724,0.89419,0.98264,0.66295,0.015756,0.43766,0.17724,0.68612,0.12244,0.13008,0.45185,0.080191,0.022721,0.68629,0.11737,0.086019,0.032958,0.48153,0.11648,0.58685,0.12052,0.018335,0.44016,0.57865,0.11718,0.013953,0.43762,0.009561,0.44014,0.009551,0.44521,0.013933,0.44775,0.018325,0.44522,0.097798,0.03303,0.10375,0.022865,0.31483,0.25463,0.11363,0.4395,0.67939,0.033052,0.66431,0.009822,0.25593,0.76495,0.24848,0.74715,0.10856,0.4395,0.60962,0.009964,0.67865,0.071654,0.36235,0.72914,0.36205,0.71672,0.89314,0.50248,0.097923,0.012627,0.67866,0.065657,0.47027,0.76108,0.47187,0.75202,0,0.5375,0.88061,0.097069,0.88179,0.091097,0.94239,0.49611,0.9932,0.83993,0.086144,0.012555,0.27737,0.001801,0.59374,0.47856,0.53003,0.095536,0.90194,0.99426,0.77981,0.40429,0.89314,0.48276,0.68739,0.39551,0.99131,0.95869,0.60381,0.25361,0.60067,0.26541,0.12931,0.42071,0.10602,0.44388,0.20831,0.11493,0.20263,0.096486,0.68739,0.38147,0.10855,0.44827,0.12918,0.4155,0.68846,0.37233,0.99281,0.9704,0.77419,0.37896,0.11361,0.44828,0.11615,0.44389,0.89362,0.4777,0.7754,0.37389,0.3177,0.26828,0.95303,0.23177,0.67989,0.1942,0.22578,0.44185,0.22488,0.43648,0.58483,0.21739,0.9531,0.2409,0.26873,0.41241,0.87468,0.96757,0.20943,0.004788,0.86549,0.23394,0.4834,0.76248,0.47802,0.752,0.86506,0.23901,0.98285,0.27411,0.67865,0.006752,0.58521,0.20561,0.20785,0.9777,0.73942,0.068684,0.1079,0.9937,0.78321,0.10324,0.13242,0.030325,0.78833,0.38169,0.79002,0.37207,0.53823,0.097069,0.68344,0.18455,0.77814,0.12244,0.21098,0.014425,0.77639,0.11742,0.69449,0.12222,0.80411,0.042125,0.66083,0.21876,0.58727,0.061791,0.10741,1,0.76382,0.22952,0.76585,0.2409,0.76245,0.20662,0.7803,0.13455,0.98704,0.21279,0.58488,0.85742,0.92511,0.71274,0.92496,0.72355,0.55198,0.72608,0.66277,0.20919,0.55226,0.71512,0.98266,0.28589,0.58686,0.86805,0.98895,0.41627,0.001736,0.94257,0.6229,0.76495,0.62423,0.75986,0.85772,0.14162,0.85627,0.14668,0.77388,0.14351,0.10313,0.10285,0.57236,0.55781,0.92285,0.078734,0.1032,0.11199,0.48951,0.19415,0.48969,0.18502,0.53982,0.091996,0.87599,0.3797,0.62062,0.094193,0.80412,0.04719,0.85545,0.044557,0.89699,0.035073,0.89694,0.030008,0.36891,0.004777,0.64589,0.41963,0.64565,0.41364,0.76488,0.41648,0.58749,0.067784,0.53858,0.06361,0.53823,0.069625,0.77405,0.2409,0.77418,0.22912,0.58079,0.10322,0,0.92871,0.13983,0.93242,0.13793,0.9217,0.23692,0.90058,0.23709,0.89426,0.93323,0.14668,0.93474,0.1407,0.99306,0.14463,0.99449,0.70613,0.29555,0.64622,0.30251,0.65831,0.9992,0.6983,0.57365,0.56685,0.21652,0.69315,0.21681,0.70613,0.66726,0.14668,0.667,0.14161,0.36965,0.009812,0.32384,0.009537,0.76774,0.14291,0.001773,0.83991,0,0.85377,0.13274,0.84966,0.1308,0.86037,0.92064,0.55849,0.99477,0.69031,0.40056,0.41551,0.22954,0.8818,0.22969,0.88812,0.39163,0.44185,0.85891,0.24078,0.98564,0.69015,0.98094,0.69797,0.98536,0.70596,0.78774,0.021864,0.90471,0.57959,0.85377,0.23109,0.48103,0.24705,0.48075,0.26541,0.28449,0.5858,0.28485,0.591,0.5813,0.10829,0.48153,0.10532,0.90934,0.13455,0.90943,0.12948,0.341,0.84227,0.96071,0.13293,0.87332,0.39158,0.34169,0.84838,0.33182,0.33481,0.93847,0.89586,0.54772,0.93725,0.91518,0.18821,0.33854,0.34496,0.29558,0.22433,0.80497,0.059509,0.93478,0.90984,0.80039,0.89893,0.80519,0.054448,0.85636,0.059227,0.54813,0.94257,0.52541,0.020065,0.89509,0.17137,0.2887,0.23646,0.29577,0.24848,0.52556,0.025128,0.30971,0.24838,0.31659,0.23625,0.90953,0.05447,0.80043,0.90974,0.78607,0.28589,0.30952,0.22422,0.97502,0.066617,0.7858,0.27508,0.59535,0.51827,0.66791,0.039348,0.66902,0.045321,0.60962,0.043709,0.59541,0.52348,0.89557,0.17643,0.49877,0.54307,0.91721,0.30648,0.9729,0.078049,0.97298,0.083114,0.87447,0.39651,0.92989,0.07872,0.92908,0.083798,0.83276,0.40102,0.34202,0.37433,0.27117,0.47529,0.97429,0.071654,0.23365,0.36036,0.91348,0.1942,0.42263,0.30296,0.9212,0.29499,0.66085,0.14668,0.76174,0.16195,0.65885,0.14071,0.92697,0.06686,0.78417,0.10829,0.75999,0.15598,0.82269,0.31263,0.73398,0.10712,0.42244,0.29215,0.34473,0.38801,0.446,0.33734,0.49808,0.54848,0.4537,0.52101,0.9174,0.354,0.70178,0.30953,0.072507,0.024664,0.70573,0.32344,0.91745,0.36578,0.66563,0.17124,0.57049,0.31246,0.27054,0.50109,0.54411,0.69178,0.54738,0.70613,0.40956,0.67983,0.57065,0.32327,0.6658,0.17724,0.94505,0.72969,0.44626,0.34889,0.82248,0.32344,0.66892,0.21876,0.40978,0.69072,0.54661,0.17284,0.30926,0.69653,0.62882,0.097069,0.30865,0.70267,0.62894,0.091074,0.67232,0.17125,0.67194,0.17724,0.78972,0.1771,0.57372,0.96052,0.57892,0.96351,0.85755,0.60934,0.12918,0.57829,0.13272,0.56401,0.68963,0.095246,0.77893,0.34888,0.48153,0.13455,0.48355,0.12859,0.99741,0.17124,0.67424,0.20918,0.85238,0.26541,0.85234,0.25628,0.58527,0.13455,0.58589,0.12949,0.68602,0.1337,0.593,0.84728,0.26292,0.56551,0.42991,0.63981,0.78196,0.12861,0.84016,0.13404,0.12918,0.15073,0.58411,0.9605,0.58409,0.95451,0.5789,0.95152,0.77976,0.35967,0.92058,0.066594,0.57912,0.13348,0.92082,0.071654,0.86943,0.071566,0.84941,0.016954,0.32384,0.032847,0.84934,0.022019,0.79133,0.10324,0.90915,0.042171,0.79032,0.10829,0.8365,0.10696,0.84036,0.66931,0.26335,0.55463,0.12924,0.52164,0.12918,0.51547,0.59355,0.84129,0.24303,0.54848,0.098565,0.32885,0.099871,0.41294,0.57371,0.95453,0.11849,0.48468,0.98451,0.1942,0.78634,0.12244,0.98303,0.18821,0.92133,0.19185,0.80492,0.4769,0.80781,0.49054,0.8648,0.67995,0.49766,0.078584,0.50315,0.069267,0.49782,0.059857,0.3656,0.57959,0.48701,0.059765,0.48153,0.069082,0.36512,0.57344,0.48685,0.078491,0.097032,0.45443,0.10047,0.46794,0.98757,0.64807,0,0.48046,0.10102,0.34258,0.13045,0.65121,0.12918,0.6573,0.0022,0.34739,0,0.35935,0.67778,0.62229,0.48153,0.013108,0.008833,0.48997,0.55353,0.70577,0.90436,0.59052,0.11547,0.47952,0.10954,0.47958,0.97747,0.37547,0.97956,0.38684,0.10662,0.48481,0.55358,0.6996,0.98859,0.654,0.56183,0.14517,0.73713,0.077808,0.10964,0.48997,0.11557,0.4899,0.73741,0.083798,0.66847,0.67887,0.67657,0.083702,0.98305,0.71319,0.98356,0.71916,0.99979,0.44143,0.63433,0.80161,0.63308,0.79087,0.79191,0.41956,0.99953,0.42749,0.75538,0.78505,0.75554,0.779,0.7792,0.33121,0.24182,0.39546,0.22704,0.13111,0.77324,0.34274,0.65343,0.33171,0.90914,0.35497,0.87189,0.80201,0.52255,0.62613,0.52142,0.63688,0.23241,0.14867,0.65371,0.34252,0.40035,0.61572,0.95097,0.096185,0.48577,0.032588,0.95324,0.09019,0.40058,0.62177,0.9092,0.36578,0.28449,0.64007,0.48153,0.039358,0.52495,0.008132,0.59306,0.003982,0.99417,0.097069,0.73636,0.053725,0.73466,0.059509,0.99468,0.091264,0.94482,0.091107,0.94395,0.097069,0.60962,0.051469,0.60962,0.057466,0.67038,0.054531,0.80706,0.1882,0.75662,0.091079,0.75634,0.097069,0.81196,0.29579,0.52566,0.013916,0.55621,0.99245,0.5563,0.99696,0.90193,0.12859,0.90319,0.13455,0.88793,0.091363,0.83029,0.96129,0.83025,0.96379,0.87804,0.80201,0.33019,0.097107,0.6099,0.071654,0.69578,0.091286,0.001411,0.22635,0.59033,0.019217,0.55265,0.42326,0.84631,0.13368,0.004815,0.43836,0.007306,0.43814,0.88487,0.77193,0.99547,0.79999,0.352,0.1175,0.60962,0.065664,0.67046,0.065768,0.11089,0.24055,0.27788,0.017931,0.11052,0.23456,0.80982,0.065689,0.59019,0.025212,0,0.22052,0.87424,0.54558,0.87482,0.53978,0.51301,0.99409,0.79882,0.053588,0.51283,0.99659,0.27958,0.48624,0.47058,0.50598,0.8086,0.071654,0.86328,0.070239,0.37791,0.70477,0.007501,0.43767,0.32514,0.70477,0.81954,0.54302,0.36242,0.041425,0.82022,0.53853,0.9054,0.59147,0.55328,0.42905,0.495,0.42659,0.49572,0.43107,0.004396,0.43762,0.8558,0.12244,0.81349,0.30173,0.32039,0.47558,0.32403,0.061444,0.5798,0.56336,0.36959,0.047805,0.36931,0.020933,0.45731,0.63916,0.87699,0.59016,0.87389,0.59031,0.32588,0.015961,0.37784,0.70576,0.32518,0.70525,0.32384,0.040568,0.32554,0.046027,0.32043,0.48009,0.75573,0.29235,0.48738,0.63946,0.32384,0.05545,0.74456,0.04719,0.74374,0.041221,0.79797,0.042031,0.27732,0.47723,0.89632,0.34677,0.27757,0.47972,0.32384,0.021637,0.89768,0.34079,0.22451,0.84192,0.95198,0.34033,0.40532,0.70576,0.45997,0.63947,0.75594,0.29689,0.18876,0.64846,0.73979,0.83305,0.046153,0.02421,0.44755,0.53554,0.89079,0.029028,0.88952,0.035073,0.94274,0.75522,0.18832,0.64622,0.21306,0.64661,0.95207,0.33579,0.45792,0.6395,0.48741,0.63895,0.40525,0.70477,0.46001,0.63898,0.73982,0.8333,0.84934,0.028745,0.85088,0.034576,0.38459,0.050629,0.39246,0.030095,0.38001,0.030095,0.99691,0.16195,0.96715,0.16188,0.12303,0.67134,0.12203,0.63569,0.095534,0.6115,0.22704,0.10362,0.05906,0.61293,0.033973,0.63915,0.03497,0.67479,0.07627,0.70613,0.099686,0.70559,0.87442,0.589,0.87691,0.58947,0.22708,0.10105,0.22482,0.84442,0.43196,0.63895,0.27503,0.092684,0.27545,0.090023,0.42924,0,0.17594,0.84355,0.99596,0.30391,0.99596,0.30648,0.35255,0.70556,0.42922,0.002509,0.80493,0.96221,0.27551,0.090759,0.35051,0.70524,0.94918,0.2923,0.94957,0.29496,0.92735,0.30634,0.94934,0.29384,0.51275,0.63938,0.92735,0.30634,0.37996,0.70502,0.48533,0.63895,0.58578,0.57762,0.64695,0.90984,0.66281,0.23681,0.77044,0.84092,0.76687,0.84996,0.98526,0.21876,0.88777,0.21411,0.3146,0.65401,0.67547,0.63667,0.30865,0.6683,0.85903,0.61754,0.86872,0.64007,0.33834,0.45556,0.34282,0.45116,0.89991,0.022596,0.92849,0.017253,0.42862,0.51812,0.70192,0.40626,0.86394,0.59534,0.52946,0.4672,0.81611,0.32344,0.71393,0.30918,0.71569,0.3206,0.961,0.15597,0.9606,0.16195,0.86531,0.15626,0.9047,0.589,0.87904,0.59137,0.76236,0.21876,0.7631,0.21277,0.88162,0.21791,0.53941,0.018026,0.53823,0.023997,0.049326,0.21475,0.99705,0.17724,0.90172,0.17215,0.34599,0.94001,0.34668,0.9339,0.53823,0.077823,0.53973,0.083798,0.60142,0.079851,0.87837,0.010806,0.84934,0.010182,0.80774,0.1942,0.68959,0.19218,0.69995,0.95254,0.70058,0.95005,0.7249,0.9517,0.79167,0.41356,0.89089,0.4165,0.77801,0.027108,0.74374,0.034202,0.29698,0.10418,0.29698,0.10418,0.24207,0.5421,0.29442,0.51444,0.59906,0.039399,0.53823,0.039373,0.85571,0.11644,0.91651,0.1185,0.014081,0.59428,0.008553,0.59279,0.66942,0.67249,0.72125,0.70613,0.88699,0.50824,0.99281,0.98713,0.67615,0.35985,0.67715,0.36578,0.88965,0.28142,0.89004,0.27542,0.81594,0.19071,0.47099,0.02,0.71141,0.84813,0.71046,0.84213,0.75475,0.21701,0.75621,0.21197,0.27488,0.41574,0.2786,0.42857,0.6777,0.33631,0.67615,0.34234,0.23684,0.36578,0.48255,0.22945,0.87142,0.65761,0.87094,0.66367,0.67865,0.027072,0.73286,0.028629,0.35087,0.39601,0.24593,0.40626,0.99491,0.34535,0.99466,0.34279,0.89996,0.27383,0.89619,0.28339,0.36809,0.13205,0.99991,0.25884,0.90981,0.44185,0.90533,0.43054,0.9934,0.35478,0.99705,0.36439,0.85711,0.15772,0.12943,0.006536,0.12918,0.011599,0.042285,0.69484,0,0.63034,0.007472,0.61148,0.12918,0.039243,0.18067,0.059936,0.18067,0.045324,0.12918,0.069498,0.20345,0.080542,0.1504,0.069404,0.47601,0.99636,0.47695,0.99245,0.51078,0.99561,0.7573,0.84813,0.7525,0.84007,0.71756,0.84731,0.20578,0.19719,0.14485,0.23152,0.13519,0.19504,0.082548,0.37487,0.014325,0.40679,0.025695,0.3655,0.19021,0.62069,0.23564,0.64007,0.24792,0.58574,0.12918,0.60839,0.13878,0.63431,0,0.17014,0.00025,0.20239,0.049111,0.17541,0.11065,0.54365,0.061092,0.60533,0.027825,0.54604,0.002838,0.54391,0.13451,0.15688,0.12918,0.18831,0.21736,0.15828,0,0.81058,0.000975,0.83377,0.1702,0.79086,0.16853,0.82327,0.24833,0.81033,0.21703,0.82792,0,0.28833,0.080509,0.30384,0.072136,0.3227,0.048909,0.28738,0.9888,0.91781,0.98752,0.94257,0.89155,0.92067,0.90525,0.94239,0.13567,0.12577,0.21149,0.14993,0.21044,0.12369,0.025079,0.4132,0,0.42229,0.020605,0.43525,0.87692,0.62694,0.9049,0.63966,0.97156,0.64007,0.69033,0.97369,0.6938,0.95152,0.60012,0.9766,0.58615,0.95216,0.36109,0.79967,0.36175,0.77622,0.4477,0.82428,0.42506,0.80785,0.25899,0.83377,0.4476,0.83289,0.12252,0.88746,0.12857,0.86253,0.016091,0.86402,0.025191,0.88623,0.69734,0.58923,0.67547,0.60506,0.76651,0.6072,0.78064,0.59228,0.48989,0.67368,0.48115,0.64669,0.39787,0.65035,0.39927,0.67099,0.7684,0.61991,0.77209,0.63837,0.46827,0.49162,0.27732,0.50829,0.37395,0.50714,0.37392,0.48893,0.67414,0.56048,0.67935,0.57861,0.87564,0.83377,0.949,0.83295,0.97746,0.824,0.89032,0.81298,0.98131,0.8162,0.78347,0.44185,0.64565,0.43937,0.77019,0.72362,0.63278,0.71277,0.63038,0.72456,0.38253,0.27156,0.52192,0.28349,0.65631,0.90291,0.64993,0.90354,0.65437,0.89509,0.53963,0.40626,0.54569,0.39202,0.68124,0.40229,0.55353,0.66222,0.55618,0.64789,0.68946,0.66429,0.6902,0.65043,0.53154,0.35155,0.53457,0.36578,0.66795,0.3524,0.51816,0.85127,0.5176,0.84238,0.34784,0.84916,0.76687,0.87924,0.76757,0.88812,0.57663,0.21114,0.6864,0.30133,0.57049,0.29487,0.95034,0.51767,0.95776,0.54848,0.45241,0.33389,0.51704,0.33558,0.62361,0.44185,0.58557,0.4137,0.55943,0.43007,0.39942,0.32222,0.41629,0.29759,0.35972,0.16806,0.32384,0.16799,0.10377,0.039179,0.11652,0.051436,0.27967,0.19044,0.28679,0.17111,0.31485,0.16578,0.27228,0.05556,0.26968,0.048728,0.23415,0.081549,0.22704,0.076094,0.42441,0.10843,0.42737,0.11665,0.82506,0.001911,0.78774,0.002045,0.04626,0.50514,0.050595,0.51711,0.093549,0.49612,0.060853,0.24974,0.1171,0.26266,0.11531,0.25038,0.20813,0.27373,0,0.093592,0.002789,0.081667,0.42537,0.14951,0.42303,0.13749,0.98991,0.85233,0.94289,0.84132,0.97373,0.54848,0.9639,0.54838,0.93356,0.46715,0.98891,0.46451,0.97149,0.46914,0.002713,0.01307,0,0.024581,0.36166,0.19929,0.36139,0.18655,0.51946,0.5983,0.51806,0.5892,0.4717,0.007594,0.47097,0.012314,0.11248,0.37834,0.10786,0.37843,0.1202,0.38154,0.26711,0.20247,0.37386,0.28589,0.3443,0.28286,0.18887,0.05998,0.18887,0.045369,0.97838,0.75751,0.9512,0.76495,0.9949,0.85914,0.99404,0.86996,0.38247,0.098761,0.38001,0.089848,0,0.26815,0.002545,0.25565,0.94603,0.90046,0.94461,0.9096,0.36631,0.22896,0.3463,0.23117,0.23804,0.037312,0.99764,0.5941,0.99914,0.60934,0.38001,0.21876,0.45058,0.21659,0.99739,0.57959,0.92678,0.57921,0.98065,0.56073,0.58123,0.85127,0.57823,0.84126,0.99951,0.23269,0.99432,0.22568,0.32422,0.085451,0.32384,0.077369,0.45993,0.13455,0.44024,0.11514,0.4375,0.12442,0.30822,0.002151,0.001875,0.71247,0,0.72319,0.65448,0.62215,0.53075,0.62623,0.53101,0.64007,0.60278,0.53734,0.9925,0.78573,0.13236,0.40626,0.12918,0.39276,0.72945,0.65229,0.72962,0.6631,0.001007,0.94872,0,0.95479,0.66755,0.45535,0.66735,0.46616,0.35279,0.99723,0.35211,0.99111,0.64915,0.59414,0.6482,0.58814,0.73338,0.51594,0.73244,0.52195,0.22704,0.27434,0.22748,0.28589,0.66916,0.23319,0.66896,0.23918,0.87094,0.70089,0.87444,0.70613,0.12918,0.32344,0.1292,0.31715,0.76236,0.20062,0.86148,0.20605,0.52849,0.27988,0.52806,0.28589,0.46522,0.88206,0.46546,0.88812,0.34784,0.87297,0.80208,0.71343,0.80176,0.71942,0.77965,0.28569,0.77912,0.27969,0.76856,0.94257,0.7686,0.93651,0.8854,0.92345,0.66136,0.37987,0.66139,0.38587,0.94249,0.48989,0.99526,0.50817,0.10746,0.18464,0.057309,0.19737,0.06097,0.20239,0.49604,0.66871,0.73554,0.04719,0.67865,0.046928,0.59989,0.4798,0.70719,0.50752,0.71101,0.49593,0.5921,0.50829,0.47686,0.49064,0.47673,0.50167,0.92741,0.45428,0.91696,0.46914,0.81181,0.45678,0.81586,0.46827,0.38001,0.25126,0.38432,0.26292,0.8988,0.42719,0.89918,0.43884,0.11408,0.16194,3.1e-05,0.15057,0,0.15971,0.87631,0.97661,0.79273,0.99467,0.79261,1,0.70052,0.96159,0.69995,0.96676,0.48718,0.25591,0.48718,0.26504,0.63995,0.89887,0.6408,0.904,0.99316,0.48374,0.99237,0.47867,0.79664,0.17216,0.79587,0.17724,0.67541,0.10325,0.72784,0.10729,0.68006,0.001742,0.72922,0.006383,0.12918,0.020574,0.21811,0.031045,0.2167,0.025922,0.87582,0.37464,0.59989,0.19257,0.60147,0.1875,0.98913,0.42134,0.90533,0.41849,0.66795,0.10829,0.58745,0.10358,0.000493,0.10569,0,0.11076,0.47051,0.57447,0.4705,0.57959,0.37175,0.56273,0.59344,0.1942,0.59374,0.18914,0.95648,0.26294,0.95592,0.25787,0.23245,0.46914,0.23222,0.46403,0.3302,0.448,0.54018,0.16835,0.54046,0.17341,0.92293,0.083798,0.87157,0.082171,0.78774,0.016798,0.83907,0.019331,0.93814,0.034702,0.93858,0.029633,0.83257,0.40626,0.78833,0.38988,0.48153,0.021391,0.48217,0.026439,0.32403,0.027785,0.36723,0.03442,0.36604,0.029308,0.89056,0.017519,0.89138,0.022596,0.91055,0.059509,0.86251,0.058365,0.90762,0.04719,0.8616,0.04314,0.80253,0.75089,0.80176,0.76495,0.13122,0.49457,0.12918,0.50829,0.77921,0.56352,0.77907,0.57634,0.72945,0.69503,0.73809,0.70613,0.30412,0.54848,0.30057,0.53625,0.78752,0.11648,0.84956,0.12164,0.71716,0.49674,0.71762,0.50829,0.88283,0.37964,0.88267,0.38564,0.34468,0.35994,0.34605,0.36578,0.82248,0.30627,0.82425,0.30023,0.53201,0.33734,0.53154,0.34335,0.54558,0.29829,0.54571,0.29229,0.78591,0.35812,0.78657,0.36411,0.94414,0.31736,0.94426,0.32336,0.37272,0.059965,0.37312,0.053953,0.049499,0.20854,0.10204,0.22747,0.93126,0.71762,0.93236,0.72355,0.27876,0.023862,0.22704,0.02547,0.22953,0.031163,0.062273,0.24359,0.060853,0.23767,0.79693,0.059509,0.74251,0.05408,0.9774,0.99937,0.98982,0.97907,0.69115,0.38762,0.49382,0.2408,0.5,0.2409,0.42987,0.63895,0.40454,0.63972,0.52691,0.039211,0.52887,0.034078,0.59453,0.009828,0.53829,0.003595,0.53823,0.008103,0.71411,0.30046,0.71393,0.30303,0.4543,0.43922,0.45419,0.44185,0.40908,0.42206,0.40875,0.42461,0.67877,0.053339,0.67865,0.057846,0.77881,0.53072,0.77868,0.52809,0.7328,0.54848,0.73244,0.54594,0.38001,0.003888,0.38062,0.006348,0.17562,0.84606,0.17567,0.84581,0.76457,0.83337,0.56434,0.31158]],

    "faces": [42,36,37,45,0,261,1102,1103,0,1,2,42,45,37,0,0,1103,1102,8,2,1,3,42,37,46,0,0,1102,1104,8,1,4,3,42,37,38,46,0,171,1105,1106,5,6,7,42,1,46,95,0,31,1106,1107,8,7,9,42,46,38,95,0,1106,1105,1107,7,6,9,42,2,95,47,0,143,1110,1109,10,11,12,42,95,38,47,0,1110,236,1109,11,13,12,42,38,39,47,0,236,1108,1109,13,14,12,42,47,39,40,0,1115,1113,1114,15,16,17,42,41,48,40,0,1116,1118,54,18,19,20,42,48,3,40,0,1118,16,54,19,21,20,42,47,40,3,0,1117,54,16,22,20,21,42,48,41,4,0,1122,1120,137,23,24,25,42,4,41,42,0,137,1120,1121,25,24,26,42,49,4,50,0,1127,10,1128,27,28,29,42,4,42,50,0,10,1125,1128,28,30,29,42,42,43,50,0,1125,1126,1128,30,31,29,42,43,36,50,0,1129,140,1132,32,33,34,42,44,50,45,0,1130,1132,1131,35,34,36,42,50,36,45,0,1132,140,1131,34,33,36,42,276,277,5,0,1135,1136,1133,37,38,39,42,5,277,6,0,1133,1136,1134,39,38,40,42,6,277,112,0,738,1138,1137,41,42,43,42,112,277,278,0,1137,1138,1139,43,42,44,42,112,278,111,0,761,1140,245,45,46,47,42,111,278,365,0,245,1140,1142,47,46,48,42,365,9,111,0,1145,123,1144,49,50,51,42,111,9,110,0,1144,123,1143,51,50,52,42,364,110,10,0,1149,1148,1147,53,54,55,42,10,110,9,0,1147,1148,1146,55,54,56,42,364,10,7,0,1154,1150,26,57,58,59,42,7,10,11,0,26,1150,1151,59,58,60,42,7,11,8,0,20,1123,133,61,62,63,42,8,11,12,0,133,1123,1124,63,62,64,42,12,276,8,0,1158,1159,1157,65,66,67,42,8,276,5,0,1157,1159,1156,67,66,68,42,281,366,280,0,1161,1162,1160,69,70,71,42,280,366,367,0,1160,1162,1163,71,70,72,42,367,368,280,0,1166,1167,1165,73,74,75,42,280,368,279,0,1165,1167,1164,75,74,76,42,365,279,369,0,997,996,1169,77,78,79,42,369,279,368,0,1169,996,1168,79,78,80,42,365,369,9,0,1171,1172,884,81,82,83,42,9,369,370,0,884,1172,1173,83,82,84,42,370,371,9,0,1174,1175,18,85,86,87,42,9,371,10,0,18,1175,24,87,86,88,42,11,10,194,0,1151,1150,1153,89,90,91,42,371,193,10,0,1155,1152,1150,92,93,90,42,10,193,194,0,1150,1152,1153,90,93,91,42,194,195,11,0,494,495,28,94,95,96,42,11,195,12,0,28,495,36,96,95,97,42,12,195,281,0,1176,1177,1179,98,99,100,42,366,281,196,0,1180,1179,1178,101,100,102,42,195,196,281,0,1177,1178,1179,99,102,100,42,14,375,15,0,56,1182,1181,103,104,105,42,15,375,376,0,1183,1184,1185,106,107,108,42,16,376,17,0,27,1187,1186,109,110,111,42,17,376,18,0,29,1190,30,112,113,114,42,18,376,372,0,30,1190,1188,114,113,115,42,18,21,19,0,1191,1193,1192,116,117,118,42,19,21,20,0,1194,1196,1195,119,120,121,42,20,21,22,0,1195,1196,1197,121,120,122,42,20,22,13,0,1199,1200,1198,123,124,125,42,23,24,376,0,1201,1202,1203,126,127,128,42,25,26,21,0,1204,1205,48,129,130,131,42,21,26,22,0,48,1205,50,131,130,132,42,26,27,23,0,23,39,22,133,134,135,42,23,27,24,0,115,1206,122,136,137,138,42,24,27,25,0,40,1208,1207,139,140,141,42,25,27,26,0,57,84,70,142,143,144,42,5,6,36,0,12,72,1209,145,146,147,42,36,6,37,0,1209,72,1210,147,146,148,42,6,113,37,0,130,1212,141,149,150,151,42,37,113,38,0,141,1212,1211,151,150,152,42,38,113,39,0,236,1111,1108,153,154,155,42,39,113,114,0,1108,1111,1112,155,154,156,42,39,114,40,0,42,1214,1213,157,158,159,42,40,114,115,0,1213,1214,1215,159,158,160,42,40,115,41,0,47,1216,53,161,162,163,42,41,115,364,0,53,1216,1217,163,162,164,42,364,7,41,0,1050,17,86,165,166,167,42,41,7,42,0,86,17,90,167,166,168,42,7,8,42,0,20,133,1125,169,170,171,42,42,8,43,0,1125,133,1126,171,170,172,42,8,5,43,0,13,11,76,173,174,175,42,43,5,36,0,76,11,66,175,174,176,42,0,46,1,0,1,142,25,177,178,179,42,1,30,0,0,156,1219,121,180,181,182,42,0,30,29,0,121,1219,1218,182,181,183,42,48,68,3,0,1118,1119,16,184,185,186,42,3,68,33,0,16,1119,41,186,185,187,42,35,28,34,0,961,953,960,188,189,190,42,34,28,68,0,960,953,1087,190,189,191,42,68,28,33,0,1087,953,959,191,189,192,42,33,28,32,0,959,953,958,192,189,193,42,32,28,31,0,958,953,957,193,189,194,42,31,28,30,0,957,953,955,194,189,195,42,29,30,28,0,954,955,953,196,195,189,42,45,52,44,0,77,107,73,197,198,199,42,44,52,51,0,73,107,95,199,198,200,42,45,0,52,0,94,3,154,201,202,203,42,52,0,53,0,154,3,155,203,202,204,42,0,29,53,0,120,151,1220,205,206,207,42,53,29,54,0,1220,151,1221,207,206,208,42,29,28,54,0,1222,51,1223,209,210,211,42,54,28,55,0,1223,51,1224,211,210,212,42,44,51,28,0,91,146,71,213,214,215,42,28,51,55,0,71,146,149,215,214,216,42,51,52,56,0,165,249,1225,217,218,219,42,56,52,57,0,1225,249,1226,219,218,220,42,52,53,57,0,113,132,1227,221,222,223,42,57,53,58,0,1227,132,1228,223,222,224,42,53,54,58,0,162,168,1229,225,226,227,42,58,54,59,0,1229,168,1230,227,226,228,42,55,60,54,0,82,89,81,229,230,231,42,54,60,59,0,81,89,83,231,230,232,42,51,56,55,0,144,241,174,233,234,235,42,55,56,60,0,174,241,1078,235,234,236,42,56,57,61,0,134,1231,1232,237,238,239,42,57,58,61,0,135,136,1079,240,241,242,42,58,59,61,0,170,1036,1037,243,244,245,42,59,60,61,0,83,89,93,246,247,248,42,60,56,61,0,160,152,161,249,250,251,42,50,66,49,0,476,1234,167,252,253,254,42,49,66,65,0,167,1234,1233,254,253,255,42,50,44,66,0,1236,262,1238,256,257,258,42,66,44,64,0,1238,262,1237,258,257,259,42,35,63,28,0,99,101,0,260,261,262,42,28,63,62,0,0,101,100,262,261,263,42,49,65,35,0,164,1241,85,264,265,266,42,35,65,63,0,85,1241,1240,266,265,267,42,44,28,64,0,97,65,1243,268,269,270,42,64,28,62,0,1243,65,1242,270,269,271,42,65,66,67,0,1233,1234,1235,272,273,274,42,66,64,67,0,1244,480,1245,275,276,277,42,62,63,67,0,100,101,1239,278,279,280,42,63,65,67,0,169,183,484,281,282,283,42,64,62,67,0,269,264,482,284,285,286,42,48,4,72,0,69,9,98,287,288,289,42,72,4,69,0,98,9,74,289,288,290,42,4,49,69,0,7,270,1246,291,292,293,42,69,49,73,0,1246,270,1247,293,292,294,42,68,74,34,0,1248,1250,102,295,296,297,42,34,74,70,0,102,1250,1249,297,296,298,42,34,70,35,0,79,1251,80,299,300,301,42,35,70,71,0,80,1251,1252,301,300,302,42,35,71,49,0,62,274,128,303,304,305,42,49,71,73,0,128,274,276,305,304,306,42,68,48,74,0,58,55,1254,307,308,309,42,74,48,72,0,1254,55,1253,309,308,310,42,69,75,72,0,138,1255,139,311,312,313,42,72,75,78,0,139,1255,1256,313,312,314,42,73,79,69,0,230,1258,195,315,316,317,42,69,79,75,0,195,1258,1257,317,316,318,42,74,80,70,0,105,1261,103,319,320,321,42,70,80,76,0,103,1261,1259,321,320,322,42,71,70,77,0,104,103,1260,323,324,325,42,77,70,76,0,1260,103,1259,325,324,326,42,73,71,79,0,222,207,1057,327,328,329,42,79,71,77,0,1057,207,232,329,328,330,42,72,78,74,0,61,68,67,331,332,333,42,74,78,80,0,67,68,116,333,332,334,42,78,75,81,0,1027,148,1028,335,336,337,42,75,79,81,0,147,150,153,338,339,340,42,76,80,81,0,109,163,166,341,342,343,42,77,76,81,0,114,109,166,344,345,346,42,79,77,81,0,280,277,281,347,348,349,42,80,78,81,0,951,117,952,350,351,352,42,2,47,82,0,33,173,182,353,354,355,42,82,47,83,0,182,173,1262,355,354,356,42,3,84,47,0,5,1264,52,357,358,359,42,47,84,83,0,52,1264,1263,359,358,360,42,33,85,3,0,75,1266,6,361,362,363,42,3,85,84,0,6,1266,1265,363,362,364,42,33,32,85,0,78,64,1267,365,366,367,42,85,32,86,0,1267,64,1268,367,366,368,42,31,87,32,0,957,1089,958,369,370,371,42,32,87,86,0,958,1089,1088,371,370,372,42,31,2,87,0,1090,129,1092,373,374,375,42,87,2,82,0,1092,129,1091,375,374,376,42,82,83,88,0,87,88,96,377,378,379,42,88,83,89,0,96,88,157,379,378,380,42,84,90,83,0,192,1270,180,381,382,383,42,83,90,89,0,180,1270,1269,383,382,384,42,84,85,90,0,233,234,1271,385,386,387,42,90,85,91,0,1271,234,1272,387,386,388,42,85,86,91,0,176,177,185,389,390,391,42,91,86,92,0,185,177,1273,391,390,392,42,87,93,86,0,179,1274,177,393,394,395,42,86,93,92,0,177,1274,1273,395,394,396,42,82,88,87,0,178,1275,191,397,398,399,42,87,88,93,0,191,1275,1276,399,398,400,42,88,89,94,0,96,157,158,401,402,403,42,89,90,94,0,193,203,325,404,405,406,42,90,91,94,0,242,246,248,407,408,409,42,91,92,94,0,1099,1100,1101,410,411,412,42,92,93,94,0,187,188,189,413,414,415,42,93,88,94,0,197,196,224,416,417,418,42,95,100,1,0,287,1278,4,419,420,421,42,1,100,96,0,4,1278,1277,421,420,422,42,95,2,100,0,184,2,199,423,424,425,42,100,2,97,0,199,2,186,425,424,426,42,31,30,99,0,60,59,1279,427,428,429,42,99,30,98,0,1279,59,190,429,428,430,42,1,96,30,0,49,949,948,431,432,433,42,30,96,98,0,948,949,950,433,432,434,42,2,31,97,0,37,92,1280,435,436,437,42,97,31,99,0,1280,92,1281,437,436,438,42,96,100,101,0,296,1282,1283,439,440,441,42,100,102,101,0,1284,1286,1285,442,443,444,42,103,98,101,0,1095,198,1094,445,446,447,42,98,96,101,0,293,289,298,448,449,450,42,102,103,101,0,1287,1288,204,451,452,453,42,99,98,103,0,1093,198,1095,454,455,456,42,100,97,106,0,240,215,1290,457,458,459,42,106,97,104,0,1290,215,1289,459,458,460,42,99,105,97,0,108,1047,106,461,462,463,42,97,105,104,0,106,1047,1046,463,462,464,42,103,108,99,0,200,1292,194,465,466,467,42,99,108,105,0,194,1292,1291,467,466,468,42,100,106,102,0,202,1294,1293,469,470,471,42,102,106,107,0,1293,1294,1295,471,470,472,42,103,102,108,0,206,205,1296,473,474,475,42,108,102,107,0,1296,205,211,475,474,476,42,106,104,109,0,259,250,268,477,478,479,42,104,105,109,0,257,1000,1001,480,481,482,42,105,108,109,0,210,214,216,483,484,485,42,107,106,109,0,209,208,212,486,487,488,42,108,107,109,0,1097,1096,1098,489,490,491,42,110,116,111,0,333,347,335,492,493,494,42,111,116,117,0,335,347,416,494,493,495,42,117,118,111,0,321,322,313,496,497,498,42,111,118,112,0,313,322,314,498,497,499,42,118,119,112,0,1300,1301,251,500,501,502,42,112,119,113,0,251,1301,1299,502,501,503,42,113,119,114,0,252,307,263,504,505,506,42,114,119,120,0,263,307,1302,506,505,507,42,114,120,115,0,858,869,868,508,509,510,42,115,120,121,0,868,869,1303,510,509,511,42,115,121,110,0,285,1305,278,512,513,514,42,110,121,116,0,278,1305,1304,514,513,515,42,122,123,116,0,1306,1307,286,516,517,518,42,116,123,117,0,286,1307,290,518,517,519,42,123,124,117,0,1297,1298,321,520,521,522,42,117,124,118,0,321,1298,322,522,521,523,42,124,125,118,0,315,523,272,524,525,526,42,118,125,119,0,272,523,282,526,525,527,42,119,125,120,0,221,1310,223,528,529,530,42,120,125,126,0,223,1310,1311,530,529,531,42,120,126,121,0,124,126,125,532,533,534,42,121,126,127,0,125,126,127,534,533,535,42,121,127,116,0,301,319,294,536,537,538,42,116,127,122,0,294,319,318,538,537,539,42,128,129,122,0,302,303,295,540,541,542,42,122,129,123,0,295,303,297,542,541,543,42,123,129,124,0,365,410,404,544,545,546,42,124,129,130,0,404,410,414,546,545,547,42,124,130,125,0,315,525,523,548,549,550,42,125,130,131,0,523,525,539,550,549,551,42,125,131,126,0,225,256,254,552,553,554,42,126,131,132,0,254,256,267,554,553,555,42,132,133,126,0,217,218,126,556,557,558,42,126,133,127,0,126,218,127,558,557,559,42,133,128,127,0,337,320,319,560,561,562,42,127,128,122,0,319,320,318,562,561,563,42,134,135,128,0,1314,1315,323,564,565,566,42,128,135,129,0,323,1315,327,566,565,567,42,135,136,129,0,328,329,324,568,569,570,42,129,136,130,0,324,329,326,570,569,571,42,136,137,130,0,1308,1309,525,572,573,574,42,130,137,131,0,525,1309,539,574,573,575,42,131,137,132,0,131,1316,172,576,577,578,42,132,137,138,0,172,1316,1317,578,577,579,42,132,138,133,0,145,175,159,580,581,582,42,133,138,139,0,159,175,181,582,581,583,42,133,139,128,0,337,1313,320,584,585,586,42,128,139,134,0,320,1313,1312,586,585,587,42,134,140,135,0,308,437,312,588,589,590,42,135,140,136,0,328,330,329,591,592,593,42,136,140,137,0,543,737,736,594,595,596,42,137,140,138,0,271,279,273,597,598,599,42,138,140,139,0,175,201,181,600,601,602,42,139,140,134,0,1025,1026,1024,603,604,605,42,141,147,142,0,460,1318,506,606,607,608,42,142,147,148,0,506,1318,1319,608,607,609,42,142,148,143,0,219,344,220,610,611,612,42,143,148,149,0,220,344,348,612,611,613,42,143,149,144,0,331,358,336,614,615,616,42,144,149,150,0,336,358,1067,616,615,617,42,150,151,144,0,1007,1008,226,618,619,620,42,144,151,145,0,226,1008,1006,620,619,621,42,151,152,145,0,237,243,228,622,623,624,42,145,152,146,0,228,243,229,624,623,625,42,152,147,146,0,1072,253,227,626,627,628,42,146,147,141,0,227,253,213,628,627,629,42,153,154,147,0,1320,1321,540,630,631,632,42,147,154,148,0,540,1321,541,632,631,633,42,154,155,148,0,359,360,344,634,635,636,42,148,155,149,0,344,360,348,636,635,637,42,155,156,149,0,1322,1323,317,638,639,640,42,149,156,150,0,317,1323,332,640,639,641,42,150,156,151,0,231,238,235,642,643,644,42,151,156,157,0,235,238,239,644,643,645,42,151,157,152,0,255,265,258,646,647,648,42,152,157,158,0,258,265,275,648,647,649,42,152,158,147,0,370,1325,367,650,651,652,42,147,158,153,0,367,1325,1324,652,651,653,42,153,159,154,0,542,1327,1326,654,655,656,42,154,159,155,0,544,992,991,657,658,659,42,155,159,156,0,338,340,339,660,661,662,42,156,159,157,0,1009,1011,1010,663,664,665,42,157,159,158,0,244,452,449,666,667,668,42,158,159,153,0,383,385,380,669,670,671,42,142,143,141,0,350,351,349,672,673,674,42,143,144,141,0,351,353,349,673,675,674,42,144,145,141,0,353,354,349,675,676,674,42,145,146,141,0,354,355,349,676,677,674,42,160,166,161,0,363,1328,366,678,679,680,42,161,166,167,0,366,1328,1329,680,679,681,42,161,167,162,0,545,1330,552,682,683,684,42,162,167,168,0,552,1330,1331,684,683,685,42,162,168,163,0,546,1333,547,686,687,688,42,163,168,169,0,547,1333,1334,688,687,689,42,169,170,163,0,1335,1336,284,690,691,692,42,163,170,164,0,284,1336,292,692,691,693,42,170,171,164,0,1337,1338,260,694,695,696,42,164,171,165,0,260,1338,288,696,695,697,42,171,166,165,0,1341,1340,266,698,699,700,42,165,166,160,0,266,1340,247,700,699,701,42,166,172,167,0,374,376,375,702,703,704,42,167,172,168,0,1330,1332,1331,705,706,707,42,168,172,169,0,574,576,575,708,709,710,42,169,172,170,0,299,304,300,711,712,713,42,170,172,171,0,1337,1339,1338,714,715,716,42,171,172,166,0,291,311,283,717,718,719,42,161,162,160,0,342,343,341,720,721,722,42,162,163,160,0,343,345,341,721,723,722,42,163,164,160,0,345,346,341,723,724,722,42,164,165,160,0,346,364,341,724,725,722,42,173,179,174,0,468,524,473,726,727,728,42,174,179,175,0,378,387,384,729,730,731,42,175,179,176,0,372,1043,1042,732,733,734,42,176,179,177,0,382,390,389,735,736,737,42,177,179,178,0,305,309,306,738,739,740,42,178,179,173,0,401,408,386,741,742,743,42,174,175,173,0,368,369,334,744,745,746,42,175,176,173,0,369,379,334,745,747,746,42,176,177,173,0,379,388,334,747,748,746,42,177,178,173,0,388,394,334,748,749,746,42,180,186,181,0,538,578,577,750,751,752,42,181,186,187,0,577,578,579,752,751,753,42,181,187,182,0,393,479,471,754,755,756,42,182,187,188,0,471,479,1342,756,755,757,42,182,188,183,0,397,477,422,758,759,760,42,183,188,189,0,422,477,478,760,759,761,42,189,190,183,0,439,440,398,762,763,764,42,183,190,184,0,398,440,415,764,763,765,42,190,191,184,0,1345,1346,316,766,767,768,42,184,191,185,0,316,1346,1344,768,767,769,42,191,186,185,0,1347,356,352,770,771,772,42,185,186,180,0,352,356,310,772,771,773,42,186,192,187,0,462,1071,1070,774,775,776,42,187,192,188,0,479,1343,1342,777,778,779,42,188,192,189,0,391,1349,1348,780,781,782,42,189,192,190,0,392,396,395,783,784,785,42,190,192,191,0,357,362,361,786,787,788,42,191,192,186,0,463,467,442,789,790,791,42,181,182,180,0,411,412,409,792,793,794,42,182,183,180,0,412,413,409,793,795,794,42,183,184,180,0,413,438,409,795,796,794,42,184,185,180,0,438,441,409,796,797,794,42,193,199,194,0,373,1351,1350,798,799,800,42,194,199,200,0,1350,1351,1352,800,799,801,42,194,200,195,0,464,469,465,802,803,804,42,195,200,201,0,465,469,470,804,803,805,42,195,201,196,0,483,1354,1353,806,807,808,42,196,201,202,0,1353,1354,1355,808,807,809,42,196,202,197,0,1356,1358,1357,810,811,812,42,197,202,203,0,1357,1358,1359,812,811,813,42,203,204,197,0,1360,1361,620,814,815,816,42,197,204,198,0,620,1361,621,816,815,817,42,204,199,198,0,1363,1362,377,818,819,820,42,198,199,193,0,377,1362,371,820,819,821,42,205,206,199,0,1365,1366,417,822,823,824,42,199,206,200,0,417,1366,1364,824,823,825,42,206,207,200,0,474,475,469,826,827,828,42,200,207,201,0,469,475,470,828,827,829,42,207,208,201,0,514,1367,489,830,831,832,42,201,208,202,0,489,1367,500,832,831,833,42,202,208,203,0,490,1372,491,834,835,836,42,203,208,209,0,491,1372,1373,836,835,837,42,203,209,204,0,399,402,400,838,839,840,42,204,209,210,0,400,402,403,840,839,841,42,204,210,199,0,418,432,381,842,843,844,42,199,210,205,0,381,432,428,844,843,845,42,211,212,205,0,430,431,426,846,847,848,42,205,212,206,0,426,431,427,848,847,849,42,206,212,207,0,496,501,499,850,851,852,42,207,212,213,0,499,501,505,852,851,853,42,207,213,208,0,514,1368,1367,854,855,856,42,208,213,214,0,1367,1368,1369,856,855,857,42,208,214,209,0,507,516,512,858,859,860,42,209,214,215,0,512,516,519,860,859,861,42,215,216,209,0,622,623,402,862,863,864,42,209,216,210,0,402,623,403,864,863,865,42,216,211,210,0,643,634,432,866,867,868,42,210,211,205,0,432,634,428,868,867,869,42,217,218,211,0,1376,1377,487,870,871,872,42,211,218,212,0,487,1377,504,872,871,873,42,218,219,212,0,509,510,492,874,875,876,42,212,219,213,0,492,510,498,876,875,877,42,219,220,213,0,1370,1371,1368,878,879,880,42,213,220,214,0,1368,1371,1369,880,879,881,42,214,220,215,0,645,1378,662,882,883,884,42,215,220,221,0,662,1378,1379,884,883,885,42,215,221,216,0,657,663,661,886,887,888,42,216,221,222,0,661,663,689,888,887,889,42,216,222,211,0,643,1375,634,890,891,892,42,211,222,217,0,634,1375,1374,892,891,893,42,217,223,218,0,434,1381,1380,894,895,896,42,218,223,219,0,509,513,510,897,898,899,42,219,223,220,0,521,1383,1382,900,901,902,42,220,223,221,0,526,685,682,903,904,905,42,221,223,222,0,663,690,689,906,907,908,42,222,223,217,0,435,436,433,909,910,911,42,224,230,225,0,511,537,522,912,913,914,42,225,230,231,0,522,537,549,914,913,915,42,225,231,226,0,517,548,518,916,917,918,42,226,231,232,0,518,548,550,918,917,919,42,226,232,227,0,520,1076,551,920,921,922,42,227,232,233,0,551,1076,1077,922,921,923,42,233,234,227,0,407,419,405,924,925,926,42,227,234,228,0,405,419,406,926,925,927,42,234,235,228,0,613,619,580,928,929,930,42,228,235,229,0,580,619,581,930,929,931,42,235,230,229,0,1083,1082,695,932,933,934,42,229,230,224,0,695,1082,691,934,933,935,42,236,237,230,0,1085,1086,515,936,937,938,42,230,237,231,0,515,1086,533,938,937,939,42,237,238,231,0,555,556,548,940,941,942,42,231,238,232,0,548,556,550,942,941,943,42,238,239,232,0,1385,1386,527,944,945,946,42,232,239,233,0,527,1386,1384,946,945,947,42,233,239,234,0,528,567,529,948,949,950,42,234,239,240,0,529,567,1387,950,949,951,42,234,240,235,0,707,1060,727,952,953,954,42,235,240,241,0,727,1060,1061,954,953,955,42,235,241,230,0,531,1389,508,956,957,958,42,230,241,236,0,508,1389,1388,958,957,959,42,236,242,237,0,553,1391,1390,960,961,962,42,237,242,238,0,557,559,558,963,964,965,42,238,242,239,0,530,568,566,966,967,968,42,239,242,240,0,420,1393,1392,969,970,971,42,240,242,241,0,421,424,423,972,973,974,42,241,242,236,0,534,535,532,975,976,977,42,225,226,224,0,448,458,446,978,979,980,42,226,227,224,0,458,459,446,979,981,980,42,227,228,224,0,459,472,446,981,982,980,42,228,229,224,0,472,481,446,982,983,980,42,243,249,244,0,560,1394,563,984,985,986,42,244,249,250,0,563,1394,1395,986,985,987,42,244,250,245,0,561,1396,595,988,989,990,42,245,250,251,0,595,1396,1397,990,989,991,42,245,251,246,0,564,1399,565,992,993,994,42,246,251,252,0,565,1399,1400,994,993,995,42,252,253,246,0,1401,1402,728,996,997,998,42,246,253,247,0,728,1402,729,998,997,999,42,253,254,247,0,1403,1404,429,1000,1001,1002,42,247,254,248,0,429,1404,445,1002,1001,1003,42,254,249,248,0,1407,1406,443,1004,1005,1006,42,248,249,243,0,443,1406,425,1006,1005,1007,42,249,255,250,0,582,625,624,1008,1009,1010,42,250,255,251,0,1396,1398,1397,1011,1012,1013,42,251,255,252,0,598,602,599,1014,1015,1016,42,252,255,253,0,730,732,731,1017,1018,1019,42,253,255,254,0,1403,1405,1404,1020,1021,1022,42,254,255,249,0,447,450,444,1023,1024,1025,42,244,245,243,0,594,608,591,1026,1027,1028,42,245,246,243,0,608,614,591,1027,1029,1028,42,246,247,243,0,614,615,591,1029,1030,1028,42,247,248,243,0,615,616,591,1030,1031,1028,42,256,262,257,0,562,1409,1408,1032,1033,1034,42,257,262,258,0,626,629,627,1035,1036,1037,42,258,262,259,0,617,1411,1410,1038,1039,1040,42,259,262,260,0,638,642,641,1041,1042,1043,42,260,262,261,0,743,746,745,1044,1045,1046,42,261,262,256,0,569,570,536,1047,1048,1049,42,257,258,256,0,453,454,451,1050,1051,1052,42,258,259,256,0,454,455,451,1051,1053,1052,42,259,260,256,0,455,456,451,1053,1054,1052,42,260,261,256,0,456,457,451,1054,1055,1052,42,263,269,264,0,571,1412,572,1056,1057,1058,42,264,269,270,0,572,1412,1413,1058,1057,1059,42,264,270,265,0,630,670,667,1060,1061,1062,42,265,270,271,0,667,670,1414,1062,1061,1063,42,265,271,266,0,665,668,666,1064,1065,1066,42,266,271,272,0,666,668,669,1066,1065,1067,42,272,273,266,0,1416,1417,644,1068,1069,1070,42,266,273,267,0,644,1417,648,1070,1069,1071,42,273,274,267,0,1419,1420,748,1072,1073,1074,42,267,274,268,0,748,1420,1418,1074,1073,1075,42,274,269,268,0,1422,1421,749,1076,1077,1078,42,268,269,263,0,749,1421,747,1078,1077,1079,42,269,275,270,0,573,601,600,1080,1081,1082,42,270,275,271,0,670,1415,1414,1083,1084,1085,42,271,275,272,0,651,1424,1423,1086,1087,1088,42,272,275,273,0,655,681,673,1089,1090,1091,42,273,275,274,0,751,1426,1425,1092,1093,1094,42,274,275,269,0,752,753,750,1095,1096,1097,42,264,265,263,0,466,493,461,1098,1099,1100,42,265,266,263,0,493,497,461,1099,1101,1100,42,266,267,263,0,497,502,461,1101,1102,1100,42,267,268,263,0,502,503,461,1102,1103,1100,42,276,282,277,0,704,1427,937,1104,1105,1106,42,277,282,283,0,937,1427,1428,1106,1105,1107,42,277,283,278,0,672,1429,698,1108,1109,1110,42,278,283,284,0,698,1429,1430,1110,1109,1111,42,278,284,279,0,607,1431,618,1112,1113,1114,42,279,284,285,0,618,1431,1432,1114,1113,1115,42,279,285,280,0,609,1062,612,1116,1117,1118,42,280,285,286,0,612,1062,1063,1118,1117,1119,42,286,287,280,0,1433,1434,754,1120,1121,1122,42,280,287,281,0,754,1434,770,1122,1121,1123,42,287,282,281,0,1436,1435,1002,1124,1125,1126,42,281,282,276,0,1002,1435,934,1126,1125,1127,42,288,289,282,0,697,702,692,1128,1129,1130,42,282,289,283,0,692,702,694,1130,1129,1131,42,289,290,283,0,701,708,699,1132,1133,1134,42,283,290,284,0,699,708,700,1134,1133,1135,42,290,291,284,0,584,585,554,1136,1137,1138,42,284,291,285,0,554,585,583,1138,1137,1139,42,285,291,286,0,633,640,639,1140,1141,1142,42,286,291,292,0,639,640,652,1142,1141,1143,42,286,292,287,0,720,734,721,1144,1145,1146,42,287,292,293,0,721,734,755,1146,1145,1147,42,287,293,282,0,604,606,603,1148,1149,1150,42,282,293,288,0,603,606,605,1150,1149,1151,42,294,295,288,0,1052,1053,723,1152,1153,1154,42,288,295,289,0,723,1053,742,1154,1153,1155,42,289,295,290,0,701,710,708,1156,1157,1158,42,290,295,296,0,708,710,712,1158,1157,1159,42,290,296,291,0,584,586,585,1160,1161,1162,42,291,296,297,0,585,586,587,1162,1161,1163,42,291,297,292,0,653,1054,656,1164,1165,1166,42,292,297,298,0,656,1054,1055,1166,1165,1167,42,298,299,292,0,774,777,734,1168,1169,1170,42,292,299,293,0,734,777,755,1170,1169,1171,42,299,294,293,0,611,610,606,1172,1173,1174,42,293,294,288,0,606,610,605,1174,1173,1175,42,300,301,294,0,1058,1059,733,1176,1177,1178,42,294,301,295,0,733,1059,758,1178,1177,1179,42,301,302,295,0,759,1040,756,1180,1181,1182,42,295,302,296,0,756,1040,757,1182,1181,1183,42,302,303,296,0,1022,1023,586,1184,1185,1186,42,296,303,297,0,586,1023,587,1186,1185,1187,42,297,303,298,0,781,1068,799,1188,1189,1190,42,298,303,304,0,799,1068,1069,1190,1189,1191,42,298,304,299,0,791,805,798,1192,1193,1194,42,299,304,305,0,798,805,1048,1194,1193,1195,42,299,305,294,0,611,631,610,1196,1197,1198,42,294,305,300,0,610,631,628,1198,1197,1199,42,300,306,301,0,765,1438,1437,1200,1201,1202,42,301,306,302,0,759,1041,1040,1203,1204,1205,42,302,306,303,0,588,590,589,1206,1207,1208,42,303,306,304,0,658,660,659,1209,1210,1211,42,304,306,305,0,805,1049,1048,1212,1213,1214,42,305,306,300,0,766,767,764,1215,1216,1217,42,307,313,308,0,768,1439,769,1218,1219,1220,42,308,313,314,0,769,1439,1440,1220,1219,1221,42,308,314,309,0,592,596,593,1222,1223,1224,42,309,314,315,0,593,596,597,1224,1223,1225,42,309,315,310,0,760,786,783,1226,1227,1228,42,310,315,316,0,783,786,787,1228,1227,1229,42,316,317,310,0,817,1073,671,1230,1231,1232,42,310,317,311,0,671,1073,687,1232,1231,1233,42,317,318,311,0,782,790,779,1234,1235,1236,42,311,318,312,0,779,790,780,1236,1235,1237,42,318,313,312,0,1081,1080,813,1238,1239,1240,42,312,313,307,0,813,1080,809,1240,1239,1241,42,319,320,313,0,1441,1442,795,1242,1243,1244,42,313,320,314,0,795,1442,796,1244,1243,1245,42,320,321,314,0,784,785,596,1246,1247,1248,42,314,321,315,0,596,785,597,1248,1247,1249,42,321,322,315,0,674,1066,632,1250,1251,1252,42,315,322,316,0,632,1066,636,1252,1251,1253,42,316,322,317,0,688,1443,705,1254,1255,1256,42,317,322,323,0,705,1443,1444,1256,1255,1257,42,317,323,318,0,816,1064,819,1258,1259,1260,42,318,323,324,0,819,1064,1065,1260,1259,1261,42,318,324,313,0,677,1446,664,1262,1263,1264,42,313,324,319,0,664,1446,1445,1264,1263,1265,42,319,325,320,0,812,1035,1034,1266,1267,1268,42,320,325,321,0,635,1056,675,1269,1270,1271,42,321,325,322,0,724,744,725,1272,1273,1274,42,322,325,323,0,726,1021,1020,1275,1276,1277,42,323,325,324,0,679,1084,683,1278,1279,1280,42,324,325,319,0,680,800,678,1281,1282,1283,42,308,309,307,0,646,647,637,1284,1285,1286,42,309,310,307,0,647,649,637,1285,1287,1286,42,310,311,307,0,649,650,637,1287,1288,1286,42,311,312,307,0,650,654,637,1288,1289,1286,42,326,332,327,0,820,1447,826,1290,1291,1292,42,327,332,333,0,826,1447,1448,1292,1291,1293,42,327,333,328,0,810,814,811,1294,1295,1296,42,328,333,334,0,811,814,815,1296,1295,1297,42,328,334,329,0,676,1449,686,1298,1299,1300,42,329,334,335,0,686,1449,1450,1300,1299,1301,42,335,336,329,0,1451,1452,821,1302,1303,1304,42,329,336,330,0,821,1452,832,1304,1303,1305,42,336,337,330,0,827,831,823,1306,1307,1308,42,330,337,331,0,823,831,824,1308,1307,1309,42,337,332,331,0,1454,1453,706,1310,1311,1312,42,331,332,326,0,706,1453,684,1312,1311,1313,42,332,338,333,0,846,1030,1029,1314,1315,1316,42,333,338,334,0,814,822,815,1317,1318,1319,42,334,338,335,0,696,709,703,1320,1321,1322,42,335,338,336,0,1014,1016,1015,1323,1324,1325,42,336,338,337,0,827,833,831,1326,1327,1328,42,337,338,332,0,715,716,714,1329,1330,1331,42,327,328,326,0,772,773,771,1332,1333,1334,42,328,329,326,0,773,775,771,1333,1335,1334,42,329,330,326,0,775,776,771,1335,1336,1334,42,330,331,326,0,776,778,771,1336,1337,1334,42,339,345,340,0,899,1045,1044,1338,1339,1340,42,340,345,341,0,847,861,848,1341,1342,1343,42,341,345,342,0,711,722,713,1344,1345,1346,42,342,345,343,0,801,806,804,1347,1348,1349,42,343,345,344,0,860,872,871,1350,1351,1352,42,344,345,339,0,844,845,843,1353,1354,1355,42,340,341,339,0,718,739,717,1356,1357,1358,42,341,342,339,0,739,740,717,1357,1359,1358,42,342,343,339,0,740,741,717,1359,1360,1358,42,343,344,339,0,741,762,717,1360,1361,1358,42,346,352,347,0,902,1455,917,1362,1363,1364,42,347,352,353,0,917,1455,1456,1364,1363,1365,42,347,353,348,0,862,1019,878,1366,1367,1368,42,348,353,354,0,878,1019,1457,1368,1367,1369,42,348,354,349,0,863,1017,877,1370,1371,1372,42,349,354,355,0,877,1017,1018,1372,1371,1373,42,355,356,349,0,1459,1460,807,1374,1375,1376,42,349,356,350,0,807,1460,808,1376,1375,1377,42,356,357,350,0,1462,1463,874,1378,1379,1380,42,350,357,351,0,874,1463,1461,1380,1379,1381,42,357,352,351,0,1465,1464,875,1382,1383,1384,42,351,352,346,0,875,1464,873,1384,1383,1385,42,352,358,353,0,918,920,919,1386,1387,1388,42,353,358,354,0,1019,1458,1457,1389,1390,1391,42,354,358,355,0,853,865,854,1392,1393,1394,42,355,358,356,0,841,855,842,1395,1396,1397,42,356,358,357,0,882,1467,1466,1398,1399,1400,42,357,358,352,0,886,887,876,1401,1402,1403,42,347,348,346,0,793,794,763,1404,1405,1406,42,348,349,346,0,794,797,763,1405,1407,1406,42,349,350,346,0,797,802,763,1407,1408,1406,42,350,351,346,0,802,803,763,1408,1409,1406,42,359,410,360,0,856,975,857,1410,1411,1412,42,360,377,359,0,867,889,866,1413,1414,1415,42,359,377,378,0,866,889,898,1415,1414,1416,42,362,414,381,0,929,985,944,1417,1418,1419,42,6,112,113,0,44,251,1299,1420,1421,1422,42,110,364,115,0,119,870,859,1423,1424,1425,42,276,12,281,0,693,14,933,1426,1427,1428,42,279,365,278,0,1141,1142,1140,1429,1430,1431,42,366,13,367,0,1162,719,1163,1432,1433,1434,42,367,13,14,0,1163,719,1004,1434,1433,1435,42,367,14,368,0,1166,993,1167,1436,1437,1438,42,368,14,15,0,1167,993,995,1438,1437,1439,42,15,16,368,0,788,994,1168,1440,1441,1442,42,368,16,369,0,1168,994,1169,1442,1441,1443,42,16,17,369,0,885,1170,1172,1444,1445,1446,42,369,17,370,0,1172,1170,1173,1446,1445,1447,42,17,18,370,0,903,986,1174,1448,1449,1450,42,370,18,371,0,1174,986,1175,1450,1449,1451,42,18,19,371,0,38,485,1469,1452,1453,1454,42,371,19,193,0,1469,485,1051,1454,1453,1455,42,19,198,193,0,485,1468,1051,1453,1456,1455,42,19,20,198,0,43,46,825,1457,1458,1459,42,198,20,197,0,825,46,818,1459,1458,1460,42,13,366,20,0,21,1470,486,1461,1462,1463,42,196,197,366,0,488,1003,1470,1464,1465,1462,42,197,20,366,0,1003,486,1470,1465,1463,1462,42,373,374,21,0,1471,1472,32,1466,1467,1468,42,21,374,25,0,32,1472,988,1468,1467,1469,42,361,412,379,0,888,973,910,1470,1471,1472,42,362,381,414,0,890,911,977,1473,1474,1475,42,412,361,379,0,984,928,943,1476,1477,1478,42,410,359,378,0,1474,735,1473,1479,1480,1481,42,376,383,372,0,834,1475,829,1482,1483,1484,42,372,383,384,0,829,1475,1476,1484,1483,1485,42,388,389,382,0,1478,1479,836,1486,1487,1488,42,382,389,383,0,836,1479,1477,1488,1487,1489,42,389,390,383,0,915,930,849,1490,1491,1492,42,383,390,384,0,849,930,900,1492,1491,1493,42,390,391,384,0,896,897,864,1494,1495,1496,42,384,391,385,0,864,897,895,1496,1495,1497,42,385,391,386,0,838,1486,839,1498,1499,1500,42,386,391,392,0,839,1486,1487,1500,1499,1501,42,386,392,387,0,922,927,925,1502,1503,1504,42,387,392,393,0,925,927,940,1504,1503,1505,42,387,393,382,0,880,893,879,1506,1507,1508,42,382,393,388,0,879,893,891,1508,1507,1509,42,394,395,388,0,921,923,901,1510,1511,1512,42,388,395,389,0,901,923,914,1512,1511,1513,42,389,395,390,0,915,1480,930,1514,1515,1516,42,390,395,396,0,930,1480,1481,1516,1515,1517,42,390,396,391,0,896,1482,897,1518,1519,1520,42,391,396,397,0,897,1482,1483,1520,1519,1521,42,391,397,392,0,851,881,852,1522,1523,1524,42,392,397,398,0,852,881,883,1524,1523,1525,42,398,399,392,0,1074,1075,927,1526,1527,1528,42,392,399,393,0,927,1075,940,1528,1527,1529,42,399,394,393,0,1489,1488,893,1530,1531,1532,42,393,394,388,0,893,1488,891,1532,1531,1533,42,400,401,394,0,1492,1493,969,1534,1535,1536,42,394,401,395,0,969,1493,974,1536,1535,1537,42,404,398,408,0,1494,965,1495,1538,1539,1540,42,408,398,403,0,1495,965,970,1540,1539,1541,42,397,403,398,0,926,970,965,1542,1541,1539,42,399,405,394,0,1489,1491,1488,1543,1544,1545,42,394,405,400,0,1488,1491,1490,1545,1544,1546,42,401,406,407,0,978,980,981,1547,1548,1549,42,411,403,402,0,1033,1032,1031,1550,1551,1552,42,413,404,408,0,1496,932,945,1553,1554,1555,42,398,404,399,0,956,967,964,1556,1557,1558,42,405,399,409,0,968,964,976,1559,1558,1560,42,399,404,409,0,964,967,976,1558,1557,1560,42,405,410,378,0,1012,1013,792,1561,1562,1563,42,372,384,373,0,828,837,830,1564,1565,1566,42,373,384,385,0,830,837,840,1566,1565,1567,42,386,387,374,0,912,913,892,1568,1569,1570,42,374,387,376,0,892,913,904,1570,1569,1571,42,385,386,373,0,946,947,935,1572,1573,1574,42,373,386,374,0,935,947,936,1574,1573,1575,42,401,400,377,0,963,962,907,1576,1577,1578,42,377,400,378,0,907,962,908,1578,1577,1579,42,411,402,407,0,983,979,981,1580,1581,1582,42,397,396,403,0,1483,1482,1485,1583,1584,1585,42,403,396,402,0,1485,1482,1484,1585,1584,1586,42,408,403,411,0,938,931,939,1587,1588,1589,42,409,404,413,0,976,967,1039,1590,1591,1592,42,14,13,375,0,19,15,1005,1593,1594,1595,42,375,13,22,0,1005,15,45,1595,1594,1596,42,376,16,15,0,1497,110,63,1597,1598,1599,42,18,372,21,0,30,1188,987,1600,1601,1602,42,372,373,21,0,1188,1189,987,1601,1603,1602,42,23,376,26,0,112,999,118,1604,1605,1606,42,22,26,375,0,111,118,998,1607,1606,1608,42,376,375,26,0,999,998,118,1605,1608,1606,42,360,410,377,0,916,982,942,1609,1610,1611,42,374,376,25,0,989,990,35,1612,1613,1614,42,25,376,24,0,35,990,34,1614,1613,1615,42,376,382,383,0,905,909,924,1616,1617,1618,42,376,387,382,0,789,850,835,1619,1620,1621,42,401,407,395,0,978,981,971,1622,1623,1624,42,407,402,395,0,981,979,971,1623,1625,1624,42,402,396,395,0,979,972,971,1625,1626,1624,42,409,410,405,0,976,1038,968,1627,1628,1629,42,378,400,405,0,792,894,1012,1630,1631,1632,42,377,406,401,0,906,966,941,1633,1634,1635]

}
;
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */


THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.center = new THREE.Vector3();

	this.userZoom = true;
	this.userZoomSpeed = 1.0;

	this.userRotate = true;
	this.userRotateSpeed = 1.0;

	this.userPan = true;
	this.userPanSpeed = 2.0;

	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	this.minDistance = 0;
	this.maxDistance = Infinity;

	// 65 /*A*/, 83 /*S*/, 68 /*D*/
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40, ROTATE: 65, ZOOM: 83, PAN: 68 };

	// internals

	var scope = this;

	var EPS = 0.000001;
	var PIXELS_PER_ROUND = 1800;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var zoomStart = new THREE.Vector2();
	var zoomEnd = new THREE.Vector2();
	var zoomDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;

	var lastPosition = new THREE.Vector3();

	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.NONE;

	// events

	var changeEvent = { type: 'change' };


	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateRight = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	this.rotateDown = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	this.zoomIn = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale /= zoomScale;

	};

	this.zoomOut = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale *= zoomScale;

	};

	this.pan = function ( distance ) {

		distance.transformDirection( this.object.matrix );
		distance.multiplyScalar( scope.userPanSpeed );

		this.object.position.add( distance );
		this.center.add( distance );

	};

	this.update = function () {

		var position = this.object.position;
		var offset = position.clone().sub( this.center );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = offset.length() * scale;

		// restrict radius to be between desired limits
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );

		position.copy( this.center ).add( offset );

		this.object.lookAt( this.center );

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;

		if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

			this.dispatchEvent( changeEvent );

			lastPosition.copy( this.object.position );

		}

	};


	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.userZoomSpeed );

	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		event.preventDefault();

		if ( state === STATE.NONE )
		{
			if ( event.button === 0 )
				state = STATE.ROTATE;
			if ( event.button === 1 )
				state = STATE.ZOOM;
			if ( event.button === 2 )
				state = STATE.PAN;
		}
		
		
		if ( state === STATE.ROTATE ) {

			//state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( state === STATE.ZOOM ) {

			//state = STATE.ZOOM;

			zoomStart.set( event.clientX, event.clientY );

		} else if ( state === STATE.PAN ) {

			//state = STATE.PAN;

		}

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		
		
		if ( state === STATE.ROTATE ) {

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

			rotateStart.copy( rotateEnd );

		} else if ( state === STATE.ZOOM ) {

			zoomEnd.set( event.clientX, event.clientY );
			zoomDelta.subVectors( zoomEnd, zoomStart );

			if ( zoomDelta.y > 0 ) {

				scope.zoomIn();

			} else {

				scope.zoomOut();

			}

			zoomStart.copy( zoomEnd );

		} else if ( state === STATE.PAN ) {

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userZoom === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.zoomOut();

		} else {

			scope.zoomIn();

		}

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userPan === false ) return;

		switch ( event.keyCode ) {

			/*case scope.keys.UP:
				scope.pan( new THREE.Vector3( 0, 1, 0 ) );
				break;
			case scope.keys.BOTTOM:
				scope.pan( new THREE.Vector3( 0, - 1, 0 ) );
				break;
			case scope.keys.LEFT:
				scope.pan( new THREE.Vector3( - 1, 0, 0 ) );
				break;
			case scope.keys.RIGHT:
				scope.pan( new THREE.Vector3( 1, 0, 0 ) );
				break;
			*/
			case scope.keys.ROTATE:
				state = STATE.ROTATE;
				break;
			case scope.keys.ZOOM:
				state = STATE.ZOOM;
				break;
			case scope.keys.PAN:
				state = STATE.PAN;
				break;
				
		}

	}
	
	function onKeyUp( event ) {

		switch ( event.keyCode ) {

			case scope.keys.ROTATE:
			case scope.keys.ZOOM:
			case scope.keys.PAN:
				state = STATE.NONE;
				break;
		}

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	window.addEventListener( 'keydown', onKeyDown, false );
	window.addEventListener( 'keyup', onKeyUp, false );

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );

/*
    Three.js "tutorials by example"
    Author: Lee Stemkoski
    Date: July 2013 (three.js v59dev)
 */

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var sphere1;
var globalSphere2;
var globalSphere3;
var globalSphere4;
var globalSphere5;
var sprite1;
var sprite2;
var sprite3;
var sprite4;
var mouse= {};
var targetList = []
// custom global variables
var cube;
var wireframeMaterial2 = new THREE.MeshBasicMaterial( { color: "white", wireframe: true, transparent: true } ); 
var wireframeMaterial = new THREE.MeshBasicMaterial( { color: "#ffd700", wireframe: true, transparent: true } ); 
var projector = new THREE.Projector();
var raycaster = new THREE.Raycaster();
init();
var state = {current_page: "home", objects: {}};
console.log(state);
animate();
// FUNCTIONS        
function init() 
{
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,150,400);
    camera.lookAt(scene.position);  
    // RENDERER
    if ( Detector.webgl )
        renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
        renderer = new THREE.CanvasRenderer(); 

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    
    document.body.appendChild( renderer.domElement );
    // EVENTS
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    // CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    // STATS
    //controls.userZoom = false;


    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    scene.add(light);

    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
    // scene.add(skyBox);
    scene.fog = new THREE.FogExp2( 'black', 0.00025 );
    
    ////////////
    // CUSTOM //
    ////////////
    // Sphere parameters: radius, segments along width, segments along height
    var sphereGeom =  new THREE.SphereGeometry( 50, 16 , 16 );
    
    // Basic wireframe materials.
   
        
    // Creating three spheres to illustrate wireframes.
    var sphere = new THREE.Mesh( sphereGeom, wireframeMaterial2 );
    sphere.position.set(0, 50, 0);
    sphere1 = sphere;
    scene.add( sphere );

    var spritey = makeTextSprite( "[web]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey.position.set(-100 , 0, 0);
    sprite1 = spritey
    scene.add(spritey);

    var spritey2 = makeTextSprite( "[video]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey2.position.set(100 , 0, 0);
    sprite2 = spritey2
    scene.add(spritey2);

    var spritey3 = makeTextSprite( "[images]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey3.position.set(0 , 0, 100);
    sprite3 = spritey3;
    scene.add(spritey3);

    var spritey4 = makeTextSprite( "[me]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey4.position.set(0 , 0, -100);
    sprite4 = spritey4;
    scene.add(spritey4);

    var sphereGeom2 = new THREE.SphereGeometry( 10, 8, 8);
    var sphere2 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere2.position.set(-100, 50, 0);
    targetList.push(sphere2);
    globalSphere2 = sphere2;

    scene.add(sphere2);

    var sphere3 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere3.position.set(100, 50, 0);
    globalSphere3 = sphere3;
    targetList.push(sphere3);
    scene.add(sphere3);

    var sphere4 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere4.position.set(0, 50, 100);
    globalSphere4 = sphere4
    targetList.push(sphere4);
    sphere.position.needsUpdate = true;
    sphere.geometry.dynamic = true;
    scene.add(sphere4);

    var sphere5 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere5.position.set(0, 50, -100);
    globalSphere5 = sphere5;
    targetList.push(sphere4);
    scene.add(sphere5);
    
    // Create a sphere then put the wireframe over it.    
    
    //scene.add( sphereWire );    
    
    // This sphere is created using an array containing both materials above.
    //var sphere = THREE.SceneUtils.createMultiMaterialObject( 
      //  sphereGeom.clone(), multiMaterial );
    //sphere.position.set(150, 50, 0);
    //scene.add( sphere );        
}

function animate() 
{
    if(state.current_page === "home"){
      requestAnimationFrame( animate );
      render();       
      update();
    } else{
        false;
    }
   

}

function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};
    
    var fontface = parameters.hasOwnProperty("fontface") ? 
        parameters["fontface"] : "Arial";
    
    var fontsize = parameters.hasOwnProperty("fontsize") ? 
        parameters["fontsize"] : 18;
    
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
        parameters["borderThickness"] : 4;
    
    var borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

    var spriteAlignment = THREE.SpriteAlignment.topLeft;
        
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    
    // get size data (height depends only on font size)
    var metrics = context.measureText( message );
    var textWidth = metrics.width;
    
    // background color
    context.fillStyle   =  "rgba(0,0,0,0)";
    // border color
    context.strokeStyle = "rgba(0,0,0,0)";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.
    
    // text color
    context.fillStyle = "rgba(255, 255, 255, 1.0)";

    context.fillText( message, borderThickness, fontsize + borderThickness);
    
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( 
        { map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(100 ,50,1.0);
    return sprite;  
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();   
}

function update()
{
    if ( keyboard.pressed("z") ) 
    { 
        // do something
    }
    camera.position.x = 300 * Math.sin(Date.now()* 0.0003);
    camera.position.z = 300 * Math.cos(Date.now()* 0.0003);
    sphere1.position.y = 20 + 10 * Math.cos(Date.now()* 0.0005);
    globalSphere2.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite1.position.y = (15 * Math.sin(Date.now()* 0.0006))+ 12;
    globalSphere3.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +25;
    sprite2.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere4.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite3.position.y = (15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere5.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;

    
    controls.update();

}

function render() 
{
    renderer.render( scene, camera );
}



$(document).ready(function(){
  $('.web').on("mouseout", function(){
    globalSphere2.material = wireframeMaterial2;
  });

  $('.web').on("mouseover", function(){
    globalSphere2.material = wireframeMaterial;
  });

});

$(document).ready(function(){
  $('.video').on("mouseout", function(){
    globalSphere3.material = wireframeMaterial2;
  });

  $('.video').on("mouseover", function(){
    globalSphere3.material = wireframeMaterial;
  });

});

$(document).ready(function(){
  $('.images').on("mouseout", function(){
    globalSphere4.material = wireframeMaterial2;
  });

  $('.images').on("mouseover", function(){
    globalSphere4.material = wireframeMaterial;
  });

});

$(document).ready(function(){
  $('.about-me').on("mouseout", function(){
    globalSphere5.material = wireframeMaterial2;
  });

  $('.about-me').on("mouseover", function(){
    globalSphere5.material = wireframeMaterial;
  });

});

/*$(document).click(function( event ) {

                event.preventDefault();

                var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
                projector.unprojectVector( vector, camera );

                var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
                var material = new THREE.LineBasicMaterial({color: "white"});
                var geom = new THREE.Geometry();
                geom.vertices.push(camera.position);
                geom.vertices.push(vector.sub( camera.position ).normalize() );
                line = new THREE.Line(geom, material);
                scene.add(line);
                
                var intersects = raycaster.intersectObjects( targetList );
                console.log(intersects);
                if ( intersects.length > 0 ) {
                    console.log(intersects);
                    intersects[ 0 ].object.material = wireframeMaterial;

                    var particle = new THREE.Sprite();
                    particle.position = intersects[ 0 ].point;
                    particle.scale.x = particle.scale.y = 8;
                    scene.add( particle );
                }

                

})*/
   


  
    


$(document).ready(function(){
  $('h1').on("mouseout", function(){
    sphere1.material = wireframeMaterial2;
  });

  $('h1').on("mouseover", function(){
    sphere1.material = wireframeMaterial;
  });

});



//

$(document).ready(function(){
  $('.images').on("click", function(){
    state.current_page = "imagesTransition"
    $( ".images" ).off();
    $( ".web").off();
    $(".about-me").off();
    $(".video").off();
    rebindNav();
    $('h2').text("[ images ]");

    imagesTransition();
    
  })
})


var imagesTransition = function(){
  if(state.current_page === "imagesTransition"){
    requestAnimationFrame( imagesTransition );
    render();       
    updateImagesTransition();
  } else{
    initImages();
    imagesTransition2();

  };


};

var spherePos = 100;
var subtractedVal = -0.0035;


var updateImagesTransition = function(){
  if ((sprite1.material.opacity > 0) || (spherePos > 0)){
    camera.position.x = 300 * Math.sin(Date.now()* 0.0003);
    camera.position.z = 300 * Math.cos(Date.now()* 0.0003);
    sphere1.position.y = 20 + 10 * Math.cos(Date.now()* 0.0005);
    globalSphere2.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite1.position.y = (15 * Math.sin(Date.now()* 0.0006))+ 12;
    globalSphere3.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +25;
    sprite2.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
    sprite3.position.y = (15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere5.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
   

   globalSphere2.material.opacity +=  subtractedVal;
   globalSphere3.material.opacity +=  subtractedVal;
   sprite1.material.opacity += subtractedVal * 2;
   sprite2.material.opacity += subtractedVal * 2;
   sprite3.material.opacity += subtractedVal * 2;
   
   sprite4.material.opacity += subtractedVal * 2;
   if(sphere1.material.opacity < 0){
     scene.remove(sphere1);
   };

   
   globalSphere5.material.opacity +=  subtractedVal;
   subtractedVal += 0.000001;
   globalSphere4.position.z = spherePos;
   globalSphere4.position.y += -0.3;
   
   globalSphere4.scale.x += 0.009;
   globalSphere4.scale.y += 0.009;
   globalSphere4.scale.z += 0.009;

   spherePos = spherePos - 0.5;
   controls.update();

  } else {
    state.current_page = "imagesTransition2";
    scene.remove(sphere1);
    scene.remove(globalSphere2);
    scene.remove(globalSphere3);
    scene.remove(globalSphere5);

  }
}


var imagesTransition2 = function(){
  if(state.current_page === "imagesTransition2"){
    requestAnimationFrame( imagesTransition2 );
    render();       
    updateImagesTransition2();
  } else{
    false;
};
};




var initImages = function(){
  $('#content').html($('#images').html());
  setTimeout(function(){$('#content').animate({ opacity: 1 }, 2000 );
  }, 200)
}

var updateImagesTransition2 = function(){
  globalSphere4.rotation.y +=  1 * Math.PI / 200;
  if(globalSphere4.position.y > -50){
    globalSphere4.position.y += -0.4
  } 
  controls.update();


}


//video



$(document).ready(function(){
  $('.video').on("click", function(){
    state.current_page = "videoTransition"
    $( ".images" ).off();
    $( ".web").off();
    $(".about-me").off();
    $(".video").off();
    rebindNav();
    $('h2').text("[ video ]");

    videoTransition();
    
  })
})


var videoTransition = function(){
  if(state.current_page === "videoTransition"){
    requestAnimationFrame( videoTransition );
    render();       
    updateVideoTransition();
  } else{
    initVideo();
    videoTransition2();

  };


};

var spherePos = 100;
var subtractedVal = -0.0035;


var updateVideoTransition = function(){
  if ((sprite1.material.opacity > 0) || (spherePos > 0)){
    camera.position.x = 300 * Math.sin(Date.now()* 0.0003);
    camera.position.z = 300 * Math.cos(Date.now()* 0.0003);
    sphere1.position.y = 20 + 10 * Math.cos(Date.now()* 0.0005);
    globalSphere2.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite1.position.y = (15 * Math.sin(Date.now()* 0.0006))+ 12;
    globalSphere4.position.y = (15 * Math.sin(Date.now()* 0.0006)) +25;
    sprite2.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
    sprite3.position.y = (15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere5.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
   

   globalSphere2.material.opacity +=  subtractedVal;
   globalSphere4.material.opacity +=  subtractedVal;
   sprite1.material.opacity += subtractedVal * 2;
   sprite2.material.opacity += subtractedVal * 2;
   sprite3.material.opacity += subtractedVal * 2;
   
   sprite4.material.opacity += subtractedVal * 2;
   if(sphere1.material.opacity < 0){
     scene.remove(sphere1);
   };

   
   globalSphere5.material.opacity +=  subtractedVal;
   subtractedVal += 0.000001;
   globalSphere3.position.x = spherePos;
   globalSphere3.position.y += -0.25
   
   globalSphere3.scale.x += 0.01;
   globalSphere3.scale.y += 0.01;
   globalSphere3.scale.z += 0.01;

   spherePos = spherePos - 0.5;
   controls.update();

  } else {
    state.current_page = "videoTransition2";
    scene.remove(sphere1);
    scene.remove(globalSphere2);
    scene.remove(globalSphere4);
    scene.remove(globalSphere5);

  }
}


var videoTransition2 = function(){
  if(state.current_page === "videoTransition2"){
    requestAnimationFrame( videoTransition2 );
    render();       
    updateVideoTransition2();
  } else{
    false;
};
};




var initVideo = function(){
  $('#content').html($('#video').html());

  setTimeout(function(){
    $('#content').animate({ opacity: 1 }, 2000 );
  }, 200)
}

var updateVideoTransition2 = function(){
  if(globalSphere3.position.y > -50){
    globalSphere3.position.y += -0.4
  } 
  globalSphere3.rotation.y +=  1 * Math.PI / 200;
  




  controls.update();


}

//me



$(document).ready(function(){
  $('.about-me').on("click", function(){
    state.current_page = "meTransition"
    $( ".images" ).off();
    $( ".web").off();
    $(".about-me").off();
    $(".video").off();
    rebindNav();
    $('h2').text("[ me ]");

    meTransition();
    
  })
})


var meTransition = function(){
  if(state.current_page === "meTransition"){
    requestAnimationFrame( meTransition );
    render();       
    updateMeTransition();
  } else{
    initMe();
    meTransition2();

  };


};

var alternateSpherePos = -100;



var updateMeTransition = function(){
  if ((sprite1.material.opacity > 0) || (alternateSpherePos < 0)){
    camera.position.x = 300 * Math.sin(Date.now()* 0.0003);
    camera.position.z = 300 * Math.cos(Date.now()* 0.0003);
    sphere1.position.y = 20 + 10 * Math.cos(Date.now()* 0.0005);
    globalSphere2.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite1.position.y = (15 * Math.sin(Date.now()* 0.0006))+ 12;
    globalSphere4.position.y = (15 * Math.sin(Date.now()* 0.0006)) +25;
    sprite2.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
    sprite3.position.y = (15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere3.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
   

   globalSphere2.material.opacity +=  subtractedVal;
   globalSphere4.material.opacity +=   subtractedVal;
   sprite1.material.opacity +=  subtractedVal * 2;
   sprite2.material.opacity += subtractedVal * 2;
   sprite3.material.opacity += subtractedVal * 2;
   
   sprite4.material.opacity += subtractedVal * 2;
   if(sphere1.material.opacity < 0){
     scene.remove(sphere1);
   };

   
   globalSphere3.material.opacity +=  subtractedVal;
   subtractedVal += 0.000001;
   globalSphere5.position.z = alternateSpherePos;
   globalSphere5.position.y += -0.25
   
   globalSphere5.scale.x += 0.01;
   globalSphere5.scale.y += 0.01;
   globalSphere5.scale.z += 0.01;

   alternateSpherePos = alternateSpherePos + 0.5;
   controls.update();

  } else {
    state.current_page = "meTransition2";
    scene.remove(sphere1);
    scene.remove(globalSphere2);
    scene.remove(globalSphere4);
    scene.remove(globalSphere3);

  }
}


var meTransition2 = function(){
  if(state.current_page === "meTransition2"){
    requestAnimationFrame( meTransition2 );
    render();       
    updateMeTransition2();
  } else{
    false;
};
};




var initMe = function(){
  $('#content').html($('#me').html());

  setTimeout(function(){
    $('#content').animate({ opacity: 1 }, 2000 );
    $('#info').animate({right: "0", opacity: 1}, 2000);
  }, 200)
}

var updateMeTransition2 = function(){
  if(globalSphere5.position.y > -50){
    globalSphere5.position.y += -0.4
  } 
  globalSphere5.rotation.y +=  1 * Math.PI / 200;
  




  controls.update();


}




//web



$(document).ready(function(){
  $('.web').on("click", function(){
    state.current_page = "webTransition"
    $( ".images" ).off();
    $( ".web").off();
    $(".about-me").off();
    $(".video").off();
    rebindNav();
    $('h2').text("[ web ]");

    webTransition();
    
  })
})


var webTransition = function(){
  if(state.current_page === "webTransition"){
    requestAnimationFrame( webTransition );
    render();       
    updateWebTransition();
  } else{
    initWeb();
    webTransition2();

  };


};

var alternateSpherePos = -100;



var updateWebTransition = function(){
  if ((sprite1.material.opacity > 0) || (alternateSpherePos < 0)){
    camera.position.x = 300 * Math.sin(Date.now()* 0.0003);
    camera.position.z = 300 * Math.cos(Date.now()* 0.0003);
    sphere1.position.y = 20 + 10 * Math.cos(Date.now()* 0.0005);
    globalSphere5.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite1.position.y = (15 * Math.sin(Date.now()* 0.0006))+ 12;
    globalSphere4.position.y = (15 * Math.sin(Date.now()* 0.0006)) +25;
    sprite2.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
    sprite3.position.y = (15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere3.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
   

   globalSphere5.material.opacity +=  subtractedVal;
   globalSphere4.material.opacity +=   subtractedVal;
   sprite1.material.opacity +=  subtractedVal * 2;
   sprite2.material.opacity += subtractedVal * 2;
   sprite3.material.opacity += subtractedVal * 2;
   
   sprite4.material.opacity += subtractedVal * 2;
   if(sphere1.material.opacity < 0){
     scene.remove(sphere1);
   };

   
   globalSphere3.material.opacity +=  subtractedVal;
   subtractedVal += 0.000001;
   globalSphere2.position.x = alternateSpherePos;
   globalSphere2.position.y += -0.25
   
   globalSphere2.scale.x += 0.01;
   globalSphere2.scale.y += 0.01;
   globalSphere2.scale.z += 0.01;

   alternateSpherePos = alternateSpherePos + 0.5;
   controls.update();

  } else {
    state.current_page = "webTransition2";
    scene.remove(sphere1);
    scene.remove(globalSphere5);
    scene.remove(globalSphere4);
    scene.remove(globalSphere3);

  }
}


var webTransition2 = function(){
  if(state.current_page === "webTransition2"){
    requestAnimationFrame( webTransition2 );
    render();       
    updateWebTransition2();
  } else{
    false;
};
};




var initWeb = function(){
  $('#content').html($('#web').html());

  setTimeout(function(){
    $('#content').animate({ opacity: 1 }, 2500 );
  }, 200)
  
  
  //$('h1').animate({ opacity: 0 }, 2000 );
  

}

var updateWebTransition2 = function(){
  if(globalSphere2.position.y > -50){
    globalSphere2.position.y += -0.4
  } 
  
  globalSphere2.rotation.y +=  1 * Math.PI / 200;
  




  controls.update();


}


var rebindNav = function(){
  $('.about-me').on("click", function(){
    $('#content').animate({opacity: 0}, 2000, function(){
      $("#content").html($('#me').html());
      $('h2').text("[ me ]");
      $('#info').animate({right: "0", opacity: 1}, 2000);
      $('#content').animate({opacity: 1}, 2000);
    })
  })

  $('.web').on("click", function(){
    $('#content').animate({opacity: 0}, 2000, function(){
      $("#content").html($('#web').html());
      $('h2').text("[ web ]");
      $('#info').animate({right: "-400", opacity: 0}, 2000);
      $('#content').animate({opacity: 1}, 2000);
    })
  })

   $('.images').on("click", function(){
    $('#content').animate({opacity: 0}, 2000, function(){
      $("#content").html($('#images').html());
      $('h2').text("[ images ]");
      $('#info').animate({right: "-400", opacity: 0}, 2000);
      $('#content').animate({opacity: 1}, 2000);
    })
  })

  $('.video').on("click", function(){
    $('#content').animate({opacity: 0}, 2000, function(){
      $("#content").html($('#video').html());
      $('h2').text("[ video ]");
      $('#info').animate({right: "+=-400", opacity: 0}, 2000);
      $('#content').animate({opacity: 1}, 2000);
    })
  })
}


;
'use strict';void 0===Date.now&&(Date.now=function(){return(new Date).valueOf()});
var TWEEN=TWEEN||function(){var a=[];return{REVISION:"11dev",getAll:function(){return a},removeAll:function(){a=[]},add:function(c){a.push(c)},remove:function(c){c=a.indexOf(c);-1!==c&&a.splice(c,1)},update:function(c){if(0===a.length)return!1;for(var b=0,d=a.length,c=void 0!==c?c:"undefined"!==typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now();b<d;)a[b].update(c)?b++:(a.splice(b,1),d--);return!0}}}();
TWEEN.Tween=function(a){var c={},b={},d={},e=1E3,g=0,h=!1,n=0,l=null,v=TWEEN.Easing.Linear.None,w=TWEEN.Interpolation.Linear,p=[],q=null,r=!1,s=null,t=null,j;for(j in a)c[j]=parseFloat(a[j],10);this.to=function(a,c){void 0!==c&&(e=c);b=a;return this};this.start=function(e){TWEEN.add(this);r=!1;l=void 0!==e?e:"undefined"!==typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now();l+=n;for(var f in b){if(b[f]instanceof Array){if(0===b[f].length)continue;
b[f]=[a[f]].concat(b[f])}c[f]=a[f];!1===c[f]instanceof Array&&(c[f]*=1);d[f]=c[f]||0}return this};this.stop=function(){TWEEN.remove(this);return this};this.delay=function(a){n=a;return this};this.repeat=function(a){g=a;return this};this.yoyo=function(a){h=a;return this};this.easing=function(a){v=a;return this};this.interpolation=function(a){w=a;return this};this.chain=function(){p=arguments;return this};this.onStart=function(a){q=a;return this};this.onUpdate=function(a){s=a;return this};this.onComplete=
function(a){t=a;return this};this.update=function(m){var f;if(m<l)return!0;!1===r&&(null!==q&&q.call(a),r=!0);var i=(m-l)/e,i=1<i?1:i,j=v(i);for(f in b){var u=c[f]||0,k=b[f];k instanceof Array?a[f]=w(k,j):("string"===typeof k&&(k=u+parseFloat(k,10)),"number"===typeof k&&(a[f]=u+(k-u)*j))}null!==s&&s.call(a,j);if(1==i)if(0<g){isFinite(g)&&g--;for(f in d)"string"===typeof b[f]&&(d[f]+=parseFloat(b[f],10)),h&&(i=d[f],d[f]=b[f],b[f]=i),c[f]=d[f];l=m+n}else{null!==t&&t.call(a);f=0;for(i=p.length;f<i;f++)p[f].start(m);
return!1}return!0}};
TWEEN.Easing={Linear:{None:function(a){return a}},Quadratic:{In:function(a){return a*a},Out:function(a){return a*(2-a)},InOut:function(a){return 1>(a*=2)?0.5*a*a:-0.5*(--a*(a-2)-1)}},Cubic:{In:function(a){return a*a*a},Out:function(a){return--a*a*a+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*a:0.5*((a-=2)*a*a+2)}},Quartic:{In:function(a){return a*a*a*a},Out:function(a){return 1- --a*a*a*a},InOut:function(a){return 1>(a*=2)?0.5*a*a*a*a:-0.5*((a-=2)*a*a*a-2)}},Quintic:{In:function(a){return a*a*a*
a*a},Out:function(a){return--a*a*a*a*a+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*a*a*a:0.5*((a-=2)*a*a*a*a+2)}},Sinusoidal:{In:function(a){return 1-Math.cos(a*Math.PI/2)},Out:function(a){return Math.sin(a*Math.PI/2)},InOut:function(a){return 0.5*(1-Math.cos(Math.PI*a))}},Exponential:{In:function(a){return 0===a?0:Math.pow(1024,a-1)},Out:function(a){return 1===a?1:1-Math.pow(2,-10*a)},InOut:function(a){return 0===a?0:1===a?1:1>(a*=2)?0.5*Math.pow(1024,a-1):0.5*(-Math.pow(2,-10*(a-1))+2)}},Circular:{In:function(a){return 1-
Math.sqrt(1-a*a)},Out:function(a){return Math.sqrt(1- --a*a)},InOut:function(a){return 1>(a*=2)?-0.5*(Math.sqrt(1-a*a)-1):0.5*(Math.sqrt(1-(a-=2)*a)+1)}},Elastic:{In:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return-(b*Math.pow(2,10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4))},Out:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return b*Math.pow(2,-10*a)*Math.sin((a-c)*
2*Math.PI/0.4)+1},InOut:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return 1>(a*=2)?-0.5*b*Math.pow(2,10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4):0.5*b*Math.pow(2,-10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4)+1}},Back:{In:function(a){return a*a*(2.70158*a-1.70158)},Out:function(a){return--a*a*(2.70158*a+1.70158)+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*(3.5949095*a-2.5949095):0.5*((a-=2)*a*(3.5949095*a+2.5949095)+2)}},Bounce:{In:function(a){return 1-
TWEEN.Easing.Bounce.Out(1-a)},Out:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+0.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+0.9375:7.5625*(a-=2.625/2.75)*a+0.984375},InOut:function(a){return 0.5>a?0.5*TWEEN.Easing.Bounce.In(2*a):0.5*TWEEN.Easing.Bounce.Out(2*a-1)+0.5}}};
TWEEN.Interpolation={Linear:function(a,c){var b=a.length-1,d=b*c,e=Math.floor(d),g=TWEEN.Interpolation.Utils.Linear;return 0>c?g(a[0],a[1],d):1<c?g(a[b],a[b-1],b-d):g(a[e],a[e+1>b?b:e+1],d-e)},Bezier:function(a,c){var b=0,d=a.length-1,e=Math.pow,g=TWEEN.Interpolation.Utils.Bernstein,h;for(h=0;h<=d;h++)b+=e(1-c,d-h)*e(c,h)*a[h]*g(d,h);return b},CatmullRom:function(a,c){var b=a.length-1,d=b*c,e=Math.floor(d),g=TWEEN.Interpolation.Utils.CatmullRom;return a[0]===a[b]?(0>c&&(e=Math.floor(d=b*(1+c))),g(a[(e-
1+b)%b],a[e],a[(e+1)%b],a[(e+2)%b],d-e)):0>c?a[0]-(g(a[0],a[0],a[1],a[1],-d)-a[0]):1<c?a[b]-(g(a[b],a[b],a[b-1],a[b-1],d-b)-a[b]):g(a[e?e-1:0],a[e],a[b<e+1?b:e+1],a[b<e+2?b:e+2],d-e)},Utils:{Linear:function(a,c,b){return(c-a)*b+a},Bernstein:function(a,c){var b=TWEEN.Interpolation.Utils.Factorial;return b(a)/b(c)/b(a-c)},Factorial:function(){var a=[1];return function(c){var b=1,d;if(a[c])return a[c];for(d=c;1<d;d--)b*=d;return a[c]=b}}(),CatmullRom:function(a,c,b,d,e){var a=0.5*(b-a),d=0.5*(d-c),g=
e*e;return(2*c-2*b+a+d)*e*g+(-3*c+3*b-2*a-d)*g+a*e+c}}};
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//




//= requite site.js.coffee






//= requrie tween.min.js



;
