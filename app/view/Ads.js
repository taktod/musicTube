Ext.define('MusicTube.view.Ads', {
	extend: 'Ext.form.Panel',
	xtype: 'ads',
	requires: [
		'MusicTube.util.Setting',
		'MusicTube.view.ui.ButtonField',
		'MusicTube.view.ui.MovieField'
	],
	config: {
		scrollable: true,
		items: [{
			docked: 'top',
			xtype: 'titlebar',
			title: 'Ads & Secrets'
		},{
			xtype: 'fieldset',
			title: 'Secrets',
			defaults: {
				labelWidth: '30%'
			},
			items: [{
				label: 'Secret 1',
				xtype: 'moviefield',
				html: '<b>Quick Launch</b><br />click ads and get quick app launch.',
				listeners: {
					tap: function() {
//						Ext.Msg.alert('Now preparing', 'Please wait!');
					}
				}
			},{
				label: 'Secret 2',
				xtype: 'moviefield',
				html: '<b>Slide Title</b><br />slide title to change panel.',
				listeners: {
					tap: function() {
//						Ext.Msg.alert('Now preparing', 'Please wait!');
					}
				}
			},{
				label: 'Secret 3',
				xtype: 'moviefield',
				html: '<b>Quick Playlist Change</b><br />double tap list title, to change music list.',
				listeners: {
					tap: function() {
//						Ext.Msg.alert('Now preparing', 'Please wait!');
					}
				}
/*			},{
				label: 'Secret 4',
				xtype: 'moviefield',
				html: '<b>Share Music</b><br />tweet or mail the list to your friends.',
				listeners: {
					tap: function() {
					}
				}*/
			}]
		},{
			xtype: 'fieldset',
			title: 'Extra commands',
			defaults: {
				labelWidth: '30%'
			},
			items: [{
				label: 'Skin',
				xtype: 'selectfield',
				options: [
					{text: 'Sencha',     'value': 'resources/css/app.css'},
					{text: 'Android',    'value': 'touch/resources/css/android.css'},
					{text: 'Apple',      'value': 'touch/resources/css/apple.css'},
					{text: 'BlackBerry', 'value': 'touch/resources/css/bb10.css'}
				],
				listeners: {
					initialize: function(_this, eOpts) {
						var settingUtil = Ext.getCmp('settingUtil');
						var skin = settingUtil.getSkin();
						if(skin != 'resources/css/app.css') {
							_this.initialized = false;
							_this.setValue(settingUtil.getSkin());
						}
					},
					change: function(_this, newValue, oldValue, eOpts) {
						if(_this.initialized) {
							var targetKey = null;
							for(var key in localStorage) {
								if(key.indexOf('resources/css/app.css') != -1) {
									var targetKey = key;
									Ext.Ajax.request({
										url: newValue,
										success: function(res){
											var settingUtil = Ext.getCmp('settingUtil');
											settingUtil.setSkin(newValue);
											localStorage[targetKey] = res.responseText;
											Ext.getCmp('main').list.setHidden(true);
											location.reload();
										}
									});
								}
							}
						}
						else {
							_this.initialized = true;
						}
					}
				}
			},{
				label: 'Speed',
				xtype: 'selectfield',
				name: 'speed',
				options: [
					{text: 'normal(x1)',       'value': 1},
					{text: 'fast(x1.25)',      'value': 1.25},
					{text: 'very fast(x1.5)',  'value': 1.5},
					{text: 'slow(x0.85)',      'value': 0.85},
					{text: 'very slow(x0.65)', 'value': 0.65}
				]
			},{
				label: 'reset',
				xtype: 'buttonfield',
				html :['<div class="x-button">',
					'<span class="x-button-label">Reset All</span>',
					'</div>'].join(''),
				listeners: {
					tap: function() {
						Ext.Msg.confirm('Reset All', 'Are you sure to reset all?', function(id) {
							if(id == 'yes') {
								// localStorageを強制クリア
								localStorage.clear();
								// リロード
								Ext.getCmp('main').list.setHidden(true);
								location.reload();
							}
						});
					}
				}
			},{
				label: 'Data',
				xtype: 'textareafield',
				name: 'dataArea'
			}]
		},{
			xtype: 'panel',
			style: 'margin-bottom: 35px;',
			layout: {
				type: 'hbox'
			},
			defaults: {
				xtype: 'button',
				style: 'margin: 0.1em',
				flex: 1
			},
			items: [{
				text: 'export',
				name: 'export'
			},{
				text: 'import',
				name: 'import'
			}]
		},{
			docked: 'bottom',
			id: 'adspace',
			listeners: {
				initialize: function() {
					Ext.get('adspace').dom.appendChild(document.getElementById('ad'));
				}
			}
		}]
	}
});
