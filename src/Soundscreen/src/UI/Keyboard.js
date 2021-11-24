
DG.Soundscreen.keyboard = DG.Soundscreen.UI.extend({

	_pressedKeys: {},

	_keyMap: {
		13: 'Enter',
		16: 'Shift',
		17: 'Ctrl',
		18: 'Alt',
		32: 'Space',
		33: 'PageUp',
		34: 'PageDown',
		35: 'End',
		36: 'Home',
		37: 'Left',
		38: 'Up',
		39: 'Right',
		40: 'Down',
		46: 'Delete',
	},

	_onkeyup: function(e) {
		this._pressedKeys[e.keyCode] = false;
		if (e.keyCode == 39) {
			e.target.selectionStart = e.target.selectionEnd = 0
		}
	},

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
		this._BrowserTouch = DG.Browser.touch;
		DG.Browser.touch = false;
		var label = DG.DomUtil.create('label', 'soundscreen-ui-labelinput', this._container);
		label.innerHTML = 'Soundscreen:';
		this._input = DG.DomUtil.create('input', 'soundscreen-ui-keyboardinput', this._container);
		this._input.setAttribute('readonly', true);
		this._input.value='..'; //
		DG.DomEvent.on(this._container, 'click', this._prevent)
	},
	_beforeRemove: function() {
		DG.Browser.touch = this._BrowserTouch;
		DG.DomEvent.off(this._container, 'click', this._prevent)
	},

	_prevent: function(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	},

	_events: function() {
		return {
			keyup: this._onkeyup,
			keydown: this._onkeydown,
			contextmenu: this._prevent,
			focus: this._onfocus
		}
	},

	

   });
   
   DG.Soundscreen.keyboard.ModeMap = function(e) {
	   this.Ctrl = e.ctrlKey;
	this.Alt = e.altKey;
	this.Shift = e.shiftKey;
	this.Meta = e.metaKey;
};

Object.defineProperty(DG.Soundscreen.keyboard.ModeMap.prototype, 'toString', {
	value: function() {
		   var res = '';
		   for (var key in this) {
			   res += this[key] ? key : '';
		   }
		   return res;
	},
	innumerable: false
});