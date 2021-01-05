function Platform(p) {  // Runs when a platform is selected or the page is run with user's preferences
    platform = p;
    
    for (var l of document.getElementsByClassName("selected")){ // Removes the color from previous platform
        l.setAttribute("class", "");
    }
    document.getElementById(`${p}`).setAttribute("class", "selected");  // Change color of platform to selected platform

    localStorage.setItem("Platform", p);    // Store user's platform preference

    fetch(`https://api.warframestat.us/${platform}/news`) // Fetch news
        .then(res => res.json())
        .then((data) =>
        {
            let output = '';
            let newscount = 0;
            data.forEach(function(news){
                newscount += 1; // Counts News
                output += `
                <div class="news">
                <a href="${news.link}">${news.message}</a>
                <p>${news.eta}</p>
                <img src="${news.imageLink}" alt="${news.message}">
                </div>`
            })

            document.getElementById('outputNews').innerHTML = output;
            document.getElementById('newsTitle').innerHTML = `News (${newscount})`;
        });

    fetch(`https://api.warframestat.us/${platform}/alerts`) // Fetch Alerts
        .then(res => res.json())
        .then((data) => 
        {
            let output = '';
            let alertcount = 0;
            data.forEach(function(alert){
                let rewards = '';
                let rewardcount = 0;
                alertcount += 1;    // Counts Alert
                alert.mission.reward.items.forEach(function(items){
                    rewardcount += 1;   // Counts Rewards
                    if (items.search("Forma") != -1){                                   // Changes Reward color based on Reward type
                        rewards +=`<p style="color:DarkGoldenRod">${items}</p>`         //
                    } else if (items.search("Orokin Catalyst") !== -1) {                //
                        rewards +=`<p style="color:Aquamarine">${items}</p>`            //
                    } else if (items.search("Orokin Reactor") !== -1) {                 //
                        rewards +=`<p style="color:LightGoldenRodYellow">${items}</p>`  //
                    } else {                                                            //
                        rewards +=`
                        <p>${items}</p>`                                                
                    }
                });
                rewards +=`<p>${alert.mission.reward.credits}cr` //Credits(cr) given by mission (not counted as reward)
                let expirydate = alert.expiry.split("T"); // Removes the Time as we only want the date
                output +=`
                <div class="alerts">
                <h3>${alert.mission.description}</h3>
                <p>Ends on ${expirydate[0]}</p>
                <p>Node: ${alert.mission.node}</p>
                <p>Mission: ${alert.mission.type} | Enemy Level: ${alert.mission.minEnemyLevel}-${alert.mission.maxEnemyLevel}</p>
                <p>Faction: ${alert.mission.faction}</p>
                <p>Rewards (${rewardcount})</p>
                ${rewards}
                </div>`;    //Add rewards to the bottom of the Alert
            });
            document.getElementById('outputAlert').innerHTML = output;
            document.getElementById('alertTitle').innerHTML = `Alerts (${alertcount})`; //Change the title to display number of alerts
        })

    document.getElementById('cycleTitle').innerHTML = 'Cycles';
    document.getElementById('outputCycle').innerHTML = ''; //Clear preexisting output if any
    fetch(`https://api.warframestat.us/${platform}/cetusCycle`) // Fetch Cycle(s)
        .then(res => res.json())
        .then((data) =>
        {
            let output =`
            <div class="Cycle" id="cetusCycle">
            <h3>Cetus Cycle</h3>
            <p>Current Cycle: ${data.state}</p>
            <p>${data.shortString}</p>
            </div>`;
            document.getElementById('outputCycle').innerHTML += output; //Use += instead of = as it will override other cycles
        });
    
    fetch(`https://api.warframestat.us/${platform}/cambionCycle`) // Fetch Cycle(s)
    .then(res => res.json())
    .then((data) =>
    {   
        let output =`
        <div class="Cycle" id="cambionCycle">
        <h3>Cambion Drift Cycle</h3>
        <p>Current Cycle: ${data.active}</p>
        </div>`;
        document.getElementById('outputCycle').innerHTML += output; //Use += instead of = as it will override other cycles
    });

    fetch(`https://api.warframestat.us/${platform}/vallisCycle`) // Fetch Cycle(s)
    .then(res => res.json())
    .then((data) =>
    {
        let output =`
        <div class="Cycle" id="vallisCycle">
        <h3>Orb Vallis Cycle</h3>
        <p>Current Cycle: ${data.state}</p>
        <p>${data.shortString}</p>
        </div>`;
        document.getElementById('outputCycle').innerHTML += output; //Use += instead of = as it will override other cycles
    });

    document.getElementById('sortieTitle').innerHTML = "Sorties";
    fetch(`https://api.warframestat.us/${platform}/sortie`) // Fetch Sortie
    .then(res => res.json())
    .then((data) =>
    {
        let output = `
        <div class="sorties">
        <h3>${data.faction} - ${data.boss}</h3>
        <p>Ends in ${data.eta}</p>`;
        data.variants.forEach(function(v) {
            output +=`
            <div class="sortieMission">
            <h3>${v.node} | ${v.missionType}</h3>
            <p>${v.modifierDescription}</p>
            </div>`;
        });
        output += `</div>`;
        document.getElementById('outputSortie').innerHTML = output;
    });

    document.getElementById('fissureTitle').innerHTML = "Fissures";
    fetch(`https://api.warframestat.us/${platform}/fissures`) // Fetch Fissures
    .then(res => res.json())
    .then((data) =>
    {
        let output = "";
        data.forEach(function(fissure){
            output += `
            <div class="fissures ${fissure.tier}">
            <h3>${fissure.tier} Fissure</h3>
            <p>${fissure.node}</p>
            <p>${fissure.enemy} ${fissure.missionType}</p>
            <p>${fissure.eta} left</p>
            </div>
            `
        });
        document.getElementById('outputFissures').innerHTML = output;
    });
}

