// 2014年07月17日22:32:43
// demo

$(function(){
	var x,y,
		arr = [],
		len = 1,
		dir = ['right','down','left','up'];
	
	function sim(n){	
		for(var i =0;i<n*n;i++){} 
        	for(int j = 0; j < len; j++){  
            	switch(dir){  
            	case LEFT:  
               		--y;
               		break;  
            	case RIGHT:  
                	++y;
                    break;  
            	case UP:  
                	--x;
                    break;  
            	case DOWN:  
                	++x;
                    break;  
            	default:
            	    break;  
            }  
            data[x][y] = num++;  
        }  
        count++;  
        if(count == 2){  
            count = 0;  
            len++;      
        }  
        dir =(DIRECTION)((dir + 1)%4);  
    }  
	}

});
