function generateCanvas(option) {
  option = Object.assign(
    {
      canvasElement: null, //canvas元素
      width: 0, //canvas宽度
      height: 0, //canvas高度
      ballNameList: [], //球名称数组
      beakerElement: null, //烧杯元素
      callbackInBeaker: null, //球进入烧杯回调
      speed: 2, //球移动速度
      r: 60, //球半径
      admitClose: false, //是否允许双击消除球
      callbackAfterClose: null, //消除球回调
    },
    option
  );
  var canvas = option.canvasElement;
  canvas.width = option.width;
  canvas.height = option.height;
  canvas.addEventListener("touchstart", touchstart);
  canvas.addEventListener("touchend", touchend);
  canvas.addEventListener("touchcancel", touchend);
  canvas.addEventListener("touchmove", touchmove);
  var ctx = canvas.getContext("2d");

  if (option.admitClose) {
    var closeImg = new Image();
    closeImg.src = "./img/close.png";
  }

  var ballList = [];
  option.ballNameList.forEach((item) => {
    addBall(item);
  });

  function addBall(ballName) {
    var image = new Image();
    image.src = `./img/ball/${ballName}.png`;
    ballList.push({
      name: ballName,
      image,
      r: (1 + Math.random() / 2) * option.r,
      left: Math.random() * (option.width - 1.5 * 2 * option.r),
      top: Math.random() * (option.height - 1.5 * 2 * option.r),
      speed: (1 + Math.random() / 4) * option.speed,
      direction: Math.random() * 360,
      status: 0, //0 自由运动 1被拉取状态 2进了碗里 3 可删除
    });
  }

  requestAnimationFrame(draw);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ballList.forEach((ball) => {
      if (ball.status == 2) return; //不画已经进入烧杯的球
      if (ball.status == 0) {
        ball.left += Math.cos((ball.direction / 180) * Math.PI) * ball.speed;
        ball.top += Math.sin((ball.direction / 180) * Math.PI) * ball.speed;
        handleBoundary(ball);
        handleCollide(ball);
      }
      if (ball.status == 3) {
        ctx.drawImage(closeImg, ball.left + ball.r * 2 - 10, ball.top, 20, 20);
      }
      ctx.drawImage(ball.image, ball.left, ball.top, ball.r * 2, ball.r * 2);
    });
    requestAnimationFrame(draw);
  }
  function handleBoundary(ball) {
    if (ball.left + ball.r * 2 > canvas.width) {
      // console.log("右侧碰撞", ball.direction)
      ball.direction = 180 - ball.direction;
    }
    if (ball.left < 0) {
      // console.log("左侧碰撞", ball.direction)
      ball.direction = 180 - ball.direction;
    }
    if (ball.top < 0) {
      // console.log("上侧碰撞", ball.direction)
      ball.direction = 360 - ball.direction;
    }
    if (ball.top + ball.r * 2 > canvas.height) {
      // console.log("下侧碰撞", ball.direction)
      ball.direction = 360 - ball.direction;
    }
  }
  function handleCollide(ball) {}

  function touchstart(event) {
    if (event.touches.length > 1) return;
    if (option.admitClose) {
      var x = event.touches[0].pageX - canvas.getBoundingClientRect().left;
      var y = event.touches[0].pageY - canvas.getBoundingClientRect().top;

      var touchedBall = getTouchedBall(x, y);

      if (touchedBall.status == 0) {
        touchedBall.status = 3;
        setTimeout(() => {
          if (touchedBall.status == 3) {
            touchedBall.status = 0;
          }
        }, 2000);
      } else if (touchedBall.status == 3) {
        touchedBall.status = 2;
        option.callbackAfterClose && option.callbackAfterClose(touchedBall);
      }
    } else {
      if (!option.beakerElement) return;
      var x = event.touches[0].pageX - canvas.getBoundingClientRect().left;
      var y = event.touches[0].pageY - canvas.getBoundingClientRect().top;
      var touchedBall = getTouchedBall(x, y);
      if (!touchedBall) return;
      console.log("touchedBall", touchedBall);
      if (touchedBall.status == 0) {
        touchedBall.status = 1;
      }
    }
  }

  function getTouchedBall(x, y) {
    var touchBalls = ballList.filter((ball) => {
      return (
        ball.left < x &&
        ball.left + ball.r * 2 > x &&
        ball.top < y &&
        ball.top + ball.r * 2 > y
      );
    });
    if (touchBalls.length) {
      return touchBalls[touchBalls.length - 1];
    } else {
      return false;
    }
  }

  function touchend(event) {
    if (!option.beakerElement) return;

    ballList.forEach((ball) => {
      //判断是不是出了边界
      if (ball.left + ball.r * 2 > canvas.width) {
        ball.left = canvas.width - ball.r * 2.5;
      }
      if (ball.left < 0) {
        ball.left = ball.r;
      }
      if (ball.top < 0) {
        ball.top = ball.r;
      }
      if (ball.top + ball.r * 2 > canvas.height) {
        ball.top = canvas.height - ball.r * 2.5;
      }
      //判断是否进了烧杯
      if (ball.status == 1) {
        if (checkBeaker(event, ball)) {
          console.log("在烧杯里");
          ball.status = 2;
          option.callbackInBeaker && option.callbackInBeaker(ball, ballList);
        } else {
          console.log("不在烧杯里");
          ball.status = 0;
        }
      }
    });
  }

  function touchmove(event) {
    if (!option.beakerElement) return;
    if (event.touches.length > 1) return;
    var x = event.touches[0].pageX - canvas.getBoundingClientRect().left;
    var y = event.touches[0].pageY - canvas.getBoundingClientRect().top;
    var ball = ballList.find((ball) => ball.status == 1);
    if (ball) {
      ball.left = x - ball.r;
      ball.top = y - ball.r;
    }
  }

  //判断是否在烧杯里
  function checkBeaker(event, ball) {
    var beakerRect = option.beakerElement.getBoundingClientRect();

    var x = event.changedTouches[0].pageX - beakerRect.x;
    var y = event.changedTouches[0].pageY - beakerRect.y;
    if (x > 0 && x < beakerRect.width && y > 0 && y < beakerRect.height) {
      return true;
    } else {
      return false;
    }
  }

  return {
    addBall,
    ballList,
  };
}
