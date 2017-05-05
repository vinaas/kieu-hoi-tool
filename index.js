const _ = require('lodash');
var fs = require('fs');

function HtmlTableConvertor(config) {
    config = config || {};
    if (typeof config !== 'object')
        return TypeError('config invalid ');
    this.jsonPath = config.jsonPath;
    this.files = [];
    this.jsonData = {};
    this.outPath = config.outPath || './out';

}
HtmlTableConvertor.prototype.loadData = function () {
    this.jsonData = require(`./${this.jsonPath }`);
    return this;
}

HtmlTableConvertor.prototype.normalizeJsonData = function () {
    var data = this.jsonData.mockup.controls.control;
    this.jsonData = data.filter(x => x.typeID && x.typeID == 'DataGrid');
    // console.log(this.jsonData);
    return this;
};

HtmlTableConvertor.prototype.tofiles = function () {
    this.files = this.jsonData.map(x => {
        let file = {};
        file.name = x.ID;
        var data = processCsv(x.properties.text);
        // console.log(data);
        file.header = data.shift();
        file.body = data;
        return file;
    })
    return this;
}

HtmlTableConvertor.prototype.write = function () {
    this.files = this.files.map((file) => {
            var strHeader = '';
            file.header.split(',').forEach(function (v, i, a) {
                strHeader += `<th>${v}</th>
                `
            });
            var strBody = '';
            file.body.forEach(function (tr, i, a) {
                var strtd = '';
                tr.split(',').forEach(function (td, i, a) {
                    strtd += `<td class="v-align-middle">${td}</td>
                    `
                })
                strBody += ` <tr>${strtd}</tr>
                `
            })
            var strTable = `<table class="table">
                                <thead>
                                <tr>${strHeader}
                                </tr>
                                </thead>
                                <tbody>${strBody}
                                </tbody>
                            </table>`;
            file.html = strTable;

            return file;

        }



    )
    this.files.forEach((file) => {
        fs.writeFile(`${this.outPath}/${file.name}.html`, file.html, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log(`The file ${file.name}.html was saved!`);
        });

    })

    return this;


}
var processCsv = function (str) {
    var list = str.split('\n');
    return list.map(x => unescape(x.replace(/\\,/g, ';'))).filter(x => (x !== ' ' && (/{0,0/.test(x) == false)));
}

var htmlConvertor = new HtmlTableConvertor({
    jsonPath: "data.json"
});

htmlConvertor.loadData().normalizeJsonData().tofiles().write();