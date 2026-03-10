import { PDFParse } from 'pdf-parse';
import axios from 'axios';

async function extractTextFromPDF(filePath, url) {

    if (!filePath && !url) {
        throw new Error('File path is required');
    }

    if (url != null && url != undefined) {
        if (!url.startsWith('https://')) {
            throw new Error('Invalid URL format. Must start with "https://"');
        }

        try {

          const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer',
            timeout: 30000, // 30 segundos
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/pdf, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
              'Referer': 'https://www.bb.com.br/',
              'Origin': 'https://www.bb.com.br'
            },
            maxRedirects: 5,
            validateStatus: function (status) {
              return status >= 200 && status < 300; // Aceita apenas status 2xx
            }
          });

          const pdfParse = new PDFParse({data: response.data, verbosity: 0});
          return (await pdfParse.getText()).text;
        } catch (error) {
          return {
            error: 'Failed to fetch PDF from URL',
            info: 'Existem links protejidos que exigem autenticação para serem abertos. Por favor, envie o arquivo PDF diretamente para o sistema.',
            details: error.message
          }
        }
    
    }
    
    const pdfParse = new PDFParse({data: filePath, verbosity: 0});
    return (await pdfParse.getText()).text;
}

export { extractTextFromPDF };