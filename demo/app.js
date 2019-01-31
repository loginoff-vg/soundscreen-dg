DG.then(function () {
	DG.plugin('../dist/DGSoundScreen.css');
	return DG.plugin('../dist/DGSoundScreen.js');
})
.then(function () {
	try{ 
		var pos = window.localStorage.getItem('position') || '54.980206086231,82.898068362003';
		pos = pos.split(',');
		map = new DG.Map('map', {
			center: pos,
			zoom: 16,
			soundscreen: {
				debug: true,
				audio: {
					sourceFile: 'DGSoundscreenAudioLibrary.json'
				}
			}
		});

		window.addEventListener('beforeunload', function(){
			if(map.soundscreen) localStorage.setItem('position', map.soundscreen.position.get('string'));
		});

	}catch(err){
		console.error(err)
	}

});
