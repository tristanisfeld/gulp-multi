Gulp Multi Task File Configuration Tutorial
===========================================
**NOTE:** This is not an introduction to gulp tutorial and assumes that you are famialiar with gulp already and therefor will not get into the details of learning gulp as that is out of the scope of this tutorial.
  
## Index
* The Problem
* The Solution
* Requirements
* Your new gulpfile
* Example task file
* Configuration file
* Utility functions
  
  
  
--------------------------------------------------------------------------
## The Problem
Your `gulpfile.js` can often become rather unruly. It often becomes difficult to maintain and read. Depending upon the size of your project, it can be compounded even worse. Also not all gulp tasks are 'project specific', rather developer specific. For example, right now in JavaScript with es5 and es6/es7 (or es2015 / es2016 / es2017... whatever you want to call it) you can live and work as if it's 2007 and continue to write es5. Or you can write "Modern JavaScript" using tools like Babel and Traceur, or use one of the transpiled JavaScript superset languages like coffeescript or typescript etc. etc. 
  
Your gulpfiles are often then tightly coupled to the project you are working on. So you will often have to copy and paste code from your gulpfile into your new project while editing the configuration options, and paths. Or you might even have some default templates for your tasks saved as gists. But every time you start a new project, you will need to edit them, delete the comments (or leave them in and have a really large gulpfile).
  
  
  
--------------------------------------------------------------------------
## A solution
With a gulp multi task file configuration will help with the problems mentioned above. That's not to say that a multi task file set up can not also become that way if poorly designed. And at first, it can be tricky to wrap your head around. Basicly what this does is take a gulpfile which can be anywhere from 50 lines to multiple hundreds of lines, and turns it into a couple dozen and splits your tasks up into individual tasks with their own file. You can then do a few other nifty things to help manage this, which I will get into a little later. But the best part, is that you can then save your tasks as gists and import them in easily to each new project, share them with others, with very little configuration.
  
This also allows for you to be able to leave lots of comments in your gulp tasks, and comment out certain parameters not used in every project, but often enough to not want to have to look at the documentation everytime you need it.

Other extra benefits:
* Using external config file can provide autocomplete functionality in many editors
  * Using visual studio code for example, requiring an external file gives you access to autocomplete. Storing the source location as a property in a task object, you get `config.` listing all of your tasks, then `config.taskName.` listing all of your task options, resulting in `config.taskName.src` and `config.taskName.dest` etc. Nice! 
  
  
--------------------------------------------------------------------------
## Requirements
* `Gulp` - http://gulpjs.com/
  * Globally: `npm install --global gulp` and locally to your project `npm install --save-dev gulp`
* `gulp-load-plugins` - https://www.npmjs.com/package/gulp-load-plugins
  * Locally: `npm install --save-dev gulp-load-plugins`

### Some Notes on `gulp-load-plugins
What gulp-load-plugins does is goes into your package.json file and loads all of your gulp plugins.  
  
**NOTE:** gulp-load-plugins will only load plugins that are prefaced with `gulp-`. This is not an issue with packages however. Packages like `del` for example, we can easily apply those in each task file that uses it.  
  
You access the plugins in your task file with `plugins.pluginName`, accessing the plugins via dot notation.
It also lists all the gulp plugins without having to preface the plugin names with gulp. So, when writing your tasks and piping, you only need to call `plugins.rename` instead of `plugins.gulp-rename`. It also then turns all of the gulp plugins with multiple `-`'s in the names to camelCase. For example, instead of  `plugins.long-task-name`, you would write `plugins.longTaskName`.  
  
  
--------------------------------------------------------------------------
## Your new gulpfile
 Let me give you an example. First I will show you the gulpfile I've been talking about looks like, and then I will break it down:
```javascript
// -----------------------------------------------------------
// gulpfile.js
// -----------------------------------------------------------
var gulp		= require('gulp'), 
    config		= require('./gulp/config'),
    plugins		= require('gulp-load-plugins')();

// ----------------------------------------- Get Task Function
function getTask(task) {
	return require('./gulp/tasks/' + task)(gulp, plugins);
}

// --------------------------------------------- Gulp Commands
// ---- gulp
// ---- gulp watch
// ---- gulp newTask

// ------------------------------------------------ Gulp Tasks
gulp.task('browsersync', ['sass','ts'], getTask('browsersync'));
gulp.task('sass',                       getTask('sass'));
gulp.task('ts',                         getTask('typescript'));
gulp.task('newTask',                    getTask('newTask'));
  
// ------------------------------------------------ Gulp watch
gulp.task('watch', ['ts', 'sass'], function() {
	gulp.watch(config.typescript.src, ['ts']);
	gulp.watch(config.sass.src, ['sass']);
});
  
// ----------------------------------------------- Default Dev
gulp.task('default', ['sass', 'ts', 'browsersync'], function() {
	console.log("I am running...");
});
```
  
  
  
