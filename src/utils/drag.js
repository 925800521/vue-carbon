export default class Drag {
  constructor (element) {
    this.slider = element
    this.startPos = {}
    this.endPos = {}
    this.starts = []
    this.drags = []
    this.ends = []

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch) {
      this.slider.addEventListener('touchstart', this, false)
    } else {
      this.slider.addEventListener('mousedown', this, false)
    }
  }

  handleEvent (event) {
    switch (event.type) {
      case 'touchstart':
        this.touchStart(event)
        break
      case 'touchmove':
        this.touchMove(event)
        break
      case 'touchend':
        this.touchEnd(event)
        break
      case 'mousedown':
        this.mouseStart(event)
        break
      case 'mousemove':
        this.mouseMove(event)
        break
      case 'mouseup':
        this.mouseEnd(event)
        break
    }
  }

  touchStart (event) {
    let touch = event.touches[0]
    this.startPos = { // 取第一个touch的坐标值
      x: touch.pageX,
      y: touch.pageY,
      time: new Date().getTime()
    }
    this.endPos = {}
    this.slider.addEventListener('touchmove', this, false)
    this.slider.addEventListener('touchend', this, false)
    this.starts.map((func) => {
      func.call(this, this.startPos, event)
    })
  }

  touchMove (event) {
    if (event.touches.length > 1 || event.scale && event.scale !== 1) return
    let touch = event.touches[0]
    this.endPos = {
      x: touch.pageX - this.startPos.x,
      y: touch.pageY - this.startPos.y,
      time: new Date().getTime() - this.startPos.time
    }
    this.drags.map((func) => {
      func.call(this, this.endPos, event)
    })
  }

  touchEnd (event) {
    this.endPos.time = new Date().getTime() - this.startPos.time

    this.slider.removeEventListener('touchmove', this, false)
    this.slider.removeEventListener('touchend', this, false)
    this.ends.map((func) => {
      func.call(this, this.endPos, event)
    })
  }

  mouseStart (event) {
    this.startPos = {
      x: event.clientX,
      y: event.clientY,
      time: new Date().getTime()
    }
    this.slider.addEventListener('mousemove', this, false)
    this.slider.addEventListener('mouseup', this, false)
    this.starts.map((func) => {
      func.call(this, this.startPos, event)
    })
  }

  mouseMove (event) {
    this.endPos = {
      x: event.clientX - this.startPos.x,
      y: event.clientY - this.startPos.y
    }

    this.drags.map((func) => {
      func.call(this, this.endPos, event)
    })
  }

  mouseEnd (event) {
    this.slider.removeEventListener('mousemove', this, false)
    this.slider.removeEventListener('mouseup', this, false)

    this.endPos.time = new Date().getTime() - this.startPos.time

    this.ends.map((func) => {
      func.call(this, this.endPos, event)
    })
  }

  start (fun) {
    this.starts.push(fun)
    return this
  }

  end (fun) {
    this.ends.push(fun)
    return this
  }

  drag (fun) {
    this.drags.push(fun)
    return this
  }
}
