# Soundscreen

Плагин для [2gisAPI].
Обеспечивает доступность карт 2ГИС для незрячих пользователей
Предусматривает использование скринридера, управление с клавиатуры,
речевой  и текстовый вывод, звуковое оформление.

### Подключение
// Сначала 2gisAPI
<script type="text/javascript" src="https://maps.api.2gis.ru/2.0/loader.js"></script>

<script>
DG.then(function () {
	// Подключаем файлы плагина
	DG.plugin('https://loginoff-vg.github.io/soundscreen-dg/dist/DGSoundScreen.css');
	return DG.plugin('https://loginoff-vg.github.io/soundscreen-dg/dist/DGSoundscreen.js');
})
.then(function () {
	// Инициализация карты
	map = new DG.Map('map', {
		center: [54.980206086231,82.898068362003],
		zoom: 16,
		// Включаем soundscreen в опциях карты
		soundscreen: {
			debug: true,
			audio: {
			// sourceFile - файл со звуками, кодированными в base64
				sourceFile: 'DGSoundscreenAudioLibrary.json'
			}
		}
	});
});
</script>

### Демо
По ссылке [soundscreen demo]
#### Внимание!
Без скринридера просматривать демо бессмысленно. Визуально это обычная карта 2ГИС.
### Версия
0.9.0

[2gisAPI]:http://api.2gis.ru/
[soundscreen demo]:https://loginoff-vg.github.io/soundscreen-dg/demo/
