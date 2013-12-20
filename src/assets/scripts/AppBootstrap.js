/**
 * Main entry point for RequireJS
 */
require(
    [
        'AppView',
        'jquery'
    ],
    function(
        AppView,
        $
    ) {
        'use strict';

        $(document).ready(function () {
            window.app = new AppView();
            window.app.init();
        });
    }
);