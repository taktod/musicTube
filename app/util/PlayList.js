Ext.define('MusicTube.util.PlayList', {
	extend: 'Ext.Component',
	id: 'playListUtil',
	store: null,
	// データを受け入れる
	setImportData: function(data) {
		try {
			var settingUtil = Ext.getCmp('settingUtil');
			var list = JSON.parse(data);
			var store = Ext.create('Ext.data.Store', {
				fields: [
					'title',
					'target',
					'image',
					'duration'
				]
			});
			for(var key in list) {
				// 設定リストに追加
				settingUtil.addList({
					'text': key,
					'value': key,
					'default': false
				});
				if(list[key] instanceof Array) {
					// データを追加する
					store.setProxy({
						type: 'localstorage',
						id: 'musicTube_' + key
					});
					store.load(); // 読み込んで(いらないかも)
					store.removeAll(); // 全部消す
					list[key].forEach(function(item) {
						if(item.duration != undefined
						&& item.title != undefined
						&& item.target != undefined
						&& item.image != undefined) {
							store.add(item);
						}
					});
					store.sync(); // 追加データで上書き
				}
			}
			// 全部おわったら現状のデータを更新
			this.store.load();
		}
		catch(e) {
		}
	},
	// 保持データを出力する。
	getExportData: function() {
		try {
			var settingUtil = Ext.getCmp('settingUtil');
			var result = {};
			// storeをいったんつくってそこにデータを取り込む必要あり。
			var store = Ext.create('Ext.data.Store', {
				fields: [
					'title',
					'target',
					'image',
					'duration'
				]
			});
			settingUtil.getList().forEach(function(e) {
				result[e['value']] = [];
				store.setProxy({
					type: 'localstorage',
					id: 'musicTube_' + e['value']
				});
				store.load();
				store.each(function(item) {
					result[e['value']].push({
						duration: item.getData().duration,
						image: item.getData().image,
						target: item.getData().target,
						title: item.getData().title
					});
				})
			});
			return JSON.stringify(result);
		}
		catch(e) {
		}
	},
	getListData: function() {
		var list = [];
		this.store.each(function(item) {
			list.push(item.getData().target);
		});
		return list.join(',');
	},
	addRecord: function(record) {
		this.store.add(record);
		this.store.sync();
	},
	removeRecord: function(record) {
		this.store.remove(record);
		this.store.sync();
	},
	clearCurrentList: function() {
		this.store.removeAll();
		this.store.sync();
	},
	getCurrentValue: function() {
		if(this.store == null) {
			return null; // きまっていない場合はnullを応答する。
		}
		return this.store.getProxy().getId().substring(10);
	},
	openPlayList: function(target) {
		try {
			var title = Ext.ComponentQuery.query('#playListPanel [name=title]')[0];
			title.setTitle(target == '' ? 'default' : target);
		}
		catch(e) {
		}
		if(this.store == null) {
			this.store = Ext.create('Ext.data.Store', {
				storeId: 'myStore',
				requires: [
					'Ext.data.proxy.LocalStorage'
				],
				fields: [
					'title',
					'target',
					'image',
					'duration'
				],
				proxy: {
					type: 'localstorage',
					id: 'musicTube_' + target
				}
			});
		}
		else {
			this.store.setProxy({
				type: 'localstorage',
				id: 'musicTube_' + target
			});
		}
		this.store.load();
		var playListPanel = Ext.getCmp('playListPanel');
		if(playListPanel) {
			playListPanel.refresh();
		}
		// listManager上のデータを書き換えしておく。
		var listManager = Ext.getCmp('listManager');
		if(listManager != undefined) {
			// 表示を変更しておく。
			var settingUtil = Ext.getCmp('settingUtil');
			var list = settingUtil.getCurrentList();
			// 削除ボタン
			var deleteButton = listManager.query('[name=delete]')[0];
			deleteButton.setDisabled(list['value'] == "");
			// 選択リスト
			var selector = listManager.query('[name=selector]')[0];
			selector.setOptions(settingUtil.getList()); // オプション登録
			selector.setValue(list['value']); // 設定変更
			// 選択check
			var checkField = listManager.query('[name=check]')[0];
			if(list['default']) {
				checkField.check();
			}
			else {
				checkField.uncheck();
			}
		}
	},
	// 次のplayListに切り替える
	openNextPlayList: function() {
		// 現在の設定を取得する。
		var settingUtil = Ext.getCmp('settingUtil');
		var list = settingUtil.getNextList();
		this.openPlayList(list['value']);
	}
})
// モジュールの登録を実行
Ext.create('MusicTube.util.PlayList');
