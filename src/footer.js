import 'bootstrap';

// Process button s SVG injection (done like this in order to make sure color can be set from CSS, not possible with :after/:befor it seems)
$(function () {
    // Local helpers
    function _createFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstElementChild;
    }

    // Inject SVG
    // For custom color themes for processes, done since injecting via CSS does not allow it to auto adjust to font color and size in a easy way
    var startSvg = "<svg width='1rem' height='1rem' viewBox='0 0 16 16' class='bi bi-play' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z'/></svg>";
    document.querySelectorAll(".btn-start, .btn-outline-start, .badge-start, .badge-outline-start").forEach(el => el.prepend(_createFromHTML(startSvg), " "));

    var stopSvg = "<svg width='1rem' height='1rem' viewBox='0 0 16 16' class='bi bi-arrow-clockwise' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M3.17 6.706a5 5 0 0 1 7.103-3.16.5.5 0 1 0 .454-.892A6 6 0 1 0 13.455 5.5a.5.5 0 0 0-.91.417 5 5 0 1 1-9.375.789z'/><path fill-rule='evenodd' d='M8.147.146a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.707-.708L10.293 3 8.147.854a.5.5 0 0 1 0-.708z'/></svg>";
    document.querySelectorAll(".btn-stop, .btn-outline-stop, .badge-stop, .badge-outline-stop").forEach(el => el.prepend(_createFromHTML(stopSvg), " "));

    var doneSvg = "<svg width='1rem' height='1rem' viewBox='0 0 16 16' class='bi bi-check2-circle' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z'/><path fill-rule='evenodd' d='M8 2.5A5.5 5.5 0 1 0 13.5 8a.5.5 0 0 1 1 0 6.5 6.5 0 1 1-3.25-5.63.5.5 0 1 1-.5.865A5.472 5.472 0 0 0 8 2.5z'/></svg>";
    document.querySelectorAll(".btn-done, .btn-outline-done, .badge-done, .badge-outline-done").forEach(el => el.prepend(_createFromHTML(doneSvg), " "));
});

// Bulk copy textarea features
document.body.addEventListener("paste", function(event) {
    // Exit early if target is not bc-area
    if (!event.target.classList.contains("bc-area")) {
        return;
    }

    // OK, lets get the text user wants to paste
    let paste = (event.clipboardData || window.clipboardData).getData('text').normalize().trim();

    // Detect comma seperated string and adapt it to newline seperated format
    if (paste.indexOf("\n") === -1 && paste.indexOf(",") !== -1) {
        paste = paste.split(",").map(s => s.trim()).join("\n");
    }

    // Replace tabs for spaces
    paste = paste.replace(/\t/g, " ");

    // Detect bullet points (-, •, ..), which on paste seems to get a whitespace after it before value
    if (paste.indexOf(' ') === 1) {
        paste = paste.split("\n").map(s => s.substring(2)).join("\n");
    }

    event.preventDefault();

    let modal = $('#ExcelModal');
    if (!modal) {
        // Set value
        event.target.innerHTML = paste;
        return
    };

    // Place value on data attribute instead of value so it 1. is empty if opnend  again, and 2. as for some reason won't work to set innerHTML a second time
    modal.data("paste", paste);
    modal.modal("hide");
});

$('#ExcelModal').on('shown.bs.modal', function (event) {
    $(this).data("paste", "").find(".bc-area").trigger("focus");
});

$('#ExcelModal').on('hidden.bs.modal', function (event) {
    let modal = $(this);
    if (modal.data("onpasted") && modal.data("paste")) {
        let pastedFunction = modal.data("onpasted");
        // context: this (modal)
        // arguments:
        // - array pastedArray (multidimensional array, each entry has reg.Nr first, then if present the model)
        // - string pastedString
        window[pastedFunction].call(
            this,
            modal.data("paste").split("\n").map(function (s) {
                let i = s.indexOf(' ');
                if (i === -1) return [s];
                return [s.substring(0, i), s.substring(i + 1)]
            }),
            modal.data("paste")
        );
    }
});

