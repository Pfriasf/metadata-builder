require('dotenv').config();

const fs = require("fs");
const path = require("path")


const imageFolder = path.join(__dirname, "build/images")
const jsonFolder = path.join(__dirname, "build/json")
const collectionName = process.env.COLLECTION_NAME
const urlBase = process.env.EXTERNAL_URL_BASE
const edition = process.env.EDITION
const contentIdentifier = process.env.CID
const collectionPath = collectionName.replace(/\s/g, '-').toLowerCase();


const metadata = [];

if (!fs.existsSync(imageFolder)){
  fs.mkdirSync(imageFolder, { recursive: true });
}

if (!fs.existsSync(jsonFolder)){
  fs.mkdirSync(jsonFolder, { recursive: true });
}

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

    let iaTrait = {
      trait_type:"",
      value: ""
    }

    let name = path.parse(`${imageFolder}/${file}`).name
    let baseName = path.parse(`${imageFolder}/${file}`).base

    let nftName = `${collectionName} #${name}`
    nftMetadata.name = nftName
    nftMetadata.description = `Design #${name} of ${collectionName} collection`
    nftMetadata.image = `${contentIdentifier}/${baseName}`

    
    fs.readFile("iaTags.json", "utf8", (err, data) => {
      if (err) throw err;
      let json = JSON.parse(data)
      iaTrait.trait_type = "pattern_and_shape"
      iaTrait.value = json[baseName][0]
    })

    iaTrait.value 

    nftMetadata.atributes.push(iaTrait)
    
    if (edition) {
      nftMetadata.external_url = `${urlBase}/${collectionPath}/${edition}/${name}`
    } else {
      nftMetadata.external_url = `${urlBase}/${collectionPath}/${name}`
    }

    fs.writeFile(`${jsonFolder}/${name}.json`, JSON.stringify(nftMetadata), function(err) {
      if (err) throw err;
      console.log(`File ${name}.json created`)
    })

    metadata.push(nftMetadata)
  
    if(files.length -1 == i){
      fs.writeFile(`${jsonFolder}/_metadata.json`, JSON.stringify(metadata), function(err) {
        if (err) throw err;
        console.log("_metadata.json created")
      })
    }
  })
})