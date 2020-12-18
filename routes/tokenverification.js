const jwt= require('jsonwebtoken');

module.exports= (req, res, next)=>{

        const accessToken= req.headers.authorization;
        console.log("Access Token"+accessToken);
        if(!accessToken)  
        {
            return res.status(401).status('Access deined')
        }
        try{    

        const payload=jwt.verify(accessToken,global.accessKey);
        req.headers.payload=payload;
        next()
    }
    catch(error){
        console.log('Error'+error);
        res.status(400).send('ExpiredToken');
    }
}