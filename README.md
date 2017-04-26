# kieu-hoi-tool
## install
`npm i`
## use

```json
var htmlConvertor = new HtmlTableConvertor({
    "jsonPath": "data.json"
});

htmlConvertor.loadData().normalizeJsonData().tofiles().write();
```