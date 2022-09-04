import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import axios from 'axios';
import Jimp from 'jimp';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage", async(req:express.Request, res:express.Response) => {
    try
    {
      const { image_url } = req.query as { image_url: string };

      if (!image_url){
      res.status(400).send({message: 'URl is empty, try GET /filteredimage?image_url={}'});
      } 
      else {
        await filterImageFromURL(image_url).then( function (filteredpath){
          res.status(200).sendFile(filteredpath, () => {       
            deleteLocalFiles([filteredpath]);       
          });   
        }).catch(function(err){
          res.status(400).send({message: "Bad Request Error"});
        });  
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'server error' });
    }
  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();