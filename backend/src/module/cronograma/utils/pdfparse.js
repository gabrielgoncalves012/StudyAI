import { PDFParse } from 'pdf-parse';


async function extractTextFromPDF(filePath) {

    if (!filePath) {
        throw new Error('File path is required');
    }

    // if (typeof filePath !== 'string') {
        
    //     if (!filePath.startsWith('https://')) {
            
    //         const pdfParse = new PDFParse({url: filePath, verbosity: 0});
    //         return (await pdfParse.getText()).text;

    //     }

    // }
    
    const pdfParse = new PDFParse({data: filePath, verbosity: 0});
    return (await pdfParse.getText()).text;
}

export { extractTextFromPDF };