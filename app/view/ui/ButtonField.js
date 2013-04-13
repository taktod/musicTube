Ext.define('MusicTube.view.ui.ButtonField', {
	extend: 'Ext.field.Field',
	xtype: 'buttonfield',
	requires: [
		'Ext.field.Field'
	],
	config: {
		styleHtmlContent: true,
		html: ['<div class="x-button">',
			'<span class="x-button-label"></span>',
			'</div>'].join(''),
		scope: this,
		listeners: {
			initialize: function() {
				this.bodyElement.addListener('touchstart', function(_this, e, eOpts) {
					if(_this.getTarget('.x-button')) {
						Ext.fly(_this.getTarget(".x-button")).addCls('x-button-pressed');
					}
				});
				this.bodyElement.addListener('touchend', function(_this, e, eOpts) {
					if(_this.getTarget('.x-button')) {
						Ext.fly(_this.getTarget(".x-button")).removeCls('x-button-pressed');
					}
				});
				var field = this;
				this.bodyElement.addListener('tap', function(_this, e, eOpts){
					if(_this.getTarget('.x-button')) {
						field.fireEvent('tap', _this, e, eOpts);
					}
				})
			}
		}
	}
});
