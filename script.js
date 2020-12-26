function Platform(p) {
    platform = p;
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
}