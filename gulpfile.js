// Gulp 4 Configuration

// General
const gulp = require('gulp');
const changed = require('gulp-changed');
const webpack = require('webpack-stream');
const argv = require('yargs').argv;
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const del = require('del');
const fs = require('fs');
const gulpif = require('gulp-if');
const path = require('path');
const browser = require('browser-sync').create();

// HTML related
const twig = require('gulp-twig');
const htmlmin = require('gulp-htmlmin');

// CSS related
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// JS & Assets related
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
// Directories
const PATH = {
	build: 'build/',
	source: 'src/',

	assets: 'assets/',
	icons: 'icons/',
	images: 'images/',
	styles: 'styles/',
	maps: 'maps/',
	scripts: 'scripts/',

	includes: 'includes/',
	partials: 'partials/',
};

const DEFAULT_PROJECT_CONFIG = {
	assetDistributionDirectories: [{ directory: PATH.build + PATH.assets }],
};

const PROJECT_CONFIG = fs.existsSync('./project.config.js') ? require(path.resolve('project.config')) : DEFAULT_PROJECT_CONFIG;
let browserSyncActive = false;

// Makes the OS notification a bit more useful in case of error
const onError = function (err) {
	notify.onError({
		title: 'gulp error in ' + err.plugin,
		message: err.toString(),
	})(err);
	this.emit('end');
};

function getMode() {
	return argv.mode;
}

const isProd = getMode() === 'prod';

// Compile Twig to HTML
gulp.task('html', function () {
	return gulp
		.src(PATH.source + '*.twig') // source
		.pipe(changed(PATH.source + '*.twig'))
		.pipe(twig(PROJECT_CONFIG.twig)) // twig config
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest(PATH.build)); // output destination
});

// Styles
gulp.task('styles', function () {
	const stylesPath = PATH.assets + PATH.styles;

	return gulp
		.src(PATH.source + stylesPath + '**/*.scss') // source
		.pipe(plumber({ errorHandler: onError }))
		.pipe(changed(PATH.source + stylesPath + '**/*.scss'))
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass({
			includePaths: ['node_modules'],
			outputStyle: isProd ? 'compressed' : 'expanded',
		}).on('error', sass.logError))
		.pipe(postcss())
		.pipe(sourcemaps.write(PATH.maps))
		.pipe(gulp.dest(PATH.build + stylesPath)) // output
		.pipe(browser.stream());
});

// Images
gulp.task('images', () => {
	const imagesPath = PATH.assets + PATH.images;
	return gulp
		.src(PATH.source + imagesPath + '**/*')
		.pipe(changed(PATH.build + imagesPath))
		.pipe(gulpif(isProd, imagemin()))
		.pipe(gulp.dest(PATH.build + imagesPath),
		);
});

// Icons
gulp.task('icons', () => {
	const iconsPath = PATH.assets + PATH.icons;
	return gulp
		.src(PATH.source + iconsPath + '**/*')
		.pipe(changed(PATH.build + iconsPath))
		.pipe(gulpif(isProd, imagemin()))
		.pipe(gulp.dest(PATH.build + iconsPath),
		);
});

// Fonts
gulp.task('fonts', () => {
	return gulp
		.src(PATH.source + PATH.assets + PATH.fonts + '**')
		.pipe(gulp.dest(PATH.build + PATH.assets + PATH.fonts),
		);
});

// Scripts
gulp.task('scripts', function () {
	const scriptsPath = PATH.assets + PATH.scripts;
	const wpConfigMode = getMode() === 'prod' ? 'prod' : 'dev';
	const wpConfig = require('./webpack.' + wpConfigMode + '.js');

	return gulp
		.src(PATH.source + scriptsPath + '**/*.js') // source
		.pipe(plumber({ errorHandler: onError }))
		.pipe(changed(PATH.source + scriptsPath + '**/*.js')) // source
		.pipe(webpack(wpConfig))
		.pipe(gulp.dest(PATH.build + scriptsPath)) // output
		.pipe(browser.stream());
});

function initBrowserSync() {
	const browserConfig = PROJECT_CONFIG.browserSync;
	browser.init({
		// Edit in project.config.js
		server: {
			baseDir: PATH.build,
		},
		// proxy: browserConfig.localUrl,
		ghostMode: browserConfig.ghostMode,
		open: browserConfig.open,
	});
	browserSyncActive = true;
}

// Server & File Ward
gulp.task('pack', function () {
	const assetsPath = PATH.source + PATH.assets;
	// task-name: asset location folder
	const assetsList = {
		'scripts': assetsPath + PATH.scripts,
		'images': assetsPath + PATH.images,
		'icons': assetsPath + PATH.icons,
		'fonts': assetsPath + PATH.fonts,
	};
	initBrowserSync();
	gulp.watch([
		PATH.source + PATH.assets + PATH.styles,
		'tailwind.config.js',
		PATH.source + '**/*.twig',
	], gulp.series('styles'));
	for (const prop in assetsList) {
		gulp.watch(assetsList[prop], gulp.series(prop, 'html'));
	}
	gulp.watch([
		PATH.source + '**/*.twig',
	], gulp.series('html')).on('change', browser.reload);
});

// Purges
gulp.task('purgehtml', () => {
	return gulp
		.src(PATH.build + '*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(PATH.build));
});

gulp.task('clean', () => {
	return del(PATH.build);
});

gulp.task('buildAssets', gulp.parallel('styles', 'images', 'icons', 'scripts'));

// Launcher
gulp.task('build', gulp.series('buildAssets', 'html'));
gulp.task('watch', gulp.series('build', 'pack'));
gulp.task('publish', gulp.series('clean', 'buildAssets', 'html', 'min'));
