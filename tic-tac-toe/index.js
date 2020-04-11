// even X, odd O
window.turn = 0;
window.puli_cap = 3;
window.meka_cap = 3;
window.playground = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];

var player = document.getElementById("player");
var canvas = document.getElementById("playground");
canvas.width = 300;
canvas.height = 300;    


var ctx = canvas.getContext('2d');
draw_grid(ctx);



/* Function Declarations */

function draw_grid(ctx){
    // to remove pixelation
    ctx.translate(0.5, 0.5);

    w = ctx.canvas.width;
    h = ctx.canvas.height;
    lmarg = 0;
    tmarg = 0;

    // Draw Vertical Lines
    ctx.moveTo(w/3, 0);
    ctx.lineTo(w/3, h);

    ctx.moveTo(2*w/3, 0);
    ctx.lineTo(2*w/3, h);
    

    // Draw Horizontal Lines
    ctx.moveTo(0, h/3);
    ctx.lineTo(w, h/3);

    ctx.moveTo(0, 2*h/3);
    ctx.lineTo(w, 2*h/3);

    ctx.lineWidth = 2;
    ctx.stroke();
}

function put_puli(context, x, y){
    puli_img = new Image();
    puli_img.src = 'puli.png';
    puli_img.onload = function(){
        context.drawImage(puli_img, x-32, y-32, 75, 75);
        window.puli_cap--;
        window.playground[ pos_to_index(y) ][ pos_to_index(x) ] = 'P';
    }
    return puli_img;
}

function remove_puli(context, x, y){
    if(window.playground[ pos_to_index(y) ][ pos_to_index(x) ] != 'P'){
        alert('Illegal move to remove Puli');
        return 0;
    }
    window.playground[ pos_to_index(y) ][ pos_to_index(x) ] = ' ';
    context.clearRect(x-45, y-45, 90, 90);
    window.puli_cap++;
    return 1;
}

function put_meka(context, x, y){
    meka_img = new Image();
    meka_img.src = 'meka.png';
    meka_img.onload = function(){
        context.drawImage(meka_img, x-32, y-32, 75, 75);
        window.meka_cap--;
        window.playground[ pos_to_index(y) ][ pos_to_index(x) ] = 'M';
    }
    return meka_img;
}

function remove_meka(context, x, y){
    if(window.playground[ pos_to_index(y) ][ pos_to_index(x) ] != 'M'){
        alert('Illegal move to remove Meka');
        return 0;
    }
    window.playground[ pos_to_index(y) ][ pos_to_index(x) ] = ' ';
    context.clearRect(x-45, y-45, 90, 90);
    window.meka_cap++;
    return 1;
}

canvas.addEventListener("mousedown", function(e){
    [x,y] = getMousePosition(canvas, e);
    /* 20px padding */
    x = adjust_position(x - 20);
    y = adjust_position(y - 20);

    if(window.turn %2 == 0){
        if(window.puli_cap > 0){
            put_puli(ctx, x, y);
            window.turn++;
            player.innerHTML = '<img src="meka.png" width="25" /> Meka';
        }else{
            remove_puli(ctx, x, y);
        }
    }else{
        if(window.meka_cap > 0){
            put_meka(ctx, x, y);
            window.turn++;
            player.innerHTML = '<img src="puli.png" width="25" /> Puli';
        }else{
            remove_meka(ctx, x, y);
        }
    }
    
});

function getMousePosition(canvas, event) { 
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top;
    // console.log(event.target);
    return [x,y];
}

function adjust_position(pos){
    if(pos < 100){
        return 50;
    }else if(pos < 200){
        return 150;
    }else{
        return 250;
    }
}

function pos_to_index(pos){
    return parseInt( (pos - 50)/100 );
}