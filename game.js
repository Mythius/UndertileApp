function obj(id){return document.getElementById(id);}
function hide(id){obj(id).style.visibility='hidden';}
function show(id){obj(id).style.visibility=null;}
var game=obj('game'),playing=true,wait=false;
game.focus();
function random(min,max){return Math.floor(min+Math.random()*(max-min));}
var colors=['red','blue','yellow','purple','green','orange','#faf','#faf','green','purple'];
for(var a=0;a<15;a++){
    for(var b=0;b<8;b++){
        var tile=document.createElement('div');
        var c=colors[random(0,colors.length)];
        tile.style.backgroundColor=c;
        game.appendChild(tile);
        tile.classList.add('tile');
    }
}
show('player');
show('game');
var tiles=document.getElementsByTagName('div'),grid=[],iRequest=[];
for(var i=2;i<tiles.length;i++){
    grid.push(tiles[i].style.backgroundColor);
}
var xp=5, yp=5, x=1,y=1,player=obj('player'),flavor='blank';
var key={up: 38,down: 40, left: 37, right: 39,space: 32};
document.addEventListener('keydown',function(ev){
    var handled = false;
    switch(ev.keyCode){
        case key.up: rMove(0,-1); handled=true; break;
        case key.down: rMove(0,1); handled=true; break;
        case key.left: rMove(-1,0); handled=true; break;
        case key.right: rMove(1,0); handled=true; break;
        case key.space: location.reload(); break;
    }
    if(handled){
        ev.preventDefault();
    }
});
buttons();
function buttons(){
    obj('a').addEventListener('click',function(){rMove(-1,0)});
    obj('b').addEventListener('click',function(){rMove(0,-1)});
    obj('c').addEventListener('click',function(){rMove(0,1)});
    obj('d').addEventListener('click',function(){rMove(1,0)});
    obj('r').addEventListener('click',function(){location.reload();});
}
function rMove(dx,dy){
    if(playing&&(!wait)){
        addReq(x+dx,y+dy,true);
        switch(iRequest.last()){
            case 'rgb(255, 170, 255)': move(dx,dy); break;
            case 'green': move(dx,dy); break;
            case 'yellow': move(dx,dy);wait=true; setTimeout(function(){wait=false;rMove(-dx,-dy);},300); break;
            case 'orange': move(dx,dy); flavor='orange'; break;
            case 'purple': move(dx,dy); flavor='lemon'; rMove(dx,dy); break;
            case 'blue': if(flavor=='orange'||waterDetect(x+dx,y+dy)){move(dx,dy);wait=true;setTimeout(function(){wait=false;rMove(-dx,-dy);},300);}else{move(dx,dy);} break;
            case 'out': break;
            default: break;   
        }
    }
}
function addReq(x,y,player){
    iRequest.push(grid[pos(x,y)]);
    if(player&&x>15){gameWin();return;}
    if(x<1||y>9||y<1||x>15){
        iRequest.push('out');
        return 'out';
    } else {
        return grid[pos(x,y)];
    }
}
function pos(x,y){
    return y*15-14+x-2;   
}
Array.prototype.last = function(){
    return this[this.length-1];
};
Array.prototype.empty = function(){
    var l=this.length;
    for(var a=0;a<l;a++){
        this.pop();  
    }
};
Array.prototype.contains = function(s){
    return this.indexOf(s)!=-1;   
};
function move(cx,cy){
    x+=cx;
    y+=cy;
    xp+=cx*50;
    yp+=cy*50;
    player.style.left=xp+'px';
    player.style.top=yp+'px';
}
function waterDetect(x,y){
    iRequest.empty();
    addReq(x-1,y,false);
    addReq(x+1,y,false);
    addReq(x,y-1,false);
    addReq(x,y+1,false);
    return iRequest.contains('yellow');
}
function gameWin(){
    playing=false;
    var l=tiles.length;
    for(var t=1;t<l;t++){
        if(tiles[2]){
            tiles[2].parentNode.removeChild(tiles[2]);
        }
    }
    hide('game');
    hide('player');
    var win = document.createElement('img');
    win.src='level_complete.png';
    win.alt='Level Complete';
    win.style.display='block';
    win.style.margin='auto';
    document.body.appendChild(win);
}