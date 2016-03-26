# CellEdit
## A plugin for DataTables.net 


### MakeCellsEditable(settings);
#### Settings
**Type:** JSON OBject
**Properties**
1. onUpdate (required): function(cell,row){}
..* Description: The call back function to be executed. The updated cell and row are passed as arguements. 
2. columns (optional): int[]
..* Description: An array of column indexes that you want to be editable.
..* Default: every column
3. allowNulls (optional): JSON | boolean
..* Description: Determines if the inputs will accept null values.
..* Default: false


### Basic Initialization
```
var table =$('#myTable').DataTable();

table.MakeCellsEditable({
	"onUpdate": myCallbackFunction
});

myCallbackFunction = function(updatedCell,updatedRow){
	alert("The new value for the cell is: "+ updatedCell.data());
	alert("The values for each cell in that row are: "+ updatedCell.data());
}
```

### Advancted Initialization
```
var table =$('#myTable').DataTable();

table.MakeCellsEditable({
    "onUpdate": myCallbackFunction,
    "columns": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    "allowNulls": {
        "columns": [4],
        "errorClass":'button'
    },
    "confirmationButton": { // could also be true
        "class":'none'
    }
});

myCallbackFunction = function(updatedCell,updatedRow){
	alert("The new value for the cell is: "+ updatedCell.data());
	alert("The values for each cell in that row are: "+ updatedCell.data());
}
```.MakeCellsEditable();
```
