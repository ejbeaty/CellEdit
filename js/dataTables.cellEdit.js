/*! CellEdit 1.0.0
 * ©2016 Elliott Beaty - datatables.net/license
 */

/**
 * @summary     CellEdit
 * @description Make a cell editable when clicked upon
 * @version     1.0.0
 * @file        dataTables.editCell.js
 * @author      Elliott Beaty
 * @contact     elliott@elliottbeaty.com
 * @copyright   Copyright 2016 Elliott Beaty
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

jQuery.fn.dataTable.Api.register('MakeCellsEditable()', function (settings) {
    var table = this.table();   

    jQuery.fn.extend({

        // UPDATE
        updateEditableCell: function (callingElement) {
            var row = table.row($(callingElement).parents('tr'));
            var cell = table.cell($(callingElement).parent());
            var columnIndex = cell.index().column;
            var inputField;
            // Update datatables cell value
            switch($(callingElement).prop('nodeName').toLowerCase()){
                case 'input':
                    inputField = $(callingElement);
                    console.log(inputField)
                    break;
                case 'a' :
                    inputField = $(callingElement).siblings('input');
                    break;
            }
            _tryToUpdate(inputField.val())

            function _tryToUpdate(newValue) {
                if (!newValue && ((settings.allowNulls) && settings.allowNulls != true)) {
                    console.log(settings.allowNulls)
                    // If columns specified
                    if (settings.allowNulls.columns) {
                        // If current column allows nulls
                        if (settings.allowNulls.columns.indexOf(columnIndex) > -1) {
                            _update(newValue);
                        } else {
                            _addValidationCss();
                        }
                    // No columns allow null
                    } else if (!newValue) {
                        _addValidationCss();
                    }
                    //All columns allow null
                } else {
                    _update(newValue);
                }
            }
            function _addValidationCss() {
                // Show validation error
                if (settings.allowNulls.errorClass) {
                    $(inputField).addClass(settings.allowNulls.errorClass)
                } else {
                    $(inputField).css({ "border": "red solid 1px" })
                }
            }
            function _update(newValue) {

                cell.data(newValue);
                //Return cell & row.
                settings.onUpdate(cell, row);
            }


            //Redraw table
            table.draw();
        },
        // CANCEL
        cancelEditableCell: function (callingElement) {
            var cell = table.cell($(callingElement).parent());
            // Set cell to it's original value
            cell.data(cell.data())

            // Redraw table
            table.draw();
        }
    });

    

    // On cell click
    $(table.body()).on('click', 'td', function () {

        var currentColumnIndex = table.cell(this).index().column;

        // DETERMINE WHAT COLUMNS CAN BE EDITED
        if ((settings.columns && settings.columns.indexOf(currentColumnIndex) >-1) || (!settings.columns)) {
            var row = table.row($(this).parents('tr'));
            editableCellsRow = row;

            var cell = table.cell(this).node();
            if (!$(cell).find('input').length) {
                // Change cell 
                if (settings.confirmationButton) {
                    var cssClass = settings.confirmationButton.class;
                    $(cell).html("<input id='cell-being-edited'></input><a href='#' class='" + cssClass + "' onclick='$(this).updateEditableCell(this)'>Confirm</a> <a href='#' class='" + cssClass + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a> ");
                } else {
                    $(cell).html("<input id='cell-being-edited' onfocusout='$(this).updateEditableCell(this)'></input>");
                }
                
            }
        }
    });
})