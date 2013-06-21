module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: '../',
            devPath: '../dev/',
            prodPath: '../prod/'
        },

        banner: [
                 '/*',
                 '* Project: <%= pkg.name %>',
                 '* Version: <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)',
                 '* Development By: <%= pkg.developedBy %>',
                 '* Copyright(c): <%= grunt.template.today("yyyy") %>',
                 '*/'
        ],


        env: {
            dev: {
                NODE_ENV : 'DEVELOPMENT'
            },
            prod : {
                NODE_ENV : 'PRODUCTION'
            }
        },

        preprocess : {
            dev : {
                src : '<%= meta.devPath %>' + 'index.html',
                dest : '<%= meta.basePath %>' + 'dev.html',
                options : {
                    context : {
                        buildVersion : '<%= pkg.version %>',
                        basePath: 'dev/'
                    }
                }
            },
            prod : {
                src : '<%= meta.devPath %>' + 'index.html',
                dest : '<%= meta.basePath %>' + 'index.html',
                options : {
                    context : {
                        buildVersion : '<%= pkg.version %>',
                        basePath: 'prod/'
                    }
                }
            },
            manifest : {
                src : '<%= meta.devPath %>' + 'offline/offline.manifest',
                dest : '<%= meta.prodPath %>' + 'offline/offline.manifest',
                options : {
                    context : {
                        buildVersion : '<%= pkg.version %>',
                        timeStamp : '<%= grunt.template.today() %>'
                    }
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: '<%= meta.devPath %>' + 'scripts/',                            // Path of source scripts, relative to this build file
                    mainConfigFile: '<%= meta.devPath %>' + 'scripts/config.js',            // Path of shared configuration file, relative to this build file
                    name: 'AppBootstrap',                                                   // Name of input script (.js extension inferred)
                    out: '<%= meta.prodPath %>' + 'scripts/app.min.js',                     // Path of built script output

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

        cssmin: {
            main: {
                options: {
                    banner: '<%= banner.join("\\n") %>',
                    keepSpecialComments: 0                                                  // '*' for keeping all (default), 1 for keeping first one, 0 for removing all
                },
                files: {
                    '<%= meta.prodPath %>styles/main.min.css': [
                        '<%= meta.devPath %>' + 'styles/setup.css',
                        '<%= meta.devPath %>' + 'styles/bootstrap.css',
                        '<%= meta.devPath %>' + 'styles/screen.css'
                    ]
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    '<%= meta.basePath %>index.html': '<%= meta.basePath %>index.html'
                }
            }
        },

        copy: {
            prod:  {
                files: [
                    { expand: true, cwd: '<%= meta.devPath %>' + 'libs/require/', src: 'require.js', dest: '<%= meta.prodPath %>' + 'scripts/' } , // Copy require.js file to production.
                    { expand: true, cwd: '<%= meta.devPath %>', src: 'favicon.ico', dest: '<%= meta.prodPath %>' } , // Copy require.js file to production.
                    { expand: true, cwd: '<%= meta.devPath %>', src: ['images/**'], dest: '<%= meta.prodPath %>' }                                 // Copy the image folder to production.
                ]
            }
        },

        concat: {
            prod: {
                options: {
                    banner: '<%= banner.join("\\n") %> \n'
                },
                src: ['<%= meta.prodPath %>' + 'scripts/app.min.js'],
                dest: '<%= meta.prodPath %>' + 'scripts/app.min.js'
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task.
    grunt.registerTask('default', ['requirejs']);
    grunt.registerTask('dev', ['env:dev', 'preprocess:dev']);
    grunt.registerTask('prod', ['copy:prod', 'env:prod', 'preprocess:prod', 'preprocess:manifest', 'cssmin', 'htmlmin', 'requirejs', 'concat:prod']);

};