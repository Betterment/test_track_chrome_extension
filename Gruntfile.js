/* jshint node: true */

module.exports = function(grunt) {
    "use strict";

    var uuid = require('node-uuid');
    var fs = require('fs');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                "dist/*.js",
                "dist/*.json",
                'Gruntfile.js'
            ]
        },
        copy: {
            assets: {
                files: [
                    {expand: true, cwd: 'assets', src: ['*'], dest: 'dist/unpacked_extension/', filter: 'isFile'}
                ]

            }
        },
        preprocess: {
            options: {
                context: {
                    getSharedSecret: function() {
                        return grunt.file.read('etc/sharedSecret').trim();
                    },
                    getVersion: function() {
                        return grunt.file.read('etc/version').trim();
                    },
                    getDomains: function() {
                        return JSON.stringify(grunt.file.readJSON('etc/domains.json').domains);
                    },
                    getUrls: function() {
                        return grunt.file.readJSON('etc/domains.json').domains.
                            map(function(domain) { return '"*://*.' + domain + '/*"'; }).join(', ');
                    }
                }
            },
            src: {
                src: '*',
                cwd: 'src',
                expand: true,
                dest: 'dist/unpacked_extension',
            }
        },
        crx: {
            test_track: {
              "src": ["dist/unpacked_extension/**/*"],
              "dest": "dist/test_track.zip",
              "options": {
                "maxBuffer": 3000 * 1024 //build extension with a weight up to 3MB
              }
            }
        }
    });

    grunt.registerTask('secret', function() {
        var sharedSecret = uuid.v4();
        grunt.file.write("etc/sharedSecret", sharedSecret + '\n');
        console.log("Set the following environment var to your TestTrack server:\n");
        console.log("    BROWSER_EXTENSION_SHARED_SECRET=" + sharedSecret);
    });

    grunt.registerTask('ensuresecret', function() {
        if (!grunt.file.exists('etc/sharedSecret')) {
            grunt.task.run('secret');
        }
    });

    grunt.registerTask('incrementversion', function() {
        var version = grunt.file.read('etc/version');
        var subparts = version.split('.');
        var lastIndex = subparts.length - 1;
        subparts[lastIndex] = (parseInt(subparts[lastIndex]) + 1).toString();
        var newVersion = subparts.join('.');
        console.log("Incremented version to " + newVersion);
        grunt.file.write('etc/version', newVersion + '\n');
    });

    grunt.registerTask('ensureversion', function() {
        if (!grunt.file.exists('etc/version')) {
            grunt.file.write('etc/version', '1.0.0\n');
        }
    });

    grunt.registerTask('ensuredomains', function() {
        if (!grunt.file.exists('etc/domains.json')) {
            grunt.file.write('etc/domains.json', '{\n' +
                             '    "_description": "Domains on which to enable TestTrack chrome extension. Defaults to *.dev",\n' +
                             '    "_instructions": "To enable *.example.org, add example.org to the `domains` array",\n' +
                             '    "domains": [\n' +
                             '        "dev"\n' +
                             '    ]\n' +
                             '}\n');
        }
    });

    grunt.registerTask('clean', function() {
        grunt.file.delete('dist/test_track.zip');
        grunt.file.delete('dist/unpacked_extension');
    });

    grunt.registerTask('hackmanifest', function() {
        // preprocessor doesn't work on .json files
        fs.rename('dist/unpacked_extension/manifest.js', 'dist/unpacked_extension/manifest.json');
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-crx');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['ensureconfig', 'build']);

    // Useful tasks:
    grunt.registerTask('cyclesecret', ['secret', 'bumpversion']);
    grunt.registerTask('bumpversion', ['incrementversion', 'build']);

    // Underlying tasks:
    grunt.registerTask('ensureconfig', ['ensureversion', 'ensuresecret', 'ensuredomains']);
    grunt.registerTask('build', ['clean', 'preprocess', 'copy:assets', 'hackmanifest', 'jshint', 'crx:test_track']);
};
