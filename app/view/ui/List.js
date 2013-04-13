Ext.define('MusicTube.view.ui.List', {
	extend: 'Ext.dataview.DataView',
	requires: [
		'Ext.dataview.DataView'
	],
	config: {
		pressedCls: '',
		selectedCls: 'x-dataview-selected',
		allowDeselect: false,
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		lock: false,
		store: {
			fields: [
				'title',
				'target',
				'image',
				'duration'
			]
		},
		itemTpl: "",
		listeners: {
			itemtouchstart: function(_this, index, target, record, e, eOpts) {
				if(e.getTarget('.x-button')) {
					Ext.fly(e.getTarget(".x-button")).addCls('x-button-pressed');
				}
			},
			itemtouchend: function(_this, index, target, record, e, eOpts) {
				if(e.getTarget('.x-button')) {
					Ext.fly(e.getTarget(".x-button")).removeCls('x-button-pressed');
				}
			}
		}
	}
});
