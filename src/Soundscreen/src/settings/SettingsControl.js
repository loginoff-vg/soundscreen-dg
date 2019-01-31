
DG.Soundscreen.SettingsControl = DG.Class.extend({

	initialize: function(soundscreen) {
		this.soundscreen = soundscreen;
		this._map = soundscreen._map;
		this.locale = new DG.Soundscreen.Locale(soundscreen._map);
		this.settings = soundscreen.settings;
		this.config = soundscreen.settings.config;
		//this.menuSetup();
	},

	focus: function(caller) {
		this.soundscreen.ui.setFocus(this.getMenu(caller))
	},

	getMenu: function(caller) {
		if (!this._menu) {
			this._menu = new DG.Soundscreen.Menu(this.soundscreen, {
				name: 'settings'
			});
			var actions = {};
			for (var k in this.config.options) {
				actions[k] = this.groupView.bind(this, k)
			}
			this._menu.addItems(actions);
		}
		if (caller) {
			this._menu._caller = caller
		}
		return this._menu;
	},

	groupView: function(groupId) {
		var group = this.config.get(groupId);
		if (!group) {
			return
		}
		 
		var collection = new DG.Soundscreen.Menu(this.soundscreen, {
			name: groupId,
			caller: this._menu
		});
		for (var k in group) {
			collection.add(new DG.Soundscreen.Control(this.soundscreen, {
				parent: collection,
				name: k,
				value: this.settings.get(groupId+'.'+k),
				path: groupId+'.'+k,
				config: group[k],
				onchange: this.onChange.bind(this)
			}))
		}
		this.soundscreen.ui.setFocus(collection)
	},

	onChange: function(e) {
		this.settings.set(e.control.options.path, e.value)
	},


});