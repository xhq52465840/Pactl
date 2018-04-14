'use strict';

module.exports = ['$scope', 'restAPI', '$modalInstance', '$rootScope', '$modal', '$stateParams', 'Notification', 'items',
	function ($scope, restAPI, $modalInstance, $rootScope, $modal, $stateParams, Notification, items) {
		var vm = $scope;
		vm.afterEdit = false;
		vm.cancel = cancel;
		vm.edit = edit;
		vm.moves = items.moves;
		vm.rows = items.rows;
		vm.title = items.title;
		vm.awId = items.awId;
		vm.save = save;
		vm.add = add;
		vm.remove = remove;
		vm.errorData = [];
		vm.changeText5 = changeText5;
		vm.changeSelected = changeSelected;
		vm.index = 0;
		vm.loading = false;
		vm.onlyNum = onlyNum
		function onlyNum(row){			
			try {
      			if(row.pieces<1){
      		 		row.pieces = ''
      		}else{
       	 row.pieces = row.pieces.replace(/[^0-9]/g, '');}
     		 } catch (error) {
       		 return;
      }
		}
		/**
		 * 迁转至下拉列表
		 */
		vm.tranData = [{
			name: "外货站",
			id: "0"
		}, {
			name: "本货站",
			id: "1"
		}];
		vm.airData = [];
		getAirData();

		/**
		 * 获取航空公司
		 */
		function getAirData() {
			vm.loading = true;
			restAPI.airData.queryAll.save({}, {})
				.$promise.then(function (resp) {
					vm.loading = false;
					vm.airData = resp.data;
					search();
				});
		}
		/**
		 * 查询
		 */
		function search() {
			vm.loading = true;
			restAPI.waybill.queryMove.save({}, {
					awId: vm.awId
				})
				.$promise.then(function (resp) {
					console.log(resp.data)
					vm.loading = false;
					if (resp.ok) {
						vm.rows = resp.data;
						setData();
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}

		function setData() {
			angular.forEach(vm.rows, function (m, n) {
				m.index = vm.index++;
				if (m.tranAgentOprn) {
					for (var i = 0; i < vm.tranData.length; i++) {
						if (m.tranAgentOprn === vm.tranData[i].name) {
							m.tranAgentOprn = vm.tranData[i];
						}
					}
					for (var i = 0; i < vm.airData.length; i++) {
						if (m.carrier === vm.airData[i].airCode) {
							m.carrier = vm.airData[i];
						}
					}
				}
			});
		}

		/**
		 * 编辑
		 */
		function add() {
			var obj = {
				editing: true,
				awId: vm.awId,
				index: vm.index++
			};
			vm.rows.push(obj);
		}

		function edit(row, editing) {
			row.editing = editing;
		}

		function remove(row) {
			if(!row.tranAgentOprn && !row.pieces) {
				var index = vm.rows.indexOf(row);
				if (index >= 0) {
					vm.rows.splice(index, 1);
				}
				return;
			} 
			var delDialog = $modal.open({
				template: require('../../../../remove/remove.html'),
				controller: require('../../../../remove/remove.ctrl.js'),
				size: 'md',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
							title: '删除空侧迁转',
							content: '你将要删除迁转到' + ( (row.tranAgentOprn && row.tranAgentOprn.name) || '') + ' ' + (row.pieces || '') + '件的记录。此操作在保存后生效。'
						};
					}
				}
			});
			delDialog.result.then(function () {
				var index = vm.rows.indexOf(row);
				if (index >= 0) {
					vm.rows.splice(index, 1);
				}
			}, function () {

			});
		}

		/**
		 * 航空公司二字码+  最多5位航班号
		 * 5位   （ 可以3位数字，，前4位数字，第5位可以是字母或数字）
		 *   新需求，第五位必须是字母
		 * 
		 * @param {any} text
		 */
		function changeSelected(row, text) {
			var errField = row.index + text;
			if (row[text] === '' && text === 'name') {
				if (index > -1) {
					vm.errorData.splice(index, 1);
				}
				return;
			}
			if (text === 'name' && row.name && row.name.length > 0) {
				var isOK = true;
				var index = vm.errorData.indexOf(errField);
				if (row.carrier && row.carrier.airCode) {
					if (row.carrier.airCode !== row[text].substr(0, 2)) {
						isOK = false;
					}
				}
				if (!/^[A-Z\d]{2}(\d{3,4}|\d{4}[A-Z]{0,1})$/g.test(row[text])) {
					isOK = false;

				}
				if (isOK) {
					if (index > -1) {
						vm.errorData.splice(index, 1);
					}
				} else {
					if (index < 0) {
						vm.errorData.push(errField);
					}
				}
			}
		}


		/**
		 * 航空公司二字码+  最多5位航班号
		 * 5位   （ 可以3位数字，，前4位数字，第5位可以是字母或数字）
		 *   新需求，第五位必须是字母
		 * 
		 * @param {any} text
		 */
		function changeText5(row, text) {
			row[text] = row[text].replace(/[^a-zA-Z\d]/g, '').toUpperCase();
			var errField = row.index + text;
			var index = vm.errorData.indexOf(errField);
			if (row[text] === '' && text === 'name') {
				if (index > -1) {
					vm.errorData.splice(index, 1);
				}
				return;
			}
			if (text === 'name') {
				var isOK = true;
				if (row.carrier && row.carrier.airCode) {
					if (row.carrier.airCode !== row[text].substr(0, 2)) {
						isOK = false;
					}
				}
				if (!/^[A-Z\d]{2}(\d{3,4}|\d{4}[A-Z]{0,1})$/g.test(row[text])) {
					isOK = false;

				}
				if (isOK) {
					if (index > -1) {
						vm.errorData.splice(index, 1);
					}
				} else {
					if (index < 0) {
						vm.errorData.push(errField);
					}
				}
			}
		}

		function verifyData() {
			if (vm.errorData.length > 0) {
				return "航班号填写不正确";
			}
			var error = null;
			for (var i = 0; i < vm.rows.length; i++) {
				var data = vm.rows[i];
				if (!data.tranAgentOprn || !data.pieces) {
					error = '请填写完整数据';
					break;
				}
			}
			return error;
		}

		function getData() {
			var pEmptyTransitsOutsideList = [];
			for (var i = 0; i < vm.rows.length; i++) {
				var obj = {};
				var data = vm.rows[i];
				obj.etId = data.etId;
				obj.awId = data.awId;
				obj.tranAgentOprn = data.tranAgentOprn.name||data.tranAgentOprn;
				obj.pieces = data.pieces;
				if (obj.tranAgentOprn === 'PACTL'||obj.tranAgentOprn === '本货站') {
					obj.agentOprn = '';
					if(data.carrier) {
						obj.carrier = data.carrier.airCode;
					}
					obj.dept = '';
					obj.dest = '';
					obj.fltDate = data.fltDate;
					obj.weight = '';
					obj.chargeableWeight = '';
					obj.volume = '';
					obj.name = data.name;
					obj.specialCode = '';
					//obj.remark1 = '';
					obj.remark2 = "";
				}
				pEmptyTransitsOutsideList.push(obj);
			}
			var data = {
				awId: vm.awId,
				pEmptyTransitsOutsideList: pEmptyTransitsOutsideList
			};
			return data;
		}
		/**
		 * 保存
		 */
		function save() {
			var error = verifyData();
			if (error) {
				Notification.error({
					message: error
				});
				return;
			}
			var data = getData();
			vm.loading = true;
			restAPI.waybill.editMove.save({}, data)
				.$promise.then(function (resp) {
					vm.loading = false;
					if (resp.ok) {
						Notification.success({
							message: '空侧迁转保存成功'
						});
						search();
					} else {
						Notification.error({
							message: resp.msg
						});
					}
				});
		}
		/**
		 * 取消
		 */
		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}
];