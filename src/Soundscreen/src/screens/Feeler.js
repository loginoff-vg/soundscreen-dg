
DG.Soundscreen.Feeler = DG.Handler.extend({

	initialize: function(soundscreen) {
		this.soundscreen = soundscreen;
		this._map = soundscreen._map;
		this.project = this._map.projectDetector.getProject();
		this.ui = soundscreen.ui;
		this.position = soundscreen.position;
		this.environs = new DG.Soundscreen.UnitsCollection(soundscreen);
		this.menuSetup();
		this.locale = new DG.Soundscreen.Locale(this._map);
		this._name = 'map_view';
		this._actions = this.getActions();
	},

	mapSize: function() {
		var b = this._map.getBounds();
		return {
			hight: b.getNorthEast().distanceTo(b.getSouthEast()),
			width: b.getSouthWest().distanceTo(b.getSouthEast())
		}
	},

	getStatus: function() {
		return this._status
	},

	setStatus: function() {
		return this._status = [
		this.locale.t(this._name),
			this.locale.t('step') + this.locale.formatDistance(this.getStep()),
			this.locale.t('zoom') + this._map.getZoom()
			//this.locale.t('map_width') + this.locale.formatDistance(m.width),
			//this.locale.t('map_hight') + this.locale.formatDistance(m.hight),
		].join(', ')
	},

	sayStatus: function() {
		this.ui.out(this._status)
	},

	repeat: function() {
		this.ui.out()
	},

	autoStep: function() {
		var zoom = -1*(this._map.getZoom() - 21);
		var digits = Math.floor(zoom/3);
		var base = (zoom%3)*2.5;
		return Math.pow(10, digits)*(base == 0 ? 1 : base);
	},

	setStep: function(value) {
		if (!value) {
			value = this.autoStep()
		}
		this._step = value;
	},

	getStep: function() {
		return this._step || 50;
	},

	update: function() {
		this.setStep();
		this.ui.status(this.setStatus())
		this.sayStatus();
	},

	centering: function(e) {
		e.mode.Ctrl ? this.position.centerBy() : this.position.toCenter();
	},

	move: function(e) {
		   var step = e.mode.Shift ? this.getStep()/5 : this.getStep();
		this.position.move(e.key, step, e.mode.Ctrl);
	},

	zoom: function(e) {
		e = e || {mode:{}};
		var pr =  this.project || {
			minZoom: 5,
			maxZoom: 18
		};
		   var z = this._map.getZoom();
		   var x = e.mode.Shift ? pr.minZoom : pr.maxZoom;
		if (z == x) {
			this.ui.play('restrict')
			.then(function() {
				this.sayStatus();
			}.bind(this));
			return
		}

		e.mode.Shift ? z-- : z++;
		this._map.setZoomAround(this.position.get(), z, {animate: false});
	},

	enter: function(e) {
		if (e.mode.Ctrl) {
			this.position.click()
			return
		}
		this.ui.setFocus(this.environs);
	},

	menu: function() {
		this.ui.setFocus(this._menu);
	},

	action: function(e) {
		var fn = this._actions[e.key];
		if (this.enable() && typeof fn == 'function') {
			return fn.call(this, e) || true
		}
		return false
	},

	getActions: function() {
		return {
		C: this.centering,
		S: this.sayStatus,
		Z: this.zoom,
		Up: this.move,
		Down: this.move,
		Left: this.move,
		Right: this.move,
		Enter: this.enter,
		Space: this.repeat,
		ContextMenu: this.menu
		}
	},

	getMenuActions: function() {
		return {
		centerBy: function() {
			this.position.centerBy();
			this.ui.setFocus(this);
		}.bind(this),
		toCenter: function() {
			this.position.toCenter();
			this.ui.setFocus(this);
		}.bind(this),
		zoomIn: function(c, e) {
			this.zoom();
			if (e.mode.Ctrl) {
				this.ui.setFocus(this);
			} else {
				this.update()
			}
			
		}.bind(this),
		zoomOut: function(c, e) {
			e.mode.Shift = true;
			this.zoom(e);
			if (e.mode.Ctrl) {
				this.ui.setFocus(this);
			} else {
				this.update()
			}
		}.bind(this),
		settings: function() {
			this.soundscreen.settingsControl.focus(this);
		}.bind(this)
		}
	},

	menuSetup: function() {
		this._menu = new DG.Soundscreen.Menu(this.soundscreen, {
			//name: 'main_menu',
			caller: this,
		});
		this._menu.addItems(this.getMenuActions())
	},

	caseOverUnit: function(collection, data) {
		var types = this.soundscreen.settings.get('geodata.requestGeounits');
		var found = types.split(',')
		.filter(function(t) {
			return t in data
		})
		if (!found[0]) {
			return false
		}
		this.ui.play('mapview');
		var id = data[found[0]].id;
		for (var i=0, len=collection.size; i < len; i++) {
			if (collection._items[i].data.id == id) {
				collection._items[i].underCursor = true;
				return collection._items[i]
			}
		}
	},

	research: function(e) {
		this.soundscreen.geoservice.getLocations({
			latlng: this.position.get(),
			zoom: 16
		}).then(function(data) {
			var label = this.soundscreen.clicker.parse(data);
			this.position.title(label);
			this.environs.update()
			.then(function(res) {
				var unit = this.caseOverUnit(res, data) || res.get();
				this.ui.out(unit);
				if (e.type == 'add') {
					this.ui.out(this.getStatus(), 1);
				}
			}.bind(this))
			.catch(function(err) {
				DG.Soundscreen.bug(err);
				this.ui.out(label);
				this.ui.out(this.environs.status(), 2)
			}.bind(this))
		}.bind(this))
		.catch(function() {
			var txt = this.locale.t('no_data');
			this.ui.out(txt);
			this.position.title(txt);
		}.bind(this));
	},

	_positionEvents: {
		restrict: function() {
			this.ui.play('bound')
			.catch(function() {
				this.out(this.locale.t('map_bound'), true)
			}.bind(this.ui))
		},

		move: function(e) {
			this.research(e)
			this.ui.play('pass');
		},
		add: function(e) {
			this.research(e)
		}
},

	onprojectchange: function(e) {
		this.project = e.getProject();
		this.ui.play('sputnik');
		if (this.project) {
			this.ui.out(this.ui.locale.t('project_change') + this.project.code, 1)
		}
	},

	onprojectleave: function() {
		if (this.project) {
			this.ui.out(this.ui.locale.t('project_leave') + this.project.code, 1)
		}
	},

	_mapEvents: function() {
		return {
			zoomend: this.update,
			projectleave: this.onprojectleave,
			projectchange: this.onprojectchange
		}
	},

	addHooks: function() {
		this.ui.play('success');
		this.setStep();
		this.ui.status(this.setStatus())
		this._map.on(this._mapEvents(), this);
		this.position
		.on(this._positionEvents, this)
		.fire('add');
	},

	removeHooks: function() {
		this.position
		.off(this._positionEvents, this)
		//.remove();
		this._map.off(this._mapEvents(), this);
	}

});
/*
*/
