DG.Soundscreen.Geoservice = DG.Geoclicker.Provider.CatalogApi.extend({

		firmsInHouse: function(parameters) { // (Object)
        parameters = parameters || {};

        /* eslint-disable camelcase */
        var params = {
            building_id: parameters.houseId,
            page: parameters.page || 1
        };
        /* eslint-enable camelcase */

        return this._performRequest(params, this._urlFirmsInHouse);
    },

	locate: function(params) { // (Object)
		params = params || {};
		/* eslint-disable camelcase */
		params.point = params.point || this._map.soundscreen.position.get('geoquery');
		params.type = params.type || 'building';
		params.radius = params.radius || 100;
		params.zoom_level = params.zoom || 16;
		params.fields = this._geoFields;

		/* eslint-enable camelcase */

		return this._performRequest(params, this._urlGeoSearch);
	},

	request: function(reqname, params) {
	var self = this;
		return new Promise(function(resolve, reject) {
			if (!self[reqname] || !params) {
				reject(new Error('Invalid arguments'))
			}
			params.page = 1;
			var items = [], loaded = 0, 
			fn = self[reqname].bind(self);
			fn(params)
			.then(onload)
			.catch(reject);
			function onload(response) {
				if (self._isNotFound(response)) {
					var err = new Error('no data');
					err.code = response.meta ?  response.meta.code : null;
					   reject(err)
				   }

				   var data = response.result.items;
				loaded += data.length;
				if (loaded < response.result.total) {
					params.page ++;
					fn(params)
				.then(onload)
				.catch(reject)
				}
				for (var i = 0, len = data.length; i < len; i++) {
					items.push(data[i]);
				}
				if (response.result.total == loaded) {
					resolve(items);
				}
			}
		})
	}

});