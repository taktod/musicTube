Ext.define('MusicTube.util.Social', {
	extend: 'Ext.Component',
	id: 'socialUtil',
	/**
	 * mailを開きます。
	 */
	makeMail: function() {
		location.href = 'mailto:?body=' + this.makeMusicLink();
	},
	/**
	 * twitterを開きます。
	 */
	makeTwitter: function() {
		var data = encodeURIComponent(this.makeMusicLink());
		Ext.getCmp('linkUtil').openWindow("https://twitter.com/intent/tweet?url=" + data);
	},
	makeMusicLink: function() {
		try {
//			var settingUtil = Ext.getCmp('settingUtil');
			var playListUtil = Ext.getCmp('playListUtil');
//			var list = settingUtil.getCurrentList();
			return location.href.split('#')[0] + '#list/' + playListUtil.getListData();
		}
		catch(e) {
		}
	},
	openAudioPlayer: function(){
		try {
			var playListUtil = Ext.getCmp('playListUtil');
			Ext.getCmp('linkUtil').openWindow('http://taktodtools.appspot.com/audioPlayer/#list/' + playListUtil.getListData());
		}
		catch(e) {
		}
	}
});
Ext.create('MusicTube.util.Social');
