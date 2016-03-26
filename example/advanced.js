$(document).ready(function () {
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
            "errorClass": 'button'
        },
        "confirmationButton": { // could also be true
            "class": 'none'
        }
    });

});