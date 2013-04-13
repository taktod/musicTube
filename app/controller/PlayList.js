Ext.define('MusicTube.controller.PlayList', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.data.proxy.LocalStorage',
		'MusicTube.util.Setting',
		'MusicTube.util.PlayList'
	],
	config: {
		control: {
			'#ads [name=import]': {
				tap: 'importData'
			},
			'#ads [name=export]': {
				tap: 'exportData'
			},

			'#listManager': {
				initialize: 'setupListManager'
			},
			'#listManager [name=action]': {
				tap: 'openAction'
			},
//			'#listManager [name=add]': {
//				tap: 'addNewList'
//			},
			'#listManager [name=check]': {
				change: 'defaultCheck'
			},
			'#listManager [name=selector]': {
				change: 'changeList'
			},
			'#listManager [name=delete]': {
				tap: 'deleteList'
			}
		}
	},
	/**
	 * import動作
	 */
	importData: function(_this, e, eOpts) {
		var data = Ext.ComponentQuery.query('#ads [name=dataArea]')[0].getValue();
		try {
			Ext.getCmp('playListUtil').setImportData(data);
			Ext.Msg.alert('Import', 'Complete!', function() {
				Ext.getCmp('main').list.setHidden(true);
				location.reload();
			});
		}
		catch(e) {
			Ext.Msg.alert('Import', 'Error!');
		}
	},
	/**
	 * export動作
	 */
	exportData: function(_this, e, eOpts) {
		Ext.ComponentQuery.query('#ads [name=dataArea]')[0].setValue(
			Ext.getCmp('playListUtil').getExportData());
	},
	/**
	 * リスト変更
	 */
	changeList: function(_this, newValue, oldValue, eOpts) {
		this.changeCheckBySelector = true;
		// リストを変更したときの処理
		// storeを書き換えて読み込み変更させる。
		var playListUtil = Ext.getCmp('playListUtil');
		playListUtil.openPlayList(newValue);
		// check状態をsettingUtilから読みこんで更新
		var settingUtil = Ext.getCmp('settingUtil');
		var defaultList = settingUtil.getDefaultList();
		var checkBox = Ext.ComponentQuery.query('#listManager [name=check]')[0];
		if(defaultList['value'] == newValue) {
			checkBox.check();
		}
		else {
			checkBox.uncheck();
		}
		// 削除可不可判定
		var deleteButton = Ext.ComponentQuery.query('#listManager [name=delete]')[0];
		deleteButton.setDisabled(newValue == "");
		this.changeCheckBySelector = false;
	},
	/**
	 * デフォルトチェックがはいったとき
	 */
	defaultCheck: function(_this, newValue, oldValue, eOpts) {
		if(this.changeCheckBySelector) {
			return;
		}
		var settingUtil = Ext.getCmp('settingUtil');
		var value = Ext.ComponentQuery.query('#listManager [name=selector]')[0].getValue();
		// 現在のselectorの値に一致するデータにcheckをつける(もしくはcheckを抜く)
		if(newValue) {
			// チェックがついた場合
			settingUtil.checkListItem(value);
		}
		else {
			// チェックを抜いた場合
			settingUtil.uncheckListItem(value);
		}
		// デフォルトの状態でcheckがいじられた場合は自分が絶対にdefaultになり停止します。
		if(value == "") {
			_this.check(); // 強制チェック
		}
	},
	/**
	 * リストマネージャーの初期化動作
	 */
	setupListManager: function(_this, eOpts) {
		var settingUtil = Ext.getCmp('settingUtil');
		var list = settingUtil.getCurrentList();
		// 削除ボタン
		var deleteButton = _this.query('[name=delete]')[0];
		deleteButton.setDisabled(list['value'] == "");
		// 選択リスト
		var selector = _this.query('[name=selector]')[0];
		selector.setOptions(settingUtil.getList()); // オプション登録
		selector.setValue(list['value']); // 設定変更
		// 選択check
		var checkField = _this.query('[name=check]')[0];
		if(list['default']) {
			checkField.check();
		}
		else {
			checkField.uncheck();
		}
	},
	/**
	 * リスト削除
	 */
	deleteList: function() {
		var _this = this;
		Ext.Msg.confirm('Delete List', 'Delete This List?', function(id) {
			if(id == 'yes') {
				var selector = Ext.ComponentQuery.query('#listManager [name=selector]')[0];
				var value = selector.getValue();
				// 現行playListをクリアする。
				var playListUtil = Ext.getCmp('playListUtil');
				playListUtil.clearCurrentList();
				// settingからも削除する。
				var settingUtil = Ext.getCmp('settingUtil');
				var list = settingUtil.deleteList(value);
				// 表示をデフォルトに変更する。
				selector.updateOptions(list);
				selector.setValue('');
			}
		});
	},
	/**
	 * listManager上でactionを開きます。
	 */
	openAction: function(_this, e, eOpts) {
		var controller = this;
		if(_this.actionSheet == undefined) {
			// 一度maskかけておかないとうまく動作できない。
			Ext.Viewport.setMasked(true);
			Ext.Viewport.setMasked(false);
			_this.actionSheet = Ext.create('Ext.ActionSheet', {
				items: [{
					text: 'Add New List',
					ui: 'action',
					handler: function() {
						_this.actionSheet.hide();
						controller.addNewList();
					}
				},{
					text: 'Tweet List',
					handler: function() {
						_this.actionSheet.hide();
						var socialUtil = Ext.getCmp('socialUtil');
						socialUtil.makeTwitter();
					}
				},{
					text: 'E-mail List',
					handler: function() {
						_this.actionSheet.hide();
						var socialUtil = Ext.getCmp('socialUtil');
						socialUtil.makeMail();
					}
				},{
					text: 'cancel',
					ui: 'confirm',
					handler: function() {
						_this.actionSheet.hide();
					}
				}]
			});
			Ext.Viewport.add(_this.actionSheet);
		}
		_this.actionSheet.show();
	},
	/**
	 * 新リストを追加
	 */
	addNewList: function() {
		Ext.Msg.prompt('New List', 'Please enter new list name:', function(id, value, opt) {
			if(id == 'ok' && value != '') {
				// okの場合はvalueの名前でlistを作成する。
				var settingUtil = Ext.getCmp('settingUtil');
				var list = settingUtil.addList({text: value, value: value, 'default': false});
				var selector = Ext.ComponentQuery.query('#listManager [name=selector]')[0];
				selector.updateOptions(list);
				selector.setValue(value);
			}
		});
	},
	/**
	 * 初期動作
	 */
	launch: function(app) {
		// デフォルトのlistを取得
		var settingUtil = Ext.getCmp('settingUtil');
		var list = settingUtil.getDefaultList();
		// 対象listのデータをロードしておく。
		var playListUtil = Ext.getCmp('playListUtil');
		playListUtil.openPlayList(list['value']);
	}
});