const fs = require("fs");
const path = require("path")

const imageFolder = path.join(__dirname, "images")
const jsonFolder = path.join(__dirname, "json")
const namePrefix = "Custo Barcelona"
const metadata = [];

fs.readdir(imageFolder, (err, files) => {
  if (err) throw err;
  
  files.forEach((file, i) => {

    let nftMetadata = {
      name:"",
      description:"",
      image:"",
      external_url:"",
      atributes:[],
    }

    let name = path.parse(`${imageFolder}/${file}`).name
    let nftName = `${namePrefix} #${name}`
    nftMetadata.name = nftName

    fs.writeFile(`${jsonFolder}/${name}.json`, JSON.stringify(nftMetadata), function(err) {
      if (err) throw err;
    })

    metadata.push(nftMetadata)
  
    if(files.length -1 == i){
      fs.writeFile(`${jsonFolder}/_metadata.json`, JSON.stringify(metadata), function(err) {
        if (err) throw err;
      })
    }
  })
})