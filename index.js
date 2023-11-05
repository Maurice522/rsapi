const express = require('express');
const bodyParser = require('body-parser');
const extractTextFromPDF = require('./pdf');
const responsecreate = require('./parse');
const resume =require("./aicontent");
var cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/extract', async (req, res) => {
  try {
    const data = req.body;
    const pdf_url = data.pdf_url;

    if (!pdf_url) {
      return res.status(400).json({ error: 'PDF URL is missing' });
    }

    const pdfText = await extractTextFromPDF(pdf_url);
    const openAIResponse = await responsecreate(pdfText);

    if (openAIResponse) {
      return res.status(200).json(openAIResponse);
    } else {
      return res.status(500).json({ error: 'Error processing data' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/openai", (req,res)=>{
  res.send(process.env.OPENAI_API_KEY)
})

app.post('/text', async (req, res) => {
  try {
    const data = req.body;
    const pdf_url = data.pdf_url;

    if (!pdf_url) {
      return res.status(400).json({ error: 'PDF URL is missing' });
    }

    const pdfText = await extractTextFromPDF(pdf_url);

    return res.status(200).json(pdfText);
  
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/", (req,res)=>{
  res.send("working");
})

app.post('/return', async (req, res) => {
    try {
      const data = req.body;
      const des= data.description
      const title= data.title
      const details= data.details
      
  
      if (!data) {
        return res.status(400).json({ error: 'content missing' });
      }
  
      
      const openAIResponse = await resume(des,title,details);
  
      if (openAIResponse) {
        return res.status(200).json(openAIResponse);
      } else {
        return res.status(500).json({ error: 'Error processing data' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
