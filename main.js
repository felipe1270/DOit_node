
const express = require('express')
const path = require('path');
const multer = require('multer');



const server = express()
server.use(express.json())
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cors = require('cors');
server.use(cors()); 


server.post('/HTMLtoPDF', upload.single('htmlFile'), async (req, res) => {
  const htmlContent = req.file.buffer.toString('utf-8');
  const fs = require('fs');
  const html_to_pdf = require('html-pdf-node');

  let options = {
    format: 'A4',
    printBackground: true,
    pageRanges: '1',
  };

  const pdfFileName = 'boleto.pdf';
  const filePath = path.resolve(__dirname, pdfFileName);

  let file = { content: htmlContent };

  try {
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    fs.writeFileSync(filePath, pdfBuffer);

    console.log('pdf gerado!!');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=boleto2.pdf');

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);

    fileStream.on('finish', () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao gerar o arquivo PDF' });
  }
});




const fs = require('fs');

server.listen(process.env.PORT || 6969)