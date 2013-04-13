Ext.define('MusicTube.util.Link', {
	extend: 'Ext.Component',
	id: 'linkUtil',
	/**
	 * 新規windowで開く
	 */
	openWindow: function(target) {
		var a = document.createElement("a");
		a.href = target;
		a.setAttribute("target", "_blank");
		document.body.appendChild(a);
		var e = document.createEvent("MouseEvents");
		e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
		document.body.removeChild(a);
	}
});

Ext.create('MusicTube.util.Link');
