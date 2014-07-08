BoxView = (function(_super) {
  __extends(BoxView, _super);

  function BoxView() {
    this.drag = __bind(this.drag, this);
    this.stopDrag = __bind(this.stopDrag, this);
    return BoxView.__super__.constructor.apply(this, arguments);
  }

  BoxView.prototype.el = "#box3";

  BoxView.prototype.events = {
    "mousedown": "startDrag"
  };

  BoxView.prototype.startDrag = function(e) {
    if (this.isDragging) {
      return;
    }
    this.$el.removeClass("animate spin");
    this.isDragging = true;
    this.dragStartPos = {
      x: e.clientX,
      y: e.clientY
    };
    this.boxStartPos = {
      x: this.$el.offset().left + this.$el.width() / 2,
      y: this.$el.offset().top + this.$el.height() / 2
    };
    this.grabOffset = {
      x: e.offsetX - this.$el.width() / 2,
      y: e.offsetY - this.$el.height() / 2
    };
    this.grabDistance = Math.sqrt(Math.pow(this.grabOffset.x, 2) + Math.pow(this.grabOffset.y, 2));
    this.$el.css("transform-origin", "" + e.offsetX + "px " + e.offsetY + "px");
    this.dragOffset = null;
    $(document).on({
      "mousemove.boxdrag": this.drag,
      "mouseup.boxdrag": this.stopDrag
    });
    return $("body").addClass("dragging");
  };

  BoxView.prototype.stopDrag = function(e) {
    var bounce, correction, cos, deg, sin;
    if (!this.isDragging) {
      return;
    }
    this.isDragging = false;
    if (this.dragOffset) {
      cos = Math.cos(this.dragAngle);
      sin = Math.sin(this.dragAngle);
      correction = {
        x: this.grabOffset.x - (this.grabOffset.x * cos - this.grabOffset.y * sin),
        y: this.grabOffset.y - (this.grabOffset.x * sin + this.grabOffset.y * cos)
      };
      this.$el.css("transform-origin", "");
      this.$el.css("transform", "translate(" + (this.dragOffset.x + correction.x) + "px, " + (this.dragOffset.y + correction.y) + "px)\nrotate(" + this.dragAngle + "rad)");
      deg = this.dragAngle / Math.PI * 180;
      if (__modulo(deg, 90) > 45) {
        deg += 90 - __modulo(deg, 90);
      } else {
        deg -= __modulo(deg, 90);
      }
      bounce = new Bounce();
      bounce.translate({
        stiffness: 1.5,
        from: {
          x: this.dragOffset.x + correction.x,
          y: this.dragOffset.y + correction.y
        },
        to: {
          x: 0,
          y: 0
        }
      }).rotate({
        stiffness: 0.5,
        from: this.dragAngle / Math.PI * 180,
        to: deg
      });
      window.App.playAnimation({
        bounceObject: bounce,
        duration: 600,
        updateURL: false
      });
      _.defer((function(_this) {
        return function() {
          return _this.$el.css("transform", "");
        };
      })(this));
      setTimeout(((function(_this) {
        return function() {
          return _this.$el.removeClass("animate");
        };
      })(this)), 610);
    }
    $(document).off(".boxdrag");
    return $("body").removeClass("dragging");
  };

  BoxView.prototype.drag = function(e) {
    var angle, centerDelta, centerDistance, dampenedDistance, delta, determinant, distance, dotProduct;
    delta = {
      x: e.clientX - this.dragStartPos.x,
      y: e.clientY - this.dragStartPos.y
    };
    distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
    dampenedDistance = 250 * (1 - Math.pow(Math.E, -0.002 * distance));
    angle = Math.atan2(delta.y, delta.x);
    if (this.grabDistance > 10) {
      centerDelta = {
        x: e.clientX - this.boxStartPos.x,
        y: e.clientY - this.boxStartPos.y
      };
      centerDistance = Math.sqrt(Math.pow(centerDelta.x, 2) + Math.pow(centerDelta.y, 2));
      dotProduct = centerDelta.x * this.grabOffset.x + centerDelta.y * this.grabOffset.y;
      determinant = centerDelta.x * this.grabOffset.y - centerDelta.y * this.grabOffset.x;
      this.dragAngle = -Math.atan2(determinant, dotProduct);
    } else {
      this.dragAngle = 0;
    }
    this.dragOffset = {
      x: Math.round(Math.cos(angle) * dampenedDistance),
      y: Math.round(Math.sin(angle) * dampenedDistance)
    };
    return this.$el.css("transform", "translate(" + (Math.round(this.dragOffset.x)) + "px, " + (Math.round(this.dragOffset.y)) + "px)\nrotate(" + (this.dragAngle.toPrecision(2)) + "rad)");
  };

  return BoxView;

})(BaseView);