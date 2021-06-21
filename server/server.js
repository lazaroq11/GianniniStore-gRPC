const PROTO_PATH = "./guitar.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var guitarProto = grpc.loadPackageDefinition(packageDefinition);

const{v4:uuidv4} = require("uuid");

const server = new grpc.Server();

const guitars = [
    {
        id:"c7688793-1956-42dd-ad41-ffc32e52b7c1",
        name: "Giannini Acústico Start N14",
        model:"Violão",
        corda: "Nylon",
        material:"Basswood"

    },

    {
        id:"c7688793-1956-42dd-ad41-ffc32e52b7c5",
        name: "Stratocaster Elétrica Waldman Gtu-1",
        model:"Guitarra",
        corda: "Aço",
        material:"Hard Wood"

    },

];

server.addService(guitarProto.GuitarService.service,{
    getAll: (_, callback)=> {
        callback(null, {guitars });
    },

    get: (call,callback)=> {
        let guitar = guitars.find(n => n.id == call.request.id);

        if(guitar) {
            callback(null,guitar);
        }else{
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Instrumento não encontrado"
            });
        }
    },

    insert: (call,callback) => {
        let guitar = call.request;

        guitar.id = uuidv4();
        guitars.push(guitar);
        callback(null,guitar);
    },

    update: (call,callback)=>{
        let existingGuitar = guitars.find(n=>n.id == call.request.id);

        if(existingGuitar) {
            existingGuitar.name = call.request.name;
            existingGuitar.model = call.request.model;
            existingGuitar.corda = call.request.corda;
            existingGuitar.material = call.request.material;
            callback(null,existingGuitar);
        }else{
            callback({
                code:grpc.status.NOT_FOUND,
                details: "Instrumento não encontrado"
            });
        }
    },

    remove: (call,callback)=>{
        let existingGuitarIndex = guitars.findIndex(
            n=>n.id == call.request.id
        );

        if(existingGuitarIndex != -1){
            guitars.splice(existingGuitarIndex,1);
            callback(null, {});
        }else{
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Instrumento não encontrado"
            });
        }
    }
});


server.bind("127.0.0.1:30043",grpc.ServerCredentials.createInsecure());
console.log("Listening at http://127.0.0.1:30043");
server.start();