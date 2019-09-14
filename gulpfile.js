const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const fs = require('fs');

gulp.task('serve', () => {
	browserSync.init({
		// Set your main package.
		server: './packages/main/dist'
	});

	// Directories to ignore.
	const directories_to_ignore = [
		'node_modules',
	]

	// Directories to watch.
	const directories_to_watch = [
		'packages',
	]

	// Files types to watch.
	const files_to_watch = [
		'.css',
		'.html',
		'.js',
	]

	// CSS proprocessors in use.
	const css_preprocessors = [
		'.scss',
	]


	/**
	* Build directories to ignore (array).
	*/
	const get_directories_to_ignore = directories_to_ignore.map(dir => `!**/${dir}`);

	/**
	* Get File Extension.
	* @param {string} filename
	*/
	const getFileExtension = (filename) => {
		// Get all text after the last "." of the string.
		return (/[.]/.exec(filename)) ? `.${/[^.]+$/.exec(filename)[0]}` : undefined;
	}

	/**
	* Build files to watch from "src" (array).
	*/
	const watch_files = () => {
		let src_files = [];
		// Loop through all file types (Including preprocessors).
		files_to_watch.concat(css_preprocessors).forEach(fileType => {
			directories_to_watch.forEach(directory => {
				// Add the full relative path.
				src_files.push(`${directory}/**/src/**/*${fileType}`);
			});
		});
		// Merge with the directories to ignore.
		return src_files.concat(get_directories_to_ignore);
	}

	/**
	* Reload browser. (With browserSync)
	*/
	browserSync.watch( watch_files(), (event, file) => {
		// First lets watch for file changes.
		if (event === 'change') {
			// If the file has anything to do with "css"
			if (css_preprocessors.includes(getFileExtension(file))) {
				// The compiled file in the "dist" dir would be a "css" file.
				package = file.replace(/src\/.*/g, `dist/**/*.css`);
			} else {
				// If not. just replace "src" with "dist".
				package = file.replace(/src\/.*/g, `dist/**/*${getFileExtension(file)}`);
			}

			// Watch the "dist" directory of the package where the change happened.
			let watchStream = gulp.watch(directories_to_ignore.concat(package), () => {
				// If a "css" related file is what changed.
				if (css_preprocessors.concat('.css').includes(getFileExtension(file))) {
					// Inject css changes.
					browserSync.reload("*.css");
				} else {
					// If not. Force reload the browser.
					browserSync.reload();
				}
				watchStream.close()
			})
		}
	});
})

gulp.task('default', gulp.series( 'serve' ));
