Ext.define('MusicTube.view.ui.MovieField', {
	extend: 'Ext.field.Field',
	xtype: 'moviefield',
	requires: [
		'Ext.field.Field'
	],
	config: {
		styleHtmlContent: true,
		scope: this,
		listeners: {
			initialize: function() {
				var html = [];
				html.push(this.getHtml());
				html.push('<div class="x-button" style="float:right;">');
				html.push('<span class="x-button-icon video x-icon-mask"></span>');
				html.push('</div>');
				this.setHtml(html.join(''));
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
