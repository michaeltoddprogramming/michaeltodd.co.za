(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Todd_Project4_atlas_1", frames: [[0,0,1281,721],[1653,0,313,304],[1283,290,306,295],[1283,0,368,288]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.BG = function() {
	this.initialize(ss["Todd_Project4_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.ChickenRunningImage = function() {
	this.initialize(ss["Todd_Project4_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.ChickenStillImage = function() {
	this.initialize(ss["Todd_Project4_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.rock = function() {
	this.initialize(ss["Todd_Project4_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.ROCK = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.rock();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ROCK, new cjs.Rectangle(0,0,368,288), null);


(lib.Run = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ChickenRunningImage();
	this.instance.setTransform(75.1,0,0.24,0.24,0,0,180);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Run, new cjs.Rectangle(0,0,75.1,73), null);


(lib.btnStart = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.Start = new cjs.Text("START", "100px 'PixelGameFont'", "#CC6600");
	this.Start.name = "Start";
	this.Start.lineHeight = 108;
	this.Start.lineWidth = 381;
	this.Start.parent = this;
	this.Start.setTransform(16.55,22.95);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#292929").s().p("A+2JKIAAyTMA9tAAAIAASTg");
	this.shape.setTransform(197.5,58.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FFFFFF").ss(1,1,1).p("Ae3AAMg9tAAA");
	this.shape_1.setTransform(197.5,117.2);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("A+2JKIAAyTMA9tAAAIAASTg");
	this.shape_2.setTransform(197.5,58.6);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#CC6600").s().p("A+2JKIAAyTMA9tAAAIAASTg");
	this.shape_3.setTransform(197.5,58.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.Start,p:{y:22.95}}]}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.Start,p:{y:16.95}}]},1).to({state:[{t:this.shape_3},{t:this.shape_1},{t:this.Start,p:{y:16.95}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,0,401,131.2);


(lib.Stand = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ChickenStillImage();
	this.instance.setTransform(73.45,0,0.24,0.24,0,0,180);

	this.instance_1 = new lib.Run();
	this.instance_1.setTransform(37.5,35.1,1,1,3.6911,0,0,37.5,36.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},5).wait(5));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.2,-3.6,79.60000000000001,77.69999999999999);


// stage content:
(lib.Todd_Project4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0];
	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		stage.enableMouseOver(20);
		
		var chicken = new lib.Stand();
		//var background = new lib.BGA();
		var start = new lib.btnStart();
		var mainScope = this;
		//var scoreTextHolder = new lib.ST();
		var rock1 = new lib.ROCK();
		var rock2 = new lib.ROCK();
		
		//stage.addChild(background);
		//stage.addChild(scoreTextHolder);
		stage.addChild(chicken);
		stage.addChild(start);
		stage.addChild(rock1);
		stage.addChild(rock2);
		chicken.stop();
		start.stop();
		
		//background.scaleX = 2.5;
		//background.scaleY = 2.5;
		//background.y = 0;
		
		rock1.scaleX = 0.3;
		rock1.scaleY = 0.3;
		rock1.y = 615;
		rock1.x = 550;
		
		rock2.scaleX = 0.3;
		rock2.scaleY = 0.3;
		rock2.y = 615;
		rock2.x = 1150;
		
		//scoreTextHolder.x = 590;
		//scoreTextHolder.y = 140;
		
		chicken.scaleX = 1.5;
		chicken.scaleY = 1.5;
		chicken.x = 90;
		chicken.y = 585;
		
		start.x = 420;
		start.y = 120;
		
		var SpeedOfRocks = 12;
		var GameScore = 0;
		var ChickenAlive = true;
		var gameStarted = false;
		var hitRock = false;
		var Jumping = false;
		var SuccessfulJump = false;
		var backgroundMusicPlaying = false;
		var RockHitEffectPlaying = false;
		
		createjs.Sound.registerSound("SoundEffects/startClickEffect.mp3", "jumpSoundEffect");
		createjs.Sound.registerSound("SoundEffects/BGMusic.mp3", "backgroundMusic");
		createjs.Sound.registerSound("SoundEffects/RockHitEffect.mp3", "RockHitSoundEffect");
		createjs.Sound.registerSound("SoundEffects/PointEffect.mp3", "PointSoundEffect");
		createjs.Sound.registerSound("SoundEffects/LevelUpEffect.mp3", "LevelUpSoundEffect");
		
		start.addEventListener("click", BGMusicPlayer);
		start.addEventListener("mouseover", handleMouseOver);
		start.addEventListener("mouseout", handleMouseOut);
		
		function BGMusicPlayer() {
			if (backgroundMusicPlaying == false) {
				var backgroundMusic = createjs.Sound.play("backgroundMusic", {
					loop: -1
				});
				backgroundMusic.volume = 0.4;
				backgroundMusicPlaying = true;
			}
		}
		
		function handleMouseOver() {
			start.gotoAndStop(1);
		}
		
		function handleMouseOut() {
			start.gotoAndStop(0);
		}
		
		start.addEventListener("click", startGame);
		
		function startGame() {
			start.visible = false;
			ChickenAlive = true;
			gameStarted = true;
			if (ChickenAlive) {
				createjs.Ticker.addEventListener("tick", moveChicken);
				chicken.gotoAndPlay(0);
			}
			mainScope.ScoreText.text = 0;
			GameScore = 0;
		}
		
		function moveChicken() {
			if (ChickenAlive == true) {
				rock1.x -= SpeedOfRocks;
				rock2.x -= SpeedOfRocks;
			} else {
				chicken.gotoAndStop(0);
				//mainScope.scoreTextHolder.text = 1;
				mainScope.ScoreText.text = 0;
				GameScore = 0;
				SpeedOfRocks = 12;
				start.visible = true;
				hitRock = false;
				RockHitEffectPlaying = false;
				gameStarted = false;
				chicken.x = 90;
				chicken.y = 585;
				rock1.y = 615;
				rock1.x = 550;
				rock2.y = 615;
				rock2.x = 1150;
			}
		
			var chickenXaxis = chicken.x;
			var chickenYaxis = chicken.y;
		
			var chickenWidth = 50;
			var rock1Width = 50;
			var rock2Width = 50;
		
			var rock1Xaxis = rock1.x;
			var rock2Xaxis = rock2.x;
		
			var rock1Yaxis = rock1.y;
			var rock2Yaxis = rock2.y;
		
			var airHeight = 150;
		
			if (chickenYaxis >= rock1Yaxis - airHeight) {
				if (chickenXaxis + chickenWidth > rock1Xaxis && chickenXaxis < rock1Xaxis + rock1Width) {
					ChickenAlive = false;
					if (RockHitEffectPlaying == false) {
						var playRockHitSFX = createjs.Sound.play("RockHitSoundEffect");
						RockHitEffectPlaying = true;
					}
				}
			}
			if (chickenYaxis >= rock2Yaxis - airHeight) {
				if (chickenXaxis + chickenWidth > rock2Xaxis && chickenXaxis < rock2Yaxis + rock2Width) {
					ChickenAlive = false;
					if (RockHitEffectPlaying == false) {
						var playRockHitSFX = createjs.Sound.play("RockHitSoundEffect");
						RockHitEffectPlaying = true;
					}
				}
			}
			if (Jumping) {
				const chickenOverRock1 = chickenXaxis + chickenWidth > rock1Xaxis && chickenXaxis < rock1Xaxis + rock1Width;
				const chickenOverRock2 = chickenXaxis + chickenWidth > rock2Xaxis && chickenXaxis < rock2Xaxis + rock2Width;
		
				if (chickenOverRock1 || chickenOverRock2) {
					if (chickenYaxis === 585) {
						hitRock = false;
						SuccessfulJump = false;
					}
					if (!SuccessfulJump) {
						GameScore += 10;
						mainScope.ScoreText.text = GameScore;
						var playPointSFX = createjs.Sound.play("PointSoundEffect");
						console.log("Current Game Score: " + GameScore);
						SuccessfulJump = true;
		
						if (GameScore % 100 === 0) {
							SpeedOfRocks += 5;
							var LevelUpEffect = createjs.Sound.play("LevelUpSoundEffect");
						}
					}
				} else {
					SuccessfulJump = false;
				}
			}
			if (rock1Xaxis <= 0) {
				rock1.x = 1280;
			}
			if (rock2Xaxis <= 0) {
				RandomRockPlacer();
			}
		}
		
		function RandomRockPlacer() {
			const minDistance = 900;
			const maxDistance = 1400;
		
			const randomDistance = Math.random() * (maxDistance - minDistance) + minDistance;
		
			const totalWidth = 60 + randomDistance;
		
			if (rock1.x + totalWidth >= rock2.x) {
				rock2.x = rock1.x + totalWidth + minDistance;
			} else {
				rock2.x += randomDistance;
			}
		}
		
		window.addEventListener("keydown", function(e) {
			var airTime = 700;
			var fallingTime = 350;
			var jumpingTime = 400;
			var move = 275;
		
			var keyCode = e.keyCode;
			if (keyCode === 32 && !Jumping && gameStarted === true) {
				Jumping = true;
				createjs.Tween.get(chicken).to({
					y: chicken.y - move
				}, jumpingTime).wait(airTime).to({
					y: chicken.y
				}, fallingTime).call(function() {
					Jumping = false;
					if (chicken.y === 585) {
						chicken.gotoAndPlay(0);
					}
				});
				chicken.gotoAndStop(0);
				var playJumpSFX = createjs.Sound.play("jumpSoundEffect");
			}
		});
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// script
	this.ScoreText = new cjs.Text("0", "94px 'PixelGameFont'", "#FFFFFF");
	this.ScoreText.name = "ScoreText";
	this.ScoreText.textAlign = "center";
	this.ScoreText.lineHeight = 102;
	this.ScoreText.lineWidth = 100;
	this.ScoreText.parent = this;
	this.ScoreText.setTransform(618.5,132.25,1.4324,1.4324);

	this.instance = new lib.BG();
	this.instance.setTransform(0,2,1.2436,1.2428);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.ScoreText}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(640,362,953.0999999999999,536);
// library properties:
lib.properties = {
	id: '6E48FF50C6ED164A8DCC786CD83D76F0',
	width: 1280,
	height: 720,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/Todd_Project4_atlas_1.png?1699872079370", id:"Todd_Project4_atlas_1"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['6E48FF50C6ED164A8DCC786CD83D76F0'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;