const path = require("path");
const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const handlebars = require("handlebars");
const route = require("./routes");

require("dotenv").config();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Template engine
app.engine("hbs", engine({ extname: ".hbs" }));
app.use(express.static(path.join(__dirname)));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// * Register new helper
// * Increment index by 1
handlebars.registerHelper("inc", (index) => parseInt(index) + 1);
// * Get year from input date
handlebars.registerHelper("getYear", (inputDate) => {
    let [year] = JSON.stringify(inputDate).split("-");
    year = year.replace('"', "");
    return new handlebars.SafeString(year);
});
// * limit size of array
handlebars.registerHelper("limit", function (arr, limit) {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.slice(0, limit);
});
//  * Join array
handlebars.registerHelper("join", function(array, sep, options) {
    return array.map(function(item) {
        return options.fn(item);
    }).join(sep);
});
// * Compare value
handlebars.registerHelper('unequal', function(v1, v2, options) {
    if(v1 != v2) {
      return options.fn(this);
    }
    return options.inverse(this);
});
handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
// Routes init
route(app);

// Port configuration
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running at port ${port} ...`));
