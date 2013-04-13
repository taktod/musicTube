Ext.define('MusicTube.view.Main', {
	extend: 'Ext.ux.slidenavigation.View',
	xtype: 'main',
	id: 'main',
	requires: [
		'Ext.Panel',
		'Ext.TitleBar',
		'Ext.Audio',
		'Ext.slider.Slider',
		'MusicTube.view.Search',
		'MusicTube.view.PlayList',
		'MusicTube.view.Information',
		'MusicTube.view.ListManager',
		'MusicTube.view.Ads',
		'MusicTube.view.TmpList'
	],
	config: {
		fullscreen: false,
		containerSlideDelay: 10,
		selectSlideDuration: 200,
		itemMask: false,
		listPosition: 'left',
		closeOnSelect: false,
		slideButtonDefaults: {
			selector: 'titlebar'
		},
		groups: {
			'list':1,
			'setting':2,
			'information':3
		},
		list: {
			hidden: true,
			maxDrag: 210,
			width: 210,
			items: [{
				xtype: 'toolbar',
				docked: 'top',
				ui: 'light',
				title: {
					title: 'MusicTube',
					centered: true,
					width: 190,
					left: 0
				}
			},
			{
				xtype: 'toolbar',
				docked: 'top',
				ui: 'neutral',
				items: {
					docked: 'top',
					xtype: 'searchfield',
					name: 'search',
					placeHolder: 'search youtube',
					clearIcon: true,
					width: 180
				}
			}]
		},
		// デフォルト状態でfooterに音楽プレーヤー部をつけます。
		defaults: {
			items: {
				ui: 'light',
				docked: 'bottom',
				xtype: 'toolbar',
				id: 'controlPanel',
				xIndex: 10,
				items: [{
					iconCls: 'play1',
					iconMask: true,
					name: 'play'
				},{
					xtype: 'panel',
					flex: 1, // 横に広げる
					name: 'hogehoge',
					layout: {
						type: 'vbox' // ボックス
					},
					items: [{
						xtype: 'slider',
						name: 'slider',
						minValue: 0
					},{
						xtype: 'panel',
						ui: 'neutral',
						html: '<input type="text" id="musicInfo" style="background-color:transparent;color:#fff;text-align:center;width:100%;border:0px;" readonly="readonly" value="---">',
						style: 'padding-bottom:5px;'
					}]
				},{
					iconCls: 'minus2',
					iconMask: true,
					name: 'track'
				},{
					iconCls: 'minus2',
					iconMask: true,
					name: 'repeat'
				}]
			}
		},
		items: [
			{
				title: 'Search',
				group: 'list',
				id: 'search',
				slideButton: true,
				items: [{
					xtype: 'search'
				}]
			},
			{
				title: 'PlayList',
				group: 'list',
				id: 'playList',
				slideButton: true,
				items: [{
					xtype: 'playlist'
				}]
			},
			{
				title: 'ListManager',
				group: 'setting',
				id: 'listManager',
				slideButton: true,
				items: [{
					xtype: 'listmanager'
				}]
			},
			{
				title: 'Information',
				group: 'information',
				id: 'information',
				slideButton: true,
				items: [{
					xtype: 'information'
				}]
			},
			{
				title: 'Ads & Secrets',
				group: 'information',
				id: 'ads',
				slideButton: true,
				items: [{
					xtype: 'ads'
				}]
			}
		],
		listeners: {
			select: function(_this, item, index, eOpts) {
				item.setShowAnimation('');
				window.location.hash = 'page/' + item.getId();
			}
		}
	}
});
