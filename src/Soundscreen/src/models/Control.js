DG.Soundscreen.Control = DG.Class.extend({

	options: {
		name: 'noname',
		value: '',
		config: {}
	},

	initialize: function(soundscreen, options) {
		options = options || {};
		DG.Util.setOptions(this, options);
		this.soundscreen = soundscreen;
		this.ui = soundscreen.ui;
		this.locale = new DG.Soundscreen.Locale(soundscreen._map);
	},

	open: function() {
		if (this.disabled) {
			return this.ui.out(this.toString())
		}
		
		this.selectSetup();
		this.ui.setFocus(this.select)
	},

	selectSetup: function() {
		if (this.select) {
			return this.select
		}
		this.select = new DG.Soundscreen.Control.Select(this.soundscreen, {
			name: this.name(),
			value: this.options.value,
			caller: this.options.parent,
			parent: this,
		});
		var values = [],
		config = this.options.config || {};

		switch (config.type) {
			case 'range': //'range':
			values = DG.Soundscreen.tools.createRange(config.min, config.max, config.step);
			break;
			case 'set':
			this.select.multiple = true;
			values = config.values;
			break;
			case 'enum':
			values = config.values;
			break;
			default:
			values = [false, true];
		}
	values.forEach(function(item, i) {
		var option = new DG.Soundscreen.MenuItem(this.soundscreen, {
				name: item.toString(),
				value: item
			})
			var value = this.options.value.toString();
			if (value == item || value.indexOf(item) !== -1) {
				option.checked = true;
				this.select._current = i;
			}
			this.select.add(option)
		}, this)
	},

	_onchange: function(value) {
		this.options.value = value;
		if (typeof this.options.onchange == 'function') {
			this.options.onchange({
				value: value,
				control: this
			});
		}
		if (this.options.config && typeof this.options.config.onchange == 'function') {
			this.options.config.onchange(value, this);
		}
	},

	value: function() {

		if (this.options.config.type == 'set') {
			return this.options.value.split(',')
			.map(function(item) {
				return this.locale.t(item)
			}, this)
			.join(',')
		}
		return this.locale.t(this.options.value)
	},

	name: function() {
		return this.options.config.label || this.options.name;
	},

	info: function() {
		return this.locale.t(this.name()) +': '+ this.value()
	},

	toString: function() {
		var disabled = this.options.disabled ? this.locale.t('disabled') : '';
		return this.info() +' '+ disabled;
	}

});
/*

*/