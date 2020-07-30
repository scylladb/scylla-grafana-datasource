// super-simple in-browser REPL for testing this thing
// to build:
//
// npm install -g browserify
// browserify repl.js -o repl-browser.js

var plugin = require('../babel-ng-annotate');

window.transform = function(code, es2015){

	return Babel.transform(code, {
		presets: es2015 ? [window.babelPresetEnv.default] : [],
		plugins: [plugin]
	});
}
