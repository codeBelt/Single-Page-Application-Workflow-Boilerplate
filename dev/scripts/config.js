/**
* Application configuration declaration.
*/
require.config({

    baseUrl: 'dev/scripts/',

    paths: {
        //main libraries
        jquery: '../libs/jquery/jquery-1.9.1',
        lodash: '../libs/lodash/lodash.compat',

        //shortcut paths
        templates: '../templates',
        data: '../data',

        //require plugins
        text: '../libs/require/text',
        tpl: '../libs/require/tpl',
        json: '../libs/require/json',

        //jquery plugins
        'bootstrap': '../libs/bootstrap/bootstrap',

        //other plugins
        json2: '../libs/json2'
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