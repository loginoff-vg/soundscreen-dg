
DG.Soundscreen.Audio = DG.Class.extend({

	options: {
		sourceDir: '',
		sourceFile: 'DGSoundscreenAudioLibrary.json',
		format: '',
		playback: {
			loop: false,
			volume: 1,
			position: [0, 0, 0],
			panner: {
				distanceModel: 'linear',
				maxDistance: 1000,
				rolloffFactor: 1
			}
		}
	},

	_loaded: {},

	initialize: function(options) {
		DG.Util.setOptions(this, options);
		this.getContext();
		if (this.options.sourceFile.indexOf('.json') !==-1) {
			this._asyncLibrary = this.loadLibrary(this.options.sourceFile);
		}
	},

	getContext: function() {
		if (this._ac === undefined) {
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			if (!AudioContext) {
				this._ac = null;
			} else {
				this._ac = new AudioContext();
			}
		}

		return this._ac;
	},

	load: function(id) {
		var self = this;
		return new Promise(function(resolve, reject) {
			if (self._asyncLibrary) {
				self._asyncLibrary
				.then(function(res) {
					if (id in res) {
						self.audioBufferFromBase64(res[id])
						.then(resolve, reject);
					} else {
						self.loadFile(id)
						.then(resolve, reject);
					}
				}, reject)
			} else {
				self.loadFile(id)
				.then(resolve, reject);
			}
		});
	},

	loadFile: function(id) {
		var self = this,
		url = this.options.sourceDir + id + this.options.format;
		return new Promise(function(resolve, reject) {
			self.audioBufferFromURL(url)
			.then(resolve, reject)
		})
	},

	loadLibrary: function(url) {
		return new Promise(function(resolve, reject) {
			DG.Soundscreen.tools.httpGet(url)
			.then(function(res) {
				try {
					res = JSON.parse(res);
				} catch (err) {
					reject(err)
				}
				resolve(res)
			}, reject)
		})
	},

	play: function(id, options) {
		if (!this._loaded[id]) {
			this._loaded[id] = this.load(id)
		}
		return this._loaded[id]
		.then(function(result) {
			return this.playBuffer(result, options);
		}.bind(this))
	},

	playBuffer: function(buffer, options) { // (AudioBuffer, Object)
		if (!this._ac) {
			return Promise.reject(new TypeError('Invalid AudioContext.'))
		}
		if (!buffer || !(buffer instanceof AudioBuffer)) {
			return Promise.reject(new TypeError('Invalid AudioBuffer.'))
		}

		try {
			options = Object.assign({}, this.options.playback, options);
			var source = this._ac.createBufferSource();
			var gain = this._ac.createGain();
			var panner = this._ac.createPanner();
			Object.assign(panner, options.panner);
			source.connect(gain);
			gain.connect(panner);
			panner.connect(this._ac.destination);

			source.loop = options.loop;
			gain.gain.value = options.volume;
			panner.setPosition.apply(panner, options.position);
			this.status = 'playing';
			source.buffer = buffer;
			source.start();
			if (options.onended && options.onended.call) {
				source.onended = options.onended
			}
			return Promise.resolve(source)
		} catch (err) {
			return Promise.reject(err)
		}
	},

	decode: function decode(audioData, context) {
		var self = this;
		return new Promise(function(resolve, reject) {
			if (context) {
				resolve = resolve.bind(context);
				reject = reject.bind(context);
			}
			if (!self._ac) {
				reject(new Error('AudioContext not supported.'))
			}
			self._ac.decodeAudioData(audioData, resolve, reject);
		})
	},

	_arrayBufferToBase64: function(buffer) {
		var bytes = new window.Uint8Array(buffer);
		var len = buffer.byteLength;
		var binary = '';
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	},

	_base64ToArrayBuffer: function(buffer) {
		var binary = window.atob(buffer);
		buffer = new window.ArrayBuffer(binary.length);
		var bytes = new window.Uint8Array(buffer);
		for (var i = 0; i < buffer.byteLength; i++) {
			bytes[i] = binary.charCodeAt(i) & 0xFF;
		}
		return buffer;
	},

	audioBufferFromBase64: function(data) {
			return this.decode(this._base64ToArrayBuffer(data))
	},

	audioBufferFromURL: function(url) {
		return DG.Soundscreen.tools.httpGet(url, 'arraybuffer')
		.then(this.decode.bind(this))
	},

	base64FromURL: function(url) {
		return DG.Soundscreen.tools.httpGet(url, 'arraybuffer')
		.then(this._arrayBufferToBase64)
	}

});
/*

*/