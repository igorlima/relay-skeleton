require("source-map-support").install();
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _express = __webpack_require__(1);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _dataSchema = __webpack_require__(2);
	
	var _expressGraphql = __webpack_require__(5);
	
	var _expressGraphql2 = _interopRequireDefault(_expressGraphql);
	
	var _phantom = __webpack_require__(6);
	
	var _phantom2 = _interopRequireDefault(_phantom);
	
	var app = (0, _express2['default'])();
	
	// https://github.com/relayjs/relay-starter-kit/pull/20/files
	app.use(function (req, res, next) {
	  var oneof = false;
	  if (req.headers.origin && req.headers.origin.match(/^https?:[/][/]localhost/)) {
	    res.header('Access-Control-Allow-Origin', req.headers.origin);
	    oneof = true;
	  }
	  if (req.headers['access-control-request-method']) {
	    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
	    oneof = true;
	  }
	  if (req.headers['access-control-request-headers']) {
	    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
	    oneof = true;
	  }
	  if (oneof) {
	    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
	  }
	
	  // Intercept OPTIONS method.
	  if (oneof && req.method == 'OPTIONS') {
	    res.sendStatus(200);
	  } else {
	    next();
	  }
	});
	
	// https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage
	// https://www.npmjs.com/package/phantom
	app.use('/rendering-in-server', function (req, res) {
	
	  /**
	   * Running a Headless Browser on Heroku
	   * - https://discussion.heroku.com/t/running-a-headless-browser-on-heroku/97/2
	   * - https://github.com/stomita/heroku-buildpack-phantomjs
	   */
	
	  _phantom2['default'].create(function (phantom_process) {
	    phantom_process.createPage(function (page) {
	      // https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#webpage-onCallback
	      page.set('onCallback', function (data) {
	        data && data.done && page.evaluate(function () {
	          return document.getElementById('container').outerHTML;
	        }, function (result) {
	          res.send(result);
	          phantom_process.exit();
	        });
	      });
	      page.open("https://relay-hacking.herokuapp.com/");
	    });
	  });
	});
	
	app.use('/', (0, _expressGraphql2['default'])({ schema: _dataSchema.Schema, pretty: true }));
	app.listen(process.env.PORT || 8080, function (err) {
	  if (err) return console.error(err);
	  console.log('GraphQL Server is now running on localhost:' + (process.env.PORT || 8080));
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _graphql = __webpack_require__(3);
	
	var _graphqlRelay = __webpack_require__(4);
	
	var example = {
	  id: 1,
	  text: 'Hello World'
	};
	
	/**
	 * The first argument defines the way to resolve an ID to its object.
	 * The second argument defines the way to resolve a node object to its GraphQL type.
	 */
	
	var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
	  var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId);
	
	  var id = _fromGlobalId.id;
	  var type = _fromGlobalId.type;
	
	  if (type === 'Example') return example;
	  return null;
	}, function (obj) {
	  return exampleType;
	});
	
	var nodeInterface = _nodeDefinitions.nodeInterface;
	var nodeField = _nodeDefinitions.nodeField;
	
	var exampleType = new _graphql.GraphQLObjectType({
	  name: 'Example',
	  fields: function fields() {
	    return {
	      id: (0, _graphqlRelay.globalIdField)('Example'),
	      text: {
	        type: _graphql.GraphQLString,
	        description: 'Hello World'
	      }
	    };
	  },
	  interfaces: [nodeInterface]
	});
	
	var queryType = new _graphql.GraphQLObjectType({
	  name: 'Query',
	  fields: function fields() {
	    return {
	      node: nodeField,
	      example: {
	        type: exampleType,
	        resolve: function resolve() {
	          return example;
	        }
	      }
	    };
	  }
	});
	
	var Schema = new _graphql.GraphQLSchema({
	  query: queryType
	});
	exports.Schema = Schema;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("graphql");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("graphql-relay");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("express-graphql");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("phantom");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map