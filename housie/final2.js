window.params = {
    width: 10,
    height: 9,
    coins: 90,
    coin_log: [],
    turn: 0,
    ticket_count: 0,
    col_count: [9,10,10,10,10,10,10,10,11]
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

        document.getElementById("revealed").innerHTML = cur_coin;

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

function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}

function array_seq(ini_num, final_num){
  var array=[]
  for (i=0; i<=final_num-ini_num; i++){
    array.push(ini_num+i);
  }
    return array;
}

function generate_ticket(){
  var col_log=zeros([8,10]);
  var all_tickets=zeros([18,9]);
  var result=zeros([3,9]);
  for(c=0 ; c<7 ; c++){
    col_log[c]=array_seq(c*10+10,c*10+19);
    shuffle(col_log[c]);
  }
  col1=[1,2,3,4,5,6,7,8,9];
  col1=shuffle(col1);
  col8=[80,81,82,83,84,85,86,87,88,89,90];
  col8=shuffle(col8);

  var rows=array_seq(0,17);
  var flag=0;
  // Step 1 set the positions where to keep numbers
do{
    flag=0;
    all_tickets=zeros([18,9]);
    for (i=0;i<9;i++){
      rows=shuffle(rows);
    }
    var tr=getRandomArbitrary(6,9);
  for (r=0;r<18;r++){
    var c=r%9;
    /* since no there should not be any 3 number continously
     in a row 101101XXX pattern satisfy it*/
     //do that pattren in circular fashion.
    all_tickets[rows[r]][c]=1;
    all_tickets[rows[r]][(c+2)%9]=1;
    all_tickets[rows[r]][(c+3)%9]=1;
    all_tickets[rows[r]][(c+5)%9]=1;
    if (r>8){
      all_tickets[rows[r]][(c+tr)%9]=1;
    }
    else {
      all_tickets[rows[r]][(c+7)%9]=1;
    }
    /*  Now each colunm has 10 numbers so
    swap first and last column values appropriately*/
    if (r==7){
      all_tickets[rows[r]][0]=0;
      all_tickets[rows[r]][8]=1;
    }
  }


/* check after shuffle does each column has at least one number*/
  var sumCol_ticket=[];
  for (c=0;c<9;c++){
    sumCol_ticket[c]=0;
      for (n=0;n<6;n++){
        sumCol_ticket[c]=all_tickets[3*n][c]+all_tickets[3*n+1][c]+all_tickets[3*n+2][c];
        if (sumCol_ticket[c]==0){
          flag=1;
          break;
        }
    }
    if (flag==1){
      break;
    }
  }
}while(flag==1)

/* var sumCol=[];
  for (c=0;c<9;c++){
    sumCol[c]=0;
  for (r=0;r<18;r++){
    sumCol[c]=sumCol[c]+all_tickets[r][c];
  }
}

console.log(sumCol);*/

for (n=0;n<6;n++){
  result[0]=all_tickets[n*3];
  result[1]=all_tickets[n*3+1];
  result[2]=all_tickets[n*3+2];

//Assign numbers to the places specified
  for (c=0; c<9; c++){
    var curr_col=[]
    for (r=0; r< 3;r++){
      if (result[r][c]){
        if (c==0){
          result[r][c]=col1.pop();
        }
        else{
          if(c==8) {
            result[r][c]=col8.pop();
          }
          else {
            result[r][c]=col_log[c-1].pop();
          }
        }
      }
      if (result[r][c]!=0){
        curr_col.push(result[r][c])
      }
    }
     curr_col.sort(function(a, b){return a - b});
     for (r=2; r>=0;r--){
       if (result[r][c]!=0){
         result[r][c]=curr_col.pop()
       }
     }
  }

    window.params.ticket_count++;
    var ticket = document.createElement("table");
    ticket.setAttribute('id', 'ticket-'+window.params.ticket_count);
    // ticket.setAttribute('onclick', 'print_ticket('+ window.params.ticket_count +')');
    for(r = 0; r < 3; r++){
        var row = ticket.insertRow(r);
        for(c = 0; c < 9; c++){
            var cell = row.insertCell(c);
            cell.innerHTML = result[r][c] > 0 ? result[r][c] : '';
            cell.setAttribute('class', '');
            if(result[r][c] > 0){
              cell.setAttribute('onclick', 'toggle_cell(this)');
            }
        }
    }
    var dstring = '&data=' + result[0].join() + ';' + result[1].join() + ';' + result[2].join();
    _br = document.createElement('br');
    _href = document.createElement('a');

    _href.innerHTML = 'Link to share..';
    _href.href = 'ticket.html?' + dstring;

    _tickets_panel = document.getElementById('tickets-start');
    _tickets_panel.after(ticket);
    _tickets_panel.after(_href);
    _tickets_panel.after(_br);
  }
}

function toggle_cell(obj){
  var cname = obj.getAttribute('class');
  if(cname.indexOf('selected') != -1){
    if(confirm('Do you want to de-selet this entry?')){
      cname = cname.replace(' selected', '');
      obj.setAttribute('class', cname);
      obj.innerHTML = obj.innerHTML.replace('<strike>', '');
      obj.innerHTML = obj.innerHTML.replace('</strike>', '');
    }
  }else{
    obj.setAttribute('class', cname + ' selected');
    obj.innerHTML = '<strike>' + obj.innerHTML + '</strike>';
  }
}

function Ticket_gen(){
  window.open("Coupon_gen.html","_self")
}
