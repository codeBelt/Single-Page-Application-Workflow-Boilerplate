/**
* Application configuration declaration.
*/
require.config({

    baseUrl: 'assets/scripts/',

    paths: {
        //main libraries
        jquery: '../vendor/jquery/jquery-1.9.1',
        lodash: '../vendor/lodash/lodash.compat',

        //shortcut paths
        templates: '../templates',
        data: '../data',

        //require plugins
        text: '../vendor/require/text',
        tpl: '../vendor/require/tpl',
        json: '../vendor/require/json',

        //jquery plugins
        'bootstrap': '../vendor/bootstrap/bootstrap',

        //other plugins
        json2: '../vendor/json2'
    },

    shim: {
        jquery: {
            exports: '$'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        lodash: {
            exports: '_'
        },
        json2: {
            exports: 'JSON'
        }
    },

    urlArgs: 'v=' + Date.now(),

    deps: [
        'json2',
        'bootstrap'
    ]
});