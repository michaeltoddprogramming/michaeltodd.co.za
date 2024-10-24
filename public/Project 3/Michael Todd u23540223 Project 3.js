(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Michael Todd u23540223 Project 3_atlas_1", frames: [[0,0,987,1510],[989,0,987,1510]]},
		{name:"Michael Todd u23540223 Project 3_atlas_2", frames: [[0,0,980,1121],[0,1123,899,841],[982,0,686,1510]]},
		{name:"Michael Todd u23540223 Project 3_atlas_3", frames: [[808,1015,795,72],[345,538,285,127],[1538,247,433,350],[0,1097,262,127],[1416,599,456,308],[1561,1174,229,108],[1874,728,151,98],[901,1167,307,91],[0,295,677,241],[808,1089,549,76],[345,727,563,140],[679,521,735,204],[264,1177,227,91],[1210,1174,349,78],[0,1226,201,93],[0,1015,806,80],[819,0,856,245],[264,1097,416,78],[0,0,817,293],[345,869,491,144],[838,930,834,83],[493,1177,175,103],[1674,909,346,127],[1874,599,163,127],[1904,0,136,152],[910,727,372,201],[819,247,717,272],[1359,1089,491,83],[682,1167,217,147],[1677,0,225,240],[1852,1038,109,319],[0,538,343,431]]},
		{name:"Michael Todd u23540223 Project 3_atlas_4", frames: [[0,1631,1254,236],[0,0,723,974],[0,976,1329,371],[1331,877,639,379],[0,1349,1087,280],[725,0,765,875],[1256,1349,401,660],[1492,0,401,660]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_59 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(img.CachedBmp_57);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,4045,934);


(lib.CachedBmp_56 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_147 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_146 = function() {
	this.initialize(img.CachedBmp_146);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2968,1120);


(lib.CachedBmp_52 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_145 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_144 = function() {
	this.initialize(img.CachedBmp_144);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2969,1124);


(lib.CachedBmp_49 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_143 = function() {
	this.initialize(img.CachedBmp_143);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2345,1044);


(lib.CachedBmp_42 = function() {
	this.initialize(img.CachedBmp_42);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2339,766);


(lib.CachedBmp_41 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_142 = function() {
	this.initialize(img.CachedBmp_142);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2719,891);


(lib.CachedBmp_38 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_141 = function() {
	this.initialize(img.CachedBmp_141);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3841,799);


(lib.CachedBmp_36 = function() {
	this.initialize(img.CachedBmp_36);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,4272,797);


(lib.CachedBmp_35 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(img.CachedBmp_34);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2719,797);


(lib.CachedBmp_33 = function() {
	this.initialize(img.CachedBmp_33);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,4268,1006);


(lib.CachedBmp_32 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_140 = function() {
	this.initialize(img.CachedBmp_140);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2783,1139);


(lib.CachedBmp_29 = function() {
	this.initialize(img.CachedBmp_29);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2783,1445);


(lib.CachedBmp_28 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(img.CachedBmp_25);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,712);


(lib.CachedBmp_24 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_139 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_138 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_137 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(img.CachedBmp_15);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3015,969);


(lib.CachedBmp_14 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["Michael Todd u23540223 Project 3_atlas_3"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.ToddRecoveredCopyaicopy2 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_59();
	this.instance.setTransform(1049.1,924.75,0.1904,0.1904);

	this.instance_1 = new lib.CachedBmp_58();
	this.instance_1.setTransform(1006.4,906.2,0.1904,0.1904);

	this.instance_2 = new lib.CachedBmp_57();
	this.instance_2.setTransform(543.1,859.1,0.1904,0.1904);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(543.1,859.1,770.3000000000001,177.89999999999998);


(lib.ToddRecoveredCopyaicopy = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_56();
	this.instance.setTransform(1131.15,201.5,0.1829,0.1829);

	this.instance_1 = new lib.CachedBmp_55();
	this.instance_1.setTransform(1053.55,233.7,0.1829,0.1829);

	this.instance_2 = new lib.CachedBmp_147();
	this.instance_2.setTransform(1041.05,201.8,0.1829,0.1829);

	this.instance_3 = new lib.CachedBmp_146();
	this.instance_3.setTransform(765.65,201.75,0.1829,0.1829);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(765.7,201.5,544.8,205.2);


(lib.ToddRecoveredCopyai = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_52();
	this.instance.setTransform(1163.7,81.9,0.1829,0.1829);

	this.instance_1 = new lib.CachedBmp_145();
	this.instance_1.setTransform(1148.95,72.5,0.1829,0.1829);

	this.instance_2 = new lib.CachedBmp_144();
	this.instance_2.setTransform(766.95,17.8,0.1829,0.1829);

	this.instance_3 = new lib.CachedBmp_49();
	this.instance_3.setTransform(776.6,41.3,0.1829,0.1829);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(767,17.8,542.9000000000001,205.6);


(lib.SMACKTEXT = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_48();
	this.instance.setTransform(0,0,0.3737,0.3737);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,85.6,40.4);


(lib.SMACKBUBBLE = function(mode,startPosition,loop,reversed) {
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
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#373535").s().p("AndKoQgJgDACgJQAGgeAQgjIAFgJIABgDQARgvAMgdQASgnAXgiIAJgfQAPhKgChCQgBg7gag6Qg4h5hbg4QgqgahEgcQhNgggrgLQhMgUhygGIg/gBIgWgBQgJAAAAgKQAAgKAJAAIBLACIALAAIAkABIB7AEQA2ABAdgEQAugFAhgSQAngVAXgnQAVgmABgtQACgtgPguIgYg7QgPgpgCgXQgEggANgVIAAgCQABgJAJAAQAFgDAGAFQAHAHgHAIIAAAAQABAsAcApQAZAlAsAgQBKA3BaAUQA1AMA6gCQA4gDA2gPQBxggBYhaQAygzAUgsIATgvQALgbAPgPQAEgFAHADQAFADAAAGQABAcgJAtQgMA5gCARQgGBBAcBGQAqBpBYA/QBLA2BuAgQBuAhBnADQArABBggFQBagFAwADQAKABAAAJQAAAKgKAAQiYABiBAfQiCAghNA3QhMA1guBYQgnBNgVBuQgLA8AMBOIAIAsQAcA6gHAnQgCAHgIAAQgIAAgCgHIgRhPIgEgNIgMgZQgfgzglgtQgtg4gtgdQgogahEgNQiAgZhuATQg8AKgvAhQgyAigrA1IgOATQgNAtghA8IgaAxIgaBGQgDAHgGAAIgDAAgAB/EnQA7APA0AsQArAkAqA7IAfAtIgCgJQgJhIARhNQAXhuAthPQAzhVBRg2QBVg2CMgeIAFgBQgoAAgdgDQhsgKhkgjQhvgmhIg9QhWhJgihxQgThBAIg7IANhDIAFggIgKAYQgRArgIANQgjA3g7A0QhYBNh1AaQh4AbhvgiQhigehHg+QgugpgTgtIABAIQAFAPAXA9QAlBdgZBNQgMAngcAeQgbAdgmAQQgkAOgwAEIgnABQAWAGAVAGQAsAOBKAhQBBAcArAhQAuAiAlA1QAiAyAWA5QAiBcgdCJIANgOQAyg1A3gdQArgWBGgIQAlgEAlAAQBZAABZAXg");
	this.shape.setTransform(105.35,68.0209);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AFLI1QAcA4gIAiIgUhagAncI+QAZhCAagoIAHgJIgBACQgKAmgpBKQgNAYgKAVIARgsgAFIIvQgRghglg2QhXh6hdgaQhKgXhcgDQhkgDhDAUQgyAPg2AuQgsAmgfAtQAehzgLhdQgGgygjhBQgfg5gngrQgngphEgjQgjgRhYgkQhJgdhigLQgogFgxgDIA2ACQBbAEAxAAQCWgBAzhiQATgmACgvQABgrgPgsQgXg4gLgiQgRg5AUgaIAAgEIADAAIgDAEQgBBaBnBMQBdBDBkAOQBnAOBggbQBjgbBKhCQA2guAlg4QAJgNASgvQAQgnAOgPQACAdgMA3QgMA6AAAcQAABXA3BdQA6BkCGA9QBqAwCOASQA+AIBtgGQB9gGAuADQhrAAhmARQhyAUhXAmQh4AzhCBnQg6BYgaCNQgLA9AMBOIAJAuIgDgGg");
	this.shape_1.setTransform(109.65,66.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,210.7,136.1);


(lib.SHOOTING = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_47();
	this.instance.setTransform(0,0,0.2345,0.2345);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,311.7,87);


(lib.ORISUT = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_46();
	this.instance.setTransform(725.9,283.8,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_45();
	this.instance_1.setTransform(874.8,225.8,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_44();
	this.instance_2.setTransform(774.35,190.35,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_143();
	this.instance_3.setTransform(0,-0.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-0.9,1172.5,522);


(lib.LASTFRAME = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_42();
	this.instance.setTransform(-0.5,-0.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.6,1169.5,383);


(lib.FRIEND = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_41();
	this.instance.setTransform(-0.6,-2.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.6,-2.9,449.5,420.5);


(lib.FRAME19 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(825.55,50.7,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_142();
	this.instance_1.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,1359.5,445.5);


(lib.FRAME18 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_38();
	this.instance.setTransform(1070.1,74.9,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_141();
	this.instance_1.setTransform(-0.4,-0.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.3,1920.5,399.5);


(lib.FRAME15 = function(mode,startPosition,loop,reversed) {
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
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("EAqWAN2MhUrAAAIAA7sMBUrAAAg");
	this.shape.setTransform(271,88.65);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#393769").s().p("EgqVAN2IAA7sMBUrAAAIAAbsg");
	this.shape_1.setTransform(271,88.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,544,179.3);


(lib.FRAME14 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_36();
	this.instance.setTransform(-0.5,-0.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.3,2136,398.5);


(lib.FRAME13 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(17.8,96.35,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_34();
	this.instance_1.setTransform(-0.5,-0.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.1,1359.5,398.5);


(lib.FRAME12 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,2134,503);


(lib.FRAME11 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(927.05,258.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_31();
	this.instance_1.setTransform(1008.45,184.15,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_140();
	this.instance_2.setTransform(-0.45,0.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,0.2,1391.5,569.5);


(lib.FRAME10 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_29();
	this.instance.setTransform(-0.5,-0.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.3,1391.5,722.5);


(lib.FRAME8 = function(mode,startPosition,loop,reversed) {
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
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#373535").p("EAqsAKhMhVXAAAIAA1BMBVXAAAg");
	this.shape.setTransform(720.8725,177.4454,2.6389,2.6389);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#1CAAA1").s().p("EgqrAKhIAA1BMBVXAAAIAAVBg");
	this.shape_1.setTransform(720.8725,177.4454,2.6389,2.6389);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,1443.8,356.9);


(lib.FRAME7 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_28();
	this.instance.setTransform(1318.2,294.35,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_27();
	this.instance_1.setTransform(1002.75,217.9,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_26();
	this.instance_2.setTransform(990.7,173.1,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_25();
	this.instance_3.setTransform(-0.5,-0.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,1443,356);


(lib.FRAME6 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(1084.25,82.5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_139();
	this.instance_1.setTransform(942.4,56.3,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_22();
	this.instance_2.setTransform(933.3,-0.65,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_21();
	this.instance_3.setTransform(48.6,593.3,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_138();
	this.instance_4.setTransform(2,558.15,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_19();
	this.instance_5.setTransform(-0.5,-0.4,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_18();
	this.instance_6.setTransform(389.1,-0.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.6,1427.3,755.3000000000001);


(lib.FRAME3 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(159.3,157.9,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_137();
	this.instance_1.setTransform(48.65,107.9,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_15();
	this.instance_2.setTransform(-0.5,-0.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.7,1507.5,484.5);


(lib.ENEMY = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(-0.65,-0.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.6,-0.6,382.5,437.5);


(lib.CONTROLLER = function(mode,startPosition,loop,reversed) {
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
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("AGHq+QCiBZC5DLQAzA4ArA1QAtA3AjAzQAGA5gVAtQgpBbiIg9QiHg8hOAMQgIABgGACQgQAEgLAHIgLAKIAmgVIFTjBABoqMQAAgpAPgbQAwhXC0BTQAWAKAWAMAoPDWQABAAABAAIATgBIBYhGQBqhYBjhZQE4kdBqjAQgUgZgQgUIgBAAABoqMQA+BZACAHQhAhPAAgRgACposIDeiSAqUG8IjyirQgSg8AMgqQAYhUBeA5QBeA5BPAJQAnAFAzgBQhTCeghAzgAqPG/IgFgDAkRK4Qhrg7jfiaIg0gkIF+D5ID3ikIAvA8QBLBsglAeQgtAkg7AAQg8AAhkgkQgYgJgsgZgAHHhXQidFSlnDuIAjAr");
	this.shape.setTransform(91.4017,76.5798);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#333333").s().p("AjNLaQgYgJgsgZID3ikIAvA8QBLBsglAeQgtAkg7AAQg8AAhkgkgAuGERQgSg8AMgqQAYhUBeA5QBeA5BPAJQAnAFAzgBQhTCeghAzIgRAVgALQg/QiHg8hOAMIgOADIFTjBQAtA3AjAzQAGA5gVAtQgYA2g7AAQgnAAg3gYgACoosQgCgHg+hZQAAgpAPgbQAwhXC0BTQAWAKAWAMIjeCSg");
	this.shape_1.setTransform(91.4017,76.5798);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFF00").s().p("AlmK7Il/j5IF/D5Qhrg7jgiZIg0glIgEgDIAQgVQAhgzBTieIACAAIAUgBIBXhGQBqhYBjhZQE4kdBrjAIglgtIDfiSQCiBZC4DLQAzA5AsA1IlUDAQgPAEgLAHIgLAKQidFSloDuIAjArIj2Ckg");
	this.shape_2.setTransform(100,76.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,184.8,155.2);


(lib.BUTTON1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_13();
	this.instance.setTransform(42.25,5.2,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_12();
	this.instance_1.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,173,63.5);


(lib.FRAME5 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.ToddRecoveredCopyaicopy2("synched",0);
	this.instance.setTransform(1009.65,231.95,2.6256,2.6256,0,0,0,928.2,948);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.4,-1.4,2022.5,467);


(lib.FRAME2 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.ToddRecoveredCopyaicopy("synched",0);
	this.instance.setTransform(272,102.15,1,1,0,0,0,1038.2,304.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,544.8,205.1);


(lib.FRAME1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.ToddRecoveredCopyai("synched",0);
	this.instance.setTransform(271,102.2,1,1,0,0,0,1038.5,120.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,542.9,205.6);


(lib.EXPLO = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.FRAME12("synched",0);
	this.instance.setTransform(960,225.95,0.8999,0.8999,0,0,0,1066.8,251.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.4,1920.4,452.7);


// stage content:
(lib.MichaelToddu23540223Project3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {ZAP:0,"ZAP":21,"ZAP":69,PEW:0,"PEW":21,"PEW":62};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,59,73,130,240,241,405,646,696,733,750,866];
	this.streamSoundSymbolsList[59] = [{id:"PEWAUDIO",startFrame:59,endFrame:72,loop:1,offset:1168}];
	this.streamSoundSymbolsList[73] = [{id:"ZAPAUDIO",startFrame:73,endFrame:130,loop:1,offset:208}];
	this.streamSoundSymbolsList[130] = [{id:"FALLING",startFrame:130,endFrame:185,loop:1,offset:0}];
	this.streamSoundSymbolsList[240] = [{id:"CLANKAUDIO",startFrame:240,endFrame:247,loop:1,offset:0}];
	this.streamSoundSymbolsList[241] = [{id:"smack80173wav",startFrame:241,endFrame:965,loop:1,offset:0}];
	this.streamSoundSymbolsList[405] = [{id:"PEWAUDIO",startFrame:405,endFrame:441,loop:1,offset:0}];
	this.streamSoundSymbolsList[646] = [{id:"SHOOTINGAUDIO",startFrame:646,endFrame:696,loop:1,offset:0}];
	this.streamSoundSymbolsList[696] = [{id:"SHOOTINGAUDIO",startFrame:696,endFrame:721,loop:1,offset:0}];
	this.streamSoundSymbolsList[733] = [{id:"CLAPSLAP",startFrame:733,endFrame:866,loop:1,offset:0}];
	this.streamSoundSymbolsList[750] = [{id:"SNORE",startFrame:750,endFrame:965,loop:1,offset:0}];
	this.streamSoundSymbolsList[866] = [{id:"SNORE",startFrame:866,endFrame:978,loop:1,offset:6926}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_59 = function() {
		var soundInstance = playSound("PEWAUDIO",0,1168);
		this.InsertIntoSoundStreamData(soundInstance,59,72,1,1168);
	}
	this.frame_73 = function() {
		var soundInstance = playSound("ZAPAUDIO",0,208);
		this.InsertIntoSoundStreamData(soundInstance,73,130,1,208);
	}
	this.frame_130 = function() {
		var soundInstance = playSound("FALLING",0);
		this.InsertIntoSoundStreamData(soundInstance,130,185,1);
	}
	this.frame_240 = function() {
		var soundInstance = playSound("CLANKAUDIO",0);
		this.InsertIntoSoundStreamData(soundInstance,240,247,1);
	}
	this.frame_241 = function() {
		var soundInstance = playSound("smack80173wav",0);
		this.InsertIntoSoundStreamData(soundInstance,241,965,1);
	}
	this.frame_405 = function() {
		var soundInstance = playSound("PEWAUDIO",0);
		this.InsertIntoSoundStreamData(soundInstance,405,441,1);
	}
	this.frame_646 = function() {
		var soundInstance = playSound("SHOOTINGAUDIO",0);
		this.InsertIntoSoundStreamData(soundInstance,646,696,1);
	}
	this.frame_696 = function() {
		var soundInstance = playSound("SHOOTINGAUDIO",0);
		this.InsertIntoSoundStreamData(soundInstance,696,721,1);
	}
	this.frame_733 = function() {
		var soundInstance = playSound("CLAPSLAP",0);
		this.InsertIntoSoundStreamData(soundInstance,733,866,1);
	}
	this.frame_750 = function() {
		var soundInstance = playSound("SNORE",0);
		this.InsertIntoSoundStreamData(soundInstance,750,965,1);
	}
	this.frame_866 = function() {
		var soundInstance = playSound("SNORE",0,6926);
		this.InsertIntoSoundStreamData(soundInstance,866,978,1,6926);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(59).call(this.frame_59).wait(14).call(this.frame_73).wait(57).call(this.frame_130).wait(110).call(this.frame_240).wait(1).call(this.frame_241).wait(164).call(this.frame_405).wait(241).call(this.frame_646).wait(50).call(this.frame_696).wait(37).call(this.frame_733).wait(17).call(this.frame_750).wait(116).call(this.frame_866).wait(4352));

	// ZZZZ
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFF00").s().p("ADeEnIgLAAIgLAAIgLAAIgMAAIgLAAIgWAAIgUAAIgUAAIgVgBIgVgDIgPgEIgPgFIgJgFIgIgGIgIgHIgFgFIgEgFIgFgGIgDgBIgCABIgJADIgJACIgIACIgKABIgJAAIgKgBIgJgCIgKgCIgJgDIgJgDIgJgCIgMAAIgLAAIgLAAIgKABIgKAAIgKAAIgKABIgCABIgDABIgJAEIgJADIgKABIgJAAIgKgCIgHgCIgHgEIgGgEIgGgFIgFgGIgFgGIgDgHIgDgIIgCgJIgCgLIAAgKIACgKIACgHIAEgGIAEgGIAEgGIAFgGIAEgDIAEgJIAEgIIAFgIIAGgHIAGgGIAHgGIAIgHIAIgGIAJgFIAJgDIAFgDIAGgGIAFgHIAGgGIAGgIIAHgGIAFgFIAGgEIAGgEIAGgJIAGgJIAFgHIAGgJIAHgJIAGgIIAGgFIAGgFIAHgGIAGgGIAHgFIAGgFIAHgFIAGgFIAHgEIAIgDIAIgDIAIgFIAHgFIAIgHIAIgHIAHgHIAJgHIAJgFIAJgGIAEgHIAFgIIAFgHIAGgGIAFgFQAAgBABAAQAAgBABAAQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAAAgBgBQAAAAgBAAQgBgBAAAAIgHgCIgHgCQgbgBgaABIhCABIhEgBQgngCgmACIgTAAIgIgCIgHgDIgHgDIgHgEIgGgFIgFgGIgEgHIgDgHIgDgHIgCgIIAAgIIAAgIIACgIIADgHIADgHIAEgGIAFgGIAGgFIAHgEIAHgEIAHgDIAIgBQAngCAnABIBcABIBdgCQAlgBAkANQAPAGAOAHIALgCIAUgFIAKgCIAJgBIAKgBIAWABIAVADIAIADIAIAEIAHAFIAHAGIAGAGIAGAHIAEAHIAEAIIACAJIABAIIAAAJIgBAIIgDAJIgEAIIgFAIIgGAJIgGAIIgGAIIgJAHIgJAHIgIAEIgJAFIgIAGIgIAHIgIAHIgHAFIgHAFIgHAFIgHAFIgHADIgQAGIgEAHIgEAGIgFAGIgFAGIgEAHIgJAGIgJAGIgIAGIgJAEIgHAHIgHAGIgHAGIgHAFIgHAFIgIAGIgIAFIgHAEIgQAGIgFAEIgGAFIgHAGIgGAGIgHAHIgFAIIgFAIIgFAIIgFAIIgGAIIgGAIIgHAHIgGAGIgHAEIgHAEIAKADIAJACIAJADQAOgIAQgBQAOgBANABQAPABANAGIAYANQAJAGAKAKIAMAMQAQACAQAAIAWgBIASAAIAgAAIAgAAIASABIAIABIAHADIAHAEIAHAEIAGAFIAFAGIAEAGIAEAHIACAHIACAIIAAAIIAAAIIgCAIIgCAHIgEAHIgEAHIgFAGIgGAFIgHAEIgHADIgHADIgIACIgIAAIgLAAg");
	this.shape.setTransform(984.475,6642.0716);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFF00").s().p("AJhL7IgLAAIgLAAIgLAAIgMAAIgLAAIgXAAIgTAAIgUgBIgVgBIgVgDIgQgDIgPgGIgIgFIgIgGIgJgHIgFgFIgEgFIgGgGIgCgBIgCABIgKADIgIACIgIADIgKAAIgJAAIgKgBIgKgCIgJgCIgJgDIgJgDIgKgCIgLABIgLAAIgLAAIgKAAIgKAAIgKAAIgKABIgCABIgEACIgIAEIgKACIgJACIgJAAIgKgDIgHgCIgHgDIgGgEIgHgGIgEgGIgFgGIgDgHIgDgHIgDgKIgBgLIAAgJIACgKIACgHIAEgHIADgGIAFgFIAFgHIAEgDIAEgJIAEgIIAEgIIAHgGIAGgHIAGgGIAJgHIAIgFIAIgGIAKgDIAEgCIAHgHIAFgHIAGgGIAGgIIAGgGIAGgFIAGgEIAGgEIAGgJIAFgJIAGgIIAGgJIAGgJIAHgHIAGgGIAGgEIAGgHIAHgGIAHgFIAGgFIAGgFIAHgFIAHgEIAHgDIAIgDIAJgFIAHgFIAIgGIAIgIIAIgHIAJgGIAIgGIAKgFIAEgIIAFgHIAFgIIAGgGIAEgFQABgBABAAQAAAAAAgBQABAAAAgBQAAAAAAAAQAAgBAAAAQgBgBAAAAQgBgBAAAAQgBgBgBAAIgGgCIgHgCQgbgBgbABIhDABIhDgBQgngCgnACIgTAAIgHgCIgIgDIgHgDIgGgEIgGgFIgFgGIgEgGIgEgIIgDgGIgBgJIAAgIIAAgIIABgHIADgIIAEgGIAEgHIAFgGIAGgFIAGgEIAHgEIAIgDIAHgBQAngCAoACIBcAAIBegCQAlgBAkAOQAPAFAOAHIALgCIATgFIAKgBIAKgCIAKgBIAWABIAUADIAIADIAJAEIAHAGIAHAFIAFAGIAHAHIAEAIIADAHIADAJIABAJIAAAIIgBAIIgDAJIgEAIIgGAIIgFAJIgGAIIgHAIIgIAHIgJAHIgJAEIgIAFIgIAGIgJAHIgIAHIgGAFIgHAGIgHAEIgIAFIgHADIgQAGIgDAHIgEAHIgFAFIgFAHIgFAGIgIAGIgJAGIgIAGIgJAEIgHAHIgHAGIgHAGIgHAGIgHAFIgIAGIgIAFIgIAEIgPAGIgFAEIgHAFIgHAGIgHAHIgGAGIgFAIIgFAIIgFAIIgFAIIgGAIIgHAIIgHAIIgFAFIgHAEIgHAEIAKADIAJACIAJAEQAOgJAQgBQAOgBAOABQAPABAMAGIAZANQAJAGAKAKIAMAMQAQACAQAAIAVAAIATgBIAgAAIAgABIASAAIAIABIAHADIAHAEIAHAEIAFAFIAGAGIAEAGIADAHIADAHIABAIIABAIIgBAJIgBAIIgDAHIgDAHIgEAGIgGAGIgFAFIgHAEIgHAEIgHACIgIACIgIABIgLAAgAiOiBIgJgBIgJgEIgIgFIgHgGIgGgIIgFgIIgGgBIgJgBIgJgCIgKgBIgJgDIgKgDIgJgCQgggCggACIhAAAIg2AAIg2AAQgZgBgYgCQgNgCgNgDIgJgEIgJgFIgKgHIgIgHIgFgFIgFgGIgJACIgKAAIgJgCIgIgDIgHgEIgGgEIgGgFIgEgGIgEgGIgEgHIgDgHIgDgKIgBgKIAAgLIACgKIACgGIADgGIAFgHIAEgGIAEgGIADgCIAEgJIAEgJIAGgHIAFgHIAFgGIAFgGIAEgEIAGgEIAHgEIAFgEIAHgDIAEgHIAEgHIAGgHIAFgGIAGgGIAHgGIAHgFIAIgGIAFgDIABgBIAEgIIAGgJIAGgIIAHgIIAHgHIAIgHIAJgHIAIgFIAIgIIAHgIIAHgIIAIgMIAMgOIANgOIAPgMIASgLIATgIIgJgFIgHgEIgGgGIgFgGIgEgGIgKgBIgJAAIgJgCIgLgCIgLgDIgKgDIgGAGIgGAFIgHAFIgHAEIgHACIgIABIgHABIgIgBIgIgBIgHgCIgHgEIgHgFIgGgFIgFgGIgEgHIgEgHIgCgGIgCgJIgBgHIABgIIACgIIACgHIAEgHIAEgHIAMgLIAOgLQAGgGAIgEIAQgIIARgEIAQgDIAIgBIAJABIAIACIAJABIAJADIAKACIAHACIAGABIAIgBIAIAAIAIAAIAKABIAKADIAJADIAIAEIAJAGIAHAHIAGAHIAHAJIAqAAIAdAAIAhgBQAQAAAQAFQAOADAPAGIATAIIAGAFIAGAFIAFAGIAFAHIADAHIACAHIACAIIAAAIIAAAIIgCAIIgCAHIgEAGIgEAHIgGAGIgFAFIgGAEIgHADIgIADIgKACIgKAAIgJgBIgDAAIgFAGIgFAHIgGAFIgHAFIgJAFIgJADIgJACIgIACIgIACIAAgBIgCABIAAAAIgDAGIgFAHIgFAHIgGAHIgGAHIgHAEIgKAFIgKAEIgKACIgJADIgLABIgKABIgHADIgKAOIgOASIgNAPIgNANIgNAMIgIAFIgGAGIgGAHIgDAHIgEAJIgEAHIgEAIIgHAHIgHAGIgIAEIgIAEIgJADIgEAJIgEAJIgEAHIgFAHIgHAIIgDABQAjAJAmgCQAggCAgAAIBEAAQAjAAAhABQAeABAbAJIAHgDIAHgBIALgCIALAAIAKACIAHADIAIACIAIAEIAIAGIAHAGIAHAGIAHAHIAFAIIAFAKIACAJIADAJIABAKIACAJIABAKIgBAJIgCAKIgEAIIgFAJIgGAHIgHAGIgIAFIgJAEIgJABIgKABIgJgBgAlinnIAAABIACgCIgCABgAlanqIACAAIACAAIgCAAIgCAAg");
	this.shape_1.setTransform(945.8,6595.35);

	this.instance = new lib.CachedBmp_1();
	this.instance.setTransform(877.8,6456.25,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_2();
	this.instance_1.setTransform(848.4,6341.7,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_3();
	this.instance_2.setTransform(848.4,6341.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},880).to({state:[{t:this.shape_1}]},10).to({state:[{t:this.instance}]},10).to({state:[{t:this.instance_1}]},13).to({state:[{t:this.instance_2}]},12).to({state:[]},40).to({state:[]},4251).wait(2));

	// SMACK_BUBBLE
	this.instance_3 = new lib.SMACKTEXT("synched",0);
	this.instance_3.setTransform(1148.6,3717.9,1.338,1.338,0,0,0,42.8,20.1);

	this.instance_4 = new lib.SMACKBUBBLE("synched",0);
	this.instance_4.setTransform(1149.6,3719.65,1.5097,1.5097,0,0,0,105.5,68);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_4},{t:this.instance_3}]},750).to({state:[]},215).to({state:[]},752).wait(3501));

	// SHOOTINGBACK
	this.instance_5 = new lib.SHOOTING("synched",0);
	this.instance_5.setTransform(976.2,3314.65,2.1322,2.1322,-19.9999,0,0,155.8,43.6);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(697).to({_off:false},0).to({_off:true},268).wait(4253));

	// SHOOTING
	this.instance_6 = new lib.SHOOTING("synched",0);
	this.instance_6.setTransform(1077.25,2989,2.1322,2.1322,0,0,0,155.8,43.5);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(647).to({_off:false},0).to({_off:true},318).wait(4253));

	// GUNSHOT
	this.instance_7 = new lib.CachedBmp_5();
	this.instance_7.setTransform(1398.6,2325.1,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_4();
	this.instance_8.setTransform(1473.05,2404.1,0.5,0.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF0000").s().p("AGWBHIhzgBIg0AAIgHAAIgGgBIgGAAIgGgBIgHgBIgFgBIgGgCIgFgCIgGgDIgBAAIgFAAIgGAAIgFAAIgGgBIgGAAIgGgBIgGgCIgFgBIgGgDIgFgDQgOgDgLgJQgOgMgEgTQgDgOAGgNQAHgSAQgJQASgKAUAEQAOACAMAGIAJABIALAAIAKABIAMACIAPAFIAEACQA9AAA9gCQAogBAkALQAOAEAHAMQAZAogmAfQgQAMgTAAIgBAAgAixAnIimAAIhGAAQg3gIAFg2QABgTAQgLQAbgUAiAEQAVACAVAAQBTAABTgDQAbAAAXAKQAeANgBAhQAAAmglAKQgTAFgTAAIgEAAg");
	this.shape_2.setTransform(1537.679,2481.8926);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF0000").s().p("AB4BCIgjgBIgRAAIgRAAIgPgBIgSgCQgJgBgHgDIgJgFIgTAAIgXAAIgVAAIgRAAQgLgBgLgEIgKgFQgYABgWgGQgUgGgKgUQgIgQAFgTQAGgVATgKQAYgMAaABQAWABAUAHIAKAEIAPABIAcAAIAUgBIAQABQAKACALAFIAJAEQAoABAmgDQAggCAaANQAYANACAaQADAhgdAPQgVALgXAAIgKAAg");
	this.shape_3.setTransform(1620.2519,2488.8192);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FF0000").s().p("ACvBGIgCAAIgHAAIgHgBIgGgBIgHgBIgGgCIgFgCIgGgDIgOgBIggABIgZAAIgVAAQgJgBgKgCQgLgDgIgFIgHAAIgDAAIgEAAIgMAAIgMgCIgLgCIgKgEIgFgCQgoAAgnACQgeACgZgNQgXgMgCgbQgDgjAhgPQAWgKAZAAQA0ABA0AFIAMACIAGACIAGADIAFAAIAEAAIAFAAIAMABIAMABIALADIAJADIAFACIAaABIAhAAIAagBQANgBAMADQALACAKAFIAFADQAJABAJAEQAMAHAHAKQAGAJACAKQACAJgCALQgCAMgIAJQgHAKgKAGQgGAEgHABIgFABIgFAAg");
	this.shape_4.setTransform(1690.7875,2496.6988);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FF0000").s().p("ACoBLIgFgCIgGgCIgFgCIgEgCIgUAAIgUAAIgSgBIgQgBQgHgBgIgDIgKgEIgjgBIgiABIgpAAIgogCIgTgCIgGgCIgGgDIgGgCQgcAAgbgDQgagDgPgXQgMgSAEgWQADgVARgOQAXgTAdABQAjABAiAFQAKACAIAGIAoAAIAjAAIAnAAQASgBATACQAPACAPAHIAVAAIANAAIAOAAIANABIANABIAMABIAGADIAHACIAGADIAEADIAEADQAOAHAIANQAIALACALQADAQgGAPQgEALgJAJQgJAIgLAGQgLAFgNAAQgIAAgHgCg");
	this.shape_5.setTransform(1757.5634,2505.1474);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FF0000").s().p("AC7BSIgGAAIgLAAIgKgBIgLgBIgLgBIgKgCIgLgEIgEgCIgJAAIgLAAIgNgBIgMgBIgKgBIgKgDIgLgFIghAAIgdAAQgPAAgPgBQgMgCgMgDIgTgEIgUgBIgTAAIgTgBIgRgFIgKgEQgaADgXgLQgWgKgIgWQgHgVAJgVQAIgUAUgJQAVgKAZABQAZAAAXAKIAFABIASAAIAVABIASACIARAEIASAEIAaAAIAZAAIAXAAQAQgBAQAEQALADALAFIALAAIALAAIAMABIAMABIALACIALAEIAFACQAcABAcACQAVACAPARQAOAQAAAWQAAAQgJAPQgKAQgSAHQgQAGgRAAIgJAAg");
	this.shape_6.setTransform(1831.8554,2514.2655);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FF0000").s().p("ACZBZIgKgBIgFgCIgEgCIgFgCIgNAAIgQAAIgLgBIgLgBIgJgDIgLgEIgFgCIgLAAIgRgBIgNgBIgMgDIgLgEIgHgBIgRgBIgSAAIgNgCIgMgDIgKgDIgGgCIgFAAIgGgBIgLgBIgFAAIgGgBIgFgBIgFgCIgGgDIgGgDIgEgBIgFgBIgFgBIgFgBQgUgJgPgRQgNgOgBgTQgBgRAHgPQAGgOANgIQAPgKASAAQASAAAPAJIAEACIAGACIAHACIAFACIAGADIAMABIALABIAGABIAKACIAKAEIAGABIAUAAIASABQAHABAJACIAMADIAMAEIALAAIATABIANACIAMACIAJAEIAFACIAdAAQAPAAAPADQANACALAGQAJAGAGAIQAHAIAEAIIAEAKIABAGIABAHIAAAGQgBAMgFAKIgJANQgGAIgJAFQgKAFgKADIgKABIgGgBg");
	this.shape_7.setTransform(1905.5938,2522.7187);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_8},{t:this.instance_7}]},433).to({state:[{t:this.shape_2}]},13).to({state:[{t:this.shape_3}]},13).to({state:[{t:this.shape_4}]},13).to({state:[{t:this.shape_5}]},12).to({state:[{t:this.shape_6}]},13).to({state:[{t:this.shape_7}]},12).to({state:[]},456).to({state:[]},3978).wait(275));

	// TEXT
	this.instance_9 = new lib.CachedBmp_6();
	this.instance_9.setTransform(877.45,1493.95,0.5,0.5);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(241).to({_off:false},0).to({_off:true},724).wait(4253));

	// BUBBLE
	this.PEW = new lib.SMACKBUBBLE("synched",0);
	this.PEW.name = "PEW";
	this.PEW.setTransform(936.75,1535.85,1.1566,1.1075,0,0,0,105.5,68);
	this.PEW._off = true;

	this.timeline.addTween(cjs.Tween.get(this.PEW).wait(241).to({_off:false},0).to({_off:true},724).wait(4253));

	// CONTROLLER
	this.instance_10 = new lib.CONTROLLER("synched",0);
	this.instance_10.setTransform(1390.15,817.3,1,1,0,0,0,91.4,76.5);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(131).to({_off:false},0).to({_off:true},834).wait(4253));

	// TEXT
	this.instance_11 = new lib.CachedBmp_7();
	this.instance_11.setTransform(1319.85,1044.45,0.5,0.5);
	this.instance_11._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(143).to({_off:false},0).to({_off:true},822).wait(4253));

	// BUBBLE
	this.instance_12 = new lib.CachedBmp_8();
	this.instance_12.setTransform(1228.25,1001.7,0.5,0.5);
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(142).to({_off:false},0).to({_off:true},823).wait(4253));

	// LINE3
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#000000").s().p("AHRI2IgHgBIgHgCIgGgDIgGgEIgCgCIgDgDIgFgFIgEgFIgDgHIgCgHIgBgGIgEgGIgCgFIgDgFIgEgFIgEgFIgFgGIgDgFIgEgGIgEgKIgDgJIgGgGIgMgMIgLgMIgFgFIgFgEIgEgFIgFgGIgDgFIgEgGIgIgFIgHgEIgHgGIgEgFIgEgFIgGgEIgFgFIgDgFIgHgGIgGgGIgHgHIgDgFIgGgEIgGgGIgGgGIgGgEIgGgFIgCgBIgNgCIgKgBIgIgCIgGgDIgGgDIgGgDIgEgEIgqAAIgwABQgSAAgRgCQgWgBgVgIQgOgFgPgEIgmAAIgvABIgiAAQgWAAgVgEQgQgCgNgGIgKgFIgIgCIgmAAIgwAAIgmAAQgYAAgXgCQgLgBgMgDIgIgDIgJgEIgIgEIgHgCIgbAAIggAAIgkAAIgZgCQgRgDgQgIIgHgDIgIgDIgUAAIgUgCIgPgCIgOgEIgMgGIgGgDIgIgCIgSAAIgRgBIgSgCQgNgCgNgEIgSgGIgIgDIgHgBIgGgBIgHgDIgGgDIgFgEIgGgEIgDgGIgFgFIgDgGIgBgHIgCgGIAAgHIAAgHIACgHIACgHIADgGIAEgGIAEgFIAGgEIAFgEIAGgDIAHgDIAHgBIAHgBIAJABIAJABIAJACIAJADIAQAFIARAGIATAAIASABIASACQAMACAKAEIAOAGIAHADIALABIAUABIAUACQALACAKAEIAPAGIAGADQAKACALAAIAkgBIAlAAQATgBATAEQAQAEAPAHIAGAEQAXACAVAAIAzgBQAYABAXgBQAZgBAXAFQAUAEAPAJQAWADAVgBIA6AAIAoAAQAUAAATAGIArAMIAdABIAFAAIgEgCIgHgGIgHgGIgGgFIgFgGIgFgGIgDgGIgQgLIgOgMIgOgMIgMgMQgLgFgUgMIgpgbQgUgNgSgRIgngnIgVgTIgHgEIgIgFIgHgEIgFgFIgGgGIgTgOQgLgIgJgJIgUgTIgNgNIgIgHIgGgDIgGgEIgHgEIgFgFIgFgGIgFgFIgFgEIgGgGIgGgFIgQgMIgPgNIgKgKIgKgNIgKgPIgHgFIgEgEIgDgEIgHgFIgFgEIgHgFIgGgFIgFgFIgFgGIgEgHIgEgGIgHgGIgGgHQgRgKgPgNQgKgJgKgKIgTgUIgOgNIgOgOIgIgEIgHgEIgGgEIgFgFIgEgFIgFgFIgBgCIgEgCIgFgEIgFgGIgIgEIgPgJIgIgDIgIgEIgHgEIgIgDIgHgDIgFABIgHgBIgHAAIgGgBIgHgDIgGgDIgGgEIgFgEIgFgFIgEgGIgCgGIgDgHIgCgHIAAgHIAAgHIACgHIADgGIACgGIAEgGIAFgFIAFgFIAGgEIAGgDIAHgCIAGgCQATgBASACQAQADAQAHIAYALIAaANQAOAIANAJIAFAEIAFAFIAEAFIAAAAIAGAEIAFAGIAFAFQAMAGAKAIIATARIAVAWIANANIAPAOIAHAGIAFAEIAGAEIAIAFIAGAFIAGAGIAGAGIAFAFIAGAEIAEAFIAFAFIADAGIADAGIAFAEIAGADIAIAGIAFAGIAGAGIAGAFIAEAEIAGAFIAEAGIAEAGIADAGIAEAGIAEAFIAFAFIADACIAGADIAGAEIAHAEIAEAFIAFAFIAGAFIAEAEIAHAGIAEAGQAIADAHAGIAUARIAOANIAOAOIAPANIAFAEIAGAEIAHAEIAFAFIAFAEIAGAFQAMAGAKAJIAaAYIAOAOIATATIATASIAOAKIAPAKIAOAJIANAIIAHADIAIADIAMAIIALAJIAOAMIAMALIAGAGIAHAEIAGAFIAGAEIAHAEIAEAEIAFAFIADAGIAEAFIADAFIAAAAIAIAFIAGAFIAHAGIAHAGIAEAFIAFAEIAGAFIAFAGIAJAGIAMAIIAMAKIAMAMIAGAGIAHAGIAGAEIAGAEIAHAEIAGAEIAFAFIAAAAIAaAAIAiAAQANABANAEIAoANIASAAIAOAAIAFAAIATACQAOACAMAEIAOAGIAHAEIACAAIAKABIAJABIAKABIAJACIAJACIAJADIAIAEIAJAEIACABIAIAAIAJABIAQAAIARACIANAEIAHADIAGADIAFADIAFADIAJAAIAKABIAKAAIAKACIAHABIAGADIAOAFIAEADIAEAEIAKAAIAKAAIAKABIAKABIAGACIAIACIANAGIAFADIAEAEIACAAIAHABIAHABIAHACIAFADIAGAEIAGAFIAFAGIAFAHIACAIIACAIIABAIIgBAIIgBAHIgCAHIgEAGIgEAGIgGAGIgFAFIgGADIgHADIgHACIgHABIgDAAIgJgBIgJgBIgJgBIgJgCIgGgCIgHgDIgHgCIgEgEIgFgDIgJgBIgKAAIgJgBIgKgBIgHgCIgHgCIgHgCIgHgDIgFgDIgEgEIgJAAIgKgBIgJgBIgKgBIgHgBIgIgCIgGgDIgGgDIgGgDIgEgEIgIAAIgJAAIgIgBIgRgCIgNgDIgOgFIgGgCIgFgDIgIgCIgJgBIgJgBIgIgBIgJgBIgJgDIgIgDIgQgHIgGgCIgJAAIgMAAIgQgBIAEAGIAFAGIAEAHIAIAGIAEAGIADAEIABABIAFAEIAGAFIADAEIAFAFIAFAFIAFAEIAEAFIAFAGIADAIIADAIIADAJIAFAGIAKAPIAJARIAIARQADAIACAJIACAJIAAAIIgBAIIgCAIIgEAIIgEAGIgEAFIgFAFIgGADIgGADIgGADIgHABIgHABIgHgBg");
	this.shape_8.setTransform(1321.7,779.8969);
	this.shape_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_8).wait(139).to({_off:false},0).to({_off:true},826).wait(4253));

	// LINE2
	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000000").s().p("AKlHGIgIgCIgGgDIgHgEIgGgEIgFgFIgFgHIgDgGIgIgIIgNgNIgMgNIgLgMIgKgNIgIgMIglgmIgpgoIgqgrIgigiIgPgOIgTgTIgIgHIgOgHIgFgDIgHgEIgFgEIgFgFIgHgGIgFgGIgGgHIgDgGIgDgGIgNgJIgHgFIgHgFIgHgFIgHgGIgIgGIgHgGIgHgEIgHgFIgGgEIgGgGIgFgFIgHgFIgIgFIgHgFIgHgFIgGgFIgHgGIgSgHIgQgIIgRgJIgOgIQgLgHgKgJIgMgLIgIgFIgIgEQgWgGgVgJQgWgJgTgLIgkgVQgTgLgTgKIgdgNIgLgFQg3gUg5gOQg0gNgzgTQgsgQgqgVQg1gcg5gQQgxgNgtgXIgJgCIgIgDIgJgBIgKgBIgKAAIgKAAIgIAAIgHgCIgGgCIgGgDIgGgEIgFgFIgFgFIgDgFIgEgHIgCgGIgCgHIAAgHIAAgHIACgHIACgHIAEgGIADgGIAFgFIAFgEIAGgEIAGgDIAGgDIAHgBQBmACBdAtQAVALAVAIQBbAmBdAgQBSAdBSAbQBRAbBJAqQAoAXApARQAcAMAWAWIANAIIAIADIAHAEIAHADIAGAEIAHADIAIAEIAJAEIAMAJIAGAFIAIAGIAEAEIAFADIAIAFIAGAEIAMAKIAEAEIAGADIAFADIAHAFIAHAGIAIAGIAGAHIARALIAQAMIAMAJIAJAKIAEAGIAFAGIADAGQAnAVAfAgIA4A6IAxAyIAyAvQAUAVAPAZIAHAGIAEAFIAEAGIAFAEIAGAEIAEAFIAEAFIAFAFIAFAEIAFAFIAFAHIACAHIADAIIADAHIACAHIAAAGIAAAHIgBAHIgDAHIgDAGIgEAGIgFAFIgFAFIgFAEIgHADIgHACIgGACIgIAAIgHAAgADEAKIABABIgBgBIgCgBIACABg");
	this.shape_9.setTransform(1324.75,736.775);
	this.shape_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_9).wait(135).to({_off:false},0).to({_off:true},830).wait(4253));

	// LINE1
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#000000").s().p("AI+J4IgHgBIgGgDIgHgDIgFgEIgGgFIgEgFIgEgGIgDgHIgFgGIgEgGIgEgGIgDgHIgCgHIgCgGIgBgGIgBgFIgHgIIgGgHIgFgIIgGgIIgDgGIgDgHIgCgHIgCgGIgCgJIgCgHIAAgDIgNgPQgGgIgEgIIgJgPIgHgOIgEgHIgDgFIgDgGIgFgFIgEgFIgEgFIgDgHIgDgHIgDgHIgCgHIgEgFIgEgFIgDgGIgDgHIgDgHIgCgHIgBgHIgBgHIgEgHIgDgGIgDgIIgDgIIgDgIIgGgFIgGgFIgGgHIgFgHIgFgHIgEgHIgDgJIgCgIIgCgIIgEgFIgDgFIgDgFIgDgHIgCgGIgDgHIgEgFIgFgGIgFgIIgGgIIgFgIIgFgGIgFgHIgFgGIgEgGIgFgHIgDgHIgDgHIgEgHIgCgCIgKgNIgLgPIgIgOIgIgPIgEgHIgDgFIgDgFIgFgEIgEgFIgFgGIgFgJIgFgJIgFgIIgFgJQgPgJgNgMIgbgaIgTgUIgUgUIgVgSIgGgEIgHgEIgGgEIgGgFIgFgGIgEgFIgFgEIgGgFIgFgGIgIgGIgIgFIgHgFIgGgFIgGgFIgGgGIgGgFIgVgOQgOgJgNgKIgTgRIgUgTIgVgUIgIgFIgHgEIgGgEIgFgEIgEgGIgEgEIgEgDIACABIgCgCIgBAAIABABIgCgBIgFgFIgCgBIgHgCIgHgBIgHgDIgHgDIgGgEIgIgGIgIgGIgHgGIgHgFIgTgIQgOgFgNgHQgMgHgKgJIgNgKIgNgLIgTgHIgTgIIgRgKIgRgKIgHgCIgHgBIgHgCIgJgCIgIgDIgIgEIgIgEIgIgCIgIgCIgIgBIgIgCIgIgEIgIgDIgIgEIgHgCIgKAAIgJAAIgKAAIgHAAIgHgCIgHgCIgGgDIgGgEIgFgFIgEgFIgEgFIgDgHIgDgGIgBgHIgBgHIABgHIABgHIADgHIADgGIAEgGIAEgFIAFgEIAGgEIAGgDIAHgDIAHgBIAQAAIARgBQAOAAANADIARAFIAOAGIAHAEIAKACIAJACIAKACIAHADIAHADIAGADIAHADIASAEIASAGQAHACAHAEIAOAIIAHAEIAGAEIAHADIAZAKQAMAFAKAHIAUAPIANAKIAOAJIAHAEIAIADIAJADIAIAEIAIADIAGAEIAGAFIAGAEIAGAGIAGAFIAIACIAIACIAHADIAIADIAIAEIAGAFIAGAFIAGAGIAGAFIAGAFIAFAGIAJAFIALAIIAWATIANANIAMAMIANAMIAOAJIAOAKIANAKIAPAMIAHAGIAHAGIAHAFIAGAEIAGADIAGAEIAGAFIAEAFIAFAFIAFAFIAGAFIAFAGQALAFAJAIQAOALANANIAVAVIAVAVIASASIAHAGIAMAJIANAKQAGAFAFAGIAJANIAJAPIAEAHIAEAHIALANIAKAPIAJAPIAIAQIAEAJIABABIAGAHIAHAIIAGAIIAGAIIAEAGIADAGIADAHIAEAIIAFAGIAFAGIAFAGIAFAHIAFAHIAFAIIAFAFIAGAGIAEAGIAEAIIADAJIACAJIAFAFIAEAGIAEAGIACAHIADAKIADAKIAGAFIAGAEIAFAEIAFAGIAEAFIADAGIACAHIADAJIADAJIADAJIADAGIADAHIAEAHIACAHIACAHIABAIIAFAFIAFAHIADAIIADAGIAAADIACAIIACACIAEAEIAEAGIAEAGIADAGIAEAHIAEAIIAIANIACAHIADAGIABABIAGAHIAGAHIAFAHIAGAIIAFAIIADAHIADAIIABAHIACAIIABAFIACAGIAFAHIAGAHIAGAHIAFAHIAEAGIADAHIACAHIACAIIABAHIAGAGIAEAGIADAHIADAIIADAIIABAHIABAHIgBAHIgBAHIgCAGIgDAGIgEAGIgFAFIgFAFIgGAEIgGADIgGADIgHABIgHABIgIgBgAIfGLIACABIgBgCIgCgBIABACgAkImIIACABIgBgBIgCgBIAAAAIABABgAkRmOIACABIgCgBIgBAAIABAAg");
	this.shape_10.setTransform(1318.175,696.3719);
	this.shape_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_10).wait(131).to({_off:false},0).to({_off:true},834).wait(4253));

	// Button
	this.instance_13 = new lib.CachedBmp_9();
	this.instance_13.setTransform(23.5,909,0.5,0.5);

	this.PlayBtn1 = new lib.BUTTON1();
	this.PlayBtn1.name = "PlayBtn1";
	this.PlayBtn1.setTransform(109.5,877.7,1,1,0,0,0,86,31.2);
	new cjs.ButtonHelper(this.PlayBtn1, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.PlayBtn1},{t:this.instance_13}]}).to({state:[]},965).wait(4253));

	// ZAPTEXT
	this.instance_14 = new lib.CachedBmp_10();
	this.instance_14.setTransform(317.95,767.35,0.5,0.5);
	this.instance_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(73).to({_off:false},0).to({_off:true},892).wait(4253));

	// ZAP
	this.ZAP = new lib.SMACKBUBBLE("synched",0);
	this.ZAP.name = "ZAP";
	this.ZAP.setTransform(348.2,804.4,1,1,44.9994,0,0,101.4,65.2);
	this.ZAP.alpha = 0;
	this.ZAP._off = true;

	
	var _tweenStr_0 = cjs.Tween.get(this.ZAP).wait(69).to({_off:false},0).wait(1).to({regX:105.3,regY:68,rotation:44.9996,x:348.95,y:809.1,alpha:0.25},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.75},0).wait(1).to({alpha:1},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1);
	var _tweenStr_1 = _tweenStr_0.to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1);
	this.timeline.addTween(_tweenStr_1.to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(4253));

	// PEWTEXT
	this.instance_15 = new lib.CachedBmp_11();
	this.instance_15.setTransform(505.2,830.35,0.5,0.5);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(65).to({_off:false},0).to({_off:true},900).wait(4253));

	// PEW
	this.PEW_1 = new lib.SMACKBUBBLE("synched",0);
	this.PEW_1.name = "PEW_1";
	this.PEW_1.setTransform(544.45,865.1,0.8656,0.8288,0,0,0,105.2,68);
	this.PEW_1.alpha = 0;
	this.PEW_1._off = true;

	
	var _tweenStr_2 = cjs.Tween.get(this.PEW_1).wait(62).to({_off:false},0).wait(1).to({regX:105.3,x:544.5,y:865.05,alpha:0.3333},0).wait(1).to({alpha:0.6667},0).wait(1).to({alpha:1},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1);
	var _tweenStr_3 = _tweenStr_2.to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1);
	this.timeline.addTween(_tweenStr_3.to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(4253));

	// Blocking
	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FFFFFF").s().p("EhbIFnKQgbAAg1gGQsShOvagPQpRgJygAPQj7ADiCAGQjTAKioAZQhOAMgbACQg7AEgtgMQg1gOgkgpQgngsAEgyQAGhABHgpQA3ggBVgNQDBgfD0gMQCWgHEjgEQSfgPJXAJQPdAPMUBNQA9AGAgAHQAzALAkAVQAqAZAXApQAZAtgKArQgJAmghAcQgeAagpALQghAIgqAAIgEAAgEhcIEprQ7AgpoYgFQz8gMvbAxQhFADgkgCQg5gEgrgTQgygWgcgtQgfgxANgwQAdhpDIgKQJRgfK0gHQIpgGLcAJQQFALQaAhQA7ACAhAHQAyAKAfAaQAlAgAHA0QAHA0gbApQghAzhLASQgtALhHAAIgXgBgECHuElGQhFgEiFgLQiJgMhBgEQh5gGiXAAQhcAAi1AEIqmAQQg2ABgdgDQgugGgfgTQg9gkgEhRQgEhQA5gqQAegWAvgJQAdgFA4gCIFBgLQFKgLClACQBzABCgAHIESAOQN6AoN2gyQBcgFA3ALQBQARAlA0QAeAsgIA5QgJA5gqAhQgfAYgyAJQgfAGg7ACIwhAYQikAEhbAAIgWAAQiBAAhpgGgEB1pDtAQitAAhngMQiXgQhygvQg8gZgkgjQgtgrABgzQAAgtAkgkQAhghAwgMQAngKA0ADQAdACA/AKQE+AwGQABQD3ABHbgXIT4g8QBigEA9AQQBVAWAfA/QAQAhgEAmQgEAmgWAdQggApg/ASQgsALhLADQpuAZthAeQkcAKihAEQjlAGi9AAIgcAAgECijCqnMgyFgAPQh8AAhBgEQhqgHhSgUQhGgRgugmQg4gtAFg5QADgkAbgeQAZgcAlgOQAfgMAqgEQAZgCAyABIbhATQP7AILngHQBIgBApAIQA+AMAjAkQAiAjAEA1QADA1geAnQgjAuhGAQQguALhNAAIgHAAgECjHBkRQnIgMiogDQlegGkSAFIniAMQkaAFjIgLQg2gDlrggQj+gWikADQhMABiAAIQiXAJg1ACQhEACgpgFQg8gHgqgYQgygbgXg0Qgag2AWgwQAXgyBCgWQAwgQBOgCIFPgLQCegFBQAAQCEgCBpAGQBbAFCiASQCxATBMAFQCaALDLgCIFmgIQFXgJGkADQEdACHfAKQA1ABAcADQAsAFAiANQAnAQAcAeQAdAhAEAmQAFAugfAqQgdAmguAUQgnARg1AEQgVACgeAAIgtgBgECBqkGXQglgYgSgsQgTgsAKgrQAKguAlghQAlghAvgEQAugEArAaQAqAZASArQASArgMAxQgMAwgkAeQgjAegyADIgKAAQgsAAgjgWgEiUPkQcQhEgNgkgpQglgqAGg8QAGg9ArgiQAegXAugKQAfgGA3gCQBsgDCDgCIAAjXQFvgEIkAPQMkAVFegGQA4gBAdAEQAvAGAgAUQAzAiAIBEQAHBDgpAsQgiAkg7AOQgoAJhHACQljAIr/gYQo6gSlqAEIAADXQhoABhWADIgjAAQg4AAgigGgEhrRkb7IhNgIQjUgbkNgKQidgFlGgDI8ugMQhFAAgkgEQg6gHgqgVQgxgYgcguQgegxALgxQAJgmAhgeQAfgaApgNQAjgKAugBQAbgBA3ADQGlAWPdAAQOLAAH3AmQBEAFAmAHQA6AMApAZQAvAdAXAzQAYA1gTAvQgNAjgjAXQgfAWgpAIQgYAFgdAAIgYgBgEiCMlYmQghgTgSgfQgSgdgLg8IgShZIiGAAQgFgXgBgWIhagGImJgcIh3gHIAADXQiYgHh6gBQg6gBgYgCQgugDghgMQgpgPgdgcQgfgfgHgmQgJgxAhgvQAfgsAygUQArgSA6gDQAkgCBEAFIDpAPIAAjXIJLAmIBUAFIgLgqIvIgPQg3gBgggFQgvgJgfgXQgrgggIg6QgJg6AggrQAjgvBHgQQAygMBTACMAoOAAoQAxAAAbAEQApAHAdASQAxAfALA/QALA/gkAuQgjAshGAQQgwALhSgCIhMgBQAkANAYAWQArApgBBBQgBBAgsAoQgnAjhEAIQgmAEhUgEQiOgGjXASIllAeQhyAGiQgBQAOBEABAnQABA9gZApQgTAeghASQghASgkAAQgkAAgggTgEiAPlh+IAJArQBoACBYgCQBygDFNgdIB0gJIr+gMIACAKg");
	this.shape_11.setTransform(940.2343,3967.1177);

	this.timeline.addTween(cjs.Tween.get(this.shape_11).to({_off:true},965).wait(4253));

	// ENEMYMAKEAXELMOVE
	this.instance_16 = new lib.ENEMY("synched",0);
	this.instance_16.setTransform(571.2,3028.95,1,1,0,0,0,190.7,218.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_16).to({_off:true},965).wait(4253));

	// FRIENDMAKEAXELMOVE
	this.instance_17 = new lib.FRIEND("synched",0);
	this.instance_17.setTransform(1337.4,3290.45,1,1,0,0,0,224.2,208.7);

	this.instance_18 = new lib.FRAME8("synched",0);
	this.instance_18.setTransform(974.7,3314.55,0.8544,0.8544,0,0,0,720.9,177.5);

	this.instance_19 = new lib.FRAME7("synched",0);
	this.instance_19.setTransform(975.65,2985.4,0.8544,0.8544,0,0,0,721,177.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_19},{t:this.instance_18},{t:this.instance_17}]}).to({state:[]},965).wait(4253));

	// Comic_Background
	this.instance_20 = new lib.FRAME15("synched",0);
	this.instance_20.setTransform(992.95,6491.95,2.3731,2.3731,0,0,0,271.1,88.5);

	this.instance_21 = new lib.FRAME13("synched",0);
	this.instance_21.setTransform(992.3,5303.65,0.9098,0.9098,0,0,0,679.5,254.9);

	this.instance_22 = new lib.FRAME18("synched",0);
	this.instance_22.setTransform(749.2,6052.3,0.9169,0.9847,0,0,0,959.9,199.3);

	this.instance_23 = new lib.FRAME19("synched",0);
	this.instance_23.setTransform(999.95,6984.3,0.9437,1,0,0,0,679.4,222.2);

	this.instance_24 = new lib.LASTFRAME("synched",0);
	this.instance_24.setTransform(1002,7977.95,1,1,0,0,0,584.2,191);

	this.instance_25 = new lib.FRAME10("synched",0);
	this.instance_25.setTransform(985.1,3812.8,0.8708,0.8708,0,0,0,695.3,360.8);

	this.instance_26 = new lib.FRAME11("synched",0);
	this.instance_26.setTransform(985.25,4312.2,0.8708,0.8708,0,0,0,695.5,284.8);

	this.instance_27 = new lib.EXPLO("synched",0);
	this.instance_27.setTransform(1340.4,4816.25,1,1,0,0,0,959.9,226);

	this.instance_28 = new lib.FRAME14("synched",0);
	this.instance_28.setTransform(1349.95,5645.8,0.9141,0.9141,0,0,0,1067.6,198.8);

	this.instance_29 = new lib.ORISUT("synched",0);
	this.instance_29.setTransform(1004,7596.8,1,1,0,0,0,586.2,344.2);

	this.instance_30 = new lib.FRAME6("synched",0);
	this.instance_30.setTransform(971.85,2481.65,0.8725,0.8725,0,0,0,713.2,377.1);

	this.instance_31 = new lib.FRAME5("synched",0);
	this.instance_31.setTransform(683.65,1908.3,0.9668,0.9668,0,0,0,1010.1,232.2);

	this.instance_32 = new lib.FRAME3("synched",0);
	this.instance_32.setTransform(971.7,1413.3,0.9906,1,0,0,0,753.2,241.8);

	this.instance_33 = new lib.FRAME2("synched",0);
	this.instance_33.setTransform(969,879.3,2.733,2.733,0,0,0,272,102.2);

	this.instance_34 = new lib.FRAME1("synched",0);
	this.instance_34.setTransform(966.75,295.85,2.7339,2.6543,0,0,0,271.1,102.2);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f().s("#FFFFFF").ss(1,1,1).p("EgTOgsnIFVAAEgJhgp2IH2htEgJhgp2In1BsIAAAuEALQgqqIH/AAEgJhgp2IRDAAEgRWArfIAABJ");
	this.shape_12.setTransform(808.125,878.775);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FFFFFF").s().p("EgSbAg2IgHgCIgHgCIgGgDIgGgEIgFgFIgEgFIgEgFIgDgHIgCgGIgCgHIgBgHQAAkTACkSQACkTgMkTQgMkWgXkVQgYkWgBkVQgCkUAAkTQAAkRADkRIgzAAQg8jugdiTIgVhpQgNg8gNgtQgOgwgDgNQgIgjADgbQAHg7A1gmQA0gmA6ANQAoAJAiAgQAfAdATApQAQAjALAvQAGAaAJA8IACAKIB7AAIAVBTIETQoQAQA/ADAiQADA3gTAnQgUAngpAVQgqAVgrgIQgngHgjgeQgfgbgUgoQgMgXgJgdIgFgFIgDgGIgEgGIgCgHIgBgHIgBgHIAAgKIgBgKQgmhugKhzIgCgYQgiiYg0jFQgCDbAADaIAAIwQgBEOAVEPQAUEKAPEKQAREYgBEYIgBJUIAAAnIgCAHIgCAGIgDAHIgEAFIgFAFIgFAFIgGAEIgGADIgGACIgHABIgHABIgHAAgAcLYGQgYgJgxgYQmujZnfhfQnfhfngAkQg6AEgagBQgvgDghgRQgfgQgVgfQgUgegEgjQgEgjANgiQAOgiAbgXQAfgaAwgLQAhgIA4gDQIHgeIABmQIEBmHQDkQA5AcAeAXQAtAiAQApQAYA9gnA/QgnA+hBAFIgLAAQgeAAgkgMgA9RnKQgjgTgUghQgUgjgJhBQgHg4gEhCQgGgHgFgIQgagrgChSQgChSAKhlQAFg+ARh4IASiLQAMhRAGglIAEgTIACgSIANh9QAHhIgBg1IAAgbIFeAAQgLAigLA0IgbB7QAbAEAXANQAgARATAgQAUAgABAkQABAmgWAzIgpBVQgFAOgGAUIhfAAQgJCcgFC+QgDB4AHA8IANBtQADA+gVApQgRAjgiAVQgiAWgmABIgGAAQgjAAghgSg");
	this.shape_13.setTransform(253.3321,1864.6938);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#000000").s().p("EAoWAp7QgqgCgkgeQgigcgSgqQgQgkgGgxQgDgegCg5QgGj6gBk5QAAi7ABl4IACiAIAChPIAAgGQAEhwALhZQAOhuA/kcQA4j4AJiTIACg6IgJAAQgHhJgWi0QhesAgar7QgHjGABiMQACiLAJh5IAIhOQAFgzAHgfQAKgsASghQAWgmAigXQAlgZAnABQAxACAoApQAkAlAMA1QAKAsgEA6IgLBXIgCAPQgRB/gDCaQgCBvAGCrQAZLaBZLUIAQCIIAXAAQALCWgGB3QgICUgsDgQhAFEgHAuQgSB1gLCGQgDAqgCArQgEA/gCBCQgFCcADE4QABDGADBrQAFCpALCIQAGBIAAAeQAAA5gOAqQgQAzgoAiQgoAjgtAAIgFAAgEgqBApgIgTgCQgrgJgdgeQgZgagNgqQgJgdgHgyQgxlfAYoyQAMj8AGiUIADg7IABgaQAKj6gFi2QgDiXgYlmIgHhrIgLAAQgFhqAAhPQAAirARkKQAYl0ADhAQAHiaACjAQABh0gBjnIgEqyQAAg+AGgiQAJg0AagiQAmgvBBgDIAGAAQBHgBAoAxQAcAhAJA3QAGAiAABBIgCOcQgBFSgHCpQgDBMgVFIQgQDsgBCZIAEAAQAGCiAPDfQAbGOABC8QABB9gHCmIgEBVIgBAKIgVGCQgWHVAoEsIALBaQAFAzgGAnQgHAwgYAlQgaAqgnASQgaALgbAAIgJAAg");
	this.shape_14.setTransform(965.9809,891.4782);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31},{t:this.instance_30},{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20}]}).to({state:[]},965).wait(4253));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,2326.1,8169.3);
// library properties:
lib.properties = {
	id: '7558792BD097B24FB12B93F5E283F08A',
	width: 1920,
	height: 8192,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_57.png?1725646836249", id:"CachedBmp_57"},
		{src:"images/CachedBmp_146.png?1725646836249", id:"CachedBmp_146"},
		{src:"images/CachedBmp_144.png?1725646836249", id:"CachedBmp_144"},
		{src:"images/CachedBmp_143.png?1725646836249", id:"CachedBmp_143"},
		{src:"images/CachedBmp_42.png?1725646836249", id:"CachedBmp_42"},
		{src:"images/CachedBmp_142.png?1725646836249", id:"CachedBmp_142"},
		{src:"images/CachedBmp_141.png?1725646836249", id:"CachedBmp_141"},
		{src:"images/CachedBmp_36.png?1725646836249", id:"CachedBmp_36"},
		{src:"images/CachedBmp_34.png?1725646836249", id:"CachedBmp_34"},
		{src:"images/CachedBmp_33.png?1725646836249", id:"CachedBmp_33"},
		{src:"images/CachedBmp_140.png?1725646836249", id:"CachedBmp_140"},
		{src:"images/CachedBmp_29.png?1725646836249", id:"CachedBmp_29"},
		{src:"images/CachedBmp_25.png?1725646836249", id:"CachedBmp_25"},
		{src:"images/CachedBmp_15.png?1725646836249", id:"CachedBmp_15"},
		{src:"images/Michael Todd u23540223 Project 3_atlas_1.png?1725646836071", id:"Michael Todd u23540223 Project 3_atlas_1"},
		{src:"images/Michael Todd u23540223 Project 3_atlas_2.png?1725646836071", id:"Michael Todd u23540223 Project 3_atlas_2"},
		{src:"images/Michael Todd u23540223 Project 3_atlas_3.png?1725646836071", id:"Michael Todd u23540223 Project 3_atlas_3"},
		{src:"images/Michael Todd u23540223 Project 3_atlas_4.png?1725646836071", id:"Michael Todd u23540223 Project 3_atlas_4"},
		{src:"sounds/CLANKAUDIO.mp3?1725646836249", id:"CLANKAUDIO"},
		{src:"sounds/CLAPSLAP.mp3?1725646836249", id:"CLAPSLAP"},
		{src:"sounds/FALLING.mp3?1725646836249", id:"FALLING"},
		{src:"sounds/PEWAUDIO.mp3?1725646836249", id:"PEWAUDIO"},
		{src:"sounds/SHOOTINGAUDIO.mp3?1725646836249", id:"SHOOTINGAUDIO"},
		{src:"sounds/smack80173wav.mp3?1725646836249", id:"smack80173wav"},
		{src:"sounds/SNORE.mp3?1725646836249", id:"SNORE"},
		{src:"sounds/ZAPAUDIO.mp3?1725646836249", id:"ZAPAUDIO"}
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
an.compositions['7558792BD097B24FB12B93F5E283F08A'] = {
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