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
  
  
  
--------------------------------------------------------------------------
## Requirements
* `Gulp` - http://gulpjs.com/
  * Globally: `npm install --global gulp` and locally to your project `npm install --save-dev gulp`
* `gulp-load-plugins` - https://www.npmjs.com/package/gulp-load-plugins
  * Locally: `npm install --save-dev gulp-load-plugins`
  
What gulp-load-plugins does is goes into your package.json file and loads all of your gulp plugins.
**NOTE:** gulp will only load plugins that are prefaced with `gulp-`. This is not an issue with packages like `del` for example, as we can easily apply those in each task file that uses it. Explained in this tutorial.
  
  
  
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
gulp.task('sass', 			getTask('sass'));
gulp.task('ts',				getTask('typescript'));
gulp.task('newTask', 			getTask('newTask'));
  
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
gulp.task('browsersync', ['sass','ts'], getTask('browsersync'));
gulp.task('sass', 			getTask('sass'));
gulp.task('ts',				getTask('typescript'));
gulp.task('newTask', 			getTask('newTask'));
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
## Example task file
```javascript
// =======================================================
// Gulp Browsersync - Sets up browser dev
// =======================================================
var config 			= require('../../gulp/config.js');
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
    
    
    
--------------------------------------------------------------------------
## Configuration File
But we also store each task configuration in one simple object so then we only have to edit the one config file whenever we want to add, remove, or import a new task 
  
  
  
--------------------------------------------------------------------------
## Utility functions
### newTask Example
```javascript
// =======================================================
// Gulp New Task - creates a new gulp task template
// =======================================================
var config 		= require('../../config/config.js');

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
  
  
  
