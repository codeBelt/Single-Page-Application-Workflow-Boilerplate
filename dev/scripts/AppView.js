define(function(require) {
    'use strict';

    var $ = require('jquery');
    var LoginTemplate = require('tpl!templates/login/LoginTemplate.tpl');
    var LoginData = require('json!data/loginData.json');

    /**
     * Initial application setup.
     *
     * @class AppView
     * @constructor
     */
    var AppView = function() {
        this.template = LoginTemplate;
        this.templateData = LoginData;
    };

    /**
     * Initializes the application.
     *
     * @method init
     * @public
     */
    AppView.prototype.init = function() {
        var $body = $('body');

        var generatedTemplate = this.template( this.templateData );
        $body.append(generatedTemplate);
    };

    return AppView;
});