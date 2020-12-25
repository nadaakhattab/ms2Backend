const jwt= require('jsonwebtoken');

module.exports= (req, res, next)=>{
try{
        const accessToken= req.headers.authorization;
        console.log("Access Token"+accessToken);
        if(accessToken)  
        {
        try{    
        const payload=jwt.verify(accessToken,global.accessKey);
        req.headers.payload=payload;
        return next();
    }
        catch(error){
        console.log('Error'+error);
         return res.status(400).send('Expired Token');
    }
            
        }
        else {
            console.log("denied");
            return res.status(401).send('Access deined')
        }
    }
    catch(error){
        return res.status(500).send(error.message);
    }
}