  Bounce.FPS = 60;

  Bounce.counter = 1;

  Bounce.prototype.components = null;

  Bounce.prototype.duration = 0;

  function Bounce() {
    this.components = [];
  }

  Bounce.prototype.translate = function(options) {
    return this.addComponent(new ComponentClasses["translate"](options));
  };

  Bounce.prototype.addComponent = function(component) {
    this.components.push(component);
    this.updateDuration();
    return this;
  };

  Bounce.prototype.serialize = function() {
    var component, serialized, _i, _len, _ref;
    serialized = [];
    _ref = this.components;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      component = _ref[_i];
      serialized.push(component.serialize());
    }
    return serialized;
  };

  Bounce.prototype.deserialize = function(serialized) {
    var options, _i, _len;
    for (_i = 0, _len = serialized.length; _i < _len; _i++) {
      options = serialized[_i];
      this.addComponent(new ComponentClasses[options.type](options));
    }
    return this;
  };

  Bounce.prototype.updateDuration = function() {
    return this.duration = this.components.map(function(component) {
      return component.duration + component.delay;
    }).reduce(function(a, b) {
      return Math.max(a, b);
    });
  };

  Bounce.prototype.define = function(name) {
    this.name = name || Bounce.generateName();
    this.styleElement = document.createElement("style");
    this.styleElement.innerHTML = this.getKeyframeCSS({
      name: this.name,
      prefix: true
    });
    document.body.appendChild(this.styleElement);
    return this;
  };

  Bounce.prototype.remove = function() {
    var _ref;
    return (_ref = this.styleElement) != null ? _ref.remove() : void 0;
  };

  Bounce.prototype.getPrefixes = function(force) {
    var prefixes, style;
    prefixes = {
      transform: [""],
      animation: [""]
    };
    style = document.createElement("dummy").style;
    if (force || (!("transform" in style) && "webkitTransform" in style)) {
      prefixes.transform = ["-webkit-", ""];
    }
    if (force || (!("animation" in style) && "webkitAnimation" in style)) {
      prefixes.animation = ["-webkit-", ""];
    }
    return prefixes;
  };

  Bounce.prototype.getKeyframeCSS = function(options) {
    var animations, key, keyframeList, keyframes, matrix, prefix, prefixes, transformString, transforms, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    this.name = options.name || Bounce.generateName();
    prefixes = {
      transform: [""],
      animation: [""]
    };
    if (options.prefix || options.forcePrefix) {
      prefixes = this.getPrefixes(options.forcePrefix);
    }
    keyframeList = [];
    keyframes = this.getKeyframes();
    _ref = this.keys;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      matrix = keyframes[key];
      transformString = "matrix3d" + matrix;
      transforms = [];
      _ref1 = prefixes.transform;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        prefix = _ref1[_j];
        transforms.push("" + prefix + "transform: " + transformString + ";");
      }
      keyframeList.push("" + (Math.round(key * 100 * 1e6) / 1e6) + "% { " + (transforms.join(" ")) + " }");
    }
    animations = [];
    _ref2 = prefixes.animation;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      prefix = _ref2[_k];
      animations.push("@" + prefix + "keyframes " + this.name + " { \n  " + (keyframeList.join("\n  ")) + " \n}");
    }
    return animations.join("\n\n");
  };

  Bounce.prototype.getKeyframes = function() {
    var component, currentTime, frames, i, key, keyframes, matrix, ratio, _i, _j, _k, _len, _len1, _ref, _ref1;
    frames = Math.round((this.duration / 1000) * Bounce.FPS);
    this.keys = [];
    for (i = _i = 0; 0 <= frames ? _i <= frames : _i >= frames; i = 0 <= frames ? ++_i : --_i) {
      this.keys.push(i / frames);
    }
    keyframes = {};
    _ref = this.keys;
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      key = _ref[_j];
      matrix = new Matrix4D().identity();
      _ref1 = this.components;
      for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
        component = _ref1[_k];
        currentTime = key * this.duration;
        if ((component.delay - currentTime) > 1e-8) {
          continue;
        }
        ratio = (key - component.delay / this.duration) / (component.duration / this.duration);
        matrix.multiply(component.getEasedMatrix(ratio));
      }
      keyframes[key] = matrix.transpose().toFixed(5);
    }
    return keyframes;
  };

  Bounce.generateName = function() {
    return "animation-" + (Bounce.counter++);
  };

  Bounce.isSupported = function() {
    var property, propertyIsSupported, propertyList, propertyLists, style, _i, _j, _len, _len1;
    style = document.createElement("dummy").style;
    propertyLists = [["transform", "webkitTransform"], ["animation", "webkitAnimation"]];
    for (_i = 0, _len = propertyLists.length; _i < _len; _i++) {
      propertyList = propertyLists[_i];
      propertyIsSupported = false;
      for (_j = 0, _len1 = propertyList.length; _j < _len1; _j++) {
        property = propertyList[_j];
        propertyIsSupported || (propertyIsSupported = property in style);
      }
      if (!propertyIsSupported) {
        return false;
      }
    }
    return true;
  };

  Bounce.prototype._unique = function(list) {
    var seen;
    seen = {};
    return list.filter(function(i) {
      var isUnique;
      isUnique = !seen[i];
      seen[i] = true;
      return isUnique;
    });
  };
