export function GET(url, data, headers) {
  console.log('table.mock.js: POST called', 'url=', url, 'data=', data);
  return new Promise(function (resolve, reject) {
    resolve({
      "rows": [
        {
          "id": 1,
          "name": "jack",
          "family": "hanson",
          "city": "darwin",
          "score": 600
        },
        {
          "id": 2,
          "name": "peter",
          "family": "street",
          "city": "sydney",
          "score": 200
        },
        {
          "id": 3,
          "name": "joe",
          "family": "larson",
          "city": "sydney",
          "score": 300
        },
        {
          "id": 4,
          "name": "simon",
          "family": "long",
          "city": "perth",
          "score": 400
        },
        {
          "id": 5,
          "name": "abraham",
          "family": "blue",
          "city": "sydney",
          "score": 500
        }
      ],
      "columns": [
        {
          "property": "id",
          "header": {
            "label": "id"
          },
          "sortable": false
        },
        {
          "property": "name",
          "header": {
            "label": "name"
          },
          "sortable": true
        },
        {
          "property": "family",
          "header": {
            "label": "family"
          },
          "sortable": true
        },
        {
          "property": "city",
          "header": {
            "label": "city"
          },
          "sortable": true
        },
        {
          "property": "score",
          "header": {
            "label": "score"
          },
          "sortable": true
        }
      ]
    });
  });
}