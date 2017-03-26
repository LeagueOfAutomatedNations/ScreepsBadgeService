
const ScreepsAPI = require('./screeps.js')
const _ = require("lodash");

const colors = ["#cccccc","#ebadad","#ebc1ad","#ebd4ad","#ebe7ad","#daebad","#c7ebad","#b4ebad","#adebba","#adebce","#adebe1","#ade1eb","#adceeb","#adbaeb","#b4adeb","#c7adeb","#daadeb","#ebade7","#ebadd4","#ebadc1","#808080","#d92626","#d95f26","#d99726","#d9cf26","#aad926","#71d926","#39d926","#26d94c","#26d984","#26d9bd","#26bdd9","#2684d9","#264cd9","#3926d9","#7126d9","#aa26d9","#d926cf","#d92697","#d9265f","#4d4d4d","#6b2e2e","#6b412e","#6b552e","#6b682e","#5b6b2e","#486b2e","#346b2e","#2e6b3b","#2e6b4e","#2e6b61","#2e616b","#2e4e6b","#2e3b6b","#342e6b","#482e6b","#5b2e6b","#6b2e68","#6b2e55","#6b2e41","#1a1a1a","#260d0d","#26150d","#261d0d","#26250d","#20260d","#17260d","#0f260d","#0d2612","#0d261a","#0d2622","#0d2226","#0d1a26","#0d1226","#0f0d26","#170d26","#200d26","#260d25","#260d1d","#260d15"];

