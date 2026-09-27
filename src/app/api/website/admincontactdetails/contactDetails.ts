import mongoose from "mongoose";



const contactDetails = new mongoose.Schema({
    mobile:String,
    emailid:String,
    storename:String,
    locationMap:String,
    facebookLink:String,
    instatgramLink:String,
    twitterLink:String,
    fulladdress:String,
    copyrightDetails:String,
    developerInformation:String,
    storelogo:String
})

const detailsModel = mongoose.models.contactdetails || mongoose.model("contactdetails", contactDetails)

export default detailsModel