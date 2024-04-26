const Key = {
    get warrior(){ return "A name that robot onboarding to the arena"; },
    get img(){ return "Robot's pic"; },
    get passive(){ return "Capture that when robot lose game"; },
    get OBname(){ return "a name of loser robot for turn to passive"; },
    get onArena(){ return "is arena page already opened"; },
};

window.addEventListener('load',()=>{
    localStorage.setItem(Key.onArena, true);
    var name = sessionStorage.getItem(Key.warrior);
    var pic = sessionStorage.getItem(Key.img);
    if(name == null){
        //Come in to this page for newly.
        name = localStorage.getItem(Key.warrior);
        pic = localStorage.getItem(Key.img);
        sessionStorage.setItem(Key.warrior, name);
        sessionStorage.setItem(Key.img, pic);
        if(name != null){
            document.getElementById('botImg').src = pic;
            document.getElementById('botName').textContent = name;
        }
    }else{
        //when reload
        if(name != null){
            document.getElementById('botImg').src = pic;
            document.getElementById('botName').textContent = name;
        }
    }
});


/**
 *  window.addEventListener('beforeunload',()=>{
 *  
 *  });
 */


function mora(signal){
    var outcome = {
        playerPose: '',
        comPose: '',
        result: ''
    };
    var robotPose = computerMora();
    outcome.comPose = robotPose;
    outcome.playerPose = signal;
    switch(signal){
        case 'paper':
            if(signal == robotPose){               
                outcome.result = 'peace';
            }else if(robotPose == 'rock'){
                outcome.result = 'winner';
            }else{
                outcome.result = 'loser';
            }
            break;
        case 'scissors':
            if(signal == robotPose){
                outcome.result = 'peace';
            }else if(robotPose == 'paper'){
                outcome.result = 'winner';
            }else{
                outcome.result = 'loser';
            }
            break;
        case 'rock':
            if(signal == robotPose){
                outcome.result = 'peace';
            }else if(robotPose == 'scissors'){
                outcome.result = 'winner';
            }else{
                outcome.result = 'loser';
            }
            break;
    }
    displayOutCome(outcome);
}

function computerMora(){
    const randNum = Math.floor(Math.random()*10);
    var fingers = randNum % 3;
    switch(fingers){
        case 0:
            fingers = 'rock';
            break;
        case 1:
            fingers = 'paper';
            break;
        case 2:
            fingers = 'scissors';
            break;
        default:
            fingers = 'rock';
    }
    return fingers;
}

function displayOutCome(outcome){

    document.getElementById('btnRock').disabled = true
    document.getElementById('btnScissors').disabled = true
    document.getElementById('btnPaper').disabled = true
    var btnGroupSm = document.getElementById('btnGroup_sm');
    if(btnGroupSm.checkVisibility()){
        document.getElementById('btnRock_sm').disabled = true;
        document.getElementById('btnScissors_sm').disabled = true;
        document.getElementById('btnPaper_sm').disabled = true;
    }
    setTimeout(()=>{
        document.getElementById('btnRock').disabled = false
        document.getElementById('btnScissors').disabled = false
        document.getElementById('btnPaper').disabled = false
        document.getElementById('btnRock_sm').disabled = false;
        document.getElementById('btnScissors_sm').disabled = false;
        document.getElementById('btnPaper_sm').disabled = false;
    }, myTimeLine().duration);

    const canvas = document.getElementById("results_canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "50px serif";
    ctx.strokeStyle = "red";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(()=>{
        ctx.strokeText(outcome.result, 240, 50);

    },myTimeLine().duration-410);

    playerMotion(outcome.playerPose);
    robotMotion(outcome.comPose);
    pickNext(outcome.result);
}

function myTimeLine(){
    const timeline = {
        duration: 2000,
        iterations: 1
    };
    return timeline;
}

function playerMotion(pose){
    var fingerFrame = [
        {position: 'relative', left: '0%', transform: 'scale(1)'},
        {position: 'relative', left: '70%', transform: 'scale(3.8)'},
    ];
    var btnGroupSm = document.getElementById('btnGroup_sm');
    if(btnGroupSm.checkVisibility()){
        fingerFrame = [
            {position: 'relative', top: '0%', transform: 'scale(1)'},
            {position: 'relative', top: '45%', transform: 'scale(3.8)'},
        ];
    }
    var user = document.getElementById('user');
    switch(pose){
        case 'rock':
            user.classList.toggle('player_finger-rock');
            break;
        case 'scissors':
            user.classList.toggle('player_finger-scissors');
            break;
        case 'paper':
            user.classList.toggle('player_finger-paper');
    }
    user.animate(fingerFrame, myTimeLine());
    setTimeout(()=>{
        user.classList = 'player_finger';
    },myTimeLine().duration);
}

function robotMotion(pose){
    var fingerFrame = [
        {position: 'relative', right: '0%', transform: 'scale(1)'},
        {position: 'relative', right: '69%', transform: 'scale(3.8)'},
    ];
    var btnGroupSm = document.getElementById('btnGroup_sm');
    if(btnGroupSm.checkVisibility()){
        fingerFrame = [
            {position: 'relative', top: '0%', transform: 'scale(1)'},
            {position: 'relative', top: '45%', transform: 'scale(3.8)'},
        ];
    }
    var machine = document.getElementById('machine');
    machine.animate(fingerFrame, myTimeLine());
    setTimeout(()=>{
        switch(pose){
            case 'rock':
                machine.classList.toggle('robot_finger-rock');
                break;
            case 'scissors':
                machine.classList.toggle('robot_finger-scissors');
                break;
            case 'paper':
                machine.classList.toggle('robot_finger-paper');
        }
    },myTimeLine().duration - 500);
    setTimeout(()=>{
        machine.classList = 'robot_finger';
    },myTimeLine().duration);
}

function pickNext(result){
    setTimeout(()=>{
        if(result == 'winner'){
            let loserRobot = document.querySelector('.robot_nickname').innerHTML;
            localStorage.setItem(Key.OBname, loserRobot);
            localStorage.setItem(Key.passive, true);
            localStorage.removeItem(Key.onArena);
            window.close();
        }
    }, myTimeLine().duration+500);
}