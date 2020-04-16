window.params = {
    width: 10,
    height: 10,
    coins: 100,
    coin_log: [],
    turn: 0
}

for(i = 0; i < window.params.width*window.params.height; i++){
    window.params.coin_log[i] = i+1;
}

window.params.coin_log = shuffle(window.params.coin_log);

var playground = document.getElementById("playground");

document.getElementById('status').innerHTML = window.params.turn;

for(r = 0; r < window.params.height; r++){
    var row = playground.insertRow(r);
    for(c = 0; c < window.params.width; c++){
        var cell = row.insertCell(c);
        cell.setAttribute('row', r);
        cell.setAttribute('col', c);
        cell.setAttribute('class', '');
        // row*width + col
        cell.setAttribute('id', r*window.params.width + c + 1);
        cell.innerHTML = r*window.params.width + c + 1;
    }
}

function getRandomArbitrary(min, max) {
    // max exclusive
    return parseInt( Math.random() * (max - min) + min );
}

function reveal_coin(){
    if(window.params.turn >= window.params.coins ){
        alert('All revealed!');
        return;
    }else{
        cur_coin = window.params.coin_log[ window.params.turn ];
        document.getElementById(cur_coin).setAttribute('class', 'reveal');
        document.getElementById('log').innerHTML += cur_coin + ', ';
        window.params.turn++;
        document.getElementById('status').innerHTML = window.params.turn;

        alert(cur_coin);
    }
}

function shuffle(aray) {
    var ctr = aray.length, temp, index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = aray[ctr];
        aray[ctr] = aray[index];
        aray[index] = temp;
    }
    return aray;
}

function generate_ticket(){
    var result = [[], [], []];
    var ticket_log = [];
    var count = 0;
    var cur_elem = 0;
    for(count = 1; count <= 15; count++){

        cur_elem = getRandomArbitrary(1,  window.params.coins + 1);
        while(ticket_log.indexOf(cur_elem) != -1){
            cur_elem = getRandomArbitrary(1, window.params.coins + 1);
        }
        // console.log(cur_elem);
        ticket_log.push(cur_elem);
        if(count <=5 ){
            result[0].push(cur_elem);
        }else if(count <= 10){
            result[1].push(cur_elem);
        }else if(count <= 15){
            result[2].push(cur_elem);
        }
    }
    // console.log(ticket_log);
    for(i = 0; i < 4; i++){
        result[0].push('');
        result[1].push('');
        result[2].push('');
    }

    result[0] = shuffle(result[0]);
    result[1] = shuffle(result[1]);
    result[2] = shuffle(result[2]);
    
    var ticket = document.createElement("table");

    for(r = 0; r < 3; r++){
        var row = ticket.insertRow(r);
        for(c = 0; c < 9; c++){
            var cell = row.insertCell(c);
            cell.innerHTML = result[r][c];
        }
    }
    _tickets_panel = document.getElementById('tickets-start');
    _br = document.createElement('br');
    _tickets_panel.after(ticket);
    _tickets_panel.after(_br);
}