// Searchable selects lite, adapted from https://codepen.io/saravanajd/pen/GGPQbY
// TODO: Rewrite to pure JS for Boostrap v5

//document.addEventListener('DOMContentLoaded',
$(function () {
    $('select.dd-select-search').each(function (i, select) {
        if (!$(this).next().hasClass('dd-select')) {
            $(this).after('<div class="dd-select ' + ($(this).attr('class') || '') + '" tabindex="0"><span class="current"></span><div class="list"><ul class="list-group list-group-flush"></ul></div></div>');
            var dropdown = $(this).next();
            var options = $(select).find('option');
            var selected = $(this).find('option:selected');
            dropdown.find('.current').html(selected.text());
            options.each(function (j, o) {
                // TODO aria-current="true"
                var classes = 'list-group-item' + (o.disabled ? ' disabled' : '') + (o.selected ? ' active' : '');
                dropdown.find('ul').append('<li class="' + classes + '" data-value="' + o.value + '">' + o.label || o.text + '</li>');
            });
        }
    });

    $('.dd-select ul').before('<div class="dd-search"><input autocomplete="off" class="form-control" type="search"></div>');
});

// Event listeners

// Open/close
$(document).on('click', '.dd-select', function (event) {
    if(event.target.type === 'search') {
        return;
    }
    $('.dd-select').not($(this)).removeClass('open');
    if (this.classList.toggle('open')) {// Is now open
        $(this).find('li').attr('tabindex', 0);
        $('.dd-search input').trigger('focus');
    } else {
        $(this).find('li').removeAttr('tabindex');
        $(this).trigger('focus');

        // Reset search input on close
        $('.dd-search input').val('');
        $('.dd-select ul > li').show();
    }
});

// Close when clicking outside
$(document).on('click', function (event) {
    if ($(event.target).closest('.dd-select').length === 0) {
        $('.dd-select').removeClass('open');
        $('.dd-select li').removeAttr('tabindex');
        event.stopPropagation();
    }
});

// Search (onkeyup)
$(document).on('keyup', '.dd-search input', function () {
    var valThis = this.value;
    $(this).closest('.dd-select').find('ul > li').each(function() {
        var text = $(this).text()
        text.toLowerCase().indexOf(valThis.toLowerCase()) > -1 ? $(this).show() : $(this).hide();
   });
});

// Option click
$(document).on('click', '.dd-select li', function (event) {
    $(this).closest('ul').find('li.active').removeClass('active');
    this.classList.add('active');
    $(this).closest('.dd-select').find('.current').text($(this).text());
    $(this).closest('.dd-select').prev('select').val($(this).data('value')).trigger('change');
});

// Keyboard events
$(document).on('keydown', '.dd-select', function (event) {
    var focusIfEnabled = function(n) { if (n && !n.hasClass('disabled')) n.trigger('focus');};
    if (event.code === 'Enter') {
        if (this.classList.contains('open')) {
            var focused_option = $($(this).find('li:focus')[0] || $(this).find('li.active')[0]);
            focused_option.trigger('click');
        } else {
            $(this).trigger('click');
        }
        return false;
    } else if (event.code === 'ArrowDown') {
        if (!this.classList.contains('open')) {
            $(this).trigger('click');
        } else if ($(event.target).is("input:focus")) {
            $($(this).find('li:visible:not(.disabled)').first()).trigger('focus');
        } else {
            var focused_option = $($(this).find('li:focus')[0] || $(this).find('li.active:visible')[0]);
            focusIfEnabled(focused_option.next());
        }
        return false;
    } else if (event.code === 'ArrowUp') {
        if (!this.classList.contains('open')) {
            $(this).trigger('click');
        } else if ($(event.target).is("input:focus")) {
            $($(this).find('li:visible:not(.disabled)').last()).trigger('focus');
        } else {
            var focused_option = $($(this).find('li:focus')[0] || $(this).find('li.active:visible')[0]);
            focusIfEnabled(focused_option.prev());
        }
        return false;
    } else if (event.code === 'Escape') {
        if (this.classList.contains('open')) {
            $(this).trigger('click');
        }
        return false;
    }
});
