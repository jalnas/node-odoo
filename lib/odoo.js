const xmlrpc = require("xmlrpc");

class Odoo {
  #profile;
  #xmlrpc;
  #connected = false;
  #uid;

  connect() {
    this.xmlrpc = xmlrpc.createClient({
      host: this.profile.host,
      port: this.profile.port,
      path: "/xmlrpc/2/common",
    });

    if (this.profile.ssl) {
      this.xmlrpc.isSecure = true;
    }

    return new Promise((resolve, reject) => {
      this.xmlrpc.methodCall(
        "authenticate",
        [this.profile.db, this.profile.username, this.profile.password],
        (error, uid) => {
          if (error) {
            reject(error);
          } else {
            this.connected = true;
            this.uid = uid;
            resolve(uid);
          }
        }
      );
    });
  }

  #execute_kw(model, method, params) {
    if (this.xmlrpc.options.path != "/xmlrpc/2/object") {
      this.xmlrpc.options.path = "/xmlrpc/2/object";
    }

    return new Promise((resolve, reject) => {
      this.xmlrpc.methodCall(
        "execute_kw",
        [
          this.profile.db,
          this.uid,
          this.profile.password,
          model,
          method,
          ...params,
        ],
        (error, value) => {
          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        }
      );
    });
  }

  constructor(profile) {
    this.profile = profile;
  }

  search(model, filters, offset, amount) {
    return this.execute_kw(model, "search", [filters, offset, amount]);
  }
  // set() {}
  // get() {}
  // read() {}
  // browse() {}
  // create() {}
  // unlink() {}
  // call() {}
}

module.exports = Odoo;
