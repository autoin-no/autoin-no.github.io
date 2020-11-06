import 'bootstrap';

// Custom JS
(function () {
    // Local helpers
    function _createFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstElementChild;
    }

    // Inject SVG
    // For custom color themes for processes, done since injecting via CSS does not allow it to auto adjust to font color and size in a easy way
    var startSvg = "<svg width='1rem' height='1rem' viewBox='0 0 16 16' class='bi bi-play' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z'/></svg>";
    document.querySelectorAll(".btn-start, .btn-outline-start, .badge-start").forEach(el => el.prepend(_createFromHTML(startSvg), " "));

    var stopSvg = "<svg width='1rem' height='1rem' viewBox='0 0 16 16' class='bi bi-arrow-clockwise' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M3.17 6.706a5 5 0 0 1 7.103-3.16.5.5 0 1 0 .454-.892A6 6 0 1 0 13.455 5.5a.5.5 0 0 0-.91.417 5 5 0 1 1-9.375.789z'/><path fill-rule='evenodd' d='M8.147.146a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.707-.708L10.293 3 8.147.854a.5.5 0 0 1 0-.708z'/></svg>";
    document.querySelectorAll(".btn-stop, .btn-outline-stop, .badge-stop").forEach(el => el.prepend(_createFromHTML(stopSvg), " "));

    var doneSvg = "<svg width='1rem' height='1rem' viewBox='0 0 16 16' class='bi bi-check2-circle' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z'/><path fill-rule='evenodd' d='M8 2.5A5.5 5.5 0 1 0 13.5 8a.5.5 0 0 1 1 0 6.5 6.5 0 1 1-3.25-5.63.5.5 0 1 1-.5.865A5.472 5.472 0 0 0 8 2.5z'/></svg>";
    document.querySelectorAll(".btn-done, .btn-outline-done, .badge-done").forEach(el => el.prepend(_createFromHTML(doneSvg), " "));
})();
