Ext.define('MusicTube.view.Information', {
	extend: 'Ext.form.Panel',
	xtype: 'information',
	requires: [
		'Ext.form.FieldSet',
		'Ext.field.Text'
	],
	config: {
		scrollable: true,
		items: [{
			docked: 'top',
			xtype: 'titlebar',
			title: 'Information'
		},{
			xtype: 'fieldset',
			title: 'Information',
			defaults: {
				xtype: 'textfield',
				labelWidth: '30%',
				readOnly: true
			},
			items:[{
				label: 'Name',
				value: 'MusicTube'
			},{
				label: 'Author',
				value: 'taktod'
			},{
				label: 'Version',
				value: '0',
				name: 'version'
			}]
		},{
			xtype: 'fieldset',
			title: 'Contact',
			defaults: {
				xtype: 'textfield',
				labelWidth: '30%',
				readOnly: true
			},
			items:[{
				label: 'Blog',
				value: 'poepoemix.blogspot.jp',
				name: 'blog'
			},{
				label: 'Twitter',
				value: 'taktod',
				name: 'twitter'
			}]
		}]
	}
});
