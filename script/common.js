'use strict';
$(document).ready(function() {
    // ハンバーガーメニューの開閉
    $('.hamburger').on('click', function() {
        $('.hamburger, .slide-menu').toggleClass('active');
    });

    // ページトップへ戻るボタン
    $('.pageTop-button').on('click', function() {
        event.preventDefault();
        $('body, html').animate({ scrollTop: 0 }, 500);
    });
});