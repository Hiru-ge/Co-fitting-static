'use strict';
$(document).ready(function() {
    // ページトップへ戻るボタン
    $('.pageTop-button').on('click', function() {
        event.preventDefault();
        $('body, html').animate({ scrollTop: 0 }, 500);
    });
});