/*! CellEdit 1.0.19
 * ©2016 Elliott Beaty - datatables.net/license
 */

/**
 * @summary     CellEdit
 * @description Make a cell editable when clicked upon
 * @version     1.0.19
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
        updateEditableCell: function (callingElement) {
            // Need to redeclare table here for situations where we have more than one datatable on the page. See issue6 on github
            var table = $(callingElement.closest('table')).DataTable().table();
            var row = table.row($(callingElement).parents('tr'));
            var cell = table.cell($(callingElement).parent());
            var columnIndex = cell.index().column;
            var inputField = getInputField(callingElement);

            // Update
            var newValue = inputField.val();
            if (!newValue && ((settings.allowNulls) && settings.allowNulls != true)) {
                // If columns specified
                if (settings.allowNulls.columns) {
                    // If current column allows nulls
                    if (settings.allowNulls.columns.indexOf(columnIndex) > -1) {
                        _update(newValue);
                    } else {
                        _addValidationCss();
                    }
                } else if (!newValue) {
                    // No columns allow null
                    _addValidationCss();
                }
            } else {
                // All columns allow null
                _update(newValue);
            }

            function _addValidationCss() {
                // Show validation error
                if (settings.allowNulls.errorClass) {
                    $(inputField).addClass(settings.allowNulls.errorClass)
                } else {
                    $(inputField).css({ 'border': 'red solid 1px' })
                }
            }

            function _update(newValue) {
                var oldValue = cell.data();
                cell.data(newValue);
                // Return cell, row and new value.
                settings.onUpdate(cell, row, oldValue, newValue);
            }

            // Get current page and redraw the datatable
            var currentPageIndex = table.page.info().page;
            table.page(currentPageIndex).draw(false);
        },

        cancelEditableCell: function (callingElement) {
            var table = $(callingElement.closest('table')).DataTable().table();
            var cell = table.cell($(callingElement).parent());
            // Set cell to it's original value
            cell.data(cell.data());

            // Get current page and redraw the datatable
            var currentPageIndex = table.page.info().page;
            table.page(currentPageIndex).draw(false);
        }
    });

    // Destroy
    if (settings === 'destroy') {
        $(table.body()).off('click', 'td');
        table = null;
    }

    if (table != null) {
        // On cell click
        $(table.body()).on('click', 'td', function () {
            var currentColumnIndex = table.cell(this).index().column;

            // Determine which columns can be edited
            if ((settings.columns && settings.columns.indexOf(currentColumnIndex) > -1) || (!settings.columns)) {
                var cell = table.cell(this).node();
                var oldValue = sanitizeCellValue(table.cell(this).data());

                // Show input
                if (!$(cell).find('input').length && !$(cell).find('select').length) {
                    // Input CSS
                    var input = getInputHtml(currentColumnIndex, settings, oldValue);
                    $(cell).html(input.html);
                    if (input.focus) {
                        $('#ejbeatycelledit').focus();
                    }
                }
            }
        });
    }
});

function getInputHtml(currentColumnIndex, settings, oldValue) {
    var inputSetting, inputType, input = { 'focus': true, 'html': null }, inputCss;
    var confirmButton = 'Confirm', confirmCss, cancelButton = 'Cancel', cancelCss;

    if (settings.inputTypes) {
		$.each(settings.inputTypes, function (index, setting) {
			if (setting.column == currentColumnIndex) {
				inputSetting = setting;
				inputType = inputSetting.type.toLowerCase();
			}
		});
	}
    
    if (settings.inputCss) {
        inputCss = settings.inputCss;
    }
    if (settings.confirmationButton) {
        if (settings.confirmationButton.hasOwnProperty('confirmButton')) {
            confirmButton = settings.confirmationButton.confirmButton;
        }
        confirmCss = settings.confirmationButton.confirmCss;
        if (settings.confirmationButton.hasOwnProperty('cancelButton')) {
            confirmButton = settings.confirmationButton.cancelButton;
        }
        cancelCss = settings.confirmationButton.cancelCss;
        inputType = inputType + '-confirm';
    }

    switch (inputType) {
        case 'list':
            input.html = "<select class='" + inputCss + "' onchange='$(this).updateEditableCell(this);'>";
            $.each(inputSetting.options, function (index, option) {
                input.html = input.html + "<option value='" + option.value + "' >" + option.display + "</option>"
            });
            input.html = input.html + "</select>";
            input.focus = false;
            break;
        case 'list-confirm':
            // List with confirmation
            input.html = "<select class='" + inputCss + "'>";
            $.each(inputSetting.options, function (index, option) {
                input.html = input.html + "<option value='" + option.value + "' >" + option.display + "</option>"
            });
            input.html = input.html + "</select> <a href='#' class='" + confirmCss +
                "' onclick='$(this).updateEditableCell(this);'>" + confirmButton + "</a> <a href='#' class='" +
                cancelCss + "' onclick='$(this).cancelEditableCell(this)'>" + cancelButton + "</a> ";
            input.focus = false;
            break;
        case 'datepicker':
        case 'datepicker-confirm':
            // Both datepicker options work best when confirming the values
            // Makesure jQuery UI is loaded on the page
            if (typeof jQuery.ui == 'undefined') {
                alert('jQuery UI is required for the DatePicker control but it is not loaded on the page!');
                break;
            }
	        jQuery('.datepick').datepicker('destroy');
	        input.html = "<input id='ejbeatycelledit' type='text' name='date' class='datepick " + inputCss +
                "' value='" + oldValue + "' /> <a href='#' class='" + confirmCss +
                "' onclick='$(this).updateEditableCell(this)'>" + confirmButton + "</a> <a href='#' class='" +
                cancelCss + "' onclick='$(this).cancelEditableCell(this)'>" + cancelButton + "</a>";

            // Set timeout to allow the script to write the input.html before triggering the datepicker
            setTimeout(function () {
	            var icon = 'http://jqueryui.com/resources/demos/datepicker/images/calendar.gif';
                var buttonText = 'Select date';
                // Allow the user to provide icon 
	            if (typeof inputSetting.options !== 'undefined' && typeof inputSetting.options.icon !== 'undefined') {
	                icon = inputSetting.options.icon;
	            }
                // Allow the user to provide button text
                if (typeof inputSetting.options !== 'undefined'
                    && typeof inputSetting.options.buttonText !== 'undefined'
                ) {
                    buttonText = inputSetting.options.buttonText;
                }

	            var self = jQuery('.datepick').datepicker({
                    'showOn': 'button',
                    'buttonImage': icon,
                    'buttonImageOnly': true,
                    'buttonText': buttonText
                });
	        }, 100);
	        break;
        case 'text-confirm':
        case 'undefined-confirm':
            // Text input with confirmation
            input.html = "<input id='ejbeatycelledit' class='" + inputCss + "' value='" + oldValue +
                "' /><a href='#' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'>" +
                confirmButton + "</a> <a href='#' class='" + cancelCss +
                "' onclick='$(this).cancelEditableCell(this)'>" + cancelButton + "</a> ";
            break;
        default:
            // Text input
            input.html = "<input id='ejbeatycelledit' class='" + inputCss +
                "' onfocusout='$(this).updateEditableCell(this)' value='" + oldValue + "' />";
            break;
    }
    return input;
}

function getInputField(callingElement) {
    // Update datatables cell value
    var inputField;
    switch ($(callingElement).prop('nodeName').toLowerCase()) {
        case 'a':
            // This means they're using confirmation buttons
            if ($(callingElement).siblings('input').length > 0) {
                inputField = $(callingElement).siblings('input');
            }
            if ($(callingElement).siblings('select').length > 0) {
                inputField = $(callingElement).siblings('select');
            }
            break;
        default:
            inputField = $(callingElement);
            break;
    }
    return inputField;
}

function sanitizeCellValue(cellValue) {
    if (typeof (cellValue) === 'undefined' || cellValue === null || cellValue.length < 1) {
        return '';
    }

    // If not a number
    if (isNaN(cellValue)) {
        // Escape single quote
        cellValue = cellValue.replace(/'/g, '&#39;');
    }
    return cellValue;
}
