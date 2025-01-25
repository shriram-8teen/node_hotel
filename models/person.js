const mongoose=require('mongoose');
//define person schema
const personSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],
        require:true,
    },
    mobile:{
        type:Number,
        require:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    address:{
        type:String,
    },

});
const person=mongoose.model('person',personSchema);
module.exports=person;