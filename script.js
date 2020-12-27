function Platform(p) {
    platform = p;

    fetch(`https://api.warframestat.us/${platform}/news`)
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

    fetch(`https://api.warframestat.us/${platform}/alerts`)
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
    fetch(`https://api.warframestat.us/${platform}/cetusCycle`)
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
    
    fetch(`https://api.warframestat.us/${platform}/cambionCycle`)
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

    fetch(`https://api.warframestat.us/${platform}/vallisCycle`)
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
    fetch(`https://api.warframestat.us/${platform}/sortie`)
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
}