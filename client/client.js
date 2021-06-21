const PROTO_PATH = "../guitar.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");


var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const GuitarService = grpc.loadPackageDefinition(packageDefinition).GuitarService;

const client = new GuitarService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = client;