export class Signature {
  constructor(container_element, options) {
    if (!container_element instanceof HTMLElement) {
      return console.error("未检测到dom元素");
    }
    //清空父元素内容
    this.container_element = container_element;
    container_element.innerHTML = "";
    //默认属性
    this.container_rect = container_element.getBoundingClientRect();
    this.options = Object.assign(
      {
        width: this.container_rect.width,
        height: this.container_rect.height,
        strokeStyle: "black",
        // strokeStyle: "rgba(0,0,0,0.3)",
        lineWidth: this.container_rect.width / 60,
      },
      options
    );

    //创建canvas元素并插入父元素
    this.element = document.createElement("canvas");
    this.element.width = this.options.width;
    this.element.height = this.options.height;

    container_element.appendChild(this.element);

    this.ctx = this.element.getContext("2d");
    //设置绘制线条样式
    this.ctx.strokeStyle = this.options.strokeStyle;
    this.ctx.lineWidth = this.options.lineWidth;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";

    this.element.addEventListener(
      "touchstart",
      this._touchstartCallback.bind(this)
    );
    this.element.addEventListener(
      "touchmove",
      this._touchmoveCallback.bind(this)
    );
    this.element.addEventListener(
      "touchend",
      this._touchendCallback.bind(this)
    );

    this.points = []; //用于保存点位数组
  }

  //外部方法
  destroy() {
    this.element.remove();
  }

  getImage() {
    var imgData = this.ctx.getImageData(
      0,
      0,
      this.element.width,
      this.element.height
    );
    var imgData2 = this.ctx.getImageData(
      0,
      0,
      this.element.width,
      this.element.height
    );
    // 反转颜色
    for (var i = 0; i < imgData.data.length; i += 4) {
      if(imgData.data[i + 3] > 0){
        imgData.data[i] = 255;
        imgData.data[i + 1] = 255 ;
        imgData.data[i + 2] = 255;
        imgData.data[i + 3] = 255;
      }

    }
    this.ctx.putImageData(imgData, 0, 0);
    var t = this.element.toDataURL("image/png");
    this.ctx.putImageData(imgData2, 0, 0);

    return t;
  }
  reset() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }
  }

  //内部方法
  _touchstartCallback(e) {
    this.points = [];
    this.points.push({
      x: e.touches[0].clientX - this.container_rect.left,
      y: e.touches[0].clientY - this.container_rect.top,
    });
    this.isDrawing = true;
  }
  _touchmoveCallback(e) {
    var touchElement = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    );
    if (!touchElement) return;
    if (touchElement.tagName != "CANVAS") return (this.isDrawing = false);

    if (this.isDrawing) {
      this._draw(
        e.touches[0].clientX - this.container_rect.left,
        e.touches[0].clientY - this.container_rect.top
      );
    }
  }
  _touchendCallback(e) {
    this.isDrawing = false;
  }
  _draw(mousex, mousey) {
    this.points.push({ x: mousex, y: mousey });
    this.ctx.beginPath();
    let x =
        (this.points[this.points.length - 2].x +
          this.points[this.points.length - 1].x) /
        2,
      y =
        (this.points[this.points.length - 2].y +
          this.points[this.points.length - 1].y) /
        2;
    if (this.points.length == 2) {
      this.ctx.moveTo(
        this.points[this.points.length - 2].x,
        this.points[this.points.length - 2].y
      );
      this.ctx.lineTo(x, y);
    } else {
      let lastX =
          (this.points[this.points.length - 3].x +
            this.points[this.points.length - 2].x) /
          2,
        lastY =
          (this.points[this.points.length - 3].y +
            this.points[this.points.length - 2].y) /
          2;
      this.ctx.moveTo(lastX, lastY);
      this.ctx.quadraticCurveTo(
        this.points[this.points.length - 2].x,
        this.points[this.points.length - 2].y,
        x,
        y
      );
      this.ctx.stroke();
    }
  }
}
