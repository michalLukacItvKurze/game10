// malo by zaručiť aby bol cely dokument načitaný pred spustením 
document.addEventListener('DOMContentLoaded',()=> {

    playGame();

    function playGame(){

        // odchytim si hraciu plochu
        let gameBoard = document.getElementById('board');
        let menu = document.getElementById('menuGameOver');
        let playButton = document.getElementById('playButton');
        // odchytim si postavy
        let posAndGun = document.getElementById('posAndGun');
        let posRight = document.getElementById('posRight');
        //odcyhtim si poziciu postavy
        let gunRight = document.getElementById('gunRight');
        // odcyhtim si batoh
        let rocketBag = document.getElementById('rocketBag');
        // odchytim si enemies
        let enemy1 = document.getElementById('enemy1');
        let enemy2 = document.getElementById('enemy2');
        let enemy3 = document.getElementById('enemy3');
        // odchytim si strely nepriatela
        let shot1 = document.getElementById('shot1');
        let shot2 = document.getElementById('shot2');
        let shot3 = document.getElementById('shot3');
        let shot4 = document.getElementById('shot4');
        let shot5 = document.getElementById('shot5');
        // odchytim si poziciu zbrane teda prva pozicia strelca
        let rectX = 150; 
        let rectY = -6 ;
        // odchytim si poziciu gule
        let balX = 0;
        let balY = 50;
        // sounds
        let shotSound = new Audio('sounds/shot.mp3');
        let rocketSound = new Audio('sounds/rocket.mp3');
        let colision =  new Audio('sounds/colision.mp3');
        let gameOverSound = new Audio('sounds/gameover.mp3')
        //score
        let score = 1;
        //zivoty
        let zivoty = 4;
        let life = document.getElementById('life1');
        let lifeBanner = document.getElementById('life');


        //podlaha
        let bottom = 0;
        //skakanie
        let isJumping = false;
        let shooting = true;
        let shootingRight = true;
        let gravity = 1;

        // nastavenie plochy a skrytie menu 
        gameBoard.style.display='block';
        menu.style.display='none';

        // zavolanie funckie - pohyb enemies
        moveEnemies(enemy1,900); 
        moveEnemies(enemy2,1300);
        moveEnemies(enemy3,1800);
        
        // zavolanie funckie - pohyb strely
        moveShots(shot1,1100);
        moveShots(shot2,2000);
        moveShots(shot3,3000);
        moveShots(shot4,3900);
        moveShots(shot5,5100);
    



        // key down pohyb postavicky a zbrane
        window.addEventListener('keydown',(e)=>{
            let left = parseInt(window.getComputedStyle(posAndGun).getPropertyValue('left'));
            //left
            if(e.keyCode=='37' && left > 10 ){
                //postava a zbran pohyb vlavo
                posRight.id='posRunLeft';
                posAndGun.style.left = left - 10 + 'px';
                gunRight.id='gunLeft';
                gunSide = 'left';
                rocketBag.style.left='140px';
                rectX = rectX - 10;
                rectX = parseInt(rectX);
                console.log('left' + rectX);
                shootingRight = false;  
            }
            //right
            else if(e.keyCode=='39' && left <700){
                //postava a zbran pohyb vpravo
                posRight.id='posRunRight';
                gunRight.id='gunRight';
                posAndGun.style.left = left + 10 + 'px';
                gunSide = 'right';
                rocketBag.style.left='40px';
                rectX = rectX + 10;
                rectX = parseInt(rectX);
                console.log('left' + rectX);
                shootingRight = true;
            }
            return rectX;
        })
        // keyUp zastavenie postavicky 
        window.addEventListener('keyup',(e)=>{
            left = parseInt(window.getComputedStyle(posAndGun).getPropertyValue('left'));
            //left
            if(e.keyCode=='37'){
                //zastavenie 
                posRight.id='posLeft';           
            }
            //right
            else if(e.keyCode=='39'){
                //zastavenie
                posRight.id='posRight';
            }
        })
        // key down skok postavicky 
        window.addEventListener('keydown', (e)=>{
            if(e.keyCode=='38'){
                jump(posAndGun);
                rocketSound.play();
            }
        })
        // key down spusti move boolet 
        window.addEventListener('keydown',(e)=>{
            if(e.keyCode==32){
                if(shooting){
                    if(shootingRight){
                        let bullet = document.createElement('div');
                        bullet.classList.add('bullet');
                        board.appendChild(bullet);
                        // zavolam funkciu move bulet
                        moveBullets(bullet,rectX);
                        shotSound.play();
                    }
                }    
            }
        });
        // funkcia move bullets - strela
        function moveBullets(bullets,positionBullets) {
            let id = null;
            clearInterval(id);
            id = setInterval(frame,1);
            function frame() {
                if( positionBullets==0){
                    clearInterval(id);
                }
                else {
                    vodorovneStrela = positionBullets = positionBullets+3;
                    bullets.style.left = positionBullets + 'px';
                    // po preteceni vymaze bulets
                    if(positionBullets>1000){
                        bullets.remove();
                    }
                }
            }
        }
        // funkcia move enemies
        function moveEnemies(enemy,positionEnemies) {
            let id = null;
            clearInterval(id);
            id = setInterval(frame,1); 
            function frame() {
                if( positionEnemies==0){
                    clearInterval(id);
                }
                else {
                    positionEnemies= positionEnemies-0.1;
                    enemy.style.left = positionEnemies + 'px';
                    // po preteceni vymaze nepriatelov
                    if(positionEnemies<-100){
                        enemy.remove();
                    }
                }
            }
        }

        // funkcia move enemy shots  -  kotulajuce gule
        function moveShots(shots,positionEnemyShot) {
            let id = null;
            clearInterval(id);
            id = setInterval(frame,1);
            function frame() {
                if( positionEnemyShot==100){
                    clearInterval(id);
                }
                else {
                    positionEnemyShot= positionEnemyShot-0.3;
                    rectEnemyShot=shots.style.left = positionEnemyShot*2 + 'px';
                    balX = parseInt(rectEnemyShot); 
                    // zavolanie funkcie vyhybanie sa gulam--
                    jumpOver();
                    // po preteceni vymaze enemy shots
                    if(positionEnemyShot<-100){
                        shots.remove();
                    }
                }
            }
            return balX;
        }

        // funkcia skakanie
        function jump(char){
            if (isJumping) return;
            let upTimerId = setInterval(function () {
            //jump down
            if (bottom > 220) {
                clearInterval(upTimerId);
                let downTimerId = setInterval(function () {
                if (bottom < 0 ) {
                    clearInterval(downTimerId);
                    isJumping = false;
                    rocketBag.style.display='none';
                    shooting = true;
                }
                rectY = bottom -= 3;
                rectY = parseInt(rectY);
                bottom = bottom * gravity;
                char.style.bottom = bottom + 'px';
                
                },20)
            }
            //jump up
            isJumping = true;
            rectY = bottom +=6;
            rectY = parseInt(rectY);
            bottom = bottom * gravity;
            char.style.bottom = bottom + 'px';
            rocketBag.style.display='block'; 
            shooting = false;
            },20)
            return rectY;
        }

        // funkcia preskakovanie guľ
        function jumpOver(){
            let vodorovnePajac = Math.round(rectX);
            let vodorovneGula = Math.round(balX);
            let vertikalnePajac = Math.round(rectY) + 56;
            let vertikalneGula =  Math.round(balY);
            
            //console.log( 'Pajac x :',vodorovnePajac, 'Gula x :',vodorovneGula, ' Pajac y :', vertikalnePajac,  'Gula y :' ,vertikalneGula);
            if((vertikalnePajac == vertikalneGula) &&
                (vodorovnePajac == vodorovneGula)
                ){
                    banner(); // vyvolanie funkcie banera zmena zivota
                    odpocitavanieZivotov(); // vyvolanie funkcie po zrazke odrata zo zivota
                    colision.play();  // vyvolanie hudba 
                    console.log('zivoty '+zivoty);                
                    console.log('Pajac x :',vodorovnePajac, 'Gula x :',vodorovneGula, ' Pajac y :', vertikalnePajac,  'Gula y :' ,vertikalneGula);
            }
        }

        // funkcia banner 
        function banner(){
            let life = document.getElementById('life1');
            life.remove(-1); 
        }

        // funkcia odpocitavanieZivotov a gameover 
        function odpocitavanieZivotov(){
            zivoty -=1;
            if(zivoty <= 0 ){
                gameOverSound.play();
                fadeOutBoard();
            }
        }

        // fade out board  - after game over
        function fadeOutBoard(){
            gameBoard.style.display='none';
            menu.style.display='block';

        }

        // klik na button spusti hru 
        playButton.addEventListener('click',(e)=>{
        // nacita na novo stranku s hrou
        location.reload();
        
        });

    }

})

