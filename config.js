module.exports = {
	server_port: 3000,
	databaseUrl: 'mongodb://localhost:27017',
	dbInfo: [
	    {db_Name:'suicide', collection:'dictionary', schemaName:'UserSchema', modelName:'UserModel'}
	],
	route_info: [
	    //===== dictionary =====//
        {file:'./dictionary', path:'/process/allWord', method:'findAllDocuments', type:'get'},
	    {file:'./dictionary', path:'/process/word', method:'searchWord', type:'post'}					
	]
}