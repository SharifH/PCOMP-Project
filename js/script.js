window.onload = function() {
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
            //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
        })
        .begin()
        .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */

    var width = 1189;
    var height = 889;
    var topDist = '0px';
    var leftDist = '0px';

    var setup = function() {
        var video = document.getElementById('webgazerVideoFeed');
        video.style.display = 'block';
        video.style.position = 'absolute';
        video.style.top = topDist;
        video.style.left = leftDist;
        video.width = width;
        video.height = height;
        video.style.margin = '0px';

        webgazer.params.imgWidth = width;
        webgazer.params.imgHeight = height;

        var overlay = document.createElement('canvas');
        overlay.id = 'overlay';
        overlay.style.position = 'absolute';
        overlay.width = width;
        overlay.height = height;
        overlay.style.top = topDist;
        overlay.style.left = leftDist;
        overlay.style.margin = '0px';

        document.body.appendChild(overlay);

        var cl = webgazer.getTracker().clm;

        function drawLoop() {
            requestAnimFrame(drawLoop);
            overlay.getContext('2d').clearRect(0, 0, width, height);
            if (cl.getCurrentPosition()) {
                cl.draw(overlay);
            }
        }
        drawLoop();
    };

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady, 100);
};

function enablestart() {
    var startbutton = document.getElementById('startbutton');
    startbutton.value = "start";
    startbutton.disabled = null;
}
var ctrack = new clm.tracker({
    useWebGL: true
});
ctrack.init(pModel);

function startVideo() {
    // start video
    vid.play();
    // start tracking
    ctrack.start(vid);
    // start loop to draw face
    drawLoop();
}

function drawLoop() {
    requestAnimFrame(drawLoop);
    overlayCC.clearRect(0, 0, 400, 300);
    //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
    if (ctrack.getCurrentPosition()) {
        ctrack.draw(overlay);
    }
    var cp = ctrack.getCurrentParameters();

    var er = ec.meanPredict(cp);
    if (er) {
        updateData(er);
        for (var i = 0; i < er.length; i++) {
            if (er[i].value > 0.4) {
                document.getElementById('icon' + (i + 1)).style.visibility = 'visible';
            } else {
                document.getElementById('icon' + (i + 1)).style.visibility = 'hidden';
            }
        }
    }
}
/************ d3 code for barchart *****************/

var margin = {
        top: 20,
        right: 20,
        bottom: 10,
        left: 40
    },
    width = 400 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var barWidth = 30;

var formatPercent = d3.format(".0%");

var x = d3.scale.linear()
    .domain([0, ec.getEmotions().length]).range([margin.left, width + margin.left]);

var y = d3.scale.linear()
    .domain([0, 1]).range([0, height]);

var svg = d3.select("#emotion_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

svg.selectAll("rect").
data(emotionData).
enter().
append("svg:rect").
attr("x", function(datum, index) {
    return x(index);
}).
attr("y", function(datum) {
    return height - y(datum.value);
}).
attr("height", function(datum) {
    return y(datum.value);
}).
attr("width", barWidth).
attr("fill", "#2d578b");

svg.selectAll("text.labels").
data(emotionData).
enter().
append("svg:text").
attr("x", function(datum, index) {
    return x(index) + barWidth;
}).
attr("y", function(datum) {
    return height - y(datum.value);
}).
attr("dx", -barWidth / 2).
attr("dy", "1.2em").
attr("text-anchor", "middle").
text(function(datum) {
    return datum.value;
}).
attr("fill", "white").
attr("class", "labels");

svg.selectAll("text.yAxis").
data(emotionData).
enter().append("svg:text").
attr("x", function(datum, index) {
    return x(index) + barWidth;
}).
attr("y", height).
attr("dx", -barWidth / 2).
attr("text-anchor", "middle").
attr("style", "font-size: 12").
text(function(datum) {
    return datum.emotion;
}).
attr("transform", "translate(0, 18)").
attr("class", "yAxis");

function updateData(data) {
    // update
    var rects = svg.selectAll("rect")
        .data(data)
        .attr("y", function(datum) {
            return height - y(datum.value);
        })
        .attr("height", function(datum) {
            return y(datum.value);
        });
    var texts = svg.selectAll("text.labels")
        .data(data)
        .attr("y", function(datum) {
            return height - y(datum.value);
        })
        .text(function(datum) {
            return datum.value.toFixed(1);
        });

    // enter
    rects.enter().append("svg:rect");
    texts.enter().append("svg:text");

    // exit
    rects.exit().remove();
    texts.exit().remove();
}

/******** stats ********/

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('container').appendChild(stats.domElement);

// update stats on every iteration
document.addEventListener('clmtrackrIteration', function(event) {
    stats.update();
}, false);
var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();

window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}
