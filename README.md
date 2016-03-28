# CellEdit
##### A plugin for [DataTables.net](https://datatables.net) 
## Overview
This plugin allows cells within a [DataTable](https://datatables.net/) to be editable. When a cell is click on, an input field will appear. When focus is lost on the input and the underlying DataTable object will be updated and the table will be redrawn. The new value is passed to a callback function, along with it's row, allowing for easy server-side data updates. 
## Usage
### MakeCellsEditable(settings);
##### Settings { JSON Object  }
Property | Type | Default | Example | Details  
:------ | :------ | :------ | :-----| :------
**onUpdate** | function |  | ```function(cell, row){ } ``` | The call back function to be executed. The updated **[cell](https://datatables.net/reference/api/cell())** and **[row](https://datatables.net/reference/api/row())** objects are passed as arguements. 
**columns** _(optional)_| array | All columns |```[0,1,3,4]```| An array of column indexes that you want to be editable.
**allowNulls** _(optional)_| object | No columns allow null | ```{ "columns": [4], "errorClass":"my-error"}``` | Determines which columns should allow null values to be entered and what CSS to apply if user input fails validation. If **errorClass** is null a default error class will be applied.
**confirmationButton** _(optional)_| bool &#124; object | false | ```{"class":"button"}``` | Will cause two links to appear after the input; _"Confirm"_ and _"Cancel"_. User input will not be accepted until _"Confirm"_ is clicked by the user. You can optionally pass in an object with a **class** property instead of boolean. The **class** property specifies a CSS class that should be applied to the anchor tags.

### Basic Initialization
```javascript
    var table = $('#myTable').DataTable();

    myCallbackFunction = function (updatedCell, updatedRow) {
        console.log("The new value for the cell is: " + updatedCell.data());
        console.log("The values for each cell in that row are: " + updatedRow.data());
    }

    table.MakeCellsEditable({
        "onUpdate": myCallbackFunction
    });
```

<iframe src="https://github.com/ejbeaty/CellEdit/blob/master/example/advanced.html"></iframe>

### Advancted Initialization
```javascript
    var table = $('#myAdvancedTable').DataTable();

    myCallbackFunction = function (updatedCell, updatedRow) {
        console.log("The new value for the cell is: " + updatedCell.data());
        console.log("The values for each cell in that row are: " + updatedRow.data());
    }

    table.MakeCellsEditable({
        "onUpdate": myCallbackFunction,
        "columns": [0,1,2],
        "allowNulls": {
            "columns": [1],
            "errorClass": 'error'
        },
        "confirmationButton": { 
            "class": 'button'
        }
    });
```
