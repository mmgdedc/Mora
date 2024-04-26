var contestants = null;
var arenaPage = null;
const Key = {
    get armyGroup(){ return `Profiles of every robot`; },
    get warrior(){ return "A name that robot onboarding to the arena"; },
    get img(){ return "Robot's pic"; },
    get passive(){ return "Capture that when robot lose game"; },
    get OBname(){ return "a name of loser robot for turn to passive"; },
    get OBset(){ return "Loser's  identify chassisNo array"; },
    get onArena(){ return "is arena page already opened"; },
};

window.addEventListener('load',()=>{
    var everyOne = sessionStorage.getItem(Key.armyGroup);
    if(everyOne == null){
        onCreate();
    }else{
        onResume(everyOne);
    }
});

document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState === 'visible' && contestants != null){
        setPassiveBot();
    }
});

/**關閉與重新整理時也都觸發*/
window.addEventListener("beforeunload", (event)=>{
    event.returnValue = "";
});

function onCreate(){
    localStorage.clear();
    const randuser = 'https://randomuser.me/api/1.4/?format=JSON&page=1&results=10&inc=name,nat,picture&exc=login';
    fetchSportsmans(randuser);
}

function onResume(everyOne){
    parseSportsmans(everyOne);
    set_layout();
    set_chooseConfirm();
    setPassiveBot();
}

function fetchSportsmans(url){
    if(url == null){
        const reserved = './ajax/robot-profile.txt';
        url = reserved;
    }

    window.fetch(url)
    .then(
             (response)=>{
                 if(!response.ok)
                     throw new Error(`Http error: ${response.status}`);
                 else
                     return response.text();
             }
    )
    .then(
             (text)=>{
                 sessionStorage.setItem(Key.armyGroup, `${text}`);
                 parseSportsmans(text);
                 set_layout();
                 set_chooseConfirm()
             }
    )
    .catch(
              (error)=>{
                  console.log(`Could not fetch randUser: ${error}`);
                  fetchSportsmans();
              }
    );
}

function parseSportsmans(text){
    contestants = new Array();
    var jsonObj = JSON.parse(text);
    var jsonArr = jsonObj.results;
    for(let obj of jsonArr){
        let Person = {
            name: '',
            img: '',
        };
        Person.name = `${obj.name.first} ${obj.name.last}`;
        Person.img = obj.picture.large;
        contestants.push(Person);
    }
}

function set_layout(){
    /**都是套用相同style所以使用同classname，依 parent的 child實際數量設定內容*/
    var layout = document.getElementById('layout');
    var robotList = layout.querySelectorAll('.robot');
    for(let i=0; i<robotList.length; i++){
        let person = contestants.at(i);
        let robot = robotList.item(i);
        robot.dataset.chassisNo = i;//Identify of robotList member
        robot.addEventListener('click', pickBotEvent);
        let robotImg = robot.firstElementChild;
        let robotH3 = robotImg.nextElementSibling;
        robotImg.src = person.img;
        robotH3.textContent = person.name;
    }

}

function pickBotEvent(event){
    /**設定 dialog內容並顯示*/
    var identify = event.currentTarget.dataset.chassisNo;
    var targetName = document.getElementById('targetName');
    targetName.textContent = contestants.at(identify).name;
    document.getElementById('chooseConfirm').showModal();
}

function set_chooseConfirm(){
    var dialog = document.getElementById('chooseConfirm');
    dialog.addEventListener('close', initiateArena);
}

function initiateArena(event){
    if(event.currentTarget.returnValue != 'ok')
        return;

    let targetname = document.getElementById('targetName').textContent
    let identify = contestants.findIndex(isMember, targetname);
    let profile = contestants.at(identify);
    window.localStorage.setItem(Key.img, profile.img);
    window.localStorage.setItem(Key.warrior, profile.name);
    let onboarded = window.localStorage.getItem(Key.onArena);//arena.htm中設定當 reload of arena.html消失 
    if(onboarded == null && arenaPage == null){
        arenaPage = window.open('arena.html', '_blank');//當index.html reload消失
        arenaPage.focus();
    }else{
        try{
            if(arenaPage.closed){
                arenaPage = window.open('arena.html', '_blank');
                arenaPage.focus();
            }else if(!arenaPage.closed){
                arenaPage.window.close();
                arenaPage = window.open('arena.html', '_blank');
                arenaPage.focus();
            }
        }catch(error){
            var onresume = localStorage.getItem(Key.onArena);
            if(onresume == true){
                localStorage.removeItem(Key.onArena);
                arenaPage = null;
            }else{
                localStorage.clear();
                arenaPage = null;
            }
            alert('您推遲了一場對戰');
        }
    }
}

function setPassiveBot(){
    var passive = localStorage.getItem(Key.passive);
    if(passive){//a robot down
        let name = localStorage.getItem(Key.OBname);
        let identify = contestants.findIndex(isMember, name);
        let obset =  sessionStorage.getItem(Key.OBset);//already idle robots
        if(obset){
            obset += `${identify},`;
            sessionStorage.setItem(Key.OBset, obset);
        }else{
            sessionStorage.setItem(Key.OBset, `${identify},`);//recod idle of robot
        }
        
        obset =  sessionStorage.getItem(Key.OBset);
        let arr = obset.split(',');
        arr = arr.filter((element, index) => element != '' );
        let set = new Set(arr);/**deduplication*/

        let layout = document.getElementById('layout');
        let robotList = layout.querySelectorAll('.robot');
        for(let num of set.values()){
            let robot = robotList.item(num);
            robot.classList = `robot`;
            robot.classList.toggle('robot-passive');
            robot.removeEventListener('click', pickBotEvent);
        }
        localStorage.removeItem(Key.passive);

    }else{
        
        let obset =  sessionStorage.getItem(Key.OBset);
        if(obset){
            let identifyArr = obset.split(',');
            identifyArr = identifyArr.filter((element, index) => element != '' );
            let set = new Set(identifyArr);
            let layout = document.getElementById('layout');
            let robotList = layout.querySelectorAll('.robot');
            for(let n of set.values()){
                let robot = robotList.item(n);
                robot.classList = `robot`;
                robot.classList.toggle('robot-passive');
                robot.removeEventListener('click', pickBotEvent);
            }
        }
    }
}

function isMember(element, index, array){
    if(this.length == 1)
        return index == this;
    else
        return element.name == this;
}

