const{validateToken}= require('../services/authentication');
function checkForCookies(cookieName){
    return(req, res, next) => {
       const tokenCookieValue= req.cookies[cookieName];
       if(!tokenCookieValue){
        res.locals.user = null;
        return next();
       }
       try{
        const payload= validateToken(tokenCookieValue);
        req.user= payload;
        res.locals.user = payload;
       }
       catch (error) {
        res.locals.user = null;
       }
       return next();
    }
}

module.exports= checkForCookies;