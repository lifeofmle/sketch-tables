const sketch = require('sketch');
var Artboard = require('sketch/dom').Artboard
var UI = require('sketch/ui');
var Text = require('sketch/dom').Text;
var Shape = require('sketch/dom').Shape;
var Rectangle = require('sketch/dom').Rectangle;
var Group = require('sketch/dom').Group;
var Style = require('sketch/dom').Style;

function parentOffsetInArtboard(layer) {
	var offset = {
		x: 0,
		y: 0
	};

	var parent = layer.parent;

	while (parent.name && parent.type !== 'Artboard') {
		offset.x += parent.frame.x;
		offset.y += parent.frame.y;
		parent = parent.parent;
	}
	return offset;
}

function moveLayer(layer, x, y) {
	var newFrame = new sketch.Rectangle(layer.frame);
	if(layer.parent.type == 'Artboard'){
		var parentOffset = parentOffsetInArtboard(layer);
		newFrame.x = x - parentOffset.x;
		newFrame.y = y - parentOffset.y;
	}else{
		newFrame.x = x;
		newFrame.y = y;
	}
	layer.frame = newFrame;
	updateParentFrames(layer);
}

function updateParentFrames(layer) {
	var parent = layer.parent;
	while (parent && parent.name && parent.type !== 'Artboard') {
		if(parent.type !== 'SymbolMaster'){
			parent.adjustToFit();
		}
		parent = parent.parent;
	}
}

export default function(context) {
  const document = sketch.fromNative(context.document);
  const page = document.selectedPage;
  selection = document.selectedLayers;

  var artboard = new Artboard({
      name: 'Table/Cell',
      parent: page,
      frame: new Rectangle(0, 0, 200, 40)
  });

//   if(selection.length === 0){
//     UI.message("Oops! You have to select something for the magic to happen!");
//     return;
//   }

  selection.layers.forEach(layer => {
    var x, y;
    var width = layer.frame.width;
    var height = layer.frame.height;

    x = layer.frame.x;
    y = layer.frame.y;

    var newLayer = layer.duplicate();

    var newX = x + 8 + width;
    var newY = y;
	moveLayer(newLayer, newX, newY);
  });

  const text = new Text({
    alignment: sketch.Text.Alignment.left,
    text: 'single',
    style: {
        fills: [{
            color: 'red',
            fillType: Style.FillType.color
        }]
    },
    color: MSColor.colorWithRed_green_blue_alpha(255 / 255, 255 / 255, 255/ 255, 1.0)
  });

  const shape = new Shape({
    name: 'background',
    frame: new Rectangle(0, 0, 200, 40),
    style: {
        fills: [{
            color: 'red',
            fillType: Style.FillType.color
        }]
    }
  });

  var group = new Group({
    name: 'Group',
    parent: artboard,
    layers: [
        shape,
        text
    ],
  });

  group.adjustToFit();

  document.centerOnLayer(artboard);
}