(function() {
DG.Soundscreen.getTTS = function(soundscreen) {
	
	if (DG.Soundscreen.tts) {
		return DG.Soundscreen.tts
	}
	return DG.Soundscreen.tts = new TTS(soundscreen);
};
//DG.Soundscreen.Config.mergeOptions({});
var TTS = DG.Handler.extend({

	initialize: function(soundscreen) {
		this.soundscreen = soundscreen;
		this.engine = getNativeSynth();

		if (!this.engine) {
			soundscreen.settings.set('tts.enable', false);
			soundscreen.settings.config.set('tts.*', {disabled: true});
		} else {
			soundscreen.settings.config.set('tts.enable.onchange', this.toggle.bind(this));
			this._settings = soundscreen.settings.get('tts');
		}

	},

	addHooks: function() {
		this.setLang();
		this.soundscreen._map.on('langchange', this.setLang, this);
	},

	removeHooks: function() {
		this.soundscreen._map.off('langchange', this.setLang, this);
	},

	toggle: function(value) {
		value ? this.enable() : this.disable()
	},

	canSpeak: function() {
		return this.engine && this.engine._voice;
	},

	cancel: function() {
		if (this.engine && this.engine.isPlaying()) {
			this.engine.cancel();
		}
	},

	say: function say(msg, priority) {
		if (!this._settings.enable || !this.canSpeak() || !this.enabled()) {
			return false;
		}

		priority = priority || 0;
		if (this.engine.isPlaying()) {
			if (priority || this._fraze.priority === 1) {
				this._fraze.addEventListener('ended', this.say.bind(this, msg, priority))
			} else {
				this.engine.cancel();
			}
		}

		this._fraze = this.engine.speak(msg, this._settings);
		this._fraze.priority = priority;
		return this._fraze;
	},

	setLang: function(lang) {
		if (!this.engine) {
			return
		}

		lang = lang || this.soundscreen._map.getLang();
		return this.engine.setVoice(lang);
	}

});

function getNativeSynth() {
	if (!window.speechSynthesis || !SpeechSynthesisEvent) {
		return null;
	}

	var native = window.speechSynthesis;
	var synth = {
		_error: null,
		_voice: null,
		langMap: {
			ar: 'ar-SA',
			cs: 'cs-CZ',
			en: 'en-US',
			es: 'es-ES',
			it: 'it-IT',
			ru: 'ru-RU'
		},
		speak: function speak(msg, options) {
			var frase = new window.SpeechSynthesisUtterance(msg)
			frase.voice = this._voice;
			if (options) {
				DG.extend(frase, options);
			}

			native.speak(frase);
			return frase;
		},
		setVoice: function setVoice(lang) {
			return this._voice = this.getVoice(lang)
		},
		getVoice: function getVoice(lang) {
			if (!this._voices) {
				this._voices = this.getVoices()
			}
			if (lang && lang.length ==2) {
				lang = this.langMap[lang]
			}
			return this._voices[lang] || null;
		},
		getVoices: function getVoices() {
			return native.getVoices()
			.reduce(function(memo, item) {
				memo[item.lang] = item;
				return memo;
			}, {});
		},
		isPlaying: function isPlaing() {
			return native.speaking || native.paused || native.pending
		},
		cancel: native.cancel.bind(native)
	};
	native.onvoiceschanged = function() {
		synth._voices = synth.getVoices();
	}
	/*
	native.addEventListener('error', function(err) {
		synth._error = err;
	});
	*/
	return synth
}

})();
