
DG.Soundscreen.Control.Select = DG.Soundscreen.Collection.extend({

	check: function() {
		var item = this.get();
		if (this.multiple) {
			item.checked = !item.checked;
			this.options.value = this.checked()
			.map(function(item) {
				return item.value
			})
			.join(',');
		} else {
			if (item.checked) {
				return
			}
			this._items.forEach(function(item) {
				item.checked = false;
			})
			item.checked = true;
			this.options.value = item.value;
		}
		if (this.options.parent && this.options.parent._onchange && typeof this.options.parent._onchange == 'function') {
			this.options.parent._onchange(this.options.value)
		}
	},

	checked: function() {
		return this._items.filter(function(item) {
				return item.checked;
			})
	},

	info: function() {
		return this.get()? this.get() + ' ' + this.current +' '+ this.ui.locale.t('from') +' '+ this.size : this.status()
	},

	status: function() {
		return this.ui.locale.t(this._name) +', '+ this.ui.locale.t('choise_value') +': '+ this.ui.locale.t('n_item', this.size)
	},

	enter: function() {
		this.check();
		this.view();
	},

	explore: function() {
		this.enter()
	},

	addHooks: function() {
		this.ui.play('listview');
		this.ui.status(this.status())
		this.ui.out(this.status())
		this.ui.out(this.info(), 2)
	},

	removeHooks: function() {
		
	}

});

/*
*/
