const fs = require('fs')
module.exports = (csvFileName) => {
    let list = []
    let data = fs.readFileSync(csvFileName).toString().split('\n')
    let headers = data.shift().split(',')
    headers = headers.map(x => x.trim())
    data.forEach( d => {
        let obj = {}
        let line = d.split(',')
        line = line.map(x => x.trim())

        headers.forEach( (header, i) => {
            obj[headers[i]] = line[i]
        })
        obj.createdAt = new Date
        obj.updatedAt = new Date

        console.log(obj);
        
        list.push(obj)
    })

    return list
}