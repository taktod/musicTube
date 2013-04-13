Ext.define('MusicTube.controller.Page', {
	extend: 'Ext.app.Controller',
	config: {
		control: {
			'#search': {
				initialize: "initItem"
			},
			'#playList': {
				initialize: "initItem"
			},
			'#listManager': {
				initialize: "initItem"
			},
			'#information': {
				initialize: "initItem"
			},
			'#ads': {
				initialize: "initItem"
			},
			'[xtype=titlebar]': {
				initialize: "initTitle"
			},
			'slidenavigationview': {
				slidestart: 'openStart',
				dragstart: 'openStart',
				open: 'openStart',
				slideend: 'closeEnd',
				closed: 'closeEnd'
			},
			'[xtype=selectfield]': {
				initialize: function(_this, eOpts) {
					_this.addAfterListener('change', function(_this, e, eOpts){
						Ext.ComponentQuery.query("[xtype=textareafield]").forEach(function(element) {
							element.setReadOnly(true);
						});
						setTimeout(function(){
							Ext.ComponentQuery.query("[xtype=textareafield]").forEach(function(element) {
								element.setReadOnly(false);
							});
						}, 1000);
					});
				}
			}
		},
		routes: {
			'page/:name': 'pageOpen'
		}
	},
	openStart: function() {
		if(Ext.getCmp('main').list.getHidden()) {
			Ext.getCmp('main').list.setHidden(false);
		}
	},
	closeEnd: function() {
		if(Ext.getCmp('main').isClosed() && !Ext.getCmp('main').list.getHidden()) {
			Ext.getCmp('main').list.setHidden(true);
		}
	},
	/**
	 * メニュー項目の初期化時
	 */
	initItem: function(_this, eOpts) {
		// titlebarのswipeによる遷移を実施している場合はsetShowAnimationをつける必要あり。
		if(this.task) {
			_this.setShowAnimation({
				type: 'slideIn',
				direction: this.task
			});
		}
	},
	/**
	 * titleバーの初期化時
	 */
	initTitle: function(_this, eOpts) {
		var controller = this;
		var x,y;
		_this.element.on("dragstart", function(_this, e, offsetX, offsetY, eOpts) {
			x = _this.pageX;
			y = _this.pageY;
		});
		_this.element.on("dragend", function(_this, e, offsetX, offsetY, eOpts) {
			var xMov = x - _this.pageX;
			var yMov = y - _this.pageY;
			if(Math.abs(xMov) < Math.abs(yMov)) {
				var main = Ext.getCmp("main");
				var selected = main.list.getSelection();
				var nextPage = main.list.getStore().indexOf(selected[0]);
				if(yMov > 0) {
					nextPage ++;
					if(nextPage > 4) {
						nextPage = 0;
					}
					controller.task = "up";
				}
				else {
					nextPage --;
					if(nextPage < 0) {
						nextPage = 4;
					}
					controller.task = "down";
				}
				// 次にうつるべきパネルが存在しているか確認する。
				try {
					switch(nextPage) {
						case 0:
							Ext.getCmp('search').setShowAnimation({
								type: 'slideIn',
								direction: controller.task
							});
							break;
						case 1:
							Ext.getCmp('playList').setShowAnimation({
								type: 'slideIn',
								direction: controller.task
							});
							break;
						case 2:
							Ext.getCmp('listManager').setShowAnimation({
								type: 'slideIn',
								direction: controller.task
							});
							break;
						case 3:
							Ext.getCmp('information').setShowAnimation({
								type: 'slideIn',
								direction: controller.task
							});
							break;
						case 4:
							Ext.getCmp('ads').setShowAnimation({
								type: 'slideIn',
								direction: controller.task
							});
							break;
					}
					controller.task = undefined;
				}
				catch(e) {
				}
				Ext.getCmp('main').list.select(nextPage);
			}
		});
	},
	/**
	 * ページを開くときの動作
	 */
	pageOpen: function(name) {
		var main = Ext.getCmp('main');
		switch(name) {
		default:
		case 'search':
			main.list.select(0);
			break;
		case 'playList':
			main.list.select(1);
			break;
		case 'listManager':
			main.list.select(2);
			break;
		case 'information':
			main.list.select(3);
			break;
		case 'ads':
			main.list.select(4);
			break;
		}
	}
});