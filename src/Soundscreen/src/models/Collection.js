DG.Soundscreen.Collection = DG.Handler.extend({

	_name: '',

	initialize: function(soundscreen, options) {
		options = options || {};
		DG.Util.setOptions(this, options);
		this.soundscreen = soundscreen;
		this.ui = soundscreen.ui;
		this._actions = this.getActions();
		this._name = options.name || this._name;
		this._caller = options.caller || '';
		this.setItems(options.data)
	},

	setItems: function(data) {
		this.clear();
		if (DG.Util.isArray(data) && data.length) {
			this._current = 0;
				for (var i = 0, len = data.length; i < len; i++) {
				this.add(data[i])
			}
			this.sort();
		}
		return this;
	},

	add: function(item) {
		this._items.push(item);
	},

	clear: function() {
		this._items = [];
		this._current = -1;
	},

	next: function() {
		this._current = DG.Util.wrapNum(++this._current, [0, this._items.length])
return this.get();
	},

	prev: function() {
		this._current = DG.Util.wrapNum(--this._current, [0, this._items.length])
return this.get();
	},
	get: function(index) {
		index = index || this._current;
		return this._items[index];
	},

	sort: function() {
		this._items.sort();
	},

	status: function() {
		return this.ui.locale.t(this._name) +', '+ this.ui.locale.t('list_view') +': '+ this.ui.locale.t('n_item', this.size)
	},

	toString: function() {
		return this.status();
	},

	info: function() {
		return this.get()? this.get() + ' ' + this.current +' '+ this.ui.locale.t('from') +' '+ this.size : this.status()
	},

	view: function(e) {
		e = e || {};

		if (e.command == 'Up') {
			this.prev()
		}
		if (e.command == 'Down') {
			this.next()
		}
		this.ui.out(this.info())
	},

	enter: function(e) {
		var item = this.get();
		if (item && typeof item.open == 'function') {
			return item.open(this, e)
		}
		this.view();
	},

	back: function() {
		if (!this._caller || !this.ui.setFocus(this._caller)) {
			this.toRoot()
		}
	},

	toRoot: function() {
		this.ui.setFocus(this.soundscreen.feeler)
	},

	explore: function() {
		var item = this.get();
		if (item && typeof item.expand == 'function') {
			this._successor = item.expand();
			this._successor._caller = this;
			this.ui.setFocus(this._successor);
			return this._successor
		}
		this.view();
	},

	menu: function() {
		var item = this.get();
		if (item && typeof item.menu == 'function') {
			return item.menu()
		}
	},

	action: function(e) {
		var fn = this._actions[e.key];
		if (typeof fn == 'function') {
			return fn.call(this, e) || true
		}
		return false
	},

	getActions: function() {
		return {
		Enter: this.enter,
		Backspace: this.toRoot,
		Space: this.view,
		ContextMenu: this.menu,
		Up: this.view,
		Down: this.view,
		Left: this.back,
		Right: this.explore
		}
	},

	addHooks: function() {
		this.ui.play('listview');
		this.ui.status(this.status())
		this.ui.out(this.status())
	},

	removeHooks: function() {
		
	}

});
/*

*/
Object.defineProperty(DG.Soundscreen.Collection.prototype, 'size',{
			get: function() {
				return this._items.length
			}
		});
		Object.defineProperty(DG.Soundscreen.Collection.prototype, 'current',{
			get: function() {
				return this._current + 1
			},
			set: function(v) {
				v--;
				this._current = v < 0 ? 0 : v > this.size ? this.size : v;
			}
		});