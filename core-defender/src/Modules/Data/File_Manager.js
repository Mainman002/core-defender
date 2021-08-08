export default class File_Manager{
    constructor(){
    }


    loadFile(_file){
        let myInit = { method: 'GET',
        headers: {
            'Context-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'default' };

        let myRequest = new Request(_file, myInit);

        fetch(myRequest)
        .then(function(resp){
        return resp.json();
        })
        .then(function(data){
        console.log(data);
        })
    }

    
}