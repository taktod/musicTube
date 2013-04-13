Ext.define('MusicTube.util.Picker', {
	extend: 'Ext.Component',
	id: 'pickerUtil',
	picker: null,
	getPicker: function() {
		if(this.picker == null) {
			Ext.Viewport.setMasked(true);
			Ext.Viewport.setMasked(false);
			var settingUtil = Ext.getCmp('settingUtil');
			this.picker = Ext.create('Ext.Picker', {
				slots: [{
					name: 'playListPicker',
					title: 'playListPicker',
					data: settingUtil.getList()
				}],
				listeners: {
					change: this.onChange
				}
			});
		}
		var settingUtil = Ext.getCmp('settingUtil');
		var list = settingUtil.getCurrentList();
		this.picker.setValue({'playListPicker': list['value']}, false);
		return this.picker;
	},
	onChange: function(_this, value, eOpts) {
		// このタイミングで表示を変更できるようにしておきたい。
		var playListUtil = Ext.getCmp('playListUtil');
		playListUtil.openPlayList(value[('playListPicker')]);
	}
});

// モジュールの登録を実行
Ext.create('MusicTube.util.Picker');
