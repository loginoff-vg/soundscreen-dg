
DG.Soundscreen.Mobile = DG.Soundscreen.UI.extend({

	_onfocus: function(e) {
		e.stopPropagation();
		this.out()
	},

	_onkeydown:function(e) {
		if (!e.keyCode || this._pressedKeys[e.keyCode]) {
			return
		}
		this._pressedKeys[e.keyCode] = true;
		var key = this._keyMap[e.keyCode] || (e.key.length === 1 ? String.fromCharCode(e.keyCode) : e.key);
		var mode = new DG.Soundscreen.keyboard.ModeMap(e);
		if (!key || mode[key]) {
			this.tts.cancel();
			return
		}

		var data = {
			command: mode + key,
			key: key,
			code: e.keyCode,
			mode: mode,
			original: e
		};
		this.onInput(data);
		//this.fire(key, data);
	},

	_setup: function() {
		this._input = DG.DomUtil.create('div', 'soundscreen-ui-tuchinput', this._container);
		this._input.innerHTML='under construction...'; // Fisheye &#9673;
		DG.DomEvent.on(this._container, 'click', this._prevent)
	},
	_beforeRemove: function() {
		DG.DomEvent.off(this._container, 'click', this._prevent)
	},

	_prevent: function(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	},

	_events: function() {
		return {
			contextmenu: this._prevent,
			click: this._onfocus
		}
	},

	

   });