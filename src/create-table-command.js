var sketch, document, selection, page;

var settings = {
  rows: 3,
  columns: 4,
  rowGutter: 8,
  columnGutter: 8,
  minHeight: 100,
  minWidth: 100,
  cellPadding: {
    top: 8,
    right: 8,
    bottom: 8,
    left: 8
  },
  direction: "row"
};

const testMessage = (context) => {
  context.document.showMessage("😎");
};

const insertCell = (target, x, y, width, height) => {
  var cell = target.newShape({
    frame: new sketch.Rectangle(x, y, width, height)
  });
}

const createTable = (target, settings, data) => {
  // Check for symbol existance

  // If no create them
  const masterHeader = "";
  const masterCell = "";
  const masterCellEnd = "";

  const cellHeight = 100;
  const cellWidth = 100;

  const rowGutter = settings.rowGutter;
  const columnGutter = settings.columnGutter;

  const rows = settings.rows;
  const columns = settings.columns;

  const direction = settings.direction;

  if (direction === "column"){
    // Insert columns of data
    for (columnIndex = 0; columnIndex < columns; columnIndex++) {
      var x = columnIndex * (columnGutter + cellWidth);
      var columnGroup = target.newGroup({
        name: "Column "+ columnIndex+1,
        parent: target
      });
      for (rowIndex = 0; rowIndex < rows; rowIndex++) {
        var y = rowIndex * (rowGutter + cellHeight);
        insertCell(rowGroup, x, y, cellWidth, cellHeight);
      }
    }
  } else {
    // Insert rows of data
    for (rowIndex = 0; rowIndex < rows; rowIndex++) {
      var y = rowIndex * (rowGutter + cellHeight);
      var rowGroup = target.newGroup({
        name: "Row "+ rowIndex,
        parent: target
      });
      for (columnIndex = 0; columnIndex < columns; columnIndex++) {
        var x = columnIndex * (columnGutter + cellWidth);
        insertCell(rowGroup, x, y, cellWidth, cellHeight);
      }
    }
  }
}

export default function(context) {
  sketch = context.api();
  document = sketch.selectedDocument;
  selection = document.selectedLayers;
  page = document.selectedPage;

  var target = page;

  selection.iterate(function(item) {
    if (item.isArtboard){
      target = item;
    }
  });

  let data = "";

  // Create group for table
  var tableGroup = target.newGroup({
    name: "Table"
  });

  createTable(tableGroup, settings, data);
}