module.exports={

    respond: (res,error,data,message) => {
        res.send({
            error: error, 
            data: data, 
            message: message
        })
    }
}