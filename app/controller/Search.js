Ext.define('MusicTube.controller.Search', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.data.JsonP',
		'MusicTube.util.Time'
	],
	config: {
		refs: {
			main: '#main',
			search: '#searchPanel',
			tmpList: '#tmpListPanel'
		},
		routes: {
			'search/:keyword': 'searchOpen',
			'relate/:id': 'relateOpen',
			'list/:name': 'listOpen'
		},
		control: {
			'[name=search]': {
				change: 'search'
			}
		}
	},
	/**
	 * テキストボックスによるサーチ動作
	 */
	search: function(_this, newValue, oldValue, opts) {
		if(newValue) {
			// searchを開くのでサイドメニューを閉じておく
			this.getMain().closeContainer(200);
			// hash値を変更しておく。
			window.location.hash='search/' + escape(newValue);
		}
	},
	/**
	 * リストベースのオープン動作
	 */
	listOpen: function(name) {
		var _this = this;
		var main = Ext.getCmp('main');
		if(_this.tmpList != undefined) {
			main.setContainerItem(main, _this.tmpList);
			return;
		}
		var lists = name.split(',');
		main.setContainerItem(main, {xtype: 'tmpList'});
		_this.tmpList = Ext.getCmp('tmpListPanel');
		// mask設定
		_this.getTmpList().setMasked({
			xtype: 'loadmask',
			indicator: true
		});
		// １つ１つのデータについてyoutubeに問い合わせしていく。
		var listFunc = function(target) {
			// youtubeからデータをダウンロードして、保持しておく。
			if(target == undefined) {
				_this.getTmpList().setMasked('');
				return;
			}
			Ext.data.JsonP.request({
				url: 'http://gdata.youtube.com/feeds/api/videos/' + target,
				callbackKey: 'callback',
				params: {
					'alt': 'json',
					'v': 2
				},
				success: function(result, request) {
					// youtubeの応答からデータを構築
					var element = result.entry;
					_this.getTmpList().getStore().add({
						'title': element.title.$t.split("'").join(''),
						'target': target,
						'image': element.media$group.media$thumbnail[0].url,
						'duration': Ext.getCmp('timeUtil').makeTime(element.media$group.yt$duration.seconds, true)
					});
					listFunc(lists.shift());
				}
			});
		}
		listFunc(lists.shift())
	},
	/**
	 * 関連動画サーチ
	 */
	relateOpen: function(id) {
		var _this = this;
		// サーチ結果フィールドを表示  
		_this.getMain().list.select(0);
		// マスクをあてておく。
		_this.getSearch().setMasked({
			xtype: 'loadmask',
			indicator: true
		});
		// youtubeの関連動作サーチを実行します。
		// youtubeのサーチを実行します。
		Ext.data.JsonP.request({
			url: 'http://gdata.youtube.com/feeds/api/videos/' + id + '/related',
			callbackKey: 'callback',
			params: {
				'alt': 'json',
				'v': 2,
				'orderby': 'relevance',
				'max-results': 30
			},
			success: function(result, request) {
				// youtubeの応答からデータを構築
				_this.setupList(_this, result);
				// mask解除
				_this.getSearch().setMasked('');
			}
		});
	},
	/**
	 * キーワードサーチ
	 */
	searchOpen: function(keyword) {
		var _this = this;
		// searchにきた場合はその検索結果でyoutubeの確認を実施する。
		_this.getMain().list.select(0);
		var data = unescape(keyword);
		// 他の検索ボックスの中身を更新
		Ext.ComponentQuery.query('searchfield[name=search]').forEach(function(element){
			element.setValue(data);
		});
		// mask設定
		_this.getSearch().setMasked({
			xtype: 'loadmask',
			indicator: true
		});
		// youtubeのサーチを実行します。
		Ext.data.JsonP.request({
			url: 'http://gdata.youtube.com/feeds/api/videos',
			params: {
				'alt': 'json',
				'v': 2,
				'q': data.split(' ').join('+'),
				'orderby': 'relevance',
				'max-results': 30
			},
			success: function(result, request) {
				// youtubeの応答からデータを構築
				_this.setupList(_this, result);
				// mask解除
				_this.getSearch().setMasked('');
				// searchバーをいったん隠す
				_this.getSearch().query('[name=searchBar]')[0].hide();
			}
		});
	},
	/**
	 * リスト構築補助
	 */
	setupList: function(_this, result) {
		// リストの中身を削除
		_this.getSearch().getStore().removeAll();
		// searchバーをいったん隠す
		_this.getSearch().query('[name=searchBar]')[0].hide();
		// 結果を登録していく
		result.feed.entry.forEach(function(element) {
			_this.getSearch().getStore().add({
				'title': element.title.$t.split("'").join(''),
				'target': element.media$group.yt$videoid.$t,
				'image': element.media$group.media$thumbnail[0].url,
				'duration': Ext.getCmp('timeUtil').makeTime(element.media$group.yt$duration.seconds, true)
			});
		});
	}
});