module.exports={

    mysqlHandler: (query, params, connection, callback) => {

        connection.execute(query, params,
            function(err, results, fields) {
                if(err) {
                    callback(err, null);
                } else {
                    callback(false, results);
                }
            }
        )
    }
}