const {RPCAgent} = require("chia-agent")
const {get_plots} = require("chia-agent/api/rpc/harvester")
const agent = new RPCAgent({service: "harvester"})

let plots
let plotsPromise

const args = process.argv.slice(2)

function getPlots(){
    console.log("Loading plots...")
    return new Promise((resolve, reject) => {
        get_plots(agent).then((response) => {
            plots = response.plots;
            console.log("Plots loaded.")
            resolve();
        })
    });
}

function showAllPlots(){
    for (let plot of plots){
        console.log("Name: "+plot.filename)
        console.log("Size: "+plot.size)
        console.log("Plot ID: "+plot.plot_id)
        console.log("Pool public key: "+plot.pool_public_key)
        console.log("Pool contract puzzle hash: "+plot.pool_contract_puzzle_hash)
        console.log("Plot public key: "+plot.plot_public_key)
        console.log("Time created/modified: "+plot.time_modified)
        console.log("")
    }
}

function showInfo(){
    console.log("Chia harvester reported "+plots.length+" plots.")
    let uniquePc = []
    let nftNum = 0;
    let ogNum = 0;
    for (let plot of plots){
        if(plot.pool_contract_puzzle_hash == null){
            ogNum = ogNum + 1;
        }
        else{
            nftNum = nftNum + 1;
            if(!uniquePc.includes(plot.pool_contract_puzzle_hash)){
                uniquePc.push(plot.pool_contract_puzzle_hash)
            }
        } 
    }
    console.log(uniquePc.length+" unique pool contract adresses")
    console.log(nftNum+" NFT plots ("+(nftNum/plots.length*100).toFixed(2)+"%)")
    console.log(ogNum+" OG plots ("+(ogNum/plots.length*100).toFixed(2)+"%)")
}

function showAllOgPlots(){
    for (let plot of plots){
        if(plot.pool_contract_puzzle_hash == null){
            console.log(plot.filename)
        }
    }
}

switch (args[0]) {
    case '-h':
        console.log("Usage:")
        console.log("node app.js [OPTION]")
        console.log("")
        console.log("Available options:")
        console.log("-h         Show help")
        console.log("-a         Show all plots and all their info")
        console.log("-og        Show list of all OG plots paths")
        break;
    case '-a':
        plotsPromise = getPlots()
        plotsPromise.then(() => {
            showAllPlots();
        })
        break;
    case '-og':
        plotsPromise = getPlots()
        plotsPromise.then(() => {
            showAllOgPlots();
        })
        break;
    default:
        plotsPromise = getPlots()
        plotsPromise.then(() => {
            showInfo();
        })
}