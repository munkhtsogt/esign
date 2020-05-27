const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signatureSchema = Schema({ 
    full_name: { type: String, required: true},
    signature: { type: String },
    image: { type: String, required: true},
},{
    timestamps: true
});

module.exports = mongoose.model('Signature', signatureSchema);
