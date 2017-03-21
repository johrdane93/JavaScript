var c = document.getElementById('c'),
    ctx = c.getContext('2d'),
    dots,
    area = {},
    s = {
        count: 170,
        size: 3,
        velocity: 6,
        distance: 100
    };

function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    area.x = .5*c.width;
    area.y = .5*c.height;

    dots = [];
    for (var i = 0; i < s.count; i++) {
        dotInit();
    }
}
resize();
window.addEventListener("resize", resize);

var gui = new dat.GUI();
gui.add(s, "count", 0, 200, 1).onChange(resize);
gui.add(s, "size", 1, 20, 1).onChange(resize);
gui.add(s, "velocity", 0, 30, 1).onChange(resize);
gui.add(s, "distance", 1, 250, 1);

function checkDistance(x1, y1, x2, y2) {
    return Math.sqrt(
        Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)
    );
}

function setColor() {
    return 'rgb(' + Math.round(255*Math.random()) + ','
                  + Math.round(255*Math.random()) + ','
                  + Math.round(255*Math.random()) +
           ')';
}

function Dot(x, y, vx, vy, col) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.col = col;
    this.size = s.size;
}

function dotInit(x, y) {
    var x = x || c.width*Math.random(),
        y = y || c.height*Math.random(),
        vx = - s.velocity/2 + s.velocity*Math.random(),
        vy = - s.velocity/2 + s.velocity*Math.random(),
        col = setColor();

    if(x - s.size < 0 || x + s.size > c.width) {
        x = c.width/2;
    }

    if(y - s.size < 0 || y + s.size > c.height) {
        y = c.height/2;
    }

    dots.push(new Dot(x, y, vx, vy, col));
}

function drawDot(dot) {
    ctx.fillStyle = dot.col;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, 2*Math.PI);
    ctx.fill();
}

function update() {
    for(var i = 0; i < dots.length; i++) {

        var dot = dots[i],
            dx = dot.x + dot.vx,
            dy = dot.y + dot.vy,
            dist = checkDistance(
                area.x, area.y, dot.x, dot.y
            );

        if(dist < s.distance) {
            dot.size = (s.distance - dist)/2 + s.size;
        } else {
           dot.size = s.size;
        }

        if (dx - dot.size < 0 || dx + dot.size > c.width) {
            dot.vx *= -1;
        }

        if (dy - dot.size < 0 || dy + dot.size > c.height) {
           dot.vy *= -1;
        }

        dot.x += dot.vx;
        dot.y += dot.vy;

        drawDot(dot);
    }
}

c.addEventListener("mousemove", function(e) {
    area.x = e.pageX - c.offsetLeft;
    area.y = e.pageY - c.offsetTop;
});

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function (callback) {
               window.setTimeout(callback, 1000/60);
           };
})();

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    update();
    window.requestAnimFrame(draw);
}
draw();