function ddnews() { // Open / Close News
    let o = document.getElementById("outputNews")
    if (o.style.display == "none")
    {
        o.style.display = "flex";
        localStorage.setItem("News", "flex");
    } else {
        o.style.display = "none";
        localStorage.setItem("News", "none");
    }
}

function ddalert() {    // Open / Close Alert
    let o = document.getElementById("outputAlert")
    if (o.style.display == "none")
    {
        o.style.display = "flex";
        localStorage.setItem("Alert", "flex");
    } else {
        o.style.display = "none";
        localStorage.setItem("Alert", "none");
    }
}

function ddcycle() {    // Open / Close Cycle
    let o = document.getElementById("outputCycle")
    if (o.style.display == "none")
    {
        o.style.display = "flex";
        localStorage.setItem("Cycle", "flex");
    } else {
        o.style.display = "none";
        localStorage.setItem("Cycle", "none");
    }
}

function ddsortie() {   // Open / Close Sortie
    let o = document.getElementById("outputSortie")
    if (o.style.display == "none")
    {
        o.style.display = "block";
        localStorage.setItem("Sortie", "block");
    } else {
        o.style.display = "none";
        localStorage.setItem("Sortie", "none");
    }
}

function ddfissures() { // Open / Close Fissure 
    let o = document.getElementById("outputFissures")
    if (o.style.display == "none")
    {
        o.style.display = "flex";
        localStorage.setItem("Fissures", "flex");
    } else {
        o.style.display = "none";
        localStorage.setItem("Fissures", "none");
    }
}

let p = localStorage.getItem("Platform") //Runs when page refreshes or is opened (This is to remember users preferences and loads preferences the next time he/she opens the page)
if (p != null) {
    console.log(p);
    Platform(p);
    document.getElementById("outputNews").style.display = localStorage.getItem("News");
    document.getElementById("outputAlert").style.display = localStorage.getItem("Alert");
    document.getElementById("outputCycle").style.display = localStorage.getItem("Cycle");
    document.getElementById("outputSortie").style.display = localStorage.getItem("Sortie");
    document.getElementById("outputFissures").style.display = localStorage.getItem("Fissures");
    document.body.style.backgroundImage = `url("./BackgroundImages/${localStorage.getItem("BG")}.jpg")`;
}

function openNav() {
    document.getElementById("mainsidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mainsidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
} 

function redirWarframe() {  // Warframe logo redirects to official website
    location.href = "https://Warframe.com";
}

let bgrotation = 0; // Cycle Through Folder BackgroundImages and saves the image number for the user when he/she opens website again
function backgroundchange() {
    bgrotation += 1;
    localStorage.setItem("BG", `${bgrotation}`);
    document.body.style.backgroundImage = `url("./BackgroundImages/${bgrotation}.jpg")`;
    if (bgrotation === 7) {
        bgrotation = 0;
    }
}

/* User has to double click in case he/she didn't want to reset preference */
let clearconfirm = false;
function clearstorage() {
    document.getElementById("clear").innerHTML = "Confirm";
    if (clearconfirm == true) {
        localStorage.clear();
        location.reload();
    }
    clearconfirm = true;
}