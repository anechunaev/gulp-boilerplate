"use strict";

var gulp = require ("gulp"),
	$ = require ("gulp-load-plugins")();

var path = {
	build: {
		html: 	'build/',
		js: 	'build/js/',
		styles:	'build/styles/',
		images:	'build/images/',
		fonts: 	'build/fonts/'
	},
	src: {
		html: 	'src/*.html',
		js: 	'src/js/*.js',
		styles: 'src/styles/*.less',
		images: 'src/images/**/*.*',
		fonts: 	'src/fonts/**/*.*'
	},
	watch: {
		html: 	'src/**/*.html',
		js: 	'src/js/**/*.js',
		styles: 'src/styles/**/*.less',
		images: 'src/images/**/*.*',
		fonts: 	'src/fonts/**/*.*'
	}
};

function HandleError (error) {
	console.error(error.toString());
	this.emit('end');
}

gulp.task('build:html', function () {
	gulp.src(path.src.html)
		.pipe($.plumber())
		.pipe($.html5Lint())
		.pipe($.rigger())
		.pipe($.minifyHtml())
		.pipe(gulp.dest(path.build.html));
});

gulp.task('build:js', function () {
	gulp.src(path.src.js)
		.pipe($.plumber())
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
		.pipe($.rigger())
		.pipe($.sourcemaps.init())
		.pipe($.uglify())
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(path.build.js));
});

gulp.task('build:styles', function () {
	gulp.src(path.src.styles)
		.pipe($.plumber())
		.pipe($.recess())
		.pipe($.recess.reporter())
		.pipe($.sourcemaps.init())
		.pipe($.less())
		.pipe($.autoprefixer())
		.pipe($.minifyCss())
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(path.build.styles));
});

gulp.task('build:images', function () {
	gulp.src(path.src.images)
		.pipe($.plumber())
		.pipe($.imagemin())
		.pipe(gulp.dest(path.build.images));
});

gulp.task('build:fonts', function () {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});

gulp.task('build', [
	'build:html',
	'build:js',
	'build:styles',
	'build:images',
	'build:fonts'
]);

gulp.task('watch', function () {
	$.watch([path.watch.html], function (event,  cb) {
		gulp.start('build:html');
	});
	$.watch([path.watch.js], function (event,  cb) {
		gulp.start('build:js');
	});
	$.watch([path.watch.styles], function (event,  cb) {
		gulp.start('build:styles');
	});
	$.watch([path.watch.images], function (event,  cb) {
		gulp.start('build:images');
	});
	$.watch([path.watch.fonts], function (event,  cb) {
		gulp.start('build:fonts');
	});
});

gulp.task('concat:js', function () {
	gulp.src('src/js/*.js')
		.pipe($.plumber())
		.pipe($.rigger())
		.pipe($.concat('app.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest(path.build.js));
});
gulp.task('concat:styles', function () {
	gulp.src('src/styles/*.less')
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.autoprefixer())
		.pipe($.minifyCss())
		.pipe($.concat('styles.min.css'))
		.pipe($.uglify())
		.pipe(gulp.dest(path.build.styles));
});
gulp.task('concat', [
	'concat:js',
	'concat:styles'
]);

gulp.task('default', [
	'build',
	'watch'
]);