module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // This will load in our package.json file so we can have access
        // to the project name and version number.
        pkg: grunt.file.readJSON('package.json'),

        // Constants for the Gruntfile so we can easily change the path for
        // our environments.
        BASE_PATH: '../',
        DEVELOPMENT_PATH: '../dev/',
        PRODUCTION_PATH: '../prod/',

        // A code block that will be added to all our minified code files.
        // Gets the name and version from the above loaded 'package.json' file.
        banner: [
                 '/*',
                 '* Project: <%= pkg.name %>',
                 '* Version: <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)',
                 '* Development By: <%= pkg.developedBy %>',
                 '* Copyright(c): <%= grunt.template.today("yyyy") %>',
                 '*/'
        ],


        // The different constants name that will be use to build our html files.
        // Example: <!-- @if NODE_ENV == 'DEVELOPMENT' -->
        env: {
            dev: {
                NODE_ENV : 'DEVELOPMENT'
            },
            prod : {
                NODE_ENV : 'PRODUCTION'
            }
        },

        // Allows us to pass in variables to files that have place holders so we
        // can similar files with different data.
        // Example: <!-- @echo buildVersion --> or <!-- @echo filePath -->
        preprocess : {
            // Task to create the dev.html file that will be used during development.
            // Passes the app version and a file path into the dev/index.html and
            // creates the /dev.html
            dev : {
                src : '<%= DEVELOPMENT_PATH %>' + 'index.html',
                dest : '<%= BASE_PATH %>' + 'dev.html',
                options : {
                    context : {
                        buildVersion : '<%= pkg.version %>',
                        filePath: 'dev/'
                    }
                }
            },
            // Task to create the index.html file that will be used in production.
            // Passes the app version and a file path into the dev/index.html and
            // creates the /index.html
            prod : {
                src : '<%= DEVELOPMENT_PATH %>' + 'index.html',
                dest : '<%= BASE_PATH %>' + 'index.html',
                options : {
                    context : {
                        buildVersion : '<%= pkg.version %>',
                        filePath: 'prod/'
                    }
                }
            },
            // Task to create the HTML5 Cache Manifest.
            // Passes the app version and the current date into the
            // dev/offline/offline.manifest and creates prod/offline/offline.manifest.
            manifest : {
                src : '<%= DEVELOPMENT_PATH %>' + 'offline/offline.manifest',
                dest : '<%= PRODUCTION_PATH %>' + 'offline/offline.manifest',
                options : {
                    context : {
                        buildVersion : '<%= pkg.version %>',
                        timeStamp : '<%= grunt.template.today() %>'
                    }
                }
            }
        },

        // The RequireJS plugin that will use uglify2 to build and minify our
        // JavaScript, templates and any other data we include in the require files.
        requirejs: {
            compile: {
                options: {
                    baseUrl: '<%= DEVELOPMENT_PATH %>' + 'scripts/',                        // Path of source scripts, relative to this build file
                    mainConfigFile: '<%= DEVELOPMENT_PATH %>' + 'scripts/config.js',        // Path of shared configuration file, relative to this build file
                    name: 'AppBootstrap',                                                   // Name of input script (.js extension inferred)
                    out: '<%= PRODUCTION_PATH %>' + 'scripts/app.min.js',                   // Path of built script output

                    fileExclusionRegExp: /.svn/,                                            // Ignore all files matching this pattern
                    useStrict: true,
                    preserveLicenseComments: false,
                    pragmas: {
                        debugExclude: true
                    },

                    optimize: 'uglify2',                                                    // Use 'none' If you do not want to uglify.
                    uglify2: {
                        output: {
                            beautify: false,
                            comments: false
                        },
                        compress: {
                            sequences: false,
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: false,
                        mangle: true
                    }
                }
            }
        },

        // Minifies our css files that we specify and adds the banner to the top
        // of the minified css file.
        cssmin: {
            main: {
                options: {
                    banner: '<%= banner.join("\\n") %>',
                    keepSpecialComments: 0                                                  // '*' for keeping all (default), 1 for keeping first one, 0 for removing all
                },
                files: {
                    '<%= PRODUCTION_PATH %>styles/main.min.css': [
                        '<%= DEVELOPMENT_PATH %>' + 'styles/setup.css',
                        '<%= DEVELOPMENT_PATH %>' + 'styles/bootstrap.css',
                        '<%= DEVELOPMENT_PATH %>' + 'styles/screen.css'
                    ]
                }
            }
        },

        // After the preprocess plugin creates our /index.html we remove all comments
        // and white space from the file so it will be minified.
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    '<%= BASE_PATH %>index.html': '<%= BASE_PATH %>index.html'
                }
            }
        },

        // Copies certain files over from the dev/ folder to the prod/ so we don't
        // have to do it manually.
        copy: {
            prod:  {
                files: [
                    // Copy require.js file from dev/libs/require/ to prod/scripts/.
                    { expand: true, cwd: '<%= DEVELOPMENT_PATH %>' + 'libs/require/', src: 'require.js', dest: '<%= PRODUCTION_PATH %>' + 'scripts/' } ,
                    // Copy favicon.ico file from dev/ to prod/.
                    { expand: true, cwd: '<%= DEVELOPMENT_PATH %>', src: 'favicon.ico', dest: '<%= PRODUCTION_PATH %>' } ,
                    // Copy the image folder from dev/images/ to prod/images/.
                    { expand: true, cwd: '<%= DEVELOPMENT_PATH %>', src: ['images/**'], dest: '<%= PRODUCTION_PATH %>' }
                ]
            }
        },

        // Takes the minified JavaScript file and adds the banner to the top.
        concat: {
            prod: {
                options: {
                    banner: '<%= banner.join("\\n") %> \n'
                },
                src: ['<%= PRODUCTION_PATH %>' + 'scripts/app.min.js'],
                dest: '<%= PRODUCTION_PATH %>' + 'scripts/app.min.js'
            }
        },

        // Starts a node.js server for our environments.
        connect: {
            dev: {
                options: {
                    port: 9000,
                    keepalive: true,
                    base: '<%= BASE_PATH %>'
                }
            },
            prod: {
                options: {
                    port: 9001,
                    keepalive: true,
                    base: '<%= BASE_PATH %>'
                }
            }
        },

        // Opens the default browser with the html file.
        open: {
            dev: {
                path: 'http://localhost:9000/dev.html'
            },
            prod: {
                path: 'http://localhost:9001/index.html'
            }
        }

    });

    // Loads the necessary tasks for this Grunt file.
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');

    // Grunt tasks.
    grunt.registerTask('default', ['requirejs']);
    grunt.registerTask('dev', ['env:dev', 'preprocess:dev']);
    grunt.registerTask('prod', ['copy:prod', 'env:prod', 'preprocess:prod', 'preprocess:manifest', 'cssmin', 'htmlmin', 'requirejs', 'concat:prod']);

    grunt.registerTask('dev:open', ['connect:dev', 'open:dev']);
    grunt.registerTask('prod:open', ['connect:prod', 'open:prod']);
};