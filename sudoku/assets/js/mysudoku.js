var prob_level = "medium";
var problem_str = sudoku.generate(prob_level);
var answer_str = sudoku.solve(problem_str);
console.log( problem_str );

jQuery(document).ready(function(){
    restart_it();
});

function check_solution(){
    var _temp = '';
    for( var row = 1; row < 10; row++){
        for( var col = 1; col < 10; col++){
            _temp += jQuery('#row-'+row+' #entry-'+col+' input').val();
        }
    }
    if( answer_str.localeCompare(_temp) != 0 ){
        alert("WRONG ANSWER, RETRY!");
    }else{
        alert("HURRAY, YOU SOLVED IT!");
    }
}

function solve_it(){
    var answer_arr = sudoku.board_string_to_grid(answer_str)
    for( var row = 1; row < 10; row++){
        for( var col = 1; col < 10; col++){
            jQuery('#row-'+row+' #entry-'+col+' input').val( answer_arr[row-1][col-1] );
        }
    }
}

function restart_it(){
    var problem_arr = sudoku.board_string_to_grid(problem_str)
    for( var row = 1; row < 10; row++){
        for( var col = 1; col < 10; col++){
            var _t;
            if(problem_arr[row-1][col-1] != '.'){
                _t = '<input type="tel" value="'+problem_arr[row-1][col-1]+'" readonly>'
                jQuery('#row-'+row+' #entry-'+col).html( _t );
                jQuery('#row-'+row+' #entry-'+col).addClass("readonly");
            }else{
                _t = '<input type="tel" value="">'
                jQuery('#row-'+row+' #entry-'+col).html( _t );
                jQuery('#row-'+row+' #entry-'+col).removeClass("readonly");
            }
        }
    }
}

function generate(){
    problem_str = sudoku.generate(prob_level);
    answer_str = sudoku.solve(problem_str);
}
