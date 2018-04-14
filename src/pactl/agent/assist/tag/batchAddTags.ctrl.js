'use strict';

module.exports = ['$scope', '$modalInstance', 'items', 'Page',
  function ($scope, $modalInstance, items, Page) {
    var vm = $scope;
    var obj = angular.copy(items);
    vm.title = obj.title;
    vm.tagsObj = obj.obj;
    vm.save = save;
    vm.cancel = cancel;
    vm.previewTags = previewTags;
    vm.tags = [];
    vm.showItem = {
      start: 0,
      end: 0
    };
    vm.pageChanged = pageChanged;
    vm.page = Page.initPage();
    vm.colors = {};
    vm.amount = 0;
    initColors();
    /**
     * 保存
     */
    function save() {
      $modalInstance.close(vm.tags);
    }

    function previewTags() {
      vm.tags = [];
      var str = vm.tagsObj.names;
      var amount = 0;
      if (str && str.length > 0) {
        var rows = str.split("\n");
        amount = rows.length;
        if (rows.length > 0) {
          for (var i = 0; i < rows.length; i++) {
            if (rows[i] && rows[i].length > 0) {
              var rowStr = rows[i].replace(/\s+/g, " ").trim();
              var tagArr = rowStr.split(" ");
              if (tagArr.length >= 2) {
                var color = vm.colors[tagArr[1]];
                if(color) {
                  vm.tags.push({
                    name: tagArr[0], style: color, styleObj: { 'background-color': color }
                  });
                }
              }
            }
          }
        }
      }
      vm.amount = amount;
      showTages();
    }

    function showTages() {
      var resp = {
        rows: vm.tags,
        total: vm.tags.length
      };
      vm.showItem = {
        start: (vm.page.currentPage - 1) * vm.page.length - 1,
        end: vm.page.currentPage * vm.page.length
      };
      Page.setPage(vm.page, resp);
    }
    /**
		 * 翻页
		 */
    function pageChanged() {
      Page.pageChanged(vm.page, showTages);
    }
    /**
     * 取消
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    function initColors() {
      var colors = {};
      colors["LightPink"] = "#FFB6C1";
      colors["Pink"] = "#FFC0CB";
      colors["Crimson"] = "#DC143C";
      colors["LavenderBlush"] = "#FFF0F5";
      colors["PaleVioletRed"] = "#DB7093";
      colors["HotPink"] = "#FF69B4";
      colors["DeepPink"] = "#FF1493";
      colors["MediumVioletRed"] = "#C71585";
      colors["Orchid"] = "#DA70D6";
      colors["Thistle"] = "#D8BFD8";
      colors["plum"] = "#DDA0DD";
      colors["Violet"] = "#EE82EE";
      colors["Magenta"] = "#FF00FF";
      colors["Fuchsia"] = "#FF00FF";
      colors["DarkMagenta"] = "#8B008B";
      colors["Purple"] = "#800080";
      colors["MediumOrchid"] = "#BA55D3";
      colors["DarkVoilet"] = "#9400D3";
      colors["DarkOrchid"] = "#9932CC";
      colors["Indigo"] = "#4B0082";
      colors["BlueViolet"] = "#8A2BE2";
      colors["MediumPurple"] = "#9370DB";
      colors["MediumSlateBlue"] = "#7B68EE";
      colors["SlateBlue"] = "#6A5ACD";
      colors["DarkSlateBlue"] = "#483D8B";
      colors["Lavender"] = "#E6E6FA";
      colors["GhostWhite"] = "#F8F8FF";
      colors["Blue"] = "#0000FF";
      colors["MediumBlue"] = "#0000CD";
      colors["MidnightBlue"] = "#191970";
      colors["DarkBlue"] = "#00008B";
      colors["Navy"] = "#000080";
      colors["RoyalBlue"] = "#4169E1";
      colors["CornflowerBlue"] = "#6495ED";
      colors["LightSteelBlue"] = "#B0C4DE";
      colors["LightSlateGray"] = "#778899";
      colors["SlateGray"] = "#708090";
      colors["DoderBlue"] = "#1E90FF";
      colors["AliceBlue"] = "#F0F8FF";
      colors["SteelBlue"] = "#4682B4";
      colors["LightSkyBlue"] = "#87CEFA";
      colors["SkyBlue"] = "#87CEEB";
      colors["DeepSkyBlue"] = "#00BFFF";
      colors["LightBLue"] = "#ADD8E6";
      colors["PowDerBlue"] = "#B0E0E6";
      colors["CadetBlue"] = "#5F9EA0";
      colors["Azure"] = "#F0FFFF";
      colors["LightCyan"] = "#E1FFFF";
      colors["PaleTurquoise"] = "#AFEEEE";
      colors["Cyan"] = "#00FFFF";
      colors["Aqua"] = "#00FFFF";
      colors["DarkTurquoise"] = "#00CED1";
      colors["DarkSlateGray"] = "#2F4F4F";
      colors["DarkCyan"] = "#008B8B";
      colors["Teal"] = "#008080";
      colors["MediumTurquoise"] = "#48D1CC";
      colors["LightSeaGreen"] = "#20B2AA";
      colors["Turquoise"] = "#40E0D0";
      colors["Auqamarin"] = "#7FFFAA";
      colors["MediumAquamarine"] = "#00FA9A";
      colors["MediumSpringGreen"] = "#F5FFFA";
      colors["MintCream"] = "#00FF7F";
      colors["SpringGreen"] = "#3CB371";
      colors["SeaGreen"] = "#2E8B57";
      colors["Honeydew"] = "#F0FFF0";
      colors["LightGreen"] = "#90EE90";
      colors["PaleGreen"] = "#98FB98";
      colors["DarkSeaGreen"] = "#8FBC8F";
      colors["LimeGreen"] = "#32CD32";
      colors["Lime"] = "#00FF00";
      colors["ForestGreen"] = "#228B22";
      colors["Green"] = "#008000";
      colors["DarkGreen"] = "#006400";
      colors["Chartreuse"] = "#7FFF00";
      colors["LawnGreen"] = "#7CFC00";
      colors["GreenYellow"] = "#ADFF2F";
      colors["OliveDrab"] = "#556B2F";
      colors["Beige"] = "#6B8E23";
      colors["LightGoldenrodYellow"] = "#FAFAD2";
      colors["Ivory"] = "#FFFFF0";
      colors["LightYellow"] = "#FFFFE0";
      colors["Yellow"] = "#FFFF00";
      colors["Olive"] = "#808000";
      colors["DarkKhaki"] = "#BDB76B";
      colors["LemonChiffon"] = "#FFFACD";
      colors["PaleGodenrod"] = "#EEE8AA";
      colors["Khaki"] = "#F0E68C";
      colors["Gold"] = "#FFD700";
      colors["Cornislk"] = "#FFF8DC";
      colors["GoldEnrod"] = "#DAA520";
      colors["FloralWhite"] = "#FFFAF0";
      colors["OldLace"] = "#FDF5E6";
      colors["Wheat"] = "#F5DEB3";
      colors["Moccasin"] = "#FFE4B5";
      colors["Orange"] = "#FFA500";
      colors["PapayaWhip"] = "#FFEFD5";
      colors["BlanchedAlmond"] = "#FFEBCD";
      colors["NavajoWhite"] = "#FFDEAD";
      colors["AntiqueWhite"] = "#FAEBD7";
      colors["Tan"] = "#D2B48C";
      colors["BrulyWood"] = "#DEB887";
      colors["Bisque"] = "#FFE4C4";
      colors["DarkOrange"] = "#FF8C00";
      colors["Linen"] = "#FAF0E6";
      colors["Peru"] = "#CD853F";
      colors["PeachPuff"] = "#FFDAB9";
      colors["SandyBrown"] = "#F4A460";
      colors["Chocolate"] = "#D2691E";
      colors["SaddleBrown"] = "#8B4513";
      colors["SeaShell"] = "#FFF5EE";
      colors["Sienna"] = "#A0522D";
      colors["LightSalmon"] = "#FFA07A";
      colors["Coral"] = "#FF7F50";
      colors["OrangeRed"] = "#FF4500";
      colors["DarkSalmon"] = "#E9967A";
      colors["Tomato"] = "#FF6347";
      colors["MistyRose"] = "#FFE4E1";
      colors["Salmon"] = "#FA8072";
      colors["Snow"] = "#FFFAFA";
      colors["LightCoral"] = "#F08080";
      colors["RosyBrown"] = "#BC8F8F";
      colors["IndianRed"] = "#CD5C5C";
      colors["Red"] = "#FF0000";
      colors["Brown"] = "#A52A2A";
      colors["FireBrick"] = "#B22222";
      colors["DarkRed"] = "#8B0000";
      colors["Maroon"] = "#800000";
      colors["White"] = "#FFFFFF";
      colors["WhiteSmoke"] = "#F5F5F5";
      colors["Gainsboro"] = "#DCDCDC";
      colors["LightGrey"] = "#D3D3D3";
      colors["Silver"] = "#C0C0C0";
      colors["DarkGray"] = "#A9A9A9";
      colors["Gray"] = "#808080";
      colors["DimGray"] = "#696969";
      colors["Black"] = "#000000";
      colors["浅粉红"] = "#FFB6C1";
      colors["粉红"] = "#FFC0CB";
      colors["猩红"] = "#DC143C";
      colors["脸红的淡紫色"] = "#FFF0F5";
      colors["苍白的紫罗兰红色"] = "#DB7093";
      colors["热情的粉红"] = "#FF69B4";
      colors["深粉色"] = "#FF1493";
      colors["适中的紫罗兰红色"] = "#C71585";
      colors["兰花的紫色"] = "#DA70D6";
      colors["蓟"] = "#D8BFD8";
      colors["李子"] = "#DDA0DD";
      colors["紫罗兰"] = "#EE82EE";
      colors["洋红"] = "#FF00FF";
      colors["灯笼海棠(紫红色)"] = "#FF00FF";
      colors["深洋红色"] = "#8B008B";
      colors["紫色"] = "#800080";
      colors["适中的兰花紫"] = "#BA55D3";
      colors["深紫罗兰色"] = "#9400D3";
      colors["深兰花紫"] = "#9932CC";
      colors["靛青"] = "#4B0082";
      colors["深紫罗兰的蓝色"] = "#8A2BE2";
      colors["适中的紫色"] = "#9370DB";
      colors["适中的板岩暗蓝灰色"] = "#7B68EE";
      colors["板岩暗蓝灰色"] = "#6A5ACD";
      colors["深岩暗蓝灰色"] = "#483D8B";
      colors["熏衣草花的淡紫色"] = "#E6E6FA";
      colors["幽灵的白色"] = "#F8F8FF";
      colors["纯蓝"] = "#0000FF";
      colors["适中的蓝色"] = "#0000CD";
      colors["午夜的蓝色"] = "#191970";
      colors["深蓝色"] = "#00008B";
      colors["海军蓝"] = "#000080";
      colors["皇军蓝"] = "#4169E1";
      colors["矢车菊的蓝色"] = "#6495ED";
      colors["淡钢蓝"] = "#B0C4DE";
      colors["浅石板灰"] = "#778899";
      colors["石板灰"] = "#708090";
      colors["道奇蓝"] = "#1E90FF";
      colors["爱丽丝蓝"] = "#F0F8FF";
      colors["钢蓝"] = "#4682B4";
      colors["淡蓝色"] = "#87CEFA";
      colors["天蓝色"] = "#87CEEB";
      colors["深天蓝"] = "#00BFFF";
      colors["淡蓝"] = "#ADD8E6";
      colors["火药蓝"] = "#B0E0E6";
      colors["军校蓝"] = "#5F9EA0";
      colors["蔚蓝色"] = "#F0FFFF";
      colors["淡青色"] = "#E1FFFF";
      colors["苍白的绿宝石"] = "#AFEEEE";
      colors["青色"] = "#00FFFF";
      colors["水绿色"] = "#00FFFF";
      colors["深绿宝石"] = "#00CED1";
      colors["深石板灰"] = "#2F4F4F";
      colors["深青色"] = "#008B8B";
      colors["水鸭色"] = "#008080";
      colors["适中的绿宝石"] = "#48D1CC";
      colors["浅海洋绿"] = "#20B2AA";
      colors["绿宝石"] = "#40E0D0";
      colors["绿玉"] = "#7FFFAA";
      colors["碧绿色"] = "#7FFFAA";
      colors["适中的碧绿色"] = "#00FA9A";
      colors["适中的春天的绿色"] = "#F5FFFA";
      colors["薄荷奶油"] = "#00FF7F";
      colors["春天的绿色"] = "#3CB371";
      colors["海洋绿"] = "#2E8B57";
      colors["蜂蜜"] = "#F0FFF0";
      colors["淡绿色"] = "#90EE90";
      colors["苍白的绿色"] = "#98FB98";
      colors["深海洋绿"] = "#8FBC8F";
      colors["酸橙绿"] = "#32CD32";
      colors["酸橙色"] = "#00FF00";
      colors["森林绿"] = "#228B22";
      colors["纯绿"] = "#008000";
      colors["深绿色"] = "#006400";
      colors["查特酒绿"] = "#7FFF00";
      colors["草坪绿"] = "#7CFC00";
      colors["绿黄色"] = "#ADFF2F";
      colors["橄榄土褐色"] = "#556B2F";
      colors["米色(浅褐色)"] = "#6B8E23";
      colors["浅秋麒麟黄"] = "#FAFAD2";
      colors["象牙"] = "#FFFFF0";
      colors["浅黄色"] = "#FFFFE0";
      colors["纯黄"] = "#FFFF00";
      colors["橄榄"] = "#808000";
      colors["深卡其布"] = "#BDB76B";
      colors["柠檬薄纱"] = "#FFFACD";
      colors["灰秋麒麟"] = "#EEE8AA";
      colors["卡其布"] = "#F0E68C";
      colors["金"] = "#FFD700";
      colors["玉米色"] = "#FFF8DC";
      colors["秋麒麟"] = "#DAA520";
      colors["花的白色"] = "#FFFAF0";
      colors["老饰带"] = "#FDF5E6";
      colors["小麦色"] = "#F5DEB3";
      colors["鹿皮鞋"] = "#FFE4B5";
      colors["橙色"] = "#FFA500";
      colors["番木瓜"] = "#FFEFD5";
      colors["漂白的杏仁"] = "#FFEBCD";
      colors["Navajo白"] = "#FFDEAD";
      colors["古代的白色"] = "#FAEBD7";
      colors["晒黑"] = "#D2B48C";
      colors["结实的树"] = "#DEB887";
      colors["(浓汤)乳脂,番茄等"] = "#FFE4C4";
      colors["深橙色"] = "#FF8C00";
      colors["亚麻布"] = "#FAF0E6";
      colors["秘鲁"] = "#CD853F";
      colors["桃色"] = "#FFDAB9";
      colors["沙棕色"] = "#F4A460";
      colors["巧克力"] = "#D2691E";
      colors["马鞍棕色"] = "#8B4513";
      colors["海贝壳"] = "#FFF5EE";
      colors["黄土赭色"] = "#A0522D";
      colors["浅鲜肉(鲑鱼)色"] = "#FFA07A";
      colors["珊瑚"] = "#FF7F50";
      colors["橙红色"] = "#FF4500";
      colors["深鲜肉(鲑鱼)色"] = "#E9967A";
      colors["番茄"] = "#FF6347";
      colors["薄雾玫瑰"] = "#FFE4E1";
      colors["鲜肉(鲑鱼)色"] = "#FA8072";
      colors["雪"] = "#FFFAFA";
      colors["淡珊瑚色"] = "#F08080";
      colors["玫瑰棕色"] = "#BC8F8F";
      colors["印度红"] = "#CD5C5C";
      colors["纯红"] = "#FF0000";
      colors["棕色"] = "#A52A2A";
      colors["耐火砖"] = "#B22222";
      colors["深红色"] = "#8B0000";
      colors["栗色"] = "#800000";
      colors["纯白"] = "#FFFFFF";
      colors["白烟"] = "#F5F5F5";
      colors["Gainsboro"] = "#DCDCDC";
      colors["浅灰色"] = "#D3D3D3";
      colors["银白色"] = "#C0C0C0";
      colors["深灰色"] = "#A9A9A9";
      colors["灰色"] = "#808080";
      colors["暗淡的灰色"] = "#696969";
      colors["纯黑"] = "#000000";
      vm.colors = colors;
    }
  }
];