Ext.define('MusicTube.view.ListManager', {
	extend: 'Ext.form.Panel',
	xtype: 'listmanager',
	requires: [
		'Ext.field.Select'
	],
	config: {
		items: [{
			docked: 'top',
			xtype: 'titlebar',
			title: 'ListManager',
			items: [{
				iconCls: 'action',
				iconMask: true,
				align: 'right',
				name: 'action'
			}]
		},{
			xtype: 'fieldset',
			defaults: {
				labelWidth: '30%'
			},
			items: [{
				label: 'Name',
				xtype: 'selectfield',
				name: 'selector'
			}]
		},{
			xtype: 'fieldset',
			defaults: {
				labelWidth: '30%'
			},
			items: [{
				label: 'Default',
				xtype: 'checkboxfield',
				name: 'check',
				checked: true
			}]
		},{
			xtype: 'panel',
			width: '100%',
			items: [{
				xtype: 'button',
				text: 'delete',
				style: 'margin: 0 25%',
				align: 'center',
				name: 'delete'
			}]
		}]
	}
});
