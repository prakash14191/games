window.params = {
    width: 9,
    height: 9,
    mines: 10,
    flags: 10
}

window.mine_indices = {};
window.mines = generate_mines(window.params.width, window.params.height);
window.hmap  = generate_hmap();

var playground = document.getElementById("playground");

document.getElementById('remaining').innerHTML = window.params.flags;

for(y = 0; y < window.params.height; y++){
    var row = playground.insertRow(y);
    for(x = 0; x < window.params.width; x++){
        var cell = row.insertCell(x);
        cell.setAttribute('row', y);
        cell.setAttribute('col', x);
        cell.setAttribute('class', '');
        // row*width + col
        cell.setAttribute('id', y*window.params.width + x);

        
        // show id
        // cell.innerHTML = y*window.params.width + x;

        // show mines
        // cell.innerHTML = window.mines[y][x] > 9 ? '*' : '';

        // show hmap
        // cell.innerHTML = window.hmap[y][x] > 0 ? window.hmap[y][x] : '';

        // cell.onclick = reveal_cell(y, x);
    }
}

function getRandomArbitrary(min, max) {
    // max exclusive
    return parseInt( Math.random() * (max - min) + min );
}

function generate_mines(w, h){
    m = window.params.mines;
    mines = new Array(h);
    for(i = 0; i< h; i++){
       mines[i] = new Array(w);
    }
    for(i = 0; i< w; i++){
        for(j = 0; j< h; j++){
            mines[j][i] = 0;
        }
    }
    while(m--){
        a = getRandomArbitrary(0, window.params.height);
        b = getRandomArbitrary(0, window.params.width);
        if(mines[a][b] != 0){
            // mine already exists
            m++;
            continue;
        }
        mines[a][b] = 10;
        window.mine_indices[window.params.mines - m] = {'row': a, 'col': b};
    }
    return mines;
}

function generate_hmap(){
    hmap = window.mines;
    for(var m_i in window.mine_indices){
        row = window.mine_indices[m_i]['row'];
        col = window.mine_indices[m_i]['col'];
        for(r = row-1; r <= row+1; r++){
            for(c = col-1; c <= col+1; c++){
                try{
                    hmap[r][c]++;
                }catch(err){
                    // console.log('error');
                }
            }
        }
        hmap[row][col]--;
    }
    return hmap;
}

function reveal_cell(row, col){
    width = window.params.width;
    height = window.params.height;
    row = parseInt(row);
    col = parseInt(col);
    if(document.getElementById(row*width + col).getAttribute('class') == 'reveal'){
        return;
    }
    let q = [];
    let explored = new Array(height);
    for(let t = 0; t < height; t++){
        explored[t] = new Array(width);
    }
    for(let t = 0; t < height; t++){
        for(let u = 0; u < width; u++){
            explored[t][u] = 0;
        }
    }
    q.push([row, col]);

    while(val = q.shift()){
        row = val[0];
        col = val[1];
        if(q.length > 16){
            break;
        }
        if(row >=0 && row < height && col >= 0 && col < width){
            elem = document.getElementById(row*width + col);
            elem.setAttribute('class', 'reveal');
            explored[row][col] = 1;
            elem.innerHTML = window.hmap[row][col] > 0 ? window.hmap[row][col] : '';

            if(window.hmap[row][col] >= 10){
                // elem.innerHTML = window.mines[row][col] > 9 ? '*' : '';
                reveal_mines();
                alert('You lost!');
            }

            if(window.hmap[row][col] == 0){
                for(r = row-1; r <= row+1; r++){
                    for(c = col-1; c <= col+1; c++){
                        if(r != row || c != col){
                            if(r >=0 && c>= 0 && r < height && c < width && !(explored[r][c] && window.hmap[r][c] < 10)){
                                q.push([r, c]);
                                explored[r][c] = 1;
                                // console.log(row, col, ': Adding ', r,c);
                            }
                            // console.log('q len', q.length);
                            // console.log('--');
                        }
                    }
                }
                // console.log(q);
                // console.log(explored);
            }

        }
    }
    return;
}

function reveal_mines(){
    width = window.params.width;
    for(mi in window.mine_indices){
        r = window.mine_indices[mi]['row'];
        c = window.mine_indices[mi]['col'];
        elem = document.getElementById(r*width + c);
        elem.setAttribute('class', 'mine');
        elem.innerHTML = window.mines[r][c] > 9 ? '*' : '';
    }
}

tds = document.getElementsByTagName('td');

for(i = 0; i < tds.length; i++){
    tds[i].addEventListener("mousedown", function(event){
        if(event.button == 2){
            // right click
            var class_name = this.getAttribute('class');
            if(class_name.includes('flag')){
                class_name = class_name.replace('flag', '');
                this.setAttribute('class' , class_name);
                window.params.flags++;
            }else{
                this.setAttribute('class' , class_name +' flag');
                window.params.flags--;
            }
            document.getElementById('remaining').innerHTML = window.params.flags;
            return;
        }
        reveal_cell(this.getAttribute('row'), this.getAttribute('col'));
    });
}

document.addEventListener('contextmenu', event => event.preventDefault());