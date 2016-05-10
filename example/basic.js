$(document).ready(function () {
    var table = $('#myTable').DataTable();

    table.MakeCellsEditable({
        "onUpdate": myCallbackFunction
    });
});

function myCallbackFunction(updatedCell, updatedRow, oldValue) {
    console.log("The new value for the cell is: " + updatedCell.data());
    console.log("The old value for that cell was: " + oldValue);
    console.log("The values for each cell in that row are: " + updatedRow.data());
}