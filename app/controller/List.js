Ext.define('MusicTube.controller.List', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.ActionSheet',
		'MusicTube.util.PlayList',
		'MusicTube.util.Picker'
	],
	tplBase: "test",
	config: {
		refs: {
			player: '#audioPlayer',
			search: '#searchPanel',
			playList: '#playListPanel',
			tmpList: '#tmpListPanel'
		},
		control: {
			tmpList: {
				itemtap: 'tmpListTap'
			},
			'#tmpListPanel [name=action]': {
				tap: 'tmpListMenu'
			},
			search: {
				itemtap: 'searchTap',
				itemtouchstart: 'touchstart',
				itemtouchend: 'touchend'
			},
			'#searchPanel [name=action]': {
				tap: 'toggleSearch'
			},
			playlist: {
				itemtap: 'playListTap',
				initialize: 'playListInit',
				itemtouchstart: 'touchstart',
				itemtouchend: 'touchend'
			},
			'#playListPanel [name=action]': {
				tap: 'playListMenu'
			}
		}
	},
	touchstart: function(_this, index, target, record, e, eOpts) {
		if(Ext.getCmp("main").isOpened()) {
			this.startPosX = -5;
			this.startPosY = -5;
		}
		else {
			this.startPosX = e.pageX;
			this.startPosY = e.pageY;
		}
	},
	touchend: function(_this, index, target, record, e, eOpts) {
		var xMov = this.startPosX - e.pageX;
		var yMov = this.startPosY - e.pageY;
		if(!Ext.getCmp('main').isOpened() && Math.abs(yMov) < Math.abs(xMov) && xMov > 10) {
			Ext.getCmp('linkUtil').openWindow('http://m.youtube.com/#/watch?v=' + record.data.target);
		}
	},
	tmpListMenu: function() {
		var _this = this;
		Ext.Msg.prompt('Import List', 'Enter New List Name:', function(id, value, opt) {
			if(id == 'ok' && value != '') {
				// okの場合はvalueの名前でlistを作成する。
				var settingUtil = Ext.getCmp('settingUtil');
				var list = settingUtil.addList({text: value, value: value, 'default': false});
				var playListUtil = Ext.getCmp('playListUtil');
				playListUtil.openPlayList(value);
				// データを追加しておく。
				_this.getTmpList().getStore().each(function(item) {
					var data = item.getData();
					playListUtil.addRecord({
						'title': data['title'],
						'target': data['target'],
						'image': data['image'],
						'duration': data['duration']
					});
				});
				// selectorの値を変更する。
				try {
					var selector = Ext.ComponentQuery.query('#listManager [name=selector]')[0];
					selector.updateOptions(list);
					selector.setValue(value);
				}
				catch(e) {
				}
				Ext.Msg.alert('Import List', 'Complete!');
			}
		});
	},
	/**
	 * playList上の右上のパネルをタップした場合
	 */
	playListMenu: function() {
		var pickerUtil = Ext.getCmp('pickerUtil');
		pickerUtil.getPicker().show();
	},
	/**
	 * サーチボックスON OFF
	 */
	toggleSearch: function() {
		var searchField = this.getSearch().query("[name=searchBar]")[0];
		if(searchField.isHidden()) {
			searchField.show();
		}
		else {
			searchField.hide();
		}
	},
	/**
	 * 一時リストのデータをタップした場合
	 */
	tmpListTap: function(_this, index, target, record, e, eOpts) {
		if(e.getTarget('.x-button')) {
			if(e.getTarget('.relate')) {
				window.location.hash = "relate/" + record.getData().target;
			}
			else {
				Ext.Msg.alert("Add Music", record.getData().title, Ext.emptyFn);
				record.setDirty();
				Ext.getCmp('playListUtil').addRecord(record);
			}
			return false;
		}
		else {
			// それ以外が選択された場合
			// 問題のtargetIdがこれでわかるのでaudioに音楽を流す指示を出すことができるはず。
			this.getPlayer().fireEvent("set", record.getData());
		}
	},
	/**
	 * サーチデータの結果をタップした場合
	 */
	searchTap: function(_this, index, target, record, e, eOpts) {
		if(e.getTarget('.x-button')) {
			if(e.getTarget('.relate')) {
				window.location.hash = "relate/" + record.getData().target;
			}
			else {
				Ext.Msg.alert("Add Music", record.getData().title, Ext.emptyFn);
				record.setDirty();
				Ext.getCmp('playListUtil').addRecord(record);
			}
			return false;
		}
		else {
			try {
				if(this.getPlayList().getSelectionCount() != 0) {
					this.getPlayList().deselectAll();
				}
			}
			catch(e) {
			}
			// それ以外が選択された場合
			// 問題のtargetIdがこれでわかるのでaudioに音楽を流す指示を出すことができるはず。
			var event = document.createEvent("HTMLEvents");
			event.initEvent("set", true, false);
			event.item = record.getData();
			document.getElementById("audioPlayerDom").dispatchEvent(event);
		}
	},
	/**
	 * playlistの要素をタップした場合
	 */
	playListTap: function(_this, index, target, record, e, eOpts) {
		if(e.getTarget('.x-button')) {
			if(e.getTarget('.relate')) {
				window.location.hash = "relate/" + record.getData().target;
			}
			else {
				// 削除する。
				Ext.Msg.confirm("Delete Music", record.getData().title, function(buttonId, value, opt){
					if(buttonId == "yes") {
						Ext.getCmp('playListUtil').removeRecord(record);
					}
				});
			}
			return false;
		}
		else {
			try {
				if(this.getSearch().getSelectionCount() != 0) {
					this.getSearch().deselectAll();
				}
			}
			catch(e) {
			}
			// それ以外が選択された場合
			// 問題のtargetIdがこれでわかるのでaudioに音楽を流す指示を出すことができるはず。
			var event = document.createEvent("HTMLEvents");
			event.initEvent("set", true, false);
			event.item = record.getData();
			document.getElementById("audioPlayerDom").dispatchEvent(event);
		}
	},
	playListInit: function(_this, eOpts) {
		var settingUtil = Ext.getCmp('settingUtil');
		var list = settingUtil.getCurrentList();
		var title = Ext.ComponentQuery.query('#playListPanel [name=title]')[0];
		title.setTitle(list['text']);
		title.element.on('doubletap', function() {
			// リストを次のリストに変更する。
			var playListUtil = Ext.getCmp('playListUtil');
			playListUtil.openNextPlayList();
		});
	}
});