var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;
var x3 = 0;
var y3 = 0;
var a = 1, b = 0, c = 0, type = 0, count = true;

function SLU(x1, y1, x2, y2, x3, y3) {
    var coefs = [];
    var A = [
        [x1*x1, x1, 1],
        [x2*x2, x2, 1],
        [x3*x3, x3, 1]
    ];
    var B = [
        y1,
        y2,
        y3
    ];
    for (var i = 1; i < A.length; i++) {
        for (var j = 0; j < i; j++) {
            A[i[j]] ^= A[j[i]];
            A[j[i]] ^= A[i[j]];
            A[i[j]] ^= A[j[i]];
        }
    }
    for (var i = 0; i < A.length; i++) {
        var tmp = 0;
        for (var j = 0; j < B.length; j++) {
            tmp += A[i] * B[j];
        }
        coefs.push(tmp);
    }
    return coefs;
}
function Determinant(A) {
    var N = A.length, B = [], denom = 1, exchanges = 0;
    for (var i = 0; i < N; ++i) {
        B[ i ] = [];
        for (var j = 0; j < N; ++j) B[ i ][j] = A[ i ][j];
    }
    for (var i = 0; i < N-1; ++i)
    { var maxN = i, maxValue = Math.abs(B[ i ][ i ]);
        for (var j = i+1; j < N; ++j)
        { var value = Math.abs(B[j][ i ]);
            if (value > maxValue){ maxN = j; maxValue = value; }
        }
        if (maxN > i)
        { var temp = B[ i ]; B[ i ] = B[maxN]; B[maxN] = temp;
            ++exchanges;
        }
        else { if (maxValue === 0) return maxValue; }
        var value1 = B[ i ][ i ];
        for (var j = i+1; j < N; ++j)
        { var value2 = B[j][ i ];
            B[j][ i ] = 0;
            for (var k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[ i ][k]*value2)/denom;
        }
        denom = value1;
    }
    if (exchanges%2) return -B[N-1][N-1];
    else return B[N-1][N-1];
}

function AdjugateMatrix(A) {
    var N = A.length, adjA = [];
    for (var i = 0; i < N; i++)
    { adjA[ i ] = [];
        for (var j = 0; j < N; j++)
        { var B = [], sign = ((i+j)%2===0) ? 1 : -1;
            for (var m = 0; m < j; m++)
            { B[m] = [];
                for (var n = 0; n < i; n++)   B[m][n] = A[m][n];
                for (var n = i+1; n < N; n++) B[m][n-1] = A[m][n];
            }
            for (var m = j+1; m < N; m++)
            { B[m-1] = [];
                for (var n = 0; n < i; n++)   B[m-1][n] = A[m][n];
                for (var n = i+1; n < N; n++) B[m-1][n-1] = A[m][n];
            }
            adjA[ i ][j] = sign*Determinant(B);
        }
    }
    return adjA;
}

function showCoords(evt){
    ++type;
    var first = -(200 - (evt.offsetX)) / 10;
    var second = (200 - (evt.offsetY)) / 10;
    alert(
        "X: " + first + "\n" +
        "Y: " + second + "\n"
    );
    if (type === 1) {
        x1 = first;
        y1 = second;
    }
    if (type === 2) {
        x2 = first;
        y2 = second;
    }
    if (type === 3) {
        x3 = first;
        y3 = second;
    }
    if (type === 3) {
        var coefs = [];
        var A = [
            [x1*x1, x1, 1],
            [x2*x2, x2, 1],
            [x3*x3, x3, 1]
        ];
        var B = [
            y1,
            y2,
            y3
        ];
        var det = Determinant(A);
        var N = A.length, A = AdjugateMatrix(A);
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++)
                A[ i ][j] /= det;
        }
        for (var i = 0; i < N; i++) {
            var tmp = 0;
            for (var j = 0; j < B.length; j++)
                tmp += A[i][j] * B[j];
            coefs.push(tmp);
        }
        a = coefs[0];
        b = coefs[1];
        c = coefs[2];
        ctx.strokeStyle="blue";
        for(var i = -20; i <= 20; i += 0.2) {
            if (a !== 0) {
                if (count === true) {
                    ctx.moveTo(canvas.width / 2 + (i * 10), canvas.height / 2 - 10 * (a * (i * i) + (b * i) + c));
                    count = false;
                    ctx.stroke();
                    continue;
                }
                if (i === 0 && count === false) {
                    ctx.moveTo(canvas.width / 2 + (i * 10), canvas.height / 2 - 10 * (a * (i * i) + (b * i) + c));
                } else {
                    ctx.lineTo(canvas.width / 2 + (i * 10), canvas.height / 2 - 10 * (a * (i * i) + (b * i) + c));
                }
                ctx.stroke();
            }
        }
    }
}
var canvas = document.getElementById('c1');
var ctx = canvas.getContext("2d");

fillStyle="#ccc";
for(var i=0; i < canvas.width; i += 10)
    ctx.fillRect(i,0,1,canvas.height);
for(var i=0; i< canvas.height; i += 10)
    ctx.fillRect(0,i,canvas.height,1);

ctx.fillStyle="red";
ctx.fillRect(0,canvas.height/2, canvas.width,1);
ctx.fillRect(canvas.width/2,0,1, canvas.height);


