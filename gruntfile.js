module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({

		pkg: grunt.file.readJSON('bower.json'),

		language: grunt.option('lang') || 'en',

		meta: {
			banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
				' Licensed <%= pkg.license %>\n */\n'
		},

		build_dir: 'build',

		lib_files: {

			core: [
				'src/growl.js',
				'src/growlDirective.js',
				'src/growlFactory.js',
				'src/growlMessageService.js'
			],
			css:  [
				'src/growl.css'
			],
			test: ['test/**/*.js']
		},

		watch: {

			scripts: {
				files: ['gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.test %>'],
				tasks: ['jshint:all', 'karma:unit']
			},

			livereload: {
				options: {
					livereload: true
				},
				files: ['src/**/*.*'],
				tasks: ['jshint', 'karma:unit']
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},

			all: ['gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.test %>'],

			core: {
				files: {
					src: ['<%= lib_files.core %>']
				}
			},

			test: {
				files: {
					src: ['<%= lib_files.test %>']
				}
			}
		},

		concat: {
			banner: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: '<%= concat.core.dest %>',
				dest: '<%= concat.core.dest %>',
			},

			core: {
				src: ['<%= lib_files.core %>'],
				dest: '<%= build_dir %>/angular-growl.js'
			},

			css: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: ['<%= lib_files.css %>'],
				dest: '<%= build_dir %>/angular-growl.css'
			}
		},

		cssmin: {
			core: {
				files: {
					'build/angular-growl.min.css': '<%= lib_files.css %>'
				},
				options: {
					'banner': '<%= meta.banner %>',
					'report': 'gzip'
				}
			}
		},

		uglify: {
			core: {
				files: {
					'<%= build_dir %>/angular-growl.min.js': '<%= concat.core.dest %>'
				},
				options: {
					banner: '<%= meta.banner %>',
					report: 'gzip'
				}
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},

		ngmin: {
			core: {
				src: '<%= concat.core.dest %>',
				dest: '<%= concat.core.dest %>'
			}
		},
		push: {
			options: {
				files: ['package.json', 'bower.json'],
				add: true,
				addFiles: ['.'], // '.' for all files except ingored files in .gitignore
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', 'bower.json', 'build/angular-growl.js', 'build/angular-growl.min.js', 'build/angular-growl.min.css', 'README.md'], // '-a' for all files
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin',
				npm: true,
				npmTag: 'Release v%VERSION%',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		}
	});


	grunt.registerTask('default', ['jshint:all', 'karma']);
	grunt.registerTask('test', ['karma']);

	grunt.registerTask('build', [
		'jshint:all',
		'karma',
		'build:core'
	]);

	grunt.registerTask('build:core', [
		'concat:core',
		'concat:css',
		'ngmin:core',
		'concat:banner',
		'uglify:core',
		'cssmin:core'
	]);

	// For development purpose.
	grunt.registerTask('dev', ['jshint', 'karma:unit', 'watch:livereload']);

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
