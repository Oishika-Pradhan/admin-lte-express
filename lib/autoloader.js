/**
 * Module dependencies.
 */
var fs = require('fs');

module.exports = function(parentApp, options) {
  var verbose = options.verbose;
  fs.readdirSync(__dirname + '/../controllers').forEach(function(name) {
    verbose && console.log('\n   %s:', name);
    var obj    = require('../controllers/' + name);
    var name   = obj.name || name;
    var prefix = obj.prefix || '';
    var engine = obj.engine || 'handlebars';
    var before = obj.before || false;
    var method;
    var path;
    var routeName;

    // generate routes based
    // on the exported methods
    for (var key in obj) {
      // "reserved" exports
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
      // route exports
      switch (key) {
        case 'show':
          method = 'get';
          path = '/' + name + '/:' + name + '_id';
          break;
        case 'list':
          method = 'get';
          path = '/' + name + 's';
          break;
        case 'edit':
          method = 'get';
          path = '/' + name + '/:' + name + '_id/edit';
          break;
        case 'update':
          method = 'put';
          path = '/' + name + '/:' + name + '_id';
          break;
        case 'create':
          method = 'post';
          path = '/' + name;
          break;
        case 'index':
          method = 'get';
          path = '/';
          break;
        default:
          method = 'get';
          path = '/' + key;
      }

      path = prefix + path;
      routeName = name + '.' + key;

      if (before) {
        parentApp[method](path, routeName, before, obj[key]);
        verbose && console.log('     %s %s -> before -> %s', method.toUpperCase(), path, routeName);
      }
      else {
        parentApp[method](path, routeName, obj[key]);
        verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, routeName);
      }
    }
  });
};