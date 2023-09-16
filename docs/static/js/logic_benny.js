// API base URL
// Run Flask server first: python flash_server.py
let api_url = 'https://spiderdwarf.pythonanywhere.com/api/v1.0/';
//let api_url = 'http://127.0.0.1:5000/api/v1.0/'

// Global variable
let top_N = 5;
let all_male_actor = {}
let all_female_actor = {}
let top_male_actor = {}
let top_female_actor = {}

function TopNSelect(value) {
    top_N = value;
    updateDashboard();
}

function plotNetworth(actors, div_name) {
    // Trace for the OTU data
    let trace = {
        x: actors.Name,
        y: actors.Networth,
        type: 'bar',
        text: actors.Name
      };

    // Data array
    let data = [trace]

    console.log(actors)

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot(div_name, data)
}

// Update charts
function updateDashboard(){
    // Slice data to get Top N actors
    top_female_actor['Name'] = all_female_actor['Name'].slice(0,top_N);
    top_female_actor['Networth'] = all_female_actor['Networth'].slice(0,top_N);
    top_male_actor['Name'] = all_male_actor['Name'].slice(0,top_N);
    top_male_actor['Networth'] = all_male_actor['Networth'].slice(0,top_N);

    // Plot data
    plotNetworth(top_female_actor, "networth_female");
    plotNetworth(top_male_actor, "networth_male");
}

function payGapAnalysis(actors) {
    // Get female and male actors into lists
    female_actors = {'Name':[], 'Networth':[]};
    male_actors = {'Name':[], 'Networth':[]};

    // Loop through all actors
    for (let i = 0; i < actors.length; i++) {
        // Check if networth data is available
        if (actors[i]['Net worth']) {

            // Add name and networth for male actor 
            if (actors[i].Gender == 'Male') {
                male_actors['Name'].push(actors[i].Name);
                male_actors['Networth'].push(actors[i]['Net worth']);
            }

            // Add name and networth for female actor
            else if (actors[i].Gender == 'Female') {
                female_actors['Name'].push(actors[i].Name);
                female_actors['Networth'].push(actors[i]['Net worth']);
            }
        }
    }

    function sortActorObject(actors) {
    // Sort names and networth based on networth

        // Transform object of arrays into an array of object
        let list = [];
        for (let j = 0; j < actors['Name'].length; j++) {
            list.push({'name': actors['Name'][j], 'networth': actors['Networth'][j]});
        }
            
        // Sort the array based on networth
        list.sort((a, b) => b.networth - a.networth);

        // Transform back to an object of arrays
        for (var k = 0; k < list.length; k++) {
            actors['Name'][k] = list[k].name;
            actors['Networth'][k] = list[k].networth;
        }

        return actors;
    }

    // Sort by networth (more rich -> less rich)
    male_actors = sortActorObject(male_actors)
    female_actors = sortActorObject(female_actors)

    // Drop richest male actor (Alan Howard is an outlier)
    male_actors['Name'] = male_actors['Name'].slice(1,male_actors['Name'].length);
    male_actors['Networth'] = male_actors['Networth'].slice(1,male_actors['Networth'].length);

    // Assign to global variables
    all_male_actor = male_actors;
    all_female_actor = female_actors;

    // Update charts
    updateDashboard();
}

// Get all actors from the API
let all_movies_url = api_url + 'actors'
d3.json(all_movies_url).then(payGapAnalysis)