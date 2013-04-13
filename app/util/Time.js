Ext.define('MusicTube.util.Time', {
	extend: 'Ext.Component',
	id: 'timeUtil',
	/**
	 * unixtime → 時刻変換
	 */
	makeTime: function(data, hourFlg) {
		var duration = data;
		var sec = duration % 60;
		duration = parseInt(duration/60);
		var min = duration % 60;
		duration = parseInt(duration/60);
		var hour = duration;
		if(hourFlg || hour != 0) {
			return ('0' + hour).substr(-2) + ':' + ('0' + min).substr(-2) + ':' + ('0' + sec).substr(-2);
		}
		else {
			return ('0' + min).substr(-2) + ':' + ('0' + sec).substr(-2);
		}
	}
});

// モジュールを登録しておく。
Ext.create('MusicTube.util.Time');
