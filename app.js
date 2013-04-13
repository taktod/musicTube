//<debug>
Ext.Loader.setPath({
	'Ext': 'touch/src',
	'MusicTube': 'app'
});
Ext.Loader.setConfig({
	enabled: true
});
Ext.Loader.setPath('Ext.ux', './ux');
//</debug>

Ext.application({
	controllers: ["List","PlayList","Search","Page","Link","Player","Setting"],
	name: 'MusicTube',

	requires: [
		'Ext.MessageBox',
		'MusicTube.util.Picker',
		'MusicTube.util.PlayList',
		'MusicTube.util.Setting',
		'MusicTube.util.Social',
		'MusicTube.util.Time',
		'MusicTube.util.Link'
	],

	views: ['Main'],

	icon: {
		'57': 'resources/icons/Icon.png',
		'72': 'resources/icons/Icon~ipad.png',
		'114': 'resources/icons/Icon@2x.png',
		'144': 'resources/icons/Icon~ipad@2x.png'
	},

	isIconPrecomposed: true,

	startupImage: {
		'320x460': 'resources/startup/320x460.jpg',
		'640x920': 'resources/startup/640x920.png',
		'768x1004': 'resources/startup/768x1004.png',
		'748x1024': 'resources/startup/748x1024.png',
		'1536x2008': 'resources/startup/1536x2008.png',
		'1496x2048': 'resources/startup/1496x2048.png'
	},

	launch: function() {
		// Ext.browser.is.webkit webkitでない場合はここでdetectしておく必要あり。
		// Destroy the #appLoadingIndicator element
		var main = Ext.create('MusicTube.view.Main');
		var _this = this;
		// バージョン確認を挿入しておく。
		var afterVersionCheck = function() {
			// Initialize the main view
			if(localStorage["MusicTubeAds"] > (new Date()).getTime() - 432000000) {
				Ext.fly('appLoadingIndicator').destroy();
				// Initialize the main view
				Ext.Viewport.add(main);
			}
			else {
				setTimeout(function(){
					Ext.fly('appLoadingIndicator').destroy();
					// Initialize the main view
					Ext.Viewport.add(main);
				}, 4000);
			}
		};
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
/*						"Application Update:" + version,
						"This application has just successfully been updated to the latest version. Reload now?",
						function(buttonId) {
							if (buttonId === 'yes') {
								var url = location.href.split("?")[0].split("#")[0];
								// このバージョンを登録して、ドメイン指定のlocalStorageデータを削除する。
								for(var key in localStorage) {
									if(key.indexOf(url) != -1) {
										delete localStorage[key];
									}
									setting.setVersion(version);
								}
								window.location.reload();
							}
						} */
					);
				}
				afterVersionCheck();
			},
			failure: function() {
				afterVersionCheck();
			}
		});
	},

	viewport : {
		autoMaximize: true
	},
	onUpdated: function() {
		// 内部のデータがたまに壊れることがありえるので、強制読み込み直しさせておく。
		var url = location.href.split("?")[0].split("#")[0];
		// このバージョンを登録して、ドメイン指定のlocalStorageデータを削除する。
		for(var key in localStorage) {
			if(key.indexOf(url) != -1) {
				delete localStorage[key];
			}
		}
	}
/*    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }*/
});
