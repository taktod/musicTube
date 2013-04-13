Ext.define('MusicTube.view.Search', {
	extend: 'MusicTube.view.ui.List',
	xtype: 'search',
	id: 'searchPanel',
	requires: [
		'MusicTube.view.ui.List',
		'Ext.field.Search'
	],
	config: {
		items: [{
			docked: 'top',
			xtype: 'titlebar',
			title: 'Search',
			items: [{
				iconCls: 'search',
				iconMask: true,
				align: 'right',
				name: 'action'
			}]
		},{
			xtype: 'toolbar',
			docked: 'top',
			ui: 'neutral',
			name: 'searchBar',
			items: [{
				xtype: 'searchfield',
				placeHolder: 'search youtube',
				clearIcon: true,
				name: 'search',
				flex: 1
			},{
				align: 'right',
				iconCls: 'settings',
				iconMask: true
			}]
		}],
		scope: this,
		listeners: {
			resize: function(_this, eOpts) {
				var tpl = [
					'<div class="x-list-item" style="height:90px;width:' + (Ext.get('main').getWidth() - 22) + 'px;overflow:hidden;margin-left:10px;margin-right:12px;">',
						'<div class="x-list-item">',
							'<div class="x-dock-horizontal">',
								'<nobr>{title}</nobr>',
								'<div><img src="{image}" style="float:left;height:60px;width:auto;">',
									'<div style="float:right;"><small>{duration}</small></div>',
									'<br style="clear:right;"/>',
									'<div class="x-button add" style="float:right;">',
										'<span class="x-button-icon add x-icon-mask"></span>',
									'</div>',
									'<div class="x-button relate" style="float:right;margin-right:8px;">',
										'<span class="x-button-icon list x-icon-mask"></span>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				].join('');
				this.setItemTpl(tpl);
				this.refresh();
			}
		}
	}
});
