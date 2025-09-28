
const getShortCode = (len) =>{
    const chars = "1QW2ER3TY4UI5OP6AS7Dq8we9rt0yzxcvbnmFGHJKLZXCVBNMuiopasdfghjkl";
    let shortCode = "";
    for (let i = 0; i<len; i++){
        shortCode += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
    };
    return shortCode;
}
module.exports = getShortCode;