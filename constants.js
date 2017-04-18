function define(name, value) {
  Object.defineProperty(exports, name, {
    value:      value,
    enumerable: true
  });
}

// db
define("DB_USER", "root");
define("DB_PWD", "mongoadmin");
define("DB_PROTOCOL", "mongodb://");
define("DB_INSTANCE", "@ds033133.mlab.com:33133/task-db");