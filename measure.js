window.measureSpeed = (function() {
  measureSpeed.prototype.measureAttempts = 15;

  measureSpeed.prototype.testFileSrc = "http://test.host.net.nim579.ru/gen.gif";

  measureSpeed.prototype.testFileLength = 1048576;

  function measureSpeed(done, process) {
    var attempts, average, measureProcess, measurements;
    measureProcess = new $.Deferred();
    measurements = [];
    attempts = 0;
    average = {
      mbps: 0,
      mbs: 0,
      bs: 0,
      delta: 0
    };
    measureProcess.progress((function(_this) {
      return function(data) {
        var field, measurementsSumm, speed;
        attempts++;
        speed = {
          delta: data.delta,
          bs: data.bs,
          mbps: data.bs / (1024 * 1024),
          mbs: (data.bs / (1024 * 1024)) * 8
        };
        measurements.push(speed);
        if (attempts <= 1) {
          average = _.extend({}, speed);
        } else {
          measurementsSumm = _.reduce(measurements, function(measurement, summ) {
            var newSumm;
            newSumm = {
              delta: summ.delta + measurement.delta,
              bs: summ.bs + measurement.bs,
              mbps: summ.mbps + measurement.mbps,
              mbs: summ.mbs + measurement.mbs
            };
            return newSumm;
          });
          for (field in measurementsSumm) {
            average[field] = measurementsSumm[field] / attempts;
          }
        }
        if (typeof process === "function") {
          process({
            speed: speed,
            average: average,
            attempts: attempts,
            attemptsPercent: attempts / _this.measureAttempts
          });
        }
        if (attempts >= _this.measureAttempts) {
          return measureProcess.resolve({
            speed: measurements,
            average: average
          });
        } else {
          return _this.measureSpeed(measureProcess);
        }
      };
    })(this));
    measureProcess.done(function(speedResults) {
      return typeof done === "function" ? done(speedResults) : void 0;
    });
    this.measureSpeed(measureProcess);
    return measureProcess;
  }

  measureSpeed.prototype.measureSpeed = function(deferr) {
    var startTime, testImg;
    testImg = new Image();
    startTime = new Date();
    testImg.onload = (function(_this) {
      return function() {
        var delta, speed;
        delta = new Date() - startTime;
        speed = _this.getSpeed(_this.testFileLength, delta);
        return deferr.notify({
          bs: speed,
          delta: delta
        });
      };
    })(this);
    return testImg.src = this.testFileSrc + '?_=' + Math.random();
  };

  measureSpeed.prototype.getSpeed = function(size, time) {
    var speed;
    time = time / 1000;
    speed = size / time;
    return speed;
  };

  return measureSpeed;

})();