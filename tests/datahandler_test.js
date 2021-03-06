var nimn = require("../src/nimn");
var chars = require("../src/chars").chars;

describe("Nimn ", function () {
    var schema = {
            "name" : "string",
            "marks" : "number",
            "status" : "statustype"
    }
    
    it("should encode & decode with data handler for fixed value set with boundary char ", function () {
        var data = {
            name : "amit gupta",
            marks : 89.3,
            status : "stop"
        }
        var nimnInstance = new nimn();
        nimnInstance.addDataHandler("statustype"
            , null 
            , null 
            , { "R" : "running", "S" : "stop"}
            , false);
        nimnInstance.addSchema(schema);
        var expected = chars.objStart + "amit gupta" + chars.boundryChar + "89.3" + chars.boundryChar + "S";
        
        var nimndata = nimnInstance.encode(data);
        expect(nimndata).toEqual(expected);
        //console.log(nimndata);

        var databack = nimnInstance.decode(nimndata);
        expect(databack).toEqual(data);
        //console.log(JSON.stringify(databack));
    });

    it("should encode & decode with data handler for fixed value set without boundary char ", function () {
        var data = {
            name : "amit gupta",
            marks : 89.3,
            status : "stop"
        }
        var nimnInstance = new nimn();
        nimnInstance.addDataHandler("statustype"
            , null 
            , null 
            , { "R" : "running", "S" : "stop"}
            , true);
        nimnInstance.addSchema(schema);
        var expected = chars.objStart + "amit gupta" + chars.boundryChar + "89.3" + "S";
        
        var nimndata = nimnInstance.encode(data);
        expect(nimndata).toEqual(expected);
        //console.log(nimndata);

        var databack = nimnInstance.decode(nimndata);
        expect(databack).toEqual(data);
        //console.log(JSON.stringify(databack));
    });

    it("should encode & decode number as string", function () {
        var data = {
            name : "amit gupta",
            marks : 89.3,
            status : "stop"
        }
        var nimnInstance = new nimn();
        nimnInstance.addDataHandler("number");
        nimnInstance.addDataHandler("statustype");
        nimnInstance.addSchema(schema);
        var expected = chars.objStart + "amit gupta" + chars.boundryChar + "89.3" + chars.boundryChar + "stop";
        
        var nimndata = nimnInstance.encode(data);
        expect(nimndata).toEqual(expected);
        //console.log(nimndata);

        var expected = {
            name : "amit gupta",
            marks : "89.3",
            status : "stop"
        }

        var databack = nimnInstance.decode(nimndata);
        expect(databack).toEqual(expected);
        //console.log(JSON.stringify(databack));
    });

    it("should throw error when data handler is not added for custom type", function () {
        var data = {
            name : "amit gupta",
            marks : 89.3,
            status : "stop"
        }
        var nimnInstance = new nimn();
        nimnInstance.addDataHandler("number");
        
        expect(function(){
            nimnInstance.addSchema(schema);
        }).toThrowError("You've forgot to add data handler for statustype");
        
    });

    it("should throw error when multiple data handlers are added with some common charsets", function () {
        var data = {
            name : "amit gupta",
            marks : 89.3,
            status : "stop"
        }
        var nimnInstance = new nimn();
        nimnInstance.addDataHandler("statustype"
            , null 
            , null 
            , { "R" : "running", "S" : "stop"}
            , true);
        
        

        expect(function(){
            nimnInstance.addDataHandler("statustype2"
                , null 
                , null 
                , { "R" : "running", "S" : "stop"}
                , true);
        }).toThrowError("DataHandler Error: R is not allowed. Either it is reserved or being used by another data handler");
        
    });
});