### Header and require's
So our gulpfile here is short and sweet. At the top of the file, I like to put headers. This is not at all necessary (although I think it's helpfile in team projects for each task file). This header doesn't contain anything you didn't already know, that it's a gulpfile. 
```javascript
// -----------------------------------------------------------
// gulpfile.js
// -----------------------------------------------------------
var gulp			= require('gulp'),
    config			= require('./gulp/config'),
    plugins			= require('gulp-load-plugins')();
```
  
Underneath that simple header I declare three variables. The needed `gulp` variable, `config`, and `plugins`. The config variable I will get into a little later, but basicly what I've done is created a `gulp` folder in my project directory, which has a few other folders. One of those is `tasks` and another is `utilities`. The config variable is a config.js file that I use to store all of the task configurations.
**NOTE:** That `plugins			= require('gulp-load-plugins')();` contains `()` after the require statement. If you forget this, you will run into errors. So please ensure that you use how we've declared it here. `var plugins = require('gulp-load-plugins')();`
  
  
  
### Available gulp tasks
We also have a section, that again is not needed, but it helps switching from project to project especially in larger projects, what gulp commands you can call. You can always of course call each task individually in your terminal, but that wouldn't be convenient so we always just have a few, like the default `gulp`, `gulp build`, `gulp watch`, etc. We've also listed them here because of how you can require tasks be run before that task get's called like our `browsersync` task. When having to ensure one task gets called before you run another, it can get confusing to remember. So when you design your gulp tasks, it becomes useful to remind yourself or whoever will be using your code if you explicitly state which tasks are provided for them to run.
  
In this example it lists gulp, gulp newTask, and gulp watch. But it may contain quite a few more if you use gulp like I do. Such as the odd `newTask` task that we have there. we will get into that later under the utility functions section.
```javascript
// --------------------------------------------- Gulp Commands
// ---- gulp
// ---- gulp watch
// ---- gulp newTask
```
  
  
  
### getTask Function
We've separated out the gulp file with comments to make it easier for ourselves to read the files quicky. Under the variables you will see one that says "Get Task Function". What that simple function does is simply go into the `./gulp/task` folder and pull a task out. 
```javascript
// ----------------------------------------- Get Task Function
function getTask(task) {
	return require('./gulp/tasks/' + task)(gulp, plugins);
}
```
  
Our getTask function calls the task file name. For example, if we call a taskfile name `this-is-an-awesome-task.js`, you would call: `getTask('this-is-an-awesome-task')`. Specifying `.js` is not necessary in gulp, being that gulp is just nodejs, and using `require` doesn't force you to declare the file extension. That's why when you declare the requirements at the top of your gulpfile, you do not specify an extension. You may do this with .json files as well, simply the filename. You are only required to do so if you have both a `.json` and `.js` file with the same name.
You can see our `getTask` function in action under the section commented "Gulp Tasks".
  
  
  
### Calling Gulp Tasks
As mentioned earlier, you may call tasks which require that other tasks be called before that task gets run. Here, you can see how you would do that the same way in a single page gulpfile, with our get task function. 
```javascript
// ------------------------------------------------ Gulp Tasks
gulp.task('browsersync', ['sass','ts'],	getTask('browsersync'));
gulp.task('sass',			getTask('sass'));
gulp.task('ts',				getTask('typescript'));
gulp.task('newTask',			getTask('newTask'));
```
  
  
  
### Leaving tasks in your gulpfile
We left a `gulp watch` task in the file, but you do not need this. We've left it there in case we come into a situation where we cannot run browsersync because we are on a public network for example. This also shows that you can still call gulp tasks the same way that you would in a traditional gulpfile. You can also see in the gulp watch task how we end up using our config file:
```javascript
// ------------------------------------------------ Gulp watch
gulp.task('watch', ['ts', 'sass'], function() {
	gulp.watch(config.typescript.src, ['ts']);
	gulp.watch(config.sass.src, ['sass']);
});
```
  
If we ever want to change directories, or have a different project using a different structure we then only have to edit the folder structure once since each of the task files contain the project structure in one easy config object. We will see an example of that a little later as well. 
  
  
  
### The default gulp task
And finally we have our default gulp task.
```javascript
// --------------------------------------------------- Default
gulp.task('default', ['sass', 'ts', 'browsersync'], function() {
	console.log("I am running...");
});
```
  
    
    
    
--------------------------------------------------------------------------
## Example task files
The gulp task files is where the magic happens. Here you can put useful information in your headers and comments for yourself or your team, and wont cause a giant file. For example, if you are working in a team, or on an open source project, you can store your name, or project name, task description, etc. And since you are storing it as a gist, or submodule, or in your gulp plugin on npm as an example, it would be a good idea to list the dependencies for your tasks here as well, since they do not show up here. They will be in your project.json file, but you wont be listing them. But this is a good thing, since you can store the task as a gist or something, you can easily see the requirements when you use it again, or when anyone else on your team or working with your project or uses your tasks outside of the project.  
  
**NOTE:** it would be a good idea to link them to this tutorial in your projects README.md or docs files, or some other tutorial if you prefer so they know how to use multi task files.

In this example, you might miss it if you weren't looking hard enough at it, but we have sourcemaps, and autoprefixer to. That would be, `gulp-sourcemaps`, and `gulp-autoprefixer`. That would be a good reason to list the dependencies. Or, leave a good description. Or even have an easy copy and paste npm install --save-dev command listing them all. You can append, or prepend, whatever works best for you. I will try to use a variety of options directly in the examples.

### Sass
```javascript
// =======================================================
// Gulp Sass Task
// =======================================================
// npm install --save-dev gulp-sass node-sass gulp-sourcemaps gulp-autoprefixer

var config = require('../config.js');

module.exports = function(gulp, plugins) {
	return function () {
	var stream = 
// -------------------------------------------- Start Task
	gulp.src(config.sass.src)
	.pipe(plugins.sourcemaps.init())
	// .pipe(plugins.plumber())
// Load Bootstrap and Fontawesome Sass
	.pipe(plugins.sass(config.sass.opts))
	.pipe(plugins.sass().on('error', plugins.sass.logError))
	.pipe(plugins.autoprefixer(config.autoprefixer.opts))
// Compile Synchronously with `sync()`
	// .pipe(plugins.plumber.stop())
	// .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
	.pipe(plugins.sourcemaps.write('.'))
	.pipe(gulp.dest(config.sass.dest));
// ---------------------------------------------- End Task
	return stream;
	};
};
```

You can see how we go about using the task files from this example. We require our config file. We export the function with nodes `module.exports, pass our gulp and plugins variables so when we call our task, that's what our gulpfile will pass the function containing our task. And we pass our gulp task into a stream, and return the stream at the end of the task.  
  
In between the start task and end task comments is where you would put the task code. This file does seem to contain some things that you might feel like you don't want to type out everytime. That brings us to that fancy newTask task we seen earlier. That example is listed in the utility function down below. I simple create a template file and that task creates a new one for me whenever I run it. I just need to rename it, and edit between those comments.  
  
So we can also see that there is a plugin commented out, gulp-plumber. So if you get someone elses task file or someone else gets yours, they can simply comment out or remove it. Or you can provide options for yourself and comment them when not using, etc.  
  
In our sass plugin, we pass in our config.sass.opts, which is just an object in our config file for our sass task. You will see and example of that in the next section "Configuration File".  
  
Not all of the tasks will follow that standard return stream format as the example above. Typescript for example definitely might take some time to figure out. Especially if you aren't to familiar with node or gulp, but once you understand streams and how gulp runs tasks a little better, it will be quite easy to write your own tasks, which will differ vastly from the tutorials or npm examples. I will provide some links to resources at the thend under a section called "Resources".  
  
### typescript
```javascript
// =======================================================
// Gulp Typescript - Tanspiles typescript to js
// =======================================================
// npm install --save-dev gulp-typescript gulp-sourcemaps
var config 				= require('../config.js');

module.exports = function(gulp, plugins) {
	return function () {
	var stream = 
// -------------------------------------------- Start Task
	gulp.src(config.typescript.src)
	.pipe(plugins.sourcemaps.init())
	.pipe(plugins.typescript({
		noImplicitAny: true,
//		out: 'output.js'
	}));
	
// ---------------------------------------------- End Task
	return stream.js.pipe(plugins.sourcemaps.write('.'))
		.pipe(gulp.dest(config.typescript.dest));
	};
};
```

As you can see, the return doesn't just return stream. it returns: `stream.js.pipe(plugins.sourcemaps.write('.')).pipe(gulp.dest(config.typescript.dest));`
Just append the requirements to the return stream variable as needed for the plugin. If you know what node streams are, then that's great, you should continue to the browsersync task below, or continue to the next section. For those who aren't so familiar, see the references below, and just for now, think of them as your passing to your return statement. We created `var stream = gulp.src(...)` containing our sourcefile location that we are passing to the gulp task. We then `.pipe(...)` the plugins. Quite literally piping the stream forward, and repeating until the piping is done. At the end, we return the stream. Basically streams are taking data, and continuously working on it in memory, passing it forward to another plugin or module to work on that data. Until all of the data manipulation is done, and returned. This is a high level overview of course, but out of the perview of this tutorial, and see the resources below for more information.  
  
So if you come across another gulp-plugin like typescript, and trying to figure out how you would use it in our new multi task file setup, look at how the examples are shown. How are they returning the stream? If they are returning something, but not named stream, what are they returning? If the gulp task starts like this, `var someName = gulp.src(...)`, someName is the stream. So use that or use whatever you want to call it. And when you return it, just abpend the extra bits they have. Check out the typescript examples here and compare them to our example: https://www.npmjs.com/package/gulp-typescript . If the plugins examples don't return anything, then just put the code in between the start and end comments, and be sure to preend `plugins.` where it makes sense.  
  
  
### Browsersync
```javascript
// =======================================================
// Gulp Browsersync - Sets up browser dev
// =======================================================
// npm install --save-dev browser-sync gulp-sass gulp-typescript

var config 			= require('../config.js');
var browserSync 		= require('browser-sync').create();

module.exports = function(gulp, plugins) {
	return function () {
	var stream = 
// -------------------------------------------- Start Task
	browserSync.init(config.browsersync.opts);
	
	gulp.watch(config.sass.src, ['sass']);
	gulp.watch(config.typescript.src, ['ts']);
	gulp.watch(config.browsersync.watch).on('change', browserSync.reload);
// ---------------------------------------------- End Task
	return stream;
	};
};
```
    
As mentioned earlier, there will come a time when you want to run a task that is not a gulp plugin, and thus not prepended with `gulp-` and therefor not loaded by gulp-load-plugins. Like browser-sync here. In order to use it, simply require it in your task file.   
    
--------------------------------------------------------------------------
## Configuration File
We store each task configuration in one simple object so then we only have to edit the one config file whenever we want to add, remove, or import a new task file.
```javascript
// =======================================================
// Gulp Config
// =======================================================
// ---------------------------------------- Export Configs
module.exports = {
	autoprefixer: {
		opts: {
			browsers: ['last 3 versions']
		}
	},
	browsersync: {
		opts: {
			server: './src/'
		},
		watch: [
			'./src/bin/styles/**/*.css',
			'./src/bin/scripts/**/*.js',
			'./src/**/*.html'
		]
	},
	sass: {
		src: [
			"./src/bin/styles/sass/**/*.{scss,sass}"
		],
		opts: { },
		outputName: 'main.css',
		dest: './build/css/'
	},
	typescript: {
		src: [
			'./src/bin/scripts/ts/**/*.ts'
		],
		dest: './build/js/'
	},
	newtask: {
		src: [
			"./gulp/utils/newTaskTemplate.js"
		],
		outputName: "TASK-TEMPLATE.js",
		dest: "./gulp/tasks/"
	}
}
```
  
  

--------------------------------------------------------------------------
## Utility functions  
  
### newTask Example
This is an example of a newTask function that I use in all of my projects. It's quite handy for quickly templating out code and formatting so that I don't have to write out the same code every time I need to create a new task (that I don't already have). For example, I use browsersync. Let's say that I want to use nodemon and have never written a nodemon task (or have and did not save it wherever I sabe my tasks, like a gist, or submodule). I would simply run in my shell `gulp newTask`. And in my config.js file, I have newTask preferences where `config.newTask.src` lists where I'm storing the file for gulp to copy and paste in my tasks folder which is defined in the `config.newtask.desk` portion. By default, gulp will copy the file exactly as is. If you want to change the name, `gulp-rename`: https://www.npmjs.com/package/gulp-rename , will allow you to do that easily. And in our config.js file, we just provide another parameter `config.newtask.outputname`.
```javascript
// =======================================================
// Gulp New Task - creates a new gulp task template
// =======================================================
// npm install gulp-rename

var config 		= require('../config.js');

module.exports = function(gulp, plugins) {
	return function() {
	var stream = 
// -------------------------------------------- Start Task
	gulp.src(config.newtask.src)
	.pipe(plugins.rename(config.newtask.outputName))
	.pipe(gulp.dest(config.newtask.dest));
// ---------------------------------------------- End Task
	return stream;
	};
};
```

The template I use to copy, named newTaskTemplate.js looks like this:
```javascript
// =======================================================
// Gulp Task Template
// =======================================================
var config 				= require('../config.js');

module.exports = function(gulp, plugins) {
	return function () {
	var stream = 
// -------------------------------------------- Start Task
	gulp.src('')
// ---------------------------------------------- End Task
	return stream;
	};
};
```
  
  
You can of course make it however you want. But this is the standard gulp plugin needs, so mine looks like this.  
  
  
  
## Resorces
* Stream Handbook - https://github.com/substack/stream-handbook
