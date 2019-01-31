/*

*/
DG.Soundscreen.DataStorage = DG.Class.extend({

	options: {},

	

	get: function(path) {
		if (!path || typeof path !== 'string') {
			return null
		}

		return path.split('.')
		.reduce(function(m, i) {
			return m && typeof m == 'object' ? m[i] : null;
		}, this.options);
	},

	set: function(path, source) {
		if (typeof path == 'object') {
			return DG.setOptions(this, path)
		}
		var route = this._getRoute(path);

		if (!route) {
			return null
		}
		if (route.prop == '*' && typeof source == 'object') {
			for (var k in route.dest) {
				this._setProp(route.dest, k, source)
			}
			return route.dest
		}
		return this._setProp(route.dest, route.prop, source)
	},

	_setProp: function(dest, prop, source) {
		if (dest[prop] && typeof dest[prop] == 'object' && typeof source == 'object') {
			DG.extend(dest[prop], source)
		} else {
			dest[prop] = source
		}

		return dest[prop]
	},

	_getRoute: function(path) {

		if (!path || typeof path !== 'string') {
			return
		}

		path = ('options.' + path).split('.');
		var prop = path.pop();
		var parent =  path
		.reduce(function(m, i) {
			return m && typeof m == 'object' ? m[i] : null;
		}, this);
		if (parent && typeof parent =='object') {
			return {
				dest: parent,
				prop: prop,
			}
		}
	},

	each: function(fn, cont, path) {
		cont = cont || this.options;
		path = path || '';
		for (var k in cont) {
			var res = fn(cont[k], k, path);

			if (res == 'continue' || !cont[k] || typeof cont[k] !== 'object') {
				continue
			}
			this.each(fn, cont[k], path ? path+'.'+k : k)
		}
	}

});