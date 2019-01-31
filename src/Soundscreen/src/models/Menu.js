
DG.Soundscreen.Menu = DG.Soundscreen.Collection.extend({

	addItems: function(data) {
		if (data && typeof data == 'object') {
			var items = DG.Soundscreen.tools.objectMap(data, {callback: function(key) {
				return new DG.Soundscreen.MenuItem(this.soundscreen, {
					parent: this,
					name: key,
					open: data[key]
				})
			}.bind(this)
			})
			this.setItems(items)
		}
	},

	sort: function() {},

	info: function() {
		return this.get()? this.get() + ' ' + this.current +' '+ this.ui.locale.t('from') +' '+ this.size : this.status()
	},

	status: function() {
		return this.ui.locale.t(this._name) +', '+ this.ui.locale.t('menu') +': '+ this.ui.locale.t('n_item', this.size)
	},

	enter: function(e) {
		var item = this.get();
		if (item && typeof item.open == 'function') {
			return item.open(this, e)
		}
		this.view();
	},

	explore: function() {
		this.view()
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
