const {RPCAgent} = require("chia-agent");
const {get_plots} = require("chia-agent/api/rpc/harvester");
const agent = new RPCAgent({service: "harvester"});
const response = await get_plots(agent);

console.log("Chia reported "+response.plots.length+" plots.")
console.log("-----")

for (let plot of response.plots){
    console.log("Name: "+plot.filename)
    console.log("Size: "+plot.filename)
    console.log("Plot ID: "+plot.plot_id)
    console.log("Pool public key: "+plot.pool_public_key)
    console.log("Pool contract puzzle hash: "+plot.pool_contract_puzzle_hash)
    console.log("Plot public key: "+plot.plot_public_key)
    console.log("Time created/modified: "+plot.time_modified)
    console.log("")
}