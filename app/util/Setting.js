Ext.define('MusicTube.util.Setting', {
	extend: 'Ext.Component',
	id: 'settingUtil',
	// リピート更新
	toggleRepeat: function(flg) {
		var setting = this.openSetting();
		if(flg == undefined) {
			setting['play']['repeat'] = !setting['play']['repeat'];
		}
		else {
			setting['play']['repeat'] = flg;
		}
		localStorage['MusicTube'] = JSON.stringify(setting);
		return setting['play']['repeat'];
	},
	// リピート参照
	getRepeat: function() {
		var setting = this.openSetting();
		return setting['play']['repeat'];
	},
	// トラック更新
	toggleTrack: function(mode) {
		var setting = this.openSetting();
		if(mode == undefined) {
			if(setting['play']['track'] == 'single') {
				setting['play']['track'] = 'all';
			}
			else {
				setting['play']['track'] = 'single';
			}
		}
		else {
			setting['play']['track'] = mode;
		}
		localStorage['MusicTube'] = JSON.stringify(setting);
		return setting['play']['track'];
	},
	// 設定スキンを取得
	getSkin: function() {
		var setting = this.openSetting();
		return setting['skin'];
	},
	// 設定スキン変更
	setSkin: function(val) {
		var setting = this.openSetting();
		setting['skin'] = val;
		localStorage['MusicTube'] = JSON.stringify(setting);
	},
	// トラック参照
	getTrack: function() {
		var setting = this.openSetting();
		return setting['play']['track'];
	},
	// リストを参照する。
	getList: function() {
		var setting = this.openSetting();
		return setting['list'];
	},
	// デフォルト設定になっているリストを取得
	getDefaultList: function() {
		var list = this.getList();
		for(var i = 0;i < list.length;i ++) {
			if(list[i]['default']) {
				return list[i];
			}
		}
	},
	getVersion: function() {
		var setting = this.openSetting();
		return setting['version'];
	},
	setVersion: function(version) {
		var setting = this.openSetting();
		setting['version'] = version;
		localStorage['MusicTube'] = JSON.stringify(setting);
	},
	// 現在選択されているリスト情報
	getCurrentList: function() {
		try {
			var value = Ext.getCmp('playListUtil').getCurrentValue();
			if(value == null) {
				// デフォルト
				return this.getDefaultList();
			}
			var list = this.getList();
			for(var i = 0;i < list.length;i ++) {
				if(list[i]['value'] == value) {
					return list[i];
				}
			}
		}
		catch(e) {
		}
	},
	// 現在選択されているリストの次のリスト情報
	getNextList: function() {
		try {
			var value = Ext.getCmp('playListUtil').getCurrentValue();
			if(value == null) {
				// デフォルト
				return this.getDefaultList();
			}
			var list = this.getList();
			var first = undefined;
			var find = false;
			for(var i = 0;i < list.length;i ++) {
				if(first == undefined) {
					first = list[i];
				}
				if(find) {
					return list[i];
				}
				if(list[i]['value'] == value) {
					find = true;
				}
			}
			return first;
		}
		catch(e) {
		}
	},
	// 一致するvalueのリストにcheckをつける
	checkListItem: function(value) {
		var list = this.getList();
		for(var i = 0;i < list.length;i ++) {
			if(list[i]['value'] == value) { // 一致するもの
				list[i]['default'] = true;
			}
			else { // 一致しないもの
				list[i]['default'] = false;
			}
		}
		this.saveList(list);
	},
	// 一致するvalueのリストからcheckを取り去る
	uncheckListItem: function(value) {
		var list = this.getList();
		for(var i = 0;i < list.length;i ++) {
			if(list[i]['value'] == '') { // デフォルト
				list[i]['default'] = true;
			}
			else { // その他
				list[i]['default'] = false;
			}
		}
		this.saveList(list);
	},
	// あたらしいリストを追加する
	addList: function(data) {
		var list = this.getList();
		for(var i =0;i < list.length;i ++) {
			if(list[i]['value'] == data['value']) {
				// 一致するものがある場合は追加せずにおわる。
				return list;
			}
		}
		list.push(data);
		this.saveList(list);
		return list;
	},
	deleteList: function(val) {
		var list = this.getList();
		var newList = [];
		for(var i =0;i < list.length;i ++) {
			if(list[i]['value'] == val) {
				// 一致するものがある場合は追加せずにおわる。
				continue;
			}
			newList.push(list[i]);
		}
		this.saveList(newList);
		return newList;
	},
	// 設定を開く(private)
	openSetting: function() {
		try {
			return JSON.parse(localStorage['MusicTube']);
		}
		catch(e) {
			this.makeDefault();
			return JSON.parse(localStorage['MusicTube'])
		}
	},
	// 変更したリストを保存する(private)
	saveList: function(list) {
		var setting = this.openSetting();
		setting['list'] = list;
		localStorage['MusicTube'] = JSON.stringify(setting);
	},
	
	// デフォルト作成
	makeDefault: function(force) {
		if(force == undefined) {
			if(localStorage['MusicTube'] != undefined) {
				return;
			}
		}
		localStorage['MusicTube'] = JSON.stringify({
			'version':'',
			'list': [{'text':'default', 'value':'', 'default':true}],
			'skin': 'resources/css/app.css',
			'play': {
				'track': 'single',
				'repeat': false
			}
		});
	}
});
// モジュールの登録を実行
Ext.create('MusicTube.util.Setting');
