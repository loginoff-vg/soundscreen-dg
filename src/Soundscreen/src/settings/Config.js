
DG.Soundscreen.Config = DG.Soundscreen.DataStorage.extend({

	options: {},

	each: function(fn, cont, path) {
		cont = cont || this.options;
		path = path || '';
		for (var k in cont) {
			var prop = cont[k];

			if (typeof prop !== 'object') {
				continue
			}
			
			if ('type' in prop) {
				fn(prop, k, path);
				continue
			}
			this.each(fn, prop, path ? path+'.'+k : k)
		}
	}

});
/*

*/
DG.Soundscreen.Config.mergeOptions({
	geodata: {
		radius: {
			label: 'radius',
			type: 'range',
			min: 50,
			max: 200,
			step: 50,
			default: 100,
		},
		azimuthFormat: {
			label: 'azimuth_format',
		type: 'enum',
			values: ['windrose', 'degrees', 'clock'],
			default: 'windrose'
		},
		sortOrder: {
			label: 'sort_order',
			type: 'enum',
			values: ['distance', 'azimuth', 'name'],
			default: 'distance'
		},
		requestGeounits: {
			label: 'include_in_request',
			type: 'set',
			values: ['attraction', 'building', 'street'],
			default: 'attraction,building,street'
		}
	},
	tts: {
		enable: {
			//label: 'use_tts',
			type: 'Boolean',
			default: true,
		},
		volume: {
			label: 'volume',
			type: 'range',
			min: 0.1,
			max: 1,
			step: 0.1,
			default: 1
		},
		pitch: {
			label: 'pitch',
			type: 'range',
			min: 0,
			max: 2,
			step: 0.1,
			default: 1
		},
		rate: {
			label: 'rate',
			type: 'range',
			min: 1,
			max: 3,
			step: 0.1,
			default: 1.5
		}
	}
});