// Gulp 4 Configuration

// General
const gulp = require("gulp"),
			changed = require("gulp-changed"),
			cache = require("gulp-cache"),
			plumber = require("gulp-plumber"),
			notify = require("gulp-notify"),
			del = require('del'),
			fs = require('fs'),
			path = require('path'),
			browser = require("browser-sync").create(),
			log = require("fancy-log"),
			// HTML related
			twig = require("gulp-twig"),
			htmlmin = require("gulp-htmlmin"),
			// CSS related
			sass = require("gulp-sass")(require('sass')),
			sassGlob = require('gulp-sass-glob'),
			postcss = require("gulp-postcss"),
			sourcemaps = require("gulp-sourcemaps"),
			purgecss = require("gulp-purgecss"), // gulp-clean-css
			// JS & Assets related
			uglify = require("gulp-uglify"),
			// Directories
			PATH = {
				build: 'build/',
				source: 'src/',

				assets: 'assets/',
				icons: 'icons/',
				symbolIcons: 'symbols/',
				inlineIcons: 'inline/',
				images: 'images/',
				styles: 'styles/',
				maps: '/maps',
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
		title: "gulp error in " + err.plugin,
		message: err.toString(),
	})(err);
	this.emit("end");
};

// Compile Twig to HTML
gulp.task("html", function () {
	return gulp
		.src(PATH.source + '*.twig') // source
		.pipe(twig(PROJECT_CONFIG.twig)) // twig config
		.pipe(
			plumber({
				errorHandler: onError,
			})
		)
		.pipe(gulp.dest(PATH.build)); // output destination
});

gulp.task("styles", function () {
	const stylesPath = PATH.assets + PATH.styles;
	return gulp
		.src(PATH.source + stylesPath + '**/*.scss') // source
		.pipe(
			plumber({
				errorHandler: onError,
			})
		)
		.pipe(changed(PATH.source + stylesPath + '**/*.scss')) // source
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass({
				includePaths: ['node_modules'],
				errLogToConsole: true,
				outputStyle: "compressed",
			})
		)
		.pipe(postcss())
		.pipe(sourcemaps.write(PATH.maps))
		.pipe(gulp.dest(PATH.build + stylesPath)) // output
		.pipe(browser.stream());
});

gulp.task("images", () => {
	const imagesPath = PATH.assets + PATH.images;
	return gulp
		.src(PATH.source + imagesPath + '**/*')
		.pipe(changed(PATH.build + imagesPath))
		.pipe(gulp.dest(PATH.build + imagesPath)
	);
});

gulp.task("fonts", () => {
	return gulp
		.src(PATH.source + PATH.assets + PATH.fonts + '**')
		.pipe(gulp.dest(PATH.build + PATH.assets + PATH.fonts)
	);
})

gulp.task("scripts", function () {
	const scriptsPath = PATH.assets + PATH.scripts;
	return gulp
		.src(PATH.source + scriptsPath + '**/*.js') // source
		.pipe(
			plumber({
				errorHandler: onError,
			})
		)
		.pipe(changed(PATH.source + scriptsPath + '**/*.js')) // source
		.pipe(uglify())
		.pipe(gulp.dest(PATH.build + scriptsPath)) // output
		.pipe(browser.stream());
});

function initBrowserSync () {
	const browserConfig = PROJECT_CONFIG.browserSync;
	browser.init({
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
gulp.task("pack", function () {
	initBrowserSync();
	gulp.watch([
		PATH.source + PATH.assets + PATH.styles,
		'tailwind.config.js',
		PATH.source + '*.twig',
		PATH.source + PATH.includes + '**/*.twig',
		PATH.source + PATH.partials + '**/*.twig',
	], gulp.series("styles"));
	gulp.watch(PATH.source + PATH.assets + PATH.scripts, gulp.series("scripts"));
	gulp.watch(PATH.source + PATH.assets + PATH.images, gulp.series("images"));
	gulp.watch([
		PATH.source + '*.twig',
		PATH.source + PATH.includes + '**/*.twig',
		PATH.source + PATH.partials + '**/*.twig',
	],gulp.series("html")).on("change", browser.reload);
});

// Purges
gulp.task("purgecss", () => {
	return gulp
		.src(PATH.build + PATH.styles + '*.css')
		.pipe(
			purgecss({
				content: [PATH.build + '*.html'],
			})
		)
		.pipe(gulp.dest(PATH.build + PATH.assets + PATH.styles));
});

gulp.task("purgehtml", () => {
	return gulp
		.src(PATH.build + '*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(PATH.build));
});

gulp.task('cleanAssets', () => {
	return del(PATH.build + PATH.assets);
});

// Launcher
gulp.task('build', gulp.series('cleanAssets', gulp.parallel('styles', 'html', 'images', 'scripts')));
gulp.task('min', gulp.parallel('purgehtml')); //fix
gulp.task('run', gulp.series('build', 'pack'));
gulp.task("publish", gulp.series('build', 'min'));