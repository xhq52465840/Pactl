'use strict';

module.exports = ['$timeout',
	function ($timeout) {
		return {
			print: function (param) {
				param = angular.isObject(param) ? param : {};
				if (!!window.ActiveXObject || 'ActiveXObject' in window) {
					try {
						var wsShell = new ActiveXObject('WScript.Shell');
						var regPath = 'HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\';
						wsShell.RegWrite(regPath + "header", '');
						wsShell.RegWrite(regPath + "footer", '');
						wsShell.RegWrite(regPath + "margin_top", param.top || 0);
						wsShell.RegWrite(regPath + "margin_bottom", param.bottom || 0);
						wsShell.RegWrite(regPath + "margin_left", param.left || 0);
						wsShell.RegWrite(regPath + "margin_right", param.right || '0.04');
						$timeout(function () {
							document.all.WebBrowser.ExecWB(7, 1);
						}, 0);
					} catch (e) {
						window.print();
					}
				} else {
					window.print();
				}
			}
		}
	}
];