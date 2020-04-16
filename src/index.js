import express from "express";
import config from './config';
import router from './router'; 

let _server;

const server = {
	start() {
		const app = express();

		// config
        config(app);
		//router
        router(app);
        //server
		_server = app.listen(process.env.PORT, () => {
			if (process.env.NODE_ENV !== "test") {
                console.log("Server open at http://localhost:3333");
                console.log("Workspace: " , __dirname);
                
			}
		});
	},
	close() {
		_server.close();
	}
};

export default server;

if (!module.parent) {
	server.start();
}
