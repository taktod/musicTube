Ext.define('MusicTube.controller.Link', {
	extend: 'Ext.app.Controller',
	requires: [
		'MusicTube.util.Setting'
	],
	id: 'one',
	config: {
		control: {
			'[name=blog]': {
				initialize: 'setup'
			},
			'[name=twitter]': {
				initialize: 'setup'
			},
			'[name=version]': {
				initialize: 'initializeVersion'
			}
		}
	},
	initializeVersion: function(_this, eOpts) {
		var setting = Ext.getCmp('settingUtil');
		Ext.ComponentQuery.query('[name=version]').forEach(function(element) {
			element.setValue(setting.getVersion());
		});
		this.setup(_this, eOpts);
	},
	/**
	 * セットアップ動作
	 */
	setup: function(_this, eOpts) {
		_this.element.dom.addEventListener('click', function() {
		switch(_this.getName()) {
			case 'blog':
				Ext.getCmp('linkUtil').openWindow('http://poepoemix.blogspot.jp/');
//				window.open('http://poepoemix.blogspot.jp/', '_blank');
/*				var a = document.createElement("a");
				a.href = "http://poepoemix.blogspot.jp/";
				a.setAttribute("target", "_blank");
				document.body.appendChild(a);
				var e = document.createEvent("MouseEvents");
				e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
				document.body.removeChild(a);*/
				break;
			case 'twitter':
//				window.open('http://twitter.com/taktod/', '_blank');
				Ext.getCmp('linkUtil').openWindow('http://twitter.com/taktod/');
				break;
			case 'version':
				// バージョンの確認を実施して、バージョンが違う場合は更新するか確認する。
				Ext.Ajax.request({
					url: 'version.json',
					success: function(res) {
						var setting = Ext.getCmp('settingUtil');
						var version = JSON.parse(res.responseText)['version'];
						if(setting.getVersion() != version) {
							Ext.Msg.confirm(
								"Application Update:" + version,
								"This application is updated, update now?",
								function(buttonId) {
									if (buttonId === 'yes') {
										var pos = location.href.split("?")[0].split("#")[0].lastIndexOf("/");
										var url = location.href.substring(0, pos);
//										var url = location.href.split("?")[0].split("#")[0];
										// このバージョンを登録して、ドメイン指定のlocalStorageデータを削除する。
										for(var key in localStorage) {
											if(key.indexOf(url) != -1) {
												delete localStorage[key];
											}
											setting.setVersion(version);
										}
										window.location.reload();
									}
								}
							);
						}
						else {
							Ext.Msg.confirm(
								"Application Restore:" + version,
								"Are you sure to reload the application?",
								function(buttonId) {
									if (buttonId === 'yes') {
										var pos = location.href.split("?")[0].split("#")[0].lastIndexOf("/");
										var url = location.href.substring(0, pos);
//										var url = location.href.split("?")[0].split("#")[0];
										// このバージョンを登録して、ドメイン指定のlocalStorageデータを削除する。
										for(var key in localStorage) {
											if(key.indexOf(url) != -1) {
												delete localStorage[key];
											}
											setting.setVersion(version);
										}
										window.location.reload();
									}
								}
							);
						}
					}
				});
				break;
			default:
				break;
			}
		});
	}
});