const paths = {
    1: {
        calc: function(param) {
            var vert = 0,
                hor = 0;
            if (param > 0) {
                vert = param * 30 / 100;
            }
            if (param < 0) {
                hor = -param * 30 / 100;
            }
            this.path1 = ("M 50 " + (100 - vert) + " L " + hor + " 50 H " + (100 - hor) + " Z");
            this.path2 = ("M " + hor + " 50 H " + (100 - hor) + " L 50 " + vert + " Z");
        }
    },
    2: {
        calc: function(param) {
            var x = 0,
                y = 0;
            if (param > 0) {
                x = param * 30 / 100;
            }
            if (param < 0) {
                y = -param * 30 / 100;
            }
            this.path1 = ("M " + x + " " + y + " L 50 50 L " + (100 - x) + " " + y + " V -1 H -1 Z");
            this.path2 = ("M " + x + " " + (100 - y) + " L 50 50 L " + (100 - x) + " " + (100 - y) + " V 101 H -1 Z");
        }
    },
    3: {
        calc: function(param) {
            var angle = Math.PI / 4 + Math.PI / 4 * (param + 100) / 200,
                angle1 = -Math.PI / 2,
                angle2 = Math.PI / 2 + Math.PI / 3,
                angle3 = Math.PI / 2 - Math.PI / 3;
            this.path1 = ("M 50 50 L " + (50 + 100 * Math.cos(angle1 - angle / 2)) + " " + (50 + 100 * Math.sin(angle1 - angle / 2)) + " L " + (50 + 100 * Math.cos(angle1 + angle / 2)) + " " + (50 + 100 * Math.sin(angle1 + angle / 2)) + " Z");
            this.path2 = ("M 50 50 L " + (50 + 100 * Math.cos(angle2 - angle / 2)) + " " + (50 + 100 * Math.sin(angle2 - angle / 2)) + " L " + (50 + 100 * Math.cos(angle2 + angle / 2)) + " " + (50 + 100 * Math.sin(angle2 + angle / 2)) + " Z M 50 50 L " + (50 + 100 * Math.cos(angle3 - angle / 2)) + " " + (50 + 100 * Math.sin(angle3 - angle / 2)) + " L " + (50 + 100 * Math.cos(angle3 + angle / 2)) + " " + (50 + 100 * Math.sin(angle3 + angle / 2)));
        },
        flip: 'rotate180'
    },
    4: {
        calc: function(param) {
            param += 100;
            var y1 = 50 - param * 30 / 200,
                y2 = 50 + param * 30 / 200;
            this.path1 = ("M 0 " + y2 + " H 100 V 100 H 0 Z");
            this.path2 = param > 0 ? ("M 0 " + y1 + " H 100 V " + y2 + " H 0 Z") : '';
        },
        flip: 'rotate90'
    },
    5: {
        calc: function(param) {
            param += 100;
            var x1 = 50 - param * 10 / 200 - 10,
                x2 = 50 + param * 10 / 200 + 10;
            this.path1 = ("M " + x1 + " 0 H " + x2 + " V 100 H " + x1 + " Z");
            this.path2 = ("M 0 " + x1 + " H 100 V " + x2 + " H 0 Z");
        },
        flip: 'rotate45'
    },
    6: {
        calc: function(param) {
            var width = 5 + (param + 100) * 8 / 200,
                x1 = 50,
                x2 = 20,
                x3 = 80;
            this.path1 = ("M " + (x1 - width) + " 0 H " + (x1 + width) + " V 100 H " + (x1 - width));
            this.path2 = ("M " + (x2 - width) + " 0 H " + (x2 + width) + " V 100 H " + (x2 - width) + " Z M " + (x3 - width) + " 0 H " + (x3 + width) + " V 100 H " + (x3 - width) + " Z");
        },
        flip: 'rotate90'
    },
    7: {
        calc: function(param) {
            var w = 20 + param * 10 / 100;
            this.path1 = "M 0 50 Q 25 30 50 50 T 100 50 V 100 H 0 Z";
            this.path2 = ("M 0 " + (50 - w) + " Q 25 " + (30 - w) + " 50 " + (50 - w) + " T 100 " + (50 - w) + " V " + (50 + w) + " Q 75 " + (70 + w) + " 50 " + (50 + w) + " T 0 " + (50 + w) + " Z");
        },
        flip: 'rotate90'
    },
    8: {
        calc: function(param) {
            var y = param * 20 / 100;
            this.path1 = "M 0 50 H 100 V 100 H 0 Z";
            this.path2 = ("M 0 50 Q 50 " + y + " 100 50 Q 50 " + (100 - y) + " 0 50 Z");
        },
        flip: 'rotate90'
    },
    9: {
        calc: function(param) {
            var y1 = 0,
                y2 = 50,
                h = 70;
            if (param > 0)
                y1 += param / 100 * 20;
            if (param < 0)
                y2 += param / 100 * 30;
            this.path1 = ("M 50 " + y1 + " L 100 " + (y1 + h) + " V 101 H 0 V " + (y1 + h) + " Z");
            this.path2 = ("M 50 " + (y1 + y2) + " L 100 " + (y1 + y2 + h) + " V 101 H 0 V " + (y1 + y2 + h) + " Z");
        },
        flip: 'rotate180'
    },
    10: {
        calc: function(param) {
            var r = 30,
                d = 7;
            if (param > 0)
                r += param * 50 / 100;
            if (param < 0)
                d -= param * 20 / 100;
            this.path1 = ("M " + (50 + d + r) + " " + (50 - r) + " A " + r + " " + r + " 0 0 0 " + (50 + d + r) + " " + (50 + r) + " H 101 V " + (50 - r) + " Z");
            this.path2 = ("M " + (50 - d - r) + " " + (50 - r) + " A " + r + " " + r + " 0 0 1 " + (50 - d - r) + " " + (50 + r) + " H -1 V " + (50 - r) + " Z");
        },
        flip: 'rotate90'
    },
    11: {
        calc: function(param) {
            var a1 = 30,
                a2 = 30,
                x = 50 - 50 * Math.cos(Math.PI / 4),
                y = 50 - 50 * Math.sin(Math.PI / 4);
            if (param > 0) {
                a1 += param * 25 / 100;
                a2 += param * 25 / 100;
            }
            if (param < 0) {
                a2 -= param * 50 / 100;
            }
            this.path1 = ("M " + x + " " + y + " Q " + a1 + " 50 " + x + " " + (100 - y) + " H 0 V " + y + " Z M " + (100 - x) + " " + y + " Q " + (100 - a1) + " 50 " + (100 - x) + " " + (100 - y) + " H 100 V " + y + " Z");
            this.path2 = ("M " + x + " " + y + " Q 50 " + a2 + " " + (100 - x) + " " + y + " V 0 H " + x + " Z M " + x + " " + (100 - y) + " Q 50 " + (100 - a2) + " " + (100 - x) + " " + (100 - y) + " V 100 H " + x + " Z");
        },
        flip: 'rotate90'
    },
    12: {
        calc: function(param) {
            var a1 = 30,
                a2 = 35;
            if (param > 0)
                a1 += param * 30 / 100;
            if (param < 0)
                a2 += param * 15 / 100;
            this.path1 = ("M 0 " + a1 + " H 100 V 100 H 0 Z");
            this.path2 = ("M 0 " + a1 + " H " + a2 + " V 100 H 0 Z M 100 " + a1 + " H " + (100 - a2) + " V 100 H 100 Z");
        },
        flip: 'rotate180'
    },
    13: {
        calc: function(param) {
            var r = 30,
                d = 0;
            if (param > 0)
                r += param * 50 / 100;
            if (param < 0)
                d -= param * 20 / 100;
            this.path1 = "M 0 0 H 50 V 100 H 0 Z";
            this.path2 = ("M " + (50 - r) + " " + (50 - d - r) + " A " + r + " " + r + " 0 0 0 " + (50 + r) + " " + (50 - r - d) + " V 0 H " + (50 - r) + " Z");
        },
        flip: 'rotate180'
    },
    14: {
        calc: function(param) {
            var a = Math.PI / 4,
                d = 0;
            a += param * Math.PI / 4 / 100;
            this.path1 = ("M 50 0 Q 50 " + (50 + d) + " " + (50 + 50 * Math.cos(a)) + " " + (50 + 50 * Math.sin(a)) + " H 100 V 0 H 50 Z");
            this.path2 = ("M 50 0 Q 50 " + (50 + d) + " " + (50 - 50 * Math.cos(a)) + " " + (50 + 50 * Math.sin(a)) + " H 0 V 0 H 50 Z");
        },
        flip: 'rotate180'
    },
    15: {
        calc: function(param) {
            var w = 13 + param * 6 / 100,
                r1 = 80,
                r2 = 45,
                d = 10;
            this.path1 = ("M " + (50 - r1 - w) + " " + (100 + d) + " A " + (r1 + w) + " " + (r1 + w) + " 0 0 1 " + (50 + r1 + w) + " " + (100 + d) + " H " + (50 + r1 - w) + " A " + (r1 - w) + " " + (r1 - w) + " 0 1 0 " + (50 - r1 + w) + " " + (100 + d));
            this.path2 = ("M " + (50 - r2 - w) + " " + (100 + d) + " A " + (r2 + w) + " " + (r2 + w) + " 0 0 1 " + (50 + r2 + w) + " " + (100 + d) + " H " + (50 + r2 - w) + " A " + (r2 - w) + " " + (r2 - w) + " 0 1 0 " + (50 - r2 + w) + " " + (100 + d));
        },
        flip: 'rotate180'
    },
    16: {
        calc: function(param) {
            var a = 30 * Math.PI / 180,
                d = 25;
            if (param > 0) {
                a += 30 * Math.PI / 180 * param / 100;
            }
            if (param < 0) {
                d += param * 25 / 100;
            }
            this.path1 = '';
            for (var i = 0; i < 3; i++) {
                var angle1 = i * Math.PI * 2 / 3 + a / 2 - Math.PI / 2,
                    angle2 = i * Math.PI * 2 / 3 - a / 2 - Math.PI / 2;
                this.path1 += ("M " + (50 + 100 * Math.cos(angle1)) + " " + (50 + 100 * Math.sin(angle1)) + " L " + (50 + 100 * Math.cos(angle2)) + " " + (50 + 100 * Math.sin(angle2)) + " L " + (50 + d * Math.cos(angle2)) + " " + (50 + d * Math.sin(angle2)) + " A " + d + " " + d + " 0 0 1 " + (50 + d * Math.cos(angle1)) + " " + (50 + d * Math.sin(angle1)) + " Z");
            }
            this.path2 = '';
            for (var i = 0; i < 3; i++) {
                var angle1 = i * Math.PI * 2 / 3 + a / 2 + Math.PI / 2,
                    angle2 = i * Math.PI * 2 / 3 - a / 2 + Math.PI / 2;
                this.path2 += ("M " + (50 + 100 * Math.cos(angle1)) + " " + (50 + 100 * Math.sin(angle1)) + " L " + (50 + 100 * Math.cos(angle2)) + " " + (50 + 100 * Math.sin(angle2)) + " L " + (50 + d * Math.cos(angle2)) + " " + (50 + d * Math.sin(angle2)) + " A " + d + " " + d + " 0 0 1 " + (50 + d * Math.cos(angle1)) + " " + (50 + d * Math.sin(angle1)) + " Z");
            }
        }
    },
    17: {
        calc: function(param) {
            var w = 35,
                h = 45;
            if (param > 0) {
                w += param * 20 / 100;
            }
            if (param < 0) {
                h -= param * 30 / 100;
            }
            this.path1 = ("M 50 45 L " + (50 - w) + " " + (h + 45) + " H " + (50 + w) + " Z");
            this.path2 = ("M 50 0 L " + (50 - w) + " " + h + " H " + (50 + w) + " Z");
        }
    },
    18: {
        calc: function(param) {
            var a = 90 * Math.PI / 180,
                d = 10;
            if (param > 0) {
                a -= 60 / 180 * Math.PI * param / 100;
            }
            if (param < 0) {
                d -= param * 15 / 100;
            }
            this.path1 = '';
            this.path2 = '';
            for (var i = 0; i < 3; i++) {
                var angle1 = Math.PI * 2 / 3 * i + a / 2 - Math.PI / 2,
                    angle2 = Math.PI * 2 / 3 * i - a / 2 - Math.PI / 2,
                    path = ("M " + (50 + 100 * Math.cos(angle1)) + " " + (50 + 100 * Math.sin(angle1)) + " L " + (50 + 100 * Math.cos(angle2)) + " " + (50 + 100 * Math.sin(angle2)) + " L " + (50 + d * Math.cos((angle1 + angle2) / 2)) + " " + (50 + d * Math.sin((angle1 + angle2) / 2)) + " Z");
                if (!i) {
                    this.path1 += path;
                } else {
                    this.path2 += path;
                }
            }
        },
        flip: 'rotate180'
    },
    19: {
        calc: function(param) {
            var w2 = 20,
                w1 = 60;
            w1 += param * 20 / 100;
            w2 += param * 20 / 100;
            this.path1 = ("M 50 -10 L " + (50 - w1) + " 100 H " + (50 + w1) + " Z");
            this.path2 = '';
            if (w2 > 0) {
                this.path2 = ("M 50 0 L " + (50 - w2) + " 100 H " + (50 + w2) + " Z");
            }
        },
        flip: 'rotate180'
    },
    20: {
        calc: function(param) {
            var w = 10,
                h = 20;
            if (param > 0)
                w += param * 20 / 100;
            if (param < 0)
                h += param * 40 / 100;
            this.path1 = ("M 0 " + (50 - h) + " H " + (50 - w) + " V 100 H 0 Z");
            this.path2 = ("M " + (50 + w) + " 0 V " + (50 + h) + " H 100 V 0 Z");
        },
        flip: 'rotate90'
    },
    21: {
        calc: function(param) {
            var w = 40,
                h = 50;
            if (param > 0)
                w -= param * 20 / 100;
            if (param < 0)
                h += param * 20 / 100;
            this.path1 = ("M 50 " + h + " Q " + (50 + w) + " 0 50 0 T 50 " + h + " Z M 50 " + (100 - h) + " Q " + (50 + w) + " 100 50 100 T 50 " + (100 - h) + " Z");
            this.path2 = ("M " + h + " 50 Q 0 " + (50 + w) + " 0 50 T " + h + " 50 Z M " + (100 - h) + " 50 Q 100 " + (50 + w) + " 100 50 T " + (100 - h) + " 50 Z");
        },
        flip: 'rotate45'
    },
    22: {
        calc: function(param) {
            var w = 20;
            w += param * 10 / 100;
            this.path1 = ("M " + (50 - w) + " " + (50 - w) + " H " + (50 + w) + " V " + (50 + w) + " H " + (50 - w) + " Z");
            this.path2 = '';
            for (var i = -4; i < 4; i++) {
                for (var j = -4; j < 4; j++) {
                    var a = (i + j) % 2;
                    this.path2 += ("M " + (50 - w - w * 2 * i) + " " + (50 - w - w * 2 * (j + a)) + " h " + -w * 2 + " v " + w * 2 + " h " + w * 2 + " Z");
                }
            }
        },
        flip: 'rotate45'
    },
    23: {
        calc: function(param) {
            var w = 17,
                h = 25;
            if (param > 0)
                w += param * 35 / 100;
            if (param < 0)
                h -= param * 23 / 100;
            this.path1 = '';
            for (var i = -4; i <= 4; i++) {
                this.path1 += ("M " + (50 - w * i * 2) + " " + (50 - h) + " l " + -w + " " + -h + " l " + -w + " " + h + " l " + w + " " + h + " Z");
            }
            this.path2 = '';
            for (var i = -4; i <= 4; i++) {
                this.path2 += ("M " + (50 - w * i * 2) + " " + (50 + h) + " l " + -w + " " + -h + " l " + -w + " " + h + " l " + w + " " + h + " Z");
            }
        },
        flip: 'rotate90'
    },
    24: {
        calc: function(param) {
            var w = 50,
                h = 45;
            if (param > 0)
                w += param * 60 / 100;
            if (param < 0)
                h += param * 30 / 100;
            this.path1 = ("M 0 " + h + " L 50 70 L 100 " + h + " V 100 H 0 Z");
            this.path2 = ("M 50 0 L " + (50 + w) + " 100 H 100 V " + h + " L 50 70 L 0 " + h + " V 100 H " + (50 - w) + " Z");
        },
        flip: 'rotate180'
    }
};

