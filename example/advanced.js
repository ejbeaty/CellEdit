$(document).ready(function () {
    var table = $('#myAdvancedTable').DataTable();
    table.MakeCellsEditable({
        "onUpdate": myCallbackFunction,
        "inputCss":'my-input-class',
        "columns": [0,1,2],
        "allowNulls": {
            "columns": [1],
            "errorClass": 'error'
        },
        "confirmationButton": { // could also be true
            "confirmCss": 'my-confirm-class',
            "cancelCss": 'my-cancel-class'
        }
    });

});

function myCallbackFunction (updatedCell, updatedRow, oldValue) {
    console.log("The new value for the cell is: " + updatedCell.data());
    console.log("The old value for that cell was: " + oldValue);
    console.log("The values for each cell in that row are: " + updatedRow.data());
}