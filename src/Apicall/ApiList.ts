

const ApiList={
    productList:"/website/allproductlist",
    homeproductlist:"/website/homeproductlist",
    productCategory:"/admin/category",
    userLogin:"/authentication/customerlogin",
    logout:"/authentication/logout",
    password:"/authentication/password",
    singleProduct:"/website/singleproduct",
    addToCart:"/order/addtoCart",
    cartclear:"/order/addtoCart/cartclear",
    userpersonalinformation:"/userprofile/personalinformation",
    useraddress:"/userprofile/address",
    placeorder:"/order/customerorder",
    ordercancel:"/order/ordercancel",
    increaseQuantity:"/order/increaseQuantity",
    token:"/token",
    productrating:"/products/rating",
    webdetails:"/website/admincontactdetails",
    like:"/website/likebycustomer",



    //registration
    registerotp:"/website/registration/getOTPbyEmail",
    registerotpverification:"/website/registration/otpverification",
    register:"/website/registration/register",
    forgotpassword:"/authentication/forgotpassword",
    changepassword:"/authentication/changepassword",
    otplogin:"/authentication/otplogin",




    //carausel
    webcarausel:"/website/carausel/webcarausel",
    mobilecarausel:"/website/carausel/mobilecarausel",



    //order
    billinglist:"/website/BillGeneration",





}

export default ApiList