Ext.define('MusicTube.controller.Setting', {
	extend: 'Ext.app.Controller',
	requires: [
		'MusicTube.util.Setting'
	],
	config: {
/*		control: {
			'viewport': {
				orientationchange: 'onOrientationChange'
			}
		}*/
	},
	/**
	 * (とりあえず一番はじめに動作する部分)
	 * 初期動作
	 */
	init: function() {
		// homescreenに記録したときに、独立したアプリとして動作させない。
		// webアプリはマルチタスクで動作してくれないため。
		var metas = document.getElementsByTagName('meta');
		for(var i = 0;i < metas.length;i ++) {
			if(metas[i].name == 'apple-mobile-web-app-capable') {
				metas[i].content = 'no';
			}
		}
		// なければデフォルト設定を作成する
		var settingUtil = Ext.getCmp('settingUtil');
		settingUtil.makeDefault();
	},
	launch: function() {
	}
});