Ext.define('MusicTube.controller.Player', {
	extend: 'Ext.app.Controller',
	requires: [
		'MusicTube.util.Time',
		'MusicTube.util.Setting'
	],
	config: {
		control: {
			'#controlPanel [name=track]': {
				tap: 'toggleTrack'
			},
			'#controlPanel [name=repeat]': {
				tap: 'toggleRepeat'
			},
			'#controlPanel [name=play]': {
				tap: 'togglePlay'
			},
			'#controlPanel [name=slider]': {
				change: 'slide',
				dragstart: 'dragStart',
				dragend: 'dragEnd'
			},
			'#main': {
				initialize: 'audioPlayerSetup'
			},
			'#ads [name=speed]': {
				change: 'speedChange'
			}
		}
	},
	/*
	 * TODO 修正すべき点
	 * setしたらイベントを貼り直した方がよさそう。(データの再設定はうまくいっているのに、再生がうまくトリガーされないことが多いので、eventListenerを貼り直してイベントをクリアしておく方がよさげ)
	 * endedは問題なさそうなので、playとloadeddataを貼り直せばよいか？
	 * マルチトラック状態でもloopはつけっぱなしにしてたほうがいいかも
	 */
	speedChange: function(_this, newValue, oldValue, eOpts) {
		this.playbackRate = newValue;
		this.audioPlayer.pause();
		this.audioPlayer.playbackRate = this.playbackRate;
		this.audioPlayer.play();
	},
	/**
	 * playerのセットアップを実行する。
	 */
	audioPlayerSetup: function() {
		this.playbackRate = 1;
		var _this = this;
		hogehoge = _this;
		_this.listenerFlg = true;
		this.audioPlayer = document.getElementById('audioPlayerDom');
		this.audioPlayer.addEventListener("set", function(event) {
			_this.onSet(event.item);
			_this.audioPlayer.src = "http://49.212.39.17/nosound.mp3";
		});
		var loadData = function(event) {
			console.log("loadData...");
			// データの読み込みが叶ったときには、ついでにplayを自動実行しておきたいと思う。
			// 余計かもしれん・・・
			_this.audioPlayer.playbackRate = _this.playbackRate;
			_this.audioPlayer.play();
		}
		this.audioPlayer.addEventListener("loadeddata", loadData);
		this.audioPlayer.addEventListener("play", _this.onPlay);
		this.audioPlayer.addEventListener("pause", _this.onPause);
		var globalCounter = 0;
		var timeUpdate = function(event) {
			globalCounter ++;
			if(globalCounter > 10) {
				// カウンターが進行しすぎている場合はイベントを取り除く
				_this.listenerFlg = false;
				_this.audioPlayer.removeEventListener("timeupdate", timeUpdate);
				_this.audioPlayer.removeEventListener("play", _this.onPlay);
				_this.audioPlayer.removeEventListener("pause", _this.onPause);
			}
			_this.onTimeUpdate(event);
		};
		this.audioPlayer.addEventListener("timeupdate", timeUpdate);
		this.audioPlayer.addEventListener("ended", function(event) {
			console.log("end時");
//			_this.audioPlayer.removeEventListener("loadeddata", loadData);
			_this.onEnded(event);
			// これはほぼ確実に呼び出しできているので、イベントを貼り直しはここでやればいいと思う。
//			_this.audioPlayer.addEventListener("loadeddata", loadData);
		});
		// ここは教えてもらったフレームの描画動作に変更すべきか？
		_this.timer = setInterval(function() {
//			console.log("timerevent");
			if(!_this.listenerFlg) {
				_this.listenerFlg = true;
				// カウンターが進行しすぎている場合はイベントを追記しておく。
				_this.audioPlayer.addEventListener("timeupdate", timeUpdate);
				_this.audioPlayer.addEventListener("play", _this.onPlay);
				_this.audioPlayer.addEventListener("pause", _this.onPause);
			}
			// 余計なことはしない。特にこの動作は、複数動作が一気にはしる可能性がある。
			// なぜかこれを走らせておいてみる。
//			_this.audioPlayer.loaded;
//			var newTime = parseInt((new Date) / 1000);
			globalCounter = 0;
			try {
				if(_this.audioPlayer.src == "http://49.212.39.17/nosound.mp3") {
					// 無音のmp3だった場合は次のトラックにこのタイミングで移動させる。他の処理が一度はしるのは、なるべく動作させることで、Background動作させるため。
					_this.onSet(_this.playItem);
					return;
				}
			}
			catch(e) {
			}
		}, 1000);
	},
	/**
	 * playボタンを押したときの動作
	 */
	togglePlay: function(_this, time, eOpts) {
		try {
			console.log("playボタンがおされました。");
			// playボタンがおされたときの処理
			if(!this.audioPlayer.paused) {
				// 再生中なら止める
				this.audioPlayer.pause();
				this.onPause(null);
			}
			else {
				// データが設定済みなら再生させる。
				if(this.playItem != undefined) {
					console.log("データがあるので、再生をはじめたい。");
					// ここをいじる必要があるかもしれない。
					// 3Gで最初の再生時に、別のウィンドウにうつったりしていると、動作ができなくなる。(javascriptの動作限界等に問題がでる。)
					// いったんデータを破棄してから置き直すとよさそう。
					// 入れ直すと強制的にリロードがはしってしまうので、またjavascriptがうまく動作できないっぽい。
//					this.audioPlayer.src = "";
//					this.audioPlayer.pause();
//					this.audioPlayer.src = 'http://49.212.39.17:4649/musicTubeM4a/' + this.playItem.target + '.mp4';
					this.audioPlayer.play();
					this.onPlay(null);
				}
			}
		}
		catch(e) {
			console.error(e);
		}
	},
	/**
	 * ドラッグ中監視
	 */
	dragStart: function(_this, sl, thumb, value, e, eOpts) {
		this.dragFlg = true;
	},
	dragEnd: function(_this, sl, thumb, value, e, eOpts) {
		this.dragFlg = undefined;
	},
	/**
	 * スライドデータ変更
	 */
	slide: function(_this, sl, thumb, newValue, oldValue, eOpts) {
		try {
			if(this.playItem == undefined || this.rawDuration == undefined) { // データが設定されていないなら無視
				return;
			}
			else if(!this.audioPlayer.paused) { // 再生中ならいったんとめて情報変更後、再開
				// いったんとめないと、playがすすんでseek一瞬シークされる
				this.audioPlayer.pause(); // いったん止める
				this.audioPlayer.currentTime = thumb; // なんでthumbに位置情報がはいっているんだろう？
				this.audioPlayer.play(); // 再開する。
			}
			else { // 再生していない場合は情報の書き換えを実行後放置
				this.audioPlayer.currentTime = thumb; // なんでthumbに位置情報がはいっているんだろう？
				this.onTimeUpdate(null, this.audioPlayer.currentTime, null);
			}
		}
		catch(e) {
		}
	},
	/**
	 * データ設定イベント
	 */
	onSet: function(item) {
		try {
			console.log(item);
			this.audioPlayer.src = 'http://49.212.39.17:4649/musicTubeM4a/' + item.target + '.mp4';
			this.playItem = item;
			this.rawDuration = "undefined";
			this.audioPlayer.playbackRate = this.playbackRate;
			this.audioPlayer.play();
		}
		catch(e) {
			console.error(e);
		}
	},
	/**
	 * 再生イベント
	 */
	onPlay: function(event) {
		try {
			var playButton = Ext.ComponentQuery.query('#controlPanel [name=play]')[0];
			playButton.setIconCls('pause');
			if(isNaN(this.rawDuration)) {
				// 表示をloadingにする。
				this.updateInfo('loading...');
			}
		}
		catch(e) {
		}
	},
	/**
	 * 停止イベント
	 */
	onPause: function(event) {
		try {
			var playButton = Ext.ComponentQuery.query('#controlPanel [name=play]')[0];
			playButton.setIconCls('play1');
		}
		catch(e) {
		}
	},
	/**
	 * 時間更新イベント
	 */
	onTimeUpdate: function(event) {
		try {
			var time = this.audioPlayer.currentTime;
			var slider = null;
			// 全体のdurationが未取得なら取得する
			if(this.rawDuration != this.audioPlayer.duration) {
				slider = Ext.ComponentQuery.query('#controlPanel [name=slider]')[0];
				this.rawDuration = this.audioPlayer.duration;
				this.duration = parseInt(this.audioPlayer.duration);
				slider.setMaxValue(this.duration);
				this.currentTime = undefined;
			}
			if(isNaN(this.rawDuration) || isNaN(time)) {
				return;
			}
			// 表示をitem情報から全体の時間と現在時刻にする。
			var currentTime = parseInt(time);
			if(this.currentTime != currentTime) {
				this.currentTime = currentTime;
				// sliderの位置変更
				if(slider == null) {
					slider = Ext.ComponentQuery.query('#controlPanel [name=slider]')[0];
				}
				if(this.dragFlg != true) { // ドラッグ中はシークバーの更新しない(ドラッグして動かしているため)
					slider.setValue(this.currentTime);
				}
				var timeUtil = Ext.getCmp('timeUtil');
				this.updateInfo(timeUtil.makeTime(this.currentTime, this.duration > 3600) + '/' + timeUtil.makeTime(this.duration, false));
			}
		}
		catch(e) {
		}
	},
	/**
	 * 情報更新補助
	 */
	updateInfo: function(data) {
		try {
			document.getElementById('musicInfo').value=data;
		}
		catch(e) {
		}
	},
	/**
	 * 演奏が完了したときの動作
	 */
	onEnded: function(event) {
		try {
			// おわったときの動作
			if(this.track == 'all') {
				// マルチトラック状態での動作
				var playlist = Ext.getCmp('playListPanel');
				if(playlist.getSelectionCount() == 0) {
					// playlist上で動作していない場合
					return;
				}
				var store = playlist.getStore();
				var selectId = playlist.getSelection()[0].getId();
				var num = store.find('id', selectId);
				// 次のIDを探す。
				num ++;
				if(num == store.getCount()) {
					// もうデータがない
					if(this.repeat == true) {
						num = 0;
					}
					else {
						return; // おわっておく。
					}
				}
				var record = store.getAt(num);
				if(this.audioPlayer.src == "http://49.212.39.17/nosound.mp3") {
					// 無音のmp3だった場合は次のトラックにこのタイミングで移動させる。他の処理が一度はしるのは、なるべく動作させることで、Background動作させるため。
					this.onSet(this.playItem);
					return;
				}
				playlist.select(record, false, false);
				this.onSet(record.getData());
			}
			else {
				if(this.audioPlayer.src == "http://49.212.39.17/nosound.mp3") {
					// 無音のmp3だった場合は次のトラックにこのタイミングで移動させる。他の処理が一度はしるのは、なるべく動作させることで、Background動作させるため。
					this.onSet(this.playItem);
					return;
				}
			}
		}
		catch(e) {
			console.log("here...");
			if(this.audioPlayer.src == "http://49.212.39.17/nosound.mp3") {
				console.log(changeData);
				// 無音のmp3だった場合は次のトラックにこのタイミングで移動させる。他の処理が一度はしるのは、なるべく動作させることで、Background動作させるため。
				this.onSet(this.playItem);
				return;
			}
		}
	},
	/**
	 * トラックボタンをタップしたときの動作
	 */
	toggleTrack: function(_this, e, eOpts) {
		this.audioPlayer.removeAttribute("loop")
		var settingUtil = Ext.getCmp('settingUtil');
		if(settingUtil.toggleTrack() == 'single') {
			this.track = "single";
			_this.setIconCls('minus2');
			if(settingUtil.getRepeat()) {
				this.audioPlayer.setAttribute("loop", true)
			}
		}
		else {
			this.track = "all";
			_this.setIconCls('list');
		}
	},
	/**
	 * リピートボタンをタップしたときの動作
	 */
	toggleRepeat: function(_this, e, eOpts) {
		this.audioPlayer.removeAttribute("loop")
		var settingUtil = Ext.getCmp('settingUtil');
		if(settingUtil.toggleRepeat()) {
			this.repeat = true;
			_this.setIconCls('refresh');
			if(settingUtil.getTrack() == 'single') {
				this.audioPlayer.setAttribute("loop", true)
			}
		}
		else {
			this.repeat = false;
			_this.setIconCls('minus2');
		}
	},
	/**
	 * 開始時の動作
	 */
	launch: function(app) {
		// 初期時の表示の変更
		var settingUtil = Ext.getCmp('settingUtil');
		// マルチトラックであるか判定
		if(settingUtil.getTrack() == 'all') {
			this.track = 'all';
			Ext.ComponentQuery.query('#main [name=track]').forEach(function(element) {
				element.setIconCls('list');
			});
		}
		else {
			this.track = 'single';
		}
		// リピートであるか判定
		if(settingUtil.getRepeat()) {
			this.repeat = true;
			Ext.ComponentQuery.query('#main [name=repeat]').forEach(function(element) {
				element.setIconCls('refresh');
			});
		}
		else {
			this.repeat = false;
		}
		// シングル動作のリピートの場合はlookをつけておく。
		if(settingUtil.getRepeat() && settingUtil.getTrack() == 'single') {
			this.audioPlayer.setAttribute("loop", true)
		}
	}
});