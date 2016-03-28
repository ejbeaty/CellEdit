$(document).ready(function () {
    var table = $('#myTable').DataTable();

    myCallbackFunction = function (updatedCell, updatedRow) {
        console.log("The new value for the cell is: " + updatedCell.data());
        console.log("The values for each cell in that row are: " + updatedRow.data());
    }

    table.MakeCellsEditable({
        "onUpdate": myCallbackFunction
    });
});