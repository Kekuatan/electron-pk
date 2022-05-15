// cat.js

// constructor function for the Cat class
class ConfigEnum {
    constructor() {
        this.auth = {
            // Local
            'client_id': "964c7635-cd49-4944-a9a9-2431009fcea4",
            'client_secret': 'u1D2CfAGgElazNMjWajtKUNetfoh0TkgxTkzMxuL',


            // Server Sun
            // 'client_id': "96122656-f61d-48b5-b361-313f57f1f574",
            // 'client_secret': 'YcOqoWKScsD1YA3QWud6htiZScG9q0pAPFINrJJZ'
        }
        // this.base_url = 'http://192.168.110.38';
        this.base_url = 'http://parkir-server.test';
        this.area_position_in_id = '1';
        this.access_token = null
    }
}


// now we export the class, so other modules can create Cat objects
module.exports = {
    ConfigEnum: new ConfigEnum ()
}
