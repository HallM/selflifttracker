class Database {
    constructor(sheetApi, spreadsheetId, models) {
        // this is generally gapi.client.spreadsheets unless faked.
        this._sheetApi = sheetApi;
        this._spreadsheetId = spreadsheetId;
        // Map of model name to QueryModels
        this._models = models;
    }
    From(modelName) {
        return this._models[modelName];
    }
}

class QueryModel {
    constructor(db, sheetId, fieldCols, indices) {}
    Select(fields) {
        return new SelectModel(this, fields);
    }
    Insert(fieldValues) {}
    Remove(id) {}
    Update(id, fieldValues) {}
    BatchInsert(multiFieldValues) {}
    BatchRemove(ids) {}
    BatchUpdate(idToFieldValues) {}
}

class SelectModel {
    constructor(queryModel, fields) {}
    Index(indexName) {}
    Where(fieldConditionMap) {}
    Limit(quantity) {}
    Offset(amount) {}
    Query() {}
}

class Col {
    constructor(name, type) {
        this._name = name;
        this._type = type;
        this._index = -1;
    }
    setIndex(index) {
        this._index = index;
    }
}

class ModelBuilder {
    constructor(name) {
        this._name = name;
        this._cols = [];
    }
    Column(name, type) {
        this._cols.push(new Col(name, type));
        return this;
    }
    Index(name) {
        return new IndexBuilder(name);
    }
    build(db) {
        // find sheet
        // if not exists, make new one
        // check headers
        // fail if sheet is just way too different
        // map headers/col numbers to field names
        // add new headers if needed
        // then do the same for index
        const fieldCols = {};
        Promise.all()
        return new Promise((resolve, reject) => {
            resolve(new QueryModel(this, db, fieldCols));
        });
    }
}

class IndexBuilder {
    constructor(name) {
        this._name = name;
        this._groups = [];
        this._values = [];
        this._sorts = [];
        this._filters = [];
        this._indexBuilders = [];
    }

    Group(name) {}
    Value(name, formula) {}
    Computed(name, formula) {}
    Filterable(field) {}
    Sortable(field, direction) {}

    // There's no indexmodel, just returns the name of the sheet.
    build(db, modelsheet) {
        // basically same as the model builder
        // but with pivot tables.
        // need to check that the pivot table settings match the query
        // I think we are safe to just force re-build the pivot table if we have to
        // I'd like to let users add their own columns but eh
        const fieldCols = {};
        return new Promise((resolve, reject) => {
            resolve(this._name);
        });
    }
}

function Model(modelName) {
    return new ModelBuilder(modelName);
}

function NewDatabase(name, models) {}

function ConnectDatabase(sheetURL, models) {
    const loadedModels = {};
    const modelLoaders = Object.keys(models).map(m => {
        return m.build().then(loaded => loadedModels[m._name] = loaded);
    });
    return Promise.all(modelLoaders).then(() => {
        return new Database(sheetapi, id, loadedModels);
    });
}

const Types = {
    Date: 'date',
    DateTime: 'datetime',
    String: 'string',
    Float: 'float',
    Int: 'int',
};

const Methods = {
    Add: (a, b) => `${a}+${b}`,
    Sub: (a, b) => `${a}-${b}`,
    Mul: (a, b) => `${a}*${b}`,
    Div: (a, b) => `${a}/${b}`,

    Greater: (a, b) => `${a} > ${b}`,
    GreaterEqual: (a, b) => `${a} >= ${b}`,
    Less: (a, b) => `${a} < ${b}`,
    LessEqual: (a, b) => `${a} <= ${b}`,
    Equal: (a, b) => `${a} = ${b}`,
    NotEqual: (a, b) => `${a} <> ${b}`,

    Sum: (a) => `SUM(${a})`,
    Count: (a) => `COUNT(${a})`,
    Max: (a) => `MAX(${a})`,
    Min: (a) => `MIN(${a})`,
    Round: (a) => `ROUND(${a})`,

    Cond: (c, i, e) => `IF(${c}, ${i}, ${e})`,
};

module.exports = {
    Model,
    Types,
    Methods,

    ConnectDatabase,
};
