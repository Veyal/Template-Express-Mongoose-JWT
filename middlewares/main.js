const jwt = require('jsonwebtoken');

authenticated = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.jwt_key, (err, decoded) => {
            if (err) {
                res.sendStatus(401);
                return;
            }
            req.body.userId = decoded.id;
            next();
        })
    } else {
        res.sendStatus(401);
        return;
    }
}

requiredParams = (params) =>{
    return (req,res,next)=>{
        params.forEach(p => {
            if(!req.body[p]){
                res.sendStatus(422);
                return;
            }
        });
        next();
    }
}



module.exports = {
    authenticated,
    requiredParams
}
