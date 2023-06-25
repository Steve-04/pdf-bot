import multer from 'multer';
import { run } from '../../scripts/ingest-data'; // Import the existing run function
import { Request, ParamsDictionary, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Configure the storage for uploaded files
const storage = multer.diskStorage({
  destination: 'docs', // Specify the destination folder for storing uploaded files
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename for storage
  },
});

// Create the multer middleware
const upload = multer({ storage }).single('file');

// Define the handler for file upload
const uploadHandler = (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) => {
  upload(req, res, async (err) => {
    if (err) {
      // Handle any error that occurred during file upload
      return res.status(500).json({ error: 'File upload failed' });
    }

    try {
      await run(); // Run the data ingestion process

      return res
        .status(200)
        .json({ message: 'File uploaded and ingested successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Data ingestion failed' });
    }
  });
};

export default uploadHandler;