// this function provided by esryok under the MIT license.
var get_svg_xml = function (badgeDefinition, size=250) {
  const pathDefinitionSize = 100;

  // determine colors
  let baseColor = _.isString(badgeDefinition.color1) ? badgeDefinition.color1 : colors[badgeDefinition.color1];

  let customizations = [{
    color: _.isString(badgeDefinition.color2) ? badgeDefinition.color2 : colors[badgeDefinition.color2]
  }, {
    color: _.isString(badgeDefinition.color3) ? badgeDefinition.color3 : colors[badgeDefinition.color3]
  }];

  // determine customization paths
  if (_.isNumber(badgeDefinition.type)) {
    paths[badgeDefinition.type].calc(badgeDefinition.param);
    customizations[0].path = paths[badgeDefinition.type].path1;
    customizations[1].path = paths[badgeDefinition.type].path2;
  } else {
    customizations[0].path = badgeDefinition.type.path1;
    customizations[1].path = badgeDefinition.type.path2;
  }

  // determine the canvas rotation
  let rotation = 0;
  if (badgeDefinition.flip && paths[badgeDefinition.type].flip) {
    rotation = parseInt(paths[badgeDefinition.type].flip.substring(6));
  }

  // build the svg xml
  let center = pathDefinitionSize / 2;
  var o, q;
  let xml = `<svg width="${size}" height="${size}" viewBox="0 0 ${pathDefinitionSize} ${pathDefinitionSize}" shape-rendering="geometricPrecision">
    \t<defs><clipPath id="clip"><circle cx="${center}" cy="${center}" r="${pathDefinitionSize / 2}" /></clipPath></defs>
    \t<g transform="rotate(${rotation} ${center} ${center})">
    \t\t<rect x="0" y="0" width="${pathDefinitionSize}" height="${pathDefinitionSize}" fill="${baseColor}" clip-path="url(#clip)"/>`;

  for (let i in customizations) {
      if (customizations[i].path) {
          xml += `\t\t<path d="${customizations[i].path}" fill="${customizations[i].color}" clip-path="url(#clip)"/>`;
      }
  }
  xml += "\n\t</g>";
  xml += "\n</svg>";

  return xml
}

module.exports.getBadgeByName = function (username) {
  return ScreepsAPI.userdata_from_username(username)
  .then(function(data){
    return get_svg_xml(data.user.badge)
  })
  .then(function(xml){
    return xml
  }).catch(function(err){
    console.log(err.message)
    console.log(err.stack)
  })
}

module.exports.getBadgeFromDefinition = function (badgeDefinition) {
  return get_svg_xml(badgeDefinition